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
use Tests\TestCase;

class CascadingFeaturesTest extends TestCase
{
    use DatabaseTransactions;

    private function prepare(): PeriodeKinerja
    {
        $r = app(CascadingWorkbookImportService::class)->import(base_path('docs/CASCADING.xlsx'), 2098);
        app(CascadingConceptImportService::class)->import(base_path('docs/CASCADING.xlsx'), 2098);

        return PeriodeKinerja::findOrFail($r['period_id']);
    }

    public function test_feature_indicator_lists_are_scoped_by_year_and_edits_update_cascading(): void
    {
        $period = $this->prepare();
        app(CascadingFeatureAlignment::class)->apply(2098);
        $this->actingAs(User::factory()->create(['pic_id' => Pic::firstOrFail()->id]));
        Gate::before(fn () => true);
        $this->get(route('kinerja.index', ['tahun' => 2098]))->assertOk()->assertInertia(fn ($page) => $page
            ->component('Kinerja/Index')->has('performanceIndicators', 58)
            ->where('performanceIndicators', fn ($rows) => collect($rows)->every(fn ($row) => $row['periode_kinerja_id'] === $period->id)));
        $this->get(route('kinerja.index', ['tahun' => 2099]))->assertOk()->assertInertia(fn ($page) => $page->has('performanceIndicators', 0));
        foreach ([2, 3] as $level) {
            $indicator = DB::table('indikator_kinerjas')->where('periode_kinerja_id', $period->id)->whereNotNull('indikator_fitur'.$level.'_id')->first();
            $payload = ['periode_kinerja_id' => $period->id, 'level' => $level, 'activity_id' => $indicator->{'indikator_fitur'.$level.'_id'}, 'name' => 'Edit indikator fitur '.$level, 'kode_cascading' => 'QA-'.$level];
            $this->put(route('kinerja.performance.update', $indicator->id), $payload)->assertSessionHasNoErrors();
            $row = collect(app(CascadingConceptService::class)->rows($period->id))->first(fn ($row) => $row['legacy_table'] === 'indikator_kinerjas' && $row['legacy_id'] === $indicator->id);
            $this->assertSame($payload['name'], $row['name']);
            $this->assertSame($payload['kode_cascading'], $row['code']);
        }
        $period->update(['status' => 'ditutup']);
        $this->put(route('kinerja.performance.update', $indicator->id), $payload)->assertSessionHasErrors('name');
    }

    public function test_alignment_builds_real_features_and_keeps_workbook_cells(): void
    {
        $p = $this->prepare();
        $heads = DB::table('indikator_fitur3s')->where('periode_kinerja_id', $p->id)->pluck('id')->all();
        $snapshot = app(CascadingConceptService::class)->snapshot(['period' => $p->toArray()]);
        $r = app(CascadingFeatureAlignment::class)->apply(2098);
        $this->assertFileExists($r['backup']);
        foreach ([1 => 3, 2 => 9, 3 => 19, 4 => 325] as $level => $count) {
            $this->assertSame($count, DB::table('indikator_fitur'.$level.'s')->where('periode_kinerja_id', $p->id)->count());
        }
        $this->assertSame(2, DB::table('sasaran_strategis')->where('periode_kinerja_id', $p->id)->count());
        $this->assertSame(58, DB::table('indikator_kinerjas')->where('periode_kinerja_id', $p->id)->count());
        $this->assertSame($heads, DB::table('indikator_fitur3s')->where('periode_kinerja_id', $p->id)->pluck('id')->all());
        $new = app(CascadingConceptService::class)->snapshot(['period' => $p->fresh()->toArray()]);
        $this->assertSame($snapshot['cells'], $new['cells']);
        foreach (DB::table('indikator_fitur4s')->where('periode_kinerja_id', $p->id)->get() as $i) {
            $this->assertContains($i->indikator_fitur3_id, $heads);
        }
        $this->assertTrue(app(CascadingFeatureAlignment::class)->apply(2098)['already_aligned']);
    }

