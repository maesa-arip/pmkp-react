<?php

namespace App\Services;

use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Worksheet\PageSetup;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

/** Horizontal responsibility matrix based on docs/CASCADING.xlsx's active sheet. */
class CascadingTemplateExportService
{
    public function build(array $data): Spreadsheet
    {
        $book = new Spreadsheet();
        $period = $data['period'];
        $sheet = $book->getActiveSheet()->setTitle('Cascading '.$period['tahun']);
        $sheet->setShowGridlines(false);
        $book->getDefaultStyle()->getFont()->setName('Arial')->setSize(11);
        $book->getDefaultStyle()->getAlignment()->setWrapText(true)->setVertical('top');
        $sheet->getDefaultRowDimension()->setRowHeight(18);
        $roots = $data['tree'] ?? app(CascadingHierarchyService::class)->build($data['levels'] ?? []);
        $groups = $this->responsibilities($roots);
        $colors = [];
        foreach ($roots as $index => $root) {
            $colors[$root['id']] = ltrim(CascadingDisplayColor::normalize($root['cascading_color'] ?? null) ?? ['C0C0C0', 'FFFF00', 'FF8080'][$index % 3], '#');
        }

        // Each lower responsibility gets its own code, indented code and description.
        // Upper responsibilities span their lower columns, as in the reference.
        $left = 1;
        foreach ($groups as &$group) {
            $group['left'] = $left;
            foreach ($group['owners'] as &$owner) {
                $owner['left'] = $left;
                foreach ([7, 10, 15, 15, 3] as $offset => $width) {
                    $sheet->getColumnDimension(Coordinate::stringFromColumnIndex($left + $offset))->setWidth($width);
                }
                $left += 5;
            }
            unset($owner);
            $group['right'] = $left - 2;
        }
        unset($group);
        $right = max(4, $left - 2);
        for ($col = max(1, $left); $col <= $right; $col++) {
            $sheet->getColumnDimension(Coordinate::stringFromColumnIndex($col))->setWidth(8);
        }

        $this->cell($sheet, 1, $right, 2, 'CASCADING KINERJA '.mb_strtoupper($period['nama_organisasi']).' '.$period['tahun'], bold: true, center: true, size: 14);
        $this->cell($sheet, 1, $right, 3, 'DIREKTUR '.mb_strtoupper($period['nama_organisasi']), bold: true, center: true, size: 14);
        $this->cell($sheet, 1, 2, 4, 'TUJUAN', bold: true);
        $this->cell($sheet, 3, $right, 4, $period['tujuan'] ?: 'Belum diisi', bold: true);
        $note = ($period['status'] === 'draft' ? 'DRAFT. ' : '').(! empty($period['rekonstruksi']) ? 'Rekonstruksi dari master sebelumnya; redaksi historis perlu verifikasi.' : '');
        $this->cell($sheet, 1, $right, 5, $note, size: 9);

        $summaryRight = min($right, 9);
        $this->cell($sheet, 1, $summaryRight, 6, (int) ($period['feature_schema_version'] ?? 1) === 2 ? 'INDIKATOR KINERJA UTAMA' : 'SASARAN', bold: true);
        $row = 7;
        foreach ($roots as $root) {
            $this->cell($sheet, 1, 1, $row, $root['display_code'], bold: true);
            $description = $this->description($root);
            if (! empty($root['jabatan'])) {
                $description .= "\nPenanggung jawab: ".$root['jabatan'];
            }
            $this->cell($sheet, 2, $summaryRight, $row, $description, bold: true);
            if ($color = CascadingDisplayColor::normalize($root['cascading_color'] ?? null)) {
                CascadingDisplayColor::range($sheet, 'A'.$row.':'.Coordinate::stringFromColumnIndex($summaryRight).$row, $color);
            }
            $row++;
        }
        if (! $roots) {
            $this->cell($sheet, 1, $right, $row++, 'Belum ada hierarki indikator aktif pada periode ini.');
        }

        $headerRow = $row + 1;
        $upperEnd = $headerRow;
        foreach ($groups as $group) {
            $this->cell($sheet, $group['left'], $group['right'], $headerRow, $group['label'], bold: true, center: true, border: true);
            $cursor = $headerRow + 2;
            foreach ($group['roots'] as $entry) {
                $root = $entry['node'];
                $this->cell($sheet, $group['left'], $group['left'], $cursor, $root['display_code'], $colors[$root['id']], true, border: true);
                $this->cell($sheet, $group['left'] + 1, $group['right'], $cursor++, $this->description($root), $colors[$root['id']], true, border: true);
                foreach ($entry['programs'] as $program) {
                    $this->cell($sheet, $group['left'] + 1, $group['left'] + 1, $cursor, $program['display_code']);
                    $this->cell($sheet, $group['left'] + 2, $group['right'], $cursor++, $this->description($program));
                }
                $cursor++;
            }
            $upperEnd = max($upperEnd, $cursor);
        }

        foreach ($groups as $group) {
            $range = Coordinate::stringFromColumnIndex($group['left']).$headerRow.':'.Coordinate::stringFromColumnIndex($group['right']).$upperEnd;
            $sheet->getStyle($range)->getBorders()->getOutline()->setBorderStyle('thin')->getColor()->setRGB('000000');
        }

        // All section heads start on the same row; longer columns grow downward.
        $lowerRow = $upperEnd + 2;
        $lastRow = max($row, $lowerRow);
        foreach ($groups as $group) {
            foreach ($group['owners'] as $owner) {
                if (! $owner['activities']) {
                    continue;
                }
                $col = $owner['left'];
                $this->cell($sheet, $col, $col + 3, $lowerRow, $owner['label'], bold: true, center: true, border: true);
                $cursor = $lowerRow + 1;
                $previousProgram = null;
                foreach ($owner['activities'] as $entry) {
                    $program = $entry['program'];
                    // Explicit parent context also supports manually assigned, non-hierarchical codes.
                    if ($previousProgram !== $program['id']) {
                        $this->cell($sheet, $col, $col + 3, $cursor++, ((int) ($period['feature_schema_version'] ?? 1) === 2 ? 'Kegiatan Wadir ' : 'Program ').$program['display_code'].': '.$program['name'], bold: true, size: 9);
                        $previousProgram = $program['id'];
                    }
                    $activity = $entry['node'];
                    $this->cell($sheet, $col, $col, $cursor, $activity['display_code'], $colors[$entry['root_id']], border: true);
                    $this->cell($sheet, $col + 1, $col + 3, $cursor++, $this->description($activity), $colors[$entry['root_id']], border: true);
                    foreach ($activity['children'] as $indicator) {
                        $this->cell($sheet, $col + 1, $col + 1, $cursor, $indicator['display_code']);
                        $description = $this->description($indicator);
                        if (! empty($indicator['jabatan']) && $indicator['jabatan'] !== ($activity['jabatan'] ?? '')) {
                            $description .= "\nPenanggung jawab: ".$indicator['jabatan'];
                        }
                        $this->cell($sheet, $col + 2, $col + 3, $cursor++, $description);
                    }
                }
                $range = Coordinate::stringFromColumnIndex($col).$lowerRow.':'.Coordinate::stringFromColumnIndex($col + 3).($cursor - 1);
                $sheet->getStyle($range)->applyFromArray(['borders' => [
                    'outline' => ['borderStyle' => 'thin', 'color' => ['rgb' => '000000']],
                    'horizontal' => ['borderStyle' => 'thin', 'color' => ['rgb' => '000000']],
                ]]);
                $lastRow = max($lastRow, $cursor - 1);
            }
        }

        [$lastRow, $headerRow] = $this->fitLongRows($sheet, $lastRow, $headerRow);
        $lastColumn = Coordinate::stringFromColumnIndex($right);
        $sheet->freezePane('A'.$headerRow);
        $sheet->getPageSetup()->setOrientation(PageSetup::ORIENTATION_LANDSCAPE)
            ->setPaperSize(PageSetup::PAPERSIZE_A3)->setFitToWidth(1)->setFitToHeight(0)
            ->setPrintArea('A1:'.$lastColumn.$lastRow)->setRowsToRepeatAtTopByStartAndEnd(2, 5);
        $sheet->getPageMargins()->setLeft(0.25)->setRight(0.25)->setTop(0.35)->setBottom(0.35);
        $sheet->getHeaderFooter()->setOddFooter('&L'.$period['tahun'].'&RHalaman &P / &N');

        return $book;
    }

