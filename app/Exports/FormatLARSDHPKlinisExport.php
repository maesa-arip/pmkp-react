<?php

namespace App\Exports;


use App\Models\IndikatorFitur1;
use App\Models\IndikatorFitur2;
use App\Models\IndikatorFitur3;
use App\Models\RiskRegister;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithCharts;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;

use PhpOffice\PhpSpreadsheet\Chart\DataSeries;
use PhpOffice\PhpSpreadsheet\Chart\DataSeriesValues;
use PhpOffice\PhpSpreadsheet\Chart\Legend;
use PhpOffice\PhpSpreadsheet\Chart\PlotArea;
use PhpOffice\PhpSpreadsheet\Chart\Title;
// use PhpOffice\PhpSpreadsheet\Worksheet\Chart;

use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Chart\Legend as ChartLegend;

use PhpOffice\PhpSpreadsheet\Chart\Chart;

use PhpOffice\PhpSpreadsheet\Chart\Properties;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Settings;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

use PhpOffice\PhpSpreadsheet\Chart\Axis as ChartAxis;

use PhpOffice\PhpSpreadsheet\Chart\ChartColor;


class FormatLARSDHPKlinisExport implements WithMultipleSheets
{
     protected $startDate;
    protected $endDate;
    protected $userId;
    protected $currently_id;

    public function __construct($startDate, $endDate, $userId,$currently_id)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->userId = $userId;
        $this->currently_id = $currently_id;
    }
    public function sheets(): array
    {
        return [
            new Sheet1($this->startDate, $this->endDate, $this->userId,$this->currently_id),
            new Sheet2($this->startDate, $this->endDate, $this->userId,$this->currently_id),
            new Sheet3($this->startDate, $this->endDate, $this->userId,$this->currently_id),
            new Sheet4($this->startDate, $this->endDate, $this->userId,$this->currently_id),
            new Sheet5($this->startDate, $this->endDate, $this->userId,$this->currently_id),
            new Sheet6($this->startDate, $this->endDate, $this->userId,$this->currently_id),
            new Sheet7($this->startDate, $this->endDate, $this->userId,$this->currently_id),
            new Sheet8($this->startDate, $this->endDate, $this->userId,$this->currently_id),
        ];
    }
}

class Sheet1 implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithTitle
{
    /**
     * @return \Illuminate\Support\Collection
     */
    protected $data;
     protected $startDate;
    protected $endDate;
    protected $userId;
    protected $currently_id;

    public function __construct($startDate, $endDate, $userId,$currently_id)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->userId = $userId;
        $this->currently_id = $currently_id;
    }
    public function query()
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $subquery = RiskRegister::query()
            ->leftJoin('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
            ->leftJoin('indikator_fitur4s', 'indikator_fitur4s.id', 'risk_registers.indikator_fitur4_id')
            ->leftJoin('indikator_fitur3s', 'indikator_fitur3s.id', 'indikator_fitur4s.indikator_fitur3_id')
            ->leftJoin('indikator_fitur2s', 'indikator_fitur2s.id', 'indikator_fitur3s.indikator_fitur2_id')
            ->leftJoin('indikator_fitur1s', 'indikator_fitur1s.id', 'indikator_fitur2s.indikator_fitur1_id')
            ->leftJoin('pics', 'pics.id', 'risk_registers.pic_id')
            ->leftJoin('users', 'users.id', 'risk_registers.user_id')
            ->selectRaw(
                'indikator_fitur1s.name as sasaran, ' .
                    'indikator_fitur2s.name as program, ' .
                    'indikator_fitur3s.name as kegiatan, ' .
                    'indikator_fitur3s.tujuan, ' .
                    'indikator_fitur4s.name as indikator, ' .
                    'users.name as pemilik_name, ' .
                    'risk_categories.name as kategori_risiko, ' .
                    'row_number() OVER (ORDER BY risk_registers.osd1_dampak * risk_registers.osd1_probabilitas * risk_registers.osd1_controllability DESC) AS `Peringkat`'
            )
            ->where('tipe_id', 1)
            ->where($whosLogin);
        if (!empty($this->startDate) && !empty($this->endDate)) {
            $subquery->where('risk_registers.tgl_register', '>=', $this->startDate)
                ->where('risk_registers.tgl_register', '<=', Carbon::parse($this->endDate)->addDay());
        }
        if (!empty($this->currently_id)) {
            if ($this->currently_id['id'] <3) {
                $subquery->where('risk_registers.currently_id', '=', $this->currently_id['id']);
            }
            if ($this->currently_id['id'] == 3) {
                $subquery->whereIn('risk_registers.concatdp1', [14,15,23,24,25,31,32,33,34,35,41,42,43,44,45,51,52,53,54,55]);
            }
        }
        if (!empty($this->userId) && auth()->user()->can('lihat data semua risk register')) {
            $userIds = !empty($this->userId) ? array_map('intval', explode(',', $this->userId)) : [];
            $subquery->whereIn('risk_registers.user_id', $userIds);
        }
        $query = DB::query()
            ->select('Peringkat', 'sasaran', 'program', 'kegiatan', 'tujuan', 'indikator', 'pemilik_name', 'kategori_risiko')
            ->fromSub($subquery, 'sub')
            ->orderBy('sub.Peringkat', 'ASC');

        $this->data = $query->get();
        return $query;
    }
    public function title(): string
    {
        return 'KEGIATAN & SASARAN';
    }
    public function headings(): array
    {
        return [
            ['NO', 'SASARAN STRATEGIS', 'PROGRAM', 'KEGIATAN', 'TUJUAN KEGIATAN (S.M.A.R.T)-', 'INDIKATOR', 'PEMILIK RISIKO', 'KATEGORI RISIKO'],
        ];
    }
    public function columnWidths(): array
    {
        return [
            'A' => 4,
            'B' => 65,
            'C' => 65,
            'D' => 65,
            'E' => 65,
            'F' => 65,
            'G' => 30,
            'H' => 30,
        ];
    }
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $event->sheet->getDelegate()->getRowDimension(1)->setRowHeight(30);
                $highestRow = $event->sheet->getHighestRow();
                $highestColumn = $event->sheet->getHighestColumn();
                $range = 'A1:' . $highestColumn . $highestRow;
                $rangeA = 'A1:' . 'A' . $highestRow;
                $event->sheet->getDelegate()->getStyle($range)->getAlignment()->setWrapText(true);
                $event->sheet->getDelegate()->getStyle($range)->applyFromArray([
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN,
                            'color' => ['rgb' => '000000'],
                        ],
                    ],
                    'alignment' => [
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                ]);
                $styleHeader = [
                    'font' => [
                        'bold' => true,
                        'size' => 11,
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                    'borders' => [
                        'outline' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        ],
                    ],
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => 'FFFFFFFF',
                        ],
                        'endColor' => [
                            'argb' => 'FFFFFFFF',
                        ],
                    ],
                ];

                $event->sheet->getDelegate()->getStyle($rangeA)->applyFromArray([
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                    ],
                ]);
                $event->sheet->getDelegate()->getStyle('A1:H1')->applyFromArray($styleHeader);
            },
        ];
    }
}
class Sheet2 implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithTitle
{
    /**
     * @return \Illuminate\Support\Collection
     */
    protected $data;
     protected $startDate;
    protected $endDate;
    protected $userId;
    protected $currently_id;