    public function test_alignment_refuses_referenced_wrong_feature_rows(): void
    {
        $p = $this->prepare();
        $id = DB::table('indikator_fitur4s')->where('periode_kinerja_id', $p->id)->value('id');
        DB::table('indikator_year_mappings')->insert(['source_indicator_id' => $id, 'target_period_id' => $p->id, 'target_indicator_id' => $id, 'created_at' => now(), 'updated_at' => now()]);
        try {
            app(CascadingFeatureAlignment::class)->apply(2098);
            $this->fail('Reference should block replacement');
        } catch(\RuntimeException $e) {
            $this->assertStringContainsString('pemetaan', $e->getMessage());
        }
        $this->assertSame(40, DB::table('indikator_fitur4s')->where('periode_kinerja_id', $p->id)->count());
    }

    public function test_mutu_dictionary_ignores_the_hierarchy_unless_it_creates_a_new_indicator(): void
    {
        $p = $this->prepare();
        app(CascadingFeatureAlignment::class)->apply(2098);
        $p->update(['status' => 'aktif']);
        $pic = Pic::where('name', 'TIM KERJA PERENCANAAN, PENGEMBANGAN DAN PELAPORAN')->firstOrFail();
        $this->actingAs(User::factory()->create(['pic_id' => $pic->id]));
        Gate::before(fn () => false);
        $indicator = DB::table('indikator_fitur4s')->where('periode_kinerja_id', $p->id)->whereJsonContains('location_id', (int) $pic->location_id)->first();
        $payload = ['periode_kinerja_id' => $p->id, 'IndikatorBaru' => 0, 'indikator_fitur4_id' => $indicator->id, 'mutu_kategori_id' => DB::table('mutu_kategoris')->value('id'), 'num_name' => 'Jumlah sesuai', 'denum_name' => 'Jumlah semua', 'standar' => 100, 'operator' => '≥', 'penyebut' => '%'];
        // A dictionary has no say over features 1-3, so a stray activity id is simply ignored.
        $stray = DB::table('indikator_fitur3s')->where('periode_kinerja_id', '<>', $p->id)->whereNotNull('periode_kinerja_id')->value('id');
        $this->post(route('MutuIndikator.store'), array_replace($payload, ['indikator_fitur3_id' => $stray]))->assertSessionHasNoErrors();
        $foreign = DB::table('indikator_fitur4s')->where('periode_kinerja_id', $p->id)->where('jabatan', '<>', $pic->name)->first();
        $this->post(route('MutuIndikator.store'), array_replace($payload, ['indikator_fitur4_id' => $foreign->id]))->assertSessionHasErrors('indikator_fitur4_id');
        $this->post(route('MutuIndikator.store'), $payload)->assertSessionHasNoErrors();
        // A brand new indicator must declare its activity straight away.
        $fresh = ['IndikatorBaru' => 1, 'indikator_fitur4_id' => '', 'indikator' => 'Indikator baru unit pengujian'];
        $this->post(route('MutuIndikator.store'), array_replace($payload, $fresh))->assertSessionHasErrors('indikator_fitur3_id');
        $this->post(route('MutuIndikator.store'), array_replace($payload, $fresh, ['indikator_fitur3_id' => $stray]))->assertSessionHasErrors('indikator_fitur3_id');
        $activity = $indicator->indikator_fitur3_id;
        $this->post(route('MutuIndikator.store'), array_replace($payload, $fresh, ['indikator_fitur3_id' => $activity]))->assertSessionHasNoErrors();
        $new = DB::table('indikator_fitur4s')->where('periode_kinerja_id', $p->id)->where('name', 'Indikator baru unit pengujian')->first();
        $this->assertSame($activity, $new->indikator_fitur3_id);
        $this->assertSame([(int) $pic->location_id], json_decode($new->location_id, true));
        $this->assertDatabaseHas('cascading_concepts', ['legacy_table' => 'indikator_fitur4s', 'legacy_id' => $new->id, 'kind' => 'indikator_mutu']);
        foreach (['mutu_kategori_id', 'indikator_fitur4_id', 'standar', 'location_id'] as $field) {
            $this->get(route('MutuIndikator.index', ['tahun' => 2098, 'field' => $field, 'direction' => 'asc']))->assertOk();
        }
        $p->update(['status' => 'ditutup']);
        $this->post(route('MutuIndikator.store'), $payload)->assertSessionHasErrors('periode_kinerja_id');
    }

