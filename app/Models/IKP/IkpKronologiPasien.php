<?php

namespace App\Models\IKP;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IkpKronologiPasien extends Model
{
    use HasFactory;
    protected $guarded = [];
    public function ikp_pasien()
    {
        return $this->belongsTo(IkpPasien::class,'ikp_pasien_id');
    }
}