    private function fitLongRows(Worksheet $sheet, int $lastRow, int $headerRow): array
    {
        for ($row = $lastRow; $row >= 1; $row--) {
            $height = $sheet->getRowDimension($row)->getRowHeight();
            if ($height <= 409) {
                continue;
            }
            $parts = (int) ceil($height / 300);
            $ranges = [];
            $covered = [];
            foreach ($sheet->getMergeCells() as $range) {
                [$start, $end] = Coordinate::rangeBoundaries($range);
                if ($start[1] === $row) {
                    $ranges[] = [$start[0], $end[0]];
                    for ($col = $start[0]; $col <= $end[0]; $col++) {
                        $covered[$col] = true;
                    }
                    $sheet->unmergeCells($range);
                }
            }
            foreach ($sheet->getRowIterator($row, $row) as $sheetRow) {
                foreach ($sheetRow->getCellIterator() as $cell) {
                    $col = Coordinate::columnIndexFromString($cell->getColumn());
                    if ($cell->getValue() !== null && ! isset($covered[$col])) {
                        $ranges[] = [$col, $col];
                    }
                }
            }
            $sheet->insertNewRowBefore($row + 1, $parts - 1);
            foreach ($ranges as [$left, $right]) {
                $first = Coordinate::stringFromColumnIndex($left).$row;
                $range = $first.':'.Coordinate::stringFromColumnIndex($right).($row + $parts - 1);
                $sheet->mergeCells($range);
                $sheet->duplicateStyle($sheet->getStyle($first), $range);
            }
            for ($offset = 0; $offset < $parts; $offset++) {
                $sheet->getRowDimension($row + $offset)->setRowHeight($height / $parts);
            }
            $lastRow += $parts - 1;
            if ($row < $headerRow) {
                $headerRow += $parts - 1;
            }
        }

        return [$lastRow, $headerRow];
    }

