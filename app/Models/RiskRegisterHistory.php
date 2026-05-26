<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RiskRegisterHistory extends Model
{
    use HasFactory;

    public const EVENT_CREATED = 'created';
    public const EVENT_STATUS_CHANGED = 'status_changed';

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

    public static function recordForRisk(RiskRegister $riskRegister, string $eventType, ?int $currentlyId = null): self
    {
        return self::create([
            'risk_register_id' => $riskRegister->id,
            'currently_id' => $currentlyId ?? $riskRegister->currently_id,
            'user_id' => auth()->id(),
            'event_type' => $eventType,
            'snapshot' => [
                'kode_risiko' => $riskRegister->kode_risiko,
                'pernyataan_risiko' => $riskRegister->pernyataan_risiko,
                'sebab' => $riskRegister->sebab,
                'currently_id' => $currentlyId ?? $riskRegister->currently_id,
                'tipe_id' => $riskRegister->tipe_id,
                'risk_category_id' => $riskRegister->risk_category_id,
            ],
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
