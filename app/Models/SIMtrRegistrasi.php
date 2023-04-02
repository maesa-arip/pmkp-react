<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SIMtrRegistrasi extends Model
{
    use HasFactory;
    protected $table = 'SIMtrRegistrasi';
    protected $primaryKey = 'NoReg';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
}
