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
