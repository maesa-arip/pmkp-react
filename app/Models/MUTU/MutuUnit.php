<?php

namespace App\Models\MUTU;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MutuUnit extends Model
{
    use HasFactory;
    protected $guarded = [];
    public function mutu_indikator()
    {
        return $this->belongsTo(MutuIndikator::class);
    }
    public function mutu_pdsa()
    {
        return $this->hasOne(MutuPdsa::class);
    }
}
