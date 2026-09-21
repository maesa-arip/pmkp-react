<?php

namespace Tests\Feature;

use App\Models\PeriodeKinerja;
use App\Services\CascadingExportService;
use App\Services\CascadingHierarchyService;
use App\Services\CascadingSourceWorkbookService;
use App\Services\CascadingWorkbookImportService;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx as XlsxWriter;
use Tests\TestCase;

class CascadingWorkbookImportTest extends TestCase
{
    use DatabaseTransactions;

    private function data(int $periodId): array
    {
        $levels = [];
        foreach (CascadingHierarchyService::TABLES as $level => $table) {
            $levels[$level] = DB::table($table)->where('periode_kinerja_id', $periodId)->get()->map(fn ($row) => (array) $row)->all();
        }
        $hierarchy = app(CascadingHierarchyService::class);
        $data = ['period' => PeriodeKinerja::findOrFail($periodId)->toArray(),
            'levels' => $hierarchy->decorate($levels), 'tree' => $hierarchy->build($levels)];
        $source = app(CascadingSourceWorkbookService::class)->snapshot($data);
        if ($source) {
            $data['source_workbook'] = $source;
        }
        return $data;
    }

    public function test_import_and_saved_export_match_every_populated_reference_cell(): void
    {
        $service = app(CascadingWorkbookImportService::class);
        $result = $service->import(base_path('docs/CASCADING.xlsx'), 2098);
        $this->assertSame(['sasaran' => 5, 1 => 9, 2 => 18, 3 => 19, 4 => 40], $result['counts']);
        foreach (CascadingHierarchyService::TABLES as $level => $table) {
            $this->assertSame($result['counts'][$level], DB::table($table)->where('periode_kinerja_id', $result['period_id'])->count());
        }
        $data = $this->data($result['period_id']);
        $this->assertArrayHasKey('source_workbook', $data);
        $this->assertSame([], app(CascadingHierarchyService::class)->unlinked($data['levels'], $data['tree']));
        $this->assertTrue($service->import(base_path('docs/CASCADING.xlsx'), 2098)['already_imported']);
        $reader = new Xlsx();
        $reader->setLoadSheetsOnly([CascadingWorkbookImportService::SHEET]);
        $reference = $reader->load(base_path('docs/CASCADING.xlsx'))->getActiveSheet();
        $book = app(CascadingExportService::class)->build($data);
        $file = tempnam(sys_get_temp_dir(), 'cascade-test-');
        try {
            (new XlsxWriter($book))->save($file);
            $saved = (new Xlsx())->load($file);
            $this->assertSame(1, $saved->getSheetCount());
            $sheet = $saved->getActiveSheet();
            $this->assertSame($reference->getMergeCells(), $sheet->getMergeCells());
            foreach ($reference->getCellCollection()->getCoordinates() as $coordinate) {
                $value = $reference->getCell($coordinate)->getValue();
                if ($value === null) {
                    continue;
                }
                $expected = $coordinate === 'B2' ? str_replace('2025', '2098', $value) : $value;
                $this->assertSame($expected, $sheet->getCell($coordinate)->getValue(), $coordinate);
                $style = $reference->getStyle($coordinate);
                $actualStyle = $sheet->getStyle($coordinate);
                $this->assertSame($style->getFill()->getStartColor()->getARGB(), $actualStyle->getFill()->getStartColor()->getARGB(), $coordinate.' fill');
                $this->assertSame($style->getFont()->getSize(), $actualStyle->getFont()->getSize(), $coordinate.' font');
            }
            foreach ($reference->getColumnDimensions() as $col => $dimension) {
                $this->assertSame($dimension->getWidth(), $sheet->getColumnDimension($col)->getWidth());
            }
            foreach ($reference->getRowDimensions() as $row => $dimension) {
                $this->assertSame($dimension->getRowHeight(), $sheet->getRowDimension($row)->getRowHeight());
            }
            $this->assertNull($sheet->getCell('W32')->getValue());
            $this->assertSame('1.1.2', $sheet->getCell('V32')->getValue());
            $saved->disconnectWorksheets();
        } finally {
            unlink($file);
            $book->disconnectWorksheets();
        }
    }

