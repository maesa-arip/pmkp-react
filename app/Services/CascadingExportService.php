<?php

namespace App\Services;

use App\Models\PeriodeKinerja;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Worksheet\PageSetup;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class CascadingExportService
{
    public function download(PeriodeKinerja $period)
    {
        $snapshot = DB::transaction(function () use ($period) {
            $period = PeriodeKinerja::whereKey($period->id)->lockForUpdate()->firstOrFail();
            $levels = [];
            foreach (CascadingHierarchyService::TABLES as $level => $table) {
                $levels[$level] = DB::table($table)->where('periode_kinerja_id', $period->id)->orderBy('sort_order')->orderBy('id')->get()->map(fn ($row) => (array) $row)->all();
            }
            $hierarchy = app(CascadingHierarchyService::class);
            $tree = $hierarchy->build($levels);
            $unlinked = $hierarchy->unlinked($levels, $tree);
            if ($unlinked) {
                throw \Illuminate\Validation\ValidationException::withMessages(['hierarki' => count($unlinked).' data aktif memiliki induk tidak aktif atau tidak ditemukan. Perbaiki hierarki sebelum ekspor.']);
            }

            return ['period' => $period->toArray(), 'template_version' => '2',
                'levels' => array_map(fn ($rows) => array_values(array_filter($rows, fn ($row) => $row['is_active'])), $hierarchy->decorate($levels)),
                'tree' => $tree];
        });
        $id = DB::table('cascading_exports')->insertGetId(['periode_kinerja_id' => $period->id, 'template_version' => '2',
            'snapshot' => json_encode($snapshot), 'created_by' => auth()->id(), 'created_at' => now(), 'updated_at' => now()]);

        return $this->response($snapshot, $id);
    }

    public function downloadArchive(int $id)
    {
        $export = DB::table('cascading_exports')->find($id);
        abort_unless($export, 404);
        $snapshot = json_decode($export->snapshot, true);
        $snapshot['template_version'] = $export->template_version;

        return $this->response($snapshot, $id);
    }

    private function response(array $snapshot, int $id)
    {
        return response()->streamDownload(function () use ($snapshot) {
            $book = ($snapshot['template_version'] ?? '2') === '1'
                ? app(LegacyCascadingExportService::class)->build($snapshot) : $this->build($snapshot);
            (new Xlsx($book))->save('php://output');
            $book->disconnectWorksheets();
        }, 'Cascading-'.$snapshot['period']['tahun'].'-'.$id.'.xlsx', ['Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']);
    }

    public function build(array $data): Spreadsheet
    {
        $book = new Spreadsheet();
        $sheet = $book->getActiveSheet()->setTitle('Cascading '.$data['period']['tahun']);
        $sheet->setShowGridlines(false);
        $book->getDefaultStyle()->getFont()->setName('Arial')->setSize(10);
        $book->getDefaultStyle()->getAlignment()->setWrapText(true)->setVertical('center');
        $sheet->getDefaultRowDimension()->setRowHeight(17);
        for ($col = 1; $col <= 29; $col++) {
            $sheet->getColumnDimension(Coordinate::stringFromColumnIndex($col))->setWidth(in_array($col, [10, 20]) ? 2 : 5);
        }
        $this->text($sheet, 1, 29, 2, 3, 'CASCADING KINERJA '.mb_strtoupper($data['period']['nama_organisasi']).' '.$data['period']['tahun'], 'FFFFFF', true);
        $sheet->getStyle('A2:AC3')->getFont()->setSize(14);
        $this->text($sheet, 1, 29, 4, 5, 'TUJUAN: '.($data['period']['tujuan'] ?: 'Belum diisi'), 'FFFFFF');
        $note = ($data['period']['status'] === 'draft' ? 'DRAFT. ' : '').(! empty($data['period']['rekonstruksi']) ? 'Rekonstruksi dari master sebelumnya; redaksi historis perlu verifikasi.' : '');
        $this->text($sheet, 1, 29, 6, 7, $note, 'FFFFFF');
        $sheet->getStyle('A6:AC7')->getFont()->setSize(9)->getColor()->setRGB('64748B');
        $roots = $data['tree'] ?? app(CascadingHierarchyService::class)->build($data['levels'] ?? []);
        $row = 9;
        foreach ($roots as $root) {
            $batches = array_chunk($root['children'], 3);
            if (! $batches) {
                $row = $this->node($sheet, $root, 7, 17, $row) + 3;

                continue;
            }
            foreach ($batches as $batch) {
                // Repeated root is the branch heading when a wide tree continues below.
                $rootEnd = $this->node($sheet, $root, 7, 17, $row);
                $branchRow = $rootEnd + 4;
                $centers = array_map(fn ($i) => 5 + $i * 10, array_keys($batch));
                $this->vertical($sheet, 15, $rootEnd + 1, $rootEnd + 2);
                for ($col = min(array_merge($centers, [15])); $col <= max(array_merge($centers, [15])); $col++) {
                    $sheet->getStyle(Coordinate::stringFromColumnIndex($col).($rootEnd + 2))->getBorders()->getBottom()->setBorderStyle('thin')->getColor()->setRGB('64748B');
                }
                foreach ($centers as $center) {
                    $this->vertical($sheet, $center, $rootEnd + 3, $branchRow - 1);
                }
                $ends = [];
                foreach ($batch as $index => $branch) {
                    $left = 1 + $index * 10;
                    $branchEnd = $this->node($sheet, $branch, $left, 9, $branchRow);
                    $cursor = $branchEnd + 2;
                    foreach ($branch['children'] as $activity) {
                        // All activity boxes branch from this program's rail.
                        $railStart = $cursor;
                        $cursor = $this->node($sheet, $activity, $left + 1, 8, $cursor) + 1;
                        foreach ($activity['children'] as $indicator) {
                            $cursor = $this->node($sheet, $indicator, $left + 1, 8, $cursor) + 1;
                        }
                        $this->vertical($sheet, $left, $branchEnd + 1, $cursor);
                        $sheet->getStyle(Coordinate::stringFromColumnIndex($left).$railStart)->getBorders()->getTop()->setBorderStyle('thin')->getColor()->setRGB('94A3B8');
                        $cursor += 2;
                    }
                    $ends[] = $cursor;
                }
                $row = max($ends) + 3;
            }
        }
        if (! $roots) {
            $this->text($sheet, 1, 29, 9, 11, 'Belum ada hierarki indikator aktif pada periode ini.', 'F1F5F9');
            $row = 12;
        }
        $sheet->freezePane('A9');
        $sheet->getPageSetup()->setOrientation(PageSetup::ORIENTATION_LANDSCAPE)->setPaperSize(PageSetup::PAPERSIZE_A3)
            ->setFitToWidth(1)->setFitToHeight(0)->setPrintArea('A1:AC'.$row)->setRowsToRepeatAtTopByStartAndEnd(2, 7);
        $sheet->getPageMargins()->setLeft(0.25)->setRight(0.25)->setTop(0.35)->setBottom(0.35);
        $sheet->getHeaderFooter()->setOddFooter('&L'.$data['period']['tahun'].'&RHalaman &P / &N');

        return $book;
    }

    private function node(Worksheet $sheet, array $node, int $left, int $width, int $row): int
    {
        $level = (int) $node['level'];
        $colors = [1 => 'DBEAFE', 2 => 'DCFCE7', 3 => 'FEF3C7', 4 => 'FFFFFF'];
        $labels = [1 => 'SASARAN', 2 => 'PROGRAM', 3 => 'KEGIATAN', 4 => 'INDIKATOR'];
        $text = $node['name'];
        if (! empty($node['tujuan']) && trim($node['tujuan']) !== trim($text)) {
            $text .= "\nTujuan: ".$node['tujuan'];
        }
        if ($level < 4 || ! empty($node['jabatan'])) {
            $header = $labels[$level].(! empty($node['jabatan']) ? ' — '.$node['jabatan'] : '');
            $height = max(2, $this->lines($header, ($width - 1) * 5));
            $this->text($sheet, $left, $left + $width - 1, $row, $row + $height - 1, $header, $colors[$level], true);
            $row += $height;
        }
        $height = max(3, $this->lines($text, ($width - 2) * 5), $this->lines($node['display_code'], 9));
        $last = $row + $height - 1;
        $this->text($sheet, $left, $left + 1, $row, $last, $node['display_code'], $colors[$level], true);
        $codeRange = Coordinate::stringFromColumnIndex($left).$row.':'.Coordinate::stringFromColumnIndex($left + 1).$last;
        $sheet->getStyle($codeRange)->getNumberFormat()->setFormatCode('@');
        $sheet->getStyle($codeRange)->getAlignment()->setHorizontal('left');
        $this->text($sheet, $left + 2, $left + $width - 1, $row, $last, $text, $colors[$level]);

        return $last;
    }

    private function text(Worksheet $sheet, int $left, int $right, int $top, int $bottom, string $value, string $color, bool $bold = false): void
    {
        $first = Coordinate::stringFromColumnIndex($left).$top;
        $range = $first.':'.Coordinate::stringFromColumnIndex($right).$bottom;
        $sheet->mergeCells($range);
        $sheet->setCellValueExplicit($first, $value, DataType::TYPE_STRING);
        $style = $sheet->getStyle($range);
        $style->getFont()->setBold($bold);
        $style->getFill()->setFillType('solid')->getStartColor()->setRGB($color);
        $style->getBorders()->getOutline()->setBorderStyle('thin')->getColor()->setRGB($color === 'FFFFFF' && $top < 9 ? 'FFFFFF' : 'CBD5E1');
    }

    private function vertical(Worksheet $sheet, int $col, int $top, int $bottom): void
    {
        $letter = Coordinate::stringFromColumnIndex($col);
        $sheet->getStyle($letter.$top.':'.$letter.$bottom)->getBorders()->getRight()->setBorderStyle('thin')->getColor()->setRGB('94A3B8');
    }

    private function lines(string $text, int $width): int
    {
        $lines = 0;
        foreach (preg_split('/\R/u', $text) as $line) {
            $length = 0;
            $lines++;
            foreach (preg_split('/\s+/u', trim($line)) as $word) {
                $size = mb_strlen($word) + 1;
                if ($length && $length + $size > $width) {
                    $lines++;
                    $length = 0;
                }
                $lines += max(0, (int) ceil($size / $width) - 1);
                $length += $size;
            }
        }

        return $lines + 1;
    }
}
