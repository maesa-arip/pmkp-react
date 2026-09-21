<?php

namespace Tests\Feature;

use App\Models\PeriodeKinerja;
use App\Models\Pic;
use App\Models\User;
use App\Services\CascadingConceptImportService;
use App\Services\CascadingConceptService;
use App\Services\CascadingFeatureAlignment;
use App\Services\CascadingWorkbookImportService;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx as Writer;
use Tests\TestCase;

class DirectorCascadingTest extends TestCase
{
    use DatabaseTransactions;

    private function prepare(): PeriodeKinerja
    {
        $result = app(CascadingWorkbookImportService::class)->import(base_path('docs/CASCADING.xlsx'), 2098);
        app(CascadingConceptImportService::class)->import(base_path('docs/CASCADING.xlsx'), 2098);
        app(CascadingFeatureAlignment::class)->apply(2098);
        $period = PeriodeKinerja::findOrFail($result['period_id']);
        $period->update(['status' => 'aktif']);
        return $period;
    }

    public function test_director_can_add_edit_and_reparent_data_and_export_database_values(): void
    {
        $period = $this->prepare();
        $position = DB::table('kinerja_penanggung_jawabs')->where('name', 'DIREKTUR')->first();
        $user = User::factory()->create(['pic_id' => $position->pic_id]);
        $this->actingAs($user);
        Gate::before(fn () => false);
        $service = app(CascadingConceptService::class);
        $nodes = collect($service->rows($period->id));
        $ikus = $nodes->where('kind', 'iku')->values();
        $activity = $nodes->where('tier', 'direktur')->where('kind', 'kegiatan')->first();
        $indicator = $nodes->where('parent_id', $activity['id'])->first();
        $data = ['period' => $period->toArray()];
        $old = $service->snapshot($data);
        unset($old['director_from_database']); // An existing version 5 archive.
        $payload = ['kind' => 'kegiatan', 'parent_id' => $ikus[0]['id'], 'name' => 'Kegiatan Direktur dari input', 'code' => 'D-INPUT'];
        $this->post(route('kinerja.director.store', $period->id), $payload)->assertSessionHasNoErrors();
        $added = DB::table('cascading_concepts')->where('periode_kinerja_id', $period->id)->where('name', $payload['name'])->first();
        $this->assertNotNull($added);
        foreach (range(1, 4) as $number) {
            $this->post(route('kinerja.director.store', $period->id), ['kind' => 'indikator_kinerja', 'parent_id' => $added->id, 'name' => '=Indikator input '.$number, 'code' => 'D.'.$number])->assertSessionHasNoErrors();
        }
        $this->put(route('kinerja.director.update', [$period->id, $activity['id']]), array_replace($payload, ['name' => 'Kegiatan lama diedit', 'parent_id' => $ikus[1]['id']]))->assertSessionHasNoErrors();
        $this->put(route('kinerja.director.update', [$period->id, $indicator['id']]), ['kind' => 'indikator_kinerja', 'parent_id' => $added->id, 'name' => 'Indikator lama dipindah dan diedit', 'code' => 'D.5'])->assertSessionHasNoErrors();
        $this->get(route('kinerja.performance.index', ['tahun' => 2098]))->assertOk()->assertInertia(fn ($page) => $page->has('directorNodes', 14));
        $snapshot = $service->snapshot($data);
        // Deliberately poison template-cell values: the Director section must use nodes.
        $snapshot['cells']['direktur']['D16'] = ['value' => 'DATA MENTAH TIDAK BOLEH MUNCUL', 'type' => 's', 'unchanged' => false];
        $book = $service->build($data + ['concept_workbook' => $snapshot]);
        $file = tempnam(sys_get_temp_dir(), 'director-export-');
        try {
            (new Writer($book))->save($file);
            $saved = (new Xlsx())->load($file);
            $sheet = $saved->getSheetByName('direktur');
            $values = [];
            foreach ($sheet->getCellCollection()->getCoordinates() as $cell) {
                $value = $sheet->getCell($cell)->getValue();
                $values[] = $value;
                if ($value === '=Indikator input 4') {
                    $this->assertSame('s', $sheet->getCell($cell)->getDataType());
                }
            }
            foreach (['Kegiatan Direktur dari input', 'Kegiatan lama diedit', 'Indikator lama dipindah dan diedit', '=Indikator input 4'] as $value) {
                $this->assertContains($value, $values);
            }
            foreach ([$activity['name'], $indicator['name'], 'DATA MENTAH TIDAK BOLEH MUNCUL'] as $value) {
                $this->assertNotContains($value, $values);
            }
            $this->assertSame('A1:M26', $sheet->getPageSetup()->getPrintArea());
            $this->assertNull($saved->getSheetByName('Tambahan'));
            $saved->disconnectWorksheets();
        } finally {
            unlink($file);
            $book->disconnectWorksheets();
        }
        $archive = $service->build($data + ['concept_workbook' => $old]);
        $this->assertSame($activity['name'], $archive->getSheetByName('direktur')->getCell('D16')->getValue());
        $archive->disconnectWorksheets();
        DB::table('cascading_concepts')->where('periode_kinerja_id', $period->id)->where('tier', 'direktur')->update(['is_active' => false]);
        $empty = $service->build($data + ['concept_workbook' => $service->snapshot($data)]);
        $this->assertNull($empty->getSheetByName('direktur')->getCell('D16')->getValue());
        $this->assertSame('A1:M15', $empty->getSheetByName('direktur')->getPageSetup()->getPrintArea());
        $empty->disconnectWorksheets();
    }

