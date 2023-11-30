<?php

namespace App\Exports;

use App\Models\IKP\IkpPasien;
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


class FormatIKPDataEvaluasiExport implements WithMultipleSheets
{
    protected $startDate;
    protected $endDate;
    protected $userId;

    public function __construct($startDate, $endDate, $userId)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->userId = $userId;
    }
    public function sheets(): array
    {
        return [
            new Sheet1($this->startDate, $this->endDate, $this->userId),
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

    public function __construct($startDate, $endDate, $userId)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->userId = $userId;
    }
    public function query()
    {
        $whosLogin = auth()->user()->can('lihat semua data ikp') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];

        $query = IkpPasien::query()
            ->leftjoin('risk_gradings', 'risk_gradings.kode', 'ikp_pasiens.concatdp')
            ->leftjoin('ikp_jenis_insidens', 'ikp_jenis_insidens.id', 'ikp_pasiens.ikp_jenis_insiden_id')
            ->leftjoin('ikp_tipe_insidens', 'ikp_tipe_insidens.id', 'ikp_pasiens.ikp_tipe_insiden_id')
            ->leftjoin('pics', 'pics.id', 'ikp_pasiens.pic_id')
            ->join('ikp_hasils', 'ikp_hasils.ikp_pasien_id', 'ikp_pasiens.id')
            ->select(
                DB::raw('row_number() OVER (ORDER BY ikp_pasiens.ikp_dampak_id * ikp_pasiens.ikp_probabilitas_id DESC) AS `row_number`'),
                DB::raw('DATE_FORMAT(ikp_pasiens.created_at, "%d-%m-%Y") as formatted'),
                'ikp_pasiens.lokasi_name',
                'ikp_jenis_insidens.name',
                'ikp_hasils.rekomendasi',
                'pics.name as pj',
            )
            ->where($whosLogin)
            ->orderBy('row_number', 'ASC');
        if (!empty($this->startDate) && !empty($this->endDate)) {
            $query->where('ikp_pasiens.created_at', '>=', $this->startDate)
                ->where('ikp_pasiens.created_at', '<=', Carbon::parse($this->endDate)->addDay());
        }
        if (!empty($this->userId) && auth()->user()->can('lihat semua data ikp')) {
            $userIds = !empty($this->userId) ? array_map('intval', explode(',', $this->userId)) : [];
            $query->whereIn('ikp_pasiens.user_id', $userIds);
        }


        $this->data = $query->get();
        return $query;
    }
    public function title(): string
    {
        return 'Data Evaluasi';
    }
    public function headings(): array
    {
        return [
            ['No', 'Hari/Tanggal', 'Ruangan/Instalasi', 'Insiden', 'Rekomendasi', 'Unit Terkait', 'Tindak Lanjut', 'Tindak Lanjut', 'Tindak Lanjut'],
            ['No', 'Hari/Tanggal', 'Ruangan/Instalasi', 'Insiden', 'Rekomendasi', 'Unit Terkait', 'Sudah', 'Belum', 'Tindak Lanjut'],
            ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        ];
    }
    public function columnWidths(): array
    {
        return [
            'A' => 4,
            'B' => 12,
            'C' => 17,
            'D' => 20,
            'E' => 40,
            'F' => 40,
            'G' => 20,
            'H' => 17,
            'I' => 40,
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
                $rangeH = 'H3:' . 'H' . $highestRow;
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
                $conditional->setText('Ekstrim');
                $conditional->getStyle()->applyFromArray($styleST);
                $conditionalStyles = $event->sheet->getStyle($rangeH)->getConditionalStyles();
                $conditionalStyles[] = $conditional;
                $event->sheet->getStyle($rangeH)->setConditionalStyles($conditionalStyles);

                $conditional2 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional2->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional2->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional2->addCondition(9);
                $conditional2->setText('Tinggi');
                $conditional2->getStyle()->applyFromArray($styleM);
                $conditional2Styles = $event->sheet->getStyle($rangeH)->getConditionalStyles();
                $conditional2Styles[] = $conditional2;
                $event->sheet->getStyle($rangeH)->setConditionalStyles($conditional2Styles);

                $conditional3 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional3->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional3->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional3->addCondition(4);
                $conditional3->setText('Moderat');
                $conditional3->getStyle()->applyFromArray($styleSR);
                $conditional3Styles = $event->sheet->getStyle($rangeH)->getConditionalStyles();
                $conditional3Styles[] = $conditional3;
                $event->sheet->getStyle($rangeH)->setConditionalStyles($conditional3Styles);

                $conditional5 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $conditional5->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                $conditional5->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                $conditional5->setText('Rendah');
                $conditional5->getStyle()->applyFromArray($styleR);
                $conditional5Styles = $event->sheet->getStyle($rangeH)->getConditionalStyles();
                $conditional5Styles[] = $conditional5;
                $event->sheet->getStyle($rangeH)->setConditionalStyles($conditional5Styles);

                // $conditional4 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                // $conditional4->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CONTAINSTEXT);
                // $conditional4->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_CONTAINSTEXT);
                // $conditional4->setText('RENDAH');
                // $conditional4->getStyle()->applyFromArray($styleR);
                // $conditional4Styles = $event->sheet->getStyle($rangeH)->getConditionalStyles();
                // $conditional4Styles[] = $conditional4;
                // $event->sheet->getStyle($rangeH)->setConditionalStyles($conditional4Styles);

                $event->sheet->getDelegate()->getStyle('A3:I3')->applyFromArray($styleHeader2);
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
                $event->sheet->getDelegate()->mergeCells('G1:H1');
                $event->sheet->getDelegate()->getStyle('G1:H2')->applyFromArray($styleHeader);
                $event->sheet->getDelegate()->mergeCells('I1:I2');
                $event->sheet->getDelegate()->getStyle('I1:I2')->applyFromArray($styleHeader);

            },
        ];
    }
}

