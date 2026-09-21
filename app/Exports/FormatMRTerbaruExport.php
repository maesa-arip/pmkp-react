<?php

namespace App\Exports;

use App\Models\RiskGrading;
use App\Models\RiskRegister;
use App\Services\RegisterHierarchyResolver;
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
use PhpOffice\PhpSpreadsheet\Chart\Axis as ChartAxis;
use PhpOffice\PhpSpreadsheet\Chart\Chart;
use PhpOffice\PhpSpreadsheet\Chart\ChartColor;
use PhpOffice\PhpSpreadsheet\Chart\DataSeries;
use PhpOffice\PhpSpreadsheet\Chart\DataSeriesValues;
use PhpOffice\PhpSpreadsheet\Chart\Legend as ChartLegend;
use PhpOffice\PhpSpreadsheet\Chart\PlotArea;
use PhpOffice\PhpSpreadsheet\Chart\Properties;
use PhpOffice\PhpSpreadsheet\Chart\Title;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

/**
 * "FORMAT LAPORAN MR TERBARU KLINIS DAN NON KLINIS" (docs/).
 *
 * The template serves both register types, so one class carries the sheets and the
 * caller passes tipe_id: 1 klinis, 2 non klinis. Grading labels reuse the existing
 * export_lars_dhp_klinis / export_lars_dhp_nonklinis settings, no new setting key.
 */
class FormatMRTerbaruExport implements WithMultipleSheets
{
    protected $startDate;

    protected $endDate;

    protected $userId;

    protected $currently_id;

    protected $tipeId;

    public function __construct($startDate, $endDate, $userId, $currently_id, $tipeId)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->userId = $userId;
        $this->currently_id = $currently_id;
        $this->tipeId = (int) $tipeId;
    }

    public function sheets(): array
    {
        $arguments = [$this->startDate, $this->endDate, $this->userId, $this->currently_id, $this->tipeId];

        return [
            new MRTerbaruPenetapanKonteks(...$arguments),
            new MRTerbaruIdentifikasiRisiko(...$arguments),
            new MRTerbaruAnalisaRisiko(...$arguments),
            new MRTerbaruProfilRisiko(...$arguments),
            new MRTerbaruRencanaTindakPengendalian(...$arguments),
            new MRTerbaruPemantauanRtp(...$arguments),
            new MRTerbaruRiskRegister(...$arguments),
            new MRTerbaruFgdInherent(...$arguments),
            new MRTerbaruFgdResidual(...$arguments),
            new MRTerbaruFgdAktual(...$arguments),
            new MRTerbaruFgdTreated(...$arguments),
            new MRTerbaruEskalasiTw1(...$arguments),
            new MRTerbaruEskalasiTw2(...$arguments),
            new MRTerbaruEskalasiTw3(...$arguments),
            new MRTerbaruEskalasiTw4(...$arguments),
            new MRTerbaruPetaPanas(...$arguments),
            new MRTerbaruTrend(...$arguments),
        ];
    }
}

/**
 * Shared filters, joins and styling for the MR Terbaru sheets. Every sheet keeps the
 * same period / unit / kejadian scoping as the LARS DHP exports so the two reports
 * cannot disagree about which registers belong to a year.
 */
abstract class MRTerbaruSheet
{
    /** concatdp1 codes the existing exports treat as "Risiko Prioritas". */
    public const PRIORITAS_CONCATDP = [15, 23, 24, 25, 32, 33, 34, 35, 42, 43, 44, 45, 51, 52, 53, 54, 55];

    /** Grading labels that count as an escalation, across the klinis and pergub wordings. */
    public const EKSTREM_LABELS = ['EXTREME', 'EKSTRIM', 'EKSTREM', 'SANGAT TINGGI'];

    protected $data;

    protected $startDate;

    protected $endDate;

    protected $userId;

    protected $currently_id;

    protected $tipeId;

    public function __construct($startDate, $endDate, $userId, $currently_id, $tipeId)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->userId = $userId;
        $this->currently_id = $currently_id;
        $this->tipeId = (int) $tipeId;
    }

    protected function gradingKey(): string
    {
        return $this->tipeId === 1 ? 'export_lars_dhp_klinis' : 'export_lars_dhp_nonklinis';
    }

    protected function gradingDefault(): string
    {
        return $this->tipeId === 1 ? 'klinis' : 'nonklinis_pergub';
    }

    protected function gradingSelect(string $alias, string $as): string
    {
        return RiskGrading::selectNameCaseSql($alias, $this->gradingKey(), $this->gradingDefault(), $as);
    }

    protected function baseQuery()
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register')
            ? [['user_id', '<>', 0]]
            : [['user_id', auth()->user()->id]];

        $query = RiskRegister::query()
            ->leftJoin('users', 'users.id', 'risk_registers.user_id')
            ->where('risk_registers.tipe_id', $this->tipeId)
            ->where($whosLogin);

        // Hierarchy follows the register's own year, not the master's legacy
        // parent; aliases match the table names so every select stays valid.
        return RegisterHierarchyResolver::join($query);
    }

    protected function applyFilters($query)
    {
        if (! empty($this->startDate) && ! empty($this->endDate)) {
            $query->where('risk_registers.tgl_register', '>=', $this->startDate)
                ->where('risk_registers.tgl_register', '<=', Carbon::parse($this->endDate)->addDay(1));
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

    /** row_number over the inherent score, the ordering every other export already uses. */
    protected function peringkatSql(): string
    {
        return 'row_number() OVER (ORDER BY risk_registers.osd1_dampak * risk_registers.osd1_probabilitas * risk_registers.osd1_controllability DESC) AS `Peringkat`';
    }

    protected function ranked($subquery, array $columns)
    {
        return DB::query()
            ->select(array_merge(['Peringkat'], $columns))
            ->fromSub($subquery, 'sub')
            ->orderBy('sub.Peringkat', 'ASC');
    }

    /**
     * Borders, wrapped text and a shaded header block. $headerRows lists the sheet rows
     * that carry headings, $merges the ranges to merge across them.
     */
    protected function decorate(AfterSheet $event, array $headerRows, array $merges = [], string $fill = 'D9E1F2')
    {
        $sheet = $event->sheet->getDelegate();
        $highestRow = $sheet->getHighestRow();
        $highestColumn = $sheet->getHighestColumn();
        $range = 'A1:'.$highestColumn.$highestRow;
        $sheet->getStyle($range)->getAlignment()->setWrapText(true);
        $sheet->getStyle($range)->applyFromArray([
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => '000000']]],
            'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
        ]);
        $sheet->getStyle('A1:A'.$highestRow)->applyFromArray([
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
        ]);
        $styleHeader = [
            'font' => ['bold' => true, 'size' => 11],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
            'borders' => ['outline' => ['borderStyle' => Border::BORDER_THIN]],
            'fill' => [
                'fillType' => Fill::FILL_GRADIENT_LINEAR,
                'rotation' => 90,
                'startColor' => ['argb' => $fill],
                'endColor' => ['argb' => $fill],
            ],
        ];
        foreach ($headerRows as $row) {
            $sheet->getRowDimension($row)->setRowHeight(30);
            $sheet->getStyle('A'.$row.':'.$highestColumn.$row)->applyFromArray($styleHeader);
        }
        foreach ($merges as $merge) {
            $sheet->mergeCells($merge);
        }
    }
}

