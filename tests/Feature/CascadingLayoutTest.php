<?php

namespace Tests\Feature;

use App\Services\CascadingExportService;
use App\Services\CascadingHierarchyService;
use Tests\TestCase;

class CascadingLayoutTest extends TestCase
{
    private function levels(): array
    {
        $common = ['name' => 'Nama contoh', 'tujuan' => '', 'is_active' => 1, 'sort_order' => 0, 'kode_cascading' => '', 'jabatan' => ''];

        return [
            'sasaran' => [['id' => 999, 'name' => 'Sasaran legacy tidak boleh masuk']],
            1 => [$common + ['id' => 91]],
            2 => [$common + ['id' => 72, 'indikator_fitur1_id' => 91]],
            3 => [$common + ['id' => 88, 'indikator_fitur2_id' => 72]],
            4 => [array_replace($common, ['id' => 571, 'name' => '=SUM(A1:A3)', 'indikator_fitur3_id' => 88])],
        ];
    }

    public function test_codes_follow_parents_instead_of_database_ids(): void
    {
        $service = new CascadingHierarchyService();
        $nodes = $service->decorate($this->levels());
        $this->assertEquals('1', $nodes[1][0]['display_code']);
        $this->assertEquals('1.1', $nodes[2][0]['display_code']);
        $this->assertEquals('1.1.a', $nodes[3][0]['display_code']);
        $this->assertEquals('1.1.a.1', $nodes[4][0]['display_code']);
        $this->assertCount(1, $service->build($this->levels()));
    }

    public function test_custom_codes_are_preserved_and_automatic_codes_avoid_collisions(): void
    {
        $levels = $this->levels();
        $levels[3][0]['kode_cascading'] = '1.1.b';
        $levels[3][] = array_replace($levels[3][0], ['id' => 89, 'kode_cascading' => '']);
        $nodes = (new CascadingHierarchyService())->decorate($levels);
        $this->assertEquals('1.1.b', $nodes[3][0]['display_code']);
        $this->assertEquals('1.1.a', $nodes[3][1]['display_code']);
        $this->assertEquals('1.1.b.1', $nodes[4][0]['display_code']);
    }

    public function test_codes_stay_consistent_when_inactive_siblings_are_hidden_and_letters_pass_z(): void
    {
        $levels = $this->levels();
        $base = $levels[3][0];
        $levels[3] = [];
        for ($i = 0; $i < 28; $i++) {
            $levels[3][] = array_replace($base, ['id' => 88 + $i, 'is_active' => $i === 1 ? 0 : 1]);
        }
        $service = new CascadingHierarchyService();
        $all = $service->decorate($levels);
        $tree = $service->build($levels);
        $this->assertEquals('1.1.aa', $all[3][26]['display_code']);
        $this->assertEquals('1.1.c', $tree[0]['children'][0]['children'][1]['display_code']);
    }

    public function test_excel_uses_the_same_codes_literal_text_and_connected_boxes(): void
    {
        $levels = $this->levels();
        $book = (new CascadingExportService())->build(['period' => ['tahun' => 2027, 'nama_organisasi' => 'RS Uji', 'tujuan' => 'Tujuan uji', 'status' => 'draft'], 'levels' => $levels]);
        $sheet = $book->getActiveSheet();
        $values = [];
        foreach ($sheet->getCellCollection()->getCoordinates() as $coordinate) {
            $cell = $sheet->getCell($coordinate);
            if ($cell->getValue() !== null) {
                $values[] = $cell->getValue();
                $this->assertNotEquals('f', $cell->getDataType());
            }
        }
        foreach (['1', '1.1', '1.1.a', '1.1.a.1', '=SUM(A1:A3)'] as $expected) {
            $this->assertContains($expected, $values);
        }
        $this->assertNotContains('Sasaran legacy tidak boleh masuk', $values);
        $this->assertEquals('landscape', $sheet->getPageSetup()->getOrientation());
        $this->assertGreaterThan(8, count($sheet->getMergeCells()));
        $this->assertTrue(collect($sheet->getCellCollection()->getCoordinates())->contains(fn ($c) => $sheet->getStyle($c)->getBorders()->getBottom()->getBorderStyle() === 'thin'));
    }

    public function test_disconnected_active_nodes_are_reported_instead_of_silently_omitted(): void
    {
        $levels = $this->levels();
        $levels[2][0]['is_active'] = false;
        $service = new CascadingHierarchyService();
        $issues = $service->unlinked($levels, $service->build($levels));
        $this->assertEquals([88, 571], array_column($issues, 'id'));
    }
}
