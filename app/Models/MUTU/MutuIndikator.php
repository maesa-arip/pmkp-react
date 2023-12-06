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
