<?php

namespace App\Exports;

use App\Models\RiskGrading;
use App\Models\RiskRegister;
use App\Models\RiskRegisterHistory;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

/**
 * "FORMAT KETERJADIAN RISIKO" (docs/).
 *
 * Sheet one lists occurrences, not registers: every time a register is marked
 * "sedang terjadi" a risk_register_histories row is written, and a register may be
 * marked again, so one register can contribute several rows. Sheet two is the 5-why
 * form, which stays one row per register.
 */
class FormatKeterjadianRisikoExport implements WithMultipleSheets
{
    protected $startDate;

    protected $endDate;

    protected $userId;

    protected $currently_id;

    public function __construct($startDate, $endDate, $userId, $currently_id)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->userId = $userId;
        $this->currently_id = $currently_id;
    }

    public function sheets(): array
    {
        $arguments = [$this->startDate, $this->endDate, $this->userId, $this->currently_id];

        return [
            new KeterjadianRisikoSheet(...$arguments),
            new KeterjadianAkarPenyebabSheet(...$arguments),
        ];
    }
}

abstract class KeterjadianSheet
{
    /** concatdp1 codes the existing exports treat as "Risiko Prioritas". */
    public const PRIORITAS_CONCATDP = [15, 23, 24, 25, 32, 33, 34, 35, 42, 43, 44, 45, 51, 52, 53, 54, 55];

    protected $data;

    protected $startDate;

    protected $endDate;

    protected $userId;

    protected $currently_id;

    public function __construct($startDate, $endDate, $userId, $currently_id)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->userId = $userId;
        $this->currently_id = $currently_id;
    }

    protected function baseQuery()
    {
        // Qualified, because the occurrence join brings a second user_id column.
        $whosLogin = auth()->user()->can('lihat data semua risk register')
            ? [['risk_registers.user_id', '<>', 0]]
            : [['risk_registers.user_id', auth()->user()->id]];

        return RiskRegister::query()->where($whosLogin);
    }

    /** The column the chosen period is measured against. */
    protected function periodColumn(): string
    {
        return 'risk_registers.tgl_register';
    }

    protected function applyFilters($query)
    {
        if (! empty($this->startDate) && ! empty($this->endDate)) {
            $query->where($this->periodColumn(), '>=', $this->startDate)
                ->where($this->periodColumn(), '<=', Carbon::parse($this->endDate)->addDay(1));
        }
        if (! empty($this->currently_id)) {
            if ($this->currently_id['id'] < 3) {
                $query->where('risk_registers.currently_id', '=', $this->currently_id['id']);
            }
            if ($this->currently_id['id'] == 3) {
                $query->whereIn('risk_registers.concatdp1', self::PRIORITAS_CONCATDP);
            }
        }
        if (! empty($this->userId) && auth()->user()->can('lihat data semua risk register')) {
            $userIds = array_map('intval', explode(',', $this->userId));
            $query->whereIn('risk_registers.user_id', $userIds);
        }

        return $query;
    }

    protected function decorate(AfterSheet $event, int $lastHeaderRow = 1)
    {
        $sheet = $event->sheet->getDelegate();
        $highestRow = $sheet->getHighestRow();
        $highestColumn = $sheet->getHighestColumn();
        $range = 'A1:'.$highestColumn.$highestRow;
        $sheet->getRowDimension(1)->setRowHeight(40);
        $sheet->getStyle($range)->getAlignment()->setWrapText(true);
        $sheet->getStyle($range)->applyFromArray([
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => '000000']]],
            'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
        ]);
        $sheet->getStyle('A1:A'.$highestRow)->applyFromArray([
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
        ]);
        $sheet->getStyle('A1:'.$highestColumn.$lastHeaderRow)->applyFromArray([
            'font' => ['bold' => true, 'size' => 11],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
            'borders' => ['outline' => ['borderStyle' => Border::BORDER_THIN]],
            'fill' => [
                'fillType' => Fill::FILL_GRADIENT_LINEAR,
                'rotation' => 90,
                'startColor' => ['argb' => 'D9E1F2'],
                'endColor' => ['argb' => 'D9E1F2'],
            ],
        ]);
    }
}

