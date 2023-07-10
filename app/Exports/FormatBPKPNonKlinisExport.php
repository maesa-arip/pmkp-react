<?php

namespace App\Exports;

use App\Models\IndikatorFitur04;
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


class FormatBPKPNonKlinisExport implements WithMultipleSheets
{
    public function sheets(): array
    {
        return [
            new Sheet1(),
            new Sheet2(),
            new Sheet3(),
            new Sheet4(),
            new Sheet5(),
            new Sheet6(),
            new Sheet7(),
            new Sheet8(),
            new Sheet9(),
            new Sheet10(),
            new Sheet11(),
        ];
    }
}

class Sheet1 implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithTitle
{
    /**
     * @return \Illuminate\Support\Collection
     */
    protected $data;
    
    public function query()
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $this->data = IndikatorFitur04::query()
            ->join('indikator_fitur4s', 'indikator_fitur4s.id', 'indikator_fitur04s.indikator_fitur4_id')
            ->join('risk_registers', 'risk_registers.indikator_fitur04_id', 'indikator_fitur04s.id')
            ->select(DB::raw("(SELECT COUNT(*) FROM indikator_fitur04s r WHERE r.id <= indikator_fitur04s.id) AS Nomor"), 'indikator_fitur4s.name as NamaKonteks(ProsesBisnis)', 'indikator_fitur04s.tujuan as Indikator')->orderBy('Nomor', 'ASC')->where($whosLogin)->get();

