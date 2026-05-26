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
        $sourceYear = (int) $filters['source_year'];
        $targetYear = (int) $filters['target_year'];

        $total = 0;
        $alreadyCopied = 0;
        $equivalent = 0;
        $eligible = 0;

        $this->buildSourceQuery($filters)
            ->chunkById(100, function ($risks) use ($targetYear, &$total, &$alreadyCopied, &$equivalent, &$eligible) {
                foreach ($risks as $risk) {
                    $total++;

                    if ($this->alreadyCopied($risk, $targetYear)) {
                        $alreadyCopied++;
                        continue;
                    }

                    if ($this->hasEquivalentTargetRisk($risk, $targetYear)) {
                        $equivalent++;
                        continue;
                    }

                    $eligible++;
                }
            });

        return [
            'source_year' => $sourceYear,
            'target_year' => $targetYear,
            'source_total' => $total,
            'already_copied' => $alreadyCopied,
            'equivalent_target' => $equivalent,
            'eligible' => $eligible,
        ];
    }

    public function copy(array|int $filters, ?int $targetYear = null, ?int $typeId = null): array
    {
        if (is_int($filters)) {
            $filters = [
                'source_year' => $filters,
                'target_year' => $targetYear,
                'type_id' => $typeId,
            ];
        }

        $sourceYear = (int) $filters['source_year'];
        $targetYear = (int) $filters['target_year'];

        if ($sourceYear >= $targetYear) {
            return [
                'copied' => 0,
                'skipped' => 0,
                'message' => 'Tahun tujuan harus lebih besar dari tahun sumber.',
                'type' => 'error',
            ];
        }

        return DB::transaction(function () use ($filters, $sourceYear, $targetYear) {
            $copied = 0;
            $skipped = 0;

            $this->buildSourceQuery($filters)
                ->lockForUpdate()
                ->chunkById(100, function ($risks) use ($sourceYear, $targetYear, &$copied, &$skipped) {
                foreach ($risks as $risk) {
                    if ($this->alreadyCopied($risk, $targetYear) || $this->hasEquivalentTargetRisk($risk, $targetYear)) {
                        $skipped++;
                        continue;
                    }

                    $newRisk = $risk->replicate([
                        'kode_risiko',
                        'created_at',
                        'updated_at',
                        'deleted_at',
                    ]);

                    $newRegisterDate = Carbon::parse($risk->tgl_register)->year($targetYear);
                    $newRisk->tgl_register = $newRegisterDate;
                    $newRisk->tgl_selesai = $newRegisterDate->copy()->addDays((int) $risk->target_waktu);
                    $newRisk->currently_id = 1;
                    $newRisk->is_risiko_lama = 1;
                    $newRisk->copied_from_risk_register_id = $risk->id;
                    $newRisk->copied_from_year = $sourceYear;
                    $newRisk->copied_to_year = $targetYear;
                    $newRisk->copied_by_user_id = auth()->id();
                    $newRisk->copied_at = now();
                    $newRisk->save();

                    $prefix = ((int) $newRisk->risk_category_id === 5) ? 'RSO' : 'ROO';
                    $yearCode = Carbon::parse($newRisk->tgl_register)->format('y');
                    $newRisk->kode_risiko = "{$prefix}.{$yearCode}.02.43.{$newRisk->id}";
                    $newRisk->save();

                    $copied++;
                }
            });

            return [
                'copied' => $copied,
                'skipped' => $skipped,
                'source_year' => $sourceYear,
                'target_year' => $targetYear,
                'message' => "Salin risiko {$sourceYear} ke {$targetYear} selesai. {$copied} disalin, {$skipped} dilewati.",
                'type' => 'success',
            ];
        });
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
            if (!empty($filters[$field])) {
                $query->where($field, (int) $filters[$field]);
            }
        }

        if (!empty($filters['pic_id'])) {
            $query->whereJsonContains('pic_id', (int) $filters['pic_id']);
        }

        if (($filters['priority_scope'] ?? 'all') !== 'all') {
            $priorityCodes = $this->priorityCodes($filters['priority_scope'], $filters['tipe_id'] ?? null);

            if ($priorityCodes) {
                $query->whereIn('concatdp1', $priorityCodes);
            }
        }

        if (!auth()->user()->can('lihat data semua risk register')) {
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

    private function alreadyCopied(RiskRegister $risk, int $targetYear): bool
    {
        return RiskRegister::query()
            ->where('copied_from_risk_register_id', $risk->id)
            ->where('copied_to_year', $targetYear)
            ->exists();
    }

    private function hasEquivalentTargetRisk(RiskRegister $risk, int $targetYear): bool
    {
        return RiskRegister::query()
            ->where('tipe_id', $risk->tipe_id)
            ->whereYear('tgl_register', $targetYear)
            ->where('user_id', $risk->user_id)
            ->where('risk_category_id', $risk->risk_category_id)
            ->where('pernyataan_risiko', $risk->pernyataan_risiko)
            ->where('sebab', $risk->sebab)
            ->whereNull('deleted_at')
            ->exists();
    }
}
