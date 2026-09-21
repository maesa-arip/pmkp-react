<?php
require dirname(__DIR__, 2).'/vendor/autoload.php';
$app = require dirname(__DIR__, 2).'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
if (!str_starts_with(DB::connection()->getDatabaseName(), 'simdalin_qa_input_')) throw new RuntimeException('QA database required');
$user = App\Models\User::where('email','adminmr@rsbm.com')->firstOrFail();
Auth::setUser($user);
$periods = App\Models\PeriodeKinerja::orderBy('tahun')->get(['id','tahun','status']);
$period = $periods->firstWhere('status','aktif');
$fixtures = [];
foreach (['Klinis','NonKlinis'] as $type) {
    $request = Illuminate\Http\Request::create('/riskRegister'.$type.'?tahun='.$period->tahun, 'GET');
    $app->instance('request', $request); Auth::setUser($user); $request->setUserResolver(fn () => $user); $request->headers->set('X-Inertia','true');
    $controller = 'App\\Http\\Controllers\\RiskRegister'.$type.'Controller';
    $page = app($controller)->index($request)->toResponse($request)->getData(true);
    $props = $page['props'];
    $indicator = collect($props['indikatorFitur4s'])->first(fn ($i) => (int)$i['tahun']===$period->tahun && $i['is_active'] && ($i['can_select'] ?? true));
    if (!$indicator) throw new RuntimeException('No active admin indicator');
    $pic = collect($props['pics'])->first(fn ($p) => app(App\Services\RiskIndicatorAccess::class)->forPic($p['id'])->whereKey($indicator['id'])->exists());
    $payload = array_fill_keys(App\Models\RiskRegister::FORM_FIELDS, '');
    unset($payload['indikator_fitur04_id']);
    $payload = array_merge($payload, ['tahun'=>(string)$period->tahun,'tgl_register'=>$period->tahun.'-09-18','indikator_fitur4_id'=>$indicator['id'],'pic_id'=>(string)$pic['id'],'risk_category_id'=>5,'currently_id'=>2,'target_waktu'=>'90','num'=>'1','denum'=>'100','c_uc'=>'C']);
    foreach (['sebab','resiko','dampak','pengendalian_risiko','pengendalian_harus_ada','penanganan_risiko','rencana_pengendalian','pihak_terkena','media_pengkomunikasian','penyedia_informasi','penerima_informasi'] as $field) $payload[$field]='QA '.$type.' '.$field;
    $payload['pernyataan_risiko']='Karena '.$payload['sebab'].' kemungkinan '.$payload['resiko'].' sehingga '.$payload['dampak'];
    foreach (['identification_source_id'=>'identificationSources','risk_variety_id'=>'riskVarieties','risk_type_id'=>'riskTypes','jenis_sebab_id'=>'jenisSebabs','efektif_id'=>'efektif','opsi_pengendalian_id'=>'opsiPengendalian','pembiayaan_risiko_id'=>'pembiayaanRisiko','jenis_pengendalian_id'=>'jenisPengendalian','waktu_pengendalian_id'=>'waktuPengendalian'] as $field=>$map) $payload[$field]=$props[$map][0]['id'];
    $model = $payload + ['id'=>99999,'tipe_id'=>$type==='Klinis'?1:2];
    $model['tgl_register']=$payload['tgl_register'].' 10:00:00';
    $fixtures[$type] = ['props'=>$props,'payload'=>$payload,'model'=>$model,'pic'=>$pic,'indicator'=>$indicator,'periods'=>$periods];
}
file_put_contents(storage_path('app/input-edit-qa/risk-fixtures.json'),json_encode($fixtures,JSON_UNESCAPED_UNICODE));
echo json_encode(['database'=>DB::connection()->getDatabaseName(),'admin_risk_all'=>$user->can('lihat data semua risk register'),'cases'=>array_keys($fixtures),'year'=>$period->tahun]), PHP_EOL;
