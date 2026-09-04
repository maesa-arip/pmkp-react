<?php

namespace App\Models\MUTU;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MutuPenyebut extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'multiplier' => 'float',
    ];
}
