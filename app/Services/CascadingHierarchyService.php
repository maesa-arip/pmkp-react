<?php

namespace App\Services;

class CascadingHierarchyService
{
    public const TABLES = ['1' => 'indikator_fitur1s', '2' => 'indikator_fitur2s', '3' => 'indikator_fitur3s', '4' => 'indikator_fitur4s'];

    /** The tree and displayed codes are shared by the editor, chart and export. */
    public function build(array $levels, bool $activeOnly = true): array
    {
        $groups = [];
        foreach (self::TABLES as $level => $table) {
            $rows = array_map(fn ($row) => (array) $row, $levels[$level] ?? []);
            usort($rows, fn ($a, $b) => [(int) ($a['sort_order'] ?? 0), (int) $a['id']] <=> [(int) ($b['sort_order'] ?? 0), (int) $b['id']]);
            foreach ($rows as $row) {
                $parent = $level > 1 ? (int) $row['indikator_fitur'.($level - 1).'_id'] : 0;
                $groups[$level][$parent][] = $row;
            }
        }
        // Assign codes before hiding inactive rows so preview and Excel stay consistent.
        $walk = function (int $level, int $parent, string $prefix) use (&$walk, $groups, $activeOnly): array {
            $siblings = $groups[$level][$parent] ?? [];
            $reserved = array_fill_keys(array_map(fn ($row) => strtolower(trim($row['kode_cascading'] ?? '')), $siblings), true);
            $sequence = 1;
            $result = [];
            foreach ($siblings as $row) {
                $code = trim($row['kode_cascading'] ?? '');
                if ($code === '') {
                    do {
                        $suffix = $level === 3 ? $this->letters($sequence++) : (string) $sequence++;
                        $code = $prefix === '' ? $suffix : rtrim($prefix, '.').'.'.$suffix;
                    } while (isset($reserved[strtolower($code)]));
                    $reserved[strtolower($code)] = true;
                }
                $row['display_code'] = $code;
                $row['level'] = (string) $level;
                $row['children'] = $level < 4 ? $walk($level + 1, (int) $row['id'], $code) : [];
                if (! $activeOnly || ($row['is_active'] ?? true)) {
                    $result[] = $row;
                }
            }

            return $result;
        };

        return $walk(1, 0, '');
    }

    public function decorate(array $levels): array
    {
        $codes = [];
        $visit = function ($nodes) use (&$visit, &$codes) {
            foreach ($nodes as $node) {
                $codes[$node['level']][$node['id']] = $node['display_code'];
                $visit($node['children']);
            }
        };
        $visit($this->build($levels, false));
        foreach ($levels as $level => &$rows) {
            $rows = array_map(function ($row) use ($codes, $level) {
                $row = (array) $row;
                $row['display_code'] = $codes[$level][$row['id']] ?? '';

                return $row;
            }, $rows);
        }

        return $levels;
    }

    public function unlinked(array $levels, array $tree): array
    {
        $seen = [];
        $visit = function ($nodes) use (&$visit, &$seen) {
            foreach ($nodes as $node) {
                $seen[$node['level'].':'.$node['id']] = true;
                $visit($node['children']);
            }
        };
        $visit($tree);
        $missing = [];
        foreach (self::TABLES as $level => $table) {
            foreach ($levels[$level] ?? [] as $row) {
                $row = (array) $row;
                if (($row['is_active'] ?? true) && ! isset($seen[$level.':'.$row['id']])) {
                    $missing[] = ['level' => (string) $level, 'id' => $row['id'], 'name' => $row['name']];
                }
            }
        }

        return $missing;
    }

    private function letters(int $number): string
    {
        $letters = '';
        while ($number > 0) {
            $number--;
            $letters = chr(97 + $number % 26).$letters;
            $number = intdiv($number, 26);
        }

        return $letters;
    }
}