/** Sheet "1. Penetapan Konteks". */
class MRTerbaruPenetapanKonteks extends MRTerbaruSheet implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithTitle
{
    public function query()
    {
        $subquery = $this->baseQuery()->selectRaw(
            $this->peringkatSql().', '.
            'sasaran_strategis.name as sasaran_strategis, '.
            'indikator_fitur1s.name as iku, '.
            'indikator_fitur2s.name as program, '.
            'indikator_fitur3s.name as kegiatan, '.
            'indikator_fitur3s.tujuan as tujuan, '.
            'indikator_fitur4s.name as indikator_unit, '.
            'users.name as pemilik_name, '.
            'risk_registers.kode_risiko'
        );
        $this->applyFilters($subquery);
        $query = $this->ranked($subquery, ['sasaran_strategis', 'iku', 'program', 'kegiatan', 'tujuan', 'indikator_unit', 'pemilik_name', 'kode_risiko']);
        $this->data = $query->get();

        return $query;
    }

    public function title(): string
    {
        return '1. Penetapan Konteks';
    }

    public function headings(): array
    {
        return [
            ['No', 'Sasaran Strategis', 'Indikator Kinerja Utama', 'Program', "Nama Kegiatan\n (Proses Bisnis)", 'Tujuan Kegiatan', 'Indikator Unit', 'Pemilik Risiko', 'Kode Risiko'],
        ];
    }

    public function columnWidths(): array
    {
        return ['A' => 4, 'B' => 45, 'C' => 45, 'D' => 45, 'E' => 45, 'F' => 45, 'G' => 45, 'H' => 30, 'I' => 20];
    }

    public function registerEvents(): array
    {
        return [AfterSheet::class => function (AfterSheet $event) {
            $this->decorate($event, [1]);
        }];
    }
}

/** Sheet "2. Identifikasi Risiko". */
class MRTerbaruIdentifikasiRisiko extends MRTerbaruSheet implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithTitle
{
    public function query()
    {
        $subquery = $this->baseQuery()
            ->leftJoin('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
            ->leftJoin('identification_sources', 'identification_sources.id', 'risk_registers.identification_source_id')
            ->selectRaw(
                $this->peringkatSql().', '.
                'indikator_fitur3s.name as kegiatan, '.
                'indikator_fitur3s.tujuan as tujuan, '.
                'indikator_fitur4s.name as indikator_unit, '.
                'risk_registers.sebab, '.
                'risk_registers.resiko, '.
                'risk_registers.dampak, '.
                'risk_registers.pernyataan_risiko, '.
                'risk_registers.kode_risiko, '.
                'risk_categories.name as kategori_risiko, '.
                'risk_registers.c_uc, '.
                'identification_sources.name as sumber_risiko, '.
                'risk_registers.pihak_terkena, '.
                'users.name as pemilik_name'
            );
        $this->applyFilters($subquery);
        $query = $this->ranked($subquery, [
            'kegiatan', 'tujuan', 'indikator_unit', 'sebab', 'resiko', 'dampak', 'pernyataan_risiko',
            'kode_risiko', 'kategori_risiko', 'c_uc', 'sumber_risiko', 'pihak_terkena', 'pemilik_name',
        ]);
        $this->data = $query->get();

        return $query;
    }

    public function title(): string
    {
        return '2. Identifikasi Risiko';
    }

    public function headings(): array
    {
        return [
            ['No', 'Nama Kegiatan (Proses Bisnis)', 'Tujuan Kegiatan', 'Indikator Unit', 'Identifikasi Risiko', '', '', '', 'Kode Risiko', 'Kategori Risiko', 'C/UC', 'Sumber Risiko', 'Pihak Yang Terkena Dampak', 'Pemilik Risiko'],
            ['', '', '', '', 'Sebab', 'Risiko', 'Dampak', 'Pernyataan Risiko', '', '', '', '', '', ''],
        ];
    }

    public function columnWidths(): array
    {
        return ['A' => 4, 'B' => 45, 'C' => 45, 'D' => 45, 'E' => 45, 'F' => 45, 'G' => 45, 'H' => 65, 'I' => 20, 'J' => 25, 'K' => 10, 'L' => 25, 'M' => 30, 'N' => 30];
    }

    public function registerEvents(): array
    {
        return [AfterSheet::class => function (AfterSheet $event) {
            $this->decorate($event, [1, 2], [
                'A1:A2', 'B1:B2', 'C1:C2', 'D1:D2', 'E1:H1', 'I1:I2', 'J1:J2', 'K1:K2', 'L1:L2', 'M1:M2', 'N1:N2',
            ]);
        }];
    }
}

/** Sheet "3. analisa risiko". */
class MRTerbaruAnalisaRisiko extends MRTerbaruSheet implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithTitle
{
    public function query()
    {
        $subquery = $this->baseQuery()
            ->leftJoin('efektifs', 'efektifs.id', 'risk_registers.efektif_id');
        RiskGrading::joinByRiskRegisterYear($subquery, 'risk_gradings', 'risk_registers.concatdp1');
        $subquery->selectRaw(
            $this->peringkatSql().', '.
            'risk_registers.pernyataan_risiko, '.
            'risk_registers.kode_risiko, '.
            'risk_registers.osd1_dampak, '.
            'risk_registers.osd1_probabilitas, '.
            // The level in the next column is graded on dampak x probabilitas, so the score
            // beside it is that product; the controllability-weighted score is "Nilai skor"
            // on the profil risiko sheet.
            'risk_registers.osd1_dampak * risk_registers.osd1_probabilitas as skor_risiko, '.
            $this->gradingSelect('risk_gradings', 'grading_name').', '.
            'risk_registers.pengendalian_risiko, '.
            'efektifs.name as efektif, '.
            'risk_registers.pengendalian_harus_ada, '.
            'users.name as pemilik_name'
        );
        $this->applyFilters($subquery);
        $query = $this->ranked($subquery, [
            'pernyataan_risiko', 'kode_risiko', 'osd1_dampak', 'osd1_probabilitas', 'skor_risiko',
            'grading_name', 'pengendalian_risiko', 'efektif', 'pengendalian_harus_ada', 'pemilik_name',
        ]);
        $this->data = $query->get();

        return $query;
    }

