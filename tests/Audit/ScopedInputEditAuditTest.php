<?php
namespace Tests\Audit;

use App\Models\RiskRegister;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

/** Opt-in audit: requires the isolated QA copy and browser-captured payloads. */
class ScopedInputEditAuditTest extends TestCase
{
    use DatabaseTransactions;

    protected function setUp(): void
    {
        parent::setUp();
        $this->assertStringStartsWith('simdalin_qa_input_', DB::connection()->getDatabaseName(), 'Run only against the isolated QA database.');
        Notification::fake();
        \App\Models\CelahPengendalian::firstOrCreate(['name' => 'Celah lama'], ['is_active' => true]);
        $this->actingAs(User::where('email', 'adminmr@rsbm.com')->firstOrFail());
    }

    public function modules(): array { return [['Klinis', 1], ['NonKlinis', 2]]; }

    private function payload(string $module, string $mode = 'create'): array
    {
        $rows = json_decode(file_get_contents(storage_path('app/input-edit-qa/browser-risk-payloads.json')), true);
        return collect($rows)->first(fn ($r) => $r['module'] === $module && $r['mode'] === $mode)['data'];
    }

    private function createRisk(string $module): RiskRegister
    {
        $this->post(route('riskRegister'.$module.'.store'), $this->payload($module))
            ->assertRedirect()->assertSessionHasNoErrors()->assertSessionHas('type', 'success');
        return RiskRegister::latest('id')->firstOrFail();
    }

    /** @dataProvider modules */
    public function test_actual_browser_payload_creates_and_updates_persisted_fields(string $module, int $type): void
    {
        $risk = $this->createRisk($module);
        $this->assertEquals($type, $risk->tipe_id);
        $this->assertNotEmpty($risk->kode_risiko);
        $this->assertNotEmpty($risk->indikator_snapshot);
        $this->assertStored($risk, $this->payload($module));
        $edit = $this->payload($module, 'edit');
        $this->put(route('riskRegister'.$module.'.update', $risk->id), $edit)
            ->assertRedirect()->assertSessionHasNoErrors()->assertSessionHas('type', 'success');
        $this->assertStored($risk->refresh(), $edit);
        $this->assertEquals(0, $risk->num);
        $this->assertEquals(365, $risk->target_waktu);
    }

    private function assertStored(RiskRegister $risk, array $payload): void
    {
        foreach (['sebab','resiko','dampak','pernyataan_risiko','target_waktu','num','denum','c_uc','pengendalian_risiko','pengendalian_harus_ada','celah_pengendalian','media_pengkomunikasian','penyedia_informasi','penerima_informasi','penanganan_risiko','rencana_pengendalian','pihak_terkena','indikator_fitur4_id','risk_category_id','identification_source_id','jenis_sebab_id','risk_variety_id','risk_type_id','efektif_id','opsi_pengendalian_id','pembiayaan_risiko_id','jenis_pengendalian_id','waktu_pengendalian_id'] as $field) {
            $this->assertEquals($payload[$field] ?: null, $risk->$field ?: null, $field.' must persist');
        }
        $this->assertSame(\App\Services\AnnualIndicatorService::ids($payload['pic_id']), \App\Services\AnnualIndicatorService::ids($risk->pic_id));
        $this->assertSame(substr($payload['tgl_register'], 0, 10), substr($risk->tgl_register, 0, 10));
    }

    /** @dataProvider modules */
    public function test_all_units_option_can_be_created_and_edited(string $module): void
    {
        $payload = $this->payload($module); $payload['pic_id'] = '0';
        $this->post(route('riskRegister'.$module.'.store'), $payload)->assertRedirect()->assertSessionHasNoErrors();
        $risk = RiskRegister::latest('id')->firstOrFail();
        $this->assertSame([0], \App\Services\AnnualIndicatorService::ids($risk->pic_id));
        $payload['pic_id'] = '0,1'; $payload['resiko'] = 'Updated all units';
        $this->put(route('riskRegister'.$module.'.update', $risk->id), $payload)->assertSessionHasNoErrors();
        $this->assertSame([0], \App\Services\AnnualIndicatorService::ids($risk->refresh()->pic_id));
        $this->assertSame('Updated all units', $risk->resiko);
    }
    /** @dataProvider modules */
    public function test_incident_edit_requires_chronology_just_like_create(string $module): void
    {
        $risk = $this->createRisk($module);
        $payload = $this->payload($module); $payload['risk_category_id'] = 6; $payload['kronologi'] = '';
        $this->post(route('riskRegister'.$module.'.store'), $payload)->assertSessionHasErrors('kronologi');
        session()->forget('errors');
        $this->put(route('riskRegister'.$module.'.update', $risk->id), $payload)->assertSessionHasErrors('kronologi');
    }

