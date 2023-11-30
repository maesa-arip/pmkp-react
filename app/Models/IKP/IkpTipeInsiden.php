<?php

namespace App\Models\IKP;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IkpTipeInsiden extends Model
{
    use HasFactory;
    protected $fillable = ['name'];
    public function ikpPasien()
    {
        return $this->hasMany(IkpPasien::class);
    }
}
