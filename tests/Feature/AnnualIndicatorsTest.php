<?php

namespace Tests\Feature;

use App\Models\PeriodeKinerja;
use App\Models\Pic;
use App\Models\RiskRegister;
use App\Models\User;
use App\Services\AnnualIndicatorService;
use App\Services\CascadingExportService;
use App\Services\RiskRegisterYearCopyService;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AnnualIndicatorsTest extends TestCase
{
    use DatabaseTransactions;

    private PeriodeKinerja $sourcePeriod;

    private PeriodeKinerja $target;

    private RiskRegister $source;

    private array $filters;

    private bool $admin = true;

    protected function setUp(): void
    {
        parent::setUp();
        $this->sourcePeriod = PeriodeKinerja::where('tahun', 2024)->firstOrFail();
        $template = RiskRegister::where('periode_kinerja_id', $this->sourcePeriod->id)->firstOrFail();
        $pic = Pic::firstOrFail();
        $this->actingAs(User::factory()->create(['pic_id' => $pic->id]));
        Gate::before(fn () => $this->admin);
        DB::table('indikator_fitur4s')->where('id', $template->indikator_fitur4_id)->update(['location_id' => '[0]']);
        $this->source = $template->replicate(['copy_key', 'copied_from_risk_register_id', 'kode_risiko']);
        $this->source->user_id = auth()->id();
        $this->source->pic_id = json_encode([$pic->id]);
        $this->source->tgl_register = '2024-02-29 10:00:00';
        $this->source->osd1_dampak = 5;
        $this->source->osd1_probabilitas = 5;
        $this->source->concatdp1 = 55;
        $this->source->osd2_dampak = 4;
        $this->source->output = 'Realisasi tahun sumber';
        $this->source->dokumen_pendukung = 'bukti-lama.pdf';
        $this->source->save();
        $this->target = PeriodeKinerja::create(['tahun' => 2091, 'status' => 'draft']);
        app(AnnualIndicatorService::class)->copyHierarchy($this->sourcePeriod->id, $this->target);
        $this->target->update(['status' => 'aktif']);
        $this->filters = ['source_year' => 2024, 'target_year' => 2091, 'user_id' => auth()->id()];
    }

    public function test_copy_remaps_period_resets_evaluation_and_is_idempotent(): void
    {
        $service = app(RiskRegisterYearCopyService::class);
        $this->assertEquals(1, $service->preview($this->filters)['eligible']);
        $this->assertEquals(1, $service->copy($this->filters)['copied']);
        $copy = RiskRegister::where('copied_from_risk_register_id', $this->source->id)->firstOrFail();
        $this->assertNotEquals($this->source->indikator_fitur4_id, $copy->indikator_fitur4_id);
        $this->assertEquals($this->target->id, $copy->periode_kinerja_id);
        $this->assertSame('2091-02-28', substr($copy->tgl_register, 0, 10));
        $this->assertNull($copy->output);
        $this->assertNull($copy->dokumen_pendukung);
        $this->assertNull($copy->concatdp1);
        $this->assertNull($copy->osd2_dampak);
        $this->assertTrue($copy->needs_review);
        $this->assertEquals(2, $copy->currently_id);
        $this->assertNotEmpty($copy->indikator_snapshot);
        $this->assertEquals(0, $service->copy($this->filters)['copied']);
        $this->assertEquals('Realisasi tahun sumber', $this->source->fresh()->output);
        $this->assertEquals(1, $copy->risk_register_histories()->count());
    }

    public function test_missing_mapping_blocks_copy_then_explicit_mapping_resolves_it(): void
    {
        $service = app(AnnualIndicatorService::class);
        $target = $service->resolve($this->source->indikator_fitur4_id, $this->target->id);
        DB::table('indikator_fitur4s')->where('id', $target->id)->update(['lineage_id' => (string) \Illuminate\Support\Str::uuid()]);
        $copy = app(RiskRegisterYearCopyService::class);
        $this->assertEquals(1, $copy->preview($this->filters)['unmapped']);
        $this->assertEquals(0, $copy->copy($this->filters)['copied']);
        $this->post(route('kinerja.mapping'), ['source_indicator_id' => $this->source->indikator_fitur4_id, 'target_period_id' => $this->target->id, 'target_indicator_id' => $target->id])->assertSessionHasNoErrors();
        $this->assertEquals(1, $copy->copy($this->filters)['copied']);
    }

    public function test_unit_copy_checks_target_location_and_is_separate_from_year_copy(): void
    {
        $pic = Pic::where('id', '<>', auth()->user()->pic_id)->firstOrFail();
        $user = User::factory()->create(['pic_id' => $pic->id]);
        $filters = $this->filters + ['source_pic_id' => auth()->user()->pic_id, 'target_pic_id' => $pic->id, 'target_user_id' => $user->id];
        $service = app(RiskRegisterYearCopyService::class);
        $indicator = app(AnnualIndicatorService::class)->resolve($this->source->indikator_fitur4_id, $this->target->id);
        DB::table('indikator_fitur4s')->where('id', $indicator->id)->update(['location_id' => '[-1]']);
        $this->assertEquals(1, $service->previewUnit($filters)['unit_mismatch']);
        DB::table('indikator_fitur4s')->where('id', $indicator->id)->update(['location_id' => '[0]']);
        $this->assertEquals(1, $service->copyUnit($filters)['copied']);
        $this->assertEquals(1, $service->copy($this->filters)['copied']);
        $this->assertEquals(0, $service->copyUnit($filters)['copied']);
    }

    public function test_closed_period_and_cross_year_indicator_are_rejected(): void
    {
        $this->target->update(['status' => 'ditutup']);
        $this->assertEquals('error', app(RiskRegisterYearCopyService::class)->copy($this->filters)['type']);
        $this->source->tgl_register = '2026-01-01';
        $this->expectException(ValidationException::class);
        $this->source->save();
    }

    public function test_hierarchy_copy_does_not_change_old_context_and_repeat_does_not_duplicate(): void
    {
        $service = app(AnnualIndicatorService::class);
        $target = $service->resolve($this->source->indikator_fitur4_id, $this->target->id);
        $oldName = DB::table('indikator_fitur4s')->where('id', $this->source->indikator_fitur4_id)->value('name');
        $this->target->update(['status' => 'draft']);
        DB::table('indikator_fitur4s')->where('id', $target->id)->update(['name' => 'Indikator baru']);
        $count = DB::table('indikator_fitur4s')->where('periode_kinerja_id', $this->target->id)->count();
        $service->copyHierarchy($this->sourcePeriod->id, $this->target);
        $this->assertEquals($count, DB::table('indikator_fitur4s')->where('periode_kinerja_id', $this->target->id)->count());
        $this->assertEquals('Indikator baru', DB::table('indikator_fitur4s')->where('id', $target->id)->value('name'));
        $this->assertEquals($oldName, DB::table('indikator_fitur4s')->where('id', $this->source->indikator_fitur4_id)->value('name'));
        $service->copyHierarchy(null, $this->target);
        $expectedOrphans = DB::table('sasaran_strategis as s')->leftJoin('sasaran_strategis as p', 'p.id', '=', 's.parent_id')
            ->whereNull('s.periode_kinerja_id')->where('s.parent_id', '>', 0)->whereNull('p.id')->orderBy('s.id')->pluck('s.id')->all();
        $this->assertEquals($expectedOrphans, $this->target->fresh()->reconstruction_notes['orphan_sasaran_ids']);
    }

    public function test_editor_rejects_cross_period_parent_and_unauthorized_access(): void
    {
        $this->target->update(['status' => 'draft']);
        $row = DB::table('indikator_fitur4s')->where('periode_kinerja_id', $this->target->id)->first();
        $payload = (array) $row;
        $payload['location_id'] = [0];
        $payload['indikator_fitur3_id'] = DB::table('indikator_fitur3s')->where('periode_kinerja_id', $this->sourcePeriod->id)->value('id');
        $this->post(route('kinerja.nodes', [$this->target->id, '4']), $payload)->assertSessionHasErrors('indikator_fitur3_id');
        $payload['indikator_fitur3_id'] = $row->indikator_fitur3_id;
        $payload['kode_cascading'] = '1.1.a.1';
        $this->post(route('kinerja.nodes', [$this->target->id, '4']), $payload)->assertSessionHasNoErrors();
        unset($payload['id']);
        $this->post(route('kinerja.nodes', [$this->target->id, '4']), $payload)->assertSessionHasErrors('kode_cascading');
        $this->admin = false;
        $this->get(route('kinerja.index'))->assertForbidden();
        $this->post(route('riskRegisterCopy.store'), $this->filters)->assertForbidden();
    }

    public function test_pages_and_export_archive_are_available(): void
    {
        $this->get(route('kinerja.index', ['tahun' => 2091]))->assertOk()->assertInertia(fn (Assert $page) => $page->component('Kinerja/Index')->where('period.tahun', 2091));
        $this->get(route('riskRegisterCopy.index', $this->filters))->assertOk();
        $this->get(route('riskRegisterKlinis.index', ['tahun' => 2024]))->assertOk();
        $this->get(route('riskRegisterNonKlinis.index', ['tahun' => 2024]))->assertOk();
        $this->get(route('riskRegisterKlinisOsd2.index', ['tahun' => 2024]))->assertOk();
        $this->get(route('riskRegisterKlinisPengendalian.index', ['tahun' => 2024]))->assertOk();
        $this->get(route('klinisOpsiPengendalian.index', ['tahun' => 2024]))->assertOk();
        $this->get(route('MutuIndikator.index', ['tahun' => 2025]))->assertOk();
        $this->get(route('MutuUnit.index', ['tahun' => 2025]))->assertOk();
        $response = $this->get(route('kinerja.export', $this->target->id))->assertOk();
        $archive = DB::table('cascading_exports')->where('periode_kinerja_id', $this->target->id)->first();
        $snapshot = json_decode($archive->snapshot, true);
        $this->assertCount(DB::table('indikator_fitur4s')->where('periode_kinerja_id', $this->target->id)->where('is_active', true)->count(), $snapshot['levels']['4']);
        $this->assertStringStartsWith('PK', $response->streamedContent());
        $this->get(route('kinerja.exportArchive', $archive->id))->assertOk();
        $this->assertEquals('2', $archive->template_version);
        $legacyId = DB::table('cascading_exports')->insertGetId([
            'periode_kinerja_id' => $this->target->id, 'template_version' => '1', 'snapshot' => json_encode($snapshot),
            'created_at' => now(), 'updated_at' => now(),
        ]);
        $this->mock(\App\Services\LegacyCascadingExportService::class, function ($mock) {
            $mock->shouldReceive('build')->once()->andReturn(new \PhpOffice\PhpSpreadsheet\Spreadsheet());
        });
        $this->assertStringStartsWith('PK', $this->get(route('kinerja.exportArchive', $legacyId))->assertOk()->streamedContent());
    }

    public function test_review_requires_new_assessment_and_closed_period_blocks_child_writes(): void
    {
        app(RiskRegisterYearCopyService::class)->copy($this->filters);
        $copy = RiskRegister::where('copied_from_risk_register_id', $this->source->id)->firstOrFail();
        $this->post(route('riskRegisterCopy.review', $copy))->assertSessionHasErrors('review');
        $copy->osd1_dampak = 2;
        $copy->osd1_probabilitas = 3;
        $copy->save();
        $this->post(route('riskRegisterCopy.review', $copy))->assertSessionHasNoErrors();
        $this->assertFalse($copy->fresh()->needs_review);
        $this->target->update(['status' => 'ditutup']);
        $this->put(route('riskregister.fgdinherent'), ['id' => $copy->id])->assertSessionHasErrors('periode_kinerja_id');
    }

    public function test_migrated_mutu_transactions_keep_their_year_and_future_copy_requires_approval(): void
    {
        $mismatch = DB::table('mutu_units as u')->join('mutu_indikators as m', 'm.id', '=', 'u.mutu_indikator_id')
            ->join('periode_kinerjas as p', 'p.id', '=', 'm.periode_kinerja_id')->whereRaw('YEAR(u.tanggal_mutu) <> p.tahun')->count();
        $this->assertEquals(0, $mismatch);
        $master = DB::table('mutu_indikators')->where('periode_kinerja_id', $this->target->id)->first();
        $this->assertEquals(0, $master->approved);
        $this->assertNotNull($master->copied_from_id);
        $unit = new \App\Models\MUTU\MutuUnit();
        $unit->mutu_indikator_id = $master->id;
        $unit->tanggal_mutu = '2024-01-01';
        $this->expectException(ValidationException::class);
        $unit->save();
    }

    public function test_copy_unique_key_is_enforced_by_database(): void
    {
        app(RiskRegisterYearCopyService::class)->copy($this->filters);
        $copy = RiskRegister::where('copied_from_risk_register_id', $this->source->id)->firstOrFail();
        $duplicate = $copy->replicate(['kode_risiko']);
        $this->expectException(\Illuminate\Database\QueryException::class);
        $duplicate->save();
    }

    public function test_editor_can_create_draft_and_export_treats_text_as_literal(): void
    {
        $this->post(route('kinerja.store'), ['tahun' => 2092])->assertSessionHasNoErrors();
        $draft = PeriodeKinerja::where('tahun', 2092)->firstOrFail();
        $this->post(route('kinerja.nodes', [$draft->id, '1']), ['name' => '=1+1', 'sort_order' => 1, 'is_active' => true])->assertSessionHasNoErrors();
        $this->assertEquals('=1+1', DB::table('sasaran_strategis')->where('periode_kinerja_id', $draft->id)->value('name'));
        $parent = DB::table('indikator_fitur1s')->where('periode_kinerja_id', $draft->id)->first();
        for ($level = 2; $level <= 4; $level++) {
            $payload = ['name' => 'Fitur '.$level, 'sort_order' => 1, 'is_active' => true, 'indikator_fitur'.($level - 1).'_id' => $parent->id];
            if ($level === 4) {
                $payload['location_id'] = [0];
            }
            $this->post(route('kinerja.nodes', [$draft->id, (string) $level]), $payload)->assertSessionHasNoErrors();
            $child = DB::table('indikator_fitur'.$level.'s')->where('periode_kinerja_id', $draft->id)->first();
            $this->assertEquals($parent->sasaran_strategis_id, $child->sasaran_strategis_id);
            $parent = $child;
        }
        $this->post(route('kinerja.nodes', [$draft->id, 'sasaran']), ['name' => 'Tidak lagi dikelola'])->assertNotFound();
        $this->get(route('kinerja.index', ['tahun' => 2092]))->assertInertia(fn (Assert $page) => $page
            ->missing('nodes.sasaran')->where('cascadingTree.0.children.0.children.0.children.0.display_code', '1.1.a.1'));
        // An unused legacy target does not block activation of the actual feature hierarchy.
        DB::table('sasaran_strategis')->where('periode_kinerja_id', $draft->id)->update(['is_active' => false]);
        $this->put(route('kinerja.update', $draft->id), ['status' => 'aktif', 'nama_organisasi' => 'RS Uji', 'tujuan' => 'Tujuan uji'])->assertSessionHasNoErrors();
        $snapshot = ['period' => ['tahun' => 2092, 'nama_organisasi' => '=1+1', 'tujuan' => '', 'status' => 'draft', 'rekonstruksi' => false], 'levels' => []];
        $book = app(CascadingExportService::class)->build($snapshot);
        $this->assertEquals('s', $book->getActiveSheet()->getCell('A2')->getDataType());
        $this->assertStringContainsString('=1+1', $book->getActiveSheet()->getCell('A2')->getValue());
    }
}