    public function __construct($startDate, $endDate, $userId,$currently_id)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->userId = $userId;
        $this->currently_id = $currently_id;
    }
    public function query()
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
    //     $subquery = RiskRegister::query()
    //         ->leftJoin('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
    //         ->leftJoin('indikator_fitur4s', 'indikator_fitur4s.id', 'risk_registers.indikator_fitur4_id')
    //         ->leftJoin('indikator_fitur3s', 'indikator_fitur3s.id', 'indikator_fitur4s.indikator_fitur3_id')
    //         ->leftJoin('indikator_fitur2s', 'indikator_fitur2s.id', 'indikator_fitur3s.indikator_fitur2_id')
    //         ->leftJoin('indikator_fitur1s', 'indikator_fitur1s.id', 'indikator_fitur2s.indikator_fitur1_id')
    //         ->leftJoin('identification_sources', 'identification_sources.id', 'risk_registers.identification_source_id')
    //         ->leftJoin('sasaran_strategis', 'sasaran_strategis.id', 'indikator_fitur4s.sasaran_strategis_id')
    //         ->leftJoin('risk_varieties', 'risk_varieties.id', 'risk_registers.risk_variety_id')
    //         ->leftJoin('risk_types', 'risk_types.id', 'risk_registers.risk_type_id')
    //         ->leftJoin('impact_values', 'impact_values.id', 'risk_registers.osd1_dampak')
    //         ->leftJoin('probability_values', 'probability_values.id', 'risk_registers.osd1_probabilitas')
    //         ->leftJoin('control_values', 'control_values.id', 'risk_registers.osd1_controllability')
    //         ->leftJoin('impact_values as sa1', 'sa1.id', 'risk_registers.osd2_dampak')
    //         ->leftJoin('probability_values as sa2', 'sa2.id', 'risk_registers.osd2_probabilitas')
    //         ->leftJoin('control_values as sa3', 'sa3.id', 'risk_registers.osd2_controllability')
    //         ->leftJoin('pics', 'pics.id', 'risk_registers.pic_id')
    //         ->leftJoin('users', 'users.id', 'risk_registers.user_id')
    //         ->leftJoin('locations', 'locations.id', 'pics.location_id')
    //         ->leftJoin('jenis_sebabs', 'jenis_sebabs.id', 'risk_registers.jenis_sebab_id')
    //         ->leftJoin('risk_gradings', 'risk_gradings.kode', 'risk_registers.concatdp1')
    //         ->leftJoin('risk_gradings AS grading2', 'grading2.kode', 'risk_registers.concatdp2')
    //         ->leftJoin('risk_gradings AS grading3', 'grading3.kode', 'risk_registers.concatdp3')
    //         ->leftJoin('risk_gradings AS grading4', 'grading4.kode', 'risk_registers.concatdp4')
    //         ->leftJoin('opsi_pengendalians', 'opsi_pengendalians.id', 'risk_registers.opsi_pengendalian_id')
    //         ->leftJoin('pembiayaan_risikos', 'pembiayaan_risikos.id', 'risk_registers.pembiayaan_risiko_id')
    //         ->leftjoin("pics as sa", \DB::raw("FIND_IN_SET(sa.id,risk_registers.pic_id)"), ">", \DB::raw("'0'"))
    //         ->selectRaw('
    //         risk_registers.id,
    //         DATE_FORMAT(risk_registers.tgl_register, "%d-%m-%Y") AS formatted_tgl_register,
    //         risk_registers.tipe_id,
    //     row_number() OVER (ORDER BY risk_registers.osd1_dampak * risk_registers.osd1_probabilitas * risk_registers.osd1_controllability DESC) AS `Peringkat`,
    //     indikator_fitur1s.name as sasaran,
    //     indikator_fitur2s.name as program,
    //     indikator_fitur3s.name as kegiatan,
    //     indikator_fitur3s.tujuan,
    //     indikator_fitur4s.name as indikator,
    //     GROUP_CONCAT(sa.name) as picsname,
    //     risk_registers.sebab,
    //     CASE
    //             WHEN risk_registers.risk_category_id = 5 THEN CONCAT("RSO.", RIGHT(YEAR(risk_registers.tgl_register), 2),".02.43.",risk_registers.id)
    //             WHEN risk_registers.risk_category_id <> 5 THEN CONCAT("ROO.", RIGHT(YEAR(risk_registers.tgl_register), 2),".02.43.",risk_registers.id)
    //         END AS Kode,
    //     risk_registers.resiko,
    //     risk_registers.dampak,
    //     risk_registers.pernyataan_risiko,
    //     risk_registers.pengendalian_risiko,
    //     risk_registers.osd1_dampak,
    //     risk_registers.osd1_probabilitas,
    //     CONCAT(risk_registers.osd1_dampak, risk_registers.osd1_probabilitas) AS concatdp,
    //     risk_registers.osd1_inherent,
    //     risk_gradings.name as grading_name,
    //     CASE
    //         WHEN risk_registers.perlu_penanganan_id = 1 THEN "Ya"
    //         WHEN risk_registers.perlu_penanganan_id = 2 THEN "Tidak"
    //         ELSE ""
    //     END AS `PerluPenanganan`,
    //     opsi_pengendalians.name as opsi,
    //     risk_registers.penanganan_risiko as uraian,
    //     pembiayaan_risikos.name as pembiayaan,
    //     risk_registers.osd2_dampak,
    //     osd2_probabilitas,
    //     risk_registers.osd2_inherent,
    //     grading2.name as grading2_name,
    //     users.name as pemilik_name,
    //     CONCAT(risk_registers.target_waktu, " Hari") AS target_waktu,
    //     jenis_sebabs.name as jenis_sebab,
    //     identification_sources.name as identifikasi,
    //     risk_varieties.name as jenis,
    //     risk_types.name as tipe,
    //     risk_registers.osd3_dampak,
    //     osd3_probabilitas,
    //     risk_registers.osd3_inherent,
    //     grading3.name as grading3_name,
    //     risk_registers.osd4_dampak,
    //     osd4_probabilitas,
    //     risk_registers.osd4_inherent,
    //     grading4.name as grading4_name,
    // ')
    //         ->groupBy(
    //             'risk_registers.id',
    //             'risk_registers.tgl_register',
    //             'indikator_fitur1s.name',
    //             'indikator_fitur2s.name',
    //             'indikator_fitur3s.name',
    //             'indikator_fitur3s.tujuan',
    //             'indikator_fitur4s.name',
    //             // 'sa.name',
    //             'risk_registers.sebab',
    //             'risk_registers.resiko',
    //             'risk_registers.dampak',
    //             'risk_registers.pernyataan_risiko',
    //             'risk_registers.pengendalian_risiko',
    //             'risk_registers.penanganan_risiko',
    //             'risk_registers.osd1_dampak',
    //             'risk_registers.osd1_probabilitas',
    //             'risk_registers.osd1_inherent',
    //             'risk_gradings.name',
    //             'risk_registers.perlu_penanganan_id',
    //             'opsi_pengendalians.name',
    //             'risk_registers.pengendalian_risiko',
    //             'pembiayaan_risikos.name',
    //             'risk_registers.osd2_dampak',
    //             'osd2_probabilitas',
    //             'risk_registers.osd2_inherent',
    //             'grading2.name',
    //             'users.name',
    //             'risk_registers.target_waktu',
    //             'jenis_sebabs.name',
    //             'identification_sources.name',
    //             'risk_varieties.name',
    //             'risk_types.name',
    //             'risk_registers.osd3_dampak',
    //             'osd3_probabilitas',
    //             'risk_registers.osd3_inherent',
    //             'grading3.name',
    //             'risk_registers.osd4_dampak',
    //             'osd4_probabilitas',
    //             'risk_registers.osd4_inherent',
    //             'grading4.name'
    //         )
    //         ->where('tipe_id', 1)
    //         ->where($whosLogin);
    $subquery = RiskRegister::query()
            ->leftJoin('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
            ->leftJoin('indikator_fitur4s', 'indikator_fitur4s.id', 'risk_registers.indikator_fitur4_id')
            ->leftJoin('indikator_fitur3s', 'indikator_fitur3s.id', 'indikator_fitur4s.indikator_fitur3_id')
            ->leftJoin('indikator_fitur2s', 'indikator_fitur2s.id', 'indikator_fitur3s.indikator_fitur2_id')
            ->leftJoin('indikator_fitur1s', 'indikator_fitur1s.id', 'indikator_fitur2s.indikator_fitur1_id')
            ->leftJoin('identification_sources', 'identification_sources.id', 'risk_registers.identification_source_id')
            ->leftJoin('sasaran_strategis', 'sasaran_strategis.id', 'indikator_fitur4s.sasaran_strategis_id')
            ->leftJoin('risk_varieties', 'risk_varieties.id', 'risk_registers.risk_variety_id')
            ->leftJoin('risk_types', 'risk_types.id', 'risk_registers.risk_type_id')
            ->leftJoin('impact_values', 'impact_values.id', 'risk_registers.osd1_dampak')
            ->leftJoin('probability_values', 'probability_values.id', 'risk_registers.osd1_probabilitas')
            ->leftJoin('control_values', 'control_values.id', 'risk_registers.osd1_controllability')
            ->leftJoin('impact_values as sa1', 'sa1.id', 'risk_registers.osd2_dampak')
            ->leftJoin('probability_values as sa2', 'sa2.id', 'risk_registers.osd2_probabilitas')
            ->leftJoin('control_values as sa3', 'sa3.id', 'risk_registers.osd2_controllability')
            ->leftJoin('pics', 'pics.id', 'risk_registers.pic_id')
            ->leftJoin('users', 'users.id', 'risk_registers.user_id')
            ->leftJoin('locations', 'locations.id', 'pics.location_id')
            ->leftJoin('jenis_sebabs', 'jenis_sebabs.id', 'risk_registers.jenis_sebab_id')
            ->leftJoin('risk_gradings', 'risk_gradings.kode', 'risk_registers.concatdp1')
            ->leftJoin('risk_gradings AS grading2', 'grading2.kode', 'risk_registers.concatdp2')
            ->leftJoin('risk_gradings AS grading3', 'grading3.kode', 'risk_registers.concatdp3')
            ->leftJoin('risk_gradings AS grading4', 'grading4.kode', 'risk_registers.concatdp4')
            ->leftJoin('opsi_pengendalians', 'opsi_pengendalians.id', 'risk_registers.opsi_pengendalian_id')
            ->leftJoin('pembiayaan_risikos', 'pembiayaan_risikos.id', 'risk_registers.pembiayaan_risiko_id')
            ->leftjoin("pics as sa", \DB::raw("FIND_IN_SET(sa.id,risk_registers.pic_id)"), ">", \DB::raw("'0'"))
            ->selectRaw('
            risk_registers.id,
            DATE_FORMAT(risk_registers.tgl_register, "%d-%m-%Y") AS formatted_tgl_register,
            risk_registers.tipe_id,
        row_number() OVER (ORDER BY risk_registers.osd1_dampak * risk_registers.osd1_probabilitas * risk_registers.osd1_controllability DESC) AS `Peringkat`,
        indikator_fitur1s.name as sasaran,
        indikator_fitur2s.name as program,
        indikator_fitur3s.name as kegiatan,
        indikator_fitur3s.tujuan,
        indikator_fitur4s.name as indikator,
        GROUP_CONCAT(sa.name) as picsname,
        risk_registers.sebab,
        risk_registers.kode_risiko as Kode,
        risk_registers.resiko,
        risk_registers.dampak,
        risk_registers.pernyataan_risiko,
        risk_registers.pengendalian_risiko,
        risk_registers.osd1_dampak,
        risk_registers.osd1_probabilitas,
        CONCAT(risk_registers.osd1_dampak, risk_registers.osd1_probabilitas) AS concatdp,
        risk_registers.osd1_inherent,
        risk_gradings.name as grading_name,
        CASE
            WHEN risk_registers.perlu_penanganan_id = 1 THEN "Ya"
            WHEN risk_registers.perlu_penanganan_id = 2 THEN "Tidak"
            ELSE ""
        END AS `PerluPenanganan`,
        opsi_pengendalians.name as opsi,
        risk_registers.penanganan_risiko as uraian,
        pembiayaan_risikos.name as pembiayaan,
        risk_registers.osd2_dampak,
        osd2_probabilitas,
        risk_registers.osd2_inherent,
        grading2.name as grading2_name,

        

        users.name as pemilik_name,
        CONCAT(risk_registers.target_waktu, " Hari") AS target_waktu,
        jenis_sebabs.name as jenis_sebab,
        identification_sources.name as identifikasi,
        risk_varieties.name as jenis,
        risk_types.name as tipe,
        risk_registers.osd3_dampak,
        osd3_probabilitas,
        risk_registers.osd3_inherent,
        grading3.name as grading3_name,

        risk_registers.osd4_dampak,
        osd4_probabilitas,
        risk_registers.osd4_inherent,
        grading4.name as grading4_name,
        risk_registers.kronologi,
        CASE
            WHEN risk_registers.is_risiko_lama = 1 THEN "Risiko Lama"
            WHEN risk_registers.is_risiko_lama = 0 THEN "Risiko Baru"
            ELSE ""
        END AS `status_risiko`
    ')
            ->groupBy(
                'risk_registers.id',
                'risk_registers.tgl_register',
                'indikator_fitur1s.name',
                'indikator_fitur2s.name',
                'indikator_fitur3s.name',
                'indikator_fitur3s.tujuan',
                'indikator_fitur4s.name',
                // 'sa.name',
                'risk_registers.sebab',
                'risk_registers.resiko',
                'risk_registers.dampak',
                'risk_registers.pernyataan_risiko',
                'risk_registers.pengendalian_risiko',
                'risk_registers.penanganan_risiko',
                'risk_registers.osd1_dampak',
                'risk_registers.osd1_probabilitas',
                'risk_registers.osd1_inherent',
                'risk_gradings.name',
                'risk_registers.perlu_penanganan_id',
                'opsi_pengendalians.name',
                'risk_registers.pengendalian_risiko',
                'pembiayaan_risikos.name',
                'risk_registers.osd2_dampak',
                'osd2_probabilitas',
                'risk_registers.osd2_inherent',
                'grading2.name',

                

                'users.name',
                'risk_registers.target_waktu',
                'jenis_sebabs.name',
                'identification_sources.name',
                'risk_varieties.name',
                'risk_types.name',
                'risk_registers.osd3_dampak',
                'osd3_probabilitas',
                'risk_registers.osd3_inherent',
                'grading3.name',

                'risk_registers.osd4_dampak',
                'osd4_probabilitas',
                'risk_registers.osd4_inherent',
                'grading4.name'
            )
            ->where('tipe_id', 1)
            ->where($whosLogin);

        if (!empty($this->startDate) && !empty($this->endDate)) {
            $subquery->where('risk_registers.tgl_register', '>=', $this->startDate)
                ->where('risk_registers.tgl_register', '<=', Carbon::parse($this->endDate)->addDay());
        }
        if (!empty($this->currently_id)) {
            if ($this->currently_id['id'] <3) {
                $subquery->where('risk_registers.currently_id', '=', $this->currently_id['id']);
            }
            if ($this->currently_id['id'] == 3) {
                $subquery->whereIn('risk_registers.concatdp1', [14,15,23,24,25,31,32,33,34,35,41,42,43,44,45,51,52,53,54,55]);
            }
        }
        if (!empty($this->userId) && auth()->user()->can('lihat data semua risk register')) {
            $userIds = !empty($this->userId) ? array_map('intval', explode(',', $this->userId)) : [];
            $subquery->whereIn('risk_registers.user_id', $userIds);
        }
        $query = DB::query()
            ->select(
                'Peringkat',
                'formatted_tgl_register',
                'sasaran',
                'program',
                'kegiatan',
                'tujuan',
                'indikator',
                'picsname',
                'sebab',
                'Kode',
                'resiko',
                'dampak',
                'pernyataan_risiko',
                'pengendalian_risiko',
                'osd1_dampak',
                'osd1_probabilitas',
                'concatdp',
                'osd1_inherent',
                'grading_name',
                'PerluPenanganan',
                'opsi',
                'uraian',
                'pembiayaan',
                'osd2_dampak',
                'osd2_probabilitas',
                'osd2_inherent',
                'grading2_name',
                'pemilik_name',
                'target_waktu',
                'jenis_sebab',
                'identifikasi',
                'jenis',
                'tipe',
                'osd3_dampak',
                'osd3_probabilitas',
                'osd3_inherent',
                'grading3_name',
                'osd4_dampak',
                'osd4_probabilitas',
                'osd4_inherent',
                'grading4_name',
                'kronologi',
                'status_risiko'
            )
            ->fromSub($subquery, 'sub')
            ->orderBy('sub.Peringkat', 'ASC');
        $this->data = $query->get();
        return $query;
    }
    public function title(): string
    {
        return 'REGISTER RISIKO';
    }
    public function headings(): array
    {
        return [
            ['No', 'TANGGAL REGISTER', 'SASARAN STRATEGIS', 'PROGRAM', 'NAMA KEGIATAN (PROSES BISNIS)', 'TUJUAN KEGIATAN*)', 'INDIKATOR', 'PIC UNIT TERKAIT', 'IDENTIFIKASI RISIKO', 'IDENTIFIKASI RISIKO', 'IDENTIFIKASI RISIKO', 'IDENTIFIKASI RISIKO', 'IDENTIFIKASI RISIKO', ' PENGENDALIAN YANG SUDAH ADA SAAT INI', 'ANALISA RISIKO INHERENT', 'ANALISA RISIKO INHERENT', 'ANALISA RISIKO INHERENT', 'ANALISA RISIKO INHERENT', 'ANALISA RISIKO INHERENT', 'EVALUASI RISIKO', 'ALTERNATIF TEKNIK PENANGANAN RISIKO', 'ALTERNATIF TEKNIK PENANGANAN RISIKO', 'ALTERNATIF TEKNIK PENANGANAN RISIKO', 'RISIKO RESIDUAL', 'RISIKO RESIDUAL', 'RISIKO RESIDUAL', 'RISIKO RESIDUAL', 'PEMILIK RISIKO', 'TARGET WAKTU', 'JENIS PENYEBAB','SUMBER IDENTIFIKASI','JENIS INSIDEN','TIPE INSIDEN','RISIKO TREATED', 'RISIKO TREATED', 'RISIKO TREATED', 'RISIKO TREATED','RISIKO ACTUAL', 'RISIKO ACTUAL', 'RISIKO ACTUAL', 'RISIKO ACTUAL','SKENARIO','STATUS RISIKO'],

            ['No', 'TANGGAL REGISTER', 'SASARAN STRATEGIS', 'PROGRAM', 'NAMA KEGIATAN (PROSES BISNIS)', 'TUJUAN KEGIATAN*)', 'INDIKATOR', 'PIC UNIT TERKAIT', 'SEBAB', 'KODE RISIKO', 'RISIKO', 'DAMPAK', 'PERNYATAAN RISIKO', ' PENGENDALIAN YANG SUDAH ADA SAAT INI', 'DAMPAK', 'PROBABILITAS', 'CONCAT (D & P)', 'SKOR', 'PERINGKAT RISIKO', 'APAKAH PERLU PENANGANAN RISIKO ?', 'OPSI TEKNIK PENGENDALIAN RISIKO', 'URAIAN PENANGANAN RISIKO', 'PEMBIAYAAN RISIKO', 'DAMPAK', 'PROBABILITAS', 'SKOR', 'PERINGKAT RISIKO', 'PEMILIK RISIKO', 'TARGET WAKTU', 'JENIS PENYEBAB','SUMBER IDENTIFIKASI','JENIS INSIDEN','TIPE INSIDEN','DAMPAK', 'PROBABILITAS', 'SKOR', 'PERINGKAT RISIKO','DAMPAK', 'PROBABILITAS', 'SKOR', 'PERINGKAT RISIKO','SKENARIO','STATUS RISIKO'],

            ['(1)', '(2)', '(3)', '(4)', '(5)', '(6)', '(7)', '(8)', '(9)', '(10)', '(11)', '(12)', '(13)', '(14)', '(15)', '(16)', '(17)', '(18)', '(19)', '(20)', '(21)', '(22)', '(23)', '(24)', '(25)', '(26)', '(27)', '(28)', '(29)', '(30)','(31)','(32)','(33)', '(34)', '(35)', '(36)', '(37)', '(38)', '(39)', '(40)', '(41)','(42)','(43)'],
        ];
    }
    public function columnWidths(): array
    {
        return [
            'A' => 4,
            'B' => 20,
            'C' => 45,
            'D' => 45,
            'E' => 45,
            'F' => 45,
            'G' => 45,
            'H' => 20,
            'I' => 45,
            'J' => 20,
            'K' => 45,
            'L' => 45,
            'M' => 65,
            'N' => 40,
            'O' => 12,
            'P' => 15,
            'Q' => 15,
            'R' => 12,
            'S' => 12,
            'T' => 20,
            'U' => 20,
            'V' => 40,
            'W' => 15,
            'X' => 12,
            'Y' => 15,
            'Z' => 15,
            'AA' => 12,
            'AB' => 20,
            'AC' => 12,
            'AD' => 12,
            'AE' => 20,
            'AF' => 20,
            'AG' => 20,
            'AH' => 12,
            'AI' => 15,
            'AJ' => 15,
            'AK' => 12,
            'AL' => 12,
            'AM' => 15,
            'AN' => 15,
            'AO' => 12,
            'AP' => 15,
            'AQ' => 15,
        ];
    }
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $event->sheet->getDelegate()->getRowDimension(1)->setRowHeight(30);
                $highestRow = $event->sheet->getHighestRow();
                $highestColumn = $event->sheet->getHighestColumn();
                $range = 'A1:' . $highestColumn . $highestRow;
                $rangeE = 'E4:' . 'E' . $highestRow;
                $rangeJ = 'J4:' . 'J' . $highestRow;
                $rangeOT = 'O4:' . 'T' . $highestRow;
                $rangeXAA = 'X4:' . 'AA' . $highestRow;

                $rangeO = 'O4:' . 'O' . $highestRow;
                $rangeP = 'P4:' . 'P' . $highestRow;
                $rangeS = 'S4:' . 'S' . $highestRow;
                $rangeX = 'X4:' . 'X' . $highestRow;
                $rangeY = 'Y4:' . 'Y' . $highestRow;
                $rangeAA = 'AA4:' . 'AA' . $highestRow;
                $event->sheet->getDelegate()->getStyle($range)->getAlignment()->setWrapText(true);
                $event->sheet->getDelegate()->getStyle($range)->applyFromArray([
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN,
                            'color' => ['rgb' => '000000'],
                        ],
                    ],
                    'alignment' => [
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                ]);
                $styleHeader = [
                    'font' => [
                        'bold' => true,
                        'size' => 11,
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                    'borders' => [
                        'outline' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        ],
                    ],
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => 'FCE4D6',
                        ],
                        'endColor' => [
                            'argb' => 'FCE4D6',
                            // 'argb' => 'FFFFFFFF',
                            // 'argb' => 'FFFFFFFF',
                        ],
                    ],
                ];
                $styleHeader2 = [
                    'font' => [
                        'bold' => true,
                        'size' => 11,
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                    'borders' => [
                        'outline' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        ],
                    ],
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => 'D8D8D8',
                        ],
                        'endColor' => [
                            'argb' => 'D8D8D8',
                        ],
                    ],
                ];
                $styleHeader3 = [
                    'font' => [
                        'bold' => true,
                        'size' => 11,
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                    'borders' => [
                        'outline' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        ],
                    ],
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => 'FFD966',
                        ],
                        'endColor' => [
                            'argb' => 'FFD966',
                        ],
                    ],
                ];
                $styleHeader4 = [
                    'font' => [
                        'bold' => true,
                        'size' => 11,
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                    'borders' => [
                        'outline' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        ],
                    ],
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => '92D050',
                        ],
                        'endColor' => [
                            'argb' => '92D050',
                        ],
                    ],
                ];
                $styleStandar = [
                    'font' => [
                        'bold' => true,
                        'size' => 11,
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                    'borders' => [
                        'outline' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        ],
                    ],
                ];
                $styleST = [
                    $styleStandar,
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => 'FF0D0D', //Merah
                        ],
                    ],
                ];
                $styleT = [
                    $styleStandar,
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => 'FFC000', // Orange
                        ],
                    ],
                ];
                $styleM = [
                    $styleStandar,
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => 'FFFF00', // Kuning
                        ],
                    ],
                ];
                $styleR = [
                    $styleStandar,
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => '00B0F0', // Biru
                        ],
                    ],
                ];
                $styleSR = [
                    $styleStandar,
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => '00B050', //Hijau
                        ],
                    ],
                ];
                $worksheet = $event->sheet->getDelegate();
                $startRow = 4; // Assuming your data starts from row 3
                $endRow = $highestRow; // You need to determine the highest row based on your data
                for ($row = $startRow; $row <= $endRow; $row++) {
                    foreach (range($startRow, $endRow) as $row) {
                        $formula = '=(O' . $row . '*P' . $row . ')';
                        $worksheet->getCell('R' . $row)->setValue($formula);
                        $formula1 = '=(X' . $row . '*Y' . $row . ')';
                        $worksheet->getCell('Z' . $row)->setValue($formula1);
                        $formula2 = '=(AH' . $row . '*AI' . $row . ')';
                        $worksheet->getCell('AJ' . $row)->setValue($formula2);
                        $formula3 = '=(AL' . $row . '*AM' . $row . ')';
                        $worksheet->getCell('AN' . $row)->setValue($formula3);
                    
                    }
                }

                // KOLOM O
                $conditional = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional->addCondition(5);
                $conditional->getStyle()->applyFromArray($styleST);
                $conditionalStyles = $event->sheet->getStyle($rangeO)->getConditionalStyles();
                $conditionalStyles[] = $conditional;
                $event->sheet->getStyle($rangeO)->setConditionalStyles($conditionalStyles);

                $conditional2 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional2->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional2->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional2->addCondition(4);
                $conditional2->getStyle()->applyFromArray($styleT);
                $conditional2Styles = $event->sheet->getStyle($rangeO)->getConditionalStyles();
                $conditional2Styles[] = $conditional2;
                $event->sheet->getStyle($rangeO)->setConditionalStyles($conditional2Styles);

                $conditional3 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional3->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional3->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional3->addCondition(3);
                $conditional3->getStyle()->applyFromArray($styleM);
                $conditional3Styles = $event->sheet->getStyle($rangeO)->getConditionalStyles();
                $conditional3Styles[] = $conditional3;
                $event->sheet->getStyle($rangeO)->setConditionalStyles($conditional3Styles);

                $conditional4 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional4->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional4->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional4->addCondition(2);
                $conditional4->getStyle()->applyFromArray($styleSR);
                $conditional4Styles = $event->sheet->getStyle($rangeO)->getConditionalStyles();
                $conditional4Styles[] = $conditional4;
                $event->sheet->getStyle($rangeO)->setConditionalStyles($conditional4Styles);

                $conditional5 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional5->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional5->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional5->addCondition(1);
                $conditional5->getStyle()->applyFromArray($styleR);
                $conditional5Styles = $event->sheet->getStyle($rangeO)->getConditionalStyles();
                $conditional5Styles[] = $conditional5;
                $event->sheet->getStyle($rangeO)->setConditionalStyles($conditional5Styles);


                // KOLOM P
                $conditional = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional->addCondition(5);
                $conditional->getStyle()->applyFromArray($styleST);
                $conditionalStyles = $event->sheet->getStyle($rangeP)->getConditionalStyles();
                $conditionalStyles[] = $conditional;
                $event->sheet->getStyle($rangeP)->setConditionalStyles($conditionalStyles);

                $conditional2 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional2->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional2->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional2->addCondition(4);
                $conditional2->getStyle()->applyFromArray($styleT);
                $conditional2Styles = $event->sheet->getStyle($rangeP)->getConditionalStyles();
                $conditional2Styles[] = $conditional2;
                $event->sheet->getStyle($rangeP)->setConditionalStyles($conditional2Styles);

                $conditional3 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional3->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional3->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional3->addCondition(3);
                $conditional3->getStyle()->applyFromArray($styleM);
                $conditional3Styles = $event->sheet->getStyle($rangeP)->getConditionalStyles();
                $conditional3Styles[] = $conditional3;
                $event->sheet->getStyle($rangeP)->setConditionalStyles($conditional3Styles);

                $conditional4 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional4->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional4->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional4->addCondition(2);
                $conditional4->getStyle()->applyFromArray($styleSR);
                $conditional4Styles = $event->sheet->getStyle($rangeP)->getConditionalStyles();
                $conditional4Styles[] = $conditional4;
                $event->sheet->getStyle($rangeP)->setConditionalStyles($conditional4Styles);

                $conditional5 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional5->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional5->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional5->addCondition(1);
                $conditional5->getStyle()->applyFromArray($styleR);
                $conditional5Styles = $event->sheet->getStyle($rangeP)->getConditionalStyles();
                $conditional5Styles[] = $conditional5;
                $event->sheet->getStyle($rangeP)->setConditionalStyles($conditional5Styles);

                // KOLOM S
                $conditional = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional->addCondition(14);
                $conditional->setText('EXTREME');
                $conditional->getStyle()->applyFromArray($styleST);
                $conditionalStyles = $event->sheet->getStyle($rangeS)->getConditionalStyles();
                $conditionalStyles[] = $conditional;
                $event->sheet->getStyle($rangeS)->setConditionalStyles($conditionalStyles);

                $conditional2 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional2->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional2->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional2->addCondition(9);
                $conditional2->setText('HIGH');
                $conditional2->getStyle()->applyFromArray($styleM);
                $conditional2Styles = $event->sheet->getStyle($rangeS)->getConditionalStyles();
                $conditional2Styles[] = $conditional2;
                $event->sheet->getStyle($rangeS)->setConditionalStyles($conditional2Styles);

                $conditional3 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional3->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional3->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional3->addCondition(4);
                $conditional3->setText('MODERATE');
                $conditional3->getStyle()->applyFromArray($styleSR);
                $conditional3Styles = $event->sheet->getStyle($rangeS)->getConditionalStyles();
                $conditional3Styles[] = $conditional3;
                $event->sheet->getStyle($rangeS)->setConditionalStyles($conditional3Styles);
                
                $conditional5 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional5->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional5->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional5->addCondition(1);
                $conditional5->setText('SANGAT RENDAH');
                $conditional5->getStyle()->applyFromArray($styleR);
                $conditional5Styles = $event->sheet->getStyle($rangeS)->getConditionalStyles();
                $conditional5Styles[] = $conditional5;
                $event->sheet->getStyle($rangeS)->setConditionalStyles($conditional5Styles);

                $conditional4 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional4->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional4->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional4->addCondition(2);
                $conditional4->setText('LOW');
                $conditional4->getStyle()->applyFromArray($styleR);
                $conditional4Styles = $event->sheet->getStyle($rangeS)->getConditionalStyles();
                $conditional4Styles[] = $conditional4;
                $event->sheet->getStyle($rangeS)->setConditionalStyles($conditional4Styles);

                // KOLOM AA
                $conditional = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional->addCondition(14);
                $conditional->setText('EXTREME');
                $conditional->getStyle()->applyFromArray($styleST);
                $conditionalStyles = $event->sheet->getStyle($rangeAA)->getConditionalStyles();
                $conditionalStyles[] = $conditional;
                $event->sheet->getStyle($rangeAA)->setConditionalStyles($conditionalStyles);

                $conditional2 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional2->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional2->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional2->addCondition(9);
                $conditional2->setText('HIGH');
                $conditional2->getStyle()->applyFromArray($styleM);
                $conditional2Styles = $event->sheet->getStyle($rangeAA)->getConditionalStyles();
                $conditional2Styles[] = $conditional2;
                $event->sheet->getStyle($rangeAA)->setConditionalStyles($conditional2Styles);

                $conditional3 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional3->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional3->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional3->addCondition(4);
                $conditional3->setText('MODERATE');
                $conditional3->getStyle()->applyFromArray($styleSR);
                $conditional3Styles = $event->sheet->getStyle($rangeAA)->getConditionalStyles();
                $conditional3Styles[] = $conditional3;
                $event->sheet->getStyle($rangeAA)->setConditionalStyles($conditional3Styles);
                
                $conditional5 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional5->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional5->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional5->addCondition(1);
                $conditional5->setText('SANGAT RENDAH');
                $conditional5->getStyle()->applyFromArray($styleR);
                $conditional5Styles = $event->sheet->getStyle($rangeAA)->getConditionalStyles();
                $conditional5Styles[] = $conditional5;
                $event->sheet->getStyle($rangeAA)->setConditionalStyles($conditional5Styles);

                $conditional4 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional4->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional4->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional4->addCondition(2);
                $conditional4->setText('LOW');
                $conditional4->getStyle()->applyFromArray($styleR);
                $conditional4Styles = $event->sheet->getStyle($rangeAA)->getConditionalStyles();
                $conditional4Styles[] = $conditional4;
                $event->sheet->getStyle($rangeAA)->setConditionalStyles($conditional4Styles);

                // KOLOM O
                // $conditional = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                // $conditional->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                // $conditional->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_BEGINSWITH);
                // $conditional->addCondition('Extreme');
                // $conditional->getStyle()->applyFromArray($styleST);
                // $conditionalStyles = $event->sheet->getStyle($rangeO)->getConditionalStyles();
                // $conditionalStyles[] = $conditional;
                // $event->sheet->getStyle($rangeO)->setConditionalStyles($conditionalStyles);


                // $conditional2 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                // $conditional2->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                // $conditional2->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                // $conditional2->addCondition('High');
                // $conditional2->getStyle()->applyFromArray($styleM);
                // $conditional2Styles = $event->sheet->getStyle($rangeO)->getConditionalStyles();
                // $conditional2Styles[] = $conditional2;
                // $event->sheet->getStyle($rangeO)->setConditionalStyles($conditional2Styles);

                // $conditional3 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                // $conditional3->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                // $conditional3->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                // $conditional3->addCondition('Moderate');
                // $conditional3->getStyle()->applyFromArray($styleR);
                // $conditional3Styles = $event->sheet->getStyle($rangeO)->getConditionalStyles();
                // $conditional3Styles[] = $conditional3;
                // $event->sheet->getStyle($rangeO)->setConditionalStyles($conditional3Styles);

                // $conditional4 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                // $conditional4->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                // $conditional4->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                // $conditional4->addCondition('Low');
                // $conditional4->getStyle()->applyFromArray($styleSR);
                // $conditional4Styles = $event->sheet->getStyle($rangeO)->getConditionalStyles();
                // $conditional4Styles[] = $conditional4;
                // $event->sheet->getStyle($rangeO)->setConditionalStyles($conditional4Styles);


                // KOLOM X
                $conditional = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional->addCondition(5);
                $conditional->getStyle()->applyFromArray($styleST);
                $conditionalStyles = $event->sheet->getStyle($rangeX)->getConditionalStyles();
                $conditionalStyles[] = $conditional;
                $event->sheet->getStyle($rangeX)->setConditionalStyles($conditionalStyles);

                $conditional2 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional2->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional2->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional2->addCondition(4);
                $conditional2->getStyle()->applyFromArray($styleT);
                $conditional2Styles = $event->sheet->getStyle($rangeX)->getConditionalStyles();
                $conditional2Styles[] = $conditional2;
                $event->sheet->getStyle($rangeX)->setConditionalStyles($conditional2Styles);

                $conditional3 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional3->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional3->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional3->addCondition(3);
                $conditional3->getStyle()->applyFromArray($styleM);
                $conditional3Styles = $event->sheet->getStyle($rangeX)->getConditionalStyles();
                $conditional3Styles[] = $conditional3;
                $event->sheet->getStyle($rangeX)->setConditionalStyles($conditional3Styles);

                $conditional4 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional4->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional4->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional4->addCondition(2);
                $conditional4->getStyle()->applyFromArray($styleSR);
                $conditional4Styles = $event->sheet->getStyle($rangeX)->getConditionalStyles();
                $conditional4Styles[] = $conditional4;
                $event->sheet->getStyle($rangeX)->setConditionalStyles($conditional4Styles);

                $conditional5 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional5->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional5->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional5->addCondition(1);
                $conditional5->getStyle()->applyFromArray($styleSR);
                $conditional5Styles = $event->sheet->getStyle($rangeX)->getConditionalStyles();
                $conditional5Styles[] = $conditional5;
                $event->sheet->getStyle($rangeX)->setConditionalStyles($conditional5Styles);

                // KOLOM U
                $conditional = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional->addCondition(5);
                $conditional->getStyle()->applyFromArray($styleST);
                $conditionalStyles = $event->sheet->getStyle($rangeY)->getConditionalStyles();
                $conditionalStyles[] = $conditional;
                $event->sheet->getStyle($rangeY)->setConditionalStyles($conditionalStyles);

                $conditional2 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional2->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional2->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional2->addCondition(4);
                $conditional2->getStyle()->applyFromArray($styleT);
                $conditional2Styles = $event->sheet->getStyle($rangeY)->getConditionalStyles();
                $conditional2Styles[] = $conditional2;
                $event->sheet->getStyle($rangeY)->setConditionalStyles($conditional2Styles);

                $conditional3 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional3->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional3->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional3->addCondition(3);
                $conditional3->getStyle()->applyFromArray($styleM);
                $conditional3Styles = $event->sheet->getStyle($rangeY)->getConditionalStyles();
                $conditional3Styles[] = $conditional3;
                $event->sheet->getStyle($rangeY)->setConditionalStyles($conditional3Styles);

                $conditional4 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional4->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional4->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional4->addCondition(2);
                $conditional4->getStyle()->applyFromArray($styleSR);
                $conditional4Styles = $event->sheet->getStyle($rangeY)->getConditionalStyles();
                $conditional4Styles[] = $conditional4;
                $event->sheet->getStyle($rangeY)->setConditionalStyles($conditional4Styles);

                $conditional5 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional5->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional5->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional5->addCondition(1);
                $conditional5->getStyle()->applyFromArray($styleR);
                $conditional5Styles = $event->sheet->getStyle($rangeY)->getConditionalStyles();
                $conditional5Styles[] = $conditional5;
                $event->sheet->getStyle($rangeY)->setConditionalStyles($conditional5Styles);

                // KOLOM W
                // $conditional = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                // $conditional->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                // $conditional->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_BEGINSWITH);
                // $conditional->addCondition('Extreme');
                // $conditional->getStyle()->applyFromArray($styleST);
                // $conditionalStyles = $event->sheet->getStyle($rangeW)->getConditionalStyles();
                // $conditionalStyles[] = $conditional;
                // $event->sheet->getStyle($rangeW)->setConditionalStyles($conditionalStyles);

                // // $wizardFactory = new \PhpOffice\PhpSpreadsheet\Style\ConditionalFormatting\Wizard($rangeW);
                // // $wizard = $wizardFactory->newRule(\PhpOffice\PhpSpreadsheet\Style\ConditionalFormatting\Wizard::CELL_VALUE);
                // // $wizard->equals('Extreme', \PhpOffice\PhpSpreadsheet\Style\ConditionalFormatting\Wizard::VALUE_TYPE_FORMULA);
                // // $wizard->getStyle()->applyFromArray($styleST);
                // // $conditional = $wizard->getConditional();


                // $conditional2 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                // $conditional2->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                // $conditional2->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                // $conditional2->addCondition('High');
                // $conditional2->getStyle()->applyFromArray($styleM);
                // $conditional2Styles = $event->sheet->getStyle($rangeW)->getConditionalStyles();
                // $conditional2Styles[] = $conditional2;
                // $event->sheet->getStyle($rangeW)->setConditionalStyles($conditional2Styles);

                // $conditional3 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                // $conditional3->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                // $conditional3->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                // $conditional3->addCondition('Moderate');
                // $conditional3->getStyle()->applyFromArray($styleR);
                // $conditional3Styles = $event->sheet->getStyle($rangeW)->getConditionalStyles();
                // $conditional3Styles[] = $conditional3;
                // $event->sheet->getStyle($rangeW)->setConditionalStyles($conditional3Styles);

                // $conditional4 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                // $conditional4->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                // $conditional4->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                // $conditional4->addCondition('Low');
                // $conditional4->getStyle()->applyFromArray($styleSR);
                // $conditional4Styles = $event->sheet->getStyle($rangeW)->getConditionalStyles();
                // $conditional4Styles[] = $conditional4;
                // $event->sheet->getStyle($rangeW)->setConditionalStyles($conditional4Styles);



                $event->sheet->getDelegate()->getStyle('A3:AQ3')->applyFromArray($styleHeader2);

                // $event->sheet->getDelegate()->getStyle($rangeE)->applyFromArray([
                //     'alignment' => [
                //         'horizontal' => Alignment::HORIZONTAL_CENTER,
                //     ],
                // ]);
                $event->sheet->getDelegate()->getStyle($rangeJ)->applyFromArray([
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                    ],
                ]);
                $event->sheet->getDelegate()->getStyle($rangeOT)->applyFromArray([
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                    ],
                ]);
                $event->sheet->getDelegate()->getStyle($rangeXAA)->applyFromArray([
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                    ],
                ]);

                $event->sheet->getDelegate()->mergeCells('A1:A2');
                $event->sheet->getDelegate()->getStyle('A1:A2')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('B1:B2');
                $event->sheet->getDelegate()->getStyle('B1:B2')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('C1:C2');
                $event->sheet->getDelegate()->getStyle('C1:C2')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('D1:D2');
                $event->sheet->getDelegate()->getStyle('D1:D2')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('E1:E2');
                $event->sheet->getDelegate()->getStyle('E1:E2')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('F1:F2');
                $event->sheet->getDelegate()->getStyle('F1:F2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('G1:G2');
                $event->sheet->getDelegate()->getStyle('G1:G2')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('H1:H2');
                $event->sheet->getDelegate()->getStyle('H1:H2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('I1:M1');
                $event->sheet->getDelegate()->getStyle('I1:M1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('I2:M2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('N1:N2');
                $event->sheet->getDelegate()->getStyle('N1:N2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('O1:S1');
                $event->sheet->getDelegate()->getStyle('O1:S1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('O2:S2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->getStyle('T1:T1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('T2:T2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('U1:W1');
                $event->sheet->getDelegate()->getStyle('U1:W1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('U2:W2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('X1:AA1');
                $event->sheet->getDelegate()->getStyle('X1:AA1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('X2:AA2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('AB1:AB2');
                $event->sheet->getDelegate()->getStyle('AB1:AB2')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('AC1:AC2');
                $event->sheet->getDelegate()->getStyle('AC1:AC2')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('AD1:AD2');
                $event->sheet->getDelegate()->getStyle('AD1:AD2')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('AE1:AE2');
                $event->sheet->getDelegate()->getStyle('AE1:AE2')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('AF1:AF2');
                $event->sheet->getDelegate()->getStyle('AF1:AF2')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('AG1:AG2');
                $event->sheet->getDelegate()->getStyle('AG1:AG2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('AH1:AK1');
                $event->sheet->getDelegate()->getStyle('AH1:AK1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('AH2:AK2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('AL1:AO1');
                $event->sheet->getDelegate()->getStyle('AL1:AO1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('AL2:AO2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('AP1:AP2');
                $event->sheet->getDelegate()->getStyle('AP1:AP2')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('AQ1:AQ2');
                $event->sheet->getDelegate()->getStyle('AQ1:AQ2')->applyFromArray($styleHeader);
            },
        ];
    }
}
class Sheet3 implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithCharts, WithTitle
{
    /**
     * @return \Illuminate\Support\Collection
     */
    protected $data;
     protected $startDate;
    protected $endDate;
    protected $userId;
    protected $currently_id;

    public function __construct($startDate, $endDate, $userId,$currently_id)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->userId = $userId;
        $this->currently_id = $currently_id;
    }

    public function query()
    {
        $query = $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $query = RiskRegister::query()
            ->leftJoin('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
            ->leftJoin('pics', 'pics.id', 'risk_registers.pic_id')
            ->leftJoin('locations', 'locations.id', 'pics.location_id')
            ->select(
                
            'risk_registers.kode_risiko as Kode',
                'risk_registers.osd1_dampak',
                'risk_registers.osd1_probabilitas',
            )
            ->where('tipe_id', 1)
            ->where($whosLogin);

        if (!empty($this->startDate) && !empty($this->endDate)) {
            $query->where('risk_registers.tgl_register', '>=', $this->startDate)
                ->where('risk_registers.tgl_register', '<=', Carbon::parse($this->endDate)->addDay());
        }
        if (!empty($this->currently_id)) {
            if ($this->currently_id['id'] <3) {
                $query->where('risk_registers.currently_id', '=', $this->currently_id['id']);
            }
            if ($this->currently_id['id'] == 3) {
                $query->whereIn('risk_registers.concatdp1', [14,15,23,24,25,31,32,33,34,35,41,42,43,44,45,51,52,53,54,55]);
            }
        }
        if (!empty($this->userId) && auth()->user()->can('lihat data semua risk register')) {
            $userIds = !empty($this->userId) ? array_map('intval', explode(',', $this->userId)) : [];
            $query->whereIn('risk_registers.user_id', $userIds);
        }
        $this->data = $query->get();
        return $query;
    }
    public function title(): string
    {
        return 'PETA_PANAS';
    }
    public function headings(): array
    {
        return [
            ['No Risiko', 'Dampak', 'Probabilitas'],
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 18,
            'B' => 10,
            'C' => 15,
        ];
    }
    public function charts()
    {
        $spreadsheet = new Spreadsheet();
        $worksheet = $spreadsheet->getActiveSheet();
        $query = $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $query = RiskRegister::query()
            ->select(
                // DB::raw("CONCAT('R.', risk_registers.id) AS Kode"),
                'risk_registers.osd1_dampak',
                'risk_registers.osd1_probabilitas',
            )
            ->where($whosLogin);

        if (!empty($this->startDate) && !empty($this->endDate)) {
            $query->where('risk_registers.tgl_register', '>=', $this->startDate)
                ->where('risk_registers.tgl_register', '<=', Carbon::parse($this->endDate)->addDay());
        }
        if (!empty($this->startDate) && !empty($this->endDate)) {
            $query->where('risk_registers.tgl_register', '>=', $this->startDate)
                ->where('risk_registers.tgl_register', '<=', Carbon::parse($this->endDate)->addDay());
        }
        $data = $query->get();
        $dataGraph = [['Dampak', 'Probabilitas']];
        foreach ($data as $row) {
            $dataGraph[] = [
                $row->osd1_dampak,
                $row->osd1_probabilitas,
            ];
        }
        $totalData = count($dataGraph);
        $worksheet->fromArray($dataGraph);

        $dataSeriesLabels = [
            new DataSeriesValues(DataSeriesValues::DATASERIES_TYPE_STRING, 'PETA_PANAS!$C$1', null, 1),
        ];

        $dataSeriesValues = [
            new DataSeriesValues(DataSeriesValues::DATASERIES_TYPE_NUMBER, 'PETA_PANAS!$C$2:$C$' . count($dataGraph), Properties::FORMAT_CODE_NUMBER, 4, null, 'diamond', null, 7),
        ];

        $xAxisTickValues = [
            new DataSeriesValues(DataSeriesValues::DATASERIES_TYPE_NUMBER, 'PETA_PANAS!$B$2:$B$' . count($dataGraph), Properties::FORMAT_CODE_NUMBER, 8),
        ];

        $dataSeriesValues[0]->setScatterLines(false); // Points not connected

        $dataSeriesValues[0]->getMarkerFillColor()
            ->setColorProperties('accent1', null, ChartColor::EXCEL_COLOR_TYPE_SCHEME);

        // Build the dataseries
        $series = new DataSeries(
            DataSeries::TYPE_SCATTERCHART, // plotType
            null, // plotGrouping (Scatter charts don't have grouping)
            range(0, count($dataSeriesValues) - 1), // plotOrder
            $dataSeriesLabels, // plotLabel
            $xAxisTickValues, // plotCategory
            $dataSeriesValues, // plotValues
            null, // plotDirection
            null, // smooth line
            DataSeries::STYLE_LINEMARKER // plotStyle
        );

        // Set the series in the plot area
        $plotArea = new PlotArea(null, [$series]);

        $pos1 = 0; // pos = 0% (extreme low side or lower left corner)
        $brightness1 = 1.0; // 0%
        $gsColor1 = new ChartColor();
        $gsColor1->setColorProperties('0000FF', 0, 'srgbClr', $brightness1); // blue
        $gradientStop1 = [$pos1, $gsColor1];

        $pos2 = 0.45; // pos = 50% (middle)
        $brightness2 = 1.0; // 50%
        $gsColor2 = new ChartColor();
        $gsColor2->setColorProperties('00CC66', 0, 'srgbClr', $brightness2); // green
        $gradientStop2 = [$pos2, $gsColor2];

        $pos3 = 0.55; // pos = 75% (extreme high side or upper right corner)
        $brightness3 = 1.0; // 50%
        $gsColor3 = new ChartColor();
        $gsColor3->setColorProperties('FFFF00', 0, 'srgbClr', $brightness3); // yellow
        $gradientStop3 = [$pos3, $gsColor3];

        $pos4 = 1.0; // pos = 75% (extreme high side or upper right corner)
        $brightness4 = 1.0; // 50%
        $gsColor4 = new ChartColor();
        $gsColor4->setColorProperties('FF0000', 0, 'srgbClr', $brightness4); // red
        $gradientStop4 = [$pos4, $gsColor4];

        $gradientFillStops = [
            $gradientStop1,
            $gradientStop2,
            $gradientStop3,
            $gradientStop4,
        ];
        $gradientFillAngle = 340.0; // 45deg above horiz

        $plotArea->setGradientFillProperties($gradientFillStops, $gradientFillAngle);
        // Set the chart legend
        $legend = new ChartLegend(ChartLegend::POSITION_TOPRIGHT, null, false);

        $title = new Title($dataGraph[0][0]);

        $xAxis = new ChartAxis();

        $xAxis->setAxisOptionsProperties(
            Properties::AXIS_LABELS_NEXT_TO,
            null, // horizontalCrossesValue
            null, // horizontalCrosses
            null, // axisOrientation
            null, // majorTmt
            Properties::TICK_MARK_OUTSIDE, // minorTmt
            0, // minimum
            5, // maximum
            null, // majorUnit
            1, // minorUnit
        );

        $xAxis->setAxisType(ChartAxis::AXIS_TYPE_VALUE);
        $yAxis = new ChartAxis();
        $yAxis->setAxisOptionsProperties(
            Properties::AXIS_LABELS_NEXT_TO,
            null, // horizontalCrossesValue
            null, // horizontalCrosses
            null, // axisOrientation
            null, // majorTmt
            Properties::TICK_MARK_OUTSIDE, // minorTmt
            0, // minimum
            5, // 30 // maximum
            null, // majorUnit
            1, // minorUnit
        );

        $title = new Title('RISK ASSESSMENT HEATMAP');
        $xAxisLabel = new Title('DAMPAK');
        $yAxisLabel = new Title('PROBABILITAS');


        // Create the chart
        $chart = new Chart(
            'chart2', // name
            $title, // title
            null, // legend
            $plotArea, // plotArea
            true, // plotVisibleOnly
            DataSeries::EMPTY_AS_GAP, // displayBlanksAs
            $xAxisLabel, // xAxisLabel
            $yAxisLabel, // yAxisLabel
            // added xAxis for correct date display
            $xAxis, // xAxis
            $yAxis, // yAxis
        );
        $chart->setTopLeftPosition('G1');
        $chart->setBottomRightPosition('Q23');
        $worksheet->addChart($chart);

        return $chart;
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $event->sheet->getRowDimension(1)->setRowHeight(20);
                $highestRow = $event->sheet->getHighestRow();
                $highestColumn = $event->sheet->getHighestColumn();
                $range = 'A1:' . $highestColumn . $highestRow;
                $rangeA = 'A1:' . 'A' . $highestRow;
                $event->sheet->getStyle($range)->getAlignment()->setWrapText(true);
                $event->sheet->getStyle($range)->applyFromArray([
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN,
                            'color' => ['rgb' => '000000'],
                        ],
                    ],
                    'alignment' => [
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                ]);
                $styleHeader = [
                    'font' => [
                        'bold' => true,
                        'size' => 11,
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                    'borders' => [
                        'outline' => [
                            'borderStyle' => Border::BORDER_THIN,
                        ],
                    ],
                    'fill' => [
                        'fillType' => Fill::FILL_GRADIENT_LINEAR,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => 'F4B084',
                        ],
                        'endColor' => [
                            'argb' => 'F4B084',
                        ],
                    ],
                ];

                $event->sheet->getStyle($range)->applyFromArray([
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                    ],
                ]);
                $event->sheet->getStyle('A1:C1')->applyFromArray($styleHeader);

                $chart = $this->charts();
                $event->sheet->getDelegate()->addChart($chart);
            },
        ];
    }
}
class Sheet4 implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithTitle
{
    /**
     * @return \Illuminate\Support\Collection
     */
    protected $data;
     protected $startDate;
    protected $endDate;
    protected $userId;
    protected $currently_id;

    public function __construct($startDate, $endDate, $userId,$currently_id)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->userId = $userId;
        $this->currently_id = $currently_id;
    }
    public function query()
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $query = RiskRegister::query()
            ->leftjoin('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
            ->leftjoin('users', 'users.id', 'risk_registers.user_id')
            ->leftjoin('risk_gradings', 'risk_gradings.kode', 'risk_registers.concatdp1')
            ->select(
                DB::raw('row_number() OVER (ORDER BY risk_registers.osd1_dampak * risk_registers.osd1_probabilitas * risk_registers.osd1_controllability DESC) AS `Nomor`'),
                'risk_categories.name as kategori',
                'risk_registers.pernyataan_risiko',
                'risk_registers.sebab',
                'risk_registers.osd1_dampak',
                'risk_registers.osd1_probabilitas',
                'risk_registers.osd1_controllability',
                DB::raw('risk_registers.osd1_dampak * risk_registers.osd1_probabilitas * risk_registers.osd1_controllability AS `Skor`'),
                DB::raw('row_number() OVER (ORDER BY risk_registers.osd1_dampak * risk_registers.osd1_probabilitas * risk_registers.osd1_controllability DESC) AS `Peringkat1`'),
                'users.name',
                'risk_gradings.name as grading_name',
            )
            // ->groupBy(
            //     'risk_registers.pernyataan_risiko',
            //     'risk_categories.name',
            //     'risk_registers.sebab',
            //     'risk_registers.osd1_dampak',
            //     'risk_registers.osd1_probabilitas',
            //     'risk_registers.osd1_controllability'
            // )
            // ->whereIn('risk_gradings.name',['Extreme','High'])
            ->where('tipe_id', 1)
            ->where($whosLogin)
            ->orderBy('Peringkat1', 'ASC');
        // if (!empty($this->startDate) && !empty($this->endDate)) {
        //     $query->where('risk_registers.tgl_register', '>=', $this->startDate)
        //         ->where('risk_registers.tgl_register', '<=', Carbon::parse($this->endDate)->addDay());
        // }
        if (!empty($this->startDate) && !empty($this->endDate)) {
            $startDate = Carbon::parse($this->startDate)->startOfDay();
            $endDate = Carbon::parse($this->endDate)->endOfDay();
            
            $query->whereBetween('risk_registers.tgl_register', [$startDate, $endDate]);
        }
        if (!empty($this->currently_id)) {
            if ($this->currently_id['id'] <3) {
                $query->where('risk_registers.currently_id', '=', $this->currently_id['id']);
            }
            if ($this->currently_id['id'] == 3) {
                $query->whereIn('risk_registers.concatdp1', [14,15,23,24,25,31,32,33,34,35,41,42,43,44,45,51,52,53,54,55]);
            }
        }
        if (!empty($this->userId) && auth()->user()->can('lihat data semua risk register')) {
            $userIds = !empty($this->userId) ? array_map('intval', explode(',', $this->userId)) : [];
            $query->whereIn('risk_registers.user_id', $userIds);
        }




        $this->data = $query->get();
        return $query;
    }
    public function title(): string
    {
        return 'PROFIL RISIKO';
    }
    public function headings(): array
    {
        return [
            ['No', 'KATEGORI RISIKO', 'PERNYATAAN RISIKO', 'AKAR MASALAH (PENYEBAB UTAMA RISIKO)', 'DAMPAK (D)', 'PROBABILITAS (P)', 'CONTROLLABILITY (Pengendalian)', 'SCORING', 'RANGKING','PEMILIK RISIKO','PERINGKAT RISIKO'],

            ['(1)', '(2)', '(3)', '(4)', '(5)', '(6)', '(7)', '(8) (5x6x7)', '(9)','(10)','(11)'],
        ];
    }
    public function columnWidths(): array
    {
        return [
            'A' => 4,
            'B' => 20,
            'C' => 45,
            'D' => 45,
            'E' => 12,
            'F' => 18,
            'G' => 30,
            'H' => 9,
            'I' => 12,
            'J' => 20,
            'K' => 20,
        ];
    }
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $event->sheet->getDelegate()->getRowDimension(1)->setRowHeight(30);
                $event->sheet->getDelegate()->getRowDimension(2)->setRowHeight(30);
                $highestRow = $event->sheet->getHighestRow();
                $highestColumn = $event->sheet->getHighestColumn();
                $range = 'A1:' . $highestColumn . $highestRow;
                $rangeA = 'A3:' . 'A' . $highestRow;
                $rangeE = 'E3:' . 'E' . $highestRow;
                $rangeF = 'F3:' . 'F' . $highestRow;
                $rangeK = 'K3:' . 'K' . $highestRow;
                $rangeEI = 'E3:' . 'I' . $highestRow;

                $event->sheet->getDelegate()->getStyle($range)->getAlignment()->setWrapText(true);
                $event->sheet->getDelegate()->getStyle($range)->applyFromArray([
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN,
                            'color' => ['rgb' => '000000'],
                        ],
                    ],
                    'alignment' => [
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                ]);
                $styleHeader = [
                    'font' => [
                        'bold' => true,
                        'size' => 11,
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                    'borders' => [
                        'outline' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        ],
                    ],
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => 'FCE4D6',
                        ],
                        'endColor' => [
                            'argb' => 'FCE4D6',
                            // 'argb' => 'FFFFFFFF',
                            // 'argb' => 'FFFFFFFF',
                        ],
                    ],
                ];
                $styleHeader2 = [
                    'font' => [
                        'bold' => true,
                        'size' => 11,
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                    'borders' => [
                        'outline' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        ],
                    ],
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => 'D8D8D8',
                        ],
                        'endColor' => [
                            'argb' => 'D8D8D8',
                        ],
                    ],
                ];
                $styleHeader3 = [
                    'font' => [
                        'bold' => true,
                        'size' => 11,
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                    'borders' => [
                        'outline' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        ],
                    ],
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => 'FFD966',
                        ],
                        'endColor' => [
                            'argb' => 'FFD966',
                        ],
                    ],
                ];
                $styleHeader4 = [
                    'font' => [
                        'bold' => true,
                        'size' => 11,
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                    'borders' => [
                        'outline' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        ],
                    ],
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => '92D050',
                        ],
                        'endColor' => [
                            'argb' => '92D050',
                        ],
                    ],
                ];
                $styleStandar = [
                    'font' => [
                        'bold' => true,
                        'size' => 11,
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                    'borders' => [
                        'outline' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        ],
                    ],
                ];
                $styleST = [
                    $styleStandar,
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => 'FF0D0D', //Merah
                        ],
                    ],
                ];
                $styleT = [
                    $styleStandar,
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => 'FFC000', // Orange
                        ],
                    ],
                ];
                $styleM = [
                    $styleStandar,
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => 'FFFF00', // Kuning
                        ],
                    ],
                ];
                $styleR = [
                    $styleStandar,
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => '00B0F0', // Biru
                        ],
                    ],
                ];
                $styleSR = [
                    $styleStandar,
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => '00B050', //Hijau
                        ],
                    ],
                ];
                // KOLOM K
                $conditional = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional->addCondition(5);
                $conditional->getStyle()->applyFromArray($styleST);
                $conditionalStyles = $event->sheet->getStyle($rangeE)->getConditionalStyles();
                $conditionalStyles[] = $conditional;
                $event->sheet->getStyle($rangeE)->setConditionalStyles($conditionalStyles);

                $conditional2 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional2->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional2->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional2->addCondition(4);
                $conditional2->getStyle()->applyFromArray($styleT);
                $conditional2Styles = $event->sheet->getStyle($rangeE)->getConditionalStyles();
                $conditional2Styles[] = $conditional2;
                $event->sheet->getStyle($rangeE)->setConditionalStyles($conditional2Styles);

                $conditional3 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional3->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional3->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional3->addCondition(3);
                $conditional3->getStyle()->applyFromArray($styleM);
                $conditional3Styles = $event->sheet->getStyle($rangeE)->getConditionalStyles();
                $conditional3Styles[] = $conditional3;
                $event->sheet->getStyle($rangeE)->setConditionalStyles($conditional3Styles);

                $conditional4 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional4->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional4->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional4->addCondition(2);
                $conditional4->getStyle()->applyFromArray($styleSR);
                $conditional4Styles = $event->sheet->getStyle($rangeE)->getConditionalStyles();
                $conditional4Styles[] = $conditional4;
                $event->sheet->getStyle($rangeE)->setConditionalStyles($conditional4Styles);

                $conditional5 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional5->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional5->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional5->addCondition(1);
                $conditional5->getStyle()->applyFromArray($styleR);
                $conditional5Styles = $event->sheet->getStyle($rangeE)->getConditionalStyles();
                $conditional5Styles[] = $conditional5;
                $event->sheet->getStyle($rangeE)->setConditionalStyles($conditional5Styles);


                // KOLOM L
                $conditional = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional->addCondition(5);
                $conditional->getStyle()->applyFromArray($styleST);
                $conditionalStyles = $event->sheet->getStyle($rangeF)->getConditionalStyles();
                $conditionalStyles[] = $conditional;
                $event->sheet->getStyle($rangeF)->setConditionalStyles($conditionalStyles);

                $conditional2 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional2->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional2->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional2->addCondition(4);
                $conditional2->getStyle()->applyFromArray($styleT);
                $conditional2Styles = $event->sheet->getStyle($rangeF)->getConditionalStyles();
                $conditional2Styles[] = $conditional2;
                $event->sheet->getStyle($rangeF)->setConditionalStyles($conditional2Styles);

                $conditional3 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional3->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional3->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional3->addCondition(3);
                $conditional3->getStyle()->applyFromArray($styleM);
                $conditional3Styles = $event->sheet->getStyle($rangeF)->getConditionalStyles();
                $conditional3Styles[] = $conditional3;
                $event->sheet->getStyle($rangeF)->setConditionalStyles($conditional3Styles);

                $conditional4 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional4->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional4->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional4->addCondition(2);
                $conditional4->getStyle()->applyFromArray($styleSR);
                $conditional4Styles = $event->sheet->getStyle($rangeF)->getConditionalStyles();
                $conditional4Styles[] = $conditional4;
                $event->sheet->getStyle($rangeF)->setConditionalStyles($conditional4Styles);

                $conditional5 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional5->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional5->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional5->addCondition(1);
                $conditional5->getStyle()->applyFromArray($styleR);
                $conditional5Styles = $event->sheet->getStyle($rangeF)->getConditionalStyles();
                $conditional5Styles[] = $conditional5;
                $event->sheet->getStyle($rangeF)->setConditionalStyles($conditional5Styles);
                // KOLOM K
                $conditional = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional->addCondition(14);
                $conditional->setText('EXTREME');
                $conditional->getStyle()->applyFromArray($styleST);
                $conditionalStyles = $event->sheet->getStyle($rangeK)->getConditionalStyles();
                $conditionalStyles[] = $conditional;
                $event->sheet->getStyle($rangeK)->setConditionalStyles($conditionalStyles);

                $conditional2 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional2->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional2->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional2->addCondition(9);
                $conditional2->setText('HIGH');
                $conditional2->getStyle()->applyFromArray($styleM);
                $conditional2Styles = $event->sheet->getStyle($rangeK)->getConditionalStyles();
                $conditional2Styles[] = $conditional2;
                $event->sheet->getStyle($rangeK)->setConditionalStyles($conditional2Styles);

                $conditional3 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional3->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional3->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional3->addCondition(4);
                $conditional3->setText('MODERATE');
                $conditional3->getStyle()->applyFromArray($styleSR);
                $conditional3Styles = $event->sheet->getStyle($rangeK)->getConditionalStyles();
                $conditional3Styles[] = $conditional3;
                $event->sheet->getStyle($rangeK)->setConditionalStyles($conditional3Styles);
                
                $conditional5 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional5->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional5->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional5->addCondition(1);
                $conditional5->setText('SANGAT RENDAH');
                $conditional5->getStyle()->applyFromArray($styleR);
                $conditional5Styles = $event->sheet->getStyle($rangeK)->getConditionalStyles();
                $conditional5Styles[] = $conditional5;
                $event->sheet->getStyle($rangeK)->setConditionalStyles($conditional5Styles);

                $conditional4 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional4->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional4->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional4->addCondition(2);
                $conditional4->setText('LOW');
                $conditional4->getStyle()->applyFromArray($styleR);
                $conditional4Styles = $event->sheet->getStyle($rangeK)->getConditionalStyles();
                $conditional4Styles[] = $conditional4;
                $event->sheet->getStyle($rangeK)->setConditionalStyles($conditional4Styles);



                $event->sheet->getDelegate()->getStyle('A1:K2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->getStyle($rangeA)->applyFromArray([
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                    ],
                ]);
                $event->sheet->getDelegate()->getStyle($rangeEI)->applyFromArray([
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                    ],
                ]);
            },
        ];
    }
}
class Sheet5 implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithTitle
{
    /**
     * @return \Illuminate\Support\Collection
     */
    protected $data;
     protected $startDate;
    protected $endDate;
    protected $userId;
    protected $currently_id;

