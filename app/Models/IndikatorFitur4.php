<?php

namespace App\Models;

use App\Models\MUTU\MutuIndikator;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IndikatorFitur4 extends Model
{
    use HasFactory;
    protected  $guarded = [];
    public function risk_register()
    {
        return $this->hasMany(RiskRegister::class);
    }
    public function mutu_indikator()
    {
        return $this->hasMany(MutuIndikator::class,'mutu_indikator_id');
    }
    protected $casts = [
        'location_id' => 'array',
    ];
}
