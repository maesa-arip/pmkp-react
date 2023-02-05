<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;
    protected $fillable = ['name'];

    public function pic()
    {
        return $this->hasOne(Pic::class);
    }
    public function risk_register()
    {
        return $this->hasMany(RiskRegister::class);
    }
}
