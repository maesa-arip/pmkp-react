<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class OperationalConceptLink
{
    public function sync(int $period, string $table, int $id, string $parentTable, int $parentId, string $kind, string $tier): void
    {
        if (! DB::table('cascading_concepts')->where('periode_kinerja_id', $period)->exists()) {
            return;
        }
        $row = DB::table($table)->where('periode_kinerja_id', $period)->where('id', $id)->first();
        $existing = DB::table('cascading_concepts')->where('periode_kinerja_id', $period)->where('legacy_table', $table)->where('legacy_id', $id)->first();
        $data = ['name' => $row->name, 'code' => $row->kode_cascading, 'is_active' => $row->is_active, 'updated_at' => now()];
        $parent = DB::table('cascading_concepts')->where('periode_kinerja_id', $period)->where('legacy_table', $parentTable)->where('legacy_id', $parentId)->value('id');
        if (! $parent && $parentTable === 'sasaran_strategis') {
            $goal = DB::table('sasaran_strategis')->where('id', $parentId)->where('periode_kinerja_id', $period)->first();
            abort_unless($goal, 404);
            $parent = DB::table('cascading_concepts')->insertGetId([
                'periode_kinerja_id' => $period, 'parent_id' => DB::table('cascading_concepts')->where('periode_kinerja_id', $period)->where('kind', 'tujuan_strategis')->value('id'),
                'kind' => 'sasaran_strategis', 'tier' => 'organisasi', 'office' => 'DIREKTUR',
                'name' => $goal->name, 'code' => $goal->kode_cascading, 'is_active' => $goal->is_active,
                'legacy_table' => $parentTable, 'legacy_id' => $parentId, 'source_sheet' => 'INPUT', 'source_cell' => 'S'.$parentId,
                'sort_order' => DB::table('cascading_concepts')->where('periode_kinerja_id', $period)->max('sort_order') + 1,
                'created_at' => now(), 'updated_at' => now(),
            ]);
        }
        if ($existing) {
            if ($existing->source_sheet === 'INPUT') {
                $data += ['parent_id' => $parent, 'office' => $row->jabatan ?? '', 'tier' => $tier];
            }
            DB::table('cascading_concepts')->where('id', $existing->id)->update($data);

            return;
        }
        DB::table('cascading_concepts')->insert($data + ['periode_kinerja_id' => $period, 'parent_id' => $parent, 'kind' => $kind, 'tier' => $tier, 'office' => $row->jabatan ?? '',
            'legacy_table' => $table, 'legacy_id' => $id, 'source_sheet' => 'INPUT', 'source_cell' => ($table === 'indikator_kinerjas' ? 'K' : 'F'.preg_replace('/\D/', '', $table)).$id,
            'sort_order' => DB::table('cascading_concepts')->where('periode_kinerja_id', $period)->max('sort_order') + 1, 'created_at' => now()]);
    }
}
