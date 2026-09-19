<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use RuntimeException;

/**
 * Level-four indicators are permanent masters (periode_kinerja_id null). A row with a
 * period is that master's placement in the year: parent, active flag, order and code.
 * Transactions (risk registers, MUTU dictionaries) always store the master ID.
 */
class Fitur4Master
{
    /** Attributes that belong to the master and are identical in every year. */
    public const SHARED = ['name', 'tujuan', 'location_id', 'penanggung_jawab_id', 'jabatan'];

    public static function masterId(int $id): ?int
    {
        $row = DB::table('indikator_fitur4s')->find($id);
        if (! $row) {
            return null;
        }

        if ($row->periode_kinerja_id && ! $row->master_id) {
            // Rows inserted outside the editor (imports, fixtures) get their master on first use.
            self::ensureAll();
            $row = DB::table('indikator_fitur4s')->find($id);
        }

        return $row->periode_kinerja_id ? (int) $row->master_id : (int) $row->id;
    }

    /** The master's placement in a period, or null when it is not linked that year. */
    public static function placement(int $masterId, int $periodId): ?object
    {
        return DB::table('indikator_fitur4s')->where('periode_kinerja_id', $periodId)->where('master_id', $masterId)->first();
    }

    /** Create masters for period rows that do not have one yet. Returns the number created. */
    public static function ensureAll(bool $activeMasters = true): int
    {
        $created = 0;
        foreach (DB::table('indikator_fitur4s')->whereNotNull('periode_kinerja_id')->whereNull('master_id')->orderBy('id')->get() as $row) {
            $source = $row->copied_from_id ? DB::table('indikator_fitur4s')->find($row->copied_from_id) : null;
            // Copies of a legacy master keep that master; copies of a placement share its master.
            $masterId = $source ? ($source->periode_kinerja_id ? $source->master_id : $source->id) : null;
            if ($masterId) {
                $master = DB::table('indikator_fitur4s')->find($masterId);
                foreach (['name', 'location_id'] as $column) {
                    if ((string) $master->$column !== (string) $row->$column) {
                        throw new RuntimeException("Fitur 4 #{$row->id} berbeda {$column} dari master #{$masterId}; tautkan manual.");
                    }
                }
            } else {
                $data = (array) $row;
                unset($data['id']);
                $data['periode_kinerja_id'] = null;
                $data['master_id'] = null;
                $data['lineage_id'] = null;
                $data['copied_from_id'] = null;
                $data['is_active'] = $activeMasters && $row->is_active;
                $data['created_at'] = $data['updated_at'] = now();
                $masterId = DB::table('indikator_fitur4s')->insertGetId($data);
                $created++;
            }
            DB::table('indikator_fitur4s')->where('id', $row->id)->update(['master_id' => $masterId]);
        }

        return $created;
    }

    /** Push shared attributes from an edited placement to its master and every other year. */
    public static function syncFromPlacement(int $placementId): void
    {
        self::ensureAll();
        $row = DB::table('indikator_fitur4s')->find($placementId);
        if (! $row || ! $row->master_id) {
            return;
        }
        $shared = array_intersect_key((array) $row, array_flip(self::SHARED));
        DB::table('indikator_fitur4s')->where(fn ($q) => $q->where('id', $row->master_id)->orWhere('master_id', $row->master_id))
            ->where('id', '<>', $row->id)->update($shared + ['updated_at' => now()]);
    }

    /**
     * Link every active master that is not yet placed in the period. New placements have
     * no parent until they are positioned under a level-three activity in /kinerja.
     */
    public static function linkMasters(int $periodId): int
    {
        self::ensureAll();
        $linked = 0;
        $placed = DB::table('indikator_fitur4s')->where('periode_kinerja_id', $periodId)->whereNotNull('master_id')->pluck('master_id')->all();
        $masters = DB::table('indikator_fitur4s')->whereNull('periode_kinerja_id')->where('is_active', true)->whereNotIn('id', $placed)->orderBy('id')->get();
        foreach ($masters as $master) {
            $data = array_intersect_key((array) $master, array_flip(self::SHARED));
            DB::table('indikator_fitur4s')->insert($data + [
                'periode_kinerja_id' => $periodId, 'master_id' => $master->id, 'indikator_fitur3_id' => null,
                'sasaran_strategis_id' => null, 'is_active' => true, 'sort_order' => $master->sort_order,
                'lineage_id' => $master->lineage_id, 'copied_from_id' => $master->id,
                'created_at' => now(), 'updated_at' => now(),
            ]);
            $linked++;
        }

        return $linked;
    }
}
