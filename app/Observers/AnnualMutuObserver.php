<?php

namespace App\Observers;

use App\Models\MUTU\MutuUnit;
use App\Models\PeriodeKinerja;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AnnualMutuObserver
{
    public function saving(MutuUnit $unit): void
    {
        if ($unit->exists) {
            $this->assertMaster($unit->getOriginal('mutu_indikator_id'));
        }
        $period = $this->assertMaster($unit->mutu_indikator_id);
        if (! DB::table('mutu_indikators')->where('id', $unit->mutu_indikator_id)->where('approved', 1)->where('is_active', true)->exists()) {
            throw ValidationException::withMessages(['mutu_indikator_id' => 'Kamus MUTU harus aktif dan disetujui sebelum pengukuran disimpan.']);
        }
        if ($period->tahun !== Carbon::parse($unit->tanggal_mutu)->year) {
            throw ValidationException::withMessages(['mutu_indikator_id' => 'Pilih indikator MUTU sesuai tahun tanggal pengukuran.']);
        }
    }

    public function deleting(MutuUnit $unit): void
    {
        $this->assertMaster($unit->mutu_indikator_id);
    }

    private function assertMaster($id): PeriodeKinerja
    {
        $master = DB::table('mutu_indikators')->find($id);
        $period = $master ? PeriodeKinerja::find($master->periode_kinerja_id) : null;
        if (! $period) {
            throw ValidationException::withMessages(['mutu_indikator_id' => 'Indikator MUTU belum memiliki periode.']);
        }
        $period->assertWritable();

        return $period;
    }
}
