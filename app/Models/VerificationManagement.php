<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VerificationManagement extends Model
{
    use HasFactory;
    protected $guraded = [];
    public function requestupdate()
    {
        return $this->belongsTo(RequestUpdate::class);
    }
}
