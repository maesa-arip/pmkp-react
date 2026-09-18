<?php

namespace App\Services;

use App\Models\PeriodeKinerja;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class DirectorCascadingService
{
    public function nodes($user, PeriodeKinerja $period): array
    {
        $rows = app(CascadingConceptService::class)->rows($period->id);
        $ikuIds = $this->ikuIds($user, $period->id);
        $activities = array_filter($rows, fn ($n) => $n['tier'] === 'direktur' && $n['kind'] === 'kegiatan' && $n['is_active'] && in_array($n['parent_id'], $ikuIds));
        $activityIds = array_column($activities, 'id');

        return array_values(array_filter($rows, fn ($n) => $n['is_active'] && (in_array($n['id'], $ikuIds) || in_array($n['id'], $activityIds) || ($n['tier'] === 'direktur' && $n['kind'] === 'indikator_kinerja' && in_array($n['parent_id'], $activityIds)))));
    }

    private function ikuIds($user, int $period): array
    {
        $query = DB::table('indikator_fitur1s')->where('periode_kinerja_id', $period)->where('is_active', true);
        if (! $user->can('atur data master manajemen risiko') && ! $user->can('atur hak akses')) {
            // A user without a PIC must never inherit unassigned positions.
            if (! $user->pic_id) {
                return [];
            }
            $positions = DB::table('kinerja_penanggung_jawabs')->where('pic_id', $user->pic_id)->where('is_active', true)->pluck('id');
            $query->whereIn('penanggung_jawab_id', $positions);
        }

        return DB::table('cascading_concepts')->where('periode_kinerja_id', $period)->where('kind', 'iku')->where('is_active', true)
            ->where('legacy_table', 'indikator_fitur1s')->whereIn('legacy_id', $query->pluck('id'))->pluck('id')->all();
    }

    public function save($user, PeriodeKinerja $period, array $data, ?int $id = null): void
    {
        DB::transaction(function () use ($user, $period, $data, $id) {
            $period = PeriodeKinerja::whereKey($period->id)->lockForUpdate()->firstOrFail();
            if (! in_array($period->status, ['draft', 'aktif'], true) || (int) $period->feature_schema_version !== 2) {
                throw ValidationException::withMessages(['name' => 'Periode ini tidak dapat diubah.']);
            }
            $nodes = array_column($this->nodes($user, $period), null, 'id');
            $row = $id ? ($nodes[$id] ?? null) : null;
            abort_if($id && (! $row || $row['tier'] !== 'direktur' || $row['kind'] !== $data['kind']), 403);
            $parent = $nodes[$data['parent_id']] ?? null;
            $expectedKind = $data['kind'] === 'kegiatan' ? 'iku' : 'kegiatan';
            if (! $parent || $parent['kind'] !== $expectedKind) {
                throw ValidationException::withMessages(['parent_id' => 'Pilih induk yang menjadi tanggung jawab Anda pada tahun ini.']);
            }
            $values = ['name' => trim($data['name']), 'code' => trim($data['code'] ?? '') ?: null, 'parent_id' => $parent['id'], 'updated_at' => now()];
            if ($values['name'] === '') {
                throw ValidationException::withMessages(['name' => 'Uraian wajib diisi.']);
            }
            if ($id) {
                DB::table('cascading_concepts')->where('id', $id)->update($values);
            } else {
                $order = (int) DB::table('cascading_concepts')->where('periode_kinerja_id', $period->id)->max('sort_order') + 1;
                $id = DB::table('cascading_concepts')->insertGetId($values + [
                    'periode_kinerja_id' => $period->id, 'kind' => $data['kind'], 'tier' => 'direktur', 'office' => 'DIREKTUR',
                    'source_sheet' => 'INPUT', 'source_cell' => 'D'.$order, 'sort_order' => $order, 'is_active' => true, 'created_at' => now(),
                ]);
            }
            activity('indikator_tahunan')->performedOn($period)->causedBy($user)
                ->withProperties(['concept_id' => $id, 'old' => $row, 'new' => $values])->log('Kegiatan / indikator kinerja Direktur disimpan');
        });
    }
}
