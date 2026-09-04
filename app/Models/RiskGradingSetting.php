<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

class RiskGradingSetting extends Model
{
    protected $guarded = [];

    public const OPTIONS = [
        'klinis' => 'Klinis',
        'nonklinis' => 'Non Klinis',
        'klinis_pergub' => 'Klinis Pergub',
        'nonklinis_pergub' => 'Non Klinis Pergub',
        'klinis_bpkp' => 'Klinis BPKP',
        'nonklinis_bpkp' => 'Non Klinis BPKP',
        'ikp' => 'IKP',
    ];

    public const DEFAULTS = [
        'risk_register_klinis' => 'klinis',
        'risk_register_nonklinis' => 'nonklinis_pergub',
        'export_lars_dhp_klinis' => 'klinis',
        'export_lars_dhp_nonklinis' => 'nonklinis_pergub',
        'export_bpkp' => 'nonklinis_bpkp',
    ];

    public static function allowedValues(): array
    {
        return array_keys(self::OPTIONS);
    }

    public static function value(string $key, ?string $default = null): string
    {
        $fallback = $default ?? self::DEFAULTS[$key] ?? 'klinis';

        if (!Schema::hasTable('risk_grading_settings')) {
            return $fallback;
        }

        $value = self::query()->where('key', $key)->value('value');

        return in_array($value, self::allowedValues(), true) ? $value : $fallback;
    }

    public static function allValues(): array
    {
        $settings = self::DEFAULTS;

        if (!Schema::hasTable('risk_grading_settings')) {
            return $settings;
        }

        self::query()->pluck('value', 'key')->each(function ($value, $key) use (&$settings) {
            if (array_key_exists($key, $settings) && in_array($value, self::allowedValues(), true)) {
                $settings[$key] = $value;
            }
        });

        return $settings;
    }
}
