<?php

namespace App\Exports;

use App\Models\RiskRegister;
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
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Calculation\Calculation;


class FormatBPKPExport implements WithMultipleSheets
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
            new Sheet9($this->startDate, $this->endDate, $this->userId,$this->currently_id),
            new Sheet10($this->startDate, $this->endDate, $this->userId,$this->currently_id),
            new Sheet11($this->startDate, $this->endDate, $this->userId,$this->currently_id),
        ];
    }
}

class Sheet1 implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithTitle
{
    /**
     * @return \Illuminate\Support\Collection
     */
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
            ->leftJoin('sasaran_strategis', 'sasaran_strategis.id', 'indikator_fitur1s.sasaran_strategis_id')
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
                $subquery->whereIn('risk_registers.concatdp1', [24,25,33,34,35,42,43,44,45,51,52,53,54,55]);
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
        return 'Penetapan Konteks';
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
                            'argb' => '9BC2E6',
                        ],
                        'endColor' => [
                            'argb' => '9BC2E6',
                        ],
                    ],
                ];
                $event->sheet->getDelegate()->getStyle($rangeA)->applyFromArray([
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_LEFT,
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
            ->leftJoin('sasaran_strategis', 'sasaran_strategis.id', 'indikator_fitur4s.sasaran_strategis_id')
            ->leftJoin('identification_sources', 'identification_sources.id', 'risk_registers.identification_source_id')
            ->leftJoin('risk_varieties', 'risk_varieties.id', 'risk_registers.risk_variety_id')
            ->leftJoin('risk_types', 'risk_types.id', 'risk_registers.risk_type_id')
            ->leftJoin('pics', 'pics.id', 'risk_registers.pic_id')
            ->leftJoin('users', 'users.id', 'risk_registers.user_id')
            ->leftJoin('pics as pic2', 'pic2.id', 'users.pic_id')
            ->leftJoin('jenis_sebabs', 'jenis_sebabs.id', 'risk_registers.jenis_sebab_id')
            ->leftJoin('locations', 'locations.id', 'pics.location_id')
            ->leftJoin('locations as loc2', 'loc2.id', 'pic2.location_id')
            ->select(
            DB::raw("
                CASE
                WHEN risk_registers.risk_category_id = 5 THEN CONCAT('RSO.', RIGHT(YEAR(risk_registers.tgl_register), 2),'.02.43.',risk_registers.id)
                WHEN risk_registers.risk_category_id <> 5 THEN CONCAT('ROO.', RIGHT(YEAR(risk_registers.tgl_register), 2),'.02.43.',risk_registers.id)
            END AS Kode"),
            DB::raw("'C' AS 'UC/C'"))
            ->selectRaw(
                'sasaran_strategis.name, ' .
                    'risk_registers.resiko,' .
                    'risk_registers.sebab,' .
                    'indikator_fitur4s.tujuan, ' .
                    'risk_registers.pihak_terkena, ' .
                    'risk_categories.name as kategori_risiko, ' .
                    'jenis_sebabs.name as jenis_sebab, ' .
                    'identification_sources.name as identifikasi, ' .
                    'risk_varieties.name as jenis, ' .
                    'risk_types.name as tipe, ' .
                    'row_number() OVER (ORDER BY risk_registers.osd1_dampak * risk_registers.osd1_probabilitas * risk_registers.osd1_controllability DESC) AS `Peringkat`'
            )
            ->groupBy(
                'sasaran_strategis.name',
                'indikator_fitur4s.tujuan',
                'risk_registers.pihak_terkena',
                'locations.kode',
                'risk_categories.kode',
                'locations.id',
                'risk_registers.id',
                'risk_categories.id',
                'risk_categories.name',
                'jenis_sebabs.name',
                'risk_registers.osd1_dampak',
                'risk_registers.osd1_probabilitas',
                'risk_registers.osd1_controllability',
                'identification_sources.name',
                'risk_varieties.name',
                'risk_types.name',
            )
            
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
                $subquery->whereIn('risk_registers.concatdp1', [24,25,33,34,35,42,43,44,45,51,52,53,54,55]);
            }
        }
        if (!empty($this->userId) && auth()->user()->can('lihat data semua risk register')) {
            $userIds = !empty($this->userId) ? array_map('intval', explode(',', $this->userId)) : [];
            $subquery->whereIn('risk_registers.user_id', $userIds);
        }
        $query = DB::query()
            ->select('Peringkat', 'name', 'tujuan', 'kode', 'kategori_risiko', 'resiko', 'sebab', 'UC/C', 'pihak_terkena','jenis_sebab','identifikasi','jenis','tipe')
            ->fromSub($subquery, 'sub')
            ->orderBy('sub.Peringkat', 'ASC');



        $this->data = $query->get();
        return $query;
    }
    public function title(): string
    {
        return 'Identifikasi Risiko';
    }
    public function headings(): array
    {
        return [
            ['No', 'Sasaran Strategis', 'Indikator', 'Kode Risiko', 'Kategori Risiko', 'Pernyataan Risiko', 'Sebab', 'UC/C', 'Dampak (Pihak yang Terkena)','Jenis Sebab','Sumber Indentifikasi','Jenis Insiden','Tipe Insiden'],
            ['1', '2', '3', '4', '5', '6', '7', '8', '9','10','11','12','13'],
        ];
    }
    public function columnWidths(): array
    {
        return [
            'A' => 4,
            'B' => 36,
            'C' => 36,
            'D' => 20,
            'E' => 20,
            'F' => 60,
            'G' => 20,
            'H' => 7,
            'I' => 20,
            'J' => 20,
            'K' => 20,
            'L' => 20,
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
                            'argb' => '9BC2E6',
                        ],
                        'endColor' => [
                            'argb' => '9BC2E6',
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

                $event->sheet->getDelegate()->getStyle($rangeA)->applyFromArray([
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                    ],
                ]);
                $event->sheet->getDelegate()->getStyle('A1:M1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('A2:M2')->applyFromArray($styleHeader2);
            },
        ];
    }
}
class Sheet3 implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithTitle
{
    /**
     * @return \Illuminate\Support\Collection
     */
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
            ->leftjoin('indikator_fitur4s', 'indikator_fitur4s.id', 'risk_registers.indikator_fitur4_id')
            ->leftjoin('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
            ->leftjoin('risk_varieties', 'risk_varieties.id', 'risk_registers.risk_variety_id')
            ->leftjoin('risk_types', 'risk_types.id', 'risk_registers.risk_type_id')
            ->leftjoin('pics', 'pics.id', 'risk_registers.pic_id')
            ->leftjoin('users', 'users.id', 'risk_registers.user_id')
            ->leftJoin('pics as pic2', 'pic2.id', 'users.pic_id')
            ->leftJoin('locations', 'locations.id', 'pics.location_id')
            ->leftJoin('locations as loc2', 'loc2.id', 'pic2.location_id')
            ->leftJoin('sasaran_strategis', 'sasaran_strategis.id', 'indikator_fitur4s.sasaran_strategis_id')
            ->leftjoin('risk_gradings', 'risk_gradings.kode', 'risk_registers.concatdp1')
            ->select(
                DB::raw('row_number() OVER (ORDER BY risk_registers.osd1_dampak * risk_registers.osd1_probabilitas * risk_registers.osd1_controllability DESC) AS `row_number`'),
                'sasaran_strategis.name as Nama Konteks(Proses Bisnis)',
                'indikator_fitur4s.tujuan as Indikator',
                DB::raw("
                CASE
                WHEN risk_registers.risk_category_id = 5 THEN CONCAT('RSO.', RIGHT(YEAR(risk_registers.tgl_register), 2),'.02.43.',risk_registers.id)
                WHEN risk_registers.risk_category_id <> 5 THEN CONCAT('ROO.', RIGHT(YEAR(risk_registers.tgl_register), 2),'.02.43.',risk_registers.id)
            END AS Kode"),
                'risk_categories.name as Kategori Risiko',
                'risk_registers.resiko as Penyataan Risiko',
                'risk_registers.sebab as Sebab',
                DB::raw("'C' AS 'UC/C'"),
                'risk_registers.dampak',
                'risk_registers.osd1_dampak',
                'risk_registers.osd1_probabilitas',
                DB::raw('risk_registers.osd1_dampak * risk_registers.osd1_probabilitas AS `Tingkat risiko`'),
                'risk_gradings.name_bpkp',
                // DB::raw(
                //     '
                // CASE
                //     WHEN risk_registers.osd1_dampak * risk_registers.osd1_probabilitas > 14 THEN "SANGAT TINGGI"
                //     WHEN risk_registers.osd1_dampak * risk_registers.osd1_probabilitas > 9 THEN "TINGGI"
                //     WHEN risk_registers.osd1_dampak * risk_registers.osd1_probabilitas > 4 THEN "SEDANG"
                //     WHEN risk_registers.osd1_dampak * risk_registers.osd1_probabilitas > 2 THEN "RENDAH"
                //     ELSE "SANGAT RENDAH"
                // END AS `Peringkat Risiko`'
                // ),
                'users.name',
                'pics.name as pj',
            )
            ->where($whosLogin)
            ->orderBy('row_number', 'ASC');

        if (!empty($this->startDate) && !empty($this->endDate)) {
            $query->where('risk_registers.tgl_register', '>=', $this->startDate)
                ->where('risk_registers.tgl_register', '<=', Carbon::parse($this->endDate)->addDay());
        }
        if (!empty($this->currently_id)) {
            if ($this->currently_id['id'] <3) {
                $query->where('risk_registers.currently_id', '=', $this->currently_id['id']);
            }
            if ($this->currently_id['id'] == 3) {
                $query->whereIn('risk_registers.concatdp1', [24,25,33,34,35,42,43,44,45,51,52,53,54,55]);
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
        return 'Analisis Risiko';
    }
    public function headings(): array
    {
        return [
            ['No', 'Sasaran Strategis', 'Indikator', 'Kode Risiko', 'Kategori Risiko', 'Pernyataan Risiko', 'Sebab', 'UC/C', 'Dampak', 'Inherent Risk', 'Inherent Risk', 'Inherent Risk', 'Inherent Risk', 'Pemilik Risiko', 'Penanggungjawab'],
            ['No', 'Sasaran Strategis', 'Indikator', 'Kode Risiko', 'Kategori Risiko', 'Pernyataan Risiko', 'Sebab', 'UC/C', 'Dampak', 'Dampak', 'Probabilitas', 'Tingkat Risiko', 'Peringkat Risiko', 'Pemilik Risiko', 'Penanggungjawab'],
            ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'],
        ];
    }
    public function columnWidths(): array
    {
        return [
            'A' => 4,
            'B' => 36,
            'C' => 36,
            'D' => 20,
            'E' => 20,
            'F' => 60,
            'G' => 20,
            'H' => 7,
            'I' => 20,
            'J' => 20,
            'K' => 12,
            'L' => 10,
            'M' => 10,
            'N' => 20,
            'O' => 20,
        ];
    }
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $highestRow = $event->sheet->getHighestRow();
                $highestColumn = $event->sheet->getHighestColumn();
                $range = 'A1:' . $highestColumn . $highestRow;
                $rangeA = 'A1:' . 'A' . $highestRow;
                $rangeL = 'L4:' . 'L' . $highestRow;
                $rangeM = 'M4:' . 'M' . $highestRow;
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
                            'argb' => '9BC2E6',
                        ],
                        'endColor' => [
                            'argb' => '9BC2E6',
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
                            'argb' => 'FF0D0D',
                        ],
                    ],
                ];
                $styleT = [
                    $styleStandar,
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => 'FFC000',
                        ],
                    ],
                ];
                $styleM = [
                    $styleStandar,
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => 'FFFF00',
                        ],
                    ],
                ];
                $styleR = [
                    $styleStandar,
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => '00B0F0',
                        ],
                    ],
                ];
                $styleSR = [
                    $styleStandar,
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => '00B050',
                        ],
                    ],
                ];


                $conditional = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional->addCondition(14);
                $conditional->setText('SANGAT TINGGI');
                $conditional->getStyle()->applyFromArray($styleST);
                $conditionalStyles = $event->sheet->getStyle($rangeM)->getConditionalStyles();
                $conditionalStyles[] = $conditional;
                $event->sheet->getStyle($rangeM)->setConditionalStyles($conditionalStyles);

                $conditional2 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional2->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional2->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional2->addCondition(9);
                $conditional2->setText('TINGGI');
                $conditional2->getStyle()->applyFromArray($styleT);
                $conditional2Styles = $event->sheet->getStyle($rangeM)->getConditionalStyles();
                $conditional2Styles[] = $conditional2;
                $event->sheet->getStyle($rangeM)->setConditionalStyles($conditional2Styles);

                $conditional3 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional3->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional3->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional3->addCondition(4);
                $conditional3->setText('SEDANG');
                $conditional3->getStyle()->applyFromArray($styleM);
                $conditional3Styles = $event->sheet->getStyle($rangeM)->getConditionalStyles();
                $conditional3Styles[] = $conditional3;
                $event->sheet->getStyle($rangeM)->setConditionalStyles($conditional3Styles);

                $conditional5 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional5->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional5->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional5->addCondition(1);
                $conditional5->setText('SANGAT RENDAH');
                $conditional5->getStyle()->applyFromArray($styleSR);
                $conditional5Styles = $event->sheet->getStyle($rangeM)->getConditionalStyles();
                $conditional5Styles[] = $conditional5;
                $event->sheet->getStyle($rangeM)->setConditionalStyles($conditional5Styles);

                $conditional4 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional4->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional4->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional4->addCondition(2);
                $conditional4->setText('RENDAH');
                $conditional4->getStyle()->applyFromArray($styleR);
                $conditional4Styles = $event->sheet->getStyle($rangeM)->getConditionalStyles();
                $conditional4Styles[] = $conditional4;
                $event->sheet->getStyle($rangeM)->setConditionalStyles($conditional4Styles);

                $event->sheet->getDelegate()->getStyle('A3:O3')->applyFromArray($styleHeader2);
                $event->sheet->getDelegate()->getStyle($rangeA)->applyFromArray([
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_LEFT,
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
                $event->sheet->getDelegate()->mergeCells('I1:I2');
                $event->sheet->getDelegate()->getStyle('I1:I2')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('J1:M1');
                $event->sheet->getDelegate()->getStyle('J1:M1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('J2')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('K2')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('L2')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('M2')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('N1:N2');
                $event->sheet->getDelegate()->getStyle('N1:N2')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('O1:O2');
                $event->sheet->getDelegate()->getStyle('O1:O2')->applyFromArray($styleHeader);
            },
        ];
    }
}
class Sheet4 implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithTitle
{
    /**
     * @return \Illuminate\Support\Collection
     */
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
            ->leftjoin('indikator_fitur4s', 'indikator_fitur4s.id', 'risk_registers.indikator_fitur4_id')
            ->leftjoin('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
            ->leftjoin('risk_varieties', 'risk_varieties.id', 'risk_registers.risk_variety_id')
            ->leftjoin('risk_types', 'risk_types.id', 'risk_registers.risk_type_id')
            // ->leftjoin('pics', 'pics.id', 'risk_registers.pic_id')
            ->leftjoin('users', 'users.id', 'risk_registers.user_id')
            // ->leftJoin('pics as pic2', 'pic2.id', 'users.pic_id')
            // ->leftJoin('locations', 'locations.id', 'pics.location_id')
            // ->leftJoin('locations as loc2', 'loc2.id', 'pic2.location_id')
            ->leftJoin('sasaran_strategis', 'sasaran_strategis.id', 'indikator_fitur4s.sasaran_strategis_id')
            ->leftJoin('efektifs', 'efektifs.id', 'risk_registers.efektif_id')
            ->leftJoin('waktu_implementasis', 'waktu_implementasis.id', 'risk_registers.waktu_implementasi_id')
            ->leftJoin('opsi_pengendalians', 'opsi_pengendalians.id', 'risk_registers.opsi_pengendalian_id')
            ->leftjoin('risk_gradings', 'risk_gradings.kode', 'risk_registers.concatdp1')
            ->leftjoin('risk_gradings as risk_grading2', 'risk_grading2.kode', 'risk_registers.concatdp2')
            ->leftjoin('risk_gradings as risk_grading3', 'risk_grading3.kode', 'risk_registers.concatdp3')
            ->leftjoin("pics", \DB::raw("FIND_IN_SET(pics.id,risk_registers.pic_id)"), ">", \DB::raw("'0'"))
            ->select(
                DB::raw('row_number() OVER (ORDER BY risk_registers.osd1_dampak * risk_registers.osd1_probabilitas * risk_registers.osd1_controllability DESC) AS `Peringkat`'),
                DB::raw('DATE_FORMAT(risk_registers.tgl_register, "%d-%m-%Y") AS formatted_tgl_register'),
                'sasaran_strategis.name as Nama Konteks(Proses Bisnis)',
                'indikator_fitur4s.tujuan as Indikator',
                DB::raw("
                CASE
                WHEN risk_registers.risk_category_id = 5 THEN CONCAT('RSO.', RIGHT(YEAR(risk_registers.tgl_register), 2),'.02.43.',risk_registers.id)
                WHEN risk_registers.risk_category_id <> 5 THEN CONCAT('ROO.', RIGHT(YEAR(risk_registers.tgl_register), 2),'.02.43.',risk_registers.id)
            END AS Kode"),
                'risk_categories.name as Kategori Risiko',
                'risk_registers.resiko as Penyataan Risiko',
                'risk_registers.sebab as Sebab',
                DB::raw("'C' AS 'UC/C'"),
                'risk_registers.osd1_dampak',
                'risk_registers.osd1_probabilitas',
                DB::raw('risk_registers.osd1_dampak * risk_registers.osd1_probabilitas AS `Tingkat risiko`'),
                'risk_gradings.name_bpkp',
                'risk_registers.pengendalian_risiko',
                DB::raw("'Ada' AS 'Desain'"),
                'efektifs.name as efektifitas',
                'risk_registers.osd2_dampak',
                'risk_registers.osd2_probabilitas',
                DB::raw('risk_registers.osd2_dampak * risk_registers.osd2_probabilitas AS `Tingkat risiko2`'),
                'risk_grading2.name_bpkp AS name_bpkp2',
                'opsi_pengendalians.name as opsi',
                'risk_registers.rencana_pengendalian',
                'risk_registers.dokumen_pendukung',
                'waktu_implementasis.name as waktu_implemen',
                'users.name AS pemilik',
                \DB::raw("GROUP_CONCAT(pics.name) as picsname"),
                'risk_registers.osd3_dampak as dampak3',
                'risk_registers.osd3_probabilitas as probabilitas3',
                DB::raw('risk_registers.osd3_dampak * risk_registers.osd3_probabilitas AS `Tingkat risiko3`'),
                'risk_grading3.name_bpkp AS name_bpkp3',
                
            )
            ->groupBy('risk_registers.id','risk_gradings.name_bpkp','risk_grading2.name_bpkp','risk_grading3.name_bpkp')
            ->where($whosLogin)
            ->orderBy('Peringkat', 'ASC');
        if (!empty($this->startDate) && !empty($this->endDate)) {
            $query->where('risk_registers.tgl_register', '>=', $this->startDate)
                ->where('risk_registers.tgl_register', '<=', Carbon::parse($this->endDate)->addDay());
        }
        if (!empty($this->currently_id)) {
            if ($this->currently_id['id'] <3) {
                $query->where('risk_registers.currently_id', '=', $this->currently_id['id']);
            }
            if ($this->currently_id['id'] == 3) {
                $query->whereIn('risk_registers.concatdp1', [24,25,33,34,35,42,43,44,45,51,52,53,54,55]);
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
        return 'Evaluasi Risiko';
    }
    public function headings(): array
    {
        return [
            ['No', 'Tanggal Register', 'Sasaran Strategis', 'Indikator', 'Kode Risiko', 'Kategori Risiko', 'Pernyataan Risiko', 'Penyebab', 'UC/C', 'Inherent Risk', 'Inherent Risk', 'Inherent Risk', 'Inherent Risk', 'Pengendalian Yang Ada', 'Pengendalian Yang Ada', 'Pengendalian Yang Ada', 'Residual Risk', 'Residual Risk', 'Residual Risk', 'Residual Risk', 'Rencana Pengendalian (Untuk skor risk residual > selera risiko)', 'Rencana Pengendalian (Untuk skor risk residual > selera risiko)','Rencana Pengendalian (Untuk skor risk residual > selera risiko)', 'Rencana Pengendalian (Untuk skor risk residual > selera risiko)', 'Rencana Pengendalian (Untuk skor risk residual > selera risiko)', 'Rencana Pengendalian (Untuk skor risk residual > selera risiko)', 'Treated Risk', 'Treated Risk', 'Treated Risk', 'Treated Risk'],

            ['No', 'Tanggal Register', 'Sasaran Strategis', 'Indikator', 'Kode Risiko', 'Kategori Risiko', 'Pernyataan Risiko', 'Penyebab', 'UC/C', 'Dampak', 'Probability', 'Tingkat Risiko', 'Peringkat Risiko', 'Uraian', 'Desain', 'Efektifitas', 'Dampak', 'Probability', 'Tingkat Risiko', 'Peringkat Risiko', 'Strategi', 'Uraian', 'Indikator Keluaran', 'Jadwal', 'Pemilik Risiko','Penanggungjawab', 'Dampak', 'Probability', 'Tingkat Risiko', 'Peringkat Risiko'],

            ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
        ];
    }
    public function columnWidths(): array
    {
        return [
            'A' => 4,
            'B' => 15,
            'C' => 36,
            'D' => 36,
            'E' => 20,
            'F' => 20,
            'G' => 60,
            'H' => 20,
            'I' => 7,
            'J' => 12,
            'K' => 12,
            'L' => 10,
            'M' => 10,
            'N' => 45,
            'O' => 10,
            'P' => 25,
            'Q' => 12,
            'R' => 12,
            'S' => 10,
            'T' => 10,
            'U' => 20,
            'V' => 45,
            'W' => 20,
            'X' => 20,
            'Y' => 20,
            'Z' => 20,
            'AA' => 12,
            'AB' => 12,
            'AC' => 10,
            'AD' => 10,
        ];
    }
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $highestRow = $event->sheet->getHighestRow();
                $highestColumn = $event->sheet->getHighestColumn();
                $range = 'A1:' . $highestColumn . $highestRow;
                $rangeA = 'A1:' . 'A' . $highestRow;
                $rangeL = 'L4:' . 'L' . $highestRow;
                $rangeM = 'M4:' . 'M' . $highestRow;
                $rangeS = 'S4:' . 'S' . $highestRow;
                $rangeT = 'T4:' . 'T' . $highestRow;
                $rangeAB = 'AB4:' . 'AB' . $highestRow;
                $rangeAD = 'AD4:' . 'AD' . $highestRow;
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
                            'argb' => '9BC2E6',
                        ],
                        'endColor' => [
                            'argb' => '9BC2E6',
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
                            'argb' => 'FF0D0D',
                        ],
                    ],
                ];
                $styleT = [
                    $styleStandar,
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => 'FFC000',
                        ],
                    ],
                ];
                $styleM = [
                    $styleStandar,
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => 'FFFF00',
                        ],
                    ],
                ];
                $styleR = [
                    $styleStandar,
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => '00B0F0',
                        ],
                    ],
                ];
                $styleSR = [
                    $styleStandar,
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => '00B050',
                        ],
                    ],
                ];


                $conditional = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional->addCondition(14);
                $conditional->setText('SANGAT TINGGI');
                $conditional->getStyle()->applyFromArray($styleST);
                $conditionalStyles = $event->sheet->getStyle($rangeM)->getConditionalStyles();
                $conditionalStyles[] = $conditional;
                $event->sheet->getStyle($rangeM)->setConditionalStyles($conditionalStyles);

                $conditional2 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional2->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional2->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional2->addCondition(9);
                $conditional2->setText('TINGGI');
                $conditional2->getStyle()->applyFromArray($styleT);
                $conditional2Styles = $event->sheet->getStyle($rangeM)->getConditionalStyles();
                $conditional2Styles[] = $conditional2;
                $event->sheet->getStyle($rangeM)->setConditionalStyles($conditional2Styles);

                $conditional3 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional3->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional3->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional3->addCondition(4);
                $conditional3->setText('SEDANG');
                $conditional3->getStyle()->applyFromArray($styleM);
                $conditional3Styles = $event->sheet->getStyle($rangeM)->getConditionalStyles();
                $conditional3Styles[] = $conditional3;
                $event->sheet->getStyle($rangeM)->setConditionalStyles($conditional3Styles);
                
                $conditional5 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional5->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional5->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional5->addCondition(1);
                $conditional5->setText('SANGAT RENDAH');
                $conditional5->getStyle()->applyFromArray($styleSR);
                $conditional5Styles = $event->sheet->getStyle($rangeM)->getConditionalStyles();
                $conditional5Styles[] = $conditional5;
                $event->sheet->getStyle($rangeM)->setConditionalStyles($conditional5Styles);

                $conditional4 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional4->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional4->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional4->addCondition(2);
                $conditional4->setText('RENDAH');
                $conditional4->getStyle()->applyFromArray($styleR);
                $conditional4Styles = $event->sheet->getStyle($rangeM)->getConditionalStyles();
                $conditional4Styles[] = $conditional4;
                $event->sheet->getStyle($rangeM)->setConditionalStyles($conditional4Styles);


                $conditional = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional->addCondition(14);
                $conditional->setText('SANGAT TINGGI');
                $conditional->getStyle()->applyFromArray($styleST);
                $conditionalStyles = $event->sheet->getStyle($rangeT)->getConditionalStyles();
                $conditionalStyles[] = $conditional;
                $event->sheet->getStyle($rangeT)->setConditionalStyles($conditionalStyles);

                $conditional2 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional2->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional2->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional2->addCondition(9);
                $conditional2->setText('TINGGI');
                $conditional2->getStyle()->applyFromArray($styleT);
                $conditional2Styles = $event->sheet->getStyle($rangeT)->getConditionalStyles();
                $conditional2Styles[] = $conditional2;
                $event->sheet->getStyle($rangeT)->setConditionalStyles($conditional2Styles);

                $conditional3 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional3->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional3->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional3->addCondition(4);
                $conditional3->setText('SEDANG');
                $conditional3->getStyle()->applyFromArray($styleM);
                $conditional3Styles = $event->sheet->getStyle($rangeT)->getConditionalStyles();
                $conditional3Styles[] = $conditional3;
                $event->sheet->getStyle($rangeT)->setConditionalStyles($conditional3Styles);
                
                $conditional5 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional5->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional5->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional5->addCondition(1);
                $conditional5->setText('SANGAT RENDAH');
                $conditional5->getStyle()->applyFromArray($styleSR);
                $conditional5Styles = $event->sheet->getStyle($rangeT)->getConditionalStyles();
                $conditional5Styles[] = $conditional5;
                $event->sheet->getStyle($rangeT)->setConditionalStyles($conditional5Styles);

                $conditional4 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional4->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional4->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional4->addCondition(2);
                $conditional4->setText('RENDAH');
                $conditional4->getStyle()->applyFromArray($styleR);
                $conditional4Styles = $event->sheet->getStyle($rangeT)->getConditionalStyles();
                $conditional4Styles[] = $conditional4;
                $event->sheet->getStyle($rangeT)->setConditionalStyles($conditional4Styles);

                $conditional = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional->addCondition(14);
                $conditional->setText('SANGAT TINGGI');
                $conditional->getStyle()->applyFromArray($styleST);
                $conditionalStyles = $event->sheet->getStyle($rangeAD)->getConditionalStyles();
                $conditionalStyles[] = $conditional;
                $event->sheet->getStyle($rangeAD)->setConditionalStyles($conditionalStyles);

                $conditional2 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional2->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional2->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional2->addCondition(9);
                $conditional2->setText('TINGGI');
                $conditional2->getStyle()->applyFromArray($styleT);
                $conditional2Styles = $event->sheet->getStyle($rangeAD)->getConditionalStyles();
                $conditional2Styles[] = $conditional2;
                $event->sheet->getStyle($rangeAD)->setConditionalStyles($conditional2Styles);

                $conditional3 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional3->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional3->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional3->addCondition(4);
                $conditional3->setText('SEDANG');
                $conditional3->getStyle()->applyFromArray($styleM);
                $conditional3Styles = $event->sheet->getStyle($rangeAD)->getConditionalStyles();
                $conditional3Styles[] = $conditional3;
                $event->sheet->getStyle($rangeAD)->setConditionalStyles($conditional3Styles);
                
                $conditional5 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional5->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional5->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional5->addCondition(1);
                $conditional5->setText('SANGAT RENDAH');
                $conditional5->getStyle()->applyFromArray($styleSR);
                $conditional5Styles = $event->sheet->getStyle($rangeAD)->getConditionalStyles();
                $conditional5Styles[] = $conditional5;
                $event->sheet->getStyle($rangeAD)->setConditionalStyles($conditional5Styles);

                $conditional4 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional4->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional4->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional4->addCondition(2);
                $conditional4->setText('RENDAH');
                $conditional4->getStyle()->applyFromArray($styleR);
                $conditional4Styles = $event->sheet->getStyle($rangeAD)->getConditionalStyles();
                $conditional4Styles[] = $conditional4;
                $event->sheet->getStyle($rangeAD)->setConditionalStyles($conditional4Styles);

                $event->sheet->getDelegate()->getStyle('A3:AD3')->applyFromArray($styleHeader2);
                $event->sheet->getDelegate()->getStyle($rangeA)->applyFromArray([
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_LEFT,
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
                $event->sheet->getDelegate()->mergeCells('I1:I2');
                $event->sheet->getDelegate()->getStyle('I1:I2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('J1:M1');
                $event->sheet->getDelegate()->getStyle('J1:M1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('J2:M2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('N1:P1');
                $event->sheet->getDelegate()->getStyle('N1:P1')->applyFromArray($styleHeader3);
                $event->sheet->getDelegate()->getStyle('N2:P2')->applyFromArray($styleHeader3);

                $event->sheet->getDelegate()->mergeCells('Q1:T1');
                $event->sheet->getDelegate()->getStyle('Q1:T1')->applyFromArray($styleHeader3);
                $event->sheet->getDelegate()->getStyle('Q2:T2')->applyFromArray($styleHeader3);

                $event->sheet->getDelegate()->mergeCells('U1:Z1');
                $event->sheet->getDelegate()->getStyle('U1:Z1')->applyFromArray($styleHeader3);
                $event->sheet->getDelegate()->getStyle('U2:Z2')->applyFromArray($styleHeader3);

                $event->sheet->getDelegate()->mergeCells('AA1:AD1');
                $event->sheet->getDelegate()->getStyle('AA1:AD1')->applyFromArray($styleHeader4);
                $event->sheet->getDelegate()->getStyle('AA2:AD2')->applyFromArray($styleHeader4);
            },
        ];
    }
}
class Sheet5 implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithTitle
{
    /**
     * @return \Illuminate\Support\Collection
     */
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
            ->leftjoin('indikator_fitur4s', 'indikator_fitur4s.id', 'risk_registers.indikator_fitur4_id')
            ->leftjoin('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
            ->leftjoin('risk_varieties', 'risk_varieties.id', 'risk_registers.risk_variety_id')
            ->leftjoin('risk_types', 'risk_types.id', 'risk_registers.risk_type_id')
            ->leftjoin('pics', 'pics.id', 'risk_registers.pic_id')
            ->leftjoin('users', 'users.id', 'risk_registers.user_id')
            ->leftjoin('risk_gradings', 'risk_gradings.kode', 'risk_registers.concatdp1')
            ->select(
                DB::raw('row_number() OVER (ORDER BY risk_registers.osd1_dampak * risk_registers.osd1_probabilitas * risk_registers.osd1_controllability DESC) AS `No Urut`'),
                'risk_registers.resiko as Penyataan Risiko',
                'risk_categories.name as Kategori Risiko',
                'risk_registers.sebab as Sebab',
                'risk_registers.osd1_dampak',
                'risk_registers.osd1_probabilitas',
                'risk_registers.osd1_controllability',
                DB::raw('risk_registers.osd1_dampak * risk_registers.osd1_probabilitas * risk_registers.osd1_controllability AS `Skor`'),
                DB::raw('row_number() OVER (ORDER BY risk_registers.osd1_dampak * risk_registers.osd1_probabilitas * risk_registers.osd1_controllability DESC) AS `Peringkat1`'),
                'users.name',
                'risk_gradings.name_bpkp',
            )
            // ->groupBy(
            //     'risk_registers.resiko',
            //     'risk_categories.name',
            //     'risk_registers.sebab',
            //     'risk_registers.osd2_dampak',
            //     'risk_registers.osd2_probabilitas',
            //     'risk_registers.osd2_controllability'
            // )
            
            ->where($whosLogin)
            ->orderBy('Peringkat1', 'ASC');
        if (!empty($this->startDate) && !empty($this->endDate)) {
            $query->where('risk_registers.tgl_register', '>=', $this->startDate)
                ->where('risk_registers.tgl_register', '<=', Carbon::parse($this->endDate)->addDay());
        }
        if (!empty($this->currently_id)) {
            if ($this->currently_id['id'] <3) {
                $query->where('risk_registers.currently_id', '=', $this->currently_id['id']);
            }
            if ($this->currently_id['id'] == 3) {
                $query->whereIn('risk_registers.concatdp1', [24,25,33,34,35,42,43,44,45,51,52,53,54,55]);
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
        return 'Profil Risiko';
    }
    public function headings(): array
    {
        return [
            ['No', 'Pernyataan Risiko', 'Kategori Risiko', 'Penyebab Risiko', 'Probabilitas', 'Dampak', 'Controllability', 'Skor', 'Ranking','Pemilik Risiko','Peringkat Risiko'],
            ['1', '2', '3', '4', '5', '6', '7', '8', '9','10','11'],
        ];
    }
    public function columnWidths(): array
    {
        return [
            'A' => 4,
            'B' => 65,
            'C' => 26,
            'D' => 36,
            'E' => 12,
            'F' => 12,
            'G' => 15,
            'H' => 7,
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
                $highestRow = $event->sheet->getHighestRow();
                $highestColumn = $event->sheet->getHighestColumn();
                $range = 'A1:' . $highestColumn . $highestRow;
                $rangeA = 'A1:' . 'A' . $highestRow;
                $rangeK = 'K3:' . 'K' . $highestRow;
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
                            'argb' => '9BC2E6',
                        ],
                        'endColor' => [
                            'argb' => '9BC2E6',
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
                            'argb' => 'FF0D0D',
                        ],
                    ],
                ];
                $styleT = [
                    $styleStandar,
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => 'FFC000',
                        ],
                    ],
                ];
                $styleM = [
                    $styleStandar,
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => 'FFFF00',
                        ],
                    ],
                ];
                $styleR = [
                    $styleStandar,
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => '00B0F0',
                        ],
                    ],
                ];
                $styleSR = [
                    $styleStandar,
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                        'rotation' => 90,
                        'startColor' => [
                            'argb' => '00B050',
                        ],
                    ],
                ];
                $conditional = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional->addCondition(14);
                $conditional->setText('SANGAT TINGGI');
                $conditional->getStyle()->applyFromArray($styleST);
                $conditionalStyles = $event->sheet->getStyle($rangeK)->getConditionalStyles();
                $conditionalStyles[] = $conditional;
                $event->sheet->getStyle($rangeK)->setConditionalStyles($conditionalStyles);

                $conditional2 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional2->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional2->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional2->addCondition(9);
                $conditional2->setText('TINGGI');
                $conditional2->getStyle()->applyFromArray($styleT);
                $conditional2Styles = $event->sheet->getStyle($rangeK)->getConditionalStyles();
                $conditional2Styles[] = $conditional2;
                $event->sheet->getStyle($rangeK)->setConditionalStyles($conditional2Styles);

                $conditional3 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional3->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional3->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional3->addCondition(4);
                $conditional3->setText('SEDANG');
                $conditional3->getStyle()->applyFromArray($styleM);
                $conditional3Styles = $event->sheet->getStyle($rangeK)->getConditionalStyles();
                $conditional3Styles[] = $conditional3;
                $event->sheet->getStyle($rangeK)->setConditionalStyles($conditional3Styles);
                
                $conditional5 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional5->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional5->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional5->addCondition(1);
                $conditional5->setText('SANGAT RENDAH');
                $conditional5->getStyle()->applyFromArray($styleSR);
                $conditional5Styles = $event->sheet->getStyle($rangeK)->getConditionalStyles();
                $conditional5Styles[] = $conditional5;
                $event->sheet->getStyle($rangeK)->setConditionalStyles($conditional5Styles);

                $conditional4 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional4->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional4->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional4->addCondition(2);
                $conditional4->setText('RENDAH');
                $conditional4->getStyle()->applyFromArray($styleR);
                $conditional4Styles = $event->sheet->getStyle($rangeK)->getConditionalStyles();
                $conditional4Styles[] = $conditional4;
                $event->sheet->getStyle($rangeK)->setConditionalStyles($conditional4Styles);

                $event->sheet->getDelegate()->getStyle($rangeA)->applyFromArray([
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                    ],
                ]);
                $event->sheet->getDelegate()->getStyle('A1:F1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('G1:K1')->applyFromArray($styleHeader3);
                $event->sheet->getDelegate()->getStyle('A2:K2')->applyFromArray($styleHeader2);
            },
        ];
    }
}
class Sheet6 implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithTitle
{
    /**
     * @return \Illuminate\Support\Collection
     */
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
            ->select(DB::raw('row_number() OVER (ORDER BY risk_registers.osd1_dampak * risk_registers.osd1_probabilitas * risk_registers.osd1_controllability DESC) AS `row_number`'), 'risk_registers.resiko as risiko_prioritas', 'risk_registers.rencana_pengendalian', 'risk_registers.output', 'waktu_pengendalians.name as rencana_waktu', 'waktu_implementasis.name as waktu_implementasi', 'pics.name as PJ','users.name as pemilik', 'risk_registers.dokumen_pendukung', 'risk_registers.kendala')
            ->leftjoin('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
            ->leftjoin('indikator_fitur4s', 'indikator_fitur4s.id', 'risk_registers.indikator_fitur4_id')
            ->leftjoin('identification_sources', 'identification_sources.id', 'risk_registers.identification_source_id')
            ->leftjoin('locations', 'locations.id', 'indikator_fitur4s.location_id')
            ->leftjoin('sasaran_strategis', 'sasaran_strategis.id', 'indikator_fitur4s.sasaran_strategis_id')
            ->leftjoin('risk_varieties', 'risk_varieties.id', 'risk_registers.risk_variety_id')
            ->leftjoin('risk_types', 'risk_types.id', 'risk_registers.risk_type_id')
            ->leftjoin('impact_values', 'impact_values.id', 'risk_registers.osd1_dampak')
            ->leftjoin('probability_values', 'probability_values.id', 'risk_registers.osd1_probabilitas')
            ->leftjoin('control_values', 'control_values.id', 'risk_registers.osd1_controllability')
            ->leftjoin('impact_values as sa1', 'sa1.id', 'risk_registers.osd2_dampak')
            ->leftjoin('probability_values as sa2', 'sa2.id', 'risk_registers.osd2_probabilitas')
            ->leftjoin('control_values as sa3', 'sa3.id', 'risk_registers.osd2_controllability')
            ->leftjoin('pics', 'pics.id', 'risk_registers.pic_id')
            ->leftjoin('users', 'users.id', 'risk_registers.user_id')
            ->leftjoin('waktu_pengendalians', 'waktu_pengendalians.id', 'risk_registers.waktu_pengendalian_id')
            ->leftjoin('waktu_implementasis', 'waktu_implementasis.id', 'risk_registers.waktu_implementasi_id')
            ->where($whosLogin)
            ->orderBy('row_number', 'ASC');
        if (!empty($this->startDate) && !empty($this->endDate)) {
            $query->where('risk_registers.tgl_register', '>=', $this->startDate)
                ->where('risk_registers.tgl_register', '<=', Carbon::parse($this->endDate)->addDay());
        }
        if (!empty($this->currently_id)) {
            if ($this->currently_id['id'] <3) {
                $query->where('risk_registers.currently_id', '=', $this->currently_id['id']);
            }
            if ($this->currently_id['id'] == 3) {
                $query->whereIn('risk_registers.concatdp1', [24,25,33,34,35,42,43,44,45,51,52,53,54,55]);
            }
        }
        if (!empty($this->userId) && auth()->user()->can('lihat data semua risk register')) {
            $userIds = !empty($this->userId) ? array_map('intval', explode(',', $this->userId)) : [];
            $query->whereIn('risk_registers.user_id', $userIds);
        }
        $q1 = DB::table('risk_register_histories')
            ->select(DB::raw('COUNT(*)'))
            ->where('currently_id', 2)
            ->whereBetween('created_at', ['2023-01-01', '2023-03-31'])
            ->whereRaw('risk_register_histories.risk_register_id = risk_registers.id');
        $q2 = DB::table('risk_register_histories')
            ->select(DB::raw('COUNT(*)'))
            ->where('currently_id', 2)
            ->whereBetween('created_at', ['2023-04-01', '2023-06-30'])
            ->whereRaw('risk_register_histories.risk_register_id = risk_registers.id');
        $q3 = DB::table('risk_register_histories')
            ->select(DB::raw('COUNT(*)'))
            ->where('currently_id', 2)
            ->whereBetween('created_at', ['2023-07-01', '2023-09-30'])
            ->whereRaw('risk_register_histories.risk_register_id = risk_registers.id');
        $q4 = DB::table('risk_register_histories')
            ->select(DB::raw('COUNT(*)'))
            ->where('currently_id', 2)
            ->whereBetween('created_at', ['2023-10-01', '2023-12-31'])
            ->whereRaw('risk_register_histories.risk_register_id = risk_registers.id');
        $totalq = DB::table('risk_register_histories')
            ->select(DB::raw('COUNT(*)'))
            ->where('currently_id', 2)
            ->whereBetween('created_at', ['2023-01-01', '2023-12-31'])
            ->whereRaw('risk_register_histories.risk_register_id = risk_registers.id');

        // Adding the subquery result as a column in the main query
        $query->addSelect(['q1' => $q1,'q2' => $q2,'q3' => $q3,'q4' => $q4,'totalq' => $totalq]);
        $this->data = $query->get();
        return $query;
    }
    public function title(): string
    {
        return 'Pematauan Pengendalian Risiko';
    }
    public function headings(): array
    {
        return [
            ['No', 'Risiko Prioritas', 'Pemantauan RTP', 'Pemantauan RTP', 'Pemantauan RTP', 'Pemantauan RTP', 'Pemantauan RTP', 'Pemantauan RTP', 'Pemantauan RTP', 'Pemantauan Keterjadian Risiko', 'Pemantauan Keterjadian Risiko', 'Pemantauan Keterjadian Risiko', 'Pemantauan Keterjadian Risiko', 'Pemantauan Keterjadian Risiko'],

            ['No', 'Risiko Prioritas', 'Uraian Tindak Pengendalian', 'Uraian Tindak Pengendalian', 'Waktu Tindak Pengendalian', 'Waktu Tindak Pengendalian', 'Penanggungjawab','Pemilik Risiko', 'Dokumen Pendukung', 'Kendala', 'Jumlah Keterjadian', 'Jumlah Keterjadian', 'Jumlah Keterjadian', 'Jumlah Keterjadian', 'Jumlah Keterjadian'],

            ['No', 'Risiko Prioritas', 'Rencana', 'Realisasi', 'Rencana', 'Realisasi', 'Penanggungjawab','Pemilik Risiko', 'Dokumen Pendukung', 'Kendala', 'Triwulan I', 'Triwulan II', 'Triwulan III', 'Triwulan IV', 'Total'],

            ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14','15'],
        ];
    }
    public function columnWidths(): array
    {
        return [
            'A' => 4,
            'B' => 65,
            'C' => 36,
            'D' => 36,
            'E' => 20,
            'F' => 20,
            'G' => 26,
            'H' => 26,
            'I' => 26,
            'J' => 26,
            'K' => 20,
            'L' => 20,
            'M' => 20,
            'N' => 20,
            'O' => 10,
        ];
    }
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $highestRow = $event->sheet->getHighestRow();
                $highestColumn = $event->sheet->getHighestColumn();
                $range = 'A1:' . $highestColumn . $highestRow;
                $rangeA = 'A1:' . 'A' . $highestRow;
                $rangeL = 'L4:' . 'L' . $highestRow;
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
                            'argb' => '9BC2E6',
                        ],
                        'endColor' => [
                            'argb' => '9BC2E6',
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

                $event->sheet->getDelegate()->getStyle('A4:O4')->applyFromArray($styleHeader2);
                $event->sheet->getDelegate()->getStyle($rangeA)->applyFromArray([
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_LEFT,
                    ],
                ]);
                $event->sheet->getDelegate()->mergeCells('A1:A3');
                $event->sheet->getDelegate()->getStyle('A1:A3')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('B1:B3');
                $event->sheet->getDelegate()->getStyle('B1:B3')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('C1:I1');
                $event->sheet->getDelegate()->getStyle('C1:I1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('C2:D2');
                $event->sheet->getDelegate()->getStyle('C2:D2')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('C3:F3')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('E2:F2');
                $event->sheet->getDelegate()->getStyle('E2:F2')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('G2:G3');
                $event->sheet->getDelegate()->getStyle('G2:G3')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('H2:H3');
                $event->sheet->getDelegate()->getStyle('H2:H3')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('I2:I3');
                $event->sheet->getDelegate()->getStyle('I2:I3')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('J2:J3');
                $event->sheet->getDelegate()->getStyle('K2:K3')->applyFromArray($styleHeader);


                $event->sheet->getDelegate()->mergeCells('K1:O1');
                $event->sheet->getDelegate()->getStyle('K1:O1')->applyFromArray($styleHeader4);
                $event->sheet->getDelegate()->mergeCells('K2:O2');
                $event->sheet->getDelegate()->getStyle('K2:O2')->applyFromArray($styleHeader4);
                $event->sheet->getDelegate()->getStyle('K3:O3')->applyFromArray($styleHeader4);
            },
        ];
    }
}
class Sheet7 implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithTitle
{
    /**
     * @return \Illuminate\Support\Collection
     */
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
            ->leftjoin('indikator_fitur4s', 'indikator_fitur4s.id', 'risk_registers.indikator_fitur4_id')
            ->leftjoin('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
            ->leftjoin('risk_varieties', 'risk_varieties.id', 'risk_registers.risk_variety_id')
            ->leftjoin('risk_types', 'risk_types.id', 'risk_registers.risk_type_id')
            ->leftjoin('formulir_rcas', 'formulir_rcas.risk_register_id', 'risk_registers.id')
            // ->leftjoin('pics', 'pics.id', 'risk_registers.pic_id')
            ->leftjoin('users', 'users.id', 'risk_registers.user_id')
            ->leftjoin("pics", \DB::raw("FIND_IN_SET(pics.id,risk_registers.pic_id)"), ">", \DB::raw("'0'"))
            ->leftjoin('jenis_sebabs', 'jenis_sebabs.id', 'risk_registers.jenis_sebab_id')
            ->select(
                DB::raw('row_number() OVER (ORDER BY risk_registers.osd1_dampak * risk_registers.osd1_probabilitas * risk_registers.osd1_controllability DESC) AS `Peringkat`'),
                'risk_registers.resiko as PenyataanRisiko',
                'formulir_rcas.why1',
                'formulir_rcas.why2',
                'formulir_rcas.why3',
                'formulir_rcas.why4',
                'formulir_rcas.why5',
                'formulir_rcas.akar_penyebab',
                \DB::raw("GROUP_CONCAT(pics.name) as picsname"),
                'users.name as pemilik',
                'jenis_sebabs.name as jenis',
                'risk_registers.rencana_pengendalian',
                'risk_registers.id'
            )->groupBy("risk_registers.id","PenyataanRisiko","why1",'why2','why3','why4','why5','akar_penyebab','pemilik','jenis','rencana_pengendalian')
            
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
                $query->whereIn('risk_registers.concatdp1', [24,25,33,34,35,42,43,44,45,51,52,53,54,55]);
            }
        }
        if (!empty($this->userId) && auth()->user()->can('lihat data semua risk register')) {
            $userIds = !empty($this->userId) ? array_map('intval', explode(',', $this->userId)) : [];
            $query->whereIn('risk_registers.user_id', $userIds);
        }
        $query = DB::query()
            ->select('Peringkat', 'PenyataanRisiko', 'why1', 'why2', 'why3', 'why4', 'why5', 'akar_penyebab', 'picsname', 'pemilik', 'jenis', 'rencana_pengendalian')
            ->fromSub($query, 'sub')
            ->orderBy('sub.Peringkat', 'ASC');
        $this->data = $query->get();

        return $query;
    }
    public function title(): string
    {
        return 'Formulir RCA';
    }
    public function headings(): array
    {
        return [
            ['No', 'Pernyataan Risiko', 'Why 1', 'Why 2', 'Why 3', 'Why 4', 'Why 5', 'Akar Penyebab', 'Penanggungjawab','Pemilik Risiko', 'Jenis Penyebab', 'Kegiatan Pengendalian'],
            ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11','12'],
        ];
    }
    public function columnWidths(): array
    {
        return [
            'A' => 4,
            'B' => 65,
            'C' => 45,
            'D' => 45,
            'E' => 45,
            'F' => 45,
            'G' => 45,
            'H' => 45,
            'I' => 25,
            'J' => 25,
            'K' => 25,
            'L' => 45,
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
                            'argb' => '9BC2E6',
                        ],
                        'endColor' => [
                            'argb' => '9BC2E6',
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

                $event->sheet->getDelegate()->getStyle($rangeA)->applyFromArray([
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                    ],
                ]);
                $event->sheet->getDelegate()->getStyle('A1:L1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('A2:L2')->applyFromArray($styleHeader2);
            },
        ];
    }
}
class Sheet8 implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithTitle
{
    /**
     * @return \Illuminate\Support\Collection
     */
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
            ->leftjoin('indikator_fitur4s', 'indikator_fitur4s.id', 'risk_registers.indikator_fitur4_id')
            ->leftjoin('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
            ->leftjoin('risk_varieties', 'risk_varieties.id', 'risk_registers.risk_variety_id')
            ->leftjoin('risk_types', 'risk_types.id', 'risk_registers.risk_type_id')
            ->leftjoin('pics', 'pics.id', 'risk_registers.pic_id')
            ->leftjoin('users', 'users.id', 'risk_registers.user_id')
            ->leftjoin('fgd_inherents', 'fgd_inherents.risk_register_id', 'risk_registers.id')
            ->select(
                DB::raw('row_number() OVER (ORDER BY risk_registers.osd1_dampak * risk_registers.osd1_probabilitas * risk_registers.osd1_controllability DESC) AS `row_number`'),
                'risk_registers.resiko as Penyataan Risiko',
                'fgd_inherents.dampak_responden1',
                'fgd_inherents.dampak_responden2',
                'fgd_inherents.dampak_responden3',
                'fgd_inherents.dampak_responden4',
                'fgd_inherents.dampak_responden5',
                'fgd_inherents.dampak_responden6',
                'fgd_inherents.dampak_responden7',
                'fgd_inherents.dampak_responden8',
                'fgd_inherents.probabilitas_responden1',
                'fgd_inherents.probabilitas_responden2',
                'fgd_inherents.probabilitas_responden3',
                'fgd_inherents.probabilitas_responden4',
                'fgd_inherents.probabilitas_responden5',
                'fgd_inherents.probabilitas_responden6',
                'fgd_inherents.probabilitas_responden7',
                'fgd_inherents.probabilitas_responden8',
                DB::raw("'-' AS 'Responden'"),
                DB::raw("'-' AS 'Responden1'"),
            )
            
            ->where($whosLogin)
            ->orderBy('row_number', 'ASC');
        if (!empty($this->startDate) && !empty($this->endDate)) {
            $query->where('risk_registers.tgl_register', '>=', $this->startDate)
                ->where('risk_registers.tgl_register', '<=', Carbon::parse($this->endDate)->addDay());
        }
        if (!empty($this->currently_id)) {
            if ($this->currently_id['id'] <3) {
                $query->where('risk_registers.currently_id', '=', $this->currently_id['id']);
            }
            if ($this->currently_id['id'] == 3) {
                $query->whereIn('risk_registers.concatdp1', [24,25,33,34,35,42,43,44,45,51,52,53,54,55]);
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
        return 'Formulir FGD Inherent';
    }
    public function headings(): array
    {
        return [
            ['No', 'Pernyataan Risiko', 'Skor Dampak', 'Skor Dampak', 'Skor Dampak', 'Skor Dampak', 'Skor Dampak', 'Skor Dampak', 'Skor Dampak', 'Skor Dampak', 'Skor Kemungkinan',  'Skor Kemungkinan',  'Skor Kemungkinan',  'Skor Kemungkinan',  'Skor Kemungkinan',  'Skor Kemungkinan', 'Skor Kemungkinan',  'Skor Kemungkinan', 'Modus', 'Modus'],
            ['No', 'Pernyataan Risiko', 'Responden 1', 'Responden 2', 'Responden 3', 'Responden 4', 'Responden 5', 'Responden 6', 'Responden 7', 'Responden 8',  'Responden 1', 'Responden 2', 'Responden 3', 'Responden 4', 'Responden 5', 'Responden 6', 'Responden 7', 'Responden 8', 'Dampak', 'Probabilitas'],
        ];
    }
    public function columnWidths(): array
    {
        return [
            'A' => 4,
            'B' => 65,
            'C' => 15,
            'D' => 15,
            'E' => 15,
            'F' => 15,
            'G' => 15,
            'H' => 15,
            'I' => 15,
            'J' => 15,
            'K' => 15,
            'L' => 15,
            'M' => 15,
            'N' => 15,
            'O' => 15,
            'P' => 15,
            'Q' => 15,
            'R' => 15,
            'S' => 15,
            'T' => 15,
        ];
    }
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $highestRow = $event->sheet->getHighestRow();
                $highestColumn = $event->sheet->getHighestColumn();
                $range = 'A1:' . $highestColumn . $highestRow;
                $rangeA = 'A1:' . 'A' . $highestRow;
                $rangeL = 'L4:' . 'L' . $highestRow;
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
                            'argb' => '9BC2E6',
                        ],
                        'endColor' => [
                            'argb' => '9BC2E6',
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


                $event->sheet->getDelegate()->getStyle($rangeA)->applyFromArray([
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_LEFT,
                    ],
                ]);
                $worksheet = $event->sheet->getDelegate();
                $startRow = 3; // Assuming your data starts from row 3
                $endRow = $highestRow; // You need to determine the highest row based on your data
                for ($row = $startRow; $row <= $endRow; $row++) {
                    foreach (range($startRow, $endRow) as $row) {
                        $formula = '=IFERROR(MODE.MULT(C' . $row . ':J' . $row . '), "")';
                        $worksheet->getCell('S' . $row)->setValue($formula);
                        $formula1 = '=IFERROR(MODE.MULT(K' . $row . ':R' . $row . '), "")';
                        $worksheet->getCell('T' . $row)->setValue($formula1);
                    }
                }

                $event->sheet->getDelegate()->mergeCells('A1:A2');
                $event->sheet->getDelegate()->getStyle('A1:A2')->applyFromArray($styleHeader2);
                $event->sheet->getDelegate()->mergeCells('B1:B2');
                $event->sheet->getDelegate()->getStyle('B1:B2')->applyFromArray($styleHeader2);
                $event->sheet->getDelegate()->mergeCells('C1:J1');
                $event->sheet->getDelegate()->getStyle('C1:J1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('C2:J2')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('K1:R1');
                $event->sheet->getDelegate()->getStyle('K1:R1')->applyFromArray($styleHeader3);
                $event->sheet->getDelegate()->getStyle('K2:R2')->applyFromArray($styleHeader3);
                $event->sheet->getDelegate()->mergeCells('S1:T1');
                $event->sheet->getDelegate()->getStyle('S1:T1')->applyFromArray($styleHeader4);
                $event->sheet->getDelegate()->getStyle('S2:T2')->applyFromArray($styleHeader4);
            },
        ];
    }
}
class Sheet9 implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithTitle
{
    /**
     * @return \Illuminate\Support\Collection
     */
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
            ->leftjoin('indikator_fitur4s', 'indikator_fitur4s.id', 'risk_registers.indikator_fitur4_id')
            ->leftjoin('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
            ->leftjoin('risk_varieties', 'risk_varieties.id', 'risk_registers.risk_variety_id')
            ->leftjoin('risk_types', 'risk_types.id', 'risk_registers.risk_type_id')
            ->leftjoin('pics', 'pics.id', 'risk_registers.pic_id')
            ->leftjoin('users', 'users.id', 'risk_registers.user_id')
            ->leftjoin('fgd_residuals', 'fgd_residuals.risk_register_id', 'risk_registers.id')
            ->leftjoin('efektifs', 'efektifs.id', 'risk_registers.efektif_id')
            ->select(
                DB::raw('row_number() OVER (ORDER BY risk_registers.osd1_dampak * risk_registers.osd1_probabilitas * risk_registers.osd1_controllability DESC) AS `row_number`'),
                'risk_registers.resiko as Penyataan Risiko',
                DB::raw("'-' AS 'Dampak'"),
                DB::raw("'-' AS 'Probabilitas'"),
                'risk_registers.penanganan_risiko',
                'efektifs.name as efektifitas',
                'fgd_residuals.dampak_responden1',
                'fgd_residuals.dampak_responden2',
                'fgd_residuals.dampak_responden3',
                'fgd_residuals.dampak_responden4',
                'fgd_residuals.dampak_responden5',
                'fgd_residuals.dampak_responden6',
                'fgd_residuals.dampak_responden7',
                'fgd_residuals.dampak_responden8',
                'fgd_residuals.probabilitas_responden1',
                'fgd_residuals.probabilitas_responden2',
                'fgd_residuals.probabilitas_responden3',
                'fgd_residuals.probabilitas_responden4',
                'fgd_residuals.probabilitas_responden5',
                'fgd_residuals.probabilitas_responden6',
                'fgd_residuals.probabilitas_responden7',
                'fgd_residuals.probabilitas_responden8',
                DB::raw("'-' AS 'Responden'"),
                DB::raw("'-' AS 'Responden1'"),
            )
            
            ->where($whosLogin)
            ->orderBy('row_number', 'ASC');
        if (!empty($this->startDate) && !empty($this->endDate)) {
            $query->where('risk_registers.tgl_register', '>=', $this->startDate)
                ->where('risk_registers.tgl_register', '<=', Carbon::parse($this->endDate)->addDay());
        }
        if (!empty($this->currently_id)) {
            if ($this->currently_id['id'] <3) {
                $query->where('risk_registers.currently_id', '=', $this->currently_id['id']);
            }
            if ($this->currently_id['id'] == 3) {
                $query->whereIn('risk_registers.concatdp1', [24,25,33,34,35,42,43,44,45,51,52,53,54,55]);
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
        return 'Formulir FGD Residual';
    }
    public function headings(): array
    {
        return [
            ['No', 'Pernyataan Risiko', 'Skor Inherent Risk', 'Skor Inherent Risk', 'Pengendalian yang Ada', 'Pengendalian yang Ada',  'Skor Dampak', 'Skor Dampak', 'Skor Dampak', 'Skor Dampak', 'Skor Dampak', 'Skor Dampak', 'Skor Dampak', 'Skor Dampak', 'Skor Kemungkinan',  'Skor Kemungkinan',  'Skor Kemungkinan',  'Skor Kemungkinan',  'Skor Kemungkinan',  'Skor Kemungkinan', 'Skor Kemungkinan',  'Skor Kemungkinan', 'Modus', 'Modus'],
            ['No', 'Pernyataan Risiko', 'Dampak', 'Probabilitas', 'Uraian', 'Efektivitas', 'Responden 1', 'Responden 2', 'Responden 3', 'Responden 4', 'Responden 5', 'Responden 6', 'Responden 7', 'Responden 8', 'Responden 1', 'Responden 2', 'Responden 3', 'Responden 4', 'Responden 5', 'Responden 6', 'Responden 7', 'Responden 8', 'Dampak', 'Probabilitas'],
        ];
    }
    public function columnWidths(): array
    {
        return [
            'A' => 4,
            'B' => 65,
            'C' => 15,
            'D' => 15,
            'E' => 65,
            'F' => 15,
            'G' => 15,
            'H' => 15,
            'I' => 15,
            'J' => 15,
            'K' => 15,
            'L' => 15,
            'M' => 15,
            'N' => 15,
            'O' => 15,
            'P' => 15,
            'Q' => 15,
            'R' => 15,
            'S' => 15,
            'T' => 15,
            'U' => 15,
            'V' => 15,
            'W' => 15,
            'X' => 15,
        ];
    }
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $highestRow = $event->sheet->getHighestRow();
                $highestColumn = $event->sheet->getHighestColumn();
                $range = 'A1:' . $highestColumn . $highestRow;
                $rangeA = 'A1:' . 'A' . $highestRow;
                $rangeL = 'L4:' . 'L' . $highestRow;
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
                            'argb' => '9BC2E6',
                        ],
                        'endColor' => [
                            'argb' => '9BC2E6',
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


                $event->sheet->getDelegate()->getStyle($rangeA)->applyFromArray([
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_LEFT,
                    ],
                ]);

                $worksheet = $event->sheet->getDelegate();
                $startRow = 3; // Assuming your data starts from row 3
                $endRow = $highestRow; // You need to determine the highest row based on your data
                for ($row = $startRow; $row <= $endRow; $row++) {
                    foreach (range($startRow, $endRow) as $row) {
                        $formula = '=IFERROR(MODE.MULT(G' . $row . ':N' . $row . '), "")';
                        $worksheet->getCell('W' . $row)->setValue($formula);
                        $formula1 = '=IFERROR(MODE.MULT(O' . $row . ':V' . $row . '), "")';
                        $worksheet->getCell('X' . $row)->setValue($formula1);

                        $formulaC = "='Formulir FGD Inherent'!S" . $row;
                        $worksheet->getCell('C' . $row)->setValue($formulaC);
                        $formulaD = "='Formulir FGD Inherent'!T" . $row;
                        $worksheet->getCell('D' . $row)->setValue($formulaD);
                    }
                }

                $event->sheet->getDelegate()->mergeCells('A1:A2');
                $event->sheet->getDelegate()->getStyle('A1:A2')->applyFromArray($styleHeader2);
                $event->sheet->getDelegate()->mergeCells('B1:B2');
                $event->sheet->getDelegate()->getStyle('B1:B2')->applyFromArray($styleHeader2);
                $event->sheet->getDelegate()->mergeCells('C1:D1');
                $event->sheet->getDelegate()->getStyle('C1:D1')->applyFromArray($styleHeader2);
                $event->sheet->getDelegate()->getStyle('C2:D2')->applyFromArray($styleHeader2);
                $event->sheet->getDelegate()->mergeCells('E1:F1');
                $event->sheet->getDelegate()->getStyle('E1:F1')->applyFromArray($styleHeader2);
                $event->sheet->getDelegate()->getStyle('E2:F2')->applyFromArray($styleHeader2);

                $event->sheet->getDelegate()->mergeCells('G1:N1');
                $event->sheet->getDelegate()->getStyle('G1:N1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('G2:N2')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('O1:V1');
                $event->sheet->getDelegate()->getStyle('O1:V1')->applyFromArray($styleHeader3);
                $event->sheet->getDelegate()->getStyle('O2:V2')->applyFromArray($styleHeader3);
                $event->sheet->getDelegate()->mergeCells('W1:X1');
                $event->sheet->getDelegate()->getStyle('W1:X1')->applyFromArray($styleHeader4);
                $event->sheet->getDelegate()->getStyle('W2:X2')->applyFromArray($styleHeader4);
            },
        ];
    }
}
class Sheet10 implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithTitle
{
    /**
     * @return \Illuminate\Support\Collection
     */
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
            ->leftjoin('indikator_fitur4s', 'indikator_fitur4s.id', 'risk_registers.indikator_fitur4_id')
            ->leftjoin('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
            ->leftjoin('risk_varieties', 'risk_varieties.id', 'risk_registers.risk_variety_id')
            ->leftjoin('risk_types', 'risk_types.id', 'risk_registers.risk_type_id')
            ->leftjoin('pics', 'pics.id', 'risk_registers.pic_id')
            ->leftjoin('users', 'users.id', 'risk_registers.user_id')
            ->leftjoin('fgd_treateds', 'fgd_treateds.risk_register_id', 'risk_registers.id')
            ->leftjoin('opsi_pengendalians', 'opsi_pengendalians.id', 'risk_registers.opsi_pengendalian_id')
            ->select(
                DB::raw('row_number() OVER (ORDER BY risk_registers.osd1_dampak * risk_registers.osd1_probabilitas * risk_registers.osd1_controllability DESC) AS `row_number`'),
                'risk_registers.pernyataan_risiko as Penyataan Risiko',
                DB::raw("'-' AS 'Dampak'"),
                DB::raw("'-' AS 'Probabilitas'"),
                'opsi_pengendalians.name as opsi',
                'risk_registers.rencana_pengendalian',
                'fgd_treateds.dampak_responden1',
                'fgd_treateds.dampak_responden2',
                'fgd_treateds.dampak_responden3',
                'fgd_treateds.dampak_responden4',
                'fgd_treateds.dampak_responden5',
                'fgd_treateds.dampak_responden6',
                'fgd_treateds.dampak_responden7',
                'fgd_treateds.dampak_responden8',
                'fgd_treateds.probabilitas_responden1',
                'fgd_treateds.probabilitas_responden2',
                'fgd_treateds.probabilitas_responden3',
                'fgd_treateds.probabilitas_responden4',
                'fgd_treateds.probabilitas_responden5',
                'fgd_treateds.probabilitas_responden6',
                'fgd_treateds.probabilitas_responden7',
                'fgd_treateds.probabilitas_responden8',
                DB::raw("'-' AS 'Responden'"),
                DB::raw("'-' AS 'Responden'"),
            )
            
            ->where($whosLogin)
            ->orderBy('row_number', 'ASC');
        if (!empty($this->startDate) && !empty($this->endDate)) {
            $query->where('risk_registers.tgl_register', '>=', $this->startDate)
                ->where('risk_registers.tgl_register', '<=', Carbon::parse($this->endDate)->addDay());
        }
        if (!empty($this->currently_id)) {
            if ($this->currently_id['id'] <3) {
                $query->where('risk_registers.currently_id', '=', $this->currently_id['id']);
            }
            if ($this->currently_id['id'] == 3) {
                $query->whereIn('risk_registers.concatdp1', [24,25,33,34,35,42,43,44,45,51,52,53,54,55]);
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
        return 'Formulir FGD Treated';
    }
    public function headings(): array
    {
        return [
            ['No', 'Pernyataan Risiko', 'Skor Residual Risk', 'Skor Residual Risk', 'RTP', 'RTP',  'Skor Dampak', 'Skor Dampak', 'Skor Dampak', 'Skor Dampak', 'Skor Dampak', 'Skor Dampak', 'Skor Dampak', 'Skor Dampak', 'Skor Kemungkinan',  'Skor Kemungkinan',  'Skor Kemungkinan',  'Skor Kemungkinan',  'Skor Kemungkinan',  'Skor Kemungkinan', 'Skor Kemungkinan',  'Skor Kemungkinan', 'Modus', 'Modus'],
            ['No', 'Pernyataan Risiko', 'Dampak', 'Probabilitas', 'Strategi', 'Uraian', 'Responden 1', 'Responden 2', 'Responden 3', 'Responden 4', 'Responden 5', 'Responden 6', 'Responden 7', 'Responden 8', 'Responden 1', 'Responden 2', 'Responden 3', 'Responden 4', 'Responden 5', 'Responden 6', 'Responden 7', 'Responden 8', 'Dampak', 'Probabilitas'],
        ];
    }
    public function columnWidths(): array
    {
        return [
            'A' => 4,
            'B' => 65,
            'C' => 15,
            'D' => 15,
            'E' => 65,
            'F' => 45,
            'G' => 15,
            'H' => 15,
            'I' => 15,
            'J' => 15,
            'K' => 15,
            'L' => 15,
            'M' => 15,
            'N' => 15,
            'O' => 15,
            'P' => 15,
            'Q' => 15,
            'R' => 15,
            'S' => 15,
            'T' => 15,
            'U' => 15,
            'V' => 15,
            'W' => 15,
            'X' => 15,
        ];
    }
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $highestRow = $event->sheet->getHighestRow();
                $highestColumn = $event->sheet->getHighestColumn();
                $range = 'A1:' . $highestColumn . $highestRow;
                $rangeA = 'A1:' . 'A' . $highestRow;
                $rangeL = 'L4:' . 'L' . $highestRow;
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
                            'argb' => '9BC2E6',
                        ],
                        'endColor' => [
                            'argb' => '9BC2E6',
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


                $event->sheet->getDelegate()->getStyle($rangeA)->applyFromArray([
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_LEFT,
                    ],
                ]);
                $worksheet = $event->sheet->getDelegate();
                $startRow = 3; // Assuming your data starts from row 3
                $endRow = $highestRow; // You need to determine the highest row based on your data
                for ($row = $startRow; $row <= $endRow; $row++) {
                    foreach (range($startRow, $endRow) as $row) {
                        $formula = '=IFERROR(MODE.MULT(G' . $row . ':N' . $row . '), "")';
                        $worksheet->getCell('W' . $row)->setValue($formula);
                        $formula1 = '=IFERROR(MODE.MULT(O' . $row . ':V' . $row . '), "")';
                        $worksheet->getCell('X' . $row)->setValue($formula1);

                        $formulaC = "='Formulir FGD Residual'!W" . $row;
                        $worksheet->getCell('C' . $row)->setValue($formulaC);
                        $formulaD = "='Formulir FGD Residual'!X" . $row;
                        $worksheet->getCell('D' . $row)->setValue($formulaD);
                    }
                }
                $event->sheet->getDelegate()->mergeCells('A1:A2');
                $event->sheet->getDelegate()->getStyle('A1:A2')->applyFromArray($styleHeader2);
                $event->sheet->getDelegate()->mergeCells('B1:B2');
                $event->sheet->getDelegate()->getStyle('B1:B2')->applyFromArray($styleHeader2);
                $event->sheet->getDelegate()->mergeCells('C1:D1');
                $event->sheet->getDelegate()->getStyle('C1:D1')->applyFromArray($styleHeader2);
                $event->sheet->getDelegate()->getStyle('C2:D2')->applyFromArray($styleHeader2);
                $event->sheet->getDelegate()->mergeCells('E1:F1');
                $event->sheet->getDelegate()->getStyle('E1:F1')->applyFromArray($styleHeader2);
                $event->sheet->getDelegate()->getStyle('E2:F2')->applyFromArray($styleHeader2);

                $event->sheet->getDelegate()->mergeCells('G1:N1');
                $event->sheet->getDelegate()->getStyle('G1:N1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('G2:N2')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('O1:V1');
                $event->sheet->getDelegate()->getStyle('O1:V1')->applyFromArray($styleHeader3);
                $event->sheet->getDelegate()->getStyle('O2:V2')->applyFromArray($styleHeader3);
                $event->sheet->getDelegate()->mergeCells('W1:X1');
                $event->sheet->getDelegate()->getStyle('W1:X1')->applyFromArray($styleHeader4);
                $event->sheet->getDelegate()->getStyle('W2:X2')->applyFromArray($styleHeader4);
            },
        ];
    }
}
class Sheet11 implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithTitle
{
    /**
     * @return \Illuminate\Support\Collection
     */
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
            ->leftjoin('indikator_fitur4s', 'indikator_fitur4s.id', 'risk_registers.indikator_fitur4_id')
            ->select(
                DB::raw('row_number() OVER (ORDER BY risk_registers.osd1_dampak * risk_registers.osd1_probabilitas * risk_registers.osd1_controllability DESC) AS `row_number`'),
                DB::raw("'' AS '1'"),
                DB::raw("'' AS '2'"),
                DB::raw("'' AS 'Dampak'"),
                DB::raw("'' AS 'Dampak1'")
            )
            
