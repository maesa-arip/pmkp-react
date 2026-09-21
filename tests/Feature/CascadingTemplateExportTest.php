<?php

namespace Tests\Feature;

use App\Services\CascadingExportService;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Tests\TestCase;

class CascadingTemplateExportTest extends TestCase
{
    private function snapshot(): array
    {
        $common = ['tujuan' => '', 'jabatan' => '', 'is_active' => true, 'sort_order' => 0, 'kode_cascading' => ''];
        $levels = [1 => [$common + ['id' => 1, 'name' => 'Meningkatnya kualitas pelayanan']], 2 => [], 3 => [], 4 => []];
        $owners = ['WADIR ADMINISTRASI DAN SUMBER DAYA', 'WADIR PELAYANAN', 'WADIR PENUNJANG'];
        $departments = [
            ['KABAG PERENCANAAN', 'KABAG KEUANGAN', 'KABAG ADMINISTRASI UMUM'],
            ['KABID PELAYANAN MEDIK', 'KABID KEPERAWATAN'],
            ['KABID PENUNJANG MEDIK', 'KABID PENUNJANG NON MEDIK'],
        ];
        $id = 1;
        foreach ($owners as $index => $owner) {
            $levels[2][] = array_replace($common, ['id' => $index + 1, 'indikator_fitur1_id' => 1, 'name' => 'Peningkatan kinerja '.$owner, 'jabatan' => $owner, 'penanggung_jawab_id' => $index + 1]);
            foreach ($departments[$index] as $department) {
                $levels[3][] = array_replace($common, ['id' => $id, 'indikator_fitur2_id' => $index + 1, 'name' => 'Terselenggaranya pengelolaan kegiatan '.$department.' sesuai standar', 'jabatan' => $department, 'penanggung_jawab_id' => 10 + $id]);
                $levels[4][] = array_replace($common, ['id' => $id, 'indikator_fitur3_id' => $id, 'name' => 'Persentase capaian pelayanan '.$department.' sesuai target']);
                $id++;
            }
        }

        return ['period' => ['tahun' => 2027, 'nama_organisasi' => 'RS Uji', 'tujuan' => 'Meningkatnya pelayanan kesehatan', 'status' => 'draft'], 'levels' => $levels];
    }

    private function coordinates($sheet, string $value): array
    {
        return array_values(array_filter($sheet->getCellCollection()->getCoordinates(), fn ($coordinate) => $sheet->getCell($coordinate)->getValue() === $value));
    }

    public function test_template_groups_three_directorates_and_seven_departments_horizontally(): void
    {
        $data = $this->snapshot();
        $book = app(CascadingExportService::class)->build($data);
        $sheet = $book->getActiveSheet();
        $upper = array_map(fn ($node) => $this->coordinates($sheet, $node['jabatan'])[0], $data['levels'][2]);
        $lower = array_map(fn ($node) => $this->coordinates($sheet, $node['jabatan'])[0], $data['levels'][3]);
        $this->assertSame(['A', 'P', 'Z'], array_map(fn ($cell) => preg_replace('/\d/', '', $cell), $upper));
        $this->assertSame(['A', 'F', 'K', 'P', 'U', 'Z', 'AE'], array_map(fn ($cell) => preg_replace('/\d/', '', $cell), $lower));
        $this->assertCount(1, array_unique(array_map(fn ($cell) => preg_replace('/\D/', '', $cell), $lower)));
        foreach ($data['levels'][3] as $activity) {
            $coordinate = $this->coordinates($sheet, $activity['name'])[0];
            $this->assertSame('C0C0C0', $sheet->getStyle($coordinate)->getFill()->getStartColor()->getRGB());
        }
        foreach ($data['levels'][4] as $indicator) {
            $this->assertCount(1, $this->coordinates($sheet, $indicator['name']));
        }
        $this->assertSame('Arial', $book->getDefaultStyle()->getFont()->getName());
        $this->assertSame('landscape', $sheet->getPageSetup()->getOrientation());
        $this->assertStringStartsWith('A1:AH', $sheet->getPageSetup()->getPrintArea());
        $book->disconnectWorksheets();
    }