    public function test_access_parent_period_and_closed_guards(): void
    {
        $period = $this->prepare();
        $nodes = collect(app(CascadingConceptService::class)->rows($period->id));
        $iku = $nodes->where('kind', 'iku')->first();
        $activity = $nodes->where('tier', 'direktur')->where('kind', 'kegiatan')->first();
        $position = DB::table('kinerja_penanggung_jawabs')->where('name', 'DIREKTUR')->first();
        $director = User::factory()->create(['pic_id' => $position->pic_id]);
        $outsider = User::factory()->create(['pic_id' => Pic::where('id', '<>', $position->pic_id)->firstOrFail()->id]);
        Gate::before(fn () => false);
        $payload = ['kind' => 'kegiatan', 'parent_id' => $iku['id'], 'name' => 'Tidak boleh disimpan'];
        $this->actingAs($outsider)->post(route('kinerja.director.store', $period->id), $payload)->assertSessionHasErrors('parent_id');
        $this->put(route('kinerja.director.update', [$period->id, $activity['id']]), $payload)->assertForbidden();
        $this->get(route('kinerja.performance.index', ['tahun' => 2098]))->assertInertia(fn ($page) => $page->has('directorNodes', 0));
        $this->actingAs($director);
        $this->post(route('kinerja.director.store', $period->id), array_replace($payload, ['kind' => 'indikator_kinerja']))->assertSessionHasErrors('parent_id');
        $this->post(route('kinerja.director.store', $period->id), array_replace($payload, ['parent_id' => $activity['id']]))->assertSessionHasErrors('parent_id');
        $other = PeriodeKinerja::create(['tahun' => 2099, 'status' => 'draft', 'feature_schema_version' => 2]);
        $this->post(route('kinerja.director.store', $other->id), $payload)->assertSessionHasErrors('parent_id');
        $this->put(route('kinerja.director.update', [$other->id, $activity['id']]), $payload)->assertForbidden();
        $this->put(route('kinerja.director.update', [$period->id, $iku['id']]), $payload)->assertForbidden();
        $period->update(['status' => 'ditutup']);
        $this->post(route('kinerja.director.store', $period->id), $payload)->assertSessionHasErrors('name');
        $this->put(route('kinerja.director.update', [$period->id, $activity['id']]), $payload)->assertSessionHasErrors('name');
        $this->assertDatabaseMissing('cascading_concepts', ['name' => 'Tidak boleh disimpan']);
    }
}
