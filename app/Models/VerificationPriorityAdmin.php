<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VerificationPriorityAdmin extends Model
{
    use HasFactory;
    protected $fillable = ['risk_register_id','keterangan'];

    public function riskregister()
    {
        return $this->belongsTo(RiskRegister::class);
    }
}
