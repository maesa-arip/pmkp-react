<?php

namespace App\Services;

use PhpOffice\PhpSpreadsheet\Spreadsheet;

class CascadingColorHierarchy
{
    // Only the user-confirmed grey, yellow and pink paths are recognized.
    public const IKUS = ['grey' => 'direktur!D12', 'yellow' => 'direktur!D13', 'pink' => 'direktur!D14'];

    // User confirmed these purple detail cells follow the grey overview branch.
    public const CONFIRMED_DETAIL_COLORS = ['PELAYANAN!D17' => ['B2A1C7' => 'grey'], 'PENUNJANG!C20' => ['B2A1C7' => 'grey']];

    public function apply(Spreadsheet $book, array &$nodes, array $bindings): void
    {
        $palette = ['C0C0C0' => 'grey', 'DDD9C3' => 'grey', 'FFFF00' => 'yellow', 'FF8080' => 'pink'];
        $summary = [];
        foreach ($bindings['cascading'] as $cell => $binding) {
            if ($binding['field'] === 'name') {
                $summary[$binding['key']] = $cell;
            }
        }
        $wadirs = [];
        foreach ($nodes as $key => &$node) {
            if ($node['tier'] !== 'wadir' || ! in_array($node['kind'], ['kegiatan', 'sasaran'], true)) {
                continue;
            }
            $node['kind'] = 'kegiatan';
            $branch = $this->branch($book, $key, $node, $summary, $palette);
            $summaryBranch = $palette[$book->getSheetByName('cascading')->getStyle($summary[$key])->getFill()->getStartColor()->getRGB()] ?? null;
            if ($summaryBranch) {
                $wadirs[$node['source_sheet']][$summaryBranch][] = $key;
            }
            $node['parent_key'] = $branch ? self::IKUS[$branch] : null;
            $node['relation_note'] = $branch ? null : 'Warna kegiatan berbeda atau belum dikenal; hubungan IKU menunggu konfirmasi pengguna.';
        }
        unset($node);
        foreach ($nodes as $key => &$node) {
            if ($node['tier'] !== 'kabag_kabid' || $node['kind'] !== 'kegiatan') {
                continue;
            }
            $branch = $this->branch($book, $key, $node, $summary, $palette);
            $parents = $branch ? ($wadirs[$node['source_sheet']][$branch] ?? []) : [];
            $node['parent_key'] = count($parents) === 1 ? $parents[0] : null;
            $node['relation_note'] = $node['parent_key'] ? null : 'Warna atau kegiatan Wadir induk belum jelas; menunggu konfirmasi pengguna.';
        }
        unset($node);
    }

    private function branch(Spreadsheet $book, string $key, array $node, array $summary, array $palette): ?string
    {
        if (! isset($summary[$key])) {
            return null;
        }
        $overview = $book->getSheetByName('cascading')->getStyle($summary[$key])->getFill()->getStartColor()->getRGB();
        $detail = $book->getSheetByName($node['source_sheet'])->getStyle($node['source_cell'])->getFill()->getStartColor()->getRGB();
        $branch = $palette[$overview] ?? null;
        $detailBranch = $palette[$detail] ?? (self::CONFIRMED_DETAIL_COLORS[$key][$detail] ?? null);

        return $branch && $branch === $detailBranch ? $branch : null;
    }
}
