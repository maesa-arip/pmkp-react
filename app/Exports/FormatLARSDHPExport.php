<?php

namespace App\Exports;

use App\Models\IndikatorFitur04;
use App\Models\IndikatorFitur1;
use App\Models\IndikatorFitur2;
use App\Models\IndikatorFitur3;
use App\Models\RiskRegister;
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
use Maatwebsite\Excel\Concerns\FromCollection;
use Illuminate\Support\Collection;

class FormatLARSDHPExport implements WithMultipleSheets
{
    protected $startDate;
    protected $endDate;

    public function __construct($startDate, $endDate)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }
    public function sheets(): array
    {
        return [
            new Sheet1($this->startDate, $this->endDate),
            new Sheet2($this->startDate, $this->endDate),
            new Sheet3($this->startDate, $this->endDate),
            new Sheet4($this->startDate, $this->endDate),
            new Sheet5($this->startDate, $this->endDate),
            new Sheet6($this->startDate, $this->endDate),
            new Sheet7($this->startDate, $this->endDate),
            new Sheet8($this->startDate, $this->endDate),
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

    public function __construct($startDate, $endDate)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }
    public function query()
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $subquery = RiskRegister::query()
            ->leftJoin('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
            ->leftJoin('indikator_fitur04s', 'indikator_fitur04s.id', 'risk_registers.indikator_fitur04_id')
            ->leftJoin('pics', 'pics.id', 'risk_registers.pic_id')
            ->leftJoin('users', 'users.id', 'risk_registers.user_id')
            ->selectRaw(
                'indikator_fitur04s.name, ' .
                    'indikator_fitur04s.tujuan, ' .
                    'pics.name as pic_name, ' .
                    'risk_categories.name as kategori_risiko, ' .
                    'row_number() OVER (ORDER BY risk_registers.osd1_dampak * risk_registers.osd1_probabilitas * risk_registers.osd1_controllability DESC) AS `Peringkat`'
            )
            ->groupBy(
                'indikator_fitur04s.name',
                'indikator_fitur04s.tujuan',
                'pics.name',
                'risk_categories.name',
                'risk_registers.osd1_dampak',
                'risk_registers.osd1_probabilitas',
                'risk_registers.osd1_controllability'
            )
            ->where($whosLogin);
        if (!empty($this->startDate) && !empty($this->endDate)) {
            $subquery->where('risk_registers.created_at', '>=', $this->startDate)
                ->where('risk_registers.created_at', '<=', $this->endDate);
        }
        $query = DB::query()
            ->select('Peringkat', 'name', 'tujuan', 'pic_name', 'kategori_risiko')
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
            ['NO', 'NAMA KEGIATAN', 'TUJUAN KEGIATAN (S.M.A.R.T)-', 'PEMILIK RISIKO', 'KATEGORI RISIKO'],
        ];
    }
    public function columnWidths(): array
    {
        return [
            'A' => 4,
            'B' => 65,
            'C' => 65,
            'D' => 30,
            'E' => 30,
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
                $event->sheet->getDelegate()->getStyle('A1:E1')->applyFromArray($styleHeader);
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

    public function __construct($startDate, $endDate)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }
    public function query()
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $subquery = RiskRegister::query()
            ->join('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
            ->join('indikator_fitur04s', 'indikator_fitur04s.id', 'risk_registers.indikator_fitur04_id')
            ->join('identification_sources', 'identification_sources.id', 'risk_registers.identification_source_id')
            ->join('locations', 'locations.id', 'indikator_fitur04s.location_id')
            ->join('sasaran_strategis', 'sasaran_strategis.id', 'indikator_fitur04s.sasaran_strategis_id')
            ->join('risk_varieties', 'risk_varieties.id', 'risk_registers.risk_variety_id')
            ->join('risk_types', 'risk_types.id', 'risk_registers.risk_type_id')
            ->join('impact_values', 'impact_values.id', 'risk_registers.osd1_dampak')
            ->join('probability_values', 'probability_values.id', 'risk_registers.osd1_probabilitas')
            ->join('control_values', 'control_values.id', 'risk_registers.osd1_controllability')
            ->join('impact_values as sa1', 'sa1.id', 'risk_registers.osd2_dampak')
            ->join('probability_values as sa2', 'sa2.id', 'risk_registers.osd2_probabilitas')
            ->join('control_values as sa3', 'sa3.id', 'risk_registers.osd2_controllability')
            ->join('pics', 'pics.id', 'risk_registers.pic_id')
            ->join('users', 'users.id', 'risk_registers.user_id')
            ->leftJoin('risk_gradings', 'risk_gradings.kode', 'risk_registers.concatdp1')
            ->leftJoin('risk_gradings AS grading2', 'grading2.kode', 'risk_registers.concatdp2')
            ->leftJoin('opsi_pengendalians', 'opsi_pengendalians.id', 'risk_registers.opsi_pengendalian_id')
            ->leftJoin('pembiayaan_risikos', 'pembiayaan_risikos.id', 'risk_registers.pembiayaan_risiko_id')
            ->selectRaw('
            risk_registers.id,
        row_number() OVER (ORDER BY risk_registers.osd1_dampak * risk_registers.osd1_probabilitas * risk_registers.osd1_controllability DESC) AS `Peringkat`,
        indikator_fitur04s.name,
        indikator_fitur04s.tujuan,
        locations.name as location_name,
        risk_registers.sebab,
        CONCAT("R.", risk_registers.id) AS Kode,
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
        risk_registers.pengendalian_risiko as uraian,
        pembiayaan_risikos.name as pembiayaan,
        risk_registers.osd2_probabilitas,
        osd2_controllability,
        risk_registers.osd2_inherent,
        grading2.name as grading2_name,
        pics.name as pic_name,
        CONCAT(risk_registers.target_waktu, " Hari") AS target_waktu
    ')
            ->groupBy(
                'risk_registers.id',
                'indikator_fitur04s.name',
                'indikator_fitur04s.tujuan',
                'locations.name',
                'risk_registers.sebab',
                'risk_registers.resiko',
                'risk_registers.dampak',
                'risk_registers.pernyataan_risiko',
                'risk_registers.pengendalian_risiko',
                'risk_registers.osd1_dampak',
                'risk_registers.osd1_probabilitas',
                'risk_registers.osd1_inherent',
                'risk_gradings.name',
                'risk_registers.perlu_penanganan_id',
                'opsi_pengendalians.name',
                'risk_registers.pengendalian_risiko',
                'pembiayaan_risikos.name',
                'risk_registers.osd2_probabilitas',
                'osd2_controllability',
                'risk_registers.osd2_inherent',
                'grading2.name',
                'pics.name',
                'risk_registers.target_waktu'
            )->where($whosLogin);

        if (!empty($this->startDate) && !empty($this->endDate)) {
            $subquery->where('risk_registers.created_at', '>=', $this->startDate)
                ->where('risk_registers.created_at', '<=', $this->endDate);
        }
        $query = DB::query()
            ->select(
                'Peringkat',
                'name',
                'tujuan',
                'location_name',
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
                'osd2_probabilitas',
                'osd2_controllability',
                'osd2_inherent',
                'grading2_name',
                'pic_name',
                'target_waktu'
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
            ['No', 'NAMA KEGIATAN (PROSES BISNIS)', 'Tujuan KEGIATAN*)', 'AREA / LOKASI', 'IDENTIFIKASI RISIKO', 'IDENTIFIKASI RISIKO', 'IDENTIFIKASI RISIKO', 'IDENTIFIKASI RISIKO', 'IDENTIFIKASI RISIKO', ' PENGENDALIAN YANG SUDAH ADA SAAT INI', 'ANALISA RISIKO INHERENT', 'ANALISA RISIKO INHERENT', 'ANALISA RISIKO INHERENT', 'ANALISA RISIKO INHERENT', 'ANALISA RISIKO INHERENT', 'EVALUASI RIISIKO', 'ALTERNATIF TEKNIK PENANGANAN RISIKO', 'ALTERNATIF TEKNIK PENANGANAN RISIKO', 'ALTERNATIF TEKNIK PENANGANAN RISIKO', 'RISIKO RESIDUAL', 'RISIKO RESIDUAL', 'RISIKO RESIDUAL', 'RISIKO RESIDUAL', 'PEMILIK RISIKO', 'TARGET WAKTU'],

            ['No', 'NAMA KEGIATAN (PROSES BISNIS)', 'Tujuan KEGIATAN*)', 'AREA / LOKASI', 'SEBAB', 'KODE RISIKO', 'RISIKO', 'DAMPAK', 'PERNYATAAN RISIKO', ' PENGENDALIAN YANG SUDAH ADA SAAT INI', 'DAMPAK', 'PROBABILITAS', 'CONCAT (D & P)', 'SKOR', 'PERINGKAT RISIKO', 'APAKAH PERLU PENANGANAN RISIKO ?', 'OPSI TEKNIK PENGENDALIAN RISIKO', 'URAIAN PENANGANAN RISIKO', 'PEMBIAYAAN RISIKO', 'DAMPAK', 'PROBABILITAS', 'SKOR', 'PERINGKAT RISIKO', 'PEMILIK RISIKO', 'TARGET WAKTU'],

            ['(1)', '(2)', '(3)', '(4)', '(5)', '(6)', '(7)', '(8)', '(9)', '(10)', '(11)', '(12)', '(13)', '(14)', '(15)', '(16)', '(17)', '(18)', '(19)', '(20)', '(21)', '(22)', '(23)', '(24)', '(25)'],
        ];
    }
    public function columnWidths(): array
    {
        return [
            'A' => 4,
            'B' => 20,
            'C' => 36,
            'D' => 20,
            'E' => 20,
            'F' => 20,
            'G' => 20,
            'H' => 20,
            'I' => 45,
            'J' => 40,
            'K' => 12,
            'L' => 15,
            'M' => 15,
            'N' => 12,
            'O' => 12,
            'P' => 20,
            'Q' => 20,
            'R' => 40,
            'S' => 15,
            'T' => 12,
            'U' => 15,
            'V' => 15,
            'W' => 12,
            'X' => 20,
            'Y' => 12,
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
                $rangeA = 'A4:' . 'A' . $highestRow;
                $rangeF = 'F4:' . 'F' . $highestRow;
                $rangeKP = 'K4:' . 'P' . $highestRow;
                $rangeTW = 'T4:' . 'W' . $highestRow;

                $rangeK = 'K4:' . 'K' . $highestRow;
                $rangeL = 'L4:' . 'L' . $highestRow;
                $rangeO = 'O4:' . 'O' . $highestRow;
                $rangeT = 'T4:' . 'T' . $highestRow;
                $rangeU = 'U4:' . 'U' . $highestRow;
                $rangeW = 'W4:' . 'W' . $highestRow;
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
                // KOLOM K
                $conditional = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional->addCondition(5);
                $conditional->getStyle()->applyFromArray($styleST);
                $conditionalStyles = $event->sheet->getStyle($rangeK)->getConditionalStyles();
                $conditionalStyles[] = $conditional;
                $event->sheet->getStyle($rangeK)->setConditionalStyles($conditionalStyles);

                $conditional2 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional2->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional2->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional2->addCondition(4);
                $conditional2->getStyle()->applyFromArray($styleT);
                $conditional2Styles = $event->sheet->getStyle($rangeK)->getConditionalStyles();
                $conditional2Styles[] = $conditional2;
                $event->sheet->getStyle($rangeK)->setConditionalStyles($conditional2Styles);

                $conditional3 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional3->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional3->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional3->addCondition(3);
                $conditional3->getStyle()->applyFromArray($styleM);
                $conditional3Styles = $event->sheet->getStyle($rangeK)->getConditionalStyles();
                $conditional3Styles[] = $conditional3;
                $event->sheet->getStyle($rangeK)->setConditionalStyles($conditional3Styles);

                $conditional4 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional4->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional4->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional4->addCondition(2);
                $conditional4->getStyle()->applyFromArray($styleR);
                $conditional4Styles = $event->sheet->getStyle($rangeK)->getConditionalStyles();
                $conditional4Styles[] = $conditional4;
                $event->sheet->getStyle($rangeK)->setConditionalStyles($conditional4Styles);

                $conditional5 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional5->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional5->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional5->addCondition(1);
                $conditional5->getStyle()->applyFromArray($styleSR);
                $conditional5Styles = $event->sheet->getStyle($rangeK)->getConditionalStyles();
                $conditional5Styles[] = $conditional5;
                $event->sheet->getStyle($rangeK)->setConditionalStyles($conditional5Styles);


                // KOLOM L
                $conditional = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional->addCondition(5);
                $conditional->getStyle()->applyFromArray($styleST);
                $conditionalStyles = $event->sheet->getStyle($rangeL)->getConditionalStyles();
                $conditionalStyles[] = $conditional;
                $event->sheet->getStyle($rangeL)->setConditionalStyles($conditionalStyles);

                $conditional2 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional2->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional2->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional2->addCondition(4);
                $conditional2->getStyle()->applyFromArray($styleT);
                $conditional2Styles = $event->sheet->getStyle($rangeL)->getConditionalStyles();
                $conditional2Styles[] = $conditional2;
                $event->sheet->getStyle($rangeL)->setConditionalStyles($conditional2Styles);

                $conditional3 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional3->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional3->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional3->addCondition(3);
                $conditional3->getStyle()->applyFromArray($styleM);
                $conditional3Styles = $event->sheet->getStyle($rangeL)->getConditionalStyles();
                $conditional3Styles[] = $conditional3;
                $event->sheet->getStyle($rangeL)->setConditionalStyles($conditional3Styles);

                $conditional4 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional4->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional4->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional4->addCondition(2);
                $conditional4->getStyle()->applyFromArray($styleR);
                $conditional4Styles = $event->sheet->getStyle($rangeL)->getConditionalStyles();
                $conditional4Styles[] = $conditional4;
                $event->sheet->getStyle($rangeL)->setConditionalStyles($conditional4Styles);

                $conditional5 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional5->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional5->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional5->addCondition(1);
                $conditional5->getStyle()->applyFromArray($styleSR);
                $conditional5Styles = $event->sheet->getStyle($rangeL)->getConditionalStyles();
                $conditional5Styles[] = $conditional5;
                $event->sheet->getStyle($rangeL)->setConditionalStyles($conditional5Styles);

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


                // KOLOM T
                $conditional = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional->addCondition(5);
                $conditional->getStyle()->applyFromArray($styleST);
                $conditionalStyles = $event->sheet->getStyle($rangeT)->getConditionalStyles();
                $conditionalStyles[] = $conditional;
                $event->sheet->getStyle($rangeT)->setConditionalStyles($conditionalStyles);

                $conditional2 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional2->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional2->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional2->addCondition(4);
                $conditional2->getStyle()->applyFromArray($styleT);
                $conditional2Styles = $event->sheet->getStyle($rangeT)->getConditionalStyles();
                $conditional2Styles[] = $conditional2;
                $event->sheet->getStyle($rangeT)->setConditionalStyles($conditional2Styles);

                $conditional3 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional3->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional3->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional3->addCondition(3);
                $conditional3->getStyle()->applyFromArray($styleM);
                $conditional3Styles = $event->sheet->getStyle($rangeT)->getConditionalStyles();
                $conditional3Styles[] = $conditional3;
                $event->sheet->getStyle($rangeT)->setConditionalStyles($conditional3Styles);

                $conditional4 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional4->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional4->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional4->addCondition(2);
                $conditional4->getStyle()->applyFromArray($styleR);
                $conditional4Styles = $event->sheet->getStyle($rangeT)->getConditionalStyles();
                $conditional4Styles[] = $conditional4;
                $event->sheet->getStyle($rangeT)->setConditionalStyles($conditional4Styles);

                $conditional5 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional5->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional5->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional5->addCondition(1);
                $conditional5->getStyle()->applyFromArray($styleSR);
                $conditional5Styles = $event->sheet->getStyle($rangeT)->getConditionalStyles();
                $conditional5Styles[] = $conditional5;
                $event->sheet->getStyle($rangeT)->setConditionalStyles($conditional5Styles);

                // KOLOM U
                $conditional = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional->addCondition(5);
                $conditional->getStyle()->applyFromArray($styleST);
                $conditionalStyles = $event->sheet->getStyle($rangeU)->getConditionalStyles();
                $conditionalStyles[] = $conditional;
                $event->sheet->getStyle($rangeU)->setConditionalStyles($conditionalStyles);

                $conditional2 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional2->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional2->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional2->addCondition(4);
                $conditional2->getStyle()->applyFromArray($styleT);
                $conditional2Styles = $event->sheet->getStyle($rangeU)->getConditionalStyles();
                $conditional2Styles[] = $conditional2;
                $event->sheet->getStyle($rangeU)->setConditionalStyles($conditional2Styles);

                $conditional3 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional3->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional3->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional3->addCondition(3);
                $conditional3->getStyle()->applyFromArray($styleM);
                $conditional3Styles = $event->sheet->getStyle($rangeU)->getConditionalStyles();
                $conditional3Styles[] = $conditional3;
                $event->sheet->getStyle($rangeU)->setConditionalStyles($conditional3Styles);

                $conditional4 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional4->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional4->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional4->addCondition(2);
                $conditional4->getStyle()->applyFromArray($styleR);
                $conditional4Styles = $event->sheet->getStyle($rangeU)->getConditionalStyles();
                $conditional4Styles[] = $conditional4;
                $event->sheet->getStyle($rangeU)->setConditionalStyles($conditional4Styles);

                $conditional5 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional5->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional5->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_EQUAL);
                $conditional5->addCondition(1);
                $conditional5->getStyle()->applyFromArray($styleSR);
                $conditional5Styles = $event->sheet->getStyle($rangeU)->getConditionalStyles();
                $conditional5Styles[] = $conditional5;
                $event->sheet->getStyle($rangeU)->setConditionalStyles($conditional5Styles);

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



                $event->sheet->getDelegate()->getStyle('A3:Y3')->applyFromArray($styleHeader2);

                $event->sheet->getDelegate()->getStyle($rangeA)->applyFromArray([
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                    ],
                ]);
                $event->sheet->getDelegate()->getStyle($rangeF)->applyFromArray([
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                    ],
                ]);
                $event->sheet->getDelegate()->getStyle($rangeKP)->applyFromArray([
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                    ],
                ]);
                $event->sheet->getDelegate()->getStyle($rangeTW)->applyFromArray([
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

                $event->sheet->getDelegate()->mergeCells('E1:I1');
                $event->sheet->getDelegate()->getStyle('E1:I1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('E2:I2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('J1:J2');
                $event->sheet->getDelegate()->getStyle('J1:J2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('K1:O1');
                $event->sheet->getDelegate()->getStyle('K1:O1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('K2:O2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->getStyle('P1:P1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('P2:P2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('Q1:S1');
                $event->sheet->getDelegate()->getStyle('Q1:S1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('Q2:S2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('T1:W1');
                $event->sheet->getDelegate()->getStyle('T1:W1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('T2:W2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('X1:X2');
                $event->sheet->getDelegate()->getStyle('X1:X2')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('Y1:Y2');
                $event->sheet->getDelegate()->getStyle('Y1:Y2')->applyFromArray($styleHeader);
            },
        ];
    }
}
class Sheet3 implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithTitle
{
    /**
     * @return \Illuminate\Support\Collection
     */
    protected $data;
    protected $startDate;
    protected $endDate;

    public function __construct($startDate, $endDate)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function query()
    {
        $query = $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $query = RiskRegister::query()
            ->select(
                DB::raw("CONCAT('R.', risk_registers.id) AS Kode"),
                'risk_registers.osd1_dampak',
                'risk_registers.osd1_probabilitas',
            )
            ->where($whosLogin);

        if (!empty($this->startDate) && !empty($this->endDate)) {
            $query->where('risk_registers.created_at', '>=', $this->startDate)
                ->where('risk_registers.created_at', '<=', $this->endDate);
        }
        $this->data = $query->get();
        return $query;
    }
    public function title(): string
    {
        return 'PETA PANAS';
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
            'A' => 10,
            'B' => 10,
            'C' => 15,
        ];
    }
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $event->sheet->getDelegate()->getRowDimension(1)->setRowHeight(20);
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
                            'argb' => 'F4B084',
                        ],
                        'endColor' => [
                            'argb' => 'F4B084',
                        ],
                    ],
                ];

                $event->sheet->getDelegate()->getStyle($range)->applyFromArray([
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                    ],
                ]);
                $event->sheet->getDelegate()->getStyle('A1:C1')->applyFromArray($styleHeader);
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

    public function __construct($startDate, $endDate)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }
    public function query()
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $query = RiskRegister::query()
            ->join('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
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
            )
            ->groupBy(
                'risk_registers.pernyataan_risiko',
                'risk_categories.name',
                'risk_registers.sebab',
                'risk_registers.osd1_dampak',
                'risk_registers.osd1_probabilitas',
                'risk_registers.osd1_controllability'
            )
            ->where($whosLogin)
            ->orderBy('Skor', 'DESC');
        if (!empty($this->startDate) && !empty($this->endDate)) {
            $query->where('risk_registers.created_at', '>=', $this->startDate)
                ->where('risk_registers.created_at', '<=', $this->endDate);
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
            ['No', 'KATEGORI RISIKO', 'PERNYATAAN RISIKO', 'AKAR MASALAH (PENYEBAB UTAMA RISIKO)', 'DAMPAK (D)', 'PROBABILITAS (P)', 'CONTROLLABILITY (Pengendalian)', 'SCORING', 'RANGKING'],

            ['(1)', '(2)', '(3)', '(4)', '(5)', '(6)', '(7)', '(8) (5x6x7)', '(9)'],
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
                // KOLOM K




                $event->sheet->getDelegate()->getStyle('A1:I2')->applyFromArray($styleHeader);

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

    public function __construct($startDate, $endDate)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }
    public function query()
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $subquery = RiskRegister::query()
            ->join('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
            ->join('indikator_fitur04s', 'indikator_fitur04s.id', 'risk_registers.indikator_fitur04_id')
            ->join('users', 'users.id', 'risk_registers.user_id')
            ->leftjoin('opsi_pengendalians', 'opsi_pengendalians.id', 'risk_registers.opsi_pengendalian_id')
            ->leftjoin('efektifs', 'efektifs.id', 'risk_registers.efektif_id')
            ->leftjoin('waktu_pengendalians', 'waktu_pengendalians.id', 'risk_registers.waktu_pengendalian_id')
            ->leftjoin('jenis_pengendalians', 'jenis_pengendalians.id', 'risk_registers.jenis_pengendalian_id')
            ->selectRaw(
                    'indikator_fitur04s.name, ' .
                    'indikator_fitur04s.tujuan, ' .
                    'risk_registers.pernyataan_risiko, ' .
                    'opsi_pengendalians.name as opsi, ' .
                    'risk_registers.pengendalian_risiko as uraian, ' .
                    'risk_registers.pengendalian_risiko, ' .
                    'efektifs.name as efektif, ' .
                    'risk_registers.pengendalian_risiko as harusada, ' .
                    'risk_registers.pengendalian_risiko as kegiatan, ' .
                    'waktu_pengendalians.name as waktu, ' .
                    'jenis_pengendalians.name as jenis_pengendalian, ' .
                    'users.name as pemilik, ' .
                    'row_number() OVER (ORDER BY risk_registers.osd1_dampak * risk_registers.osd1_probabilitas * risk_registers.osd1_controllability DESC) AS `Peringkat`'
            )
            ->groupBy(
                'indikator_fitur04s.name',
                'indikator_fitur04s.tujuan',
                'risk_registers.pernyataan_risiko',
                'opsi_pengendalians.name',
                'risk_registers.pengendalian_risiko',
                'risk_registers.pengendalian_risiko',
                'efektifs.name',
                'risk_registers.pengendalian_risiko',
                'risk_registers.pengendalian_risiko',
                'waktu_pengendalians.name',
                'jenis_pengendalians.name',
                'users.name',
                'risk_registers.osd1_dampak',
                'risk_registers.osd1_probabilitas',
                'risk_registers.osd1_controllability'
            )
            ->where($whosLogin);
        if (!empty($this->startDate) && !empty($this->endDate)) {
            $subquery->where('risk_registers.created_at', '>=', $this->startDate)
                ->where('risk_registers.created_at', '<=', $this->endDate);
        }
        $query = DB::query()
            ->select(
                'Peringkat',
                'name',
                'tujuan',
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
            'B' => 25,
            'C' => 36,
            'D' => 36,
            'E' => 20,
            'F' => 20,
            'G' => 20,
            'H' => 10,
            'I' => 20,
            'J' => 12,
            'K' => 12,
            'L' => 13,
            'M' => 12,
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

    public function __construct($startDate, $endDate)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }
    public function query()
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $query = RiskRegister::query()
            ->join('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
            ->join('indikator_fitur04s', 'indikator_fitur04s.id', 'risk_registers.indikator_fitur04_id')
            ->join('pics', 'pics.id', 'risk_registers.pic_id')
            ->leftjoin('waktu_pengendalians', 'waktu_pengendalians.id', 'risk_registers.waktu_pengendalian_id')
            ->select('risk_registers.id', 'indikator_fitur04s.name', 'indikator_fitur04s.tujuan',  'risk_registers.pernyataan_risiko', 'risk_registers.pengendalian_risiko as rencana', 'risk_registers.pengendalian_risiko as realisasi', 'risk_registers.belum_tertangani', 'risk_registers.usulan_perbaikan',  DB::raw("CONCAT(risk_registers.target_waktu, ' Hari') AS target_waktu"), 'waktu_pengendalians.name as waktu', 'pics.name as pic_name')
            ->where($whosLogin);
        if (!empty($this->startDate) && !empty($this->endDate)) {
            $query->where('risk_registers.created_at', '>=', $this->startDate)
                ->where('risk_registers.created_at', '<=', $this->endDate);
        }



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
            ['No', 'Kegiatan', 'Sasaran', 'Risiko (Prioritas)', 'Penanganan', 'Penanganan', 'Penanganan', 'Usulan Perbaikan', 'Waktu Pemantauan', 'Waktu Pemantauan', 'Penanggung Jawab Pemantauan'],

            ['No', 'Kegiatan', 'Sasaran', 'Risiko (Prioritas)', 'Rencana (Pengendalian yg harus ada)', 'Realisasi (Kegiatan Rencana Pengendalian )', 'Yang belum tertangani', 'Usulan Perbaikan', 'Rencana', 'Realisasi', 'Penanggung Jawab Pemantauan'],

            ['(1)', '(2)', '(3)', '(4)', '(5)', '(6)', '(7)', '(8)', '(9)', '(10)', '(11)'],

        ];
    }
    public function columnWidths(): array
    {
        return [
            'A' => 4,
            'B' => 25,
            'C' => 36,
            'D' => 36,
            'E' => 20,
            'F' => 20,
            'G' => 20,
            'H' => 36,
            'I' => 20,
            'J' => 12,
            'K' => 15,
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
            },
        ];
    }
}
class Sheet7 implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithTitle
{
    /**
     * @return \Illuminate\Support\Collection
     */
    protected $data;
    protected $startDate;
    protected $endDate;

