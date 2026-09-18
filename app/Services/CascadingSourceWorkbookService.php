<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx;
use PhpOffice\PhpSpreadsheet\Spreadsheet;

class CascadingSourceWorkbookService
{
    /** Snapshot both the immutable source layout and current database values. */
    public function snapshot(array $data): ?array
    {
        if (! Schema::hasTable('cascading_workbook_templates')) {
            return null;
        }
        $template = DB::table('cascading_workbook_templates')->where('periode_kinerja_id', $data['period']['id'])->first();
        if (! $template) {
            return null;
        }
        $rows = [];
        foreach (CascadingHierarchyService::TABLES as $level => $table) {
            foreach ($data['levels'][$level] ?? [] as $node) {
                $rows[$table][$node['id']] = $node;
                // A separate, edited purpose has no cell in the reference layout.
                if (! empty($node['tujuan']) && trim($node['tujuan']) !== trim($node['name'])) {
                    return null;
                }
            }
        }
        foreach (DB::table('sasaran_strategis')->where('periode_kinerja_id', $data['period']['id'])->where('is_active', true)->get() as $row) {
            $rows['sasaran_strategis'][$row->id] = (array) $row;
        }
        $structure = json_decode($template->structure, true);
        foreach ($structure as $table => $nodes) {
            // Changed membership or hierarchy needs the dynamic layout, so nothing is omitted.
            $expected = array_keys($nodes);
            $actual = array_keys($rows[$table] ?? []);
            sort($expected);
            sort($actual);
            if ($expected !== $actual) {
                return null;
            }
            foreach ($nodes as $id => $shape) {
                foreach ($shape as $field => $value) {
                    if ((string) ($rows[$table][$id][$field] ?? '') !== (string) $value) {
                        return null;
                    }
                }
            }
        }
        $colors = [];
        $walk = function ($nodes, $color = null) use (&$walk, &$colors) {
            foreach ($nodes as $node) {
                $branchColor = (int) $node['level'] === 1 ? CascadingDisplayColor::normalize($node['cascading_color'] ?? null) : $color;
                $colors[CascadingHierarchyService::TABLES[$node['level']]][$node['id']] = $branchColor;
                $walk($node['children'], $branchColor);
            }
        };
        $walk($data['tree'] ?? app(CascadingHierarchyService::class)->build($data['levels'] ?? []));
        $cells = [];
        foreach (json_decode($template->bindings, true) as $cell => $binding) {
            $value = $rows[$binding['table']][$binding['id']][$binding['field']];
            $unchanged = (string) $value === (string) $binding['initial'];
            $cells[$cell] = ['value' => $unchanged ? $binding['raw'] : (string) $value,
                'type' => $unchanged ? $binding['type'] : DataType::TYPE_STRING,
                'color' => $colors[$binding['table']][$binding['id']] ?? null,
                'force_color' => $binding['table'] === 'indikator_fitur1s'];
        }

        return ['sheet_name' => $template->sheet_name, 'source_sha256' => $template->source_sha256,
            'workbook_base64' => $template->workbook_base64, 'cells' => $cells];
    }

    public function build(array $data): Spreadsheet
    {
        $source = $data['source_workbook'];
        $file = tempnam(sys_get_temp_dir(), 'cascade-export-');
        try {
            file_put_contents($file, base64_decode($source['workbook_base64'], true));
            $reader = new Xlsx();
            $reader->setLoadSheetsOnly([$source['sheet_name']]);
            $book = $reader->load($file);
        } finally {
            unlink($file);
        }
        $book->setActiveSheetIndex(0);
        $sheet = $book->getActiveSheet();
        foreach ($source['cells'] as $cell => $entry) {
            $sheet->setCellValueExplicit($cell, $entry['value'], $entry['type']);
            CascadingDisplayColor::apply($sheet, $cell, $entry['color'] ?? null, $entry['force_color'] ?? false);
        }
        $originalOrganization = preg_replace('/^CASCADING KINERJA | \\d{4}$/u', '', (string) $sheet->getCell('B2')->getValue());
        $organization = mb_strtoupper($data['period']['nama_organisasi']);
        $sheet->setCellValueExplicit('B2', 'CASCADING KINERJA '.$organization.' '.$data['period']['tahun'], DataType::TYPE_STRING);
        if ($organization !== $originalOrganization) {
            $sheet->setCellValueExplicit('B3', 'DIREKTUR '.$organization, DataType::TYPE_STRING);
        }
        $purpose = (string) ($data['period']['tujuan'] ?? '');
        if (trim((string) $sheet->getCell('F4')->getValue()) !== trim($purpose)) {
            $sheet->setCellValueExplicit('F4', $purpose, DataType::TYPE_STRING);
        }
        $sheet->setTitle('Cascading '.$data['period']['tahun']);
        // The source has formatting down to row 1000; keep its actual report printable.
        $sheet->getPageSetup()->setPrintArea('A1:AB51')->setFitToWidth(1)->setFitToHeight(0);
        return $book;
    }
}