            ->where($whosLogin)
            ->orderBy('row_number', 'ASC');
        if (!empty($this->startDate) && !empty($this->endDate)) {
            $query->where('risk_registers.tgl_register', '>=', $this->startDate)
                ->where('risk_registers.tgl_register', '<=', Carbon::parse($this->endDate)->addDay());
        }
        if (!empty($this->currently_id)) {
            if ($this->currently_id['id'] <3) {
                $query->where('risk_registers.currently_id', '=', $this->currently_id['id']);
            }
            if ($this->currently_id['id'] == 3) {
                $query->whereIn('risk_registers.concatdp1', [24,25,33,34,35,42,43,44,45,51,52,53,54,55]);
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
        return 'Pelaporan';
    }
    public function headings(): array
    {
        return [
            ['No', 'Dokumen', 'Uraian', 'Periode Pelaporan', 'Link'],
        ];
    }
    public function columnWidths(): array
    {
        return [
            'A' => 4,
            'B' => 30,
            'C' => 30,
            'D' => 30,
            'E' => 60,
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
                            'argb' => 'D8D8D8',
                        ],
                        'endColor' => [
                            'argb' => 'D8D8D8',
                        ],
                    ],
                ];
                $event->sheet->getDelegate()->getStyle($rangeA)->applyFromArray([
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_LEFT,
                    ],
                ]);
                $event->sheet->getDelegate()->getStyle('A1:A1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('B1:B1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('C1:C1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('D1:D1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('E1:E1')->applyFromArray($styleHeader);
            },
        ];
    }
}
