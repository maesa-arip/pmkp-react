<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RiskGrading extends Model
{
    use HasFactory;
    public function riskregister()
    {
        return $this->belongsTo(RiskRegister::class,'concatdp1','kode');
    }
}