    public function title(): string
    {
        return '3. analisa risiko';
    }

    public function headings(): array
    {
        return [
            ['No', 'Pernyataan risiko', 'Kode Risiko', 'Inherent Risiko', '', '', '', 'Pengendalian yang sudah ada', '', '', 'Pemilik Risiko'],
            ['', '', '', 'Skor Dampak', 'Skor Probabilitas', "Skor\n Risiko", 'Peringkat / Level Risiko', 'Pengendalian yang sudah ada', 'Upaya Pengendalian Efektif? (Ya/Tidak)', 'Pengendalian yang harus ada', ''],
        ];
    }

    public function columnWidths(): array
    {
        return ['A' => 4, 'B' => 65, 'C' => 20, 'D' => 12, 'E' => 15, 'F' => 12, 'G' => 20, 'H' => 45, 'I' => 20, 'J' => 45, 'K' => 30];
    }

    public function registerEvents(): array
    {
        return [AfterSheet::class => function (AfterSheet $event) {
            $this->decorate($event, [1, 2], ['A1:A2', 'B1:B2', 'C1:C2', 'D1:G1', 'H1:J1', 'K1:K2']);
        }];
    }
}

/** Sheet "4. profil risiko". */
class MRTerbaruProfilRisiko extends MRTerbaruSheet implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithTitle
{
    public function query()
    {
        $subquery = $this->baseQuery();
        RiskGrading::joinByRiskRegisterYear($subquery, 'risk_gradings', 'risk_registers.concatdp1');
        $subquery->selectRaw(
            $this->peringkatSql().', '.
            'risk_registers.pernyataan_risiko, '.
            'risk_registers.kode_risiko, '.
            'risk_registers.osd1_dampak, '.
            'risk_registers.osd1_probabilitas, '.
            'risk_registers.osd1_dampak * risk_registers.osd1_probabilitas as skor_risiko, '.
            $this->gradingSelect('risk_gradings', 'grading_name').', '.
            'risk_registers.osd1_controllability, '.
            'risk_registers.osd1_inherent as nilai_skor, '.
            'users.name as pemilik_name'
        );
        $this->applyFilters($subquery);
        $query = DB::query()
            ->select([
                'Peringkat', 'pernyataan_risiko', 'kode_risiko', 'osd1_dampak', 'osd1_probabilitas', 'skor_risiko',
                'grading_name', 'osd1_controllability', 'nilai_skor', 'Peringkat as rangking', 'pemilik_name',
            ])
            ->fromSub($subquery, 'sub')
            ->orderBy('sub.Peringkat', 'ASC');
        $this->data = $query->get();

        return $query;
    }

    public function title(): string
    {
        return '4. profil risiko';
    }

    public function headings(): array
    {
        return [
            ['No', 'Pernyataan risiko', 'Kode Risiko', 'Inherent Risiko', '', '', '', 'Skor Controllability', 'Nilai skor', 'Rangking', 'Pemilik Risiko'],
            ['', '', '', 'Skor Dampak', 'Skor Probabilitas', "Skor\n Risiko", 'Peringkat/Level Risiko', '', '', '', ''],
        ];
    }

    public function columnWidths(): array
    {
        return ['A' => 4, 'B' => 65, 'C' => 20, 'D' => 12, 'E' => 15, 'F' => 12, 'G' => 20, 'H' => 18, 'I' => 12, 'J' => 12, 'K' => 30];
    }

