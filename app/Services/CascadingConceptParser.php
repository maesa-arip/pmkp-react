<?php

namespace App\Services;

use PhpOffice\PhpSpreadsheet\Reader\Xlsx;
use RuntimeException;

class CascadingConceptParser
{
    public const SHEETS = ['cascading', 'direktur', 'ASD ', 'PELAYANAN', 'PENUNJANG'];

    public const LABELS = ['tujuan_strategis' => 'Tujuan strategis', 'program' => 'Program', 'sasaran_strategis' => 'Sasaran strategis', 'iku' => 'Indikator Kinerja Utama', 'sasaran' => 'Sasaran jabatan', 'kegiatan' => 'Kegiatan', 'indikator_kinerja' => 'Indikator kinerja', 'indikator_mutu' => 'Indikator mutu'];

    public function parse(string $path): array
    {
        $reader = new Xlsx();
        $reader->setLoadSheetsOnly(self::SHEETS);
        $book = $reader->load($path);
        foreach (self::SHEETS as $name) {
            if (! $book->getSheetByName($name)) {
                throw new RuntimeException('Sheet tidak ditemukan: '.$name);
            }
        }
        $nodes = $bindings = $warnings = [];
        $read = fn ($s, $c) => trim((string) $book->getSheetByName($s)->getCell($c)->getValue());
        $code = fn ($s, $c) => trim($read($s, $c), ". \t\r\n");
        $bind = function ($s, $c, $key, $field, $initial) use (&$bindings, $book) {
            $cell = $book->getSheetByName($s)->getCell($c);
            $bindings[$s][$c] = ['key' => $key, 'field' => $field, 'initial' => $initial, 'raw' => is_object($cell->getValue()) ? (string) $cell->getValue() : $cell->getValue(), 'type' => $cell->getDataType()];
        };
        $add = function ($s, $cell, $codeCell, $kind, $tier, $office, $parent = null, $note = null) use (&$nodes, $read, $code, $bind) {
            $key = $s.'!'.$cell;
            $name = $read($s, $cell);
            if ($name === '') {
                throw new RuntimeException('Uraian kosong: '.$key);
            }
            $nodes[$key] = ['kind' => $kind, 'tier' => $tier, 'office' => $office, 'code' => $codeCell ? $code($s, $codeCell) : null, 'name' => $name,
                'parent_key' => $parent, 'relation_note' => $note, 'source_sheet' => $s, 'source_cell' => $cell];
            $bind($s, $cell, $key, 'name', $name);
            if ($codeCell) {
                $bind($s, $codeCell, $key, 'code', $nodes[$key]['code']);
            }

            return $key;
        };
        $purpose = $add('direktur', 'F3', null, 'tujuan_strategis', 'organisasi', 'DIREKTUR');
        $program = $add('direktur', 'F5', null, 'program', 'organisasi', 'DIREKTUR', $purpose);
        $goals = [];
        foreach ([8, 9] as $r) {
            $goals[] = $add('direktur', 'D'.$r, 'C'.$r, 'sasaran_strategis', 'organisasi', 'DIREKTUR', $purpose);
        }
        $ikus = [];
        foreach ([12, 13, 14] as $i => $r) {
            $ikus[] = $add('direktur', 'D'.$r, 'C'.$r, 'iku', 'organisasi', 'DIREKTUR', $goals[$i === 2 ? 1 : 0]);
        }
        foreach ([16, 18, 20] as $i => $r) {
            $activity = $add('direktur', 'D'.$r, 'C'.$r, 'kegiatan', 'direktur', 'DIREKTUR', $ikus[$i]);
            $add('direktur', 'E'.($r + 1), 'D'.($r + 1), 'indikator_kinerja', 'direktur', 'DIREKTUR', $activity);
        }
        foreach (['ASD ', 'PELAYANAN', 'PENUNJANG'] as $s) {
            foreach (['D8' => $goals[0], 'D9' => $goals[1], 'D12' => $ikus[0], 'D13' => $ikus[1], 'D14' => $ikus[2]] as $cell => $key) {
                $bind($s, $cell, $key, 'name', $nodes[$key]['name']);
                $bind($s, 'C'.substr($cell, 1), $key, 'code', $nodes[$key]['code']);
            }
            $bind($s, $s === 'ASD ' ? 'F3' : 'D3', $purpose, 'name', $nodes[$purpose]['name']);
            $bind($s, $s === 'ASD ' ? 'F5' : 'D5', $program, 'name', $nodes[$program]['name']);
        }
        $upper = [
            ['ASD ', 'E', 'F', 'G', 17, 28, [17, 22, 27], 'kegiatan', 'WADIR ADMINISTRASI DAN SUMBER DAYA'],
            ['PELAYANAN', 'C', 'D', 'D', 17, 27, [17, 21, 25], 'sasaran', 'WADIR PELAYANAN'],
            ['PENUNJANG', 'B', 'C', 'D', 20, 29, [20, 24, 28], 'kegiatan', 'WADIR PELAYANAN PENUNJANG'],
        ];
        $upperIndicators = [];
        foreach ($upper as [$s,$rc,$rn,$in,$start,$end,$rootRows,$kind,$office]) {
            $parent = null;
            foreach (range($start, $end) as $r) {
                if (in_array($r, $rootRows, true)) {
                    $parent = $add($s, $rn.$r, $rc.$r, $kind, 'wadir', $office, null, 'Rujukan IKU belum dinyatakan secara eksplisit pada sheet sumber.');
                } elseif ($read($s, $in.$r) !== '') {
                    $ic = $s === 'PELAYANAN' ? 'C' : $rn;
                    $k = $add($s, $in.$r, $ic.$r, 'indikator_kinerja', 'wadir', $office, $parent);
                    $upperIndicators[$s][$nodes[$k]['code']] = $k;
                }
            }
        }
        $lower = [
            ['ASD ', 'B', 'C', 'D', 31, 42, 30],
            ['ASD ', 'E', 'F', 'G', 31, 42, 30],
            ['ASD ', 'H', 'I', 'J', 31, 42, 30],
            ['PELAYANAN', 'B', 'C', 'D', 30, 38, 29],
            ['PELAYANAN', 'F', 'G', 'H', 30, 38, 29],
            ['PENUNJANG', 'C', 'D', 'E', 32, 40, 31],
            ['PENUNJANG', 'H', 'I', 'J', 32, 40, 31],
        ];
        $headIndicators = [];
        foreach ($lower as [$s,$ac,$an,$in,$start,$end,$header]) {
            $office = $read($s, $ac.$header);
            $parent = null;
            foreach (range($start, $end) as $r) {
                if (preg_match('/^\\d+(?:\\.[a-z0-9]+)*$/i', $code($s, $ac.$r))) {
                    $prefix = implode('.', array_slice(explode('.', $code($s, $ac.$r)), 0, 2));
                    $p = $upperIndicators[$s][$prefix] ?? null;
                    $parent = $add($s, $an.$r, $ac.$r, 'kegiatan', 'kabag_kabid', $office, $p, $p ? null : 'Kode induk tidak ditemukan pada indikator Wadir.');
                } elseif ($read($s, $in.$r) !== '') {
                    $k = $add($s, $in.$r, $an.$r, 'indikator_kinerja', 'kabag_kabid', $office, $parent);
                    $headIndicators[$s][$nodes[$k]['code']][] = $k;
                } elseif ($read($s, $an.$r) !== '') {
                    $warnings[] = $s.'!'.$an.$r.' memiliki nomor tanpa uraian.';
                }
            }
        }
        $teams = [
            ['ASD ', 'B', 'C', 'D', 44, 89], ['ASD ', 'E', 'F', 'G', 44, 69], ['ASD ', 'H', 'I', 'J', 44, 69],
            ['PELAYANAN', 'B', 'C', 'D', 39, 148], ['PELAYANAN', 'F', 'G', 'H', 39, 174],
            ['PENUNJANG', 'B', 'C', 'D', 41, 85], ['PENUNJANG', 'H', 'I', 'J', 41, 85],
        ];
        foreach ($teams as [$s,$ac,$an,$in,$start,$end]) {
            $office = '';
            $parent = null;
            foreach (range($start, $end) as $r) {
                $text = $read($s, $ac.$r);
                if (str_starts_with(mb_strtoupper($text), 'TIM KERJA')) {
                    $office = $text;
                    $parent = null;

                    continue;
                }
                if (preg_match('/^\\d+(?:\\.[a-z0-9]+)*$/i', $code($s, $ac.$r))) {
                    if ($read($s, $an.$r) === '') {
                        $warnings[] = $s.'!'.$ac.$r.' memiliki nomor tanpa uraian.';

                        continue;
                    }
                    $parts = explode('.', $code($s, $ac.$r));
                    array_pop($parts);
                    $candidates = $headIndicators[$s][implode('.', $parts)] ?? [];
                    $p = count($candidates) === 1 ? $candidates[0] : null;
                    $parent = $add($s, $an.$r, $ac.$r, 'kegiatan', 'tim_kerja', $office, $p, $p ? null : 'Indikator kinerja induk perlu ditinjau: '.implode('.', $parts));
                } elseif ($read($s, $in.$r) !== '') {
                    $k = $add($s, $in.$r, $an.$r, 'indikator_mutu', 'tim_kerja', $office, $parent, $parent ? null : 'Kegiatan tim kerja induk belum ditemukan.');
                    if ($parent && ! str_starts_with($nodes[$k]['code'], $nodes[$parent]['code'].'.')) {
                        $nodes[$k]['relation_note'] = 'Kode sumber tidak mengikuti awalan kegiatan; hubungan mengikuti kelompok baris pada Excel.';
                    }
                }
            }
        }
        // Map the summary sheet to the detailed definitions, preserving its display codes.
        $summary = [
            ['ASD ', 'F', 'G', [13, 18, 23], 13, 26, ['A', 'B', 'C'], ['E', 'F', 'G'], ['H', 'I', 'J']],
            ['PELAYANAN', 'O', 'P', [13, 18, 22], 13, 26, ['L', 'M', 'N'], ['Q', 'R', 'S']],
            ['PENUNJANG', 'X', 'Y', [13, 18, 22], 13, 26, ['U', 'V', 'W'], ['Z', 'AA', 'AB']],
        ];
        $match = function ($s, $name, $tier) use (&$nodes) {
            $normalize = fn ($v) => mb_strtolower(preg_replace('/\\s+/u', ' ', trim($v)));

            return array_keys(array_filter($nodes, fn ($n) => $n['source_sheet'] === $s && $n['tier'] === $tier && $normalize($n['name']) === $normalize($name)));
        };
        foreach ($summary as $config) {
            [$s,$rootName,$indicatorName,$rootRows,$start,$end] = $config;
            foreach (range($start, $end) as $r) {
                $cell = (in_array($r, $rootRows, true) ? $rootName : $indicatorName).$r;
                if ($read('cascading', $cell) === '') {
                    continue;
                }
                $keys = $match($s, $read('cascading', $cell), 'wadir');
                if (count($keys) !== 1) {
                    throw new RuntimeException('Pemetaan ringkasan ambigu: cascading!'.$cell);
                }
                $key = $keys[0];
                $bind('cascading', $cell, $key, 'name', $nodes[$key]['name']);
                $col = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString(in_array($r, $rootRows, true) ? $rootName : $indicatorName) - 1;
                $bind('cascading', \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($col).$r, $key, 'code', $nodes[$key]['code']);
            }
            foreach (array_slice($config, 6) as [$ac,$an,$in]) {
                foreach (range(30, 41) as $r) {
                    $activity = preg_match('/^\\d+(?:\\.[a-z0-9]+)*$/i', $code('cascading', $ac.$r));
                    $cell = ($activity ? $an : $in).$r;
                    if ($read('cascading', $cell) === '') {
                        continue;
                    }
                    $keys = $match($s, $read('cascading', $cell), 'kabag_kabid');
                    if (count($keys) !== 1) {
                        throw new RuntimeException('Pemetaan ringkasan ambigu: '.$cell);
                    }
                    $key = $keys[0];
                    $bind('cascading', $cell, $key, 'name', $nodes[$key]['name']);
                    $bind('cascading', ($activity ? $ac : $an).$r, $key, 'code', $nodes[$key]['code']);
                }
            }
        }
        foreach (['B7' => $goals[0], 'B9' => $goals[1], 'G7' => $ikus[0], 'G8' => $ikus[1], 'G9' => $ikus[2], 'F4' => $purpose] as $cell => $key) {
            $bind('cascading', $cell, $key, 'name', $nodes[$key]['name']);
        }
        foreach (['F7' => $ikus[0], 'F8' => $ikus[1], 'F9' => $ikus[2]] as $cell => $key) {
            $bind('cascading', $cell, $key, 'code', $nodes[$key]['code']);
        }
        app(CascadingColorHierarchy::class)->apply($book, $nodes, $bindings);
        $seen = [];
        foreach ($nodes as $key => &$node) {
            $duplicate = $node['source_sheet'].'|'.$node['office'].'|'.$node['kind'].'|'.$node['parent_key'].'|'.$node['code'];
            if ($node['code'] && isset($seen[$duplicate])) {
                $node['relation_note'] = trim(($node['relation_note'] ?? '').' Kode yang sama dipakai lebih dari satu baris pada sumber.');
            }
            $seen[$duplicate] = $key;
        }
        unset($node);
        $book->disconnectWorksheets();

        return compact('nodes', 'bindings', 'warnings');
    }
}
