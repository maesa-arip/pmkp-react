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

    protected static function booted(): void
    {
        // Dictionaries are permanent like their level-four master; the year lives on each measurement.
        static::saving(function ($master) {
            $masterId = \App\Services\Fitur4Master::masterId((int) $master->indikator_fitur4_id);
            if (!$masterId) throw \Illuminate\Validation\ValidationException::withMessages(['indikator_fitur4_id' => 'Pilih indikator mutu.']);
            $master->indikator_fitur4_id = $masterId;
            if ($master->exists && $master->isDirty(['indikator_fitur4_id', 'num_name', 'denum_name', 'standar', 'operator', 'penyebut']) && $master->unit()->exists()) throw \Illuminate\Validation\ValidationException::withMessages(['indikator_fitur4_id' => 'Kamus sudah digunakan. Buat kamus baru untuk perubahan definisi.']);
        });
        static::deleting(function ($master) {
            if ($master->unit()->exists()) throw \Illuminate\Validation\ValidationException::withMessages(['indikator_fitur4_id' => 'Kamus MUTU sudah dipakai dan tidak dapat dihapus.']);
        });
    }
    public function indikator_fitur4()
    {
        return $this->belongsTo(IndikatorFitur4::class,'indikator_fitur4_id')->withoutGlobalScope('annual');
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