    public function registerEvents(): array
    {
        return [AfterSheet::class => function (AfterSheet $event) {
            $this->decorate($event, [1, 2], ['A1:A2', 'B1:B2', 'C1:C2', 'D1:G1', 'H1:H2', 'I1:I2', 'J1:J2', 'K1:K2']);
        }];
    }
}

/** Sheet "5. rencana tindak pengendalian". */
class MRTerbaruRencanaTindakPengendalian extends MRTerbaruSheet implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithTitle
{
    public function query()
    {
        $subquery = $this->baseQuery()
            ->leftJoin('efektifs', 'efektifs.id', 'risk_registers.efektif_id')
            ->leftJoin('waktu_pengendalians', 'waktu_pengendalians.id', 'risk_registers.waktu_pengendalian_id')
            ->leftJoin('jenis_pengendalians', 'jenis_pengendalians.id', 'risk_registers.jenis_pengendalian_id')
            ->leftJoin('opsi_pengendalians', 'opsi_pengendalians.id', 'risk_registers.opsi_pengendalian_id')
            ->selectRaw(
                $this->peringkatSql().', '.
                'risk_registers.pernyataan_risiko, '.
                'risk_registers.kode_risiko, '.
                'risk_registers.pengendalian_risiko, '.
                'efektifs.name as efektif, '.
                'risk_registers.pengendalian_harus_ada, '.
                'risk_registers.celah_pengendalian, '.
                'risk_registers.rencana_pengendalian as kegiatan_rtp, '.
                'waktu_pengendalians.name as waktu_rtp, '.
                'jenis_pengendalians.name as jenis_rtp, '.
                'opsi_pengendalians.name as opsi, '.
                'risk_registers.penanganan_risiko as uraian, '.
                'risk_registers.media_pengkomunikasian, '.
                'risk_registers.penyedia_informasi, '.
                'risk_registers.penerima_informasi, '.
                'users.name as pemilik_name'
            );
        $this->applyFilters($subquery);
        $query = $this->ranked($subquery, [
            'pernyataan_risiko', 'kode_risiko', 'pengendalian_risiko', 'efektif', 'pengendalian_harus_ada',
            'celah_pengendalian', 'kegiatan_rtp', 'waktu_rtp', 'jenis_rtp', 'opsi', 'uraian',
            'media_pengkomunikasian', 'penyedia_informasi', 'penerima_informasi', 'pemilik_name',
        ]);
        $this->data = $query->get();

        return $query;
    }

    public function title(): string
    {
        return '5. rencana tindak pengendalian';
    }

    public function headings(): array
    {
        return [
            ['No', 'Pernyataan Risiko (Prioritas)', 'Kode Risiko', 'Pengendalian yang sudah ada', '', '', 'Celah Pengendalian', 'Rencana Tindak Pengendalian', '', '', 'Alternatif Teknik Penanganan Risiko', '', "Media/\n Sarana Pengkomunikasian", 'Penyedia Informasi', 'Penerima Informasi', 'Pemilik Risiko'],
            ['', '', '', 'Pengendalian yang sudah ada', 'Upaya Pengendalian Efektif ? (Ya/Tidak)', 'Pengendalian yang harus ada', '', 'Kegiatan', 'Waktu', 'Jenis (Detektif (D), Preventif (P), Korektif (K))', 'Opsi Teknik Penanganan Risiko', 'Uraian Penanganan Risiko', '', '', '', ''],
        ];
    }

    public function columnWidths(): array
    {
        return ['A' => 4, 'B' => 65, 'C' => 20, 'D' => 45, 'E' => 20, 'F' => 45, 'G' => 45, 'H' => 45, 'I' => 15, 'J' => 20, 'K' => 25, 'L' => 45, 'M' => 30, 'N' => 25, 'O' => 25, 'P' => 30];
    }

    public function registerEvents(): array
    {
        return [AfterSheet::class => function (AfterSheet $event) {
            $this->decorate($event, [1, 2], [
                'A1:A2', 'B1:B2', 'C1:C2', 'D1:F1', 'G1:G2', 'H1:J1', 'K1:L1', 'M1:M2', 'N1:N2', 'O1:O2', 'P1:P2',
            ]);
        }];
    }
}

/** Sheet "6. pemantauan RTP risiko". */
class MRTerbaruPemantauanRtp extends MRTerbaruSheet implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithTitle
{
    public function query()
    {
        $subquery = $this->baseQuery()
            ->leftJoin('waktu_implementasis', 'waktu_implementasis.id', 'risk_registers.waktu_implementasi_id')
            ->leftJoin('request_updates', 'request_updates.risk_register_id', 'risk_registers.id')
            ->leftJoin('verification_admins', 'verification_admins.request_update_id', 'request_updates.id')
            ->leftJoin('verification_management', 'verification_management.request_update_id', 'request_updates.id')
            // Supervisi dari tombol Supervisi di register (per risk_register); verifikasi
            // berjalan lewat request_updates dipakai sebagai cadangan untuk data lama.
            ->leftJoin('verification_priority_admins', 'verification_priority_admins.risk_register_id', 'risk_registers.id')
            ->leftJoin('verification_priority_management', 'verification_priority_management.risk_register_id', 'risk_registers.id')
            ->selectRaw(
                $this->peringkatSql().', '.
                'risk_registers.pernyataan_risiko, '.
                'risk_registers.kode_risiko, '.
                'risk_registers.pengendalian_harus_ada, '.
                'risk_registers.rencana_pengendalian as kegiatan_rtp, '.
                'risk_registers.penanganan_risiko as uraian, '.
                'risk_registers.belum_tertangani, '.
                'risk_registers.usulan_perbaikan, '.
                'waktu_implementasis.name as waktu_pemantauan, '.
                'CASE risk_registers.osd2_pengendalian_dilakukan WHEN 1 THEN "Ya" WHEN 0 THEN "Tidak" ELSE "" END as sudah_dilaksanakan, '.
                'CASE risk_registers.osd2_pengendalian_efektif WHEN 1 THEN "Ya" WHEN 0 THEN "Tidak" ELSE "" END as pengendalian_efektif, '.
                'risk_registers.output, '.
                'risk_registers.kendala as hambatan, '.
                'users.name as pemilik_name, '.
                'COALESCE(verification_priority_admins.keterangan, verification_admins.keterangan) as supervisi_admin, '.
                'DATE_FORMAT(COALESCE(verification_priority_admins.created_at, verification_admins.created_at), "%d-%m-%Y") as tgl_supervisi_admin, '.
                'COALESCE(verification_priority_management.keterangan, verification_management.keterangan) as supervisi_manajemen, '.
                'DATE_FORMAT(COALESCE(verification_priority_management.created_at, verification_management.created_at), "%d-%m-%Y") as tgl_supervisi_manajemen'
            );
        $this->applyFilters($subquery);
        $query = $this->ranked($subquery, [
            'pernyataan_risiko', 'kode_risiko', 'pengendalian_harus_ada', 'kegiatan_rtp', 'uraian',
            'belum_tertangani', 'usulan_perbaikan', 'waktu_pemantauan', 'sudah_dilaksanakan',
            'pengendalian_efektif', 'output', 'hambatan', 'pemilik_name',
            'supervisi_admin', 'tgl_supervisi_admin', 'supervisi_manajemen', 'tgl_supervisi_manajemen',
        ]);
        $this->data = $query->get();

        return $query;
    }

