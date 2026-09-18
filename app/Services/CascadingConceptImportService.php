<?php

namespace App\Services;

use App\Models\PeriodeKinerja;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use RuntimeException;

class CascadingConceptImportService
{
    public function import(string $path, int $year): array
    {
        $plan = app(CascadingConceptParser::class)->parse($path);
        $hash = hash_file('sha256', $path);

        return DB::transaction(function () use ($path, $year, $plan, $hash) {
            $period = PeriodeKinerja::where('tahun', $year)->lockForUpdate()->firstOrFail();
            if ($period->status !== 'draft') {
                throw new RuntimeException('Perbaikan impor hanya untuk periode draft.');
            }
            $template = DB::table('cascading_workbook_templates')->where('periode_kinerja_id', $period->id)->first();
            if (! $template) {
                throw new RuntimeException('Pemetaan impor awal periode tidak ditemukan.');
            }
            if (DB::table('cascading_concepts')->where('periode_kinerja_id', $period->id)->exists()) {
                if ($template->source_sha256 === $hash) {
                    return $this->reconcileHierarchy($period, $template, $plan);
                }
                throw new RuntimeException('Sumber berubah setelah impor konsep; diperlukan rekonsiliasi perubahan.');
            }
            $oldBindings = json_decode($template->bindings, true);
            $legacy = [];
            foreach ($oldBindings as $cell => $b) {
                if ($b['field'] !== 'name') {
                    continue;
                }
                if (! isset($plan['bindings']['cascading'][$cell])) {
                    throw new RuntimeException('Sel lama tidak terpetakan: '.$cell);
                }
                $key = $plan['bindings']['cascading'][$cell]['key'];
                $row = DB::table($b['table'])->where('periode_kinerja_id', $period->id)->where('id', $b['id'])->first();
                if (! $row || (string) $row->name !== (string) $b['initial']) {
                    throw new RuntimeException('Data berubah sejak impor awal: '.$cell);
                }
                $legacy[$key] = ['table' => $b['table'], 'row' => (array) $row];
            }
            $backup = ['period' => $period->toArray(), 'template' => $template, 'legacy' => $legacy];
            File::ensureDirectoryExists(storage_path('app/cascading-import-backups'));
            $backupPath = storage_path('app/cascading-import-backups/'.$year.'-concept-'.now()->format('Ymd-His').'-'.bin2hex(random_bytes(3)).'.json');
            File::put($backupPath, json_encode($backup, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE));
            $ids = [];
            $records = [];
            foreach ($plan['nodes'] as $key => $node) {
                $data = $node;
                unset($data['parent_key']);
                $data['parent_id'] = $node['parent_key'] ? $ids[$node['parent_key']] : null;
                $data['periode_kinerja_id'] = $period->id;
                $data['sort_order'] = count($ids);
                $data['created_at'] = $data['updated_at'] = now();
                if (isset($legacy[$key])) {
                    $link = $legacy[$key];
                    $data['legacy_table'] = $link['table'];
                    $data['legacy_id'] = $link['row']['id'];
                    $update = ['name' => $node['name'], 'kode_cascading' => $node['code'], 'updated_at' => now()];
                    if (array_key_exists('tujuan', $link['row']) && $link['row']['tujuan'] === $link['row']['name']) {
                        $update['tujuan'] = '';
                    }
                    DB::table($link['table'])->where('id', $link['row']['id'])->update($update);
                }
                $ids[$key] = DB::table('cascading_concepts')->insertGetId($data);
                $records[] = $data + ['id' => $ids[$key]];
            }
            $bindings = $plan['bindings'];
            foreach ($bindings as &$cells) {
                foreach ($cells as &$binding) {
                    $binding['id'] = $ids[$binding['key']];
                    unset($binding['key']);
                }
            }
            unset($cells,$binding);
            DB::table('cascading_workbook_templates')->where('id', $template->id)->update([
                'source_name' => basename($path), 'source_sha256' => $hash, 'sheet_name' => 'cascading',
                'workbook_base64' => base64_encode(file_get_contents($path)),
                'bindings' => json_encode($bindings),
                'structure' => json_encode(['concept_version' => 1, 'sheets' => CascadingConceptParser::SHEETS, 'node_ids' => array_values($ids), 'warnings' => $plan['warnings']]),
                'updated_at' => now(),
            ]);

            return ['period_id' => $period->id, 'count' => count($ids), 'kinds' => array_count_values(array_column($records, 'kind')),
                'linked_existing' => count($legacy), 'warnings' => $plan['warnings'], 'review_count' => count(array_filter($records, fn ($r) => ! empty($r['relation_note']))), 'backup' => $backupPath];
        });
    }

    private function reconcileHierarchy($period, $template, array $plan): array
    {
        $rows = DB::table('cascading_concepts')->where('periode_kinerja_id', $period->id)->get()->keyBy(fn ($r) => $r->source_sheet.'!'.$r->source_cell);
        if (count($rows) !== count($plan['nodes']) || array_diff(array_keys($plan['nodes']), $rows->keys()->all())) {
            throw new RuntimeException('Keanggotaan data berubah; koreksi hubungan memerlukan rekonsiliasi sumber.');
        }
        $updates = [];
        foreach ($plan['nodes'] as $key => $node) {
            $row = $rows[$key];
            $next = ['kind' => $node['kind'], 'parent_id' => $node['parent_key'] ? $rows[$node['parent_key']]->id : null, 'relation_note' => $node['relation_note']];
            if ($row->kind !== $next['kind'] || $row->parent_id != $next['parent_id'] || $row->relation_note !== $next['relation_note']) {
                $updates[$row->id] = $next;
            }
        }
        if (! $updates) {
            return ['already_imported' => true, 'period_id' => $period->id];
        }
        $backupPath = storage_path('app/cascading-import-backups/'.$period->tahun.'-relations-'.now()->format('Ymd-His').'-'.bin2hex(random_bytes(3)).'.json');
        File::ensureDirectoryExists(dirname($backupPath));
        File::put($backupPath, json_encode(['period' => $period->toArray(), 'template' => $template, 'concepts' => $rows->values()->all()], JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE));
        foreach ($updates as $id => $next) {
            DB::table('cascading_concepts')->where('id', $id)->where('periode_kinerja_id', $period->id)->update($next + ['updated_at' => now()]);
        }
        $structure = json_decode($template->structure, true);
        $structure['hierarchy_revision'] = 2;
        DB::table('cascading_workbook_templates')->where('id', $template->id)->update(['structure' => json_encode($structure), 'updated_at' => now()]);

        return ['period_id' => $period->id, 'updated_relationships' => count($updates), 'backup' => $backupPath];
    }
}