    public function test_performance_input_uses_own_wadir_or_head_activity(): void
    {
        $p = $this->prepare();
        app(CascadingFeatureAlignment::class)->apply(2098);
        $pic = Pic::where('name', 'WAKIL DIREKTUR ADMINISTRASI DAN SUMBER DAYA')->firstOrFail();
        $this->actingAs(User::factory()->create(['pic_id' => $pic->id]));
        Gate::before(fn () => false);
        $position = DB::table('kinerja_penanggung_jawabs')->where('pic_id', $pic->id)->value('id');
        $own = DB::table('indikator_fitur2s')->where('periode_kinerja_id', $p->id)->where('penanggung_jawab_id', $position)->value('id');
        $other = DB::table('indikator_fitur2s')->where('periode_kinerja_id', $p->id)->where('penanggung_jawab_id', '<>', $position)->value('id');
        $payload = ['periode_kinerja_id' => $p->id, 'level' => 2, 'activity_id' => $own, 'name' => 'Indikator kinerja Wadir baru'];
        $this->post(route('kinerja.performance.store'), array_replace($payload, ['activity_id' => $other]))->assertSessionHasErrors('activity_id');
        $this->post(route('kinerja.performance.store'), $payload)->assertSessionHasNoErrors();
        $this->assertDatabaseHas('indikator_kinerjas', ['periode_kinerja_id' => $p->id, 'indikator_fitur2_id' => $own, 'indikator_fitur3_id' => null, 'name' => $payload['name']]);
        $this->get(route('kinerja.performance.index', ['tahun' => 2098]))->assertOk();
    }

    public function test_copy_preserves_feature_ownership_concepts_and_extra_inputs(): void
    {
        $p = $this->prepare();
        app(CascadingFeatureAlignment::class)->apply(2098);
        $p->refresh();
        $head = DB::table('indikator_fitur3s')->where('periode_kinerja_id', $p->id)->first();
        $id = DB::table('indikator_kinerjas')->insertGetId(['periode_kinerja_id' => $p->id, 'indikator_fitur3_id' => $head->id, 'name' => 'Indikator tambahan dari form', 'jabatan' => $head->jabatan, 'lineage_id' => (string) \Illuminate\Support\Str::uuid(), 'created_at' => now(), 'updated_at' => now()]);
        app(\App\Services\OperationalConceptLink::class)->sync($p->id, 'indikator_kinerjas', $id, 'indikator_fitur3s', $head->id, 'indikator_kinerja', 'kabag_kabid');
        $target = PeriodeKinerja::create(['tahun' => 2099, 'status' => 'draft', 'nama_organisasi' => $p->nama_organisasi, 'tujuan' => $p->tujuan]);
        $service = app(\App\Services\AnnualIndicatorService::class);
        $service->copyHierarchy($p->id, $target);
        $service->copyHierarchy($p->id, $target);
        $this->assertSame(2, (int) $target->fresh()->feature_schema_version);
        $this->assertSame(59, DB::table('indikator_kinerjas')->where('periode_kinerja_id', $target->id)->count());
        $this->assertSame(439, DB::table('cascading_concepts')->where('periode_kinerja_id', $target->id)->count());
        foreach (DB::table('indikator_fitur4s')->where('periode_kinerja_id', $target->id)->get() as $copy) {
            $original = DB::table('indikator_fitur4s')->find($copy->copied_from_id);
            $this->assertSame($original->location_id, $copy->location_id);
            $this->assertSame($original->jabatan, $copy->jabatan);
            $this->assertDatabaseHas('indikator_fitur3s', ['id' => $copy->indikator_fitur3_id, 'periode_kinerja_id' => $target->id]);
        }
        $snapshot = app(CascadingConceptService::class)->snapshot(['period' => $target->fresh()->toArray()]);
        $source = app(CascadingConceptService::class)->snapshot(['period' => $p->toArray()]);
        $this->assertSame($source['cells'], $snapshot['cells']);
        $book = app(CascadingConceptService::class)->build(['period' => $target->fresh()->toArray(), 'concept_workbook' => $snapshot]);
        $this->assertSame(6, $book->getSheetCount());
        $this->assertSame('Indikator tambahan dari form', $book->getSheetByName('Tambahan')->getCell('C2')->getValue());
        $this->assertSame($head->name, $book->getSheetByName('Tambahan')->getCell('D2')->getValue());
        $book->disconnectWorksheets();
    }

