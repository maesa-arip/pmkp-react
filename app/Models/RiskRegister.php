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
    public function indikator_fitur04()
    {
        return $this->belongsTo(IndikatorFitur04::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function risk_register_histories()
    {
        return $this->hasMany(RiskRegisterHistory::class);
    }
}
