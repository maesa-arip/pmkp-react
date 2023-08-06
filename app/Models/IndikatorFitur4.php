<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IndikatorFitur4 extends Model
{
    use HasFactory;
    public function risk_register()
    {
        return $this->hasMany(RiskRegister::class);
    }
    protected $casts = [
        'location_id' => 'array',
    ];
}
