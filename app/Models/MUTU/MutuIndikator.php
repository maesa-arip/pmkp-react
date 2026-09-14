<?php

namespace App\Models\MUTU;

use App\Models\IndikatorFitur4;
use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MutuIndikator extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $appends = ['tahun'];

    public function getTahunAttribute(): ?int
    {
        return app('annual.periods')[$this->periode_kinerja_id] ?? null;
    }

    protected static function booted(): void
    {
        static::addGlobalScope('annual', fn ($query) => $query->whereNotNull('mutu_indikators.periode_kinerja_id'));
        static::saving(function ($master) {
            $indicator = \App\Models\IndikatorFitur4::find($master->indikator_fitur4_id);
            if (!$indicator) throw \Illuminate\Validation\ValidationException::withMessages(['indikator_fitur4_id' => 'Pilih indikator tahunan.']);
            $period = \App\Models\PeriodeKinerja::findOrFail($indicator->periode_kinerja_id);
            $period->assertWritable();
            if ($master->exists) {
                \App\Models\PeriodeKinerja::findOrFail($master->getOriginal('periode_kinerja_id'))->assertWritable();
                if ($master->periode_kinerja_id != $period->id) throw \Illuminate\Validation\ValidationException::withMessages(['indikator_fitur4_id' => 'Periode kamus MUTU tidak dapat dipindahkan.']);
                if ($master->isDirty(['indikator_fitur4_id', 'num_name', 'denum_name', 'standar', 'operator', 'penyebut']) && $master->unit()->exists()) throw \Illuminate\Validation\ValidationException::withMessages(['indikator_fitur4_id' => 'Kamus sudah digunakan. Buat kamus baru untuk perubahan definisi.']);
            }
            $master->periode_kinerja_id = $period->id;
            $master->lineage_id = $master->lineage_id ?: (string) \Illuminate\Support\Str::uuid();
        });
        static::deleting(function ($master) {
            \App\Models\PeriodeKinerja::findOrFail($master->periode_kinerja_id)->assertWritable();
            if ($master->unit()->exists()) throw \Illuminate\Validation\ValidationException::withMessages(['indikator_fitur4_id' => 'Kamus MUTU sudah dipakai dan tidak dapat dihapus.']);
        });
    }
    public function indikator_fitur4()
    {
        return $this->belongsTo(IndikatorFitur4::class,'indikator_fitur4_id');
    }
    public function kategori()
    {
        return $this->belongsTo(MutuKategori::class,'mutu_kategori_id');
    }
    public function unit()
    {
        return $this->hasMany(MutuUnit::class);
    }
    public function location()
    {
        return $this->belongsTo(Location::class);
    }
}
