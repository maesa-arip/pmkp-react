<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RiskVariety extends Model
{
    use HasFactory;
    protected $fillable = ['name','description'];
    public function risk_register()
    {
        return $this->hasMany(RiskRegister::class);
    }
}
