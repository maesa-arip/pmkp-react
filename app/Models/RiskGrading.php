<?php

namespace App\Models;

use App\Models\IKP\IkpHasil;
use App\Models\IKP\IkpPasien;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RiskGrading extends Model
{
    use HasFactory;
    public function riskregister()
    {
        return $this->belongsTo(RiskRegister::class,'concatdp1','kode');
    }
    public function ikpPasien()
    {
        return $this->belongsTo(IkpPasien::class,'concatdp','kode');
    }
    public function ikpHasil()
    {
        return $this->belongsTo(IkpHasil::class,'concatdp2','kode');
    }
}