    public function test_new_iku_keeps_new_sasaran_connected_in_concept_and_export(): void
    {
        $p = $this->prepare();
        app(CascadingFeatureAlignment::class)->apply(2098);
        $this->actingAs(User::factory()->create(['pic_id' => Pic::firstOrFail()->id]));
        Gate::before(fn () => true);
        $this->post(route('kinerja.nodes', [$p->id, '1']), ['name' => 'IKU baru pengujian', 'sasaran_baru' => 'Sasaran baru pengujian', 'sort_order' => 99, 'is_active' => true])->assertRedirect()->assertSessionHasNoErrors();
        $iku = DB::table('cascading_concepts')->where('periode_kinerja_id', $p->id)->where('name', 'IKU baru pengujian')->first();
        $parent = DB::table('cascading_concepts')->find($iku->parent_id);
        $this->assertSame('Sasaran baru pengujian', $parent->name);
        $this->assertSame('sasaran_strategis', $parent->kind);
        $snapshot = app(CascadingConceptService::class)->snapshot(['period' => $p->fresh()->toArray()]);
        $book = app(CascadingConceptService::class)->build(['period' => $p->fresh()->toArray(), 'concept_workbook' => $snapshot]);
        $this->assertSame('Sasaran baru pengujian', $book->getSheetByName('Tambahan')->getCell('D3')->getValue());
        $book->disconnectWorksheets();
    }
    public function test_add_and_delete_performance_indicators_preserves_export_history_and_checks_access(): void
    {
        $period = $this->prepare();
        app(CascadingFeatureAlignment::class)->apply(2098);
        $period->refresh()->update(['status' => 'aktif']);
        $admin = User::factory()->create(['pic_id' => Pic::firstOrFail()->id]);
        $this->actingAs($admin);
        Gate::before(fn ($user) => $user->id === $admin->id);
        $service = app(CascadingConceptService::class);
        foreach ([2, 3] as $level) {
            $source = DB::table('indikator_kinerjas')->where('periode_kinerja_id', $period->id)->whereNotNull('indikator_fitur'.$level.'_id')->get()->first(function ($row) use ($period) {
                $conceptId = DB::table('cascading_concepts')->where('periode_kinerja_id', $period->id)->where('legacy_table', 'indikator_kinerjas')->where('legacy_id', $row->id)->value('id');
                return ! DB::table('cascading_concepts')->where('parent_id', $conceptId)->where('is_active', true)->exists();
            });
            $payload = ['periode_kinerja_id' => $period->id, 'level' => $level, 'activity_id' => $source->{'indikator_fitur'.$level.'_id'}];
            $this->post(route('kinerja.performance.store'), $payload + ['name' => 'Indikator tambahan fitur '.$level])->assertSessionHasNoErrors();
            $added = DB::table('indikator_kinerjas')->where('periode_kinerja_id', $period->id)->where('name', 'Indikator tambahan fitur '.$level)->first();
            $this->assertSame($payload['activity_id'], $added->{'indikator_fitur'.$level.'_id'});
            $old = $service->snapshot(['period' => $period->toArray()]);
            $concept = DB::table('cascading_concepts')->where('periode_kinerja_id', $period->id)->where('legacy_table', 'indikator_kinerjas')->where('legacy_id', $source->id)->first();
            $this->delete(route('kinerja.performance.destroy', $source->id), array_replace($payload, ['activity_id' => 0]))->assertForbidden();
            $this->delete(route('kinerja.performance.destroy', $source->id), $payload)->assertRedirect()->assertSessionHasNoErrors();
            $this->assertDatabaseHas('indikator_kinerjas', ['id' => $source->id, 'is_active' => false]);
            $this->assertDatabaseHas('cascading_concepts', ['id' => $concept->id, 'is_active' => false]);
            $new = $service->snapshot(['period' => $period->toArray()]);
            $this->assertSame('', $new['cells'][$concept->source_sheet][$concept->source_cell]['value']);
            $before = $service->build(['period' => $period->toArray(), 'concept_workbook' => $old]);
            $this->assertSame($source->name, $before->getSheetByName($concept->source_sheet)->getCell($concept->source_cell)->getValue());
            $before->disconnectWorksheets();
            $this->delete(route('kinerja.performance.destroy', $added->id), $payload)->assertSessionHasNoErrors();
            $this->get(route('kinerja.index', ['tahun' => 2098]))->assertOk()->assertInertia(fn ($page) => $page
                ->where('performanceIndicators', fn ($rows) => ! collect($rows)->contains('id', $source->id) && ! collect($rows)->contains('id', $added->id))
                ->where('cascadingConcepts', fn ($rows) => ! collect($rows)->contains('id', $concept->id)));
            $this->put(route('kinerja.performance.update', $source->id), $payload + ['name' => 'Tidak boleh muncul lagi'])->assertNotFound();
        }
        $source = DB::table('indikator_kinerjas')->where('periode_kinerja_id', $period->id)->where('is_active', true)->whereNotNull('indikator_fitur2_id')->first();
        $payload = ['periode_kinerja_id' => $period->id, 'level' => 2, 'activity_id' => $source->indikator_fitur2_id];
        $withChildren = DB::table('cascading_concepts as c')->where('c.periode_kinerja_id', $period->id)->where('c.legacy_table', 'indikator_kinerjas')
            ->whereExists(fn ($q) => $q->select(DB::raw(1))->from('cascading_concepts as child')->whereColumn('child.parent_id', 'c.id')->where('child.is_active', true))->first();
        $protected = DB::table('indikator_kinerjas')->find($withChildren->legacy_id);
        $protectedLevel = $protected->indikator_fitur2_id ? 2 : 3;
        $this->delete(route('kinerja.performance.destroy', $protected->id), ['periode_kinerja_id' => $period->id, 'level' => $protectedLevel, 'activity_id' => $protected->{'indikator_fitur'.$protectedLevel.'_id'}])->assertSessionHasErrors('name');
        $this->assertDatabaseHas('indikator_kinerjas', ['id' => $protected->id, 'is_active' => true]);
        $position = DB::table('indikator_fitur2s')->where('id', $source->indikator_fitur2_id)->value('penanggung_jawab_id');
        $picId = DB::table('kinerja_penanggung_jawabs')->where('id', $position)->value('pic_id');
        $outsider = User::factory()->create(['pic_id' => Pic::where('id', '<>', $picId)->firstOrFail()->id]);
        $this->actingAs($outsider)->delete(route('kinerja.performance.destroy', $source->id), $payload)->assertForbidden();
        $this->actingAs($admin);
        $other = PeriodeKinerja::create(['tahun' => 2099, 'status' => 'draft', 'nama_organisasi' => 'RS Uji']);
        $this->delete(route('kinerja.performance.destroy', $source->id), array_replace($payload, ['periode_kinerja_id' => $other->id]))->assertForbidden();
        $period->update(['status' => 'ditutup']);
        $this->delete(route('kinerja.performance.destroy', $source->id), $payload)->assertSessionHasErrors('name');
        $this->assertDatabaseHas('indikator_kinerjas', ['id' => $source->id, 'is_active' => true]);
    }

}
