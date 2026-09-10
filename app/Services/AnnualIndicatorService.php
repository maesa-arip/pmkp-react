<?php

namespace App\Services;

use App\Models\PeriodeKinerja;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AnnualIndicatorService
{
    public const TABLES = [
        'sasaran' => 'sasaran_strategis', '1' => 'indikator_fitur1s',
        '2' => 'indikator_fitur2s', '3' => 'indikator_fitur3s',
        '4' => 'indikator_fitur4s', '04' => 'indikator_fitur04s',
    ];

    public const PARENTS = [
        'indikator_fitur1s' => null,
        'indikator_fitur2s' => ['indikator_fitur1_id', 'indikator_fitur1s'],
        'indikator_fitur3s' => ['indikator_fitur2_id', 'indikator_fitur2s'],
        'indikator_fitur4s' => ['indikator_fitur3_id', 'indikator_fitur3s'],
        'indikator_fitur04s' => ['indikator_fitur4_id', 'indikator_fitur4s'],
    ];

    public function copyHierarchy(?int $sourcePeriod, PeriodeKinerja $target): void
    {
        DB::transaction(function () use ($sourcePeriod, $target) {
            $locked = PeriodeKinerja::whereKey($target->id)->lockForUpdate()->firstOrFail();
            if ($locked->status !== 'draft' || $sourcePeriod === $target->id) {
                throw ValidationException::withMessages(['tahun' => 'Copy hierarki hanya ke periode draft yang berbeda.']);
            }
            $maps = [];
            foreach (self::TABLES as $table) {
                if (! Schema::hasTable($table)) {
                    continue;
                }
                $rows = DB::table($table)->where('periode_kinerja_id', $sourcePeriod)->orderBy('id')->get();
                if ($sourcePeriod === null && $table === 'sasaran_strategis') {
                    $orphans = $rows->filter(fn ($row) => ! empty($row->parent_id) && ! $rows->contains('id', $row->parent_id))->pluck('id')->values()->all();
                    $locked->update(['reconstruction_notes' => [
                        'orphan_sasaran_ids' => $orphans,
                        'note' => 'Parent sasaran lama yang tidak ditemukan dipertahankan pada sumber. Versi rekonstruksi ditempatkan sementara sebagai akar dan perlu verifikasi.',
                    ]]);
                }
                $pending = $rows->keyBy('id')->all();
                while ($pending) {
                    $progress = false;
                    foreach ($pending as $id => $row) {
                        // Legacy orphan parents cannot be reconstructed by guessing an ID.
                        // Keep their original parent in the untouched source and make the
                        // reconstructed copy a root, with the period marked as reconstructed.
                        if ($sourcePeriod === null && $table === 'sasaran_strategis' && ! empty($row->parent_id) && ! $rows->contains('id', $row->parent_id)) {
                            $row = clone $row;
                            $row->parent_id = 0;
                        }
                        if ($table === 'sasaran_strategis' && ! empty($row->parent_id) && ! isset($maps[$table][$row->parent_id])) {
                            continue;
                        }
                        $lineage = $row->lineage_id ?: (string) Str::uuid();
                        if (! $row->lineage_id) {
                            DB::table($table)->where('id', $id)->update(['lineage_id' => $lineage]);
                        }
                        $existing = DB::table($table)->where('periode_kinerja_id', $target->id)->where('lineage_id', $lineage)->first();
                        if ($existing) {
                            $maps[$table][$id] = $existing->id;
                        } else {
                            $data = (array) $row;
                            unset($data['id']);
                            $data['periode_kinerja_id'] = $target->id;
                            $data['lineage_id'] = $lineage;
                            $data['copied_from_id'] = $id;
                            $data['created_at'] = $data['updated_at'] = now();
                            if ($table === 'sasaran_strategis' && ! empty($row->parent_id)) {
                                $data['parent_id'] = $maps[$table][$row->parent_id];
                            }
                            foreach (array_filter([self::PARENTS[$table] ?? null, isset($row->sasaran_strategis_id) ? ['sasaran_strategis_id', 'sasaran_strategis'] : null]) as [$column, $parentTable]) {
                                if (! isset($maps[$parentTable][$row->$column])) {
                                    throw ValidationException::withMessages(['hierarki' => "Relasi {$table} #{$id} ke {$parentTable} tidak ditemukan."]);
                                }
                                $data[$column] = $maps[$parentTable][$row->$column];
                            }
                            $maps[$table][$id] = DB::table($table)->insertGetId($data);
                        }
                        unset($pending[$id]);
                        $progress = true;
                    }
                    if (! $progress) {
                        throw ValidationException::withMessages(['hierarki' => 'Parent sasaran putus atau membentuk siklus.']);
                    }
                }
            }
            if ($sourcePeriod !== null && Schema::hasTable('mutu_indikators')) {
                foreach (DB::table('mutu_indikators')->where('periode_kinerja_id', $sourcePeriod)->get() as $master) {
                    if (! isset($maps['indikator_fitur4s'][$master->indikator_fitur4_id])) {
                        continue;
                    }
                    $lineage = $master->lineage_id ?: (string) Str::uuid();
                    if (DB::table('mutu_indikators')->where('periode_kinerja_id', $target->id)->where('lineage_id', $lineage)->exists()) {
                        continue;
                    }
                    $data = (array) $master;
                    unset($data['id']);
                    $data['periode_kinerja_id'] = $target->id;
                    $data['indikator_fitur4_id'] = $maps['indikator_fitur4s'][$master->indikator_fitur4_id];
                    $data['lineage_id'] = $lineage;
                    $data['copied_from_id'] = $master->id;
                    $data['approved'] = 0;
                    $data['created_at'] = $data['updated_at'] = now();
                    DB::table('mutu_indikators')->insert($data);
                }
            }
        });
    }

    public function resolve(int $sourceId, int $targetPeriod): ?object
    {
        $source = DB::table('indikator_fitur4s')->find($sourceId);
        if (! $source) {
            return null;
        }
        $mapped = DB::table('indikator_year_mappings')->where('source_indicator_id', $sourceId)->where('target_period_id', $targetPeriod)->value('target_indicator_id');
        $query = DB::table('indikator_fitur4s')->where('periode_kinerja_id', $targetPeriod)->where('is_active', true);
        if ($mapped) {
            return $query->where('id', $mapped)->first();
        }
        if (! $source->lineage_id) {
            return null;
        }

        return $query->where('lineage_id', $source->lineage_id)->first();
    }

    public function acceptsPics(object $indicator, array $picIds): bool
    {
        $locations = array_map('intval', (array) (is_string($indicator->location_id) ? json_decode($indicator->location_id, true) : $indicator->location_id));
        if (in_array(0, $locations, true)) {
            return true;
        }
        if (! $picIds || in_array(0, $picIds, true)) {
            return false;
        }
        $pics = DB::table('pics')->whereIn('id', $picIds)->pluck('location_id', 'id');

        return $pics->count() === count(array_unique($picIds)) && $pics->every(fn ($id) => in_array((int) $id, $locations, true));
    }

    public static function ids($value): array
    {
        if (is_string($value)) {
            $value = json_decode($value, true) ?? explode(',', trim($value, '[]"'));
        }

        return array_values(array_unique(array_map('intval', (array) $value)));
    }

    public function snapshot(int $indicatorId): array
    {
        $result = [];
        $table = 'indikator_fitur4s';
        $id = $indicatorId;
        while ($table && $id) {
            $row = DB::table($table)->find($id);
            if (! $row) {
                break;
            }
            $result[$table] = (array) $row;
            [$column, $table] = self::PARENTS[$table] ?? [null, null];
            $id = $column ? $row->$column : null;
        }
        $sasaranId = $result['indikator_fitur4s']['sasaran_strategis_id'] ?? null;
        if ($sasaranId) {
            $result['sasaran'] = (array) DB::table('sasaran_strategis')->find($sasaranId);
        }

        return $result;
    }
}