    /** @dataProvider modules */
    public function test_account_without_risk_permissions_cannot_update_someone_elses_record(string $module): void
    {
        $risk = $this->createRisk($module);
        $outsider = User::factory()->create(['username' => 'qa-unprivileged-'.uniqid(), 'pic_id' => null]);
        $this->assertCount(0, $outsider->getAllPermissions());
        $this->actingAs($outsider);
        $payload = $this->payload($module); $payload['resiko'] = 'Unauthorized edit audit';
        $response = $this->put(route('riskRegister'.$module.'.update', $risk->id), $payload);
        $response->assertForbidden();
        $this->assertNotSame('Unauthorized edit audit', $risk->refresh()->resiko, 'Account without roles/permissions updated another user record; HTTP '.$response->status());
    }

    /** @dataProvider modules */
    public function test_update_endpoint_rejects_record_of_other_type(string $module): void
    {
        $risk = $this->createRisk($module);
        $other = $module === 'Klinis' ? 'NonKlinis' : 'Klinis';
        $payload = $this->payload($module); $payload['resiko'] = 'Cross module edit audit';
        $this->put(route('riskRegister'.$other.'.update', $risk->id), $payload)->assertNotFound();
        $this->assertNotSame('Cross module edit audit', $risk->refresh()->resiko, 'Opposite module endpoint updated this record.');
    }

    public function subforms(): array
    {
        $cases=[];
        foreach (['Klinis','NonKlinis'] as $module) foreach (['FGDInherent','FGDResidual','FGDTreated','FGDActual','FormulirRCA','Osd2'] as $form) $cases[$module.' '.$form]=[$module,$form];
        return $cases;
    }

    private function subpayload(string $module, string $form, string $mode): array
    {
        $rows=json_decode(file_get_contents(storage_path('app/input-edit-qa/browser-risk-subform-payloads.json')),true);
        return collect($rows)->first(fn($r)=>$r['module']===$module && $r['form']===$form && $r['mode']===$mode)['data'];
    }

    /** @dataProvider subforms */
    public function test_subform_browser_payload_saves_then_updates(string $module, string $form): void
    {
        $risk=$this->createRisk($module);
        foreach (['create','edit'] as $mode) {
            $payload=$this->subpayload($module,$form,$mode); $payload['id']=$risk->id;
            $route=$form==='Osd2' ? 'riskRegisterKlinisOsd2.update' : 'riskregister.'.strtolower($form);
            $this->put(route($route,$risk->id),$payload)->assertRedirect()->assertSessionHasNoErrors()->assertSessionHas('type','success');
            $risk->refresh();
            if (str_starts_with($form,'FGD')) {
                $class='App\\Models\\Fgd'.substr($form,3);
                $saved=$class::where('risk_register_id',$risk->id)->firstOrFail();
                foreach (['dampak','probabilitas'] as $prefix) for($i=1;$i<=8;$i++) $this->assertEquals($payload[$prefix.'_responden'.$i],$saved->{$prefix.'_responden'.$i});
                $stage=['FGDInherent'=>1,'FGDResidual'=>2,'FGDTreated'=>3,'FGDActual'=>4][$form];
                $this->assertEquals($payload['osd'.$stage.'_dampak'],$risk->{'osd'.$stage.'_dampak'});
                $this->assertEquals($payload['osd'.$stage.'_probabilitas'],$risk->{'osd'.$stage.'_probabilitas'});
            } elseif ($form==='FormulirRCA') {
                $saved=\App\Models\FormulirRca::where('risk_register_id',$risk->id)->firstOrFail();
                foreach (['why1','why2','why3','why4','why5','akar_penyebab'] as $field) $this->assertSame($payload[$field],$saved->$field);
            } else {
                foreach (['osd2_dampak','osd2_probabilitas','osd2_pengendalian_dilakukan','osd2_pengendalian_efektif','belum_tertangani','usulan_perbaikan','kendala','output','dokumen_pendukung','waktu_implementasi_id','realisasi_id'] as $field) $this->assertEquals($payload[$field],$risk->$field,$field);
            }
        }
    }

