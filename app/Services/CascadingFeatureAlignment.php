<?php

namespace App\Services;

use App\Models\PeriodeKinerja;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use RuntimeException;

class CascadingFeatureAlignment
{
    public function apply(int $year): array
    {
        return DB::transaction(function () use ($year) {
            $period = PeriodeKinerja::where('tahun', $year)->lockForUpdate()->firstOrFail();
            if ((int) $period->feature_schema_version === 2) {
                return ['already_aligned' => true, 'period_id' => $period->id];
            }
            if ($period->status !== 'draft') {
                throw new RuntimeException('Penyelarasan hanya untuk periode draft.');
            }
            $nodes = collect(app(CascadingConceptService::class)->rows($period->id))->keyBy('id');
            if ($nodes->count() !== 438) {
                throw new RuntimeException('Sumber lengkap 438 konsep diperlukan.');
            }
            $old = [];
            foreach (AnnualIndicatorService::TABLES as $t) {
                $old[$t] = DB::table($t)->where('periode_kinerja_id', $period->id)->get()->all();
            }
            $oldIds = [];
            foreach ($old as $t => $rows) {
                $oldIds[$t] = array_column($rows, 'id');
            }
            $columns = DB::table('information_schema.columns')->where('TABLE_SCHEMA', DB::connection()->getDatabaseName())
             ->whereIn('COLUMN_NAME', ['indikator_fitur1_id', 'indikator_fitur2_id', 'indikator_fitur4_id', 'sasaran_strategis_id'])->get(['TABLE_NAME', 'COLUMN_NAME']);
            foreach ($columns as $c) {
                $source = $c->COLUMN_NAME === 'sasaran_strategis_id' ? 'sasaran_strategis' : str_replace('_id', 's', $c->COLUMN_NAME);
                $query = DB::table($c->TABLE_NAME)->whereIn($c->COLUMN_NAME, $oldIds[$source]);
                if (in_array($c->TABLE_NAME, array_keys($old), true)) {
                    $query->whereNotIn('id', $oldIds[$c->TABLE_NAME]);
                }
                if ($query->exists()) {
                    throw new RuntimeException('Masih dipakai oleh '.$c->TABLE_NAME.'.'.$c->COLUMN_NAME);
                }
            }
            if (DB::table('indikator_year_mappings')->whereIn('source_indicator_id', $oldIds['indikator_fitur4s'])->orWhereIn('target_indicator_id', $oldIds['indikator_fitur4s'])->exists()) {
                throw new RuntimeException('Indikator sudah dipakai pemetaan tahun.');
            }
            foreach (['indikator_fitur1s', 'indikator_fitur2s', 'indikator_fitur4s', 'sasaran_strategis'] as $t) {
                if (DB::table($t)->where('periode_kinerja_id', '<>', $period->id)->whereIn('copied_from_id', $oldIds[$t])->exists()) {
                    throw new RuntimeException('Indikator sudah disalin ke periode lain.');
                }
            }
            if (count($old['indikator_fitur04s'])) {
                throw new RuntimeException('Fitur 04 masih terhubung.');
            }
            $backup = storage_path('app/cascading-import-backups/'.$year.'-features-'.now()->format('Ymd-His').'-'.bin2hex(random_bytes(3)).'.json');
            File::ensureDirectoryExists(dirname($backup));
            File::put($backup, json_encode(['period' => $period->toArray(), 'tables' => $old, 'concepts' => $nodes->values()->all(), 'template' => DB::table('cascading_workbook_templates')->where('periode_kinerja_id', $period->id)->first()], JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE));
            $ids = [];
            $goalIds = [];
            $pending = [];
            foreach ($nodes as $n) {
                if ($n['kind'] === 'sasaran_strategis') {
                    $ids[$n['id']] = $n['legacy_id'];
                    $goalIds[] = $n['legacy_id'];
                }
            }
            $oldById = [];
            foreach ($old as $t => $rows) {
                $oldById[$t] = array_column(array_map(fn ($r) => (array) $r, $rows), null, 'id');
            }
            $link = function ($node, $table, $id) use (&$ids) {
            $ids[$node['id']] = $id;
            DB::table('cascading_concepts')->where('id', $node['id'])->update(['legacy_table' => $table, 'legacy_id' => $id, 'updated_at' => now()]);
            };
            foreach ([1, 2, 3, 4] as $level) {
                foreach ($nodes as $node) {
                    $belongs = match ($level) {
                        1 => $node['kind'] === 'iku',2 => $node['tier'] === 'wadir' && $node['kind'] === 'kegiatan',3 => $node['tier'] === 'kabag_kabid' && $node['kind'] === 'kegiatan',4 => $node['kind'] === 'indikator_mutu'
                    };
                    if (! $belongs) {
                        continue;
                    }
                    $parent = $nodes[$node['parent_id']] ?? null;
                    if ($level === 4) {
                        $visited = [];
                        while ($parent && ! ($parent['tier'] === 'kabag_kabid' && $parent['kind'] === 'kegiatan')) {
                            if (isset($visited[$parent['id']])) {
                                throw new RuntimeException('Siklus induk mutu.');
                            }$visited[$parent['id']] = true;
                            $parent = $nodes[$parent['parent_id']] ?? null;
                        }
                    }
                    if (! $parent || ! isset($ids[$parent['id']])) {
                        throw new RuntimeException('Induk fitur '.$level.' tidak ditemukan: '.$node['name']);
                    }
                    $goal = $parent;
                    $visited = [];
                    while ($goal['kind'] !== 'sasaran_strategis') {
                        if (isset($visited[$goal['id']])) {
                            throw new RuntimeException('Siklus sasaran.');
                        }$visited[$goal['id']] = true;
                        $goal = $nodes[$goal['parent_id']] ?? null;
                        if (! $goal) {
                            throw new RuntimeException('Sasaran tidak ditemukan.');
                        }
                    }
                    $prior = $node['legacy_table'] ? ($oldById[$node['legacy_table']][$node['legacy_id']] ?? []) : [];
                    $data = ['name' => $node['name'], 'tujuan' => '', 'periode_kinerja_id' => $period->id, 'sasaran_strategis_id' => $ids[$goal['id']],
                        'lineage_id' => $prior['lineage_id'] ?? (string) Str::uuid(), 'is_active' => $node['is_active'], 'sort_order' => $node['sort_order'],
                        'kode_cascading' => $node['code'], 'jabatan' => $node['office'], 'penanggung_jawab_id' => $prior['penanggung_jawab_id'] ?? null, 'created_at' => now(), 'updated_at' => now()];
                    if ($level > 1) {
                        $data['indikator_fitur'.($level - 1).'_id'] = $ids[$parent['id']];
                    }
                    if ($level === 1) {
                        $data['penanggung_jawab_id'] = DB::table('kinerja_penanggung_jawabs')->where('name', 'DIREKTUR')->value('id');
                    }
                    if ($level === 4) {
                        $data['penanggung_jawab_id'] = $oldById['indikator_fitur3s'][$parent['legacy_id']]['penanggung_jawab_id'] ?? null;
                        $locations = $this->ownerLocations($node['office']);
                        if (! $locations) {
                            $pending[$node['office']] = ($pending[$node['office']] ?? 0) + 1;
                        }
                        $data['location_id'] = json_encode($locations);
                    }
                    $table = 'indikator_fitur'.$level.'s';
                    if ($level === 3) {
                        $id = $node['legacy_id'];
                        unset($data['created_at']);
                        DB::table($table)->where('id', $id)->where('periode_kinerja_id', $period->id)->update($data);
                    } else {
                        $id = DB::table($table)->insertGetId($data);
                    }
                    $link($node, $table, $id);
                }
            }
            foreach ($nodes as $node) {
                if ($node['kind'] === 'indikator_kinerja' && in_array($node['tier'], ['wadir', 'kabag_kabid'], true)) {
                    $level = $node['tier'] === 'wadir' ? 2 : 3;
                    $id = DB::table('indikator_kinerjas')->insertGetId(['periode_kinerja_id' => $period->id, 'indikator_fitur'.$level.'_id' => $ids[$node['parent_id']],
                        'name' => $node['name'], 'kode_cascading' => $node['code'], 'jabatan' => $node['office'], 'is_active' => $node['is_active'], 'sort_order' => $node['sort_order'],
                        'lineage_id' => (string) Str::uuid(), 'created_at' => now(), 'updated_at' => now()]);
                    $link($node, 'indikator_kinerjas', $id);
                }
            }
            foreach (['indikator_fitur4s', 'indikator_fitur2s', 'indikator_fitur1s'] as $t) {
                DB::table($t)->whereIn('id', $oldIds[$t])->where('periode_kinerja_id', $period->id)->delete();
            }
            DB::table('sasaran_strategis')->whereIn('id', array_diff($oldIds['sasaran_strategis'], $goalIds))->where('periode_kinerja_id', $period->id)->delete();
            $period->update(['feature_schema_version' => 2]);

            return ['period_id' => $period->id, 'features' => [1 => 3, 2 => 9, 3 => 19, 4 => 325], 'performance_indicators' => 58, 'pending_owner_mapping' => $pending, 'backup' => $backup];
        });
    }

    public function ownerLocations(string $office): array
    {
        $normalize = fn ($s) => mb_strtoupper(preg_replace('/\s+/u', ' ', trim($s)));
        $names = config('cascading.team_aliases')[$normalize($office)] ?? [$office];
        $ids = [];
        foreach (DB::table('locations')->get(['id', 'name']) as $location) {
            if (in_array($normalize($location->name), array_map($normalize, $names), true)) {
                $ids[] = (int) $location->id;
            }
        }
        if (! $ids && $names) {
            throw new RuntimeException('Nama tim tidak ditemukan pada master: '.$office);
        }

        return $ids;
    }
}