    public function title(): string
    {
        return '6. pemantauan RTP risiko';
    }

    public function headings(): array
    {
        return [
            ['No', 'Pernyataan Risiko (Prioritas)', 'Kode Risiko', 'Rencana Tindak Pengendalian', '', '', '', '', '', 'Upaya Pengendalian Sudah Dilaksanakan ? (Ya/Tidak)', 'Upaya Pengendalian Efektif? (Ya/Tidak)', 'Output', 'Hambatan', 'Pemilik Risiko', 'Supervisi Admin Risiko', '', 'Supervisi Level Manajemen', ''],
            ['', '', '', 'Pengendalian yang harus ada', 'Kegiatan Rencana Pengendalian', 'Uraian Penanganan Risiko', 'Yang Belum Tertangani', 'Usulan Perbaikan', 'Waktu Pemantauan', '', '', '', '', '', 'Keterangan', 'Tanggal Supervisi', 'Keterangan', 'Tanggal Supervisi'],
        ];
    }

    public function columnWidths(): array
    {
        return ['A' => 4, 'B' => 65, 'C' => 20, 'D' => 45, 'E' => 45, 'F' => 45, 'G' => 30, 'H' => 30, 'I' => 20, 'J' => 20, 'K' => 20, 'L' => 25, 'M' => 25, 'N' => 30, 'O' => 35, 'P' => 18, 'Q' => 35, 'R' => 18];
    }

    public function registerEvents(): array
    {
        return [AfterSheet::class => function (AfterSheet $event) {
            $this->decorate($event, [1, 2], [
                'A1:A2', 'B1:B2', 'C1:C2', 'D1:I1', 'J1:J2', 'K1:K2', 'L1:L2', 'M1:M2', 'N1:N2', 'O1:P1', 'Q1:R1',
            ]);
        }];
    }
}

/** Sheet "7. risk register". */
class MRTerbaruRiskRegister extends MRTerbaruSheet implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithTitle
{
    public function query()
    {
        $subquery = $this->baseQuery()
            ->leftJoin('opsi_pengendalians', 'opsi_pengendalians.id', 'risk_registers.opsi_pengendalian_id')
            ->leftJoin('pembiayaan_risikos', 'pembiayaan_risikos.id', 'risk_registers.pembiayaan_risiko_id');
        RiskGrading::joinByRiskRegisterYear($subquery, 'risk_gradings', 'risk_registers.concatdp1');
        RiskGrading::joinByRiskRegisterYear($subquery, 'grading2', 'risk_registers.concatdp2');
        $subquery->selectRaw(
            $this->peringkatSql().', '.
            'DATE_FORMAT(risk_registers.tgl_register, "%d-%m-%Y") as tgl_register, '.
            'sasaran_strategis.name as sasaran_strategis, '.
            'indikator_fitur1s.name as iku, '.
            'indikator_fitur2s.name as program, '.
            'indikator_fitur3s.name as kegiatan, '.
            'indikator_fitur3s.tujuan as tujuan, '.
            'indikator_fitur4s.name as indikator_unit, '.
            'risk_registers.pernyataan_risiko, '.
            'risk_registers.kode_risiko, '.
            'risk_registers.osd1_dampak, '.
            'risk_registers.osd1_probabilitas, '.
            'risk_registers.osd1_dampak * risk_registers.osd1_probabilitas as skor_inherent, '.
            $this->gradingSelect('risk_gradings', 'grading_name').', '.
            'risk_registers.pengendalian_risiko, '.
            'CASE risk_registers.perlu_penanganan_id WHEN 1 THEN "Ya" WHEN 2 THEN "Tidak" ELSE "" END as perlu_penanganan, '.
            'risk_registers.penanganan_risiko as uraian, '.
            'opsi_pengendalians.name as opsi, '.
            'pembiayaan_risikos.name as pembiayaan, '.
            'CONCAT(risk_registers.target_waktu, " Hari") as target_waktu, '.
            'risk_registers.osd2_dampak, '.
            'risk_registers.osd2_probabilitas, '.
            'risk_registers.osd2_dampak * risk_registers.osd2_probabilitas as skor_residual, '.
            $this->gradingSelect('grading2', 'grading2_name').', '.
            'users.name as pemilik_name'
        );
        $this->applyFilters($subquery);
        $query = $this->ranked($subquery, [
            'tgl_register', 'sasaran_strategis', 'iku', 'program', 'kegiatan', 'tujuan', 'indikator_unit',
            'pernyataan_risiko', 'kode_risiko', 'osd1_dampak', 'osd1_probabilitas', 'skor_inherent', 'grading_name',
            'pengendalian_risiko', 'perlu_penanganan', 'uraian', 'opsi', 'pembiayaan', 'target_waktu',
            'osd2_dampak', 'osd2_probabilitas', 'skor_residual', 'grading2_name', 'pemilik_name',
        ]);
        $this->data = $query->get();

        return $query;
    }

    public function title(): string
    {
        return '7. risk register';
    }

