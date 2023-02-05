<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RiskCategory extends Model
{
    protected $fillable =['name'];
    use HasFactory;
    public function risk_register()
    {
        return $this->hasMany(RiskRegister::class);
    }
}
