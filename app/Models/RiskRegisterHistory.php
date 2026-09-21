<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RiskRegisterHistory extends Model
{
    use HasFactory;

    public const EVENT_CREATED = 'created';
    public const EVENT_STATUS_CHANGED = 'status_changed';
    public const EVENT_COPIED_FROM_PREVIOUS_YEAR = 'copied_from_previous_year';
    public const EVENT_SOURCE_REGISTERED = 'source_registered';

    protected $fillable = [
        'risk_register_id',
        'currently_id',
        'user_id',
        'event_type',
        'snapshot',
    ];

    protected $casts = [
        'snapshot' => 'array',
    ];

    public static function recordForRisk(RiskRegister $riskRegister, string $eventType, ?int $currentlyId = null, array $extraSnapshot = []): self
    {
        return self::create([
            'risk_register_id' => $riskRegister->id,
            'currently_id' => $currentlyId ?? $riskRegister->currently_id,
            'user_id' => auth()->id(),
            'event_type' => $eventType,
            'snapshot' => array_merge([
                'kode_risiko' => $riskRegister->kode_risiko,
                'periode_kinerja_id' => $riskRegister->periode_kinerja_id,
                'indikator_snapshot' => $riskRegister->indikator_snapshot,
                'pernyataan_risiko' => $riskRegister->pernyataan_risiko,
                'sebab' => $riskRegister->sebab,
                'dampak' => $riskRegister->dampak,
                'currently_id' => $currentlyId ?? $riskRegister->currently_id,
                'tipe_id' => $riskRegister->tipe_id,
                'risk_category_id' => $riskRegister->risk_category_id,
                'copied_from_risk_register_id' => $riskRegister->copied_from_risk_register_id,
                'copied_from_year' => $riskRegister->copied_from_year,
                'copied_to_year' => $riskRegister->copied_to_year,
            ], $extraSnapshot),
        ]);
    }

    public function risk_register()
    {
        return $this->belongsTo(RiskRegister::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
