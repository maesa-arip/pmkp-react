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

class FormatFitur4Export implements WithMultipleSheets
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
        $query = IndikatorFitur1::query()
        ->join('sasaran_strategis', 'sasaran_strategis.id', 'indikator_fitur1s.sasaran_strategis_id')
        ->select('indikator_fitur1s.id as Nomor', 'sasaran_strategis.name as Sasaran_Strategis', 'indikator_fitur1s.name as Indikator', 'indikator_fitur1s.tujuan');

        $this->data = $query->get();
        return $query;
    }
    public function title(): string
    {
        return 'FITUR 1 DIREKTUR';
    }
    public function headings(): array
    {
        return [
            ['No', 'Sasaran Strategis', 'Indikator', 'Tujuan'],
        ];
    }
    public function columnWidths(): array
    {
        return [
            'A' => 4,
            'B' => 65,
            'C' => 65,
            'D' => 65,
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
                            'argb' => 'FFFFFFFF',
                        ],
                        'endColor' => [
                            'argb' => 'FFFFFFFF',
                        ],
                    ],
                ];
                $event->sheet->getDelegate()->getStyle($rangeA)->applyFromArray([
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_LEFT,
                    ],
                ]);
                $event->sheet->getDelegate()->getStyle('A1:D1')->applyFromArray($styleHeader);
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
        $query = IndikatorFitur2::query()
        ->join('sasaran_strategis', 'sasaran_strategis.id', 'indikator_fitur2s.sasaran_strategis_id')
        ->select('indikator_fitur2s.id as Nomor', 'sasaran_strategis.name as Sasaran_Strategis', 'indikator_fitur2s.name as Indikator', 'indikator_fitur2s.tujuan');

        $this->data = $query->get();
        return $query;
    }
    public function title(): string
    {
        return 'FITUR 2 WADIR DAN KOMITE';
    }
    public function headings(): array
    {
        return [
            ['No', 'Sasaran Strategis', 'Indikator', 'Tujuan'],
        ];
    }
    public function columnWidths(): array
    {
        return [
            'A' => 4,
            'B' => 65,
            'C' => 65,
            'D' => 65,
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
                $event->sheet->getDelegate()->getStyle('A1:D1')->applyFromArray($styleHeader);
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
        $query = IndikatorFitur3::query()
        ->join('sasaran_strategis', 'sasaran_strategis.id', 'indikator_fitur3s.sasaran_strategis_id')
        ->select('indikator_fitur3s.id as Nomor', 'sasaran_strategis.name as Sasaran_Strategis', 'indikator_fitur3s.name as Indikator', 'indikator_fitur3s.tujuan');

        $this->data = $query->get();
        return $query;
    }
    public function title(): string
    {
        return 'FITUR 3 BIDANG & BAGIAN';
    }
    public function headings(): array
    {
        return [
            ['No', 'Sasaran Strategis', 'Indikator', 'Tujuan'],
        ];
    }
    public function columnWidths(): array
    {
        return [
            'A' => 4,
            'B' => 65,
            'C' => 65,
            'D' => 65,
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
                $event->sheet->getDelegate()->getStyle('A1:D1')->applyFromArray($styleHeader);
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
        $query = RiskRegister::query()
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
        ->select('risk_registers.id', 'indikator_fitur04s.name', 'indikator_fitur04s.tujuan', 'locations.name as location_name', 'risk_registers.sebab', 'risk_registers.resiko', 'risk_registers.dampak', 'risk_registers.pernyataan_risiko', 'risk_registers.pengendalian_risiko', 'risk_registers.osd1_dampak', 'risk_registers.osd1_probabilitas', 'osd1_controllability', 'risk_registers.osd1_inherent', 'risk_registers.osd1_inherent as osd1_inh',  DB::raw("'xxx' AS 'Kode1'"),  DB::raw("'xxx' AS 'Kode2'"),  DB::raw("'xxx' AS 'Kode3'"),  DB::raw("'xxx' AS 'Kode4'"), 'risk_registers.osd2_probabilitas', 'osd2_controllability', 'risk_registers.osd2_inherent', 'risk_registers.osd2_inherent as osd2_inh', 'pics.name as pic_name', 'risk_registers.target_waktu')
        // ->where('tipe_id', 1)
        ->where($whosLogin);

        

        $this->data = $query->get();
        return $query;
    }
    public function title(): string
    {
        return 'FITUR 4 UNIT';
    }
    public function headings(): array
    {
        return [
            ['No', 'Nama Kegiatan', 'Tujuan Kegiatan', 'Area/Lokasi', 'Risiko', 'Risiko', 'Risiko', 'Risiko', 'Pengendalian yang sudah ada saat ini', 'Analisis Risiko Inherent', 'Analisis Risiko Inherent', 'Analisis Risiko Inherent','Analisis Risiko Inherent','Analisis Risiko Inherent','Evaluasi Risiko','Alternatif Teknik Penanganan Risiko','Alternatif Teknik Penanganan Risiko','Alternatif Teknik Penanganan Risiko','Risiko Residual','Risiko Residual','Risiko Residual','Risiko Residual','Pemilik Risiko/ Penanggungjawab','Target waktu'],

            ['No', 'Nama Kegiatan', 'Tujuan Kegiatan', 'Area/Lokasi', 'Sebab', 'Risiko', 'Dampak', 'Pernyataan Risiko', 'Pengendalian yang sudah ada saat ini', 'Dampak', 'Probabilitas', 'Controllability','Skor','Peringkat Risiko','Apakah perlu penanganan risiko?','Opsi teknik pengendalian risiko','Uraian penanganan risiko','Pembiayaan risiko ','Dampak', 'Probabilitas', 'Skor','Peringkat Risiko','Pemilik Risiko/ Penanggungjawab','Target waktu'],
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
            'H' => 45,
            'I' => 20,
            'J' => 12,
            'K' => 12,
            'L' => 15,
            'M' => 12,
            'N' => 12,
            'O' => 20,
            'P' => 20,
            'Q' => 20,
            'R' => 12,
            'S' => 12,
            'T' => 12,
            'U' => 15,
            'V' => 12,
            'W' => 20,
            'X' => 12,
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

                $event->sheet->getDelegate()->mergeCells('E1:H1');
                $event->sheet->getDelegate()->getStyle('E1:H1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('E2:H2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('I1:I2');
                $event->sheet->getDelegate()->getStyle('I1:I2')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('J1:N1');
                $event->sheet->getDelegate()->getStyle('J1:N1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('J2:N2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->getStyle('O1:O1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('O2:O2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('P1:R1');
                $event->sheet->getDelegate()->getStyle('P1:R1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('P2:R2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('S1:V1');
                $event->sheet->getDelegate()->getStyle('S1:V1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('S2:V2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('W1:W2');
                $event->sheet->getDelegate()->getStyle('W1:W2')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('X1:X2');
                $event->sheet->getDelegate()->getStyle('X1:X2')->applyFromArray($styleHeader);


                
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
        // ->where('tipe_id', 1)
        ->where($whosLogin);

        $this->data = $query->get();
        return $query;
    }
    public function title(): string
    {
        return 'TABEL BANTU KEGIATAN & SASARAN ';
    }
    public function headings(): array
    {
        return [
            ['No', 'Nama Kegiatan', 'Tujuan Kegiatan', 'Pemilik Risiko','Kategori Risiko'],
        ];
    }
    public function columnWidths(): array
    {
        return [
            'A' => 4,
            'B' => 65,
            'C' => 65,
            'D' => 20,
            'E' => 20,
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
                            'argb' => 'FFFF00',
                        ],
                        'endColor' => [
                            'argb' => 'FFFF00',
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
        ->select('risk_registers.id', 'indikator_fitur04s.name', 'indikator_fitur04s.tujuan',  'risk_registers.pernyataan_risiko', DB::raw("'-' AS 'Opsi'"),'risk_registers.pengendalian_risiko as uraian','risk_registers.pengendalian_risiko',DB::raw("'Efektif' AS 'Efektif'"),'risk_registers.pengendalian_risiko as harusada', DB::raw("'-' AS 'kegiatan'"),'risk_registers.target_waktu',DB::raw("'-' AS 'jenis'"),'users.name as pemilik', 'pics.name as pic_name')
        // ->where('tipe_id', 1)
        ->where($whosLogin);

        

        $this->data = $query->get();
        return $query;
    }
    public function title(): string
    {
        return 'RENCANA PENANGANAN';
    }
    public function headings(): array
    {
        return [
            ['No', 'Kegiatan', 'Sasaran', 'Risiko Prioritas Tinggi/ Sangat Tinggi', 'Alternatif teknik penanganan risiko', 'Alternatif teknik penanganan risiko', 'Pengendalian yang sudah ada', 'Pengendalian yang sudah ada', 'Pengendalian yang sudah ada', 'Rencana Pengendalian', 'Rencana Pengendalian', 'Rencana Pengendalian','Pemilik Risiko','Penanggung jawab TL pengendalian'],

            ['No', 'Kegiatan', 'Sasaran', 'Risiko Prioritas Tinggi/ Sangat Tinggi', 'Opsi Teknik Penanganan Risiko', 'Uraian penanganan risiko', 'Pengendalian yang sudah ada', 'Efektif/ kurang efektif', 'Pengendalian yang harus ada', 'Kegiatan', 'Waktu', 'Jenis: Detektif (D), Preventif (P), Korektif (K),','Pemilik Risiko','Penanggung jawab TL pengendalian'],
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
            'N' => 15,
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
                $event->sheet->getDelegate()->mergeCells('A1:A2');
                $event->sheet->getDelegate()->getStyle('A1:A2')->applyFromArray($styleHeader3);
                $event->sheet->getDelegate()->mergeCells('B1:B2');
                $event->sheet->getDelegate()->getStyle('B1:B2')->applyFromArray($styleHeader3);
                $event->sheet->getDelegate()->mergeCells('C1:C2');
                $event->sheet->getDelegate()->getStyle('C1:C2')->applyFromArray($styleHeader3);
                $event->sheet->getDelegate()->mergeCells('D1:D2');
                $event->sheet->getDelegate()->getStyle('D1:D2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('E1:F1');
                $event->sheet->getDelegate()->getStyle('E1:F1')->applyFromArray($styleHeader3);
                $event->sheet->getDelegate()->getStyle('E2:G2')->applyFromArray($styleHeader3);

                $event->sheet->getDelegate()->mergeCells('G1:I1');
                $event->sheet->getDelegate()->getStyle('G1:I1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('H2:I2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('J1:L1');
                $event->sheet->getDelegate()->getStyle('J1:L1')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->getStyle('J2:L2')->applyFromArray($styleHeader);

                $event->sheet->getDelegate()->mergeCells('M1:M2');
                $event->sheet->getDelegate()->getStyle('M1:M2')->applyFromArray($styleHeader);
                
                $event->sheet->getDelegate()->mergeCells('N1:N2');
                $event->sheet->getDelegate()->getStyle('N1:N2')->applyFromArray($styleHeader);

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
        $query = RiskRegister::query()
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
        ->select('risk_registers.id', 'indikator_fitur04s.name', 'indikator_fitur04s.tujuan',  'risk_registers.pernyataan_risiko', 'risk_registers.pengendalian_risiko as rencana','risk_registers.pengendalian_risiko as realisasi',DB::raw("'-' AS 'belumtertangani'"),DB::raw("'-' AS 'usulan'"), DB::raw("'-' AS 'rencana2'"),DB::raw("'-' AS 'realisasi2'"),'pics.name as pic_name')
        // ->where('tipe_id', 1)
        ->where($whosLogin);

        

        $this->data = $query->get();
        return $query;
    }
    public function title(): string
    {
        return 'PEMANTAUAN PENGENDALIAN';
    }
    public function headings(): array
    {
        return [
            ['No', 'Kegiatan', 'Sasaran', 'Risiko Prioritas','Penanganan','Penanganan', 'Penanganan', 'Usulan Perbaikan', 'Waktu Pemantauan', 'Waktu Pemantauan', 'Penanggungjawab Pemantauan'],

            ['No', 'Kegiatan', 'Sasaran', 'Risiko Prioritas','Rencana','Realisasi', 'Yang belum tertangani', 'Usulan Perbaikan', 'Rencana', 'Realisasi', 'Penanggungjawab Pemantauan'],
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
                            'argb' => 'FFFFFFFF',
                        ],
                        'endColor' => [
                            'argb' => 'FFFFFFFF',
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
                $event->sheet->getDelegate()->mergeCells('A1:A2');
                $event->sheet->getDelegate()->getStyle('A1:A2')->applyFromArray($styleHeader3);
                $event->sheet->getDelegate()->mergeCells('B1:B2');
                $event->sheet->getDelegate()->getStyle('B1:B2')->applyFromArray($styleHeader3);
                $event->sheet->getDelegate()->mergeCells('C1:C2');
                $event->sheet->getDelegate()->getStyle('C1:C2')->applyFromArray($styleHeader3);
                $event->sheet->getDelegate()->mergeCells('D1:D2');
                $event->sheet->getDelegate()->getStyle('D1:D2')->applyFromArray($styleHeader3);

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
class Sheet8 implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithTitle
{
    /**
     * @return \Illuminate\Support\Collection
     */
    protected $data;
    public function query()
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $query = RiskRegister::query()
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
        ->select( 'risk_registers.pernyataan_risiko', 'risk_registers.pengendalian_risiko as aksi',DB::raw("'-' AS 'output'"),DB::raw("'-' AS 'target'"),'risk_registers.pengendalian_risiko as realisasi', DB::raw("'-' AS 'waktu'"),'pics.name as pic_name', DB::raw("'-' AS 'tren'"), DB::raw("'-' AS 'level'"))
        // ->where('tipe_id', 1)
        ->where($whosLogin);

        

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
            ['Prioritas Risiko','Penanganan Risiko','Penanganan Risiko', 'Penanganan Risiko','Penanganan Risiko','Penanganan Risiko', 'Penanganan Risiko', 'Status Risiko', 'Status Risiko'],

            ['Prioritas Risiko','Aksi pengendalian','Output', 'Target','Realisasi','Waktu Implementasi', 'Penanggung jawab', 'Trend (naik/ turun)', 'Level Risiko'],
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
            'F' => 10,
            'G' => 10,
            'H' => 10,
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
                            'argb' => 'FFFFFFFF',
                        ],
                        'endColor' => [
                            'argb' => 'FFFFFFFF',
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
                $event->sheet->getDelegate()->mergeCells('A1:A2');
                $event->sheet->getDelegate()->getStyle('A1:A2')->applyFromArray($styleHeader3);

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

