<?php

namespace App\Services;

use App\Models\PeriodeKinerja;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\ValidationException;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx;
use PhpOffice\PhpSpreadsheet\Spreadsheet;

class CascadingConceptService
{
    public function rows(int $periodId): array
    {
        if (! Schema::hasTable('cascading_concepts')) {
            return [];
        }
        $rows = DB::table('cascading_concepts')->where('periode_kinerja_id', $periodId)->orderBy('sort_order')->get()->map(fn ($r) => (array) $r)->all();
        $tables = [];
        foreach ($rows as $row) {
            if ($row['legacy_table']) {
                $tables[$row['legacy_table']][] = $row['legacy_id'];
            }
        }
        $legacy = [];
        foreach ($tables as $table => $ids) {
            $legacy[$table] = DB::table($table)->where('periode_kinerja_id', $periodId)->whereIn('id', $ids)->get()->keyBy('id');
        }
        foreach ($rows as &$row) {
            if ($row['legacy_table']) {
                $source = $legacy[$row['legacy_table']][$row['legacy_id']] ?? null;
                if (! $source) {
                    throw ValidationException::withMessages(['hierarki' => 'Data cascading terhubung tidak ditemukan.']);
                }
                $row['name'] = $source->name;
                $row['code'] = $source->kode_cascading;
                $row['is_active'] = $source->is_active;
            }
            if ($row['kind'] === 'tujuan_strategis') {
                $row['name'] = (string) PeriodeKinerja::whereKey($periodId)->value('tujuan');
            }
        }
        unset($row);

        foreach ($rows as &$row) {
            $row['cascading_color'] = $row['kind'] === 'iku' && $row['legacy_table'] === 'indikator_fitur1s'
                ? CascadingDisplayColor::normalize($legacy['indikator_fitur1s'][$row['legacy_id']]->cascading_color ?? null) : null;
        }
        unset($row);
        $byId = array_column($rows, null, 'id');
        foreach ($rows as &$row) {
            $ancestor = $row;
            $seen = [];
            $row['iku_branch'] = null;
            $row['iku_color'] = null;
            while ($ancestor && ! isset($seen[$ancestor['id']])) {
                $seen[$ancestor['id']] = true;
                if ($ancestor['kind'] === 'iku') {
                    $row['iku_color'] = $ancestor['cascading_color'];
                }
                $key = $ancestor['source_sheet'].'!'.$ancestor['source_cell'];
                $branch = array_search($key, CascadingColorHierarchy::IKUS, true);
                if ($branch !== false) {
                    $row['iku_branch'] = $branch;
                    break;
                }
                $ancestor = $byId[$ancestor['parent_id']] ?? null;
            }
        }
        unset($row);

        return $rows;
    }

    public function snapshot(array $data): ?array
    {
        $rows = $this->rows($data['period']['id']);
        if (! $rows) {
            return null;
        }
        $template = DB::table('cascading_workbook_templates')->where('periode_kinerja_id', $data['period']['id'])->first();
        $structure = json_decode($template->structure, true);
        if (empty($structure['concept_version'])) {
            return null;
        }
        $byId = array_column($rows, null, 'id');
        $cells = [];
        foreach (json_decode($template->bindings, true) as $sheet => $bindings) {
            foreach ($bindings as $cell => $binding) {
                $row = $byId[$binding['id']];
                $value = $row['is_active'] ? $row[$binding['field']] : '';
                $same = (string) $value === (string) $binding['initial'];
                $cells[$sheet][$cell] = ['value' => $same ? $binding['raw'] : (string) $value, 'type' => $same ? $binding['type'] : DataType::TYPE_STRING, 'unchanged' => $same, 'color' => $row['iku_color'], 'force_color' => $row['kind'] === 'iku'];
            }
        }

        return ['workbook_base64' => $template->workbook_base64, 'sheets' => $structure['sheets'], 'cells' => $cells,
            'director_from_database' => (int) ($data['period']['feature_schema_version'] ?? 1) === 2,
            'nodes' => $rows, 'warnings' => $structure['warnings'] ?? [], 'source_sha256' => $template->source_sha256];
    }

