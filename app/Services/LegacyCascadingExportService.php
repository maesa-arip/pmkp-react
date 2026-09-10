<?php

namespace App\Services;

use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Worksheet\PageSetup;

/** Renderer retained for archived template version 1 snapshots. */
class LegacyCascadingExportService
{
    public function build(array $data): Spreadsheet
    {
        $book = new Spreadsheet();
        $sheet = $book->getActiveSheet()->setTitle('Cascading '.$data['period']['tahun']);
        $sheet->setShowGridlines(false);
        $book->getDefaultStyle()->getFont()->setName('Arial')->setSize(10);
        $write = function ($cell, $value) use ($sheet) {
        $sheet->setCellValueExplicit($cell, (string) $value, DataType::TYPE_STRING);
        };
        $merge = function ($range, $value) use ($sheet, $write) {
        $sheet->mergeCells($range);
        $write(explode(':', $range)[0], $value);
        };
        $width = 28;
        for ($col = 1; $col <= $width; $col++) {
            $sheet->getColumnDimension(Coordinate::stringFromColumnIndex($col))->setWidth(5);
        }
        $merge('A2:AB3', 'CASCADING KINERJA '.mb_strtoupper($data['period']['nama_organisasi']).' '.$data['period']['tahun']);
        $sheet->getStyle('A2:AB3')->getFont()->setBold(true)->setSize(14);
        $merge('A4:AB5', 'TUJUAN: '.($data['period']['tujuan'] ?: 'Belum diisi'));
        $merge('A6:AB6', ($data['period']['status'] === 'draft' ? 'DRAFT — ' : '').($data['period']['rekonstruksi'] ? 'Rekonstruksi dari master existing; redaksi historis belum diverifikasi.' : ''));
        $row = 8;
        $titles = ['sasaran' => 'SASARAN STRATEGIS', '1' => 'INDIKATOR LEVEL 1', '2' => 'INDIKATOR LEVEL 2', '3' => 'INDIKATOR LEVEL 3', '4' => 'INDIKATOR LEVEL 4', '04' => 'INDIKATOR UNIT'];
        foreach ($titles as $level => $title) {
            $nodes = $data['levels'][$level] ?? [];
            if (! $nodes) {
                continue;
            }
            $merge("A{$row}:AB{$row}", $title);
            $sheet->getStyle("A{$row}:AB{$row}")->getFill()->setFillType('solid')->getStartColor()->setARGB('FFDCE6F1');
            $sheet->getStyle("A{$row}:AB{$row}")->getFont()->setBold(true);
            $row += 2;
            // Group by actual parent AND owner; never conflate identical job labels on separate branches.
            $groups = [];
            $parent = AnnualIndicatorService::PARENTS[AnnualIndicatorService::TABLES[$level]] ?? null;
            foreach ($nodes as $node) {
                $groups[($parent ? $node[$parent[0]] : ($node['parent_id'] ?? 0)).'|'.($node['jabatan'] ?? '')][] = $node;
            }
            foreach (array_chunk(array_values($groups), 3) as $batch) {
                $ends = [];
                foreach ($batch as $index => $group) {
                    $start = 1 + $index * 9;
                    $a = Coordinate::stringFromColumnIndex($start);
                    $b = Coordinate::stringFromColumnIndex($start + 1);
                    $z = Coordinate::stringFromColumnIndex($start + 7);
                    $r = $row;
                    $merge("{$a}{$r}:{$z}".($r + 1), $group[0]['jabatan'] ?: 'Penanggung jawab belum diisi');
                    $sheet->getStyle("{$a}{$r}:{$z}".($r + 1))->getFont()->setBold(true);
                    $r += 2;
                    if ($parent) {
                        $parentLevel = array_search($parent[1], AnnualIndicatorService::TABLES, true);
                        $parentNode = collect($data['levels'][$parentLevel] ?? [])->firstWhere('id', $group[0][$parent[0]]);
                        $merge("{$a}{$r}:{$z}".($r + 2), 'INDUK: '.($parentNode['name'] ?? 'Tidak tersedia'));
                        $r += 3;
                    }
                    foreach ($group as $nodeIndex => $node) {
                        $height = max(3, (int) ceil(mb_strlen($node['name']) / 38));
                        $last = $r + $height - 1;
                        $merge("{$a}{$r}:{$a}{$last}", $node['kode_cascading'] ?: (string) ($nodeIndex + 1));
                        $merge("{$b}{$r}:{$z}{$last}", $node['name']);
                        $r = $last + 1;
                        if (! empty($node['tujuan']) && trim($node['tujuan']) !== trim($node['name'])) {
                            $last = $r + max(2, (int) ceil(mb_strlen($node['tujuan']) / 38)) - 1;
                            $merge("{$b}{$r}:{$z}{$last}", 'Sasaran/tujuan: '.$node['tujuan']);
                            $r = $last + 1;
                        }
                    }
                    $ends[] = $r;
                }
                $row = max($ends) + 2;
            }
        }
        $sheet->getStyle("A2:AB{$row}")->getAlignment()->setWrapText(true)->setVertical('top');
        $sheet->getPageSetup()->setOrientation(PageSetup::ORIENTATION_LANDSCAPE)->setPaperSize(PageSetup::PAPERSIZE_A3)->setFitToWidth(1)->setFitToHeight(0)->setPrintArea("A1:AB{$row}");
        $sheet->getPageSetup()->setRowsToRepeatAtTopByStartAndEnd(2, 6);

        return $book;
    }
}
