<?php

namespace App\Services;

use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class CascadingDisplayColor
{
    public static function normalize(?string $color): ?string
    {
        return $color && preg_match('/^#[0-9a-f]{6}$/i', $color) ? strtoupper($color) : null;
    }

    public static function text(string $color): string
    {
        $rgb = str_split(ltrim($color, '#'), 2);
        $linear = array_map(function ($value) {
            $value = hexdec($value) / 255;
            return $value <= 0.04045 ? $value / 12.92 : (($value + 0.055) / 1.055) ** 2.4;
        }, $rgb);
        return 0.2126 * $linear[0] + 0.7152 * $linear[1] + 0.0722 * $linear[2] > 0.179 ? '000000' : 'FFFFFF';
    }

    /** Recolor bound cells and their full merged area, preserving uncolored detail cells. */
    public static function apply(Worksheet $sheet, string $cell, ?string $color, bool $force = false): void
    {
        $color = self::normalize($color);
        if (! $color) {
            return;
        }
        $fill = $sheet->getStyle($cell)->getFill();
        if (! $force && ($fill->getFillType() !== Fill::FILL_SOLID || in_array($fill->getStartColor()->getRGB(), ['FFFFFF', '000000'], true))) {
            return;
        }
        $range = $cell;
        foreach ($sheet->getMergeCells() as $merged) {
            if ($sheet->getCell($cell)->isInRange($merged)) {
                $range = $merged;
                break;
            }
        }
        self::range($sheet, $range, $color);
    }

    public static function range(Worksheet $sheet, string $range, string $color): void
    {
        $sheet->getStyle($range)->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB(ltrim($color, '#'));
        $sheet->getStyle($range)->getFont()->getColor()->setRGB(self::text($color));
    }
}