/** Sheet 1: one row per recorded occurrence. */
class KeterjadianRisikoSheet extends KeterjadianSheet implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithTitle
{
    /**
     * A row is an occurrence, so the period covers when the risk occurred, not when its
     * register was opened. A 2024 register that occurs in 2025 belongs to the 2025 file.
     */
    protected function periodColumn(): string
    {
        return 'risk_register_histories.created_at';
    }

    public function query()
    {
        $subquery = $this->baseQuery()
            // Same rows RiskOccurrenceModal counts as occurrences: a status change to
            // "sedang terjadi", or an old history row written before event_type existed.
            ->join('risk_register_histories', function ($join) {
                $join->on('risk_register_histories.risk_register_id', '=', 'risk_registers.id')
                    ->where('risk_register_histories.currently_id', '=', 1)
                    ->where(function ($where) {
                        $where->whereNull('risk_register_histories.event_type')
                            ->orWhere('risk_register_histories.event_type', RiskRegisterHistory::EVENT_STATUS_CHANGED);
                    });
            })
            ->leftJoin('indikator_fitur4s', 'indikator_fitur4s.id', 'risk_registers.indikator_fitur4_id')
            ->leftJoin('locations', 'locations.id', 'indikator_fitur4s.location_id')
            ->leftJoin('risk_varieties', 'risk_varieties.id', 'risk_registers.risk_variety_id')
            ->leftJoin('risk_types', 'risk_types.id', 'risk_registers.risk_type_id')
            ->leftJoin('efektifs', 'efektifs.id', 'risk_registers.efektif_id')
            ->leftJoin('users', 'users.id', 'risk_registers.user_id')
            ->leftJoin('request_updates', 'request_updates.risk_register_id', 'risk_registers.id')
            ->leftJoin('verification_admins', 'verification_admins.request_update_id', 'request_updates.id');
        RiskGrading::joinByRiskRegisterYear($subquery, 'risk_gradings', 'risk_registers.concatdp1');
        $subquery->selectRaw(
            'row_number() OVER (ORDER BY risk_register_histories.created_at ASC, risk_register_histories.id ASC) AS `Nomor`, '.
            'DATE_FORMAT(risk_register_histories.created_at, "%d-%m-%Y %H:%i") as tgl_keterjadian, '.
            'DATE_FORMAT(request_updates.tgl_perbaikan, "%d-%m-%Y") as tgl_perbaikan, '.
            'DATE_FORMAT(verification_admins.created_at, "%d-%m-%Y") as tgl_supervisi, '.
            'risk_registers.pernyataan_risiko, '.
            'risk_registers.kode_risiko, '.
            'CASE risk_registers.tipe_id WHEN 1 THEN "Klinis" WHEN 2 THEN "Non Klinis" ELSE "" END as jenis_risiko, '.
            // The grading label follows the register type the row belongs to.
            'CASE risk_registers.tipe_id WHEN 1 THEN '.RiskGrading::nameCaseSql('risk_gradings', 'export_lars_dhp_klinis', 'klinis').
            ' ELSE '.RiskGrading::nameCaseSql('risk_gradings', 'export_lars_dhp_nonklinis', 'nonklinis_pergub').' END as peringkat_risiko, '.
            'risk_registers.kronologi, '.
            'COALESCE(request_updates.upaya_pengendalian, risk_registers.pengendalian_risiko) as pengendalian, '.
            'efektifs.name as efektif, '.
            'risk_varieties.name as jenis_insiden, '.
            'risk_types.name as tipe_insiden, '.
            'risk_registers.kendala, '.
            // Recorded with the occurrence; the actual impact score falls back to osd4.
            'COALESCE(NULLIF(JSON_UNQUOTE(JSON_EXTRACT(risk_register_histories.snapshot, "$.dampak_kejadian")), "null"), risk_registers.osd4_dampak) as dampak_aktual, '.
            'users.name as pemilik_name, '.
            // The PICs behind risk_registers.pic_id are what the other exports call the
            // related unit; the indicator location is only a fallback.
            'COALESCE((SELECT GROUP_CONCAT(unit_pics.name SEPARATOR ", ") FROM pics unit_pics '.
            'WHERE FIND_IN_SET(unit_pics.id, risk_registers.pic_id)), locations.name) as unit_terkait, '.
            'risk_registers.dokumen_pendukung'
        );
        $this->applyFilters($subquery);
        $query = DB::query()
            ->select(
                'Nomor', 'tgl_keterjadian', 'tgl_perbaikan', 'tgl_supervisi', 'pernyataan_risiko', 'kode_risiko',
                'jenis_risiko', 'peringkat_risiko', 'kronologi', 'pengendalian', 'efektif', 'jenis_insiden',
                'tipe_insiden', 'kendala', 'dampak_aktual', 'pemilik_name', 'unit_terkait', 'dokumen_pendukung'
            )
            ->fromSub($subquery, 'sub')
            ->orderBy('sub.Nomor', 'ASC');
        $this->data = $query->get();

        return $query;
    }

