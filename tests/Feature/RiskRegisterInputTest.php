<?php

namespace Tests\Feature;

use App\Models\Pic;
use App\Models\PeriodeKinerja;
use App\Models\RiskRegister;
use App\Models\RiskRegisterHistory;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class RiskRegisterInputTest extends TestCase
{
    use DatabaseTransactions;

    /** @dataProvider registerTypes */
    public function test_input_and_update_preserve_control_plan_fields(string $route, int $type): void
    {
        $payload = $this->validPayload();
        $payload['belum_tertangani'] = 'Sisa kendala uji';
        $payload['usulan_perbaikan'] = 'Usulan uji';
        $payload['location_id'] = DB::table('locations')->value('id');
        $this->post(route($route.'.store'), $payload)->assertRedirect()->assertSessionHasNoErrors();
        $risk = RiskRegister::latest('id')->firstOrFail();
        $this->assertEquals($type, $risk->tipe_id);
        $this->assertEquals(PeriodeKinerja::where('tahun', 2094)->value('id'), $risk->periode_kinerja_id);
        // The submitted yearly placement is stored as its permanent master.
        $this->assertEquals(DB::table('indikator_fitur4s')->where('id', $payload['indikator_fitur4_id'])->value('master_id'), $risk->indikator_fitur4_id);
        $this->assertNull(DB::table('indikator_fitur4s')->where('id', $risk->indikator_fitur4_id)->value('periode_kinerja_id'));
        $this->assertNotEmpty($risk->kode_risiko);
        $this->assertSame('C', $risk->c_uc);
        $this->assertSame('Celah uji', $risk->celah_pengendalian);
        $this->assertSame('Rapat unit', $risk->media_pengkomunikasian);
        $this->assertSame('Kepala unit', $risk->penyedia_informasi);
        $this->assertSame('Tim unit', $risk->penerima_informasi);
        // The form submits both control-evaluation fields; they used to be dropped on save.
        $this->assertSame('Sisa kendala uji', $risk->belum_tertangani);
        $this->assertSame('Usulan uji', $risk->usulan_perbaikan);
        $this->assertEquals($payload['location_id'], $risk->location_id);
        $this->assertSame(RiskRegisterHistory::EVENT_CREATED, $risk->risk_register_histories()->firstOrFail()->event_type);

        $payload['tgl_register'] = '2094-06-15 10:00:00'; // Existing records include a time component.
        $payload['media_pengkomunikasian'] = 'Laporan bulanan';
        $this->put(route($route.'.update', $risk), $payload)->assertRedirect()->assertSessionHasNoErrors();
        $this->assertSame('Laporan bulanan', $risk->refresh()->media_pengkomunikasian);
    }

    private function validPayload(): array
    {
        \App\Models\CelahPengendalian::firstOrCreate(['name' => 'Celah uji'], ['is_active' => true]);
        $template = RiskRegister::firstOrFail();
        $pic = Pic::firstOrFail();
        Notification::fake();
        $period = PeriodeKinerja::create(['tahun' => 2094, 'status' => 'aktif']);
        $indicator = (array) DB::table('indikator_fitur4s')->find($template->indikator_fitur4_id);
        unset($indicator['id']);
        $indicator['periode_kinerja_id'] = $period->id;
        $indicator['location_id'] = '[0]';
        $indicator['is_active'] = true;
        $indicatorId = DB::table('indikator_fitur4s')->insertGetId($indicator);
        $this->actingAs(User::factory()->create(['pic_id' => $pic->id, 'username' => 'risk-input-'.uniqid()]));
        Gate::before(fn () => true);

        $payload = $template->only(RiskRegister::FORM_FIELDS);
        unset($payload['indikator_fitur04_id']);
        $payload = array_merge($payload, [
            'risk_category_id' => 5,
            'tahun' => 2094,
            'tgl_register' => '2094-06-15',
            'indikator_fitur4_id' => $indicatorId,
            'currently_id' => 2,
            'pic_id' => (string) $pic->id,
            'target_waktu' => '90',
            'num' => '1',
            'denum' => '100',
            'sebab' => 'Penyebab uji',
            'resiko' => 'Risiko uji',
            'dampak' => 'Dampak uji',
            'pernyataan_risiko' => 'Pernyataan risiko uji input',
            'pengendalian_risiko' => 'Pengendalian uji',
            'pengendalian_harus_ada' => 'Pengendalian wajib',
            'penanganan_risiko' => 'Penanganan uji',
            'rencana_pengendalian' => 'Rencana uji',
            'pihak_terkena' => 'Unit uji',
            'c_uc' => 'C',
            'celah_pengendalian' => 'Celah uji',
            'media_pengkomunikasian' => 'Rapat unit',
            'penyedia_informasi' => 'Kepala unit',
            'penerima_informasi' => 'Tim unit',
        ]);
        foreach (['identification_source_id', 'risk_variety_id', 'risk_type_id', 'jenis_sebab_id', 'efektif_id', 'opsi_pengendalian_id', 'pembiayaan_risiko_id', 'jenis_pengendalian_id', 'waktu_pengendalian_id'] as $field) {
            $payload[$field] = $payload[$field] ?: 1;
        }
        foreach (array_keys($payload) as $field) {
            if (str_starts_with($field, 'osd') || str_starts_with($field, 'concatdp')) {
                unset($payload[$field]);
            }
        }
        foreach (['osd1_dampak', 'osd1_probabilitas', 'osd2_dampak', 'osd2_probabilitas', 'osd2_controllability'] as $field) {
            $payload[$field] = '';
        }
        return $payload;
    }

    /** @dataProvider invalidInputs */
    public function test_invalid_annual_input_is_rejected_without_saving(string $route, string $case, string $field): void
    {
        $payload = $this->validPayload();
        if ($case === 'missing_year') $payload['tahun'] = '';
        if ($case === 'mismatched_year') $payload['tgl_register'] = '2093-06-15';
        if ($case === 'invalid_date') $payload['tgl_register'] = 'not-a-date';
        if ($case === 'impossible_date') $payload['tgl_register'] = '2094-02-30';
        if ($case === 'missing_indicator') $payload['indikator_fitur4_id'] = '';
        if ($case === 'other_year_indicator') {
            $payload['indikator_fitur4_id'] = RiskRegister::firstOrFail()->indikator_fitur4_id;
        }
        if ($case === 'closed_year') PeriodeKinerja::where('tahun', 2094)->update(['status' => 'ditutup']);
        if ($case === 'inactive_indicator') DB::table('indikator_fitur4s')->where('id', $payload['indikator_fitur4_id'])->update(['is_active' => false]);
        $count = RiskRegister::count();
        $this->post(route($route.'.store'), $payload)->assertRedirect()->assertSessionHasErrors($field);
        $this->assertSame($count, RiskRegister::count());
    }

    public function invalidInputs(): array
    {
        $cases = ['missing_year' => 'tahun', 'mismatched_year' => 'tgl_register', 'invalid_date' => 'tgl_register',
            'impossible_date' => 'tgl_register', 'missing_indicator' => 'indikator_fitur4_id',
            'other_year_indicator' => 'indikator_fitur4_id', 'closed_year' => 'periode_kinerja_id', 'inactive_indicator' => 'indikator_fitur4_id'];
        $result = [];
        foreach (['riskRegisterKlinis', 'riskRegisterNonKlinis'] as $route) {
            foreach ($cases as $case => $field) $result[$route.' '.$case] = [$route, $case, $field];
        }
        return $result;
    }

    public function registerTypes(): array
    {
        return [['riskRegisterKlinis', 1], ['riskRegisterNonKlinis', 2]];
    }
}
