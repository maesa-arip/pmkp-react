<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PembiayaanRisiko extends Model
{
    use HasFactory;
    public function risk_register()
    {
        return $this->hasMany(RiskRegister::class);
    }
}