    public function __construct($startDate, $endDate, $userId,$currently_id)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->userId = $userId;
        $this->currently_id = $currently_id;
    }
    public function query()
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $subquery = RiskRegister::query()
            ->leftJoin('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
            ->leftJoin('indikator_fitur4s', 'indikator_fitur4s.id', 'risk_registers.indikator_fitur4_id')
            ->leftJoin('indikator_fitur3s', 'indikator_fitur3s.id', 'indikator_fitur4s.indikator_fitur3_id')
            ->leftJoin('indikator_fitur2s', 'indikator_fitur2s.id', 'indikator_fitur3s.indikator_fitur2_id')
            ->leftJoin('indikator_fitur1s', 'indikator_fitur1s.id', 'indikator_fitur2s.indikator_fitur1_id')
            ->leftJoin('sasaran_strategis', 'sasaran_strategis.id', 'indikator_fitur3s.sasaran_strategis_id')
            ->leftJoin('users', 'users.id', 'risk_registers.user_id')
            ->leftjoin('opsi_pengendalians', 'opsi_pengendalians.id', 'risk_registers.opsi_pengendalian_id')
            ->leftjoin('efektifs', 'efektifs.id', 'risk_registers.efektif_id')
            ->leftjoin('waktu_pengendalians', 'waktu_pengendalians.id', 'risk_registers.waktu_pengendalian_id')
            ->leftjoin('jenis_pengendalians', 'jenis_pengendalians.id', 'risk_registers.jenis_pengendalian_id')
            ->selectRaw(
                'indikator_fitur3s.name, ' .
                    'indikator_fitur1s.name as sasaran_name, ' .
                    'risk_registers.pernyataan_risiko, ' .
                    'opsi_pengendalians.name as opsi, ' .
                    'risk_registers.penanganan_risiko as uraian, ' .
                    'risk_registers.pengendalian_risiko, ' .
                    'efektifs.name as efektif, ' .
                    'risk_registers.pengendalian_harus_ada as harusada, ' .
                    'risk_registers.rencana_pengendalian as kegiatan, ' .
                    'waktu_pengendalians.name as waktu, ' .
                    'jenis_pengendalians.name as jenis_pengendalian, ' .
                    'users.name as pemilik, ' .
                    'row_number() OVER (ORDER BY risk_registers.osd1_dampak * risk_registers.osd1_probabilitas * risk_registers.osd1_controllability DESC) AS `Peringkat`'
            )
            // ->groupBy(
            //     'indikator_fitur3s.name',
            //     'indikator_fitur1s.name',
            //     'risk_registers.pernyataan_risiko',
            //     'opsi_pengendalians.name',
            //     'risk_registers.pengendalian_risiko',
            //     'risk_registers.penanganan_risiko',
            //     'efektifs.name',
            //     'risk_registers.pengendalian_harus_ada',
            //     'risk_registers.rencana_pengendalian',
            //     'waktu_pengendalians.name',
            //     'jenis_pengendalians.name',
            //     'users.name',
            //     'risk_registers.osd1_dampak',
            //     'risk_registers.osd1_probabilitas',
            //     'risk_registers.osd1_controllability'
            // )
            ->where('tipe_id', 1)
            ->where($whosLogin);
        if (!empty($this->startDate) && !empty($this->endDate)) {
            $subquery->where('risk_registers.tgl_register', '>=', $this->startDate)
                ->where('risk_registers.tgl_register', '<=', Carbon::parse($this->endDate)->addDay());
        }
        if (!empty($this->currently_id)) {
            if ($this->currently_id['id'] <3) {
                $subquery->where('risk_registers.currently_id', '=', $this->currently_id['id']);
            }
            if ($this->currently_id['id'] == 3) {
                $subquery->whereIn('risk_registers.concatdp1', [14,15,23,24,25,31,32,33,34,35,41,42,43,44,45,51,52,53,54,55]);
            }
        }
        if (!empty($this->userId) && auth()->user()->can('lihat data semua risk register')) {
            $userIds = !empty($this->userId) ? array_map('intval', explode(',', $this->userId)) : [];
            $subquery->whereIn('risk_registers.user_id', $userIds);
        }
        $query = DB::query()
            ->select(
                'Peringkat',
                'name',
                'sasaran_name',
                'pernyataan_risiko',
                'opsi',
                'uraian',
                'pengendalian_risiko',
                'efektif',
                'harusada',
                'kegiatan',
                'waktu',
                'jenis_pengendalian',
                'pemilik'
            )
            ->fromSub($subquery, 'sub')
            ->orderBy('sub.Peringkat', 'ASC');



        $this->data = $query->get();
        return $query;
    }
    public function title(): string
    {
        return 'RENCANA PENANGANAN RISIKO';
    }
    public function headings(): array
    {
        return [
            ['NO', 'KEGIATAN', 'SASARAN', 'Risiko yang akan ditangani (Prioritas)', 'ALTERNATIF TEKNIK PENANGANAN RISIKO', 'ALTERNATIF TEKNIK PENANGANAN RISIKO', 'Pengendalian yang sudah ada', 'Pengendalian yang sudah ada', 'Pengendalian yang sudah ada', 'Rencana pengendalian', 'Rencana pengendalian', 'Rencana pengendalian', 'Pemilik Risiko'],

            ['NO', 'KEGIATAN', 'SASARAN', 'Risiko yang akan ditangani (Prioritas)', 'Opsi Teknik Penanganan Risiko', 'Uraian Penanganan Risiko', 'Pengendalian yang sudah ada', 'Efektif/ kurang efektif', 'Pengendalian yang harus ada', 'Kegiatan', 'Waktu', 'Jenis: Detektif (D), Preventif (P), Korektif (K),', 'Pemilik Risiko'],

            ['(1)', '(2)', '(3)', '(4)', '(5)', '(6)', '(7)', '(8)', '(9)', '(10)', '(11)', '(12)', '(13)'],

        ];
    }
    public function columnWidths(): array
    {
        return [
            'A' => 4,
            'B' => 45,
            'C' => 45,
            'D' => 65,
            'E' => 20,
            'F' => 45,
            'G' => 45,
            'H' => 20,
            'I' => 45,
            'J' => 45,
            'K' => 12,
            'L' => 13,
            'M' => 20,
        ];
    }
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $event->sheet->getDelegate()->getRowDimension(1)->setRowHeight(30);
                $highestRow = $event->sheet->getHighestRow();
                $highestColumn = $event->sheet->getHighestColumn();
                $range = 'A1:' . $highestColumn . $highestRow;
                $rangeA = 'A1:' . 'A' . $highestRow;
                $event->sheet->getDelegate()->getStyle($range)->getAlignment()->setWrapText(true);
                $event->sheet->getDelegate()->getStyle($range)->applyFromArray([
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN,
                            'color' => ['rgb' => '000000'],
                        ],
                    ],
                    'alignment' => [
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                ]);
                $styleHeader = [
                    'font' => [
                        'bold' => true,
                        'size' => 11,
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                    'borders' => [
                        'outline' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        ],
                    ],
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => 'FCE4D6',
                        ],
                        'endColor' => [
                            'argb' => 'FCE4D6',
                            // 'argb' => 'FFFFFFFF',
                            // 'argb' => 'FFFFFFFF',
                        ],
                    ],
                ];
                $styleHeader2 = [
                    'font' => [
                        'bold' => true,
                        'size' => 11,
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                    'borders' => [
                        'outline' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        ],
                    ],
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => 'FCE4D6',
                        ],
                        'endColor' => [
                            'argb' => 'FCE4D6',
                        ],
                    ],
                ];
                $styleHeader3 = [
                    'font' => [
                        'bold' => true,
                        'size' => 11,
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                    'borders' => [
                        'outline' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        ],
                    ],
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => 'FFFF00',
                        ],
                        'endColor' => [
                            'argb' => 'FFFF00',
                        ],
                    ],
                ];
                $styleHeader4 = [
                    'font' => [
                        'bold' => true,
                        'size' => 11,
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                    'borders' => [
                        'outline' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        ],
                    ],
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => '92D050',
                        ],
                        'endColor' => [
                            'argb' => '92D050',
                        ],
                    ],
                ];
                $event->sheet->getDelegate()->getStyle($rangeA)->applyFromArray([
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_LEFT,
                    ],
                ]);
                $event->sheet->getDelegate()->getStyle('A3:M3')->applyFromArray($styleHeader2);
                $event->sheet->getDelegate()->mergeCells('A1:A2');
                $event->sheet->getDelegate()->getStyle('A1:A2')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('B1:B2');
                $event->sheet->getDelegate()->getStyle('B1:B2')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('C1:C2');
                $event->sheet->getDelegate()->getStyle('C1:C2')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('D1:D2');
                $event->sheet->getDelegate()->getStyle('D1:D2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('E1:F1');
                $event->sheet->getDelegate()->getStyle('E1:F1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('E2:G2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('G1:I1');
                $event->sheet->getDelegate()->getStyle('G1:I1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('H2:I2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('J1:L1');
                $event->sheet->getDelegate()->getStyle('J1:L1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('J2:L2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('M1:M2');
                $event->sheet->getDelegate()->getStyle('M1:M2')->applyFromArray($styleHeader);
            },
        ];
    }
}
class Sheet6 implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithTitle
{
    /**
     * @return \Illuminate\Support\Collection
     */
    protected $data;
     protected $startDate;
    protected $endDate;
    protected $userId;
    protected $currently_id;

