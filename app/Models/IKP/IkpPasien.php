<?php

namespace App\Models\IKP;

use App\Models\Pic;
use App\Models\RiskGrading;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IkpPasien extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function penanggung()
    {
        return $this->belongsTo(IkpPenanggung::class,'ikp_penanggung_id');
    }
    public function jenis_insiden()
    {
        return $this->belongsTo(IkpJenisInsiden::class,'ikp_jenis_insiden_id');
    }
    public function tipe_insiden()
    {
        return $this->belongsTo(IkpTipeInsiden::class,'ikp_tipe_insiden_id');
    }
    public function spesialisasi()
    {
        return $this->belongsTo(IkpSpesialisasi::class,'ikp_spesialisasi_id');
    }
    public function dampak()
    {
        return $this->belongsTo(IkpDampak::class,'ikp_dampak_id');
    }
    public function probabilitas()
    {
        return $this->belongsTo(IkpProbabilitas::class,'ikp_probabilitas_id');
    }
    public function pelapor()
    {
        return $this->belongsTo(IkpPelapor::class,'ikp_pelapor_id');
    }
    public function grup_layanan()
    {
        return $this->belongsTo(IkpGruplayanan::class,'ikp_gruplayanan_id');
    }
    public function lokasi()
    {
        return $this->belongsTo(IkpLokasi::class,'ikp_lokasi_id');
    }
    public function penindak()
    {
        return $this->belongsTo(IkpPenindak::class,'ikp_penindak_id');
    }
    public function riskgrading(){
        return $this->hasOne(RiskGrading::class,'kode','concatdp');
    }
    public function ikp_hasil()
    {
        return $this->hasOne(IkpHasil::class);
    }
    public function kronologis()
    {
        return $this->hasMany(IkpKronologiPasien::class,'ikp_pasien_id');
    }
    /**
     * Get the user that owns the IkpPasien
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function pic()
    {
        return $this->belongsTo(Pic::class);
    }
    public function hasil_grading()
    {
        return $this->hasOneThrough(
            RiskGrading::class,
            IkpHasil::class,
            'ikp_pasien_id', 
            'kode',
            'id', 
            'concatdp2' 
        );
    }
}
