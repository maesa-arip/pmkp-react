<?php

namespace Tests\Feature;

use App\Models\PeriodeKinerja;
use App\Models\Pic;
use App\Models\User;
use App\Services\CascadingConceptImportService;
use App\Services\CascadingConceptParser;
use App\Services\CascadingConceptService;
use App\Services\CascadingExportService;
use App\Services\CascadingWorkbookImportService;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx as Writer;
use Tests\TestCase;

class CascadingConceptTest extends TestCase
{
    use DatabaseTransactions;

    private function prepare(): PeriodeKinerja
    {
        $r = app(CascadingWorkbookImportService::class)->import(base_path('docs/CASCADING.xlsx'), 2098);
        app(CascadingConceptImportService::class)->import(base_path('docs/CASCADING.xlsx'), 2098);

        return PeriodeKinerja::findOrFail($r['period_id']);
    }

    public function test_parser_covers_all_coded_descriptions_and_classifies_kinds(): void
    {
        $plan = app(CascadingConceptParser::class)->parse(base_path('docs/CASCADING.xlsx'));
        $this->assertCount(438, $plan['nodes']);
        $this->assertSame(325, count(array_filter($plan['nodes'], fn ($n) => $n['kind'] === 'indikator_mutu')));
        $reader = new Xlsx();
        $reader->setLoadSheetsOnly(CascadingConceptParser::SHEETS);
        $book = $reader->load(base_path('docs/CASCADING.xlsx'));
        foreach (['direktur', 'ASD ', 'PELAYANAN', 'PENUNJANG'] as $name) {
            $sheet = $book->getSheetByName($name);
            foreach ($sheet->getCellCollection()->getCoordinates() as $c) {
                $cell = $sheet->getCell($c);
                if (! preg_match('/^\\d+(?:\\.[a-z0-9]+)*\\.?$/i', trim((string) $cell->getValue()))) {
                    continue;
                }
                $col = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($cell->getColumn());
                $next = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($col + 1).$cell->getRow();
                $value = $sheet->getCell($next)->getValue();
                if (is_string($value) && trim($value) !== '' && ! preg_match('/^\\d/', trim($value))) {
                    $this->assertArrayHasKey($next, $plan['bindings'][$name], $name.'!'.$next.' missing');
                }
            }
        }
        $this->assertSame('program', $plan['nodes']['direktur!F5']['kind']);
        $this->assertSame('indikator_kinerja', $plan['nodes']['ASD !G18']['kind']);
        $this->assertSame('iku', $plan['nodes']['direktur!D12']['kind']);
        $this->assertSame('direktur!D12', $plan['nodes']['ASD !F17']['parent_key']);
        $this->assertNull($plan['nodes']['ASD !F17']['relation_note']);
        $this->assertSame('PELAYANAN!C40', $plan['nodes']['PELAYANAN!D41']['parent_key']);
    }

    public function test_import_preserves_legacy_ids_and_export_matches_five_sheets(): void
    {
        $period = $this->prepare();
        $rows = app(CascadingConceptService::class)->rows($period->id);
        $this->assertCount(438, $rows);
        $this->assertCount(91, array_filter($rows, fn ($r) => $r['legacy_id']));
        $data = ['period' => $period->toArray()];
        $data['concept_workbook'] = app(CascadingConceptService::class)->snapshot($data);
        $book = app(CascadingExportService::class)->build($data);
        $file = tempnam(sys_get_temp_dir(), 'concept-test-');
        try {
            (new Writer($book))->save($file);
            $actual = (new Xlsx())->load($file);
            $reader = new Xlsx();
            $reader->setLoadSheetsOnly(CascadingConceptParser::SHEETS);
            $source = $reader->load(base_path('docs/CASCADING.xlsx'));
            $this->assertSame(CascadingConceptParser::SHEETS, $actual->getSheetNames());
            foreach (CascadingConceptParser::SHEETS as $name) {
                $a = $actual->getSheetByName($name);
                $s = $source->getSheetByName($name);
                $this->assertSame($s->getMergeCells(), $a->getMergeCells(), $name);
                foreach ($s->getCellCollection()->getCoordinates() as $cell) {
                    $v = $s->getCell($cell)->getValue();
                    if ($v === null) {
                        continue;
                    }
                    $expected = $cell === ($name === 'cascading' ? 'B2' : 'A1') ? str_replace('2025', '2098', $v) : $v;
                    $value = $a->getCell($cell)->getValue();
                    $this->assertSame(is_object($expected) ? (string) $expected : $expected, is_object($value) ? (string) $value : $value, $name.'!'.$cell);
                }
            }
            $actual->disconnectWorksheets();
            $source->disconnectWorksheets();
        } finally {
            unlink($file);
            $book->disconnectWorksheets();
        }
        $this->assertTrue(app(CascadingConceptImportService::class)->import(base_path('docs/CASCADING.xlsx'), 2098)['already_imported']);
    }

