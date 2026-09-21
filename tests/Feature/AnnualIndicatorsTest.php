<?php

namespace Tests\Feature;

use App\Models\PeriodeKinerja;
use App\Models\Pic;
use App\Models\RiskRegister;
use App\Models\User;
use App\Services\AnnualIndicatorService;
use App\Services\CascadingExportService;
use App\Services\CascadingHierarchyService;
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

    private int $responsibleId;

    protected function setUp(): void
    {
        parent::setUp();
        $this->sourcePeriod = PeriodeKinerja::where('tahun', 2024)->firstOrFail();
        // The local 2024 archive may have no registers after annual preparation.
        // Build the fixture inside this rolled-back transaction instead.
        $this->sourcePeriod->update(['status' => 'aktif']);
        $template = RiskRegister::firstOrFail();
        $template->periode_kinerja_id = $this->sourcePeriod->id;
        $template->indikator_fitur4_id = DB::table('indikator_fitur4s')->where('periode_kinerja_id', $this->sourcePeriod->id)->where('is_active', true)->value('id');
        $template->indikator_snapshot = null;
        $pic = Pic::firstOrFail();
        $this->actingAs(User::factory()->create(['pic_id' => $pic->id]));
        Gate::before(fn () => $this->admin);
        $this->responsibleId = DB::table('kinerja_penanggung_jawabs')->insertGetId(['name' => 'Jabatan pengujian', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()]);
        DB::table('kinerja_penanggung_jawab_units')->insert(['penanggung_jawab_id' => $this->responsibleId, 'location_id' => $pic->location_id]);
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
        $this->source->kode_risiko = 'ROO.24.02.43.'.$this->source->id;
        $this->source->save();
        // Supply an annual MUTU master without moving existing transactions.
        $mutu = (array) DB::table('mutu_indikators')->first();
        unset($mutu['id']);
        $mutu['periode_kinerja_id'] = $this->sourcePeriod->id;
        $mutu['indikator_fitur4_id'] = $this->source->indikator_fitur4_id;
        $mutu['lineage_id'] = (string) \Illuminate\Support\Str::uuid();
        $mutu['approved'] = 1;
        DB::table('mutu_indikators')->insert($mutu);
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
        // Level four is a permanent master: the copy keeps the same indicator in the new year.
        $this->assertEquals($this->source->indikator_fitur4_id, $copy->indikator_fitur4_id);
        $this->assertEquals($this->target->id, $copy->indikator_snapshot['indikator_fitur4s']['periode_kinerja_id']);
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

    public function test_continuing_risk_keeps_original_code_across_multiple_years(): void
    {
        $service = app(RiskRegisterYearCopyService::class);
        $this->sourcePeriod->update(['status' => 'ditutup']);
        $this->post(route('riskRegisterCopy.store'), $this->filters + ['risk_code_mode' => 'preserve'])->assertSessionHasNoErrors();
        $first = RiskRegister::where('copied_from_risk_register_id', $this->source->id)->firstOrFail();
        $this->assertSame($this->source->kode_risiko, $first->kode_risiko);
        $this->assertEquals(1, $first->is_risiko_lama);
        $this->assertSame('preserve', $first->risk_register_histories()->first()->snapshot['risk_code_mode']);
        $next = PeriodeKinerja::create(['tahun' => 2092, 'status' => 'draft']);
        app(AnnualIndicatorService::class)->copyHierarchy($this->target->id, $next);
        $next->update(['status' => 'aktif']);
        $filters = array_replace($this->filters, ['source_year' => 2091, 'target_year' => 2092]);
        $this->assertEquals(1, $service->copy($filters)['copied']);
        $second = RiskRegister::where('copied_from_risk_register_id', $first->id)->firstOrFail();
        $this->assertSame($this->source->kode_risiko, $second->kode_risiko);
        $this->assertEquals(2091, $second->copied_from_year);
        $this->assertEquals(1, $service->copy($filters)['already_copied']);
        // A direct copy from the original year must not create the same risk again.
        $direct = array_replace($this->filters, ['target_year' => 2092]);
        $this->assertEquals(1, $service->preview($direct)['code_conflict']);
        $this->assertEquals(0, $service->copy($direct)['copied']);
        $second->delete();
        $this->assertEquals(0, $service->copy($direct)['copied']);
    }

    public function test_new_risk_gets_target_year_code_and_invalid_mode_is_rejected(): void
    {
        $this->post(route('riskRegisterCopy.store'), $this->filters + ['risk_code_mode' => 'invalid'])->assertSessionHasErrors('risk_code_mode');
        $this->get(route('riskRegisterCopy.index', $this->filters))->assertInertia(fn (Assert $page) => $page->where('filters.risk_code_mode', 'preserve'));
        $this->post(route('riskRegisterCopy.store'), $this->filters + ['risk_code_mode' => 'new'])->assertSessionHasNoErrors();
        $copy = RiskRegister::where('copied_from_risk_register_id', $this->source->id)->firstOrFail();
        $prefix = (int) $copy->risk_category_id === 5 ? 'RSO' : 'ROO';
        $this->assertSame($prefix.'.91.02.43.'.$copy->id, $copy->kode_risiko);
        $this->assertNotSame($this->source->kode_risiko, $copy->kode_risiko);
        $this->assertEquals(0, $copy->is_risiko_lama);
        $this->assertNull($copy->output);
        $this->assertTrue($copy->needs_review);
        $this->assertSame('new', $copy->risk_register_histories()->first()->snapshot['risk_code_mode']);
        $this->assertEquals(0, app(RiskRegisterYearCopyService::class)->copy($this->filters)['copied']);
    }

    public function test_missing_source_code_requires_new_code_mode(): void
    {
        $this->source->kode_risiko = null;
        $this->source->save();
        $service = app(RiskRegisterYearCopyService::class);
        $this->assertEquals(1, $service->preview($this->filters)['missing_code']);
        $this->assertEquals(0, $service->copy($this->filters)['copied']);
        $this->assertEquals(1, $service->copy($this->filters + ['risk_code_mode' => 'new'])['copied']);
    }

    public function test_duplicate_source_codes_have_matching_preview_and_execution_counts(): void
    {
        $duplicate = $this->source->replicate(['copy_key']);
        $duplicate->save();
        $service = app(RiskRegisterYearCopyService::class);
        $preview = $service->preview($this->filters);
        $this->assertEquals(1, $preview['eligible']);
        $this->assertEquals(1, $preview['code_conflict']);
        $result = $service->copy($this->filters);
        $this->assertEquals(1, $result['copied']);
        $this->assertEquals(1, $result['code_conflict']);
    }

    public function test_missing_mapping_blocks_copy_then_explicit_mapping_resolves_it(): void
    {
        $service = app(AnnualIndicatorService::class);
        $target = $service->resolve($this->source->indikator_fitur4_id, $this->target->id);
        // A master that is inactive in the target year cannot be copied until it is mapped.
        DB::table('indikator_fitur4s')->where('id', $target->id)->update(['is_active' => false]);
        $copy = app(RiskRegisterYearCopyService::class);
        $this->assertEquals(1, $copy->preview($this->filters)['unmapped']);
        $this->assertEquals(0, $copy->copy($this->filters)['copied']);
        $replacement = DB::table('indikator_fitur4s')->where('periode_kinerja_id', $this->target->id)->where('is_active', true)->where('id', '<>', $target->id)->first();
        DB::table('indikator_fitur4s')->where('id', $replacement->id)->update(['location_id' => '[0]']);
        $this->post(route('kinerja.mapping'), ['source_indicator_id' => $this->source->indikator_fitur4_id, 'target_period_id' => $this->target->id, 'target_indicator_id' => $replacement->id])->assertSessionHasNoErrors();
        $this->assertEquals(1, $copy->copy($this->filters)['copied']);
        $this->assertEquals($replacement->master_id, RiskRegister::where('copied_from_risk_register_id', $this->source->id)->value('indikator_fitur4_id'));
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
        $this->assertEquals('error', $service->copyUnit($filters + ['risk_code_mode' => 'preserve'])['type']);
        $this->assertEquals(1, $service->copyUnit($filters)['copied']);
        $unitCopy = RiskRegister::where('copied_from_risk_register_id', $this->source->id)->where('copy_type', 'unit')->firstOrFail();
        $this->assertNotSame($this->source->kode_risiko, $unitCopy->kode_risiko);
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
        $payload['penanggung_jawab_id'] = $this->responsibleId;
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
        $this->assertEquals('3', $archive->template_version);
        $legacyId = DB::table('cascading_exports')->insertGetId([
            'periode_kinerja_id' => $this->target->id, 'template_version' => '1', 'snapshot' => json_encode($snapshot),
            'created_at' => now(), 'updated_at' => now(),
        ]);
        $this->mock(\App\Services\LegacyCascadingExportService::class, function ($mock) {
            $mock->shouldReceive('build')->once()->andReturn(new \PhpOffice\PhpSpreadsheet\Spreadsheet());
        });
        $this->assertStringStartsWith('PK', $this->get(route('kinerja.exportArchive', $legacyId))->assertOk()->streamedContent());
    }

    public function test_review_requires_new_assessment_and_closed_period_keeps_registers_editable(): void
    {
        app(RiskRegisterYearCopyService::class)->copy($this->filters);
        $copy = RiskRegister::where('copied_from_risk_register_id', $this->source->id)->firstOrFail();
        $this->post(route('riskRegisterCopy.review', $copy))->assertSessionHasErrors('review');
        $copy->osd1_dampak = 2;
        $copy->osd1_probabilitas = 3;
        $copy->save();
        $this->post(route('riskRegisterCopy.review', $copy))->assertSessionHasNoErrors();
        $this->assertFalse($copy->fresh()->needs_review);
        // A closed period locks its hierarchy, not the registers recorded in it.
        $this->target->update(['status' => 'ditutup']);
        $this->put(route('riskregister.fgdinherent'), ['id' => $copy->id])->assertSessionDoesntHaveErrors('periode_kinerja_id');
    }

    public function test_mutu_dictionary_is_permanent_and_measurement_needs_active_placement(): void
    {
        // Dictionaries are not copied per year; a new year reuses the same dictionary.
        $this->assertFalse(DB::table('mutu_indikators')->where('periode_kinerja_id', $this->target->id)->exists());
        $masterId = (int) $this->source->indikator_fitur4_id;
        $dictionary = \App\Models\MUTU\MutuIndikator::create(['indikator_fitur4_id' => $masterId, 'mutu_kategori_id' => DB::table('mutu_kategoris')->value('id'),
            'location_id' => auth()->user()->pic->location_id, 'num_name' => 'Pembilang', 'denum_name' => 'Penyebut', 'standar' => 80, 'operator' => '≥', 'penyebut' => '%', 'approved' => 1]);
        $this->assertNull($dictionary->fresh()->periode_kinerja_id);
        $measure = fn ($date) => \App\Models\MUTU\MutuUnit::create(['mutu_indikator_id' => $dictionary->id, 'code' => \Illuminate\Support\Str::random(8), 'tanggal_mutu' => $date, 'num' => 8, 'denum' => 10, 'capaian' => 80]);
        $this->assertNotNull($measure('2024-03-01')->id);
        $this->assertNotNull($measure('2091-03-01')->id);
        DB::table('indikator_fitur4s')->where('periode_kinerja_id', $this->target->id)->where('master_id', $masterId)->update(['is_active' => false]);
        $this->expectException(ValidationException::class);
        $measure('2091-04-01');
    }

    public function test_copy_unique_key_is_enforced_by_database(): void
    {
        app(RiskRegisterYearCopyService::class)->copy($this->filters);
        $copy = RiskRegister::where('copied_from_risk_register_id', $this->source->id)->firstOrFail();
        $duplicate = $copy->replicate(['kode_risiko']);
        $this->expectException(\Illuminate\Database\QueryException::class);
        $duplicate->save();
    }

    public function test_active_period_supports_editing_all_four_levels_without_rewriting_saved_snapshots(): void
    {
        $snapshot = $this->source->fresh()->indikator_snapshot;
        $this->get(route('kinerja.export', $this->sourcePeriod->id))->assertOk();
        $archive = DB::table('cascading_exports')->where('periode_kinerja_id', $this->sourcePeriod->id)->latest('id')->first();

        foreach (range(1, 4) as $level) {
            $table = 'indikator_fitur'.$level.'s';
            $row = DB::table($table)->find($snapshot[$table]['id']);
            $payload = (array) $row;
            $payload['name'] = 'Nama diperbarui fitur '.$level;
            $payload['tujuan'] = 'Tujuan diperbarui';
            $payload['penanggung_jawab_id'] = $this->responsibleId;
            $payload['jabatan'] = 'Jabatan pengujian';
            if ($level === 4) {
                $payload['penanggung_jawab_id'] = $this->responsibleId;
                $payload['location_id'] = [0];
            }
            $this->post(route('kinerja.nodes', [$this->sourcePeriod->id, (string) $level]), $payload)->assertSessionHasNoErrors();
            $this->assertDatabaseHas($table, ['id' => $row->id, 'name' => $payload['name'], 'tujuan' => $payload['tujuan'], 'jabatan' => $payload['jabatan']]);
            // Levels 1-3 are yearly copies; level four shares its master's wording in every year.
            $this->assertDatabaseHas($table, ['periode_kinerja_id' => $this->target->id, 'copied_from_id' => $row->id, 'name' => $level === 4 ? $payload['name'] : $row->name]);
            $activity = \Spatie\Activitylog\Models\Activity::where('log_name', 'indikator_tahunan')->latest('id')->firstOrFail();
            $this->assertEquals($row->name, $activity->properties['old']['name']);
            $this->assertEquals($payload['name'], $activity->properties['attributes']['name']);
            $this->assertEquals(auth()->id(), $activity->causer_id);
        }

        $this->assertSame($snapshot, $this->source->fresh()->indikator_snapshot);
        $this->assertSame($archive->snapshot, DB::table('cascading_exports')->where('id', $archive->id)->value('snapshot'));
        $this->get(route('kinerja.index', ['tahun' => $this->sourcePeriod->tahun]))->assertInertia(fn (Assert $page) => $page
            ->where('period.status', 'aktif')
            ->where('nodes.4', fn ($rows) => collect($rows)->contains('name', 'Nama diperbarui fitur 4')));
    }

    public function test_active_reparenting_updates_descendant_context_and_rejects_disconnected_children(): void
    {
        $snapshot = $this->source->fresh()->indikator_snapshot;
        $program = DB::table('indikator_fitur2s')->find($snapshot['indikator_fitur2s']['id']);
        $newParent = DB::table('indikator_fitur1s')->where('periode_kinerja_id', $this->sourcePeriod->id)
            ->where('id', '<>', $program->indikator_fitur1_id)->where('is_active', true)->first();
        $payload = (array) $program;
        $payload['indikator_fitur1_id'] = $newParent->id;
        $payload['kode_cascading'] = null;
        $this->post(route('kinerja.nodes', [$this->sourcePeriod->id, '2']), $payload)->assertSessionHasNoErrors();
        foreach ([2 => $program->id, 3 => $snapshot['indikator_fitur3s']['id'], 4 => $snapshot['indikator_fitur4s']['id']] as $level => $id) {
            $this->assertDatabaseHas('indikator_fitur'.$level.'s', ['id' => $id, 'sasaran_strategis_id' => $newParent->sasaran_strategis_id]);
        }
        $payload['is_active'] = false;
        $this->post(route('kinerja.nodes', [$this->sourcePeriod->id, '2']), $payload)->assertSessionHasErrors('is_active');
        $this->assertDatabaseHas('indikator_fitur2s', ['id' => $program->id, 'is_active' => true]);
        $payload['is_active'] = true;
        DB::table('indikator_fitur1s')->where('id', $newParent->id)->update(['is_active' => false]);
        $this->post(route('kinerja.nodes', [$this->sourcePeriod->id, '2']), $payload)->assertSessionHasErrors('indikator_fitur1_id');
        $payload['indikator_fitur1_id'] = DB::table('indikator_fitur1s')->where('periode_kinerja_id', $this->target->id)->value('id');
        $this->post(route('kinerja.nodes', [$this->sourcePeriod->id, '2']), $payload)->assertSessionHasErrors('indikator_fitur1_id');
        $this->assertSame($snapshot, $this->source->fresh()->indikator_snapshot);
    }

    public function test_closed_cross_period_and_unauthorized_edits_are_rejected(): void
    {
        $row = DB::table('indikator_fitur1s')->where('periode_kinerja_id', $this->sourcePeriod->id)->first();
        $payload = (array) $row;
        $payload['name'] = 'Perubahan ditolak';
        $this->post(route('kinerja.nodes', [$this->target->id, '1']), $payload)->assertNotFound();
        $this->sourcePeriod->update(['status' => 'ditutup']);
        $this->post(route('kinerja.nodes', [$this->sourcePeriod->id, '1']), $payload)->assertSessionHasErrors('name');
        $this->admin = false;
        $this->post(route('kinerja.nodes', [$this->sourcePeriod->id, '1']), $payload)->assertForbidden();
        $this->assertDatabaseHas('indikator_fitur1s', ['id' => $row->id, 'name' => $row->name]);
    }

    public function test_responsible_master_validates_units_names_and_access(): void
    {
        $unit = DB::table('locations')->value('id');
        $payload = ['name' => 'Kepala unit pengujian', 'is_active' => true, 'location_ids' => [$unit]];
        $this->post(route('kinerja.responsible'), $payload)->assertSessionHasNoErrors();
        $id = DB::table('kinerja_penanggung_jawabs')->where('name', $payload['name'])->value('id');
        $this->assertDatabaseHas('kinerja_penanggung_jawab_units', ['penanggung_jawab_id' => $id, 'location_id' => $unit]);
        $this->get(route('kinerja.index', ['tahun' => 2024]))->assertInertia(fn (Assert $page) => $page
            ->where('responsiblePositions', fn ($positions) => collect($positions)->contains('id', $id)));
        $this->post(route('kinerja.responsible'), $payload)->assertSessionHasErrors('name');
        $payload['id'] = $id;
        $payload['location_ids'] = [];
        $this->post(route('kinerja.responsible'), $payload)->assertSessionHasErrors('location_ids');
        $payload['location_ids'] = [0];
        $this->post(route('kinerja.responsible'), $payload)->assertSessionHasErrors('location_ids.0');
        $payload['location_ids'] = [$unit, $unit];
        $this->post(route('kinerja.responsible'), $payload)->assertSessionHasErrors('location_ids.0');
        $payload['location_ids'] = [$unit];
        $payload['is_active'] = false;
        $this->post(route('kinerja.responsible'), $payload)->assertSessionHasNoErrors();
        $this->assertDatabaseHas('kinerja_penanggung_jawabs', ['id' => $id, 'is_active' => false]);
        $this->admin = false;
        $this->post(route('kinerja.responsible'), $payload)->assertForbidden();
    }

    public function test_every_register_year_has_an_indicator_placement_and_preparation_stays_one_shot(): void
    {
        // Both preparation paths (cascading:prepare-2023-2026 on a fresh server,
        // cascading:prepare-2023 on one prepared earlier) must leave 2023 looking like 2024.
        $reference = PeriodeKinerja::where('tahun', 2024)->firstOrFail();
        $period = PeriodeKinerja::where('tahun', 2023)->first();
        $this->assertNotNull($period, 'Jalankan persiapan periode 2023 terlebih dahulu.');
        $this->assertSame(['ditutup', 1], [$period->status, (int) $period->feature_schema_version]);
        foreach (CascadingHierarchyService::TABLES as $table) {
            $this->assertSame(
                DB::table($table)->where('periode_kinerja_id', $reference->id)->count(),
                DB::table($table)->where('periode_kinerja_id', $period->id)->count(),
                $table.' 2023 berbeda dari 2024'
            );
        }
        $this->assertFalse(DB::table('indikator_fitur4s')->where('periode_kinerja_id', $period->id)->whereNull('indikator_fitur3_id')->exists());
        // The register exports resolve the hierarchy per year, so no year may be left out.
        foreach (DB::table('risk_registers')->whereNull('deleted_at')->selectRaw('year(tgl_register) tahun, count(*) jumlah')->groupBy('tahun')->get() as $row) {
            $periodId = PeriodeKinerja::where('tahun', $row->tahun)->value('id');
            $this->assertNotNull($periodId, 'Tidak ada periode untuk register tahun '.$row->tahun);
            $this->assertSame(0, DB::table('risk_registers')->whereNull('deleted_at')->whereYear('tgl_register', $row->tahun)
                ->whereNotIn('indikator_fitur4_id', DB::table('indikator_fitur4s')->where('periode_kinerja_id', $periodId)->select('master_id'))
                ->count(), 'Ada register '.$row->tahun.' tanpa penempatan indikator');
        }
        // Preparation is one-shot and refuses to run again, with or without --apply.
        $this->artisan('cascading:prepare-2023')->assertFailed();
        $this->artisan('cascading:prepare-2023-2026')->assertFailed();
        $this->assertSame($period->id, PeriodeKinerja::where('tahun', 2023)->value('id'));
    }

    public function test_index_names_the_responsible_pic_and_places_an_unlinked_master_from_its_direct_parent(): void
    {
        $pic = Pic::whereNotIn('id', DB::table('kinerja_penanggung_jawabs')->whereNotNull('pic_id')->pluck('pic_id'))->firstOrFail();
        $unitPic = DB::table('pics')->pluck('name', 'location_id')->get($pic->location_id);
        DB::table('kinerja_penanggung_jawabs')->where('id', $this->responsibleId)->update(['pic_id' => $pic->id]);
        $activity = DB::table('indikator_fitur3s')->where('periode_kinerja_id', $this->sourcePeriod->id)->where('is_active', true)->first();
        DB::table('indikator_fitur3s')->where('id', $activity->id)->update(['penanggung_jawab_id' => $this->responsibleId, 'jabatan' => 'Jabatan usang']);
        $placement = DB::table('indikator_fitur4s')->where('periode_kinerja_id', $this->sourcePeriod->id)->where('master_id', $this->source->indikator_fitur4_id)->first();
        DB::table('indikator_fitur4s')->where('id', $placement->id)->update(['indikator_fitur3_id' => null,
            'penanggung_jawab_id' => null, 'jabatan' => null, 'location_id' => json_encode([(int) $pic->location_id])]);

        $this->get(route('kinerja.index', ['tahun' => $this->sourcePeriod->tahun]))->assertOk()->assertInertia(fn (Assert $page) => $page
            // A position is shown as the PIC behind it, not as the stored jabatan.
            ->where('nodes.3', fn ($rows) => collect($rows)->firstWhere('id', $activity->id)['penanggung_jawab'] === $pic->name)
            // A unit master without a position falls back to the PIC of its unit.
            ->where('nodes.4', fn ($rows) => collect($rows)->firstWhere('id', $placement->id)['penanggung_jawab'] === $unitPic));

        // Positioning only needs the level-three activity; the levels above follow from it.
        $payload = (array) DB::table('indikator_fitur4s')->find($placement->id);
        $payload['indikator_fitur3_id'] = $activity->id;
        $this->post(route('kinerja.nodes', [$this->sourcePeriod->id, '4']), $payload)->assertSessionHasNoErrors();
        $saved = DB::table('indikator_fitur4s')->find($placement->id);
        $this->assertEquals($activity->id, $saved->indikator_fitur3_id);
        $this->assertEquals($activity->sasaran_strategis_id, $saved->sasaran_strategis_id);
        $this->assertEquals($this->responsibleId, $saved->penanggung_jawab_id);
        // Once placed it carries the activity's position, but the table still names its unit PIC.
        $this->get(route('kinerja.index', ['tahun' => $this->sourcePeriod->tahun]))->assertOk()->assertInertia(fn (Assert $page) => $page
            ->where('nodes.4', fn ($rows) => collect($rows)->firstWhere('id', $placement->id)['penanggung_jawab'] === $unitPic));
    }

    public function test_feature_four_keeps_master_units_and_new_indicator_derives_units_from_responsible_master(): void
    {
        $row = DB::table('indikator_fitur4s')->where('periode_kinerja_id', $this->sourcePeriod->id)->where('master_id', $this->source->indikator_fitur4_id)->first();
        DB::table('indikator_fitur4s')->where('id', $row->id)->update(['penanggung_jawab_id' => null, 'jabatan' => null]);
        $activityPosition = DB::table('kinerja_penanggung_jawabs')->insertGetId(['name' => 'Kabag pengujian', 'is_active' => false, 'created_at' => now(), 'updated_at' => now()]);
        DB::table('indikator_fitur3s')->where('id', $row->indikator_fitur3_id)->update(['penanggung_jawab_id' => $activityPosition]);
        $otherYear = DB::table('indikator_fitur4s')->where('periode_kinerja_id', $this->target->id)->where('master_id', $row->master_id)->first();
        $payload = (array) DB::table('indikator_fitur4s')->find($row->id);
        $payload['penanggung_jawab_id'] = $this->responsibleId;
        $payload['jabatan'] = 'Nama palsu';
        $payload['location_id'] = [0, 999999];
        $route = route('kinerja.nodes', [$this->sourcePeriod->id, '4']);
        $this->post($route, $payload)->assertSessionHasNoErrors();
        $saved = DB::table('indikator_fitur4s')->find($row->id);
        // The unit of an existing indicator belongs to its master and never follows the request.
        $this->assertSame($row->location_id, $saved->location_id);
        $this->assertSame($saved->location_id, DB::table('indikator_fitur4s')->where('id', $row->master_id)->value('location_id'));
        // A unit indicator takes its activity's position, even an inactive one, and only in this year.
        $this->assertEquals($activityPosition, $saved->penanggung_jawab_id);
        $this->assertSame('Kabag pengujian', $saved->jabatan);
        $this->assertEquals($otherYear->penanggung_jawab_id, DB::table('indikator_fitur4s')->where('id', $otherYear->id)->value('penanggung_jawab_id'));
        $payload['penanggung_jawab_id'] = null;
        $this->post($route, $payload)->assertSessionHasNoErrors();
        $this->assertEquals($activityPosition, DB::table('indikator_fitur4s')->where('id', $row->id)->value('penanggung_jawab_id'));
        // Moving it to another activity moves the position along.
        $nextActivity = DB::table('indikator_fitur3s')->where('periode_kinerja_id', $this->sourcePeriod->id)->where('is_active', true)->where('id', '<>', $row->indikator_fitur3_id)->first();
        DB::table('indikator_fitur3s')->where('id', $nextActivity->id)->update(['penanggung_jawab_id' => $this->responsibleId]);
        $payload['indikator_fitur3_id'] = $nextActivity->id;
        $this->post($route, $payload)->assertSessionHasNoErrors();
        $this->assertEquals($this->responsibleId, DB::table('indikator_fitur4s')->where('id', $row->id)->value('penanggung_jawab_id'));
        $payload['indikator_fitur3_id'] = $row->indikator_fitur3_id;
        // A new indicator derives its units from the responsible master on the server.
        $this->sourcePeriod->update(['status' => 'draft']);
        unset($payload['id']);
        $payload['name'] = 'Indikator baru uji';
        $payload['kode_cascading'] = null;
        $payload['penanggung_jawab_id'] = $this->responsibleId;
        $this->post($route, $payload)->assertSessionHasNoErrors();
        $created = DB::table('indikator_fitur4s')->where('periode_kinerja_id', $this->sourcePeriod->id)->where('name', 'Indikator baru uji')->first();
        $expected = DB::table('kinerja_penanggung_jawab_units')->where('penanggung_jawab_id', $this->responsibleId)->pluck('location_id')->map(fn ($id) => (int) $id)->all();
        $this->assertSame($expected, json_decode($created->location_id, true));
        $this->assertDatabaseHas('indikator_fitur4s', ['id' => $created->master_id, 'periode_kinerja_id' => null, 'name' => 'Indikator baru uji']);
        // A position chosen for a new indicator is its own and is not replaced by the activity's.
        $this->post($route, ['id' => $created->id] + $payload)->assertSessionHasNoErrors();
        $this->assertEquals($this->responsibleId, DB::table('indikator_fitur4s')->where('id', $created->id)->value('penanggung_jawab_id'));
        $payload['name'] = 'Indikator baru kedua';
        $payload['penanggung_jawab_id'] = null;
        $this->post($route, $payload)->assertSessionHasErrors('penanggung_jawab_id');
        $payload['penanggung_jawab_id'] = 999999999;
        $this->post($route, $payload)->assertSessionHasErrors('penanggung_jawab_id');
        $payload['penanggung_jawab_id'] = $this->responsibleId;
        DB::table('kinerja_penanggung_jawabs')->where('id', $this->responsibleId)->update(['is_active' => false]);
        $this->post($route, $payload)->assertSessionHasErrors('penanggung_jawab_id');
        DB::table('kinerja_penanggung_jawabs')->where('id', $this->responsibleId)->update(['is_active' => true]);
        DB::table('kinerja_penanggung_jawab_units')->where('penanggung_jawab_id', $this->responsibleId)->delete();
        $this->post($route, $payload)->assertSessionHasErrors('penanggung_jawab_id');
        $this->assertSame($saved->location_id, DB::table('indikator_fitur4s')->where('id', $row->id)->value('location_id'));
        $this->assertFalse(DB::table('indikator_fitur4s')->where('name', 'Indikator baru kedua')->exists());
    }

    public function test_master_changes_sync_every_year_of_level_four_and_preserve_archives(): void
    {
        $snapshot = $this->source->fresh()->indikator_snapshot;
        $this->get(route('kinerja.export', $this->sourcePeriod->id))->assertOk();
        $archive = DB::table('cascading_exports')->where('periode_kinerja_id', $this->sourcePeriod->id)->latest('id')->first();
        foreach (range(1, 4) as $level) {
            $table = 'indikator_fitur'.$level.'s';
            DB::table($table)->where('id', $snapshot[$table]['id'])->update(['penanggung_jawab_id' => $this->responsibleId]);
        }
        $closed = DB::table('indikator_fitur4s')->where('periode_kinerja_id', $this->target->id)->where('master_id', $this->source->indikator_fitur4_id)->first();
        DB::table('indikator_fitur4s')->where('id', $closed->id)->update(['penanggung_jawab_id' => $this->responsibleId]);
        $this->target->update(['status' => 'ditutup']);
        $units = DB::table('locations')->orderBy('id')->take(2)->pluck('id')->map(fn ($id) => (int) $id)->all();
        $payload = ['id' => $this->responsibleId, 'name' => 'Jabatan diperbarui', 'is_active' => true, 'location_ids' => $units];
        $this->post(route('kinerja.responsible'), $payload)->assertSessionHasNoErrors();
        foreach (range(1, 4) as $level) {
            $table = 'indikator_fitur'.$level.'s';
            $this->assertDatabaseHas($table, ['id' => $snapshot[$table]['id'], 'jabatan' => $payload['name']]);
        }
        $this->assertSame($units, json_decode(DB::table('indikator_fitur4s')->where('id', $this->source->indikator_fitur4_id)->value('location_id'), true));
        // Level four shares its master's unit in every year; a closed year keeps its own position name.
        $this->assertDatabaseHas('indikator_fitur4s', ['id' => $closed->id, 'jabatan' => $closed->jabatan, 'location_id' => json_encode($units)]);
        $this->assertSame($snapshot, $this->source->fresh()->indikator_snapshot);
        $this->assertSame($archive->snapshot, DB::table('cascading_exports')->where('id', $archive->id)->value('snapshot'));
        $payload['is_active'] = false;
        $this->post(route('kinerja.responsible'), $payload)->assertSessionHasErrors('is_active');
        $draft = PeriodeKinerja::create(['tahun' => 2092, 'status' => 'draft']);
        app(AnnualIndicatorService::class)->copyHierarchy($this->target->id, $draft);
        $copy = DB::table('indikator_fitur4s')->where('periode_kinerja_id', $draft->id)->where('copied_from_id', $closed->id)->first();
        // Level four copies its source year's jabatan as written.
        $this->assertSame($closed->jabatan, $copy->jabatan);
        $this->assertSame($units, json_decode($copy->location_id, true));
    }

    public function test_editor_can_create_draft_and_export_treats_text_as_literal(): void
    {
        $this->post(route('kinerja.store'), ['tahun' => 2092])->assertSessionHasNoErrors();
        $draft = PeriodeKinerja::where('tahun', 2092)->firstOrFail();
        $this->post(route('kinerja.nodes', [$draft->id, '1']), ['name' => '=1+1', 'sasaran_baru' => 'Sasaran uji baru', 'sort_order' => 1, 'is_active' => true])->assertSessionHasNoErrors();
        $this->assertEquals('Sasaran uji baru', DB::table('sasaran_strategis')->where('periode_kinerja_id', $draft->id)->value('name'));
        $parent = DB::table('indikator_fitur1s')->where('periode_kinerja_id', $draft->id)->first();
        for ($level = 2; $level <= 4; $level++) {
            $payload = ['name' => 'Fitur '.$level, 'sort_order' => 1, 'is_active' => true, 'indikator_fitur'.($level - 1).'_id' => $parent->id];
            if ($level === 4) {
                $payload['penanggung_jawab_id'] = $this->responsibleId;
                $payload['location_id'] = [0];
            }
            $this->post(route('kinerja.nodes', [$draft->id, (string) $level]), $payload)->assertSessionHasNoErrors();
            $child = DB::table('indikator_fitur'.$level.'s')->where('periode_kinerja_id', $draft->id)->first();
            $this->assertEquals($parent->sasaran_strategis_id, $child->sasaran_strategis_id);
            $parent = $child;
        }
        $this->post(route('kinerja.nodes', [$draft->id, 'sasaran']), ['name' => 'Tidak lagi dikelola'])->assertNotFound();
        $this->get(route('kinerja.index', ['tahun' => 2092]))->assertInertia(fn (Assert $page) => $page
            ->has('nodes.sasaran', 1)->where('cascadingTree.0.children.0.children.0.children.0.display_code', '1.1.a.1'));
        // Schema 2 requires an active real sasaran above the IKU.
        DB::table('sasaran_strategis')->where('periode_kinerja_id', $draft->id)->update(['is_active' => false]);
        $this->put(route('kinerja.update', $draft->id), ['status' => 'aktif', 'nama_organisasi' => 'RS Uji', 'tujuan' => 'Tujuan uji'])->assertSessionHasErrors('status');
        DB::table('sasaran_strategis')->where('periode_kinerja_id', $draft->id)->update(['is_active' => true]);
        $this->put(route('kinerja.update', $draft->id), ['status' => 'aktif', 'nama_organisasi' => 'RS Uji', 'tujuan' => 'Tujuan uji'])->assertSessionHasNoErrors();
        $snapshot = ['period' => ['tahun' => 2092, 'nama_organisasi' => '=1+1', 'tujuan' => '', 'status' => 'draft', 'rekonstruksi' => false], 'levels' => []];
        $book = app(CascadingExportService::class)->build($snapshot);
        $this->assertEquals('s', $book->getActiveSheet()->getCell('A2')->getDataType());
        $this->assertStringContainsString('=1+1', $book->getActiveSheet()->getCell('A2')->getValue());
    }
}