    private function responsibilities(array $roots): array
    {
        $groups = [];
        foreach ($roots as $root) {
            foreach ($root['children'] as $program) {
                $key = $this->ownerKey($program);
                if (! isset($groups[$key])) {
                    $groups[$key] = ['label' => ($program['jabatan'] ?? '') ?: 'Penanggung jawab program belum diisi', 'roots' => [], 'owners' => []];
                }
                $group = &$groups[$key];
                $group['roots'][$root['id']]['node'] = $root;
                $group['roots'][$root['id']]['programs'][] = $program;
                foreach ($program['children'] as $activity) {
                    $ownerKey = $this->ownerKey($activity);
                    if (! isset($group['owners'][$ownerKey])) {
                        $group['owners'][$ownerKey] = ['label' => ($activity['jabatan'] ?? '') ?: 'Penanggung jawab kegiatan belum diisi', 'activities' => []];
                    }
                    $group['owners'][$ownerKey]['activities'][] = ['node' => $activity, 'program' => $program, 'root_id' => $root['id']];
                }
                unset($group);
            }
        }
        foreach ($groups as &$group) {
            if (! $group['owners']) {
                $group['owners'][] = ['label' => '', 'activities' => []];
            }
        }
        unset($group);

        return array_values($groups);
    }

    private function ownerKey(array $node): string
    {
        if (! empty($node['penanggung_jawab_id'])) {
            return 'id:'.$node['penanggung_jawab_id'];
        }

        return 'label:'.mb_strtolower(trim($node['jabatan'] ?? ''));
    }

    private function description(array $node): string
    {
        $text = $node['name'];
        if (! empty($node['tujuan']) && trim($node['tujuan']) !== trim($text)) {
            $text .= "\nTujuan: ".$node['tujuan'];
        }

        return $text;
    }

    private function cell(Worksheet $sheet, int $left, int $right, int $row, string $value, string $fill = 'FFFFFF', bool $bold = false, bool $center = false, bool $border = false, int $size = 11): void
    {
        $first = Coordinate::stringFromColumnIndex($left).$row;
        $range = $first.':'.Coordinate::stringFromColumnIndex($right).$row;
        if ($left < $right) {
            $sheet->mergeCells($range);
        }
        $sheet->setCellValueExplicit($first, $value, DataType::TYPE_STRING);
        $sheet->getStyle($range)->applyFromArray([
            'font' => ['name' => 'Arial', 'size' => $size, 'bold' => $bold, 'color' => ['rgb' => CascadingDisplayColor::text($fill)]],
            'alignment' => ['horizontal' => $center ? 'center' : 'left', 'vertical' => $center ? 'center' : 'top', 'wrapText' => true],
            'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => $fill]],
            'numberFormat' => ['formatCode' => '@'],
            'borders' => ['outline' => ['borderStyle' => $border ? 'thin' : 'none', 'color' => ['rgb' => '000000']]],
        ]);
        $width = 0;
        for ($col = $left; $col <= $right; $col++) {
            $width += $sheet->getColumnDimension(Coordinate::stringFromColumnIndex($col))->getWidth();
        }
        // Excel does not auto-fit merged cells. Account for wrapping explicitly.
        $capacity = max(1, (int) floor($width * 0.9 * 11 / $size));
        $lines = 0;
        foreach (preg_split('/\R/u', $value) as $line) {
            $used = 0;
            $lines++;
            foreach (preg_split('/\s+/u', trim($line)) as $word) {
                $length = mb_strlen($word);
                if ($used && $used + 1 + $length > $capacity) {
                    $lines++;
                    $used = 0;
                }
                $lines += max(0, (int) ceil($length / $capacity) - 1);
                $used = $length > $capacity ? $length % $capacity : $used + ($used ? 1 : 0) + $length;
            }
        }
        $height = max(20, $lines * ($size * 1.3) + 6);
        $dimension = $sheet->getRowDimension($row);
        // Split exceptionally long content over merged rows rather than exceed Excel's row limit.
        $dimension->setRowHeight(max($dimension->getRowHeight(), $height));
    }
}