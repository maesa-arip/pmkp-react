<?php

namespace Tests\Feature;

use App\Models\Location;
use App\Models\Pic;
use App\Models\RiskRegister;
use App\Models\User;
use App\Services\AnnualIndicatorService;
use App\Services\RiskIndicatorAccess;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Notification;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PicIndicatorAccessTest extends TestCase
{
    use DatabaseTransactions;

    private bool $admin = false;
    private Pic $leader;
    private Pic $unit;
    private Pic $other;
    private int $position;
    private object $indicator;
    private RiskRegister $template;

    protected function setUp(): void
    {
        parent::setUp();
        Notification::fake();
        Gate::before(fn ($user, $ability) => $this->admin || $ability === 'edit data risk register sesuai lokasi');
        $this->leader = $this->pic('Wadir uji');
        $this->unit = $this->pic('Instalasi Farmasi uji');
        $this->other = $this->pic('PIC luar cakupan');
        $this->position = $this->position($this->leader);
        $this->actingAs(User::factory()->create(['pic_id' => $this->leader->id]));
        // Annual preparation leaves legacy transactions unassigned; build a rolled-back fixture.
        $this->template = RiskRegister::firstOrFail();
        $this->template->periode_kinerja_id = DB::table('periode_kinerjas')->where('tahun', 2024)->value('id');
        $this->template->indikator_fitur4_id = DB::table('indikator_fitur4s')->where('periode_kinerja_id', $this->template->periode_kinerja_id)->where('is_active', true)->value('id');
        $this->template->tgl_register = '2024-01-15 10:00:00';
        $this->template->indikator_snapshot = null;
        DB::table('periode_kinerjas')->where('id', $this->template->periode_kinerja_id)->update(['status' => 'aktif']);
        $this->indicator = DB::table('indikator_fitur4s')->find($this->template->indikator_fitur4_id);
        DB::table('indikator_fitur4s')->where('id', $this->indicator->id)->update([
            'location_id' => json_encode([$this->unit->location_id]),
            'penanggung_jawab_id' => $this->position, 'is_active' => true,
        ]);
        $this->indicator = DB::table('indikator_fitur4s')->find($this->indicator->id);
    }

    private function pic(string $name): Pic
    {
        $location = Location::create(['name' => $name.' '.uniqid()]);
        return Pic::create(['name' => $location->name, 'location_id' => $location->id]);
    }

    private function position(Pic $pic, ?int $parent = null): int
    {
        return DB::table('kinerja_penanggung_jawabs')->insertGetId([
            'name' => $pic->name, 'pic_id' => $pic->id, 'parent_id' => $parent,
            'is_active' => true, 'can_use_descendant_indicators' => false,
            'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    private function createRisk(): RiskRegister
    {
        $risk = $this->template->replicate(['copy_key', 'copied_from_risk_register_id', 'kode_risiko']);
        $risk->user_id = auth()->id();
        $risk->pic_id = json_encode([$this->leader->id]);
        $risk->indikator_snapshot = null;
        $risk->save();
        return $risk;
    }

    public function test_owner_and_unit_share_indicator_but_other_pic_is_rejected(): void
    {
        $service = app(AnnualIndicatorService::class);
        $this->assertTrue($service->acceptsPics($this->indicator, [$this->leader->id, $this->unit->id]));
        $this->assertFalse($service->acceptsPics($this->indicator, [$this->leader->id, $this->other->id]));
        $access = app(RiskIndicatorAccess::class);
        $this->assertTrue($access->forPic($this->leader->id)->whereKey($this->indicator->id)->exists());
        $this->assertTrue($access->forPic($this->unit->id)->whereKey($this->indicator->id)->exists());
        $this->assertFalse($access->forPic($this->other->id)->whereKey($this->indicator->id)->exists());
        DB::table('indikator_fitur4s')->where('id', $this->indicator->id)->update(['location_id' => '[]']);
        $this->assertTrue($service->acceptsPics($this->indicator, [$this->leader->id]));
        $this->assertFalse($service->acceptsPics($this->indicator, [$this->unit->id]));
    }

    public function test_descendant_access_is_explicit_and_stops_at_inactive_positions(): void
    {
        $child = $this->position($this->other, $this->position);
        DB::table('indikator_fitur4s')->where('id', $this->indicator->id)->update(['penanggung_jawab_id' => $child]);
        $access = app(RiskIndicatorAccess::class);
        $this->assertFalse($access->allowsUser(auth()->user(), $this->indicator->id));
        DB::table('kinerja_penanggung_jawabs')->where('id', $this->position)->update(['can_use_descendant_indicators' => true]);
        $this->assertTrue($access->allowsUser(auth()->user(), $this->indicator->id));
        $this->assertTrue(app(AnnualIndicatorService::class)->acceptsPics($this->indicator, [$this->leader->id]));
        DB::table('kinerja_penanggung_jawabs')->where('id', $child)->update(['is_active' => false]);
        $this->assertFalse($access->allowsUser(auth()->user(), $this->indicator->id));
    }

    public function test_cascading_parent_owner_can_use_level_four_indicators(): void
    {
        $parent = DB::table('indikator_fitur3s')->find($this->indicator->indikator_fitur3_id);
        DB::table('indikator_fitur4s')->where('id', $this->indicator->id)->update(['penanggung_jawab_id' => null]);
        DB::table('indikator_fitur2s')->where('id', $parent->indikator_fitur2_id)->update(['penanggung_jawab_id' => $this->position, 'is_active' => true]);
        $this->assertTrue(app(RiskIndicatorAccess::class)->allowsUser(auth()->user(), $this->indicator->id));
        DB::table('indikator_fitur2s')->where('id', $parent->indikator_fitur2_id)->update(['is_active' => false]);
        $this->assertFalse(app(RiskIndicatorAccess::class)->allowsUser(auth()->user(), $this->indicator->id));
    }

    /** @dataProvider registerRoutes */
    public function test_input_form_and_server_use_the_same_scope(string $route): void
    {
        $this->get(route($route.'.index', ['tahun' => 2024]))->assertOk()->assertInertia(fn (Assert $page) => $page
            ->where('indikatorFitur4s', fn ($rows) => collect($rows)->contains(fn ($row) => $row['id'] === $this->indicator->id && $row['can_select'])));
        $payload = $this->payload();
        $this->post(route($route.'.store'), $payload)->assertSessionHasNoErrors();
        $risk = RiskRegister::latest('id')->firstOrFail();
        $this->assertEquals(auth()->id(), $risk->user_id);
        $this->assertEquals([$this->leader->id], json_decode($risk->pic_id, true));
        $payload['pic_id'] = $this->leader->id.','.$this->other->id;
        $this->put(route($route.'.update', $risk), $payload)->assertSessionHasErrors('indikator_fitur4_id');
        $this->actingAs(User::factory()->create(['pic_id' => $this->other->id]));
        $payload['pic_id'] = (string) $this->leader->id;
        $this->post(route($route.'.store'), $payload)->assertSessionHasErrors('indikator_fitur4_id');
    }

    public function registerRoutes(): array
    {
        return [['riskRegisterKlinis'], ['riskRegisterNonKlinis']];
    }

    public function test_scope_changes_keep_historical_indicator_and_snapshot(): void
    {
        $risk = $this->createRisk();
        $snapshot = $risk->indikator_snapshot;
        DB::table('indikator_fitur4s')->where('id', $this->indicator->id)->update(['penanggung_jawab_id' => null, 'location_id' => '[]']);
        $options = app(RiskIndicatorAccess::class)->optionsForUser(auth()->user());
        $this->assertFalse($options->firstWhere('id', $this->indicator->id)->can_select);
        $risk->pic_id = (string) $this->leader->id; // Same assignment in a legacy format.
        $risk->pernyataan_risiko = 'Perbaikan uraian historis';
        $risk->save();
        $this->assertEquals($snapshot, $risk->fresh()->indikator_snapshot);
        $this->expectException(\Illuminate\Validation\ValidationException::class);
        $this->createRisk();
    }

    public function test_master_links_owner_without_units_and_rejects_cycles_duplicates_and_unauthorized_edits(): void
    {
        $this->admin = true;
        $child = $this->position($this->other, $this->position);
        $payload = ['id' => $this->position, 'name' => $this->leader->name, 'pic_id' => $this->leader->id,
            'parent_id' => null, 'can_use_descendant_indicators' => false, 'is_active' => true, 'location_ids' => []];
        $this->post(route('kinerja.responsible'), $payload)->assertSessionHasNoErrors();
        $this->assertDatabaseHas('indikator_fitur4s', ['id' => $this->indicator->id, 'location_id' => '[]']);
        $this->post(route('kinerja.responsible'), array_replace($payload, ['parent_id' => $child]))->assertSessionHasErrors('parent_id');
        $this->post(route('kinerja.responsible'), array_replace($payload, ['id' => $child]))->assertSessionHasErrors('pic_id');
        $this->admin = false;
        $this->post(route('kinerja.responsible'), $payload)->assertForbidden();
    }

    public function test_pic_rename_syncs_open_jabatan_and_keeps_risk_snapshot(): void
    {
        $risk = $this->createRisk();
        $snapshot = $risk->indikator_snapshot;
        $this->admin = true;
        $this->put(route('pics.update', $this->leader), ['name' => 'Wadir nama baru '.uniqid(), 'location_id' => $this->leader->location_id])->assertSessionHasNoErrors();
        $name = $this->leader->fresh()->name;
        $this->assertDatabaseHas('kinerja_penanggung_jawabs', ['id' => $this->position, 'name' => $name]);
        $this->assertDatabaseHas('indikator_fitur4s', ['id' => $this->indicator->id, 'jabatan' => $name]);
        $this->assertEquals($snapshot, $risk->fresh()->indikator_snapshot);
        $this->delete(route('pics.destroy', $this->leader))->assertSessionHas('type', 'error');
        $this->assertDatabaseHas('pics', ['id' => $this->leader->id]);
    }

    public function test_import_is_explicit_idempotent_and_preserves_existing_records(): void
    {
        $before = DB::table('risk_registers')->orderBy('id')->get()->toJson();
        $this->artisan('kinerja:link-pics', ['--pic' => [$this->other->id]])->assertSuccessful();
        $this->assertDatabaseMissing('kinerja_penanggung_jawabs', ['pic_id' => $this->other->id]);
        $this->artisan('kinerja:link-pics', ['--pic' => [$this->other->id], '--apply' => true])->assertSuccessful();
        $this->artisan('kinerja:link-pics', ['--pic' => [$this->other->id], '--apply' => true])->assertSuccessful();
        $this->assertEquals(1, DB::table('kinerja_penanggung_jawabs')->where('pic_id', $this->other->id)->count());
        $this->assertDatabaseMissing('kinerja_penanggung_jawabs', ['pic_id' => $this->unit->id]);
        $this->assertSame($before, DB::table('risk_registers')->orderBy('id')->get()->toJson());
    }

    public function test_legacy_pic_formats_and_global_indicator_validation(): void
    {
        foreach (['1,2', '[1,2]', json_encode(json_encode('1,2')), [1, '2']] as $value) {
            $this->assertSame([1, 2], AnnualIndicatorService::ids($value));
        }
        $this->assertSame([], AnnualIndicatorService::ids('1,invalid'));
        DB::table('indikator_fitur4s')->where('id', $this->indicator->id)->update(['location_id' => '[0]']);
        $service = app(AnnualIndicatorService::class);
        $this->assertTrue($service->acceptsPics($this->indicator, [$this->other->id]));
        $this->assertFalse($service->acceptsPics($this->indicator, [999999999]));
        $this->assertFalse($service->acceptsPics($this->indicator, []));
    }

    public function test_copy_owner_only_indicator_uses_current_scope_without_rewriting_source(): void
    {
        $target = \App\Models\PeriodeKinerja::create(['tahun' => 2093, 'status' => 'draft']);
        app(AnnualIndicatorService::class)->copyHierarchy($this->indicator->periode_kinerja_id, $target);
        $copy = DB::table('indikator_fitur4s')->where('periode_kinerja_id', $target->id)->where('copied_from_id', $this->indicator->id)->first();
        $this->assertSame('[]', $copy->location_id);
        $this->assertEquals($this->position, $copy->penanggung_jawab_id);
        $this->assertSame($this->indicator->location_id, DB::table('indikator_fitur4s')->where('id', $this->indicator->id)->value('location_id'));
    }

    public function test_linked_pic_name_changes_do_not_rewrite_closed_indicator(): void
    {
        $this->admin = true;
        DB::table('indikator_fitur4s')->where('id', $this->indicator->id)->update(['jabatan' => 'Nama saat penutupan']);
        DB::table('periode_kinerjas')->where('id', $this->indicator->periode_kinerja_id)->update(['status' => 'ditutup']);
        $this->put(route('pics.update', $this->leader), ['name' => 'Nama jabatan terbaru '.uniqid(), 'location_id' => $this->leader->location_id])->assertSessionHasNoErrors();
        $this->assertDatabaseHas('indikator_fitur4s', ['id' => $this->indicator->id, 'jabatan' => 'Nama saat penutupan']);
    }

    private function payload(): array
    {
        $payload = $this->template->only(RiskRegister::FORM_FIELDS);
        unset($payload['indikator_fitur04_id']);
        $payload = array_merge($payload, [
            'risk_category_id' => 5, 'tgl_register' => substr($this->template->tgl_register, 0, 10),
            'currently_id' => 2, 'pic_id' => (string) $this->leader->id,
            'target_waktu' => '90', 'num' => '1', 'denum' => '100',
            'sebab' => 'Uji penyebab', 'resiko' => 'Uji risiko', 'dampak' => 'Uji dampak',
            'pernyataan_risiko' => 'Uji input Wadir', 'pengendalian_risiko' => 'Uji pengendalian',
            'pengendalian_harus_ada' => 'Uji wajib', 'penanganan_risiko' => 'Uji penanganan',
            'rencana_pengendalian' => 'Uji rencana', 'pihak_terkena' => 'Unit uji',
        ]);
        foreach (['identification_source_id', 'risk_variety_id', 'risk_type_id', 'jenis_sebab_id', 'efektif_id',
            'opsi_pengendalian_id', 'pembiayaan_risiko_id', 'jenis_pengendalian_id', 'waktu_pengendalian_id'] as $field) {
            $payload[$field] = $payload[$field] ?: 1;
        }
        foreach (array_keys($payload) as $field) {
            if (str_starts_with($field, 'osd') || str_starts_with($field, 'concatdp')) {
                unset($payload[$field]);
            }
        }
        return $payload;
    }
}
