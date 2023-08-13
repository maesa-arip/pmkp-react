<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FgdTreated extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function risk_register()
    {
        return $this->belongsTo(RiskRegister::class);
    }
}