    public function __construct($startDate, $endDate)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }
    public function query()
    {
        $query = $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $query = RiskRegister::query()
            ->select(DB::raw("CONCAT('R.', risk_registers.id) AS Kode"), 'risk_registers.denum', DB::raw('risk_registers.num / risk_registers.denum * 100 AS `Waktu`'), 'risk_registers.num', DB::raw("'' AS 'Jumlah'"), 'risk_registers.target_waktu')
            ->where($whosLogin);
        if (!empty($this->startDate) && !empty($this->endDate)) {
            $query->where('risk_registers.created_at', '>=', $this->startDate)
                ->where('risk_registers.created_at', '<=', $this->endDate);
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
            'A' => 10,
            'B' => 30,
            'C' => 30,
            'D' => 30,
            'E' => 30,
            'F' => 30,
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
                $event->sheet->getDelegate()->getStyle('A1:F1')->applyFromArray($styleHeader);
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

    public function __construct($startDate, $endDate)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }
    public function query()
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $query = RiskRegister::query()
            ->join('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
            ->join('indikator_fitur04s', 'indikator_fitur04s.id', 'risk_registers.indikator_fitur04_id')
            ->join('pics', 'pics.id', 'risk_registers.pic_id')
            ->join('users', 'users.id', 'risk_registers.user_id')
            ->leftjoin('waktu_implementasis', 'waktu_implementasis.id', 'risk_registers.waktu_implementasi_id')
            ->leftjoin('risk_gradings', 'risk_gradings.kode', 'risk_registers.concatdp1')
            ->select('risk_registers.pernyataan_risiko', 'risk_registers.pengendalian_risiko as aksi', 'risk_registers.output', 'indikator_fitur04s.name', DB::raw(
                '
                CASE
                    WHEN risk_registers.realisasi_id = 1 THEN "Sudah Tercapai"
                    WHEN risk_registers.realisasi_id = 2 THEN "Sudah Tercapai"
                    ELSE ""
                END AS `PerluPenanganan`'
            ), 'waktu_implementasis.name as waktu_implementasi', 'pics.name as pic_name', DB::raw("'Turun' AS 'tren'"), 'risk_gradings.name as grading')
            // ->where('tipe_id', 1)
            ->where($whosLogin);
        if (!empty($this->startDate) && !empty($this->endDate)) {
            $query->where('risk_registers.created_at', '>=', $this->startDate)
                ->where('risk_registers.created_at', '<=', $this->endDate);
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
            ['Prioritas Risiko', 'Penanganan Risiko', 'Penanganan Risiko', 'Penanganan Risiko', 'Penanganan Risiko', 'Penanganan Risiko', 'Penanganan Risiko', 'Status Risiko', 'Status Risiko'],

            ['Prioritas Risiko', 'Aksi pengendalian', 'Output', 'Target', 'Realisasi', 'Waktu Implementasi', 'Penanggung jawab', 'Trend (naik/ turun)', 'Level Risiko'],
            ['(1)', '(2)', '(3)', '(4)', '(5)', '(6)', '(7)', '(8)', '(9)'],
        ];
    }
    public function columnWidths(): array
    {
        return [
            'A' => 36,
            'B' => 25,
            'C' => 20,
            'D' => 20,
            'E' => 20,
            'F' => 20,
            'G' => 20,
            'H' => 20,
            'I' => 10,
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

                $event->sheet->getDelegate()->getStyle('A3:I3')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('A1:A2');
                $event->sheet->getDelegate()->getStyle('A1:A2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('B1:G1');
                $event->sheet->getDelegate()->getStyle('B1:G1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('B2:G2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('H1:I1');
                $event->sheet->getDelegate()->getStyle('H1:I1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('H2:I2')->applyFromArray($styleHeader);
            },
        ];
    }
}
