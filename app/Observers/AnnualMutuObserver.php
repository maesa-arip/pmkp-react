<?php

namespace App\Observers;

use App\Models\MUTU\MutuUnit;
use App\Models\PeriodeKinerja;
use App\Services\Fitur4Master;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AnnualMutuObserver
{
    public function saving(MutuUnit $unit): void
    {
        $year = Carbon::parse($unit->tanggal_mutu)->year;
        // Existing measurements stay editable; only a new or re-targeted one is validated.
        if ($unit->exists && ! $unit->isDirty('mutu_indikator_id') && Carbon::parse($unit->getOriginal('tanggal_mutu'))->year === $year) {
            return;
        }
        $master = DB::table('mutu_indikators')->where('id', $unit->mutu_indikator_id)->where('approved', 1)->where('is_active', true)->first();
        if (! $master) {
            throw ValidationException::withMessages(['mutu_indikator_id' => 'Kamus MUTU harus aktif dan disetujui sebelum pengukuran disimpan.']);
        }
        $period = PeriodeKinerja::where('tahun', $year)->first();
        if ($period && ! Fitur4Master::placement((int) $master->indikator_fitur4_id, $period->id)?->is_active) {
            throw ValidationException::withMessages(['mutu_indikator_id' => "Indikator MUTU tidak aktif pada tahun {$year}."]);
        }
    }
}
