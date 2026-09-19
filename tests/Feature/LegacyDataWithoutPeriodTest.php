<?php

namespace Tests\Feature;

use App\Models\MUTU\MutuIndikator;
use App\Models\MUTU\MutuUnit;
use App\Models\PeriodeKinerja;
use App\Models\Pic;
use App\Models\RiskRegister;
use App\Models\User;
use App\Services\Fitur4Master;
use App\Services\RiskIndicatorAccess;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

/** Registers and MUTU data recorded before annual periods stay usable (TASK_10/TASK_11). */
class LegacyDataWithoutPeriodTest extends TestCase
{
    use DatabaseTransactions;

    private Pic $pic;

    private int $master;

    private RiskRegister $template;

    protected function setUp(): void
    {
        parent::setUp();
        $location = DB::table('locations')->insertGetId(['name' => 'Unit legacy '.uniqid(), 'created_at' => now(), 'updated_at' => now()]);
        $this->pic = Pic::create(['name' => 'PIC legacy '.uniqid(), 'location_id' => $location]);
        $this->actingAs(User::factory()->create(['pic_id' => $this->pic->id]));
        Gate::before(fn () => true);
        $this->template = RiskRegister::firstOrFail();
        // A permanent master owned by the unit, like the indicators recorded before annual periods.
        $legacy = (array) DB::table('indikator_fitur4s')->find($this->template->indikator_fitur4_id);
        unset($legacy['id']);
        $this->master = DB::table('indikator_fitur4s')->insertGetId(array_merge($legacy, [
            'name' => 'Indikator unit legacy', 'location_id' => json_encode([$location]), 'periode_kinerja_id' => null,
            'master_id' => null, 'lineage_id' => null, 'copied_from_id' => null, 'is_active' => true,
        ]));
    }

    private function period(int $year, string $status, bool $linked = true): PeriodeKinerja
    {
        $period = PeriodeKinerja::create(['tahun' => $year, 'status' => $status]);
        if ($linked) {
            $master = DB::table('indikator_fitur4s')->find($this->master);
            DB::table('indikator_fitur4s')->insert(array_intersect_key((array) $master, array_flip(Fitur4Master::SHARED)) + [
                'periode_kinerja_id' => $period->id, 'master_id' => $this->master, 'indikator_fitur3_id' => null,
                'sasaran_strategis_id' => null, 'is_active' => true, 'created_at' => now(), 'updated_at' => now(),
            ]);
        }

        return $period;
    }

    private function legacyRisk(string $date): RiskRegister
    {
        // Written without events, exactly like data that predates the annual observer.
        $risk = $this->template->replicate(['copy_key', 'copied_from_risk_register_id', 'kode_risiko']);
        $risk->forceFill(['tgl_register' => $date, 'indikator_fitur4_id' => $this->master, 'periode_kinerja_id' => null,
            'indikator_snapshot' => null, 'user_id' => auth()->id(), 'pic_id' => json_encode([$this->pic->id])]);
        RiskRegister::withoutEvents(fn () => $risk->save());

        return $risk;
    }

    private function dictionary(): MutuIndikator
    {
        return MutuIndikator::withoutEvents(fn () => MutuIndikator::create([
            'indikator_fitur4_id' => $this->master, 'mutu_kategori_id' => DB::table('mutu_kategoris')->value('id'),
            'location_id' => $this->pic->location_id, 'num_name' => 'Pembilang legacy', 'denum_name' => 'Penyebut legacy',
            'standar' => 90, 'operator' => '≥', 'penyebut' => '%', 'approved' => 1,
        ]));
    }

    public function test_legacy_registers_stay_editable_in_years_without_period_and_closed_periods(): void
    {
        $this->period(2096, 'ditutup');
        foreach (['2095-03-01', '2096-03-01'] as $date) {
            $risk = $this->legacyRisk($date);
            $risk->pernyataan_risiko = 'Perbaikan uraian '.$date;
            $risk->save();
            $this->assertSame('Perbaikan uraian '.$date, $risk->fresh()->pernyataan_risiko);
            $this->assertEquals($this->master, $risk->fresh()->indikator_fitur4_id);
            $status = (int) $risk->currently_id === 1 ? 2 : 1;
            $this->put(route('riskregister.requestupdatestatus'), ['id' => $risk->id, 'tgl_perbaikan' => '2026-09-20', 'jam_perbaikan' => '08:00', 'upaya_pengendalian' => 'Upaya uji'])
                ->assertRedirect()->assertSessionHasNoErrors();
            $this->put(route('riskregister.updatestatus'), ['id' => $risk->id, 'currently_id' => $status])->assertRedirect()->assertSessionHasNoErrors();
            $this->assertEquals($status, $risk->fresh()->currently_id);
            $this->assertDatabaseHas('request_updates', ['risk_register_id' => $risk->id, 'is_approved' => $status - 1]);
        }
    }

