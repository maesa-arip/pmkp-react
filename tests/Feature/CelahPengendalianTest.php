<?php

namespace Tests\Feature;

use App\Models\CelahPengendalian;
use App\Models\PeriodeKinerja;
use App\Models\Pic;
use App\Models\RiskRegister;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class CelahPengendalianTest extends TestCase
{
    use DatabaseTransactions;

    protected function setUp(): void
    {
        parent::setUp();
        Notification::fake();
        $user = User::factory()->create(['pic_id' => Pic::firstOrFail()->id]);
        $user->assignRole(Role::findOrCreate('super admin', 'web'));
        $this->actingAs($user);
    }

    public function test_master_can_be_created_listed_edited_and_deleted(): void
    {
        $payload = ['name' => 'QA celah '.uniqid(), 'description' => 'SOP perlu diperbarui', 'is_active' => true];
        $this->post(route('celahPengendalians.store'), $payload)->assertSessionHasNoErrors()->assertSessionHas('type', 'success');
        $item = CelahPengendalian::where('name', $payload['name'])->firstOrFail();
        $this->get(route('celahPengendalians.index', ['q' => $payload['name'], 'field' => 'name', 'direction' => 'asc']))
            ->assertOk()->assertViewHas('page', fn ($page) => $page['component'] === 'Master/CelahPengendalian/Index' && count($page['props']['celahPengendalians']['data']) === 1);
        $payload['description'] = 'Keterangan diubah'; $payload['is_active'] = false;
        $this->put(route('celahPengendalians.update', $item), $payload)->assertSessionHasNoErrors()->assertSessionHas('type', 'success');
        $this->assertFalse($item->refresh()->is_active);
        $this->assertSame('Keterangan diubah', $item->description);
        $this->delete(route('celahPengendalians.destroy', $item))->assertSessionHas('type', 'success');
        $this->assertDatabaseMissing('celah_pengendalians', ['id' => $item->id]);
    }

    public function test_blank_duplicate_and_invalid_sort_are_rejected(): void
    {
        $item = CelahPengendalian::create(['name' => 'QA duplicate '.uniqid(), 'is_active' => true]);
        $this->post(route('celahPengendalians.store'), ['name' => '   ', 'is_active' => true])->assertSessionHasErrors('name');
        $this->post(route('celahPengendalians.store'), ['name' => $item->name, 'is_active' => true])->assertSessionHasErrors('name');
        $this->getJson(route('celahPengendalians.index', ['field' => 'invalid_column']))->assertUnprocessable()->assertJsonValidationErrors('field');
    }

    public function test_account_without_master_permission_is_denied(): void
    {
        $item = CelahPengendalian::create(['name' => 'QA protected '.uniqid(), 'is_active' => true]);
        $this->actingAs(User::factory()->create());
        $payload = ['name' => 'Unauthorized change', 'is_active' => true];
        $this->get(route('celahPengendalians.index'))->assertForbidden();
        $this->post(route('celahPengendalians.store'), $payload)->assertForbidden();
        $this->put(route('celahPengendalians.update', $item), $payload)->assertForbidden();
        $this->delete(route('celahPengendalians.destroy', $item))->assertForbidden();
        $this->assertNotSame('Unauthorized change', $item->refresh()->name);
    }

    /** @dataProvider types */
    public function test_risk_form_uses_active_master_and_preserves_retired_value(string $type): void
    {
        $active = CelahPengendalian::create(['name' => 'QA active '.uniqid(), 'is_active' => true]);
        $other = CelahPengendalian::create(['name' => 'QA other '.uniqid(), 'is_active' => true]);
        $inactive = CelahPengendalian::create(['name' => 'QA inactive '.uniqid(), 'is_active' => false]);
        $page = $this->get(route('riskRegister'.$type.'.index'))->assertOk()->viewData('page');
        $options = collect($page['props']['celahPengendalians'])->pluck('name')->all();
        $this->assertContains($active->name, $options); $this->assertNotContains($inactive->name, $options);
        $payload = $this->riskPayload(); $payload['celah_pengendalian'] = $active->name;
        $this->post(route('riskRegister'.$type.'.store'), $payload)->assertSessionHasNoErrors()->assertSessionHas('type', 'success');
        $risk = RiskRegister::latest('id')->firstOrFail();
        $this->assertSame($active->name, $risk->celah_pengendalian);
        $this->delete(route('celahPengendalians.destroy', $active))->assertSessionHas('type', 'error');
        $this->assertDatabaseHas('celah_pengendalians', ['id' => $active->id]);
        $this->put(route('celahPengendalians.update', $active), ['name' => $active->name.' renamed', 'description' => '', 'is_active' => false])->assertSessionHasNoErrors();
        $this->assertSame($payload['celah_pengendalian'], $risk->refresh()->celah_pengendalian);
        $payload['resiko'] = 'Risiko diedit dengan nilai lama';
        $this->put(route('riskRegister'.$type.'.update', $risk), $payload)->assertSessionHasNoErrors()->assertSessionHas('type', 'success');
        $this->assertSame($payload['celah_pengendalian'], $risk->refresh()->celah_pengendalian);
        $payload['celah_pengendalian'] = $other->name;
        $this->put(route('riskRegister'.$type.'.update', $risk), $payload)->assertSessionHasNoErrors();
        $this->assertSame($other->name, $risk->refresh()->celah_pengendalian);
        foreach ([$inactive->name, 'Not a master value'] as $invalid) {
            $payload['celah_pengendalian'] = $invalid;
            $this->post(route('riskRegister'.$type.'.store'), $payload)->assertSessionHasErrors('celah_pengendalian');
            $this->put(route('riskRegister'.$type.'.update', $risk), $payload)->assertSessionHasErrors('celah_pengendalian');
            $this->assertSame($other->name, $risk->refresh()->celah_pengendalian);
        }
    }

    public function types(): array { return [['Klinis'], ['NonKlinis']]; }

    private function riskPayload(): array
    {
        $template = RiskRegister::firstOrFail();
        $period = PeriodeKinerja::create(['tahun' => 2092, 'status' => 'aktif']);
        $indicator = (array) DB::table('indikator_fitur4s')->find($template->indikator_fitur4_id);
        unset($indicator['id']);
        $indicator['periode_kinerja_id'] = $period->id; $indicator['location_id'] = '[0]'; $indicator['is_active'] = true;
        $indicatorId = DB::table('indikator_fitur4s')->insertGetId($indicator);
        $payload = $template->only(RiskRegister::FORM_FIELDS);
        unset($payload['indikator_fitur04_id']);
        foreach (array_keys($payload) as $field) if (str_starts_with($field, 'osd') || str_starts_with($field, 'concatdp')) unset($payload[$field]);
        $payload = array_merge($payload, [
            'tahun' => 2092, 'tgl_register' => '2092-06-15', 'indikator_fitur4_id' => $indicatorId,
            'pic_id' => (string) auth()->user()->pic_id, 'risk_category_id' => 5, 'currently_id' => 2,
            'target_waktu' => '90', 'num' => '1', 'denum' => '100', 'c_uc' => 'C',
        ]);
        foreach (['sebab','resiko','dampak','pernyataan_risiko','pengendalian_risiko','pengendalian_harus_ada','penanganan_risiko','rencana_pengendalian','pihak_terkena'] as $field) $payload[$field] = 'QA '.$field;
        foreach (['identification_source_id','risk_variety_id','risk_type_id','jenis_sebab_id','efektif_id','opsi_pengendalian_id','pembiayaan_risiko_id','jenis_pengendalian_id','waktu_pengendalian_id'] as $field) $payload[$field] = $payload[$field] ?: 1;
        return $payload;
    }
}