    public function build(array $data): Spreadsheet
    {
        $source = $data['concept_workbook'];
        $file = tempnam(sys_get_temp_dir(), 'cascading-concept-');
        try {
            file_put_contents($file, base64_decode($source['workbook_base64'], true));
            $reader = new Xlsx();
            $reader->setLoadSheetsOnly($source['sheets']);
            $book = $reader->load($file);
        } finally {
            unlink($file);
        }
        // The workbook's tab order matches the requested overview and responsibility sheets.
        foreach ($source['sheets'] as $index => $name) {
            $book->setIndexByName($name, $index);
        }
        foreach ($source['cells'] as $name => $cells) {
            $sheet = $book->getSheetByName($name);
            foreach ($cells as $cell => $entry) {
                if (empty($entry['unchanged'])) {
                    $sheet->setCellValueExplicit($cell, $entry['value'], $entry['type']);
                }
                CascadingDisplayColor::apply($sheet, $cell, $entry['color'] ?? null, $entry['force_color'] ?? false);
            }
            $title = $name === 'cascading' ? 'B2' : 'A1';
            $sheet->setCellValueExplicit($title, 'CASCADING KINERJA '.mb_strtoupper($data['period']['nama_organisasi']).' '.$data['period']['tahun'], DataType::TYPE_STRING);
        }
        foreach (['cascading' => 'A1:AB51', 'direktur' => 'A1:M21', 'ASD ' => 'A1:M69', 'PELAYANAN' => 'A1:L174', 'PENUNJANG' => 'A1:M85'] as $name => $range) {
            $book->getSheetByName($name)->getPageSetup()->setPrintArea($range)->setFitToWidth(1)->setFitToHeight(0);
        }
        if (! empty($source['director_from_database'])) {
            $this->buildDirector($book, $source['nodes']);
        }
        $extra = array_values(array_filter($source['nodes'] ?? [], fn ($n) => $n['source_sheet'] === 'INPUT' && $n['is_active'] && (empty($source['director_from_database']) || $n['tier'] !== 'direktur')));
        if ($extra) {
            $sheet = $book->createSheet()->setTitle('Tambahan');
            $headers = ['Jenis', 'Kode', 'Uraian', 'Kegiatan / induk', 'Penanggung jawab'];
            foreach ($headers as $i => $label) {
                $sheet->setCellValueExplicit(chr(65 + $i).'1', $label, DataType::TYPE_STRING);
            }
            $byId = array_column($source['nodes'], null, 'id');
            $rowNumber = 2;
            foreach ($extra as $node) {
                $values = [CascadingConceptParser::LABELS[$node['kind']] ?? $node['kind'], $node['code'], $node['name'], $byId[$node['parent_id']]['name'] ?? '', $node['office']];
                foreach ($values as $i => $value) {
                    $sheet->setCellValueExplicit(chr(65 + $i).$rowNumber, (string) $value, DataType::TYPE_STRING);
                }
                if (! empty($node['iku_color'])) {
                    CascadingDisplayColor::range($sheet, 'A'.$rowNumber.':E'.$rowNumber, $node['iku_color']);
                }
                $sheet->getRowDimension($rowNumber)->setRowHeight(70);
                $rowNumber++;
            }
            foreach (['A' => 24, 'B' => 18, 'C' => 65, 'D' => 65, 'E' => 40] as $col => $width) {
                $sheet->getColumnDimension($col)->setWidth($width);
            }
            $sheet->getStyle('A1:E'.($rowNumber - 1))->getAlignment()->setWrapText(true)->setVertical('top');
            $sheet->getStyle('A1:E1')->getFont()->setBold(true);
            $sheet->freezePane('A2');
            $sheet->setAutoFilter('A1:E'.($rowNumber - 1));
            $sheet->getPageSetup()->setOrientation('landscape')->setFitToWidth(1)->setFitToHeight(0);
        }
        $book->setActiveSheetIndex(0);

        return $book;
    }

