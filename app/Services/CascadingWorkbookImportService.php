<?php

namespace App\Services;

use App\Models\PeriodeKinerja;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx;
use RuntimeException;

class CascadingWorkbookImportService
{
    public const SHEET = 'cascading';

    /** Parse only the approved reference sheet; other tabs are historical working copies. */
    public function inspect(string $path): array
    {
        $reader = new Xlsx();
        $reader->setLoadSheetsOnly([self::SHEET]);
        $book = $reader->load($path);
        $sheet = $book->getSheetByName(self::SHEET);
        if (! $sheet || ! str_starts_with((string) $sheet->getCell('B2')->getValue(), 'CASCADING KINERJA ')) {
            throw new RuntimeException('Lembar acuan CASCADING tidak sesuai.');
        }
        $value = fn ($cell) => trim((string) $sheet->getCell($cell)->getValue());
        $code = fn ($cell) => trim($value($cell), ". \t\r\n");
        $nodes = [];
        $add = function ($level, $nameCell, $codeCell, $parent, $strategic, $owner, $ownerCell) use (&$nodes, $value, $code) {
            $name = $value($nameCell);
            if ($name === '' || mb_strlen($name) > 255) {
                throw new RuntimeException('Uraian kosong/terlalu panjang: '.$nameCell);
            }
            $nodes[$nameCell] = [
                'level' => $level, 'name' => $name, 'code' => $codeCell ? $code($codeCell) : null,
                'name_cell' => $nameCell, 'code_cell' => $codeCell, 'parent' => $parent,
                'strategic' => $strategic, 'owner' => $owner, 'owner_cell' => $ownerCell,
            ];
        };
        foreach (['B7', 'B9'] as $cell) {
            $add('sasaran', $cell, null, null, null, 'DIREKTUR', 'B3');
        }
        foreach (['G7' => 'B7', 'G8' => 'B7', 'G9' => 'B9'] as $cell => $parent) {
            $add('sasaran', $cell, 'F'.substr($cell, 1), $parent, null, 'DIREKTUR', 'B3');
        }

        $upper = [
            ['C11', 'WAKIL DIREKTUR ADMINISTRASI DAN SUMBER DAYA', 'E', 'F', 'G', [13, 18, 23]],
            ['L11', 'WAKIL DIREKTUR PELAYANAN', 'N', 'O', 'P', [13, 18, 22]],
            ['U11', 'WAKIL DIREKTUR PENUNJANG', 'W', 'X', 'Y', [13, 18, 22]],
        ];
        $programs = [];
        foreach ($upper as $group => [$header, $owner, $rootCode, $rootName, $programName, $rootRows]) {
            $current = null;
            foreach (range(13, 26) as $row) {
                if (in_array($row, $rootRows, true)) {
                    $current = $rootName.$row;
                    $strategic = ['G7', 'G8', 'G9'][array_search($row, $rootRows, true)];
                    $add(1, $current, $rootCode.$row, null, $strategic, $owner, $header);
                } elseif ($value($programName.$row) !== '') {
                    if (! $current || $code($rootName.$row) === '') {
                        throw new RuntimeException('Induk/kode program tidak ditemukan: '.$programName.$row);
                    }
                    $add(2, $programName.$row, $rootName.$row, $current, $nodes[$current]['strategic'], $owner, $header);
                    $programs[$group][$code($rootName.$row)] = $programName.$row;
                }
            }
        }

        $lower = [
            [0, 'A', 'B', 'C', 'KEPALA BAGIAN PERENCANAAN DAN PENGEMBANGAN'],
            [0, 'E', 'F', 'G', 'KEPALA BAGIAN KEUANGAN'],
            [0, 'H', 'I', 'J', 'KEPALA BAGIAN ADMINISTRASI UMUM'],
            [1, 'L', 'M', 'N', 'KEPALA BIDANG PELAYANAN MEDIK'],
            [1, 'Q', 'R', 'S', 'KEPALA BIDANG KEPERAWATAN'],
            [2, 'U', 'V', 'W', 'KEPALA BIDANG PENUNJANG MEDIK'],
            [2, 'Z', 'AA', 'AB', 'KEPALA BIDANG PENUNJANG NON MEDIK'],
        ];
        $warnings = [];
        foreach ($lower as [$group, $activityCode, $activityName, $indicatorName, $owner]) {
            $current = null;
            foreach (range(30, 51) as $row) {
                if (preg_match('/^\\d+(?:\\.[a-z0-9]+)*$/i', $code($activityCode.$row))) {
                    $current = $activityName.$row;
                    $parentCode = implode('.', array_slice(explode('.', $code($activityCode.$row)), 0, 2));
                    $parent = $programs[$group][$parentCode] ?? null;
                    if (! $parent) {
                        throw new RuntimeException('Induk kegiatan tidak ditemukan: '.$current);
                    }
                    $add(3, $current, $activityCode.$row, $parent, $nodes[$parent]['strategic'], $owner, $activityCode.'29');
                } elseif ($value($indicatorName.$row) !== '') {
                    if (! $current || $code($activityName.$row) === '') {
                        throw new RuntimeException('Induk/kode indikator tidak ditemukan: '.$indicatorName.$row);
                    }
                    $add(4, $indicatorName.$row, $activityName.$row, $current, $nodes[$current]['strategic'], $owner, $activityCode.'29');
                } elseif ($value($activityName.$row) !== '') {
                    $warnings[] = $activityName.$row.' memiliki nomor tanpa uraian; tidak dibuat sebagai indikator.';
                }
            }
        }
        $title = $value('B2');
        $organization = preg_replace('/^CASCADING KINERJA | \\d{4}$/u', '', $title);
        $counts = array_count_values(array_column($nodes, 'level'));
        $purpose = $value('F4');
        $book->disconnectWorksheets();

        return ['nodes' => $nodes, 'organization' => $organization, 'tujuan' => $purpose,
            'counts' => $counts, 'warnings' => $warnings, 'source_sha256' => hash_file('sha256', $path)];
    }

