<?php

namespace App\Models\MUTU;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MutuPdsa extends Model
{
    use HasFactory;
    protected $guarded = [];
    public function mutu_unit()
    {
        return $this->belongsTo(MutuUnit::class);
    }
}