    public function __construct($startDate, $endDate, $userId,$currently_id)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->userId = $userId;
        $this->currently_id = $currently_id;
    }
    public function query()
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $subquery = RiskRegister::query()
            ->leftjoin('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
            ->leftjoin('indikator_fitur4s', 'indikator_fitur4s.id', 'risk_registers.indikator_fitur4_id')
            ->leftJoin('indikator_fitur3s', 'indikator_fitur3s.id', 'indikator_fitur4s.indikator_fitur3_id')
            ->leftJoin('indikator_fitur2s', 'indikator_fitur2s.id', 'indikator_fitur3s.indikator_fitur2_id')
            ->leftJoin('indikator_fitur1s', 'indikator_fitur1s.id', 'indikator_fitur2s.indikator_fitur1_id')
            ->leftJoin('sasaran_strategis', 'sasaran_strategis.id', 'indikator_fitur3s.sasaran_strategis_id')
            ->leftjoin('users', 'users.id', 'risk_registers.user_id')
            ->leftjoin('waktu_pengendalians', 'waktu_pengendalians.id', 'risk_registers.waktu_pengendalian_id')
            ->leftjoin("pics", \DB::raw("FIND_IN_SET(pics.id,risk_registers.pic_id)"), ">", \DB::raw("'0'"))
            ->select(DB::raw('row_number() OVER (ORDER BY risk_registers.osd1_dampak * risk_registers.osd1_probabilitas * risk_registers.osd1_controllability DESC) AS `Peringkat`'), 'indikator_fitur3s.name', 'indikator_fitur1s.name as sasaran_name',  'risk_registers.pernyataan_risiko', 'risk_registers.pengendalian_harus_ada as rencana', 'risk_registers.rencana_pengendalian as realisasi', 'risk_registers.belum_tertangani', 'risk_registers.usulan_perbaikan',  DB::raw("CONCAT(risk_registers.target_waktu, ' Hari') AS target_waktu"), 'waktu_pengendalians.name as waktu', 'users.name as pemilik_name', \DB::raw("GROUP_CONCAT(pics.name) as picsname"))->groupBy("risk_registers.id")
            ->where('tipe_id', 1)
            ->where($whosLogin);
        if (!empty($this->startDate) && !empty($this->endDate)) {
            $subquery->where('risk_registers.tgl_register', '>=', $this->startDate)
                ->where('risk_registers.tgl_register', '<=', Carbon::parse($this->endDate)->addDay());
        }
        if (!empty($this->currently_id)) {
            if ($this->currently_id['id'] <3) {
                $subquery->where('risk_registers.currently_id', '=', $this->currently_id['id']);
            }
            if ($this->currently_id['id'] == 3) {
                $subquery->whereIn('risk_registers.concatdp1', [14,15,23,24,25,31,32,33,34,35,41,42,43,44,45,51,52,53,54,55]);
            }
        }
        if (!empty($this->userId) && auth()->user()->can('lihat data semua risk register')) {
            $userIds = !empty($this->userId) ? array_map('intval', explode(',', $this->userId)) : [];
            $subquery->whereIn('risk_registers.user_id', $userIds);
        }
        $query = DB::query()
            ->select('Peringkat', 'name', 'sasaran_name', 'pernyataan_risiko', 'rencana', 'realisasi', 'belum_tertangani', 'usulan_perbaikan', 'target_waktu', 'waktu', 'pemilik_name', 'picsname')
            ->fromSub($subquery, 'sub')
            ->orderBy('sub.Peringkat', 'ASC');
        $this->data = $query->get();
        return $query;
    }
    public function title(): string
    {
        return 'PEMANTAUAN PENGENDALIAN RISIKO';
    }
    public function headings(): array
    {
        return [
            ['No', 'Kegiatan', 'Sasaran', 'Risiko (Prioritas)', 'Penanganan', 'Penanganan', 'Penanganan', 'Usulan Perbaikan', 'Waktu Pemantauan', 'Waktu Pemantauan', 'Penanggung Jawab Pemantauan', 'Penanggung Jawab Risiko'],

            ['No', 'Kegiatan', 'Sasaran', 'Risiko (Prioritas)', 'Rencana (Pengendalian yg harus ada)', 'Realisasi (Kegiatan Rencana Pengendalian )', 'Yang belum tertangani', 'Usulan Perbaikan', 'Rencana', 'Realisasi', 'Penanggung Jawab Pemantauan', 'Penanggung Jawab Risiko'],

            ['(1)', '(2)', '(3)', '(4)', '(5)', '(6)', '(7)', '(8)', '(9)', '(10)', '(11)', '(12)'],

        ];
    }
    public function columnWidths(): array
    {
        return [
            'A' => 4,
            'B' => 45,
            'C' => 45,
            'D' => 65,
            'E' => 45,
            'F' => 45,
            'G' => 20,
            'H' => 36,
            'I' => 20,
            'J' => 12,
            'K' => 20,
            'L' => 20,
        ];
    }
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $event->sheet->getDelegate()->getRowDimension(1)->setRowHeight(30);
                $highestRow = $event->sheet->getHighestRow();
                $highestColumn = $event->sheet->getHighestColumn();
                $range = 'A1:' . $highestColumn . $highestRow;
                $rangeA = 'A1:' . 'A' . $highestRow;
                $event->sheet->getDelegate()->getStyle($range)->getAlignment()->setWrapText(true);
                $event->sheet->getDelegate()->getStyle($range)->applyFromArray([
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN,
                            'color' => ['rgb' => '000000'],
                        ],
                    ],
                    'alignment' => [
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                ]);
                $styleHeader = [
                    'font' => [
                        'bold' => true,
                        'size' => 11,
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                    'borders' => [
                        'outline' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        ],
                    ],
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => 'FCE4D6',
                        ],
                        'endColor' => [
                            'argb' => 'FCE4D6',
                            // 'argb' => 'FFFFFFFF',
                            // 'argb' => 'FFFFFFFF',
                        ],
                    ],
                ];
                $styleHeader2 = [
                    'font' => [
                        'bold' => true,
                        'size' => 11,
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                    'borders' => [
                        'outline' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        ],
                    ],
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => 'FFFFFFFF',
                        ],
                        'endColor' => [
                            'argb' => 'FFFFFFFF',
                        ],
                    ],
                ];
                $styleHeader3 = [
                    'font' => [
                        'bold' => true,
                        'size' => 11,
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                    'borders' => [
                        'outline' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        ],
                    ],
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => 'FFFF00',
                        ],
                        'endColor' => [
                            'argb' => 'FFFF00',
                        ],
                    ],
                ];
                $styleHeader4 = [
                    'font' => [
                        'bold' => true,
                        'size' => 11,
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                    'borders' => [
                        'outline' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        ],
                    ],
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => '92D050',
                        ],
                        'endColor' => [
                            'argb' => '92D050',
                        ],
                    ],
                ];
                $event->sheet->getDelegate()->getStyle($rangeA)->applyFromArray([
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_LEFT,
                    ],
                ]);
                $event->sheet->getDelegate()->getStyle('A3:K3')->applyFromArray($styleHeader2);

                $event->sheet->getDelegate()->mergeCells('A1:A2');
                $event->sheet->getDelegate()->getStyle('A1:A2')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('B1:B2');
                $event->sheet->getDelegate()->getStyle('B1:B2')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('C1:C2');
                $event->sheet->getDelegate()->getStyle('C1:C2')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('D1:D2');
                $event->sheet->getDelegate()->getStyle('D1:D2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('E1:G1');
                $event->sheet->getDelegate()->getStyle('E1:G1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('E2:G2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('H1:H2');
                $event->sheet->getDelegate()->getStyle('H1:H2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('I1:J1');
                $event->sheet->getDelegate()->getStyle('I1:J1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('I2:J2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('K1:K2');
                $event->sheet->getDelegate()->getStyle('K1:K2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('L1:L2');
                $event->sheet->getDelegate()->getStyle('L1:L2')->applyFromArray($styleHeader);
            },
        ];
    }
}
class Sheet7 implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithTitle, WithCharts
{
    /**
     * @return \Illuminate\Support\Collection
     */
    protected $data;
     protected $startDate;
    protected $endDate;
    protected $userId;
    protected $currently_id;

    public function __construct($startDate, $endDate, $userId,$currently_id)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->userId = $userId;
        $this->currently_id = $currently_id;
    }
    public function query()
    {
        $query = $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $query = RiskRegister::query()
            ->leftJoin('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
            ->leftJoin('pics', 'pics.id', 'risk_registers.pic_id')
            ->leftJoin('locations', 'locations.id', 'pics.location_id')
            ->select('risk_registers.kode_risiko as Kode', 'risk_registers.denum', 'risk_registers.num', DB::raw('risk_registers.num / risk_registers.denum * 100 AS `Waktu`'), DB::raw("'' AS 'Jumlah'"), 'risk_registers.target_waktu')
            ->where('tipe_id', 1)
            ->where($whosLogin);
        if (!empty($this->startDate) && !empty($this->endDate)) {
            $query->where('risk_registers.tgl_register', '>=', $this->startDate)
                ->where('risk_registers.tgl_register', '<=', Carbon::parse($this->endDate)->addDay());
        }
        if (!empty($this->currently_id)) {
            if ($this->currently_id['id'] <3) {
                $query->where('risk_registers.currently_id', '=', $this->currently_id['id']);
            }
            if ($this->currently_id['id'] == 3) {
                $query->whereIn('risk_registers.concatdp1', [14,15,23,24,25,31,32,33,34,35,41,42,43,44,45,51,52,53,54,55]);
            }
        }
        if (!empty($this->userId) && auth()->user()->can('lihat data semua risk register')) {
            $userIds = !empty($this->userId) ? array_map('intval', explode(',', $this->userId)) : [];
            $query->whereIn('risk_registers.user_id', $userIds);
        }
        $this->data = $query->get();
        return $query;
    }
    public function title(): string
    {
        return 'TREND';
    }
    public function headings(): array
    {
        return [
            ['Month', 'Denum', 'NUM', '%', 'Jumlah', 'Waktu'],
        ];
    }
    public function columnWidths(): array
    {
        return [
            'A' => 18,
            'B' => 20,
            'C' => 20,
            'D' => 20,
            'E' => 20,
            'F' => 20,
        ];
    }
    public function charts()
    {
        $spreadsheet = new Spreadsheet();
        $worksheet = $spreadsheet->getActiveSheet();
        $query = $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $query = RiskRegister::query()
            ->select(DB::raw("CONCAT('R.', risk_registers.id) AS Kode"), 'risk_registers.denum', DB::raw('risk_registers.num / risk_registers.denum * 100 AS `Waktu`'), 'risk_registers.num', DB::raw("'' AS 'Jumlah'"), 'risk_registers.target_waktu')
            ->where('tipe_id', 1)
            ->where($whosLogin);
        if (!empty($this->startDate) && !empty($this->endDate)) {
            $query->where('risk_registers.tgl_register', '>=', $this->startDate)
                ->where('risk_registers.tgl_register', '<=', Carbon::parse($this->endDate)->addDay());
        }

        $data = $query->get();
        $dataGraph = [['', 'Dampak', 'Probabilitas']];
        foreach ($data as $row) {
            $dataGraph[] = [
                $row->Kode,
                $row->osd1_dampak,
                $row->osd1_probabilitas,
            ];
        }
        $totalData = count($dataGraph);
        $worksheet->fromArray($dataGraph);
        $dataSeriesValues = [];
        for ($i = 1; $i < count($dataGraph[0]); $i++) {
            $pos = $i + 65;
            $posTitle = chr($pos);
            $dataSeriesValues[] = new DataSeriesValues(
                DataSeriesValues::DATASERIES_TYPE_NUMBER,
                'TREND!$' . $posTitle . '$2:$' . $posTitle . '$' . $totalData,
                null,
                4
            );
        }
        foreach ($dataSeriesValues as $dataSeriesValue) {
            $dataSeriesValue->setLineWidth(60000 / Properties::POINTS_WIDTH_MULTIPLIER);
        }
        $dataSeriesValues = [];
        for ($i = 1; $i < count($dataGraph[0]); $i++) {
            $pos = $i + 65;
            $posTitle = chr($pos);
            $dataSeriesValues[] = new DataSeriesValues(
                DataSeriesValues::DATASERIES_TYPE_NUMBER,
                'TREND!$' . $posTitle . '$2:$' . $posTitle . '$' . $totalData,
                null,
                4
            );
        }
        foreach ($dataSeriesValues as $dataSeriesValue) {
            $dataSeriesValue->setLineWidth(60000 / Properties::POINTS_WIDTH_MULTIPLIER);
        }

        $dataSeriesLabels = [];
        for ($i = 1; $i < count($dataGraph[0]); $i++) {
            $pos = $i + 65;
            $posTitle = chr($pos);
            $dataSeriesLabels[] = new DataSeriesValues(
                DataSeriesValues::DATASERIES_TYPE_STRING,
                'TREND!$' . $posTitle . '$1',
                null,
                1
            );
        }
        $dataSeriesLabels[0]->setFillColor('FF0000');
        $xAxisTickValues = [
            new DataSeriesValues(
                DataSeriesValues::DATASERIES_TYPE_STRING,
                'TREND!$A$2:$A$' . $totalData,
                null,
                4
            ), // Q1 to Q(last)
        ];
        $dataSeriesValues = [];
        for ($i = 1; $i < count($dataGraph[0]); $i++) {
            $pos = $i + 65;
            $posTitle = chr($pos);
            $dataSeriesValues[] = new DataSeriesValues(
                DataSeriesValues::DATASERIES_TYPE_NUMBER,
                'TREND!$' . $posTitle . '$2:$' . $posTitle . '$' . $totalData,
                null,
                4
            );
        }
        $series = new DataSeries(
            DataSeries::TYPE_LINECHART, // plotType
            null, // plotGrouping, was DataSeries::GROUPING_STACKED, not a usual choice for line chart
            range(0, count($dataSeriesValues) - 1), // plotOrder
            $dataSeriesLabels, // plotLabel
            $xAxisTickValues, // plotCategory
            $dataSeriesValues        // plotValues
        );

        // Set the series in the plot area
        $plotArea = new PlotArea(null, [$series]);
        // Set the chart legend
        $legend = new ChartLegend(ChartLegend::POSITION_TOPRIGHT, null, false);

        $title = new Title('Persentase .................');
        $yAxisLabel = new Title('percent');

        // Create the chart
        $chart = new Chart(
            'chart1', // name
            $title, // title
            $legend, // legend
            $plotArea, // plotArea
            true, // plotVisibleOnly
            'gap',  // displayBlanksAs
            null, // xAxisLabel
            $yAxisLabel  // yAxisLabel
        );
        $chart->setTopLeftPosition('G1');
        $chart->setBottomRightPosition('S12');
        $worksheet->addChart($chart);

        return $chart;
    }
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $event->sheet->getDelegate()->getRowDimension(1)->setRowHeight(30);
                $highestRow = $event->sheet->getHighestRow();
                $highestColumn = $event->sheet->getHighestColumn();
                $range = 'A1:' . $highestColumn . $highestRow;
                $rangeA = 'A1:' . 'A' . $highestRow;
                $event->sheet->getDelegate()->getStyle($range)->getAlignment()->setWrapText(true);
                $event->sheet->getDelegate()->getStyle($range)->applyFromArray([
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN,
                            'color' => ['rgb' => '000000'],
                        ],
                    ],
                    'alignment' => [
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                ]);
                $styleHeader = [
                    'font' => [
                        'bold' => true,
                        'size' => 11,
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                    'borders' => [
                        'outline' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        ],
                    ],
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => 'FFFFFFFF',
                        ],
                        'endColor' => [
                            'argb' => 'FFFFFFFF',
                        ],
                    ],
                ];

                $event->sheet->getDelegate()->getStyle($rangeA)->applyFromArray([
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                    ],
                ]);
                $event->sheet->getDelegate()->getStyle('A1:F1')->applyFromArray($styleHeader);
                $chart = $this->charts();
                $event->sheet->getDelegate()->addChart($chart);
            },
        ];
    }
}
class Sheet8 implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithTitle
{
    /**
     * @return \Illuminate\Support\Collection
     */
    protected $data;
     protected $startDate;
    protected $endDate;
    protected $userId;
    protected $currently_id;