        return IndikatorFitur04::query()
            ->join('indikator_fitur4s', 'indikator_fitur4s.id', 'indikator_fitur04s.indikator_fitur4_id')
            ->join('risk_registers', 'risk_registers.indikator_fitur04_id', 'indikator_fitur04s.id')
            ->select(DB::raw("(SELECT COUNT(*) FROM indikator_fitur04s r WHERE r.id <= indikator_fitur04s.id) AS Nomor"), 'indikator_fitur4s.name as NamaKonteks(ProsesBisnis)', 'indikator_fitur04s.tujuan as Indikator')->where($whosLogin)->orderBy('Nomor', 'ASC');
    }
    public function title(): string
    {
        return 'Penetapan Konteks';
    }
    public function headings(): array
    {
        return [
            ['No', 'Nama Konteks (Proses Bisnis)', 'Indikator'],
        ];
    }
    public function columnWidths(): array
    {
        return [
            'A' => 4,
            'B' => 65,
            'C' => 65,
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
                $event->sheet->getDelegate()->getStyle('A1:A1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('B1:B1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('C1:C1')->applyFromArray($styleHeader);
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
    public function query()
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $query = IndikatorFitur04::query()
        ->join('indikator_fitur4s', 'indikator_fitur4s.id', 'indikator_fitur04s.indikator_fitur4_id')
        ->join('risk_registers', 'risk_registers.indikator_fitur04_id', 'indikator_fitur04s.id')
        ->join('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
        ->join('risk_varieties', 'risk_varieties.id', 'risk_registers.risk_variety_id')
        ->join('risk_types', 'risk_types.id', 'risk_registers.risk_type_id')
        ->join('pics', 'pics.id', 'risk_registers.pic_id')
        ->join('locations', 'locations.id', 'pics.location_id')
        ->select(
            DB::raw("(SELECT COUNT(*) FROM risk_registers r WHERE r.id <= risk_registers.id) AS row_number"),
            'indikator_fitur4s.name as Nama Konteks(Proses Bisnis)',
            'indikator_fitur04s.tujuan as Indikator',
            DB::raw("CONCAT(locations.kode, '.',locations.id,'.',risk_categories.kode,'.',risk_categories.id,'.', risk_registers.id) AS Kode"),
            'risk_categories.name as Kategori Risiko',
            'risk_registers.pernyataan_risiko as Penyataan Risiko',
            'risk_registers.sebab as Sebab',
            DB::raw("'C' AS 'UC/C'"),
            'pics.name as Dampak (Pihak yang Terkena)'
        )
        ->where($whosLogin)
        ->orderBy('row_number', 'ASC');

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
            ['No', 'Sasaran Strategis/Program/Kegiatan', 'Indikator/Tujuan dari Sasaran Strategis/Program/Kegiatan', 'Kode Risiko', 'Kategori Risiko', 'Pernyataan Risiko', 'Sebab', 'UC/C', 'Dampak (Pihak yang Terkena)'],
            ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
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
                $event->sheet->getDelegate()->getStyle('A1:I1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('A2:I2')->applyFromArray($styleHeader2);
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
    public function query()
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];

        $query = IndikatorFitur04::query()
        ->join('indikator_fitur4s', 'indikator_fitur4s.id', 'indikator_fitur04s.indikator_fitur4_id')
        ->join('risk_registers', 'risk_registers.indikator_fitur04_id', 'indikator_fitur04s.id')
        ->join('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
        ->join('risk_varieties', 'risk_varieties.id', 'risk_registers.risk_variety_id')
        ->join('risk_types', 'risk_types.id', 'risk_registers.risk_type_id')
        ->join('pics', 'pics.id', 'risk_registers.pic_id')
        ->join('users', 'users.id', 'risk_registers.user_id')
        ->join('locations', 'locations.id', 'pics.location_id')
        ->select(
            DB::raw('(SELECT COUNT(*) FROM risk_registers r WHERE r.osd1_dampak * r.osd1_probabilitas >= risk_registers.osd1_dampak * risk_registers.osd1_probabilitas) AS `Nomor Urutan`'),
            'indikator_fitur4s.name as Nama Konteks(Proses Bisnis)',
            'indikator_fitur04s.tujuan as Indikator',
            DB::raw("CONCAT(locations.kode, '.',locations.id,'.',risk_categories.kode,'.',risk_categories.id,'.', risk_registers.id) AS Kode"),
            'risk_categories.name as Kategori Risiko',
            'risk_registers.pernyataan_risiko as Penyataan Risiko',
            'risk_registers.sebab as Sebab',
            DB::raw("'C' AS 'UC/C'"),
            'risk_registers.dampak',
            'risk_registers.osd1_dampak',
            'risk_registers.osd1_probabilitas',
            DB::raw('risk_registers.osd1_dampak * risk_registers.osd1_probabilitas AS `Tingkat risiko`'),
            DB::raw(
                '
                CASE
                    WHEN risk_registers.osd1_dampak * risk_registers.osd1_probabilitas > 14 THEN "SANGAT TINGGI"
                    WHEN risk_registers.osd1_dampak * risk_registers.osd1_probabilitas > 9 THEN "TINGGI"
                    WHEN risk_registers.osd1_dampak * risk_registers.osd1_probabilitas > 4 THEN "SEDANG"
                    WHEN risk_registers.osd1_dampak * risk_registers.osd1_probabilitas > 2 THEN "RENDAH"
                    ELSE "SANGAT RENDAH"
                END AS `Peringkat Risiko`'
            ),
            'users.name'
        )->where($whosLogin)
        ->orderBy('Tingkat risiko', 'DESC');


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
            ['No', 'Sasaran Strategis/Program/Kegiatan', 'Indikator/Tujuan dari Sasaran Strategis/Program/Kegiatan', 'Kode Risiko', 'Kategori Risiko', 'Pernyataan Risiko', 'Sebab', 'UC/C', 'Dampak', 'Inherent Risk', 'Inherent Risk', 'Inherent Risk', 'Inherent Risk', 'Pemilik Risiko'],
            ['No', 'Sasaran Strategis/Program/Kegiatan', 'Indikator/Tujuan dari Sasaran Strategis/Program/Kegiatan', 'Kode Risiko', 'Kategori Risiko', 'Pernyataan Risiko', 'Sebab', 'UC/C', 'Dampak', 'Dampak', 'Probabilitas', 'Tingkat Risiko', 'Peringkat Risiko', 'Pemilik Risiko'],
            ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'],
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
            'N' => 10,
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
                $conditional->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_GREATERTHAN);
                $conditional->addCondition(14);
                $conditional->getStyle()->applyFromArray($styleST);
                $conditionalStyles = $event->sheet->getStyle($rangeL)->getConditionalStyles();
                $conditionalStyles[] = $conditional;
                $event->sheet->getStyle($rangeL)->setConditionalStyles($conditionalStyles);

                $conditional2 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional2->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional2->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_GREATERTHAN);
                $conditional2->addCondition(9);
                $conditional2->getStyle()->applyFromArray($styleT);
                $conditional2Styles = $event->sheet->getStyle($rangeL)->getConditionalStyles();
                $conditional2Styles[] = $conditional2;
                $event->sheet->getStyle($rangeL)->setConditionalStyles($conditional2Styles);

                $conditional3 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional3->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional3->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_GREATERTHAN);
                $conditional3->addCondition(4);
                $conditional3->getStyle()->applyFromArray($styleM);
                $conditional3Styles = $event->sheet->getStyle($rangeL)->getConditionalStyles();
                $conditional3Styles[] = $conditional3;
                $event->sheet->getStyle($rangeL)->setConditionalStyles($conditional3Styles);

                $conditional4 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional4->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional4->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_GREATERTHAN);
                $conditional4->addCondition(2);
                $conditional4->getStyle()->applyFromArray($styleR);
                $conditional4Styles = $event->sheet->getStyle($rangeL)->getConditionalStyles();
                $conditional4Styles[] = $conditional4;
                $event->sheet->getStyle($rangeL)->setConditionalStyles($conditional4Styles);

                $conditional5 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional5->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional5->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_GREATERTHANOREQUAL);
                $conditional5->addCondition(1);
                $conditional5->getStyle()->applyFromArray($styleSR);
                $conditional5Styles = $event->sheet->getStyle($rangeL)->getConditionalStyles();
                $conditional5Styles[] = $conditional5;
                $event->sheet->getStyle($rangeL)->setConditionalStyles($conditional5Styles);

                $event->sheet->getDelegate()->getStyle('A3:N3')->applyFromArray($styleHeader2);
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
    public function query()
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $query = IndikatorFitur04::query()
        ->join('indikator_fitur4s', 'indikator_fitur4s.id', 'indikator_fitur04s.indikator_fitur4_id')
        ->join('risk_registers', 'risk_registers.indikator_fitur04_id', 'indikator_fitur04s.id')
        ->join('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
        ->join('risk_varieties', 'risk_varieties.id', 'risk_registers.risk_variety_id')
        ->join('risk_types', 'risk_types.id', 'risk_registers.risk_type_id')
        ->join('pics', 'pics.id', 'risk_registers.pic_id')
        ->join('users', 'users.id', 'risk_registers.user_id')
        ->join('locations', 'locations.id', 'pics.location_id')
        ->select(
            DB::raw('(SELECT COUNT(*) FROM risk_registers r WHERE r.osd1_dampak * r.osd1_probabilitas >= risk_registers.osd1_dampak * risk_registers.osd1_probabilitas) AS `Nomor Urutan`'),
            'indikator_fitur4s.name as Nama Konteks(Proses Bisnis)',
            'indikator_fitur04s.tujuan as Indikator',
            DB::raw("CONCAT(locations.kode, '.',locations.id,'.',risk_categories.kode,'.',risk_categories.id,'.', risk_registers.id) AS Kode"),
            'risk_categories.name as Kategori Risiko',
            'risk_registers.pernyataan_risiko as Penyataan Risiko',
            'risk_registers.sebab as Sebab',
            DB::raw("'C' AS 'UC/C'"),
            'risk_registers.osd1_dampak',
            'risk_registers.osd1_probabilitas',
            DB::raw('risk_registers.osd1_dampak * risk_registers.osd1_probabilitas AS `Tingkat risiko`'),
            DB::raw('
                CASE
                    WHEN risk_registers.osd1_dampak * risk_registers.osd1_probabilitas > 14 THEN "SANGAT TINGGI"
                    WHEN risk_registers.osd1_dampak * risk_registers.osd1_probabilitas > 9 THEN "TINGGI"
                    WHEN risk_registers.osd1_dampak * risk_registers.osd1_probabilitas > 4 THEN "SEDANG"
                    WHEN risk_registers.osd1_dampak * risk_registers.osd1_probabilitas > 2 THEN "RENDAH"
                    ELSE "SANGAT RENDAH"
                END AS `Peringkat Risiko`'
            ),
            'risk_registers.pengendalian_risiko',
            DB::raw("'Ada' AS 'Desain'"),
            DB::raw("'Efektif' AS 'Efektifitas'"),
            'risk_registers.osd2_dampak',
            'risk_registers.osd2_probabilitas',
            DB::raw('risk_registers.osd2_dampak * risk_registers.osd2_probabilitas AS `Tingkat risiko2`'),
            DB::raw('
                CASE
                    WHEN risk_registers.osd2_dampak * risk_registers.osd2_probabilitas > 14 THEN "SANGAT TINGGI"
                    WHEN risk_registers.osd2_dampak * risk_registers.osd2_probabilitas > 9 THEN "TINGGI"
                    WHEN risk_registers.osd2_dampak * risk_registers.osd2_probabilitas > 4 THEN "SEDANG"
                    WHEN risk_registers.osd2_dampak * risk_registers.osd2_probabilitas > 2 THEN "RENDAH"
                    ELSE "SANGAT RENDAH"
                END AS `Peringkat Risiko2`'
            ),
            DB::raw("'-' AS 'Strategi'"),
            DB::raw("'-' AS 'Uraian'"),
            DB::raw("'-' AS 'Indikator Keluaran'"),
            DB::raw("'-' AS 'Jadwal'"),
            'users.name',
            'risk_registers.osd2_dampak as dampak3',
            'risk_registers.osd2_probabilitas as probabilitas3',
            DB::raw('risk_registers.osd2_dampak * risk_registers.osd2_probabilitas AS `Tingkat risiko3`'),
            DB::raw('
                CASE
                    WHEN risk_registers.osd2_dampak * risk_registers.osd2_probabilitas > 14 THEN "SANGAT TINGGI"
                    WHEN risk_registers.osd2_dampak * risk_registers.osd2_probabilitas > 9 THEN "TINGGI"
                    WHEN risk_registers.osd2_dampak * risk_registers.osd2_probabilitas > 4 THEN "SEDANG"
                    WHEN risk_registers.osd2_dampak * risk_registers.osd2_probabilitas > 2 THEN "RENDAH"
                    ELSE "SANGAT RENDAH"
                END AS `Peringkat Risiko3`'
            ),
        )
        ->where($whosLogin)
        ->orderBy('Tingkat risiko', 'DESC');

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
            ['No', 'Sasaran Strategis/Program/Kegiatan', 'Indikator/Tujuan dari Sasaran Strategis/Program/Kegiatan', 'Kode Risiko', 'Kategori Risiko', 'Pernyataan Risiko', 'Penyebab', 'UC/C', 'Inherent Risk', 'Inherent Risk', 'Inherent Risk', 'Inherent Risk', 'Pengendalian Yang Ada', 'Pengendalian Yang Ada', 'Pengendalian Yang Ada','Risidual Risk','Risidual Risk','Risidual Risk','Risidual Risk','Rencana Pengendalian (Untuk skor risk residual > selera risiko)','Rencana Pengendalian (Untuk skor risk residual > selera risiko)','Rencana Pengendalian (Untuk skor risk residual > selera risiko)','Rencana Pengendalian (Untuk skor risk residual > selera risiko)','Rencana Pengendalian (Untuk skor risk residual > selera risiko)','Treated Risk','Treated Risk','Treated Risk','Treated Risk'],

            ['No', 'Sasaran Strategis/Program/Kegiatan', 'Indikator/Tujuan dari Sasaran Strategis/Program/Kegiatan', 'Kode Risiko', 'Kategori Risiko', 'Pernyataan Risiko', 'Penyebab', 'UC/C', 'Probability', 'Dampak', 'Tingkat Risiko', 'Peringkat Risiko', 'Uraian', 'Desain', 'Efektifitas','Probability', 'Dampak', 'Tingkat Risiko', 'Peringkat Risiko','Strategi','Uraian','Indikator Keluaran','Jadwal','Penanggungjawab','Probability', 'Dampak', 'Tingkat Risiko', 'Peringkat Risiko'],

            ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14','15','16','17','18','19','20','21','22','23','24','25','26','27','28'],
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
            'I' => 12,
            'J' => 12,
            'K' => 10,
            'L' => 10,
            'M' => 20,
            'N' => 10,
            'O' => 10,
            'P' => 12,
            'Q' => 10,
            'R' => 10,
            'S' => 10,
            'T' => 20,
            'U' => 20,
            'V' => 20,
            'W' => 20,
            'X' => 20,
            'Y' => 12,
            'Z' => 10,
            'AA' => 10,
            'AB' => 10,
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
                $rangeK = 'K4:' . 'K' . $highestRow;
                $rangeR = 'R4:' . 'R' . $highestRow;
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
                $conditional->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_GREATERTHAN);
                $conditional->addCondition(14);
                $conditional->getStyle()->applyFromArray($styleST);
                $conditionalStyles = $event->sheet->getStyle($rangeK)->getConditionalStyles();
                $conditionalStyles[] = $conditional;
                $event->sheet->getStyle($rangeK)->setConditionalStyles($conditionalStyles);

                $conditional2 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional2->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional2->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_GREATERTHAN);
                $conditional2->addCondition(9);
                $conditional2->getStyle()->applyFromArray($styleT);
                $conditional2Styles = $event->sheet->getStyle($rangeK)->getConditionalStyles();
                $conditional2Styles[] = $conditional2;
                $event->sheet->getStyle($rangeK)->setConditionalStyles($conditional2Styles);

                $conditional3 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional3->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional3->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_GREATERTHAN);
                $conditional3->addCondition(4);
                $conditional3->getStyle()->applyFromArray($styleM);
                $conditional3Styles = $event->sheet->getStyle($rangeK)->getConditionalStyles();
                $conditional3Styles[] = $conditional3;
                $event->sheet->getStyle($rangeK)->setConditionalStyles($conditional3Styles);

                $conditional4 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional4->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional4->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_GREATERTHAN);
                $conditional4->addCondition(2);
                $conditional4->getStyle()->applyFromArray($styleR);
                $conditional4Styles = $event->sheet->getStyle($rangeK)->getConditionalStyles();
                $conditional4Styles[] = $conditional4;
                $event->sheet->getStyle($rangeK)->setConditionalStyles($conditional4Styles);

                $conditional5 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional5->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional5->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_GREATERTHANOREQUAL);
                $conditional5->addCondition(1);
                $conditional5->getStyle()->applyFromArray($styleSR);
                $conditional5Styles = $event->sheet->getStyle($rangeK)->getConditionalStyles();
                $conditional5Styles[] = $conditional5;
                $event->sheet->getStyle($rangeK)->setConditionalStyles($conditional5Styles);


                $conditional = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_GREATERTHAN);
                $conditional->addCondition(14);
                $conditional->getStyle()->applyFromArray($styleST);
                $conditionalStyles = $event->sheet->getStyle($rangeR)->getConditionalStyles();
                $conditionalStyles[] = $conditional;
                $event->sheet->getStyle($rangeR)->setConditionalStyles($conditionalStyles);

                $conditional2 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional2->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional2->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_GREATERTHAN);
                $conditional2->addCondition(9);
                $conditional2->getStyle()->applyFromArray($styleT);
                $conditional2Styles = $event->sheet->getStyle($rangeR)->getConditionalStyles();
                $conditional2Styles[] = $conditional2;
                $event->sheet->getStyle($rangeR)->setConditionalStyles($conditional2Styles);

                $conditional3 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional3->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional3->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_GREATERTHAN);
                $conditional3->addCondition(4);
                $conditional3->getStyle()->applyFromArray($styleM);
                $conditional3Styles = $event->sheet->getStyle($rangeR)->getConditionalStyles();
                $conditional3Styles[] = $conditional3;
                $event->sheet->getStyle($rangeR)->setConditionalStyles($conditional3Styles);

                $conditional4 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional4->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional4->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_GREATERTHAN);
                $conditional4->addCondition(2);
                $conditional4->getStyle()->applyFromArray($styleR);
                $conditional4Styles = $event->sheet->getStyle($rangeR)->getConditionalStyles();
                $conditional4Styles[] = $conditional4;
                $event->sheet->getStyle($rangeR)->setConditionalStyles($conditional4Styles);

                $conditional5 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional5->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional5->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_GREATERTHANOREQUAL);
                $conditional5->addCondition(1);
                $conditional5->getStyle()->applyFromArray($styleSR);
                $conditional5Styles = $event->sheet->getStyle($rangeR)->getConditionalStyles();
                $conditional5Styles[] = $conditional5;
                $event->sheet->getStyle($rangeR)->setConditionalStyles($conditional5Styles);

                $conditional = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_GREATERTHAN);
                $conditional->addCondition(14);
                $conditional->getStyle()->applyFromArray($styleST);
                $conditionalStyles = $event->sheet->getStyle($rangeAA)->getConditionalStyles();
                $conditionalStyles[] = $conditional;
                $event->sheet->getStyle($rangeAA)->setConditionalStyles($conditionalStyles);

                $conditional2 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional2->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional2->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_GREATERTHAN);
                $conditional2->addCondition(9);
                $conditional2->getStyle()->applyFromArray($styleT);
                $conditional2Styles = $event->sheet->getStyle($rangeAA)->getConditionalStyles();
                $conditional2Styles[] = $conditional2;
                $event->sheet->getStyle($rangeAA)->setConditionalStyles($conditional2Styles);

                $conditional3 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional3->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional3->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_GREATERTHAN);
                $conditional3->addCondition(4);
                $conditional3->getStyle()->applyFromArray($styleM);
                $conditional3Styles = $event->sheet->getStyle($rangeAA)->getConditionalStyles();
                $conditional3Styles[] = $conditional3;
                $event->sheet->getStyle($rangeAA)->setConditionalStyles($conditional3Styles);

                $conditional4 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional4->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional4->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_GREATERTHAN);
                $conditional4->addCondition(2);
                $conditional4->getStyle()->applyFromArray($styleR);
                $conditional4Styles = $event->sheet->getStyle($rangeAA)->getConditionalStyles();
                $conditional4Styles[] = $conditional4;
                $event->sheet->getStyle($rangeAA)->setConditionalStyles($conditional4Styles);

                $conditional5 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional5->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
                $conditional5->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_GREATERTHANOREQUAL);
                $conditional5->addCondition(1);
                $conditional5->getStyle()->applyFromArray($styleSR);
                $conditional5Styles = $event->sheet->getStyle($rangeAA)->getConditionalStyles();
                $conditional5Styles[] = $conditional5;
                $event->sheet->getStyle($rangeAA)->setConditionalStyles($conditional5Styles);

                $event->sheet->getDelegate()->getStyle('A3:AB3')->applyFromArray($styleHeader2);
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

                $event->sheet->getDelegate()->mergeCells('I1:L1');
                $event->sheet->getDelegate()->getStyle('I1:L1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('I2:L2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('M1:O1');
                $event->sheet->getDelegate()->getStyle('M1:O1')->applyFromArray($styleHeader3);
                $event->sheet->getDelegate()->getStyle('M2:O2')->applyFromArray($styleHeader3);

                $event->sheet->getDelegate()->mergeCells('P1:S1');
                $event->sheet->getDelegate()->getStyle('P1:S1')->applyFromArray($styleHeader3);
                $event->sheet->getDelegate()->getStyle('P2:S2')->applyFromArray($styleHeader3);

                $event->sheet->getDelegate()->mergeCells('T1:X1');
                $event->sheet->getDelegate()->getStyle('T1:X1')->applyFromArray($styleHeader3);
                $event->sheet->getDelegate()->getStyle('T2:X2')->applyFromArray($styleHeader3);

                $event->sheet->getDelegate()->mergeCells('Y1:AB1');
                $event->sheet->getDelegate()->getStyle('Y1:AB1')->applyFromArray($styleHeader4);
                $event->sheet->getDelegate()->getStyle('Y2:AB2')->applyFromArray($styleHeader4);


                
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
    public function query()
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $query = IndikatorFitur04::query()
        ->join('indikator_fitur4s', 'indikator_fitur4s.id', 'indikator_fitur04s.indikator_fitur4_id')
        ->join('risk_registers', 'risk_registers.indikator_fitur04_id', 'indikator_fitur04s.id')
        ->join('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
        ->join('risk_varieties', 'risk_varieties.id', 'risk_registers.risk_variety_id')
        ->join('risk_types', 'risk_types.id', 'risk_registers.risk_type_id')
        ->join('pics', 'pics.id', 'risk_registers.pic_id')
        ->join('users', 'users.id', 'risk_registers.user_id')
        ->select(
            DB::raw('row_number() OVER (ORDER BY risk_registers.osd2_dampak * risk_registers.osd2_probabilitas * risk_registers.osd2_controllability DESC) AS `No Urut`'),
            'risk_registers.pernyataan_risiko as Penyataan Risiko',
            'risk_categories.name as Kategori Risiko',
            'risk_registers.sebab as Sebab',
            'risk_registers.osd2_dampak',
            'risk_registers.osd2_probabilitas',
            'risk_registers.osd2_controllability',
            DB::raw('risk_registers.osd2_dampak * risk_registers.osd2_probabilitas * risk_registers.osd2_controllability AS `Skor`'),
            DB::raw('row_number() OVER (ORDER BY risk_registers.osd2_dampak * risk_registers.osd2_probabilitas * risk_registers.osd2_controllability DESC) AS `Peringkat2`'),
        )
        ->groupBy(
            'risk_registers.pernyataan_risiko',
            'risk_categories.name',
            'risk_registers.sebab',
            'risk_registers.osd2_dampak',
            'risk_registers.osd2_probabilitas',
            'risk_registers.osd2_controllability'
        )
        ->where($whosLogin)
        ->orderBy('Skor', 'DESC');

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
            ['No', 'Pernyataan Risiko', 'Kategori Risiko', 'Penyebab Risiko', 'Probabilitas', 'Dampak', 'Controllability', 'Skor', 'Ranking'],
            ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        ];
    }
    public function columnWidths(): array
    {
        return [
            'A' => 4,
            'B' => 36,
            'C' => 26,
            'D' => 36,
            'E' => 12,
            'F' => 12,
            'G' => 15,
            'H' => 7,
            'I' => 12,
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

                $event->sheet->getDelegate()->getStyle($rangeA)->applyFromArray([
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                    ],
                ]);
                $event->sheet->getDelegate()->getStyle('A1:F1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('G1:I1')->applyFromArray($styleHeader3);
                $event->sheet->getDelegate()->getStyle('A2:I2')->applyFromArray($styleHeader2);
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
    public function query()
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $query = RiskRegister::query()
                ->select('risk_registers.id', 'indikator_fitur04s.name as nama_kegiatan', 'indikator_fitur04s.tujuan', 'pics.name as nama_pic', 'risk_categories.name as nama_kategori')
                ->leftjoin('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
                ->leftjoin('indikator_fitur04s', 'indikator_fitur04s.id', 'risk_registers.indikator_fitur04_id')
                ->leftjoin('identification_sources', 'identification_sources.id', 'risk_registers.identification_source_id')
                ->leftjoin('locations', 'locations.id', 'indikator_fitur04s.location_id')
                ->leftjoin('sasaran_strategis', 'sasaran_strategis.id', 'indikator_fitur04s.sasaran_strategis_id')
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
                ->where('tipe_id', 2)->where($whosLogin);

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
            ['No', 'Risiko Prioritas', 'Pemantauan RTP','Pemantauan RTP','Pemantauan RTP','Pemantauan RTP','Pemantauan RTP','Pemantauan RTP', 'Pemantauan Keterjadian Risiko', 'Pemantauan Keterjadian Risiko', 'Pemantauan Keterjadian Risiko', 'Pemantauan Keterjadian Risiko', 'Pemantauan Keterjadian Risiko'],

            ['No', 'Risiko Prioritas', 'Uraian Tindak Pengendalian','Uraian Tindak Pengendalian','Waktu Tindak Pengendalian','Waktu Tindak Pengendalian','Penanggungjawab','Dokumen Pendukung', 'Kendala', 'Jumlah Keterjadian', 'Jumlah Keterjadian', 'Jumlah Keterjadian', 'Jumlah Keterjadian', 'Jumlah Keterjadian'],

            ['No', 'Risiko Prioritas', 'Rencana','Realisasi','Rencana','Realisasi','Penanggungjawab','Dokumen Pendukung', 'Kendala', 'Triwulan I', 'Triwulan II', 'Triwulan III', 'Triwulan IV', 'Total'],

            ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'],
        ];
    }
    public function columnWidths(): array
    {
        return [
            'A' => 4,
            'B' => 36,
            'C' => 36,
            'D' => 36,
            'E' => 20,
            'F' => 20,
            'G' => 26,
            'H' => 26,
            'I' => 26,
            'J' => 20,
            'K' => 20,
            'L' => 20,
            'M' => 20,
            'N' => 10,
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

                $event->sheet->getDelegate()->getStyle('A4:N4')->applyFromArray($styleHeader2);
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


                $event->sheet->getDelegate()->mergeCells('J1:N1');
                $event->sheet->getDelegate()->getStyle('J1:N1')->applyFromArray($styleHeader4);
                $event->sheet->getDelegate()->mergeCells('J2:N2');
                $event->sheet->getDelegate()->getStyle('J2:N2')->applyFromArray($styleHeader4);
                $event->sheet->getDelegate()->getStyle('J3:N3')->applyFromArray($styleHeader4);
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
    public function query()
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $query = IndikatorFitur04::query()
        ->join('indikator_fitur4s', 'indikator_fitur4s.id', 'indikator_fitur04s.indikator_fitur4_id')
        ->join('risk_registers', 'risk_registers.indikator_fitur04_id', 'indikator_fitur04s.id')
        ->join('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
        ->join('risk_varieties', 'risk_varieties.id', 'risk_registers.risk_variety_id')
        ->join('risk_types', 'risk_types.id', 'risk_registers.risk_type_id')
        ->join('pics', 'pics.id', 'risk_registers.pic_id')
        ->select(
            DB::raw("(SELECT COUNT(*) FROM risk_registers r WHERE r.id <= risk_registers.id) AS row_number"),
            'risk_registers.pernyataan_risiko as Penyataan Risiko',
            DB::raw("'-' AS 'Why1'"),
            DB::raw("'-' AS 'Why2'"),
            DB::raw("'-' AS 'Why3'"),
            DB::raw("'-' AS 'Why4'"),
            DB::raw("'-' AS 'Why5'"),
            'risk_registers.sebab as Sebab',
        )
        ->where($whosLogin)
        ->orderBy('row_number', 'ASC');
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
            ['No', 'Pernyataan Risiko', 'Why 1', 'Why 2', 'Why 3', 'Why 4', 'Why 5', 'Akar Penyebab'],
            ['1', '2', '3', '4', '5', '6', '7', '8'],
        ];
    }
    public function columnWidths(): array
    {
        return [
            'A' => 4,
            'B' => 36,
            'C' => 20,
            'D' => 20,
            'E' => 20,
            'F' => 20,
            'G' => 20,
            'H' => 36,
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
                $event->sheet->getDelegate()->getStyle('A1:H1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('A2:H2')->applyFromArray($styleHeader2);
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
    public function query()
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $query = IndikatorFitur04::query()
        ->join('indikator_fitur4s', 'indikator_fitur4s.id', 'indikator_fitur04s.indikator_fitur4_id')
        ->join('risk_registers', 'risk_registers.indikator_fitur04_id', 'indikator_fitur04s.id')
        ->join('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
        ->join('risk_varieties', 'risk_varieties.id', 'risk_registers.risk_variety_id')
        ->join('risk_types', 'risk_types.id', 'risk_registers.risk_type_id')
        ->join('pics', 'pics.id', 'risk_registers.pic_id')
        ->join('users', 'users.id', 'risk_registers.user_id')
        ->select(
            DB::raw('(SELECT COUNT(*) FROM risk_registers r WHERE r.osd1_dampak * r.osd1_probabilitas >= risk_registers.osd1_dampak * risk_registers.osd1_probabilitas) AS `Nomor`'),
            'risk_registers.pernyataan_risiko as Penyataan Risiko',
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
        )
        ->where($whosLogin)
        ->orderBy('Nomor', 'DESC');

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
            ['No', 'Pernyataan Risiko', 'Skor Dampak','Skor Dampak','Skor Dampak','Skor Dampak','Skor Dampak','Skor Dampak', 'Skor Kemungkinan',  'Skor Kemungkinan',  'Skor Kemungkinan',  'Skor Kemungkinan',  'Skor Kemungkinan',  'Skor Kemungkinan', 'Modus', 'Modus'],
            ['No', 'Pernyataan Risiko', 'Responden 1','Responden 2','Responden 3','Responden 4','Responden 5','Responden 6', 'Responden 1','Responden 2','Responden 3','Responden 4','Responden 5','Responden 6', 'Dampak', 'Probabilitas'],
        ];
    }
    public function columnWidths(): array
    {
        return [
            'A' => 4,
            'B' => 36,
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
                $event->sheet->getDelegate()->mergeCells('A1:A2');
                $event->sheet->getDelegate()->getStyle('A1:A2')->applyFromArray($styleHeader2);
                $event->sheet->getDelegate()->mergeCells('B1:B2');
                $event->sheet->getDelegate()->getStyle('B1:B2')->applyFromArray($styleHeader2);
                $event->sheet->getDelegate()->mergeCells('C1:H1');
                $event->sheet->getDelegate()->getStyle('C1:H1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('C2:H2')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('I1:N1');
                $event->sheet->getDelegate()->getStyle('I1:N1')->applyFromArray($styleHeader3);
                $event->sheet->getDelegate()->getStyle('I2:N2')->applyFromArray($styleHeader3);
                $event->sheet->getDelegate()->mergeCells('O1:P1');
                $event->sheet->getDelegate()->getStyle('O1:P1')->applyFromArray($styleHeader4);
                $event->sheet->getDelegate()->getStyle('O2:P2')->applyFromArray($styleHeader4);
            },
        ];
    }
}
class Sheet9 implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithTitle
{
    /**
     * @return \Illuminate\Support\Collection
     */
    protected $data;
    public function query()
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $query = IndikatorFitur04::query()
        ->join('indikator_fitur4s', 'indikator_fitur4s.id', 'indikator_fitur04s.indikator_fitur4_id')
        ->join('risk_registers', 'risk_registers.indikator_fitur04_id', 'indikator_fitur04s.id')
        ->join('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
        ->join('risk_varieties', 'risk_varieties.id', 'risk_registers.risk_variety_id')
        ->join('risk_types', 'risk_types.id', 'risk_registers.risk_type_id')
        ->join('pics', 'pics.id', 'risk_registers.pic_id')
        ->join('users', 'users.id', 'risk_registers.user_id')
        ->select(
            DB::raw('(SELECT COUNT(*) FROM risk_registers r WHERE r.osd1_dampak * r.osd1_probabilitas >= risk_registers.osd1_dampak * risk_registers.osd1_probabilitas) AS `Nomor`'),
            'risk_registers.pernyataan_risiko as Penyataan Risiko',
            DB::raw("'-' AS 'Dampak'"),
            DB::raw("'-' AS 'Probabilitas'"),
            'risk_registers.pengendalian_risiko',
            DB::raw("'Efektif' AS 'Efektifitas'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
        )
        ->where($whosLogin)
        ->orderBy('Nomor', 'DESC');

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
            ['No', 'Pernyataan Risiko','Skor Inherent Risk','Skor Inherent Risk', 'Pengendalian yang Ada', 'Pengendalian yang Ada',  'Skor Dampak','Skor Dampak','Skor Dampak','Skor Dampak','Skor Dampak','Skor Dampak', 'Skor Kemungkinan',  'Skor Kemungkinan',  'Skor Kemungkinan',  'Skor Kemungkinan',  'Skor Kemungkinan',  'Skor Kemungkinan', 'Modus', 'Modus'],
            ['No', 'Pernyataan Risiko', 'Dampak','Probabilitas','Uraian','Efektivitas','Responden 1','Responden 2','Responden 3','Responden 4','Responden 5','Responden 6', 'Responden 1','Responden 2','Responden 3','Responden 4','Responden 5','Responden 6', 'Dampak', 'Probabilitas'],
        ];
    }
    public function columnWidths(): array
    {
        return [
            'A' => 4,
            'B' => 36,
            'C' => 15,
            'D' => 15,
            'E' => 36,
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

                $event->sheet->getDelegate()->mergeCells('G1:L1');
                $event->sheet->getDelegate()->getStyle('G1:L1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('G2:L2')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('M1:R1');
                $event->sheet->getDelegate()->getStyle('M1:R1')->applyFromArray($styleHeader3);
                $event->sheet->getDelegate()->getStyle('M2:R2')->applyFromArray($styleHeader3);
                $event->sheet->getDelegate()->mergeCells('S1:T1');
                $event->sheet->getDelegate()->getStyle('S1:T1')->applyFromArray($styleHeader4);
                $event->sheet->getDelegate()->getStyle('S2:T2')->applyFromArray($styleHeader4);
            },
        ];
    }
}
class Sheet10 implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithTitle
{
    /**
     * @return \Illuminate\Support\Collection
     */
    protected $data;
    public function query()
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $query = IndikatorFitur04::query()
        ->join('indikator_fitur4s', 'indikator_fitur4s.id', 'indikator_fitur04s.indikator_fitur4_id')
        ->join('risk_registers', 'risk_registers.indikator_fitur04_id', 'indikator_fitur04s.id')
        ->join('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
        ->join('risk_varieties', 'risk_varieties.id', 'risk_registers.risk_variety_id')
        ->join('risk_types', 'risk_types.id', 'risk_registers.risk_type_id')
        ->join('pics', 'pics.id', 'risk_registers.pic_id')
        ->join('users', 'users.id', 'risk_registers.user_id')
        ->select(
            DB::raw('(SELECT COUNT(*) FROM risk_registers r WHERE r.osd1_dampak * r.osd1_probabilitas >= risk_registers.osd1_dampak * risk_registers.osd1_probabilitas) AS `Nomor`'),
            'risk_registers.pernyataan_risiko as Penyataan Risiko',
            DB::raw("'-' AS 'Dampak'"),
            DB::raw("'-' AS 'Probabilitas'"),
            'risk_registers.pengendalian_risiko',
            DB::raw("'Efektif' AS 'Efektifitas'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
            DB::raw("'-' AS 'Responden'"),
        )
        ->where($whosLogin)
        ->orderBy('Nomor', 'DESC');

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
            ['No', 'Pernyataan Risiko','Skor Residual Risk','Skor Residual Risk', 'RTP', 'RTP',  'Skor Dampak','Skor Dampak','Skor Dampak','Skor Dampak','Skor Dampak','Skor Dampak', 'Skor Kemungkinan',  'Skor Kemungkinan',  'Skor Kemungkinan',  'Skor Kemungkinan',  'Skor Kemungkinan',  'Skor Kemungkinan', 'Modus', 'Modus'],
            ['No', 'Pernyataan Risiko', 'Dampak','Probabilitas','Strategi','Uraian','Responden 1','Responden 2','Responden 3','Responden 4','Responden 5','Responden 6', 'Responden 1','Responden 2','Responden 3','Responden 4','Responden 5','Responden 6', 'Dampak', 'Probabilitas'],
        ];
    }
    public function columnWidths(): array
    {
        return [
            'A' => 4,
            'B' => 36,
            'C' => 15,
            'D' => 15,
            'E' => 36,
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

                $event->sheet->getDelegate()->mergeCells('G1:L1');
                $event->sheet->getDelegate()->getStyle('G1:L1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('G2:L2')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('M1:R1');
                $event->sheet->getDelegate()->getStyle('M1:R1')->applyFromArray($styleHeader3);
                $event->sheet->getDelegate()->getStyle('M2:R2')->applyFromArray($styleHeader3);
                $event->sheet->getDelegate()->mergeCells('S1:T1');
                $event->sheet->getDelegate()->getStyle('S1:T1')->applyFromArray($styleHeader4);
                $event->sheet->getDelegate()->getStyle('S2:T2')->applyFromArray($styleHeader4);
            },
        ];
    }
}
class Sheet11 implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithTitle
{
    /**
     * @return \Illuminate\Support\Collection
     */
    protected $data;
    public function query()
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $query = IndikatorFitur04::query()
        ->join('indikator_fitur4s', 'indikator_fitur4s.id', 'indikator_fitur04s.indikator_fitur4_id')
        ->join('risk_registers', 'risk_registers.indikator_fitur04_id', 'indikator_fitur04s.id')
        ->select(DB::raw("(SELECT COUNT(*) FROM indikator_fitur04s r WHERE r.id <= indikator_fitur04s.id) AS Nomor"),
         'indikator_fitur4s.name as NamaKonteks(ProsesBisnis)', 
         'indikator_fitur04s.tujuan as Indikator', DB::raw("'-' AS 'Dampak'"),DB::raw("'-' AS 'Dampak1'"))
         ->where($whosLogin)
        ->orderBy('Nomor', 'ASC');
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
            ['No', 'Dokumen', 'Uraian', 'Periode Pelaporan','Link'],
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