<?php

namespace App\Models\IKP;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IkpProbabilitas extends Model
{
    use HasFactory;
    protected $table = 'ikp_probabilitas'; 
    protected $fillable = ['value','name'];
    public function ikpPasien()
    {
        return $this->hasMany(IkpPasien::class);
    }
}
