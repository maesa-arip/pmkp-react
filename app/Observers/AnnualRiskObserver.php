<?php

namespace App\Observers;

use App\Models\PeriodeKinerja;
use App\Models\RiskRegister;
use App\Services\AnnualIndicatorService;
use App\Services\Fitur4Master;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;

class AnnualRiskObserver
{
    public function saving(RiskRegister $risk): void
    {
        if (! $risk->tgl_register) {
            throw ValidationException::withMessages(['tgl_register' => 'Tanggal register wajib diisi.']);
        }
        // Registers always store the permanent master, even when a placement ID is submitted.
        if ($risk->indikator_fitur4_id && ($masterId = Fitur4Master::masterId((int) $risk->indikator_fitur4_id))) {
            $risk->indikator_fitur4_id = $masterId;
        }
        $year = Carbon::parse($risk->tgl_register)->year;
        $oldPics = AnnualIndicatorService::ids($risk->getOriginal('pic_id'));
        $newPics = AnnualIndicatorService::ids($risk->pic_id);
        sort($oldPics);
        sort($newPics);
        $retarget = ! $risk->exists || $risk->isDirty('indikator_fitur4_id')
            || Carbon::parse($risk->getOriginal('tgl_register'))->year !== $year;
        $period = PeriodeKinerja::where('tahun', $year)->first();
        // Existing registers stay editable in every year, including closed periods and years
        // without a period. A changed PIC must still fit the indicator when it is placed.
        if (! $retarget) {
            $placement = $period ? Fitur4Master::placement((int) $risk->indikator_fitur4_id, $period->id) : null;
            if ($oldPics !== $newPics && $placement && ! app(AnnualIndicatorService::class)->acceptsPics($placement, $newPics)) {
                throw ValidationException::withMessages(['indikator_fitur4_id' => 'Indikator tidak berlaku untuk seluruh PIC yang dipilih. Pilih PIC jabatan pemilik indikator atau unit dalam cakupannya.']);
            }

            return;
        }
        if (! $period) {
            throw ValidationException::withMessages(['tgl_register' => 'Siapkan periode indikator untuk tahun register terlebih dahulu.']);
        }
        $period->assertWritable();
        $placement = Fitur4Master::placement((int) $risk->indikator_fitur4_id, $period->id);
        if (! $placement) {
            throw ValidationException::withMessages(['indikator_fitur4_id' => 'Indikator tidak tersedia pada tahun register.']);
        }
        if (! $placement->is_active) {
            throw ValidationException::withMessages(['indikator_fitur4_id' => 'Indikator sudah tidak aktif.']);
        }
        if (auth()->user() && ! app(\App\Services\RiskIndicatorAccess::class)->allowsUser(auth()->user(), (int) $risk->indikator_fitur4_id, $period->id)) {
            throw ValidationException::withMessages(['indikator_fitur4_id' => 'Indikator di luar tanggung jawab jabatan atau cakupan PIC akun Anda.']);
        }
        if (! app(AnnualIndicatorService::class)->acceptsPics($placement, $newPics)) {
            throw ValidationException::withMessages(['indikator_fitur4_id' => 'Indikator tidak berlaku untuk seluruh PIC yang dipilih. Pilih PIC jabatan pemilik indikator atau unit dalam cakupannya.']);
        }
        $risk->periode_kinerja_id = $period->id;
        $risk->indikator_snapshot = app(AnnualIndicatorService::class)->snapshot($placement->id);
    }
}
