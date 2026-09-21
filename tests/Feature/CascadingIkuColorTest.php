<?php

namespace Tests\Feature;

use App\Models\PeriodeKinerja;
use App\Models\Pic;
use App\Models\User;
use App\Services\AnnualIndicatorService;
use App\Services\CascadingConceptImportService;
use App\Services\CascadingConceptService;
use App\Services\CascadingExportService;
use App\Services\CascadingFeatureAlignment;
use App\Services\CascadingSourceWorkbookService;
use App\Services\CascadingWorkbookImportService;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use Tests\TestCase;

class CascadingIkuColorTest extends TestCase
{
    use DatabaseTransactions;

    private function readExport(string $bytes): Spreadsheet
    {
        $file = tempnam(sys_get_temp_dir(), 'iku-color-');
        try {
            file_put_contents($file, $bytes);
            return IOFactory::load($file);
        } finally {
            unlink($file);
        }
    }

    public function test_color_edit_export_archive_copy_reset_and_period_guards(): void
    {
        $result = app(CascadingWorkbookImportService::class)->import(base_path('docs/CASCADING.xlsx'), 2098);
        app(CascadingConceptImportService::class)->import(base_path('docs/CASCADING.xlsx'), 2098);
        app(CascadingFeatureAlignment::class)->apply(2098);
        $period = PeriodeKinerja::findOrFail($result['period_id']);
        $period->update(['status' => 'aktif']);
        $this->actingAs(User::factory()->create(['pic_id' => Pic::firstOrFail()->id]));
        Gate::before(fn () => true);
        $concept = DB::table('cascading_concepts')->where('periode_kinerja_id', $period->id)->where('source_sheet', 'direktur')->where('source_cell', 'D12')->first();
        $iku = DB::table('indikator_fitur1s')->find($concept->legacy_id);
        $payload = array_merge((array) $iku, ['cascading_color' => '#123abc']);
        $url = route('kinerja.nodes', [$period->id, '1']);
        $this->post($url, $payload)->assertRedirect()->assertSessionHasNoErrors();
        $this->assertDatabaseHas('indikator_fitur1s', ['id' => $iku->id, 'cascading_color' => '#123ABC']);
        $this->get(route('kinerja.index', ['tahun' => 2098]))->assertOk()->assertInertia(fn ($page) => $page
            ->where('nodes.1', fn ($nodes) => collect($nodes)->firstWhere('id', $iku->id)['cascading_color'] === '#123ABC'));
        $response = $this->get(route('kinerja.export', $period->id))->assertOk();
        $book = $this->readExport($response->streamedContent());
        foreach (['cascading' => 'G7', 'direktur' => 'D12', 'ASD ' => 'F17', 'PELAYANAN' => 'D17', 'PENUNJANG' => 'C20'] as $sheet => $cell) {
            $this->assertSame('123ABC', $book->getSheetByName($sheet)->getStyle($cell)->getFill()->getStartColor()->getRGB(), $sheet.'!'.$cell);
            $this->assertSame('FFFFFF', $book->getSheetByName($sheet)->getStyle($cell)->getFont()->getColor()->getRGB());
        }
        $this->assertSame('FFFF00', $book->getSheetByName('cascading')->getStyle('G8')->getFill()->getStartColor()->getRGB());
        $book->disconnectWorksheets();
        $archive = DB::table('cascading_exports')->where('periode_kinerja_id', $period->id)->latest('id')->first();
        $payload['cascading_color'] = '#00FF00';
        $this->post($url, $payload)->assertSessionHasNoErrors();
        $old = $this->readExport($this->get(route('kinerja.exportArchive', $archive->id))->assertOk()->streamedContent());
        $this->assertSame('123ABC', $old->getSheetByName('cascading')->getStyle('G7')->getFill()->getStartColor()->getRGB());
        $old->disconnectWorksheets();
        $snapshot = app(CascadingConceptService::class)->snapshot(['period' => $period->toArray()]);
        $new = app(CascadingConceptService::class)->build(['period' => $period->toArray(), 'concept_workbook' => $snapshot]);
        $this->assertSame('00FF00', $new->getSheetByName('cascading')->getStyle('G7')->getFill()->getStartColor()->getRGB());
        $this->assertSame('000000', $new->getSheetByName('cascading')->getStyle('G7')->getFont()->getColor()->getRGB());
        $new->disconnectWorksheets();
        $copy = PeriodeKinerja::create(['tahun' => 2099, 'status' => 'draft', 'nama_organisasi' => 'RS Uji', 'tujuan' => $period->tujuan]);
        app(AnnualIndicatorService::class)->copyHierarchy($period->id, $copy);
        $this->assertDatabaseHas('indikator_fitur1s', ['periode_kinerja_id' => $copy->id, 'copied_from_id' => $iku->id, 'cascading_color' => '#00FF00']);
        $this->post($url, array_replace($payload, ['cascading_color' => 'red']))->assertSessionHasErrors('cascading_color');
        $this->post(route('kinerja.nodes', [$copy->id, '1']), $payload)->assertSessionHasErrors('sasaran_strategis_id');
        $this->assertDatabaseHas('indikator_fitur1s', ['id' => $iku->id, 'cascading_color' => '#00FF00']);
        $this->post($url, array_replace($payload, ['cascading_color' => null]))->assertSessionHasNoErrors();
        $this->assertDatabaseHas('indikator_fitur1s', ['id' => $iku->id, 'cascading_color' => null]);
        $snapshot = app(CascadingConceptService::class)->snapshot(['period' => $period->toArray()]);
        $reset = app(CascadingConceptService::class)->build(['period' => $period->toArray(), 'concept_workbook' => $snapshot]);
        $this->assertSame('BFBFBF', $reset->getSheetByName('cascading')->getStyle('G7')->getFill()->getStartColor()->getRGB());
        $this->assertSame('DDD9C3', $reset->getSheetByName('direktur')->getStyle('D12')->getFill()->getStartColor()->getRGB());
        $reset->disconnectWorksheets();
        $period->update(['status' => 'ditutup']);
        $this->post($url, $payload)->assertSessionHasErrors('name');
        $this->assertDatabaseHas('indikator_fitur1s', ['id' => $iku->id, 'cascading_color' => null]);
    }

