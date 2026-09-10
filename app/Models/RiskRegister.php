<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class RiskRegister extends Model
{
    use HasFactory,SoftDeletes,LogsActivity;

    public const FORM_FIELDS = [
        'indikator_fitur4_id',
        'indikator_fitur04_id',
        'risk_category_id',
        'kronologi',
        'tgl_register',
        'tgl_selesai',
        'sebab',
        'currently_id',
        'pic_id',
        'identification_source_id',
        'resiko',
        'dampak',
        'pernyataan_risiko',
        'c_uc',
        'risk_variety_id',
        'risk_type_id',
        'jenis_sebab_id',
        'num',
        'denum',
        'target_waktu',
        'waktudenumnum',
        'osd1_dampak',
        'osd1_probabilitas',
        'osd1_inherent',
        'osd2_dampak',
        'osd2_probabilitas',
        'osd2_controllability',
        'osd2_inherent',
        'osd3_dampak',
        'osd3_probabilitas',
        'osd4_dampak',
        'osd4_probabilitas',
        'concatdp1',
        'concatdp2',
        'concatdp3',
        'concatdp4',
        'pengendalian_risiko',
        'efektif_id',
        'pengendalian_harus_ada',
        'celah_pengendalian',
        'media_pengkomunikasian',
        'penyedia_informasi',
        'penerima_informasi',
        'opsi_pengendalian_id',
        'penanganan_risiko',
        'pembiayaan_risiko_id',
        'jenis_pengendalian_id',
        'waktu_pengendalian_id',
        'rencana_pengendalian',
        'pihak_terkena',
    ];

    protected $fillable = [
        'osd2_pengendalian_dilakukan',
        'osd2_pengendalian_efektif',
        'belum_tertangani',
        'usulan_perbaikan',
        'waktu_implementasi_id',
        'realisasi_id',
        'output',
        'dokumen_pendukung',
        'kendala',
        'kode_risiko',
        'tipe_id',
        'user_id',
        'is_risiko_lama',
        'copied_from_risk_register_id',
        'copied_from_year',
        'copied_to_year',
        'copied_by_user_id',
        'copied_at',
        'copy_type',
        'copied_to_pic_id',
        'copied_to_user_id',
        'indikator_fitur4_id',
        'indikator_fitur04_id',
        'risk_category_id',
        'kronologi',
        'tgl_register',
        'tgl_selesai',
        'sebab',
        'currently_id',
        'pic_id',
        'identification_source_id',
        'resiko',
        'dampak',
        'pernyataan_risiko',
        'c_uc',
        'risk_variety_id',
        'risk_type_id',
        'jenis_sebab_id',
        'num',
        'denum',
        'target_waktu',
        'waktudenumnum',
        'osd1_dampak',
        'osd1_probabilitas',
        'osd1_controllability',
        'osd1_inherent',
        'osd2_dampak',
        'osd2_probabilitas',
        'osd2_controllability',
        'osd2_inherent',
        'osd3_dampak',
        'osd3_probabilitas',
        'osd4_dampak',
        'osd4_probabilitas',
        'concatdp1',
        'concatdp2',
        'concatdp3',
        'concatdp4',
        'perlu_penanganan_id',
        'pengendalian_risiko',
        'efektif_id',
        'pengendalian_harus_ada',
        'celah_pengendalian',
        'media_pengkomunikasian',
        'penyedia_informasi',
        'penerima_informasi',
        'opsi_pengendalian_id',
        'penanganan_risiko',
        'pembiayaan_risiko_id',
        'jenis_pengendalian_id',
        'waktu_pengendalian_id',
        'rencana_pengendalian',
        'pihak_terkena',
    ];
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
        return $this->hasMany(RiskRegisterHistory::class)->with('user')->oldest();
    }
    public function riskRegisterHistories()
    {
        return $this->hasMany(RiskRegisterHistory::class)->with('user')->oldest();
    }
    public function copiedFromRiskRegister()
    {
        return $this->belongsTo(self::class, 'copied_from_risk_register_id')->withTrashed();
    }
    public function copiedRiskRegisterCopies()
    {
        return $this->hasMany(self::class, 'copied_from_risk_register_id');
    }
    public function effectiveRiskRegisterHistories(): EloquentCollection
    {
        $ownHistories = $this->relationLoaded('risk_register_histories')
            ? $this->risk_register_histories
            : $this->risk_register_histories()->get();

        if (!$this->copied_from_risk_register_id) {
            return $ownHistories;
        }

        $sourceRisk = $this->relationLoaded('copiedFromRiskRegister')
            ? $this->copiedFromRiskRegister
            : $this->copiedFromRiskRegister()->first();

        if (!$sourceRisk) {
            return $ownHistories;
        }

        $sourceHistories = $sourceRisk->relationLoaded('risk_register_histories')
            ? $sourceRisk->risk_register_histories
            : $sourceRisk->risk_register_histories()->get();

        if ($sourceHistories->isEmpty()) {
            $sourceHistories = new EloquentCollection([
                $this->sourceRegisteredHistory($sourceRisk),
            ]);
        }

        $postCopyHistories = $ownHistories->reject(
            fn ($history) => $history->event_type === RiskRegisterHistory::EVENT_COPIED_FROM_PREVIOUS_YEAR
        );

        return $sourceHistories
            ->merge($postCopyHistories)
            ->sortBy('created_at')
            ->values();
    }
    private function sourceRegisteredHistory(self $sourceRisk): RiskRegisterHistory
    {
        $history = new RiskRegisterHistory();
        $history->forceFill([
            'id' => "source-{$sourceRisk->id}",
            'risk_register_id' => $sourceRisk->id,
            'currently_id' => $sourceRisk->currently_id,
            'user_id' => $sourceRisk->user_id,
            'event_type' => RiskRegisterHistory::EVENT_SOURCE_REGISTERED,
            'created_at' => $sourceRisk->created_at,
            'updated_at' => $sourceRisk->updated_at,
            'snapshot' => [
                'kode_risiko' => $sourceRisk->kode_risiko,
                'pernyataan_risiko' => $sourceRisk->pernyataan_risiko,
                'sebab' => $sourceRisk->sebab,
                'currently_id' => $sourceRisk->currently_id,
                'tipe_id' => $sourceRisk->tipe_id,
                'risk_category_id' => $sourceRisk->risk_category_id,
                'source_risk_register_id' => $sourceRisk->id,
                'source_kode_risiko' => $sourceRisk->kode_risiko,
                'source_year' => $sourceRisk->tgl_register
                    ? date('Y', strtotime($sourceRisk->tgl_register))
                    : null,
            ],
        ]);

        if ($sourceRisk->relationLoaded('user')) {
            $history->setRelation('user', $sourceRisk->user);
        }

        return $history;
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