    public function headings(): array
    {
        return [
            ['No', 'Tanggal Register', 'Sasaran Strategis', 'Indikator Kinerja Utama', 'Program', 'Nama Kegiatan (Proses Bisnis)', 'Tujuan Kegiatan', 'Indikator Unit', 'Pernyataan Risiko', 'Kode Risiko', 'Risiko Inherent', '', '', '', 'Pengendalian yang sudah ada', 'Evaluasi risiko', 'Alternatif Teknik Penanganan Risiko', '', '', 'Target Waktu', 'Risiko Residual', '', '', '', 'Pemilik Risiko'],
            ['', '', '', '', '', '', '', '', '', '', 'Skor Dampak', 'Skor Probabilitas', 'Skor Risiko', 'Peringkat Risiko', '', 'Apakah perlu penanganan (ya/Tidak)', 'Uraian Penanganan Risiko', 'Opsi Teknik Pengendalian Risiko', 'Pembiayaan Risiko', '', 'Skor Dampak', 'Skor Probabilitas', 'Skor Risiko', 'Peringkat Risiko', ''],
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 4, 'B' => 18, 'C' => 45, 'D' => 45, 'E' => 45, 'F' => 45, 'G' => 45, 'H' => 45, 'I' => 65,
            'J' => 20, 'K' => 12, 'L' => 15, 'M' => 12, 'N' => 20, 'O' => 45, 'P' => 20, 'Q' => 45, 'R' => 25,
            'S' => 20, 'T' => 15, 'U' => 12, 'V' => 15, 'W' => 12, 'X' => 20, 'Y' => 30,
        ];
    }

    public function registerEvents(): array
    {
        return [AfterSheet::class => function (AfterSheet $event) {
            $this->decorate($event, [1, 2], [
                'A1:A2', 'B1:B2', 'C1:C2', 'D1:D2', 'E1:E2', 'F1:F2', 'G1:G2', 'H1:H2', 'I1:I2', 'J1:J2',
                'K1:N1', 'O1:O2', 'Q1:S1', 'T1:T2', 'U1:X1', 'Y1:Y2',
            ]);
        }];
    }
}

/**
 * Sheets 8-11: the FGD respondent forms. The template starts the table below a banner
 * row, so the headings carry the blank rows that push the table down.
 */
abstract class MRTerbaruFgd extends MRTerbaruSheet implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithTitle
{
    /** Table name holding the eight respondent scores. */
    abstract protected function fgdTable(): string;

    /** osd prefix the modus is stored in (osd1 inherent, osd2 residual, osd3 treated, osd4 actual). */
    abstract protected function osdPrefix(): string;

    abstract protected function banner(): string;

    /** Blank heading rows between the banner and the table, per the template. */
    protected function blankRows(): int
    {
        return 2;
    }

    protected function headerRows(): array
    {
        return [2 + $this->blankRows(), 3 + $this->blankRows()];
    }

    public function query()
    {
        $table = $this->fgdTable();
        $osd = $this->osdPrefix();
        $columns = [];
        foreach (['dampak', 'probabilitas'] as $field) {
            for ($i = 1; $i <= 8; $i++) {
                $columns[] = $table.'.'.$field.'_responden'.$i;
            }
        }
        $subquery = $this->baseQuery()
            // Latest row only: a few registers carry more than one FGD row from before
            // the form switched to updateOrCreate, and a plain join would repeat them.
            ->leftJoin($table, function ($join) use ($table) {
                $join->on($table.'.risk_register_id', '=', 'risk_registers.id')
                    ->whereRaw($table.'.id = (SELECT MAX(latest.id) FROM '.$table.' latest WHERE latest.risk_register_id = risk_registers.id)');
            })
            ->selectRaw(
                $this->peringkatSql().', '.
                'risk_registers.pernyataan_risiko, '.
                'risk_registers.kode_risiko, '.
                implode(', ', $columns).', '.
                'risk_registers.'.$osd.'_dampak as modus_dampak, '.
                'risk_registers.'.$osd.'_probabilitas as modus_probabilitas, '.
                'users.name as pemilik_name'
            );
        $this->applyFilters($subquery);
        $plain = array_map(function ($column) {
            return substr($column, strpos($column, '.') + 1);
        }, $columns);
        $query = $this->ranked($subquery, array_merge(
            ['pernyataan_risiko', 'kode_risiko'],
            $plain,
            ['modus_dampak', 'modus_probabilitas', 'pemilik_name']
        ));
        $this->data = $query->get();

        return $query;
    }

    public function headings(): array
    {
        $responden = [];
        for ($i = 1; $i <= 8; $i++) {
            $responden[] = 'Responden '.$i;
        }
        $banner = array_merge([$this->banner()], array_fill(0, 21, ''));
        $blank = array_fill(0, 22, '');
        $first = array_merge(
            ['No', 'Pernyataan Risiko ', 'kode risiko ', 'Skor Dampak'],
            array_fill(0, 7, ''),
            ['Skor Probabilitas'],
            array_fill(0, 7, ''),
            ['Modus ', '', 'Pemilik Risiko']
        );
        $second = array_merge(['', '', ''], $responden, $responden, ['Skor Dampak', 'Skor Probabilitas', '']);

        $rows = [$banner];
        for ($i = 0; $i < $this->blankRows(); $i++) {
            $rows[] = $blank;
        }
        $rows[] = $first;
        $rows[] = $second;

        return $rows;
    }

    public function columnWidths(): array
    {
        $widths = ['A' => 4, 'B' => 65, 'C' => 20];
        foreach (range('D', 'S') as $column) {
            $widths[$column] = 13;
        }

        return $widths + ['T' => 15, 'U' => 15, 'V' => 30];
    }