    public function lateValidationForms(): array
    {
        $cases=[];foreach (['Klinis','NonKlinis'] as $module) foreach (['FGDResidual'=>2,'FGDTreated'=>3,'FGDActual'=>4] as $form=>$stage) $cases[$module.' '.$form]=[$module,$form,$stage];return $cases;
    }

    /** @dataProvider lateValidationForms */
    public function test_failed_fgd_validation_does_not_persist_partial_data(string $module,string $form,int $stage): void
    {
        $risk=$this->createRisk($module);
        $payload=$this->subpayload($module,$form,'create');$payload['id']=$risk->id;$payload['osd'.$stage.'_dampak']='';
        $class='App\\Models\\Fgd'.substr($form,3);
        $this->put(route('riskregister.'.strtolower($form)),$payload)->assertSessionHasErrors('osd'.$stage.'_dampak');
        $this->assertFalse($class::where('risk_register_id',$risk->id)->exists(),'Validation failed but respondent data was persisted.');
    }

    /** @dataProvider modules */
    public function test_closed_period_rejects_rca_changes(string $module): void
    {
        $risk=$this->createRisk($module);
        DB::table('periode_kinerjas')->where('id',$risk->periode_kinerja_id)->update(['status'=>'ditutup']);
        $payload=$this->subpayload($module,'FormulirRCA','create');$payload['id']=$risk->id;
        $this->put(route('riskregister.formulirrca'),$payload);
        $this->assertFalse(\App\Models\FormulirRca::where('risk_register_id',$risk->id)->exists(),'RCA was saved to a closed annual period.');
    }

    public function units(): array
    {
        $rows=[];foreach (['%','‰','Menit','Satuan'] as $unit) foreach ([0,1] as $new) $rows[$unit.' new='.$new]=[$unit,$new];return $rows;
    }

    /** @dataProvider units */
    public function test_actual_admin_creates_and_edits_mutu_with_all_units(string $unit,int $new): void
    {
        $user=auth()->user();
        $this->assertTrue($user->hasRole('super admin'));
        $period=\App\Models\PeriodeKinerja::where('status','aktif')->firstOrFail();
        $indicator=app(\App\Services\MutuIndicatorInput::class)->options($user)->first(fn($i)=>$i->periode_kinerja_id===$period->id && $i->is_active);
        $payload=['periode_kinerja_id'=>$period->id,'indikator_fitur3_id'=>$indicator->indikator_fitur3_id,'indikator_fitur4_id'=>$new?'':$indicator->id,'IndikatorBaru'=>$new,'indikator'=>'QA admin '.uniqid(),'mutu_kategori_id'=>DB::table('mutu_kategoris')->value('id'),'num_name'=>'QA admin numerator '.uniqid(),'denum_name'=>'QA denominator','standar'=>95.5,'operator'=>'≥','penyebut'=>$unit];
        $this->post(route('MutuIndikator.store'),$payload)->assertRedirect()->assertSessionHasNoErrors()->assertSessionHas('type','success');
        $saved=\App\Models\MUTU\MutuIndikator::where('num_name',$payload['num_name'])->firstOrFail();
        $this->assertEquals(95.5,$saved->standar);$this->assertSame($unit,$saved->penyebut);
        $payload['IndikatorBaru']=0;$payload['indikator_fitur4_id']=$saved->indikator_fitur4_id;$payload['standar']=0;$payload['operator']='=';$payload['denum_name']='QA denominator edited';
        $this->put(route('MutuIndikator.update',$saved),$payload)->assertRedirect()->assertSessionHasNoErrors()->assertSessionHas('type','success');
        $saved->refresh();$this->assertEquals(0,$saved->standar);$this->assertSame('=',$saved->operator);$this->assertSame($payload['denum_name'],$saved->denum_name);$this->assertSame($unit,$saved->penyebut);
    }

