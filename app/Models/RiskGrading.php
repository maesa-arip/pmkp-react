<?php

namespace App\Models;

use App\Models\IKP\IkpHasil;
use App\Models\IKP\IkpPasien;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RiskGrading extends Model
{
    use HasFactory;

    protected $guarded = [];

    public const DEFAULT_TAHUN = 2025;

    public const GRADING_COLUMNS = [
        'klinis' => ['name' => 'name', 'color' => 'warna'],
        'nonklinis' => ['name' => 'name_nonklinis', 'color' => 'warna_nonklinis'],
        'klinis_pergub' => ['name' => 'name_klinis_pergub', 'color' => 'warna_klinis_pergub'],
        'nonklinis_pergub' => ['name' => 'name_nonklinis_pergub', 'color' => 'warna_nonklinis_pergub'],
        'klinis_bpkp' => ['name' => 'name_klinis_bpkp', 'color' => 'warna_klinis_bpkp'],
        'nonklinis_bpkp' => ['name' => 'name_nonklinis_bpkp', 'color' => 'warna_nonklinis_bpkp'],
        'ikp' => ['name' => 'name_ikp', 'color' => 'warna_ikp'],
        'bpkp' => ['name' => 'name_bpkp', 'color' => 'warna_bpkp'],
    ];

    public static function columnsFor(?string $value): array
    {
        return self::GRADING_COLUMNS[$value] ?? self::GRADING_COLUMNS['klinis'];
    }

    public static function columnsForSetting(string $key, ?string $default = null): array
    {
        return self::columnsFor(RiskGradingSetting::value($key, $default));
    }

    public static function nameColumnForSetting(string $key, ?string $default = null): string
    {
        return self::columnsForSetting($key, $default)['name'];
    }

    public static function colorColumnForSetting(string $key, ?string $default = null): string
    {
        return self::columnsForSetting($key, $default)['color'];
    }

    public static function nameColumnSql(string $alias, string $key, ?string $default = null): string
    {
        $column = self::nameColumnForSetting($key, $default);

        return "{$alias}.`{$column}`";
    }

    public static function selectNameSql(string $alias, string $key, ?string $default, string $as): string
    {
        return self::nameColumnSql($alias, $key, $default) . " as {$as}";
    }

    public static function nameCaseSql(string $alias, string $key, ?string $default = null): string
    {
        $fallback = $default ?? RiskGradingSetting::DEFAULTS[$key] ?? 'klinis';

        return "CASE COALESCE((SELECT value FROM risk_grading_settings WHERE `key` = '{$key}' LIMIT 1), '{$fallback}') " .
            "WHEN 'nonklinis' THEN {$alias}.`name_nonklinis` " .
            "WHEN 'klinis_pergub' THEN {$alias}.`name_klinis_pergub` " .
            "WHEN 'nonklinis_pergub' THEN {$alias}.`name_nonklinis_pergub` " .
            "WHEN 'klinis_bpkp' THEN {$alias}.`name_klinis_bpkp` " .
            "WHEN 'nonklinis_bpkp' THEN {$alias}.`name_nonklinis_bpkp` " .
            "WHEN 'ikp' THEN {$alias}.`name_ikp` " .
            "WHEN 'bpkp' THEN {$alias}.`name_bpkp` " .
            "ELSE {$alias}.`name` END";
    }

    public static function selectNameCaseSql(string $alias, string $key, ?string $default, string $as): string
    {
        return self::nameCaseSql($alias, $key, $default) . " as {$as}";
    }

    public static function joinByRiskRegisterYear($query, string $alias, string $concatColumn, string $join = 'leftJoin')
    {
        $table = $alias === 'risk_gradings' ? 'risk_gradings' : "risk_gradings as {$alias}";

        return $query->{$join}($table, function ($joinClause) use ($alias, $concatColumn) {
            $joinClause->on("{$alias}.kode", '=', $concatColumn)
                ->whereRaw("{$alias}.tahun = COALESCE(YEAR(risk_registers.tgl_register), " . self::DEFAULT_TAHUN . ")");
        });
    }

    public static function joinByIkpIncidentYear($query, string $alias = 'risk_gradings', string $concatColumn = 'ikp_pasiens.concatdp', string $join = 'leftjoin')
    {
        $table = $alias === 'risk_gradings' ? 'risk_gradings' : "risk_gradings as {$alias}";

        return $query->{$join}($table, function ($joinClause) use ($alias, $concatColumn) {
            $joinClause->on("{$alias}.kode", '=', $concatColumn)
                ->whereRaw("{$alias}.tahun = COALESCE(YEAR(ikp_pasiens.tanggal_insiden), YEAR(ikp_pasiens.created_at), " . self::DEFAULT_TAHUN . ")");
        });
    }

    public function riskregister()
    {
        return $this->belongsTo(RiskRegister::class,'concatdp1','kode');
    }
    public function ikpPasien()
    {
        return $this->belongsTo(IkpPasien::class,'concatdp','kode');
    }
    public function ikpHasil()
    {
        return $this->belongsTo(IkpHasil::class,'concatdp2','kode');
    }
}
