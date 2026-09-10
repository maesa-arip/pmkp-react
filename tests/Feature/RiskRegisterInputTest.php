<?php

namespace Tests\Feature;

use App\Models\Pic;
use App\Models\RiskRegister;
use App\Models\RiskRegisterHistory;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Gate;
use Tests\TestCase;

class RiskRegisterInputTest extends TestCase
{
    use DatabaseTransactions;

    /** @dataProvider registerTypes */
    public function test_input_and_update_preserve_control_plan_fields(string $route, int $type): void
    {
        $this->withoutExceptionHandling();
        $template = RiskRegister::firstOrFail();
        $pic = Pic::firstOrFail();
        $this->actingAs(User::factory()->create(['pic_id' => $pic->id, 'username' => 'risk-input-'.uniqid()]));
        Gate::before(fn () => true);

        $payload = $template->only(RiskRegister::FORM_FIELDS);
        unset($payload['indikator_fitur04_id']);
        $payload = array_merge($payload, [
            'risk_category_id' => 5,
            'tgl_register' => substr($template->tgl_register, 0, 10),
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
        $this->post(route($route.'.store'), $payload)->assertRedirect()->assertSessionHasNoErrors();
        $risk = RiskRegister::latest('id')->firstOrFail();
        $this->assertEquals($type, $risk->tipe_id);
        $this->assertNotEmpty($risk->kode_risiko);
        $this->assertSame('C', $risk->c_uc);
        $this->assertSame('Celah uji', $risk->celah_pengendalian);
        $this->assertSame('Rapat unit', $risk->media_pengkomunikasian);
        $this->assertSame('Kepala unit', $risk->penyedia_informasi);
        $this->assertSame('Tim unit', $risk->penerima_informasi);
        $this->assertSame(RiskRegisterHistory::EVENT_CREATED, $risk->risk_register_histories()->firstOrFail()->event_type);

        $payload['media_pengkomunikasian'] = 'Laporan bulanan';
        $this->put(route($route.'.update', $risk), $payload)->assertRedirect()->assertSessionHasNoErrors();
        $this->assertSame('Laporan bulanan', $risk->refresh()->media_pengkomunikasian);
    }

    public function registerTypes(): array
    {
        return [['riskRegisterKlinis', 1], ['riskRegisterNonKlinis', 2]];
    }
}