    public function registerEvents(): array
    {
        return [AfterSheet::class => function (AfterSheet $event) {
            [$top, $bottom] = $this->headerRows();
            $this->decorate($event, [$top, $bottom], [
                'A1:V1',
                'A'.$top.':A'.$bottom,
                'B'.$top.':B'.$bottom,
                'C'.$top.':C'.$bottom,
                'D'.$top.':K'.$top,
                'L'.$top.':S'.$top,
                'T'.$top.':U'.$top,
                'V'.$top.':V'.$bottom,
            ], '9BC2E6');
            $event->sheet->getDelegate()->getStyle('A1')->applyFromArray([
                'font' => ['bold' => true, 'size' => 12],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
            ]);
        }];
    }
}

class MRTerbaruFgdInherent extends MRTerbaruFgd
{
    protected function fgdTable(): string
    {
        return 'fgd_inherents';
    }

    protected function osdPrefix(): string
    {
        return 'osd1';
    }

    protected function banner(): string
    {
        return 'FORMULIR FGD  INHERENT RISK';
    }

    public function title(): string
    {
        return '8. FGD Inherent';
    }
}

class MRTerbaruFgdResidual extends MRTerbaruFgd
{
    protected function fgdTable(): string
    {
        return 'fgd_residuals';
    }

    protected function osdPrefix(): string
    {
        return 'osd2';
    }

    protected function banner(): string
    {
        return 'FORMULIR FGD  RESIDUAL RISK';
    }

    public function title(): string
    {
        return '9. FGD Residual';
    }
}

class MRTerbaruFgdAktual extends MRTerbaruFgd
{
    protected function fgdTable(): string
    {
        return 'fgd_actuals';
    }

    protected function osdPrefix(): string
    {
        return 'osd4';
    }

    protected function banner(): string
    {
        return 'FORMULIR FGD AKTUAL RISK';
    }

    protected function blankRows(): int
    {
        return 3;
    }

    public function title(): string
    {
        return '10. FGD Aktual';
    }
}

class MRTerbaruFgdTreated extends MRTerbaruFgd
{
    protected function fgdTable(): string
    {
        return 'fgd_treateds';
    }

    protected function osdPrefix(): string
    {
        return 'osd3';
    }

    protected function banner(): string
    {
        return 'FORMULIR FGD SKOR DAMPAK DAN PROBABILITAS TREATED RISK';
    }

    protected function blankRows(): int
    {
        return 3;
    }

    public function title(): string
    {
        return '11. FGD Treated';
    }
}

/**
 * Sheets 12-15: the quarterly escalation lists. Only registers whose level reads as
 * extreme are listed, per the note in the template.
 */
abstract class MRTerbaruEskalasi extends MRTerbaruSheet implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithTitle
{
    /** 1..4 */
    abstract protected function quarter(): int;

    /** Quarter one reports the inherent score, later quarters the residual one. */
    protected function usesInherent(): bool
    {
        return $this->quarter() === 1;
    }

    public function query()
    {
        $stage = $this->usesInherent() ? 'osd1' : 'osd2';
        $concat = $this->usesInherent() ? 'concatdp1' : 'concatdp2';
        $subquery = $this->baseQuery();
        RiskGrading::joinByRiskRegisterYear($subquery, 'risk_gradings', 'risk_registers.'.$concat);
        $subquery->selectRaw(
            $this->peringkatSql().', '.
            'risk_registers.pernyataan_risiko, '.
            'risk_registers.kode_risiko, '.
            'risk_registers.rencana_pengendalian as kegiatan_rtp, '.
            'risk_registers.penanganan_risiko as uraian, '.
            'CONCAT(risk_registers.target_waktu, " Hari") as target_waktu, '.
            'risk_registers.'.$stage.'_dampak as dampak, '.
            'risk_registers.'.$stage.'_probabilitas as probabilitas, '.
            'risk_registers.'.$stage.'_dampak * risk_registers.'.$stage.'_probabilitas as skor_risiko, '.
            $this->gradingSelect('risk_gradings', 'grading_name').', '.
            'users.name as pemilik_name'
        )->whereRaw('QUARTER(risk_registers.tgl_register) = ?', [$this->quarter()]);
        $this->applyFilters($subquery);
        $query = $this->ranked($subquery, [
            'pernyataan_risiko', 'kode_risiko', 'kegiatan_rtp', 'uraian', 'target_waktu',
            'dampak', 'probabilitas', 'skor_risiko', 'grading_name', 'pemilik_name',
        ])->whereIn(DB::raw('UPPER(sub.grading_name)'), self::EKSTREM_LABELS);
        $this->data = $query->get();

        return $query;
    }

    public function headings(): array
    {
        $level = $this->usesInherent() ? 'Risiko  Inherent' : 'Risiko  Residual ';

        return [
            ['No', 'Pernyataan Risiko (Prioritas)', 'Kode Risiko', 'Kegiatan Rencana Pengendalian', 'Uraian Penanganan Risiko', 'Target Waktu', $level, '', '', '', 'Pemilik Risiko'],
            ['', '', '', '', '', '', 'Dampak', 'Probabilitas', 'Skor Risiko', 'Peringkat Risiko', ''],
        ];
    }

    public function columnWidths(): array
    {
        return ['A' => 4, 'B' => 65, 'C' => 20, 'D' => 45, 'E' => 45, 'F' => 15, 'G' => 12, 'H' => 15, 'I' => 12, 'J' => 20, 'K' => 30];
    }

    public function registerEvents(): array
    {
        return [AfterSheet::class => function (AfterSheet $event) {
            $this->decorate($event, [1, 2], ['A1:A2', 'B1:B2', 'C1:C2', 'D1:D2', 'E1:E2', 'F1:F2', 'G1:J1', 'K1:K2']);
        }];
    }
}

class MRTerbaruEskalasiTw1 extends MRTerbaruEskalasi
{
    protected function quarter(): int
    {
        return 1;
    }

    public function title(): string
    {
        return '12. eskalasi risiko tw 1';
    }
}

class MRTerbaruEskalasiTw2 extends MRTerbaruEskalasi
{
    protected function quarter(): int
    {
        return 2;
    }

    public function title(): string
    {
        return '13. eskalasi risiko tw 2';
    }
}

class MRTerbaruEskalasiTw3 extends MRTerbaruEskalasi
{
    protected function quarter(): int
    {
        return 3;
    }