    public function test_http_edit_export_archival_and_closed_period_guards(): void
    {
        $period = $this->prepare();
        $this->actingAs(User::factory()->create(['pic_id' => Pic::firstOrFail()->id]));
        Gate::before(fn () => true);
        $this->get(route('kinerja.index', ['tahun' => 2098]))->assertOk()->assertInertia(fn ($p) => $p->has('cascadingConcepts', 438));
        $node = DB::table('cascading_concepts')->where('periode_kinerja_id', $period->id)->where('kind', 'indikator_mutu')->first();
        $data = ['period' => $period->toArray()];
        $old = app(CascadingConceptService::class)->snapshot($data);
        $this->put(route('kinerja.concepts.update', [$period->id, $node->id]), ['name' => '=Indikator mutu diperbarui', 'code' => $node->code])->assertSessionHasNoErrors();
        $new = app(CascadingConceptService::class)->snapshot($data);
        $cell = $new['cells'][$node->source_sheet][$node->source_cell];
        $this->assertSame('=Indikator mutu diperbarui', $cell['value']);
        $this->assertSame('s', $cell['type']);
        $this->assertNotSame($old['cells'][$node->source_sheet][$node->source_cell]['value'], $cell['value']);
        $response = $this->get(route('kinerja.export', $period->id))->assertOk();
        $this->assertStringStartsWith('PK', $response->streamedContent());
        $archive = DB::table('cascading_exports')->where('periode_kinerja_id', $period->id)->latest('id')->first();
        $this->assertSame('5', $archive->template_version);
        $this->assertStringStartsWith('PK', $this->get(route('kinerja.exportArchive', $archive->id))->assertOk()->streamedContent());
        $period->update(['status' => 'ditutup']);
        $this->put(route('kinerja.concepts.update', [$period->id, $node->id]), ['name' => 'Ditolak', 'code' => $node->code])->assertSessionHasErrors('name');
        $this->assertSame('=Indikator mutu diperbarui', DB::table('cascading_concepts')->where('id', $node->id)->value('name'));
    }

    public function test_color_branches_follow_confirmed_iku_and_activity_parents(): void
    {
        $plan = app(CascadingConceptParser::class)->parse(base_path('docs/CASCADING.xlsx'));
        foreach (['ASD ' => ['F17', 'F22', 'F27'], 'PELAYANAN' => ['D17', 'D21', 'D25'], 'PENUNJANG' => ['C20', 'C24', 'C28']] as $sheet => $cells) {
            foreach ($cells as $i => $cell) {
                $node = $plan['nodes'][$sheet.'!'.$cell];
                $this->assertSame('direktur!D'.(12 + $i), $node['parent_key']);
                $this->assertSame('kegiatan', $node['kind']);
                $this->assertNull($node['relation_note']);
            }
        }
        $this->assertSame('ASD !F17', $plan['nodes']['ASD !C31']['parent_key']);
        $this->assertSame('ASD !F17', $plan['nodes']['ASD !G18']['parent_key']);
        $this->assertSame('ASD !C31', $plan['nodes']['ASD !D32']['parent_key']);
        foreach ($plan['nodes'] as $node) {
            if ($node['tier'] === 'kabag_kabid' && $node['kind'] === 'kegiatan') {
                $parent = $plan['nodes'][$node['parent_key']];
                $this->assertSame('wadir', $parent['tier']);
                $this->assertSame('kegiatan', $parent['kind']);
            }
        }
        $source = (new Xlsx())->load(base_path('docs/CASCADING.xlsx'));
        $source->getSheetByName('cascading')->getStyle('F13')->getFill()->getStartColor()->setRGB('00FF00');
        $file = tempnam(sys_get_temp_dir(), 'unknown-cascade-color-');
        try {
            (new Writer($source))->save($file);
            $unknown = app(CascadingConceptParser::class)->parse($file);
            $this->assertNull($unknown['nodes']['ASD !F17']['parent_key']);
            $this->assertStringContainsString('konfirmasi', $unknown['nodes']['ASD !F17']['relation_note']);
        } finally {
            unlink($file);
            $source->disconnectWorksheets();
        }
    }

    public function test_reconcile_changes_relationships_without_losing_edits_ids_or_archives(): void
    {
        $period = $this->prepare();
        $records = DB::table('cascading_concepts')->where('periode_kinerja_id', $period->id)->get()->keyBy(fn ($r) => $r->source_sheet.'!'.$r->source_cell);
        $wadir = $records['ASD !F17'];
        $head = $records['ASD !C31'];
        DB::table('cascading_concepts')->where('id', $wadir->id)->update(['parent_id' => null, 'relation_note' => 'Rujukan belum diketahui']);
        DB::table('cascading_concepts')->where('id', $head->id)->update(['parent_id' => $records['ASD !G18']->id]);
        $quality = $records['ASD !D46'];
        app(CascadingConceptService::class)->update($period, $quality->id, ['name' => 'Uraian yang sudah diedit pengguna', 'code' => $quality->code]);
        $old = app(CascadingConceptService::class)->snapshot(['period' => $period->toArray()]);
        $result = app(CascadingConceptImportService::class)->import(base_path('docs/CASCADING.xlsx'), 2098);
        $this->assertSame(2, $result['updated_relationships']);
        $this->assertFileExists($result['backup']);
        $this->assertSame($records['direktur!D12']->id, DB::table('cascading_concepts')->where('id', $wadir->id)->value('parent_id'));
        $this->assertSame($wadir->id, DB::table('cascading_concepts')->where('id', $head->id)->value('parent_id'));
        $this->assertSame('Uraian yang sudah diedit pengguna', DB::table('cascading_concepts')->where('id', $quality->id)->value('name'));
        $this->assertNull(array_column($old['nodes'], null, 'id')[$wadir->id]['parent_id']);
        $new = array_column(app(CascadingConceptService::class)->rows($period->id), null, 'id');
        $this->assertSame('grey', $new[$head->id]['iku_branch']);
        $this->assertCount(438, $new);
        $this->assertTrue(app(CascadingConceptImportService::class)->import(base_path('docs/CASCADING.xlsx'), 2098)['already_imported']);
    }
}
