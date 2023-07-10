<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RiskRegisterHistory extends Model
{
    use HasFactory;
    protected $fillable = ['risk_register_id','currently_id'];
    public function risk_register()
    {
        return $this->belongsTo(RiskRegister::class);
    }
}
