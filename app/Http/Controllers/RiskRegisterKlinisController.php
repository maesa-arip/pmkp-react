<?php

namespace App\Http\Controllers;

use App\Http\Resources\RiskRegisterResource;
use App\Models\ControlValue;
use App\Models\Efektif;
use App\Models\IdentificationSource;
use App\Models\ImpactValue;
use App\Models\IncidentVariety;
use App\Models\IndikatorFitur4;
use App\Models\JenisPengendalian;
use App\Models\Location;
use App\Models\OpsiPengendalian;
use App\Models\PembiayaanRisiko;
use App\Models\Pic;
use App\Models\ProbabilityValue;
use App\Models\RiskCategory;
use App\Models\RiskRegister;
use App\Models\RiskRegisterHistory;
use App\Models\RiskType;
use App\Models\RiskVariety;
use App\Models\User;
use App\Models\WaktuImplementasi;
use App\Models\WaktuPengendalian;
use App\Notifications\RiskRegisterEditNotification;
use App\Notifications\RiskRegisterNewNotification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class RiskRegisterKlinisController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public $loadDefault = 10;
    public function index(Request $request)
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $riskRegisterKlinis = RiskRegister::query()->where('tipe_id', 1)
            ->with('risk_category')
            ->with('identification_source')
            ->with('opsi_pengendalian')
            ->with('pembiayaan_risiko')
            ->with('risk_variety')
            ->with('risk_type')
            ->with('pic')
            ->with('user')
            ->where($whosLogin);
        $riskRegisterCount = $riskRegisterKlinis->count();
        $riskRegisterPengendalianCount = RiskRegister::query()->where($whosLogin)->where('tipe_id', 1)->where('efektif_id','=',0)->count();
        $OpsiPengendalianCount = RiskRegister::query()->where($whosLogin)->where('tipe_id', 1)->where('opsi_pengendalian_id','=',0)->count();
        $riskRegisterOsd2Count = RiskRegister::query()->where($whosLogin)->where('tipe_id', 1)->where('osd2_dampak','=',0)->count();
        if ($request->q) {
            $riskRegisterKlinis->where('pernyataan_risiko', 'like', '%' . $request->q . '%');
        }
        if ($request->has(['field', 'direction'])) {
            $riskRegisterKlinis->orderBy($request->field, $request->direction);
        }
        $riskRegisterKlinis = (RiskRegisterResource::collection($riskRegisterKlinis->latest()->fastPaginate($request->load)->withQueryString())
        )->additional([
            'attributes' => [
                'total' => 1100,
                'per_page' => 10,
            ],
            'filtered' => [
                'load' => $request->load ?? $this->loadDefault,
                'q' => $request->q ?? '',
                'page' => $request->page ?? 1,
                'field' => $request->field ?? '',
                'direction' => $request->direction ?? '',

            ]
        ]);
        $riskCategories = RiskCategory::get();
        $identificationSources = IdentificationSource::get();
        $locations = Location::get();
        $riskVarieties = RiskVariety::get();
        $riskTypes = RiskType::get();
        $opsiPengendalian = OpsiPengendalian::get();
        $efektif = Efektif::get();
        $jenisPengendalian = JenisPengendalian::get();
        $waktuPengendalian = WaktuPengendalian::get();
        $pembiayaanRisiko = PembiayaanRisiko::get();
        $waktuImplementasi = WaktuImplementasi::get();
        $pics = Pic::get();
        $impactValues = ImpactValue::where('type',1)->get();
        $probabilityValues = ProbabilityValue::where('type',1)->get();
        $controlValues = ControlValue::where('type',1)->get();
        $location_login = Pic::where('id',auth()->user()->pic_id)->pluck('location_id');
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? $indikatorFitur4s = IndikatorFitur4::orderBy('name','DESC')->get() : $indikatorFitur4s = IndikatorFitur4::whereJsonContains('location_id', $location_login[0])->orderBy('name','DESC')->get();
        // $indikatorFitur4s = IndikatorFitur4::whereJsonContains('location_id', $location_login[0])->orderBy('name','DESC')->get();
        return Inertia::render('RiskRegister/Klinis/Index', [
            'riskRegisterKlinis' => $riskRegisterKlinis,
            'riskRegisterCount' => $riskRegisterCount,
            'riskRegisterPengendalianCount' => $riskRegisterPengendalianCount,
            'OpsiPengendalianCount' => $OpsiPengendalianCount,
            'riskRegisterOsd2Count' => $riskRegisterOsd2Count,
            'riskCategories' => $riskCategories,
            'identificationSources' => $identificationSources,
            'locations' => $locations,
            'riskVarieties' => $riskVarieties,
            'riskTypes' => $riskTypes,
            'pics' => $pics,
            'impactValues' => $impactValues,
            'probabilityValues' => $probabilityValues,
            'controlValues' => $controlValues,
            'indikatorFitur4s' => $indikatorFitur4s,
            'opsiPengendalian' => $opsiPengendalian,
            'pembiayaanRisiko' => $pembiayaanRisiko,
            'efektif' => $efektif,
            'jenisPengendalian' => $jenisPengendalian,
            'waktuPengendalian' => $waktuPengendalian,
            'waktuImplementasi' => $waktuImplementasi,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // dd($request->all());
        $this->validate($request, [
            'indikator_fitur4_id' => 'required',
            'risk_category_id' => 'required',
            'tgl_register' => 'required',
            'sebab' => 'required',
            'currently_id' => 'required',
            'pic_id' => 'required',
            'identification_source_id' => 'required',
            'resiko' => 'required',
            'dampak' => 'required',
            'pernyataan_risiko' => 'required',
            'risk_variety_id' => 'required',
            'risk_type_id' => 'required',
            'num' => 'required',
            'denum' => 'required',
            'target_waktu' => 'required|numeric|min:1|not_in:0',
            'osd1_dampak' => 'required',
            'osd1_probabilitas' => 'required',
            'osd1_controllability' => 'required',
            'perlu_penanganan_id' => 'required',
            'pengendalian_risiko' => 'required',
            'efektif_id' => 'required',
            'pengendalian_harus_ada' => 'required',
            'opsi_pengendalian_id' => 'required',
            'penanganan_risiko' => 'required',
            'pembiayaan_risiko_id' => 'required',
            'jenis_pengendalian_id' => 'required',
            'waktu_pengendalian_id' => 'required',
            'rencana_pengendalian' => 'required',
        ]);
        $date = Carbon::parse($request->tgl_register);
        $tgl_selesai = $date->addDays($request->target_waktu);
        $request->merge([
            'user_id' => auth()->user()->id,
            'tipe_id' => 1,
            'tgl_selesai' => $tgl_selesai,
            'waktudenumnum' => $request->target_waktu,
            'grading1' => 1,
            'grading2' => 1,
            'concatdp1' => $request->osd1_dampak . $request->osd1_probabilitas,
            // 'concatdp2' => $request->osd2_dampak . $request->osd2_probabilitas,
            'osd1_inherent' => $request->osd1_dampak * $request->osd1_probabilitas * $request->osd1_controllability,
            // 'osd2_inherent' => $request->osd1_dampak * $request->osd1_probabilitas * $request->osd1_controllability,
        ]);
        // dd($request->all());

        $risk = RiskRegister::create($request->except('name'));
        // dd($risk->id);

        $riskHistory = RiskRegisterHistory::create(['risk_register_id'=>$risk->id, 'currently_id'=>$request->currently_id]);
        // $user = User::whereHas('roles', function ($query) {
        //     $query->where('name', 'super admin');
        // })->get();
        // Notification::send($user, new RiskRegisterNewNotification($risk));
        return back()->with([
            'type' => 'success',
            'message' => 'Data Risk Register Klinis berhasil disimpan',
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $this->validate($request, [
            // 'proses_id' => 'required',
            'tgl_register' => 'required',
            // 'tgl_selesai' => 'required',
            'risk_category_id' => 'required',
            'identification_source_id' => 'required',
            'indikator_fitur4_id' => 'required',
            // 'location_id' => 'required',
            'pernyataan_risiko' => 'required',
            'sebab' => 'required',
            'currently_id' => 'required',
            'resiko' => 'required',
            'dampak' => 'required',
            'risk_variety_id' => 'required',
            'risk_type_id' => 'required',
            // 'efek' => 'required',
            'osd1_dampak' => 'required|numeric|min:1|not_in:0',
            'osd1_probabilitas' => 'required|numeric|min:1|not_in:0',
            'osd1_controllability' => 'required|numeric|min:1|not_in:0',
            'osd2_dampak' => 'required|numeric|min:1|not_in:0',
            'osd2_probabilitas' => 'required|numeric|min:1|not_in:0',
            'osd2_controllability' => 'required|numeric|min:1|not_in:0',
            // 'grading1' => 'required|numeric',
            'pengendalian_risiko' => 'required',
            'pic_id' => 'required',
            'perlu_penanganan_id' => 'required|numeric|min:1|not_in:0',
            // 'opsi_pengendalian_id' => 'required|numeric|min:1|not_in:0',
            'pembiayaan_risiko_id' => 'required|numeric|min:1|not_in:0',
            'target_waktu' => 'required|numeric|min:1|not_in:0',
            // 'pengawasan_id' => 'required',
        ]);
        $request->merge([
            'concatdp1' => $request->osd1_dampak . $request->osd1_probabilitas,
            'concatdp2' => $request->osd2_dampak . $request->osd2_probabilitas,
            'osd1_inherent' => $request->osd1_dampak * $request->osd1_probabilitas * $request->osd1_controllability,
            'osd2_inherent' => $request->osd1_dampak * $request->osd1_probabilitas * $request->osd1_controllability,
        ]);
        $riskRegisterKlinis = RiskRegister::find($id);

        $riskRegisterKlinis->update($request->except('home'));
        $riskHistory = RiskRegisterHistory::create(['risk_register_id'=>$id, 'currently_id'=>$riskRegisterKlinis->currently_id]);
        // $user = User::whereHas('roles', function ($query) {
        //     $query->where('name', 'super admin');
        // })->get();
        // Notification::send($user, new RiskRegisterEditNotification($riskRegisterKlinis));
        return back()->with([
            'type' => 'success',
            'message' => 'Data Risk Register Klinis berhasil diubah',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