    public function test_dynamic_export_uses_custom_color_for_root_and_branch(): void
    {
        $base = ['tujuan' => '', 'jabatan' => '', 'is_active' => true];
        $data = ['period' => ['tahun' => 2098, 'nama_organisasi' => 'RS Uji', 'tujuan' => '', 'status' => 'draft', 'feature_schema_version' => 2], 'levels' => [
            1 => [$base + ['id' => 1, 'name' => 'IKU', 'cascading_color' => '#123ABC']],
            2 => [$base + ['id' => 2, 'name' => 'Wadir', 'indikator_fitur1_id' => 1]],
            3 => [$base + ['id' => 3, 'name' => 'Kabag', 'indikator_fitur2_id' => 2]], 4 => [],
        ]];
        $book = app(CascadingExportService::class)->build($data);
        $sheet = $book->getActiveSheet();
        $matched = 0;
        foreach ($sheet->getCellCollection()->getCoordinates() as $cell) {
            if (in_array($sheet->getCell($cell)->getValue(), ['IKU', 'Kabag'], true)) {
                $this->assertSame('123ABC', $sheet->getStyle($cell)->getFill()->getStartColor()->getRGB());
                $this->assertSame('FFFFFF', $sheet->getStyle($cell)->getFont()->getColor()->getRGB());
                $matched++;
            }
        }
        $this->assertGreaterThanOrEqual(2, $matched);
        $book->disconnectWorksheets();
    }

    public function test_source_workbook_export_snapshots_custom_color(): void
    {
        $result = app(CascadingWorkbookImportService::class)->import(base_path('docs/CASCADING.xlsx'), 2098);
        $period = PeriodeKinerja::findOrFail($result['period_id']);
        $levels = [];
        foreach (\App\Services\CascadingHierarchyService::TABLES as $level => $table) {
            $levels[$level] = DB::table($table)->where('periode_kinerja_id', $period->id)->get()->map(fn ($row) => (array) $row)->all();
        }
        foreach ($levels[1] as &$row) {
            $row['cascading_color'] = '#123ABC';
        }
        unset($row);
        $data = ['period' => $period->toArray(), 'levels' => $levels];
        $data['source_workbook'] = app(CascadingSourceWorkbookService::class)->snapshot($data);
        $this->assertNotNull($data['source_workbook']);
        $book = app(CascadingExportService::class)->build($data);
        $sheet = $book->getActiveSheet();
        $matched = 0;
        foreach ($data['source_workbook']['cells'] as $cell => $entry) {
            if ($entry['force_color'] && $entry['color']) {
                $this->assertSame('123ABC', $sheet->getStyle($cell)->getFill()->getStartColor()->getRGB());
                $matched++;
            }
        }
        $this->assertGreaterThan(0, $matched);
        $book->disconnectWorksheets();
    }
}