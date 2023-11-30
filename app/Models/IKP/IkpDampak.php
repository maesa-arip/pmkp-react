<?php

namespace App\Models\IKP;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IkpDampak extends Model
{
    use HasFactory;
    protected $fillable = ['value','name','description'];

    public function ikpPasien()
    {
        return $this->hasMany(IkpPasien::class);
    }
}