    /** @dataProvider modules */
    public function test_occurrence_input_records_a_history_entry(string $module): void
    {
        $risk=$this->createRisk($module);
        $before=$risk->risk_register_histories()->count();
        $payload=$risk->toArray();$payload['currently_id']=1;$payload['dampak_kejadian']='QA occurrence impact';
        $this->put(route('riskRegister'.$module.'.update',$risk->id),$payload)->assertRedirect()->assertSessionHasNoErrors()->assertSessionHas('type','success');
        $this->assertEquals(1,$risk->refresh()->currently_id);$this->assertSame($before+1,$risk->risk_register_histories()->count());
        $history=$risk->risk_register_histories()->latest('id')->firstOrFail();$this->assertSame('QA occurrence impact',$history->snapshot['dampak_kejadian']);
    }

    /** @dataProvider modules */
    public function test_edit_permissions_allow_owner_and_global_editor_but_reject_other_location_and_view_only(string $module): void
    {
        $risk = $this->createRisk($module);
        $payload = $this->payload($module);
        $pic = \App\Models\Pic::findOrFail((int) $payload['pic_id']);
        $owner = User::factory()->create(['username'=>'qa-owner-'.uniqid(), 'pic_id'=>$pic->id]);
        $owner->givePermissionTo('edit data risk register sesuai lokasi');
        DB::table('risk_registers')->where('id',$risk->id)->update(['user_id'=>$owner->id]);
        $this->actingAs($owner);
        $payload['resiko'] = 'Owner edit';
        $this->put(route('riskRegister'.$module.'.update',$risk->id),$payload)->assertSessionHasNoErrors()->assertSessionHas('type','success');
        $this->assertSame('Owner edit',$risk->refresh()->resiko);
        $colleague = User::factory()->create(['username'=>'qa-colleague-'.uniqid(), 'pic_id'=>$pic->id]);
        $colleague->givePermissionTo('edit data risk register sesuai lokasi');
        $this->actingAs($colleague);$payload['resiko']='Same location edit';
        $this->put(route('riskRegister'.$module.'.update',$risk->id),$payload)->assertSessionHasNoErrors()->assertSessionHas('type','success');
        $this->assertSame('Same location edit',$risk->refresh()->resiko);
        $otherPic = \App\Models\Pic::where('location_id','<>',$pic->location_id)->firstOrFail();
        $other = User::factory()->create(['username'=>'qa-other-'.uniqid(), 'pic_id'=>$otherPic->id]);
        $other->givePermissionTo('edit data risk register sesuai lokasi');
        $this->actingAs($other);
        $forged = $payload; $forged['pic_id']='0'; $forged['user_id']=$other->id; $forged['resiko']='Forged owner';
        $this->put(route('riskRegister'.$module.'.update',$risk->id),$forged)->assertForbidden();
        $this->assertSame('Same location edit',$risk->refresh()->resiko);
        $viewer = User::factory()->create(['username'=>'qa-viewer-'.uniqid(), 'pic_id'=>$pic->id]);
        $viewer->givePermissionTo('lihat data semua risk register');
        $this->actingAs($viewer);
        $this->put(route('riskRegister'.$module.'.update',$risk->id),$payload)->assertForbidden();
        $other->givePermissionTo('edit data semua risk register');$this->actingAs($other);
        $payload['resiko']='Global editor';
        $this->put(route('riskRegister'.$module.'.update',$risk->id),$payload)->assertSessionHasNoErrors()->assertSessionHas('type','success');
        $this->assertSame('Global editor',$risk->refresh()->resiko);
    }

