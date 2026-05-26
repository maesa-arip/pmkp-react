<?php

namespace App\Services;

use App\Models\RiskRegister;
use App\Models\RiskRegisterHistory;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class RiskRegisterYearCopyService
{
    public function copy(int $sourceYear, int $targetYear, int $typeId): array
    {
        if ($sourceYear >= $targetYear) {
            return [
                'copied' => 0,
                'skipped' => 0,
                'message' => 'Tahun tujuan harus lebih besar dari tahun sumber.',
                'type' => 'error',
            ];
        }

        return DB::transaction(function () use ($sourceYear, $targetYear, $typeId) {
            $copied = 0;
            $skipped = 0;

            $query = RiskRegister::query()
                ->where('tipe_id', $typeId)
                ->whereYear('tgl_register', $sourceYear)
                ->whereNull('deleted_at')
                ->orderBy('id')
                ->lockForUpdate();

            if (!auth()->user()->can('lihat data semua risk register')) {
                $query->where('user_id', auth()->id());
            }

            $query->chunk(100, function ($risks) use ($sourceYear, $targetYear, &$copied, &$skipped) {
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

                    RiskRegisterHistory::recordForRisk($newRisk, RiskRegisterHistory::EVENT_COPIED_FROM_PREVIOUS_YEAR);
                    $copied++;
                }
            });

            return [
                'copied' => $copied,
                'skipped' => $skipped,
                'message' => "Salin risiko {$sourceYear} ke {$targetYear} selesai. {$copied} disalin, {$skipped} dilewati.",
                'type' => 'success',
            ];
        });
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