    public function import(string $path, int $year): array
    {
        $plan = $this->inspect($path);
        $source = file_get_contents($path);
        return DB::transaction(function () use ($plan, $source, $path, $year) {
            $period = PeriodeKinerja::where('tahun', $year)->lockForUpdate()->first();
            if ($period && DB::table('cascading_workbook_templates')->where('periode_kinerja_id', $period->id)->exists()) {
                $existing = DB::table('cascading_workbook_templates')->where('periode_kinerja_id', $period->id)->first();
                if ($existing->source_sha256 !== $plan['source_sha256']) {
                    throw new RuntimeException('Periode sudah memiliki impor dari sumber berbeda.');
                }
                return ['period_id' => $period->id, 'already_imported' => true, 'counts' => $plan['counts'], 'warnings' => $plan['warnings']];
            }
            if ($period) {
                if ($period->status !== 'draft') {
                    throw new RuntimeException('Impor hanya dapat mengisi periode draft kosong.');
                }
                foreach (AnnualIndicatorService::TABLES as $table) {
                    if (DB::table($table)->where('periode_kinerja_id', $period->id)->exists()) {
                        throw new RuntimeException('Periode sudah berisi data: '.$table);
                    }
                }
            } else {
                $period = PeriodeKinerja::create(['tahun' => $year, 'status' => 'draft', 'nama_organisasi' => $plan['organization']]);
            }
            $period->update(['nama_organisasi' => $plan['organization'], 'tujuan' => $plan['tujuan'], 'rekonstruksi' => false]);
            $positions = DB::table('kinerja_penanggung_jawabs')->where('is_active', true)->get()->keyBy('name');
            $reader = new Xlsx();
            $reader->setLoadSheetsOnly([self::SHEET]);
            $file = tempnam(sys_get_temp_dir(), 'cascade-source-');
            try {
                file_put_contents($file, $source);
                $book = $reader->load($file);
            } finally {
                unlink($file);
            }
            $sheet = $book->getActiveSheet();
            $ids = $bindings = $structure = [];
            foreach ($plan['nodes'] as $key => $node) {
                $table = AnnualIndicatorService::TABLES[$node['level']];
                $position = $positions[$node['owner']] ?? null;
                if (! $position) {
                    throw new RuntimeException('Jabatan aktif tidak ditemukan: '.$node['owner']);
                }
                $data = ['name' => $node['name'], 'kode_cascading' => $node['code'], 'periode_kinerja_id' => $period->id,
                    'lineage_id' => (string) Str::uuid(), 'is_active' => true, 'sort_order' => count($ids),
                    'jabatan' => trim((string) $sheet->getCell($node['owner_cell'])->getValue()),
                    'created_at' => now(), 'updated_at' => now()];
                if ($node['level'] === 'sasaran') {
                    $data['parent_id'] = $node['parent'] ? $ids[$node['parent']] : 0;
                    $data['tingkat'] = $node['parent'] ? 2 : 1;
                } else {
                    $data['tujuan'] = $node['name'];
                    $data['sasaran_strategis_id'] = $ids[$node['strategic']];
                    $data['penanggung_jawab_id'] = $position->id;
                    if ($node['level'] > 1) {
                        $data['indikator_fitur'.($node['level'] - 1).'_id'] = $ids[$node['parent']];
                    }
                    if ($node['level'] === 4) {
                        $units = DB::table('kinerja_penanggung_jawab_units')->where('penanggung_jawab_id', $position->id)->pluck('location_id')->map(fn ($id) => (int) $id)->all();
                        if (! $units && $position->pic_id) {
                            $location = DB::table('pics')->where('id', $position->pic_id)->value('location_id');
                            $units = $location ? [(int) $location] : [];
                        }
                        $data['location_id'] = json_encode($units);
                    }
                }
                $id = $ids[$key] = DB::table($table)->insertGetId($data);
                $shape = array_intersect_key($data, array_flip(['parent_id', 'sasaran_strategis_id', 'penanggung_jawab_id', 'indikator_fitur1_id', 'indikator_fitur2_id', 'indikator_fitur3_id']));
                $structure[$table][$id] = $shape;
                foreach ([$node['name_cell'] => 'name', $node['code_cell'] => 'kode_cascading'] as $cell => $field) {
                    if ($cell !== '') {
                        $bindings[$cell] = ['table' => $table, 'id' => $id, 'field' => $field, 'initial' => $data[$field],
                            'raw' => $sheet->getCell($cell)->getValue(), 'type' => $sheet->getCell($cell)->getDataType()];
                    }
                }
                if ($node['level'] !== 'sasaran' && ! isset($bindings[$node['owner_cell']])) {
                    $bindings[$node['owner_cell']] = ['table' => $table, 'id' => $id, 'field' => 'jabatan', 'initial' => $data['jabatan'],
                        'raw' => $sheet->getCell($node['owner_cell'])->getValue(), 'type' => 's'];
                }
            }
            $book->disconnectWorksheets();
            DB::table('cascading_workbook_templates')->insert([
                'periode_kinerja_id' => $period->id, 'source_name' => basename($path), 'source_sha256' => $plan['source_sha256'],
                'sheet_name' => self::SHEET, 'workbook_base64' => base64_encode($source),
                'bindings' => json_encode($bindings), 'structure' => json_encode($structure), 'created_at' => now(), 'updated_at' => now(),
            ]);
            return ['period_id' => $period->id, 'already_imported' => false, 'counts' => $plan['counts'], 'warnings' => $plan['warnings']];
        });
    }
}