    public function title(): string
    {
        return '14. eskalasi risiko tw 3';
    }
}

class MRTerbaruEskalasiTw4 extends MRTerbaruEskalasi
{
    protected function quarter(): int
    {
        return 4;
    }

    public function title(): string
    {
        return '15. eskalasi risiko tw 4';
    }
}

/** Sheet "PETA PANAS": the inherent scatter, same chart the LARS DHP export draws. */
class MRTerbaruPetaPanas extends MRTerbaruSheet implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithCharts, WithTitle
{
    public function query()
    {
        $query = $this->baseQuery()
            ->select('risk_registers.kode_risiko', 'risk_registers.osd1_dampak', 'risk_registers.osd1_probabilitas');
        $this->applyFilters($query);
        $this->data = $query->get();

        return $query;
    }

    public function title(): string
    {
        return 'PETA PANAS';
    }

    public function headings(): array
    {
        return [['No Risiko', 'Dampak', 'Probabilitas']];
    }

    public function columnWidths(): array
    {
        return ['A' => 18, 'B' => 10, 'C' => 15];
    }

    public function charts()
    {
        $spreadsheet = new Spreadsheet();
        $worksheet = $spreadsheet->getActiveSheet();
        $rows = [['Dampak', 'Probabilitas']];
        foreach ($this->data ?? collect() as $row) {
            $rows[] = [$row->osd1_dampak, $row->osd1_probabilitas];
        }
        $worksheet->fromArray($rows);
        $last = count($rows);

        $dataSeriesLabels = [
            new DataSeriesValues(DataSeriesValues::DATASERIES_TYPE_STRING, "'PETA PANAS'!\$C\$1", null, 1),
        ];
        $dataSeriesValues = [
            new DataSeriesValues(DataSeriesValues::DATASERIES_TYPE_NUMBER, "'PETA PANAS'!\$C\$2:\$C\$".$last, Properties::FORMAT_CODE_NUMBER, 4, null, 'diamond', null, 7),
        ];
        $xAxisTickValues = [
            new DataSeriesValues(DataSeriesValues::DATASERIES_TYPE_NUMBER, "'PETA PANAS'!\$B\$2:\$B\$".$last, Properties::FORMAT_CODE_NUMBER, 8),
        ];
        $dataSeriesValues[0]->setScatterLines(false);
        $dataSeriesValues[0]->getMarkerFillColor()->setColorProperties('accent1', null, ChartColor::EXCEL_COLOR_TYPE_SCHEME);

        $series = new DataSeries(
            DataSeries::TYPE_SCATTERCHART,
            null,
            range(0, count($dataSeriesValues) - 1),
            $dataSeriesLabels,
            $xAxisTickValues,
            $dataSeriesValues,
            null,
            null,
            DataSeries::STYLE_LINEMARKER
        );
        $plotArea = new PlotArea(null, [$series]);

        $stops = [];
        foreach ([[0.0, '0000FF'], [0.45, '00CC66'], [0.55, 'FFFF00'], [1.0, 'FF0000']] as [$position, $rgb]) {
            $color = new ChartColor();
            $color->setColorProperties($rgb, 0, 'srgbClr', 1.0);
            $stops[] = [$position, $color];
        }
        $plotArea->setGradientFillProperties($stops, 340.0);
        new ChartLegend(ChartLegend::POSITION_TOPRIGHT, null, false);

        $axisOptions = function () {
            $axis = new ChartAxis();
            $axis->setAxisOptionsProperties(
                Properties::AXIS_LABELS_NEXT_TO,
                null,
                null,
                null,
                null,
                Properties::TICK_MARK_OUTSIDE,
                0,
                5,
                null,
                1
            );

            return $axis;
        };
        $xAxis = $axisOptions();
        $xAxis->setAxisType(ChartAxis::AXIS_TYPE_VALUE);

        $chart = new Chart(
            'petapanas',
            new Title('RISK ASSESSMENT HEATMAP'),
            null,
            $plotArea,
            true,
            DataSeries::EMPTY_AS_GAP,
            new Title('DAMPAK'),
            new Title('PROBABILITAS'),
            $xAxis,
            $axisOptions()
        );
        $chart->setTopLeftPosition('E1');
        $chart->setBottomRightPosition('O23');
        $worksheet->addChart($chart);

        return $chart;
    }

    public function registerEvents(): array
    {
        return [AfterSheet::class => function (AfterSheet $event) {
            $this->decorate($event, [1], [], 'F4B084');
            $event->sheet->getDelegate()->addChart($this->charts());
        }];
    }
}

/** Sheet "TREND": numerator/denominator per register, the LARS DHP trend columns. */
class MRTerbaruTrend extends MRTerbaruSheet implements FromQuery, WithColumnWidths, WithHeadings, WithEvents, WithTitle
{
    public function query()
    {
        $query = $this->baseQuery()->select(
            'risk_registers.kode_risiko',
            'risk_registers.denum',
            'risk_registers.num',
            DB::raw('CASE WHEN risk_registers.denum > 0 THEN risk_registers.num / risk_registers.denum * 100 ELSE NULL END AS `persen`'),
            DB::raw("'' AS `jumlah`"),
            'risk_registers.target_waktu'
        );
        $this->applyFilters($query);
        $this->data = $query->get();

        return $query;
    }

    public function title(): string
    {
        return 'TREND';
    }

    public function headings(): array
    {
        return [['Kode Risiko', 'Denum', 'NUM', '%', 'Jumlah', 'Waktu']];
    }

    public function columnWidths(): array
    {
        return ['A' => 20, 'B' => 18, 'C' => 18, 'D' => 18, 'E' => 18, 'F' => 18];
    }

    public function registerEvents(): array
    {
        return [AfterSheet::class => function (AfterSheet $event) {
            $this->decorate($event, [1]);
        }];
    }
}
