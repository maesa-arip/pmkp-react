<?php

namespace App\Services;

use App\Models\RiskRegister;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class RiskRegisterYearCopyService
{
    private const PRIORITY_CODES = [
        'clinical' => [14, 15, 23, 24, 25, 31, 32, 33, 34, 35, 41, 42, 43, 44, 45, 51, 52, 53, 54, 55],
        'non_clinical' => [15, 23, 24, 25, 32, 33, 34, 35, 42, 43, 44, 45, 51, 52, 53, 54, 55],
        'bpkp' => [24, 25, 33, 34, 35, 42, 43, 44, 45, 51, 52, 53, 54, 55],
    ];

    public function preview(array $filters): array
    {
        return $this->process($filters, false, false);
    }

    public function previewUnit(array $filters): array
    {
        return $this->process($filters, true, false);
    }

    public function copy(array|int $filters, ?int $targetYear = null, ?int $typeId = null): array
    {
        if (is_int($filters)) {
            $filters = ['source_year' => $filters, 'target_year' => $targetYear, 'tipe_id' => $typeId];
        }

        return $this->process($filters, false, true);
    }

    public function copyUnit(array $filters): array
    {
        return $this->process($filters, true, true);
    }

    private function process(array $filters, bool $unit, bool $execute): array
    {
        $sourceYear = (int) $filters['source_year'];
        $targetYear = (int) $filters['target_year'];
        $result = ['source_year' => $sourceYear, 'target_year' => $targetYear, 'source_total' => 0,
            'already_copied' => 0, 'equivalent_target' => 0, 'eligible' => 0, 'unmapped' => 0,
            'unit_mismatch' => 0, 'blocked' => [], 'copied' => 0, 'skipped' => 0, 'type' => 'success'];
        $period = \App\Models\PeriodeKinerja::where('tahun', $targetYear)->first();
        $error = ! $period || $period->status !== 'aktif' ? 'Siapkan dan aktifkan indikator tahun tujuan terlebih dahulu.' : null;
        if (! $unit && $targetYear <= $sourceYear) {
            $error = 'Tahun tujuan harus lebih besar dari tahun sumber.';
        }
        if ($unit) {
            if (empty($filters['source_pic_id']) || empty($filters['target_pic_id']) || empty($filters['target_user_id'])) {
                $error = 'Pilih unit sumber, unit tujuan, dan user tujuan.';
            } elseif ((int) $filters['source_pic_id'] === (int) $filters['target_pic_id']) {
                $error = 'Unit sumber dan tujuan harus berbeda.';
            } elseif ((int) \App\Models\User::whereKey($filters['target_user_id'])->value('pic_id') !== (int) $filters['target_pic_id']) {
                $error = 'User tujuan harus sesuai dengan unit tujuan.';
            }
        }
        if ($error) {
            return array_merge($result, ['message' => $error, 'period_error' => $error, 'type' => 'error']);
        }
        $run = function () use ($filters, $unit, $execute, $period, $sourceYear, $targetYear, &$result) {
            if ($execute) {
                \App\Models\PeriodeKinerja::whereKey($period->id)->lockForUpdate()->firstOrFail()->assertWritable();
            }
            $service = app(AnnualIndicatorService::class);
            $query = $this->buildSourceQuery($filters);
            if ($execute) {
                $query->lockForUpdate();
            }
            $query->chunkById(100, function ($risks) use ($filters, $unit, $execute, $period, $sourceYear, $targetYear, $service, &$result) {
                foreach ($risks as $risk) {
                    $result['source_total']++;
                    $already = RiskRegister::withTrashed()->where('copied_from_risk_register_id', $risk->id)->where('copied_to_year', $targetYear);
                    if ($unit) {
                        $already->where('copy_type', 'unit')->where('copied_to_pic_id', $filters['target_pic_id']);
                    } else {
                        $already->where(function ($q) {
                        $q->where('copy_type', 'year')->orWhereNull('copy_type');
                        });
                    }
                    if ($already->exists()) {
                        $result['already_copied']++;

                        continue;
                    }
                    $indicator = $service->resolve($risk->indikator_fitur4_id, $period->id);
                    $pics = $unit ? [(int) $filters['target_pic_id']] : AnnualIndicatorService::ids($risk->pic_id);
                    $reason = ! $indicator ? 'unmapped' : (! $service->acceptsPics($indicator, $pics) ? 'unit_mismatch' : null);
                    if ($reason) {
                        $result[$reason]++;
                        if (count($result['blocked']) < 100) {
                            $result['blocked'][] = ['id' => $risk->id, 'kode' => $risk->kode_risiko,
                                'indicator_id' => $risk->indikator_fitur4_id, 'reason' => $reason === 'unmapped' ? 'Belum ada indikator aktif yang dipetakan' : 'Indikator tidak berlaku untuk unit tujuan'];
                        }

                        continue;
                    }
                    // Text similarity is advisory; it is not a unique risk identity.
                    if (RiskRegister::whereYear('tgl_register', $targetYear)->where('indikator_fitur4_id', $indicator->id)
                        ->where('user_id', $unit ? $filters['target_user_id'] : $risk->user_id)
                        ->where('tipe_id', $risk->tipe_id)->where('pernyataan_risiko', $risk->pernyataan_risiko)->exists()) {
                        $result['equivalent_target']++;
                    }
                    $result['eligible']++;
                    if (! $execute) {
                        continue;
                    }
                    $copy = $risk->replicate(['kode_risiko', 'created_at', 'updated_at', 'deleted_at', 'copy_key', 'indikator_snapshot']);
                    $date = Carbon::parse($risk->tgl_register)->addYearsNoOverflow($targetYear - $sourceYear);
                    $copy->tgl_register = $date;
                    $copy->tgl_selesai = $date->copy()->addDays((int) $risk->target_waktu);
                    $copy->indikator_fitur4_id = $indicator->id;
                    $copy->periode_kinerja_id = $period->id;
                    $copy->currently_id = 2;
                    $copy->is_risiko_lama = 1;
                    $copy->needs_review = true;
                    $copy->copied_from_risk_register_id = $risk->id;
                    $copy->copied_from_year = $sourceYear;
                    $copy->copied_to_year = $targetYear;
                    $copy->copied_by_user_id = auth()->id();
                    $copy->copied_at = now();
                    $copy->copy_type = $unit ? 'unit' : 'year';
                    $copy->copied_to_pic_id = $unit ? (int) $filters['target_pic_id'] : null;
                    $copy->copied_to_user_id = $unit ? (int) $filters['target_user_id'] : null;
                    $copy->copy_key = hash('sha256', implode(':', [$risk->id, $period->id, $copy->copy_type, $unit ? $filters['target_pic_id'] : 'source']));
                    if ($unit) {
                        $copy->pic_id = json_encode($pics);
                        $copy->user_id = $filters['target_user_id'];
                    }
                    foreach (array_keys($copy->getAttributes()) as $field) {
                        if (preg_match('/^(osd[1-4]_|concatdp[1-4]$|grading[12]$)/', $field)
                            || in_array($field, ['efektif_id', 'perlu_penanganan_id', 'num', 'denum', 'waktudenumnum', 'output', 'dokumen_pendukung', 'kendala', 'waktu_implementasi_id', 'realisasi_id', 'belum_tertangani', 'usulan_perbaikan', 'kronologi'])) {
                            $copy->$field = null;
                        }
                    }
                    $copy->save();
                    $prefix = (int) $copy->risk_category_id === 5 ? 'RSO' : 'ROO';
                    $copy->kode_risiko = $prefix.'.'.$date->format('y').'.02.43.'.$copy->id;
                    $copy->save();
                    \App\Models\RiskRegisterHistory::recordForRisk($copy, \App\Models\RiskRegisterHistory::EVENT_COPIED_FROM_PREVIOUS_YEAR, null,
                        ['source_indicator_id' => $risk->indikator_fitur4_id, 'target_indicator_id' => $indicator->id, 'needs_review' => true]);
                    $result['copied']++;
                }
            });
        };
        if ($execute) {
            DB::transaction($run, 3);
        } else {
            $run();
        }
        $result['skipped'] = $result['source_total'] - $result['copied'];
        $result['message'] = "{$result['copied']} risiko disalin; {$result['already_copied']} sudah disalin; ".($result['unmapped'] + $result['unit_mismatch']).' perlu pemetaan indikator/unit.';

        return $result;
    }

    private function buildSourceQuery(array $filters): Builder
    {
        $query = RiskRegister::query()
            ->whereYear('tgl_register', (int) $filters['source_year'])
            ->whereNull('deleted_at');

        foreach ([
            'tipe_id',
            'currently_id',
            'user_id',
            'risk_category_id',
            'risk_type_id',
            'risk_variety_id',
            'identification_source_id',
        ] as $field) {
            if (! empty($filters[$field])) {
                $query->where($field, (int) $filters[$field]);
            }
        }

        if (! empty($filters['pic_id'])) {
            $query->whereJsonContains('pic_id', (int) $filters['pic_id']);
        }

        if (! empty($filters['source_pic_id'])) {
            $query->whereJsonContains('pic_id', (int) $filters['source_pic_id']);
        }

        if (($filters['priority_scope'] ?? 'all') !== 'all') {
            $priorityCodes = $this->priorityCodes($filters['priority_scope'], $filters['tipe_id'] ?? null);

            if ($priorityCodes) {
                $query->whereIn('concatdp1', $priorityCodes);
            }
        }

        if (! auth()->user()->can('lihat data semua risk register')) {
            $query->where('user_id', auth()->id());
        }

        return $query;
    }

    private function priorityCodes(string $priorityScope, mixed $typeId = null): array
    {
        if ($priorityScope === 'bpkp') {
            return self::PRIORITY_CODES['bpkp'];
        }

        if ((int) $typeId === 2) {
            return self::PRIORITY_CODES['non_clinical'];
        }

        return self::PRIORITY_CODES['clinical'];
    }
}