    public function test_export_uses_current_database_values_and_old_snapshot_remains_unchanged(): void
    {
        $result = app(CascadingWorkbookImportService::class)->import(base_path('docs/CASCADING.xlsx'), 2098);
        $frozen = $this->data($result['period_id']);
        $bindings = json_decode(DB::table('cascading_workbook_templates')->where('periode_kinerja_id', $result['period_id'])->value('bindings'), true);
        $binding = $bindings['C31'];
        DB::table($binding['table'])->where('id', $binding['id'])->update(['name' => '=Nama indikator diperbarui', 'tujuan' => '=Nama indikator diperbarui']);
        $current = $this->data($result['period_id']);
        $book = app(CascadingExportService::class)->build($current);
        $this->assertSame('=Nama indikator diperbarui', $book->getActiveSheet()->getCell('C31')->getValue());
        $this->assertSame('s', $book->getActiveSheet()->getCell('C31')->getDataType());
        $old = app(CascadingExportService::class)->build($frozen);
        $this->assertSame($binding['raw'], $old->getActiveSheet()->getCell('C31')->getValue());
        $book->disconnectWorksheets();
        $old->disconnectWorksheets();

        $extra = (array) DB::table($binding['table'])->find($binding['id']);
        unset($extra['id']);
        $extra['name'] = $extra['tujuan'] = 'Indikator baru harus tetap diekspor';
        $extra['lineage_id'] = (string) \Illuminate\Support\Str::uuid();
        $extra['kode_cascading'] = 'BARU';
        DB::table($binding['table'])->insert($extra);
        $changed = $this->data($result['period_id']);
        $this->assertArrayNotHasKey('source_workbook', $changed);
        $sheet = app(CascadingExportService::class)->build($changed)->getActiveSheet();
        $this->assertTrue(collect($sheet->getCellCollection()->getCoordinates())->contains(fn ($cell) => $sheet->getCell($cell)->getValue() === $extra['name']));
    }

    public function test_http_export_and_archive_use_the_imported_template(): void
    {
        $result = app(CascadingWorkbookImportService::class)->import(base_path('docs/CASCADING.xlsx'), 2098);
        $this->actingAs(\App\Models\User::factory()->create(['pic_id' => \App\Models\Pic::firstOrFail()->id]));
        \Illuminate\Support\Facades\Gate::before(fn () => true);
        $response = $this->get(route('kinerja.export', $result['period_id']))->assertOk();
        $this->assertStringStartsWith('PK', $response->streamedContent());
        $archive = DB::table('cascading_exports')->where('periode_kinerja_id', $result['period_id'])->first();
        $this->assertSame('4', $archive->template_version);
        $this->assertSame(CascadingWorkbookImportService::SHEET, json_decode($archive->snapshot, true)['source_workbook']['sheet_name']);
        $this->assertStringStartsWith('PK', $this->get(route('kinerja.exportArchive', $archive->id))->assertOk()->streamedContent());

        // Codes repeat by office in the source; editing one office must remain possible.
        $node = DB::table('indikator_fitur1s')->where('periode_kinerja_id', $result['period_id'])->first();
        $this->post(route('kinerja.nodes', [$result['period_id'], '1']), [
            'id' => $node->id, 'name' => $node->name, 'tujuan' => $node->tujuan,
            'penanggung_jawab_id' => $node->penanggung_jawab_id, 'kode_cascading' => $node->kode_cascading,
            'is_active' => true, 'sort_order' => $node->sort_order,
        ])->assertSessionHasNoErrors();

        $other = DB::table('indikator_fitur1s')->where('periode_kinerja_id', $result['period_id'])
            ->where('penanggung_jawab_id', $node->penanggung_jawab_id)->where('id', '!=', $node->id)->first();
        $this->post(route('kinerja.nodes', [$result['period_id'], '1']), [
            'id' => $other->id, 'name' => $other->name, 'tujuan' => $other->tujuan,
            'penanggung_jawab_id' => $other->penanggung_jawab_id, 'kode_cascading' => $node->kode_cascading,
            'is_active' => true, 'sort_order' => $other->sort_order,
        ])->assertSessionHasErrors('kode_cascading');
    }

    public function test_nonempty_period_is_not_overwritten(): void
    {
        $period = PeriodeKinerja::create(['tahun' => 2098, 'status' => 'draft', 'nama_organisasi' => 'Data yang harus dipertahankan']);
        DB::table('sasaran_strategis')->insert(['name' => 'Sasaran existing', 'parent_id' => 0, 'periode_kinerja_id' => $period->id]);
        try {
            app(CascadingWorkbookImportService::class)->import(base_path('docs/CASCADING.xlsx'), 2098);
            $this->fail('Expected occupied period to be rejected.');
        } catch (\RuntimeException $e) {
            $this->assertStringContainsString('sudah berisi data', $e->getMessage());
        }
        $this->assertSame('Data yang harus dipertahankan', $period->fresh()->nama_organisasi);
        $this->assertSame(1, DB::table('sasaran_strategis')->where('periode_kinerja_id', $period->id)->count());
    }
}