    public function test_new_registers_need_an_active_placement_in_an_active_year(): void
    {
        $risk = $this->template->replicate(['copy_key', 'copied_from_risk_register_id', 'kode_risiko']);
        $risk->forceFill(['tgl_register' => '2095-03-01', 'indikator_fitur4_id' => $this->master, 'indikator_snapshot' => null,
            'user_id' => auth()->id(), 'pic_id' => json_encode([$this->pic->id])]);
        try {
            $risk->replicate()->save();
            $this->fail('A year without a period must reject new registers.');
        } catch (ValidationException $e) {
            $this->assertArrayHasKey('tgl_register', $e->errors());
        }
        $period = $this->period(2095, 'aktif');
        $saved = $risk->replicate();
        $saved->save();
        $this->assertEquals($period->id, $saved->periode_kinerja_id);
        $this->assertEquals($this->master, $saved->indikator_fitur4_id);
        $this->assertNull($saved->indikator_snapshot['indikator_fitur4s']['indikator_fitur3_id']);
        DB::table('indikator_fitur4s')->where('periode_kinerja_id', $period->id)->update(['is_active' => false]);
        $this->expectException(ValidationException::class);
        $risk->replicate()->save();
    }

    public function test_unit_pic_sees_its_unplaced_master_as_an_option_for_the_year(): void
    {
        Gate::before(fn ($user, $ability) => $ability !== 'lihat data semua risk register');
        $period = $this->period(2095, 'aktif');
        $options = app(RiskIndicatorAccess::class)->optionsForUser(auth()->user());
        $option = $options->first(fn ($row) => $row['id'] === $this->master && (int) $row['periode_kinerja_id'] === $period->id);
        $this->assertNotNull($option);
        $this->assertTrue($option['can_select']);
        $this->assertTrue(app(RiskIndicatorAccess::class)->allowsUser(auth()->user(), $this->master, $period->id));
    }

    public function test_legacy_mutu_dictionary_measurements_and_pdsa_stay_usable(): void
    {
        $this->period(2095, 'aktif');
        $dictionary = $this->dictionary();
        $this->assertNull($dictionary->periode_kinerja_id);
        $unit = MutuUnit::withoutEvents(fn () => MutuUnit::create(['mutu_indikator_id' => $dictionary->id, 'code' => Str::random(8),
            'tanggal_mutu' => '2094-05-01', 'num' => 9, 'denum' => 10, 'capaian' => 90]));
        // Editing a measurement from a year without a period is allowed.
        $unit->num = 10;
        $unit->capaian = 100;
        $unit->save();
        $this->assertEquals(100, $unit->fresh()->capaian);
        $this->assertNotNull($unit->fresh()->mutu_indikator);
        $new = MutuUnit::create(['mutu_indikator_id' => $dictionary->id, 'code' => Str::random(8), 'tanggal_mutu' => '2095-05-01', 'num' => 8, 'denum' => 10, 'capaian' => 80]);
        $this->assertNotNull($new->id);
        $this->put(route('MutuUnit.formulirpdsa'), ['id' => $unit->id, 'problem' => 'Masalah', 'step' => '1', 'plan_rencana' => 'Rencana',
            'plan_harapan' => 'Harapan', 'do' => 'Lakukan', 'study' => 'Pelajari', 'action' => 'Tindak'])->assertSessionHasNoErrors();
        $this->assertDatabaseHas('mutu_pdsas', ['mutu_unit_id' => $unit->id, 'problem' => 'Masalah']);
        $this->get(route('MutuUnit.index', ['tahun' => 2094]))->assertOk()->assertInertia(fn (Assert $page) => $page
            ->where('MutuUnit.data', fn ($rows) => collect($rows)->contains('id', $unit->id)));
        $this->get(route('MutuIndikator.index', ['tahun' => 2095]))->assertOk()->assertInertia(fn (Assert $page) => $page
            ->where('MutuIndikator.data', fn ($rows) => collect($rows)->contains('id', $dictionary->id)));
    }

    public function test_link_command_is_dry_run_by_default_and_links_unplaced_masters(): void
    {
        $period = $this->period(2095, 'aktif', false);
        $this->artisan('indikator:link-masters', ['tahun' => 2095])->assertSuccessful();
        $this->assertNull(Fitur4Master::placement($this->master, $period->id));
        $this->artisan('indikator:link-masters', ['tahun' => 2095, '--apply' => true])->assertSuccessful();
        $placement = Fitur4Master::placement($this->master, $period->id);
        $this->assertNotNull($placement);
        $this->assertNull($placement->indikator_fitur3_id);
        $this->assertTrue((bool) $placement->is_active);
        $this->artisan('indikator:link-masters', ['tahun' => 2095, '--apply' => true])->assertSuccessful();
        $this->assertSame(1, DB::table('indikator_fitur4s')->where('periode_kinerja_id', $period->id)->where('master_id', $this->master)->count());
        // Rerunning with deactivation must not switch off the unit indicators already linked.
        $this->artisan('indikator:link-masters', ['tahun' => 2095, '--deactivate-existing' => true, '--apply' => true])->assertFailed();
        $this->assertTrue((bool) Fitur4Master::placement($this->master, $period->id)->is_active);
        $this->assertTrue((bool) DB::table('indikator_fitur4s')->where('id', $this->master)->value('is_active'));
        $period->update(['status' => 'ditutup']);
        $this->artisan('indikator:link-masters', ['tahun' => 2095, '--apply' => true])->assertFailed();
    }
}