    private function buildDirector(Spreadsheet $book, array $nodes): void
    {
        $sheet = $book->getSheetByName('direktur');
        if (! $sheet) {
            return;
        }
        // Keep the header layout, but discard all original activity/indicator content.
        $last = max(21, $sheet->getHighestRow());
        foreach ($sheet->getMergeCells() as $range) {
            $bounds = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::rangeBoundaries($range);
            if ($bounds[0][1] >= 16) {
                $sheet->unmergeCells($range);
            }
        }
        $sheet->removeRow(16, $last - 15);
        $children = [];
        foreach ($nodes as $node) {
            if ($node['is_active']) {
                $children[$node['parent_id']][] = $node;
            }
        }
        $row = 16;
        $write = function (array $node, bool $indicator) use ($sheet, &$row) {
            $codeCol = $indicator ? 'D' : 'C';
            $nameCol = $indicator ? 'E' : 'D';
            $sheet->mergeCells($nameCol.$row.':M'.$row);
            $sheet->setCellValueExplicit($codeCol.$row, (string) ($node['code'] ?? ''), DataType::TYPE_STRING);
            $sheet->setCellValueExplicit($nameCol.$row, $node['name'], DataType::TYPE_STRING);
            $sheet->getStyle('C'.$row.':M'.$row)->applyFromArray([
                'font' => ['name' => 'Arial', 'size' => 11, 'bold' => ! $indicator],
                'alignment' => ['wrapText' => true, 'vertical' => 'center'],
                'borders' => ['bottom' => ['borderStyle' => 'thin', 'color' => ['rgb' => 'D1D5DB']]],
            ]);
            if (! empty($node['iku_color'])) {
                CascadingDisplayColor::range($sheet, 'C'.$row.':M'.$row, $node['iku_color']);
            }
            // Merged text does not auto-fit reliably in Excel; allow space for long input.
            $lines = array_sum(array_map(fn ($line) => max(1, (int) ceil(mb_strlen($line) / 85)), explode("\n", $node['name'])));
            $sheet->getRowDimension($row)->setRowHeight(max(32, $lines * 17 + 10));
            $row++;
        };
        foreach ($nodes as $iku) {
            if ($iku['kind'] !== 'iku' || ! $iku['is_active']) {
                continue;
            }
            foreach ($children[$iku['id']] ?? [] as $activity) {
                if ($activity['tier'] !== 'direktur' || $activity['kind'] !== 'kegiatan') {
                    continue;
                }
                $write($activity, false);
                foreach ($children[$activity['id']] ?? [] as $indicator) {
                    if ($indicator['tier'] === 'direktur' && $indicator['kind'] === 'indikator_kinerja') {
                        $write($indicator, true);
                    }
                }
            }
        }
        $sheet->getPageSetup()->setPrintArea('A1:M'.max(15, $row - 1));
    }

    public function update(PeriodeKinerja $period, int $id, array $data): void
    {
        DB::transaction(function () use ($period, $id, $data) {
            $locked = PeriodeKinerja::whereKey($period->id)->lockForUpdate()->firstOrFail();
            if ($locked->status === 'ditutup') {
                throw ValidationException::withMessages(['name' => 'Periode sudah ditutup.']);
            }
            $node = DB::table('cascading_concepts')->where('periode_kinerja_id', $period->id)->where('id', $id)->first();
            abort_unless($node, 404);
            if (($node->legacy_table || $node->kind === 'tujuan_strategis') && mb_strlen($data['name']) > 255) {
                throw ValidationException::withMessages(['name' => 'Uraian pada indikator terhubung maksimal 255 karakter.']);
            }
            if ($node->legacy_table && mb_strlen($data['code'] ?? '') > 50) {
                throw ValidationException::withMessages(['code' => 'Kode pada indikator terhubung maksimal 50 karakter.']);
            }
            DB::table('cascading_concepts')->where('id', $id)->update($data + ['updated_at' => now()]);
            if ($node->kind === 'tujuan_strategis') {
                $locked->update(['tujuan' => $data['name']]);
            }
            if ($node->legacy_table) {
                DB::table($node->legacy_table)->where('id', $node->legacy_id)->where('periode_kinerja_id', $period->id)
                    ->update(['name' => $data['name'], 'kode_cascading' => $data['code'], 'updated_at' => now()]);
            }
        });
    }
}
