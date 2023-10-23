<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RequestUpdate extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function risk_register()
    {
        return $this->belongsTo(RiskRegister::class);
    }
    public function verificationmanagement()
    {
        return $this->hasMany(VerificationManagement::class);
    }
    public function verificationadmin()
    {
        return $this->hasOne(VerificationAdmin::class);
    }
}
