<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class RiskRegister extends Model
{
    use HasFactory,SoftDeletes,LogsActivity;
    protected $guarded=[];
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
        ->logOnly(['sebab', 'risiko','dampak','kronologi','pernyataan_risiko','osd1_dampak','osd1_probabilitas','osd2_dampak','osd2_probabilitas','osd2_controllability']);
        // Chain fluent methods for configuration options
    }
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
    public function riskRegisterHistories()
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
    public function fgdactual()
    {
        return $this->hasOne(FgdActual::class);
    }
    public function requestupdate()
    {
        return $this->hasOne(RequestUpdate::class);
    }
    public function requestupdateverificationadmin()
    {
        return $this->hasOneThrough(VerificationAdmin::class, RequestUpdate::class);
    }
    public function requestupdateverificationmanagement()
    {
        return $this->hasOneThrough(VerificationManagement::class, RequestUpdate::class);
    }
    public function verificationpriorityadmin()
    {
        return $this->hasOne(VerificationPriorityAdmin::class);
    }
    public function verificationprioritymanagement()
    {
        return $this->hasOne(VerificationPriorityManagement::class);
    }
    public function riskgrading(){
        return $this->hasOne(RiskGrading::class,'kode','concatdp1');
    }
    public function historyCount()
    {
        return $this->hasMany(RiskRegisterHistory::class)
            ->selectRaw('risk_register_id,
                         SUM(QUARTER(created_at) = 1) as Q1,
                         SUM(QUARTER(created_at) = 2) as Q2,
                         SUM(QUARTER(created_at) = 3) as Q3,
                         SUM(QUARTER(created_at) = 4) as Q4')
            ->groupBy('risk_register_id');
    }
}
