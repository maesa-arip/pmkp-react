<?php

namespace App\Models\IKP;

use App\Models\RiskGrading;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IkpHasil extends Model
{
    use HasFactory;
    protected $guarded = [];
    public function ikpPasien()
    {
        return $this->hasOne(IkpPasien::class);
    }
    public function riskgrading(){
        return $this->hasOne(RiskGrading::class,'kode','concatdp2');
    }
}
