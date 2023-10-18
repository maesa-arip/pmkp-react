<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VerificationAdmin extends Model
{
    use HasFactory;
    protected $guraded = [];
    public function requestupdate()
    {
        return $this->belongsTo(RequestUpdate::class);
    }
}