    public function test_reference_colors_follow_the_sasaran_through_each_branch(): void
    {
        $data = $this->snapshot();
        foreach ([2 => 'Meningkatnya mutu layanan', 3 => 'Terpenuhinya sumber daya sesuai standar'] as $id => $name) {
            $root = $data['levels'][1][0];
            $root['id'] = $id;
            $root['name'] = $name;
            $data['levels'][1][] = $root;
            $data['levels'][2][$id - 1]['indikator_fitur1_id'] = $id;
        }
        $sheet = app(CascadingExportService::class)->build($data)->getActiveSheet();
        foreach ($data['levels'][3] as $activity) {
            $color = ['C0C0C0', 'FFFF00', 'FF8080'][$activity['indikator_fitur2_id'] - 1];
            $coordinate = $this->coordinates($sheet, $activity['name'])[0];
            $this->assertSame($color, $sheet->getStyle($coordinate)->getFill()->getStartColor()->getRGB());
        }
    }

    public function test_shared_owners_preserve_each_parent_and_incomplete_branches(): void
    {
        $data = $this->snapshot();
        $second = $data['levels'][2][0];
        $second['id'] = 99;
        $second['name'] = 'Program lain pada jabatan sama';
        $data['levels'][2][] = $second;
        $activity = $data['levels'][3][0];
        $activity['id'] = 99;
        $activity['indikator_fitur2_id'] = 99;
        $activity['name'] = 'Kegiatan lain pada jabatan sama';
        $data['levels'][3][] = $activity;
        $root = $data['levels'][1][0];
        $root['id'] = 88;
        $root['name'] = 'Sasaran tanpa program';
        $data['levels'][1][] = $root;
        $data['levels'][4][0]['name'] = '=SUM(A1:A3)';
        $data['levels'][4][0]['kode_cascading'] = '001.02.a.01';
        $sheet = app(CascadingExportService::class)->build($data)->getActiveSheet();
        $this->assertCount(1, $this->coordinates($sheet, $second['jabatan']));
        $this->assertCount(1, $this->coordinates($sheet, $activity['jabatan']));
        $this->assertCount(1, $this->coordinates($sheet, $activity['name']));
        $this->assertCount(1, $this->coordinates($sheet, $root['name']));
        $this->assertCount(1, $this->coordinates($sheet, '001.02.a.01'));
        $coordinate = $this->coordinates($sheet, '=SUM(A1:A3)')[0];
        $this->assertSame('s', $sheet->getCell($coordinate)->getDataType());
    }

    public function test_long_text_and_empty_tree_survive_xlsx_round_trip(): void
    {
        $data = $this->snapshot();
        $data['levels'][4][0]['name'] = str_repeat('Indikator layanan panjang dengan kata yang terbungkus ', 60);
        $book = app(CascadingExportService::class)->build($data);
        $file = tempnam(sys_get_temp_dir(), 'cascading-');
        try {
            (new Xlsx($book))->save($file);
            $loaded = IOFactory::load($file);
            $sheet = $loaded->getActiveSheet();
            $this->assertCount(1, $this->coordinates($sheet, $data['levels'][4][0]['name']));
            foreach ($sheet->getRowDimensions() as $dimension) {
                $this->assertLessThanOrEqual(409, $dimension->getRowHeight());
            }
            foreach ($data['levels'][4] as $indicator) {
                $this->assertCount(1, $this->coordinates($sheet, $indicator['name']));
            }
            $loaded->disconnectWorksheets();
        } finally {
            unlink($file);
            $book->disconnectWorksheets();
        }
        $data['levels'] = [];
        $empty = app(CascadingExportService::class)->build($data)->getActiveSheet();
        $this->assertCount(1, $this->coordinates($empty, 'Belum ada hierarki indikator aktif pada periode ini.'));
    }

    public function test_version_two_archive_still_uses_the_chart_layout(): void
    {
        $data = $this->snapshot();
        $data['template_version'] = '2';
        $service = app(CascadingExportService::class);
        $method = new \ReflectionMethod($service, 'response');
        $method->setAccessible(true);
        $response = $method->invoke($service, $data, 123);
        ob_start();
        try {
            $response->sendContent();
            $bytes = ob_get_contents();
        } finally {
            ob_end_clean();
        }
        $file = tempnam(sys_get_temp_dir(), 'cascading-');
        try {
            file_put_contents($file, $bytes);
            $book = IOFactory::load($file);
            $sheet = $book->getActiveSheet();
            $this->assertArrayHasKey('A2:AC3', $sheet->getMergeCells());
            $this->assertCount(1, $this->coordinates($sheet, 'SASARAN'));
            $book->disconnectWorksheets();
        } finally {
            unlink($file);
        }
    }
}