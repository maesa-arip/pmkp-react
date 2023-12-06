<?php

namespace App\Models\MUTU;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MutuKategori extends Model
{
    use HasFactory;
    protected $guarded = [];
    public function mutu_indikator()
    {
        return $this->hasMany(MutuIndikator::class);
    }
}
