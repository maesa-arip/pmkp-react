<?php

namespace App\Services;

/**
 * Resolves the fitur 1-3 hierarchy an exported risk register belongs to.
 *
 * Registers store the fitur 4 **master** id (`periode_kinerja_id` null), and
 * `Fitur4Master::SHARED` deliberately leaves `indikator_fitur3_id` out of the
 * master, so climbing `master.indikator_fitur3_id` always lands on the legacy
 * tree. The year's placement row carries the real parent. See temuan #22.
 *
 * The hierarchy comes from the year's placement (`master_id` + that year's
 * `periode_kinerja_id`) and from nowhere else. An indicator that has no placement
 * for the register's year, or a placement not yet linked to a kegiatan, leaves
 * Sasaran/IKU/Program/Kegiatan blank.
 *
 * Blank is deliberate: falling back to the master's parent would quietly print the
 * legacy tree and hide which indicators still need linking. The register's own
 * columns - kode risiko, pernyataan risiko, and the indicator name, which is a
 * master attribute - stay filled, so a blank row still says which indicator it is.
 *
 * Measured when this was decided: 2023/2024/2025 resolve through their placement
 * for 241/294/311 of 241/294/311 registers, so none of them go blank; 2026 has
 * 129 registers whose 54 masters are not linked yet.
 *
 * `risk_registers.indikator_snapshot` would be more trusted still, but it is null
 * on every existing row, so it is not read yet - see TASK_13.
 */
class RegisterHierarchyResolver
{
    /** Alias of the fitur 4 master row (permanent attributes: name, tujuan). */
    public const MASTER = 'indikator_fitur4s';

    /** Alias of the fitur 3 row that actually applies to the register's year. */
    public const FITUR3 = 'indikator_fitur3s';

    public const FITUR2 = 'indikator_fitur2s';

    public const FITUR1 = 'indikator_fitur1s';

    /** Alias of the resolved `sasaran_strategis` row. */
    public const SASARAN = 'sasaran_strategis';

    /** Alias of the year's placement row; exports rarely need it directly. */
    public const PLACEMENT = 'penempatan_tahun';

    private const PERIOD = 'periode_register';

    /**
     * Adds the master -> year placement -> fitur 3/2/1 -> sasaran chain.
     *
     * The aliases match the table names the exports already select from, so a
     * caller only swaps its join block and leaves every `select` untouched.
     *
     * The year comes from `year(tgl_register)`, not `risk_registers.periode_kinerja_id`,
     * because that column is still null on every existing row.
     *
     * @param  bool  $withSasaran  join `sasaran_strategis` through fitur 1
     */
    public static function join($query, bool $withSasaran = true)
    {
        $master = self::MASTER;
        $placement = self::PLACEMENT;
        $period = self::PERIOD;

        $query->leftJoin('periode_kinerjas as '.$period, function ($join) use ($period) {
            $join->whereRaw($period.'.tahun = YEAR(risk_registers.tgl_register)');
        });
        $query->leftJoin('indikator_fitur4s as '.$master, $master.'.id', 'risk_registers.indikator_fitur4_id');
        $query->leftJoin('indikator_fitur4s as '.$placement, function ($join) use ($master, $placement, $period) {
            $join->on($placement.'.master_id', '=', $master.'.id')
                ->whereRaw($placement.'.periode_kinerja_id = '.$period.'.id');
        });
        // Only the year's placement. An indicator not yet linked to a kegiatan of
        // that year leaves the hierarchy columns blank on purpose, so the export
        // doubles as the list of what still needs linking - see temuan #22.
        $query->leftJoin('indikator_fitur3s as '.self::FITUR3, self::FITUR3.'.id', $placement.'.indikator_fitur3_id');
        $query->leftJoin('indikator_fitur2s as '.self::FITUR2, self::FITUR2.'.id', self::FITUR3.'.indikator_fitur2_id');
        $query->leftJoin('indikator_fitur1s as '.self::FITUR1, self::FITUR1.'.id', self::FITUR2.'.indikator_fitur1_id');

        if ($withSasaran) {
            // Through fitur 1, never through the master's own sasaran_strategis_id,
            // which points at the legacy tree for the same reason as the parent.
            $query->leftJoin('sasaran_strategis as '.self::SASARAN, self::SASARAN.'.id', self::FITUR1.'.sasaran_strategis_id');
        }

        return $query;
    }

    /**
     * Hierarchy columns to list in a `GROUP BY risk_registers.id`.
     *
     * Defensive rather than strictly required. The placement is joined on
     * `master_id` + `periode_kinerja_id`, which is not a declared unique key
     * (temuan #34), so whether only_full_group_by can prove these columns are
     * functionally dependent on the grouped register id rests on MySQL's
     * inference rather than on a constraint. All four register exports were
     * verified to build without this on the local MySQL 8; it is kept because the
     * server versions are not all known from here, and listing columns that are
     * 1:1 with the register is valid under any sql_mode and changes no output.
     */
    public static function groupBy(): array
    {
        return [
            self::SASARAN.'.name',
            self::FITUR1.'.name',
            self::FITUR2.'.name',
            self::FITUR3.'.name',
            self::FITUR3.'.tujuan',
            self::MASTER.'.name',
            self::MASTER.'.tujuan',
        ];
    }

    /**
     * The hierarchy columns, ready to drop into a selectRaw.
     *
     * Indicator name and tujuan stay on the master because those are the
     * permanent attributes (`Fitur4Master::SHARED`); only the parent chain moves
     * with the year.
     */
    public static function columns(): array
    {
        return [
            'sasaran_strategis' => self::SASARAN.'.name',
            'iku' => self::FITUR1.'.name',
            'program' => self::FITUR2.'.name',
            'kegiatan' => self::FITUR3.'.name',
            'tujuan_kegiatan' => self::FITUR3.'.tujuan',
            'indikator' => self::MASTER.'.name',
        ];
    }
}