    /** @dataProvider subforms */
    public function test_subforms_reject_unauthorized_editors(string $module,string $form): void
    {
        $risk=$this->createRisk($module);
        $payload=$this->subpayload($module,$form,'create');$payload['id']=$risk->id;
        $this->actingAs(User::factory()->create(['username'=>'qa-no-rights-'.uniqid(), 'pic_id'=>null]));
        $route=$form==='Osd2'?'riskRegisterKlinisOsd2.update':'riskregister.'.strtolower($form);
        $before=$risk->getAttributes();
        $this->put(route($route,$risk->id),$payload)->assertForbidden();
        $this->assertSame($before,$risk->refresh()->getAttributes());
        if ($form!=='Osd2') {
            $class=$form==='FormulirRCA'?\App\Models\FormulirRca::class:'App\\Models\\Fgd'.substr($form,3);
            $this->assertFalse($class::where('risk_register_id',$risk->id)->exists());
        }
    }

    public function fgdStages(): array
    {
        $rows=[];foreach (['Klinis','NonKlinis'] as $module) foreach (['Inherent','Residual','Treated','Actual'] as $stage) $rows[]=[$module,'FGD'.$stage];return $rows;
    }

    /** @dataProvider fgdStages */
    public function test_fgd_rolls_back_respondent_update_if_register_save_fails(string $module,string $form): void
    {
        $risk=$this->createRisk($module);
        $payload=$this->subpayload($module,$form,'create');$payload['id']=$risk->id;
        $this->put(route('riskregister.'.strtolower($form)),$payload)->assertSessionHasNoErrors();
        $class='App\\Models\\Fgd'.substr($form,3);
        $before=$class::where('risk_register_id',$risk->id)->firstOrFail()->getAttributes();
        $observer=\Mockery::mock(\App\Observers\AnnualRiskObserver::class)->makePartial();
        $observer->shouldReceive('saving')->andThrow(\Illuminate\Validation\ValidationException::withMessages(['test_failure'=>'Simulated register save failure']));
        $this->app->instance(\App\Observers\AnnualRiskObserver::class,$observer);
        $payload=$this->subpayload($module,$form,'edit');$payload['id']=$risk->id;
        $this->put(route('riskregister.'.strtolower($form)),$payload)->assertSessionHasErrors('test_failure');
        $this->assertSame($before,$class::where('risk_register_id',$risk->id)->firstOrFail()->getAttributes());
    }

    /** @dataProvider modules */
    public function test_all_units_does_not_bypass_account_indicator_scope(string $module): void
    {
        $payload=$this->payload($module);$payload['pic_id']='0';
        DB::table('indikator_fitur4s')->where('id',$payload['indikator_fitur4_id'])->update(['location_id'=>'[99999999]']);
        $user=User::factory()->create(['username'=>'qa-indicator-scope-'.uniqid(),'pic_id'=>null]);
        $this->actingAs($user);
        $this->assertFalse(app(\App\Services\RiskIndicatorAccess::class)->allowsUser($user,$payload['indikator_fitur4_id']));
        $before=RiskRegister::count();
        $this->post(route('riskRegister'.$module.'.store'),$payload)->assertSessionHasErrors('indikator_fitur4_id');
        $this->assertSame($before,RiskRegister::count());
        $service=app(\App\Services\AnnualIndicatorService::class);
        $indicator=DB::table('indikator_fitur4s')->find($payload['indikator_fitur4_id']);
        $this->assertTrue($service->acceptsPics($indicator,[0]));
        $this->assertFalse($service->acceptsPics($indicator,[]));
        $this->assertFalse($service->acceptsPics($indicator,[99999999]));
    }

    public function test_alternative_risk_update_routes_also_deny_an_unprivileged_account(): void
    {
        $risk=$this->createRisk('Klinis');$before=$risk->getAttributes();
        $this->actingAs(User::factory()->create(['username'=>'qa-alternate-routes-'.uniqid(),'pic_id'=>null]));
        foreach (['riskRegisterKlinisPengendalian.update','klinisOpsiPengendalian.update','riskregister.requestupdatestatus','riskregister.updatestatus'] as $route) {
            $this->put(route($route,$risk->id),['id'=>$risk->id,'currently_id'=>2])->assertForbidden();
            $this->assertSame($before,$risk->refresh()->getAttributes());
        }
        $this->assertFalse(\App\Models\RequestUpdate::where('risk_register_id',$risk->id)->exists());
    }
}