    public function title(): string
    {
        return 'Keterjadian Risiko';
    }

    public function headings(): array
    {
        return [[
            'No',
            'Tanggal Keterjadian',
            "Tanggal \n Perbaikan",
            'Tanggal Supervisi',
            'Pernyataan Risiko',
            'Kode Risiko',
            "Jenis Risiko\n  (Klinis/ Non Klinis)",
            'Peringkat Risiko',
            'Kronologi Kejadian',
            'Pengendalian / Penanganan',
            'Pengendalian & Penanganan Sudah Efektif? (Ya / Tidak Kalau Tidak Berikan Alasannya)',
            'Jenis Insiden',
            'Tipe Insiden',
            'Kendala',
            'Skor Dampak Aktual',
            'Pemilik Risiko',
            'Unit Terkait',
            'Dokumen Pendukung ( data berupa link)',
        ]];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 4, 'B' => 20, 'C' => 18, 'D' => 18, 'E' => 65, 'F' => 20, 'G' => 18, 'H' => 20, 'I' => 45,
            'J' => 45, 'K' => 35, 'L' => 25, 'M' => 25, 'N' => 30, 'O' => 45, 'P' => 30, 'Q' => 30, 'R' => 35,
        ];
    }

    public function registerEvents(): array
    {
        return [AfterSheet::class => function (AfterSheet $event) {
            $this->decorate($event);
        }];
    }
}

/** Sheet 2: the 5-why form, one row per register that has one. */
class KeterjadianAkarPenyebabSheet extends KeterjadianSheet implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithTitle
{
    public function query()
    {
        $subquery = $this->baseQuery()
            ->join('formulir_rcas', 'formulir_rcas.risk_register_id', 'risk_registers.id')
            ->leftJoin('users', 'users.id', 'risk_registers.user_id')
            ->selectRaw(
                'row_number() OVER (ORDER BY risk_registers.kode_risiko ASC, risk_registers.id ASC) AS `Nomor`, '.
                'risk_registers.pernyataan_risiko, '.
                'risk_registers.kode_risiko, '.
                'formulir_rcas.why1, '.
                'formulir_rcas.why2, '.
                'formulir_rcas.why3, '.
                'formulir_rcas.why4, '.
                'formulir_rcas.why5, '.
                'formulir_rcas.akar_penyebab, '.
                'users.name as pemilik_name'
            );
        $this->applyFilters($subquery);
        $query = DB::query()
            ->select('Nomor', 'pernyataan_risiko', 'kode_risiko', 'why1', 'why2', 'why3', 'why4', 'why5', 'akar_penyebab', 'pemilik_name')
            ->fromSub($subquery, 'sub')
            ->orderBy('sub.Nomor', 'ASC');
        $this->data = $query->get();

        return $query;
    }

    public function title(): string
    {
        return 'Akar Penyebab';
    }

    public function headings(): array
    {
        return [[
            'NO', 'PERNYATAAN RISIKO  ', 'KODE RISIKO', 'WHY 1', 'WHY 2', 'WHY 3', 'WHY 4', 'WHY 5', 'AKAR PENYEBAB', 'PEMILIK RISIKO',
        ]];
    }

    public function columnWidths(): array
    {
        return ['A' => 4, 'B' => 65, 'C' => 20, 'D' => 35, 'E' => 35, 'F' => 35, 'G' => 35, 'H' => 35, 'I' => 45, 'J' => 30];
    }

    public function registerEvents(): array
    {
        return [AfterSheet::class => function (AfterSheet $event) {
            $this->decorate($event);
        }];
    }
}
