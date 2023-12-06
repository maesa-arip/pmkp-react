<?php

namespace App\Models;

use App\Models\MUTU\MutuIndikator;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;
    protected $fillable = ['name'];

    public function pic()
    {
        return $this->hasOne(Pic::class);
    }
    public function risk_register()
    {
        return $this->hasMany(RiskRegister::class);
    }
    public function mutu_indikator()
    {
        return $this->hasMany(MutuIndikator::class);
    }
}
