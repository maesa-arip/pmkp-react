<?php

namespace App\Observers;

use App\Models\PeriodeKinerja;
use App\Models\RiskRegister;
use App\Services\AnnualIndicatorService;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AnnualRiskObserver
{
    public function saving(RiskRegister $risk): void
    {
        if ($risk->exists && $risk->getOriginal('periode_kinerja_id')) {
            PeriodeKinerja::findOrFail($risk->getOriginal('periode_kinerja_id'))->assertWritable();
        }
        if (! $risk->tgl_register) {
            throw ValidationException::withMessages(['tgl_register' => 'Tanggal register wajib diisi.']);
        }
        $period = PeriodeKinerja::where('tahun', Carbon::parse($risk->tgl_register)->year)->first();
        if (! $period) {
            throw ValidationException::withMessages(['tgl_register' => 'Siapkan periode indikator untuk tahun register terlebih dahulu.']);
        }
        $period->assertWritable();
        $indicator = DB::table('indikator_fitur4s')->find($risk->indikator_fitur4_id);
        if (! $indicator || (int) $indicator->periode_kinerja_id !== $period->id) {
            throw ValidationException::withMessages(['indikator_fitur4_id' => 'Indikator harus berasal dari tahun register.']);
        }
        $changed = ! $risk->exists || $risk->isDirty(['indikator_fitur4_id', 'tgl_register', 'pic_id']);
        if ($changed && ! $indicator->is_active) {
            throw ValidationException::withMessages(['indikator_fitur4_id' => 'Indikator sudah tidak aktif.']);
        }
        $service = app(AnnualIndicatorService::class);
        // Existing historical assignments are preserved; new or changed assignments must match.
        if ($changed && ! $service->acceptsPics($indicator, AnnualIndicatorService::ids($risk->pic_id))) {
            throw ValidationException::withMessages(['indikator_fitur4_id' => 'Indikator tidak berlaku untuk seluruh unit/PIC yang dipilih.']);
        }
        $risk->periode_kinerja_id = $period->id;
        if (! $risk->indikator_snapshot || $risk->isDirty('indikator_fitur4_id')) {
            $risk->indikator_snapshot = $service->snapshot($indicator->id);
        }
    }

    public function deleting(RiskRegister $risk): void
    {
        if ($risk->periode_kinerja_id) {
            PeriodeKinerja::findOrFail($risk->periode_kinerja_id)->assertWritable();
        }
    }
}