    public function __construct($startDate, $endDate, $userId,$currently_id)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->userId = $userId;
        $this->currently_id = $currently_id;
    }
    public function query()
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $query = RiskRegister::query()
            ->leftjoin('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
            ->leftjoin('indikator_fitur4s', 'indikator_fitur4s.id', 'risk_registers.indikator_fitur4_id')
            ->leftjoin('pics', 'pics.id', 'risk_registers.pic_id')
            ->leftjoin('users', 'users.id', 'risk_registers.user_id')
            ->leftjoin('waktu_implementasis', 'waktu_implementasis.id', 'risk_registers.waktu_implementasi_id')
            ->leftjoin('risk_gradings', 'risk_gradings.kode', 'risk_registers.concatdp1')
            ->select(DB::raw('row_number() OVER (ORDER BY risk_registers.osd1_dampak * risk_registers.osd1_probabilitas * risk_registers.osd1_controllability DESC) AS `Peringkat`'),'risk_registers.pernyataan_risiko', 'risk_registers.pengendalian_risiko as aksi', 'risk_registers.output', 'indikator_fitur4s.name', DB::raw(
                '
                CASE
                    WHEN risk_registers.realisasi_id = 1 THEN "Sudah Tercapai"
                    WHEN risk_registers.realisasi_id = 2 THEN "Sudah Tercapai"
                    ELSE ""
                END AS `PerluPenanganan`'
            ), 'waktu_implementasis.name as waktu_implementasi', 'users.name as pemilik_name', DB::raw("'Turun' AS 'tren'"), 'risk_gradings.name as grading')
            ->where('tipe_id', 1)
            ->orderBy('Peringkat','ASC')
            ->where($whosLogin);
        if (!empty($this->startDate) && !empty($this->endDate)) {
            $query->where('risk_registers.tgl_register', '>=', $this->startDate)
                ->where('risk_registers.tgl_register', '<=', Carbon::parse($this->endDate)->addDay());
        }
        if (!empty($this->currently_id)) {
            if ($this->currently_id['id'] <3) {
                $query->where('risk_registers.currently_id', '=', $this->currently_id['id']);
            }
            if ($this->currently_id['id'] == 3) {
                $query->whereIn('risk_registers.concatdp1', [14,15,23,24,25,31,32,33,34,35,41,42,43,44,45,51,52,53,54,55]);
            }
        }
        if (!empty($this->userId) && auth()->user()->can('lihat data semua risk register')) {
            $userIds = !empty($this->userId) ? array_map('intval', explode(',', $this->userId)) : [];
            $query->whereIn('risk_registers.user_id', $userIds);
        }



        $this->data = $query->get();
        return $query;
    }
    public function title(): string
    {
        return 'LAPORAN PEMANTAUAN';
    }
    public function headings(): array
    {
        return [
            ['No','Prioritas Risiko', 'Penanganan Risiko', 'Penanganan Risiko', 'Penanganan Risiko', 'Penanganan Risiko', 'Penanganan Risiko', 'Penanganan Risiko', 'Status Risiko', 'Status Risiko'],

            ['No','Prioritas Risiko', 'Aksi pengendalian', 'Output', 'Target', 'Realisasi', 'Waktu Implementasi', 'Penanggung jawab', 'Trend (naik/ turun)', 'Level Risiko'],
            ['(1)', '(2)', '(3)', '(4)', '(5)', '(6)', '(7)', '(8)', '(9)','(10)'],
        ];
    }
    public function columnWidths(): array
    {
        return [
            'A' => 5,
            'B' => 65,
            'C' => 25,
            'D' => 20,
            'E' => 20,
            'F' => 20,
            'G' => 20,
            'H' => 20,
            'I' => 20,
            'J' => 15,
        ];
    }
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $event->sheet->getDelegate()->getRowDimension(1)->setRowHeight(30);
                $highestRow = $event->sheet->getHighestRow();
                $highestColumn = $event->sheet->getHighestColumn();
                $range = 'A1:' . $highestColumn . $highestRow;
                $rangeA = 'A1:' . 'A' . $highestRow;
                $event->sheet->getDelegate()->getStyle($range)->getAlignment()->setWrapText(true);
                $event->sheet->getDelegate()->getStyle($range)->applyFromArray([
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN,
                            'color' => ['rgb' => '000000'],
                        ],
                    ],
                    'alignment' => [
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                ]);
                $styleHeader = [
                    'font' => [
                        'bold' => true,
                        'size' => 11,
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                    'borders' => [
                        'outline' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        ],
                    ],
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => 'FCE4D6',
                        ],
                        'endColor' => [
                            'argb' => 'FCE4D6',
                            // 'argb' => 'FFFFFFFF',
                            // 'argb' => 'FFFFFFFF',
                        ],
                    ],
                ];
                $styleHeader2 = [
                    'font' => [
                        'bold' => true,
                        'size' => 11,
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                    'borders' => [
                        'outline' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        ],
                    ],
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => 'D8D8D8',
                        ],
                        'endColor' => [
                            'argb' => 'D8D8D8',
                        ],
                    ],
                ];
                $styleHeader3 = [
                    'font' => [
                        'bold' => true,
                        'size' => 11,
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                    'borders' => [
                        'outline' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        ],
                    ],
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => 'FFFF00',
                        ],
                        'endColor' => [
                            'argb' => 'FFFF00',
                        ],
                    ],
                ];
                $styleHeader4 = [
                    'font' => [
                        'bold' => true,
                        'size' => 11,
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                    'borders' => [
                        'outline' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        ],
                    ],
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => '92D050',
                        ],
                        'endColor' => [
                            'argb' => '92D050',
                        ],
                    ],
                ];
                $event->sheet->getDelegate()->getStyle($rangeA)->applyFromArray([
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_LEFT,
                    ],
                ]);

                $event->sheet->getDelegate()->getStyle('A3:J3')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('A1:A2');
                $event->sheet->getDelegate()->getStyle('A1:A2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('B1:B2');
                $event->sheet->getDelegate()->getStyle('B1:B2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('C1:H1');
                $event->sheet->getDelegate()->getStyle('C1:H1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('C2:H2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('I1:J1');
                $event->sheet->getDelegate()->getStyle('I1:J1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('I2:J2')->applyFromArray($styleHeader);
            },
        ];
    }
}
