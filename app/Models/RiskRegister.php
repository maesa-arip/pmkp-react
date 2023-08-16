<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RiskRegister extends Model
{
    use HasFactory;
    protected $guarded=[];
    public function risk_category()
    {
        return $this->belongsTo(RiskCategory::class);
    }
    public function identification_source()
    {
        return $this->belongsTo(IdentificationSource::class);
    }
    public function location()
    {
        return $this->belongsTo(Location::class);
    }
    public function risk_variety()
    {
        return $this->belongsTo(RiskVariety::class);
    }
    public function risk_type()
    {
        return $this->belongsTo(RiskType::class);
    }
    public function jenis_sebab()
    {
        return $this->belongsTo(JenisSebab::class);
    }
    public function opsi_pengendalian()
    {
        return $this->belongsTo(OpsiPengendalian::class);
    }
    public function pembiayaan_risiko()
    {
        return $this->belongsTo(PembiayaanRisiko::class);
    }
    public function pic()
    {
        return $this->belongsTo(Pic::class);
    }
    public function indikator_fitur4()
    {
        return $this->belongsTo(IndikatorFitur4::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function risk_register_histories()
    {
        return $this->hasMany(RiskRegisterHistory::class);
    }
    public function formulirrca()
    {
        return $this->hasOne(FormulirRca::class);
        // return $this->belongsTo(FormulirRca::class);
    }
    public function fgdinherent()
    {
        return $this->hasOne(FgdInherent::class);
    }
    public function fgdresidual()
    {
        return $this->hasOne(FgdResidual::class);
    }
    public function fgdtreated()
    {
        return $this->hasOne(FgdTreated::class);
    }
}
