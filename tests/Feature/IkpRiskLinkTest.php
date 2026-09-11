<?php

namespace Tests\Feature;

use App\Models\IKP\IkpPasien;
use App\Models\Pic;
use App\Models\RiskRegister;
use App\Models\RiskRegisterHistory;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Gate;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class IkpRiskLinkTest extends TestCase
{
    use DatabaseTransactions;

    private bool $admin = false;
    private RiskRegister $risk;
    private array $payload;

    protected function setUp(): void
    {
        parent::setUp();
        $template = IkpPasien::first();
        $risk = RiskRegister::where('tipe_id', 1)->first();
        $unit = Pic::first();
        if (!$template || !$risk || !$unit) {
            $this->markTestSkipped('Requires the existing IKP and risk master data; all writes are rolled back.');
        }

        $this->risk = $risk;
        $this->risk->update(['pic_id' => (string) $unit->id, 'currently_id' => 2]);
        $this->actingAs(User::factory()->create(['pic_id' => $unit->id, 'username' => 'ikp-test-'.uniqid()]));
        Gate::before(fn () => $this->admin);
        $this->payload = $template->only([
            'ikp_penanggung_id', 'jeniskelamin', 'ikp_jenis_insiden_id', 'ikp_tipe_insiden_id',
            'ikp_spesialisasi_id', 'ikp_dampak_id', 'ikp_probabilitas_id', 'ikp_pelapor_id',
            'ikp_gruplayanan_id', 'ikp_lokasi_id', 'ikp_penindak_id',
        ]) + [
            'namapasien' => 'Uji Penyimpanan IKP', 'nrm' => 'TESTIKP',
            'umur_tahun' => 30, 'umur_bulan' => 0, 'umur_hari' => 0,
            'tanggal_pelayanan' => '2026-09-08 08:00:00',
            'tanggal_insiden' => '2026-09-08 09:00:00',
            'insiden' => 'Uji tautan risiko', 'lokasi_name' => 'Lokasi uji',
            'pic_id' => (string) $unit->id, 'tindak_lanjut_hasil' => 'Tindak lanjut uji',
            'terjadi_tempatlain' => 0, 'langkah_tempatlain' => null,
            'kronologis' => [['waktu' => '2026-09-08 09:00:00', 'kronologi' => 'Kronologi uji']],
            'risiko_teridentifikasi' => true, 'risk_register_id' => $risk->id,
        ];
    }

    public function test_save_and_update_linked_risk_and_unidentified_incident(): void
    {
        $historyCount = RiskRegisterHistory::where('risk_register_id', $this->risk->id)->count();
        $this->post(route('IkpPasien.store'), $this->payload)->assertSessionHasNoErrors()->assertRedirect();
        $incident = IkpPasien::latest('id')->firstOrFail();
        $this->assertTrue($incident->risiko_teridentifikasi);
        $this->assertEquals($this->risk->id, $incident->risk_register_id);
        $this->assertEquals(1, $this->risk->refresh()->currently_id);
        $this->assertSame($historyCount + 1, RiskRegisterHistory::where('risk_register_id', $this->risk->id)->count());

        $this->put(route('IkpPasien.update', $incident), $this->payload)->assertSessionHasNoErrors();
        $this->assertSame($historyCount + 1, RiskRegisterHistory::where('risk_register_id', $this->risk->id)->count());

        $this->payload['risiko_teridentifikasi'] = false;
        $this->payload['risk_register_id'] = null;
        $this->put(route('IkpPasien.update', $incident), $this->payload)->assertSessionHasNoErrors();
        $this->assertFalse($incident->refresh()->risiko_teridentifikasi);
        $this->assertNull($incident->risk_register_id);
        $this->post(route('IkpPasien.store'), $this->payload)->assertSessionHasNoErrors();
        $unidentified = IkpPasien::latest('id')->firstOrFail();
        $this->assertFalse($unidentified->risiko_teridentifikasi);
        $this->assertNull($unidentified->risk_register_id);
    }

    public function test_other_unit_is_rejected_for_user_but_accepted_for_admin(): void
    {
        $otherUnit = Pic::where('id', '<>', auth()->user()->pic_id)->firstOrFail();
        $this->risk->update(['pic_id' => (string) $otherUnit->id]);
        $count = IkpPasien::count();
        $this->post(route('IkpPasien.store'), $this->payload)->assertSessionHasErrors('risk_register_id');
        $this->assertSame($count, IkpPasien::count());
        $this->assertEquals(2, $this->risk->refresh()->currently_id);

        $this->admin = true;
        $this->post(route('IkpPasien.store'), $this->payload)->assertSessionHasNoErrors()->assertRedirect();
        $this->assertEquals(1, $this->risk->refresh()->currently_id);
    }

    public function test_list_is_scoped_by_login_unit_and_admin_can_see_all(): void
    {
        $unitId = (int) auth()->user()->pic_id;
        $this->get(route('IkpPasien.index'))->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('IKP/Pasien/Index')
            ->where('canViewAllRisks', false)
            ->where('riskUnit.id', $unitId)
            ->where('riskRegisters', fn ($risks) => collect($risks)->contains('id', $this->risk->id)
                && collect($risks)->every(fn ($risk) => in_array($unitId, $risk['pic_ids'], true)
                    || in_array(0, $risk['pic_ids'], true)))
        );

        $this->admin = true;
        $this->get(route('IkpPasien.index'))->assertOk()->assertInertia(fn (Assert $page) => $page
            ->where('canViewAllRisks', true)
            ->has('riskRegisters', RiskRegister::where('tipe_id', 1)->count())
        );
    }
}
