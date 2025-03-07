<?php

namespace App\Http\Controllers;

use App\Http\Resources\RiskRegisterResource;
use App\Models\ControlValue;
use App\Models\Efektif;
use App\Models\FgdActual;
use App\Models\FgdInherent;
use App\Models\FgdResidual;
use App\Models\FgdTreated;
use App\Models\FormulirRca;
use App\Models\IdentificationSource;
use App\Models\ImpactValue;
use App\Models\IncidentVariety;
use App\Models\IndikatorFitur4;
use App\Models\JenisPengendalian;
use App\Models\JenisSebab;
use App\Models\Location;
use App\Models\OpsiPengendalian;
use App\Models\PembiayaanRisiko;
use App\Models\Pic;
use App\Models\ProbabilityValue;
use App\Models\RequestUpdate;
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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class RiskRegisterKlinisController extends Controller
{
    public $loadDefault = 10;
    public function index(Request $request)
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        // $riskRegisterKlinis = RiskRegister::query()->select('risk_registers.*','risk_registers.id as risk_register_id', DB::raw('JSON_UNQUOTE(JSON_EXTRACT(risk_registers.pic_id, "$[*]")) as pic_ids'))->where('tipe_id', 1)
        $riskRegisterKlinis = RiskRegister::query()->where('tipe_id', 1)
            ->with('risk_category')
            ->with('identification_source')
            ->with('opsi_pengendalian')
            ->with('pembiayaan_risiko')
            ->with('risk_variety')
            ->with('risk_type')
            ->with('jenis_sebab')
            ->with('pic')
            ->with('user')
            ->with('riskgrading')
            ->with('formulirrca')
            ->with('fgdinherent')
            ->with('fgdresidual')
            ->with('fgdtreated')
            ->with('fgdactual')
            ->where($whosLogin);
        // dd($riskRegisterKlinis);
        $riskRegisterCount = $riskRegisterKlinis->count();
        $riskRegisterPengendalianCount = RiskRegister::query()->where($whosLogin)->where('tipe_id', 1)->where('efektif_id', '=', 0)->count();
        $OpsiPengendalianCount = RiskRegister::query()->where($whosLogin)->where('tipe_id', 1)->where('opsi_pengendalian_id', '=', 0)->count();
        $riskRegisterOsd2Count = RiskRegister::query()->where($whosLogin)->where('tipe_id', 1)->where('osd2_dampak', '=', 0)->count();
        if ($request->q) {
            $riskRegisterKlinis->where('pernyataan_risiko', 'like', '%' . $request->q . '%');
        }
        if ($request->has(['field', 'direction'])) {
            $riskRegisterKlinis->orderBy($request->field, $request->direction);
        }
        $riskRegisterKlinis = (RiskRegisterResource::collection($riskRegisterKlinis->latest()->fastPaginate($request->load ?? $this->loadDefault)->withQueryString())
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
        $jenisSebabs = JenisSebab::get();
        $opsiPengendalian = OpsiPengendalian::get();
        $efektif = Efektif::get();
        $jenisPengendalian = JenisPengendalian::get();
        $waktuPengendalian = WaktuPengendalian::get();
        $pembiayaanRisiko = PembiayaanRisiko::get();
        $waktuImplementasi = WaktuImplementasi::get();
        $pics = Pic::get();
        $impactValues = ImpactValue::where('type', 1)->orderBy('value', 'ASC')->get();
        $probabilityValues = ProbabilityValue::where('type', 1)->orderBy('value', 'ASC')->get();
        $controlValues = ControlValue::where('type', 1)->orderBy('value', 'ASC')->get();
        $location_login = Pic::where('id', auth()->user()->pic_id)->pluck('location_id');
        // if (auth()->user()->can('lihat data semua risk register')) {
        //     return $indikatorFitur4s = IndikatorFitur4::orderBy('name', 'DESC')->get();
        // }
        // if (auth()->user()->can('lihat data indikator wakil direktur')) {
        //     return $indikatorFitur4s = IndikatorFitur4::leftJoin('indikator_fitur3s', 'indikator_fitur3s.id', 'indikator_fitur4s.indikator_fitur3_id')
        //     ->leftJoin('indikator_fitur2s', 'indikator_fitur2s.id', 'indikator_fitur3s.indikator_fitur2_id')->orderBy('indikator_fitur4s.name', 'DESC')->get();
        // }
        // if (auth()->user()->can('lihat indikator kabag/kabid')) {
        //     return $indikatorFitur4s = IndikatorFitur4::orderBy('name', 'DESC')->get();
        // }
        // if (auth()->user()->can('lihat indikator ketua tim kerja')) {
        //     return $indikatorFitur4s = IndikatorFitur4::orderBy('name', 'DESC')->get();
        // }
        // if (auth()->user()->can('lihat indikator unit')) {
        //     $indikatorFitur4s = IndikatorFitur4::whereJsonContains('location_id', $location_login[0])->orderBy('name', 'DESC')->get();
        // }
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? $indikatorFitur4s = IndikatorFitur4::orderBy('name', 'DESC')->get() : $indikatorFitur4s = IndikatorFitur4::whereJsonContains('location_id', $location_login[0])->orwhereJsonContains('location_id', 0)->orderBy('name', 'DESC')->get();
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
            'jenisSebabs' => $jenisSebabs,
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

    public function store(Request $request)
    {

        $this->validate($request, [
            'indikator_fitur4_id' => 'required',
            'risk_category_id' => 'required',
            'kronologi' => 'required_if:risk_category_id,6',
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
            'jenis_sebab_id' => 'required',
            'num' => 'required',
            'denum' => 'required',
            'target_waktu' => 'required|numeric|min:1|not_in:0|in:90,180,365',
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
            'pihak_terkena' => 'required',
        ]);
        $date = Carbon::parse($request->tgl_register);
        $encodedPic = json_encode($request->pic_id, JSON_NUMERIC_CHECK);
        // dd($encodedPic);
        $tgl_selesai = $date->addDays($request->target_waktu);
        $osd1_controllability = ControlValue::where('id', $request->osd1_controllability)->pluck('value');
        $request->merge([
            'user_id' => auth()->user()->id,
            'tipe_id' => 1,
            'tgl_selesai' => $tgl_selesai,
            'pic_id' => $encodedPic,
            'waktudenumnum' => $request->target_waktu,
            'grading1' => 1,
            'grading2' => 1,
            'osd1_controllability' => $osd1_controllability[0],
        ]);

        $risk = RiskRegister::create($request->except('name'));
        $kode_risiko_prefix = ($risk->risk_category_id == 5) ? 'RSO' : 'ROO';
        $tahun_register = Carbon::parse($risk->tgl_register)->format('y');
        $risk->kode_risiko = "{$kode_risiko_prefix}.{$tahun_register}.02.43.{$risk->id}";
        $risk->save();
        // dd($kode_risiko_prefix,$tahun_register,$risk->kode_risiko,$risk->save());

        $riskHistory = RiskRegisterHistory::create(['risk_register_id' => $risk->id, 'currently_id' => $request->currently_id]);
        // $user = User::whereHas('roles', function ($query) {
        //     $query->where('name', 'super admin');
        // })->get();
        // Notification::send($user, new RiskRegisterNewNotification($risk));

        return back()->with([
            'type' => 'success',
            'message' => 'Data Risk Register Klinis berhasil disimpan',
        ]);
    }

    public function update(Request $request, $id)
    {
        $this->validate($request, [
            'indikator_fitur4_id' => 'required',
            'risk_category_id' => 'required',
            'tgl_register' => 'required',
            'sebab' => 'required',
            'pic_id' => 'required',
            'identification_source_id' => 'required',
            'resiko' => 'required',
            'dampak' => 'required',
            'pernyataan_risiko' => 'required',
            'risk_variety_id' => 'required',
            'risk_type_id' => 'required',
            'jenis_sebab_id' => 'required',
            'num' => 'required',
            'denum' => 'required',
            'target_waktu' => 'required|numeric|min:1|not_in:0|in:90,180,365',
            // 'osd1_dampak' => 'required',
            // 'osd1_probabilitas' => 'required',
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
            'pihak_terkena' => 'required',
        ]);
        $date = Carbon::parse($request->tgl_register);
        $tgl_selesai = $date->addDays($request->target_waktu);
        $encodedPic = json_encode($request->pic_id, JSON_NUMERIC_CHECK);
        // $osd1_dampak = ImpactValue::where('id', $request->osd1_dampak)->pluck('value');
        // $osd1_probabilitas = ProbabilityValue::where('id', $request->osd1_probabilitas)->pluck('value');
        $osd1_controllability = ControlValue::where('id', $request->osd1_controllability)->pluck('value');
        $request->merge([
            'tgl_selesai' => $tgl_selesai,
            'waktudenumnum' => $request->target_waktu,
            'pic_id' => $encodedPic,
            // 'osd1_dampak' => $osd1_dampak[0],
            // 'osd1_probabilitas' => $osd1_probabilitas[0],
            'osd1_controllability' => $osd1_controllability[0],
            // 'concatdp1' => $request->osd1_dampak . $request->osd1_probabilitas,
            // 'osd1_inherent' => $request->osd1_dampak * $request->osd1_probabilitas * $request->osd1_controllability,
        ]);
        $riskRegisterKlinis = RiskRegister::find($id);

        // dd($request->all());
        // currently_id = 1 => sedang terjadi
        if ($riskRegisterKlinis->currently_id == 1 && $request->currently_id == 2) {
            return back()->with([
                'type' => 'error',
                'message' => 'Tidak bisa rubah status tidak sedang terjadi, silakan rubah di menu "Request Perubahan Status"',
            ]);
            // $riskHistory = RiskRegisterHistory::create(['risk_register_id' => $id, 'currently_id' => $riskRegisterKlinis->currently_id]);
        }
        if ($riskRegisterKlinis->currently_id == 2 && $request->currently_id == 1) {
            $riskHistory = RiskRegisterHistory::create(['risk_register_id' => $id, 'currently_id' => 1]);
        }
        $riskRegisterKlinis->update($request->except('home'));
        // $user = User::whereHas('roles', function ($query) {
        //     $query->where('name', 'super admin');
        // })->get();
        // Notification::send($user, new RiskRegisterEditNotification($riskRegisterKlinis));
        return back()->with([
            'type' => 'success',
            'message' => 'Data Risk Register Klinis berhasil diubah',
        ]);
    }

    public function formulirrca(Request $request)
    {
        $this->validate($request, [
            'why1' => 'required',
            'akar_penyebab' => 'required',
        ]);
        $atrributes = ([
            'why1' => $request->why1,
            'why2' => $request->why2,
            'why3' => $request->why3,
            'why4' => $request->why4,
            'why5' => $request->why5,
            'akar_penyebab' => $request->akar_penyebab,
        ]);
        FormulirRca::updateOrCreate(['risk_register_id' => $request->id], $atrributes);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Formulir RCA berhasil disimpan',
        ]);
    }

    public function fgdinherent(Request $request)
    {
        $this->validate($request, [
            'dampak_responden1' => 'required|numeric|min:1|max:5',
            'dampak_responden2' => 'required|numeric|min:1|max:5',
            'dampak_responden3' => 'required|numeric|min:1|max:5',
            'dampak_responden4' => 'required|numeric|min:1|max:5',
            'dampak_responden5' => 'required|numeric|min:1|max:5',
            'dampak_responden6' => 'required|numeric|min:1|max:5',


            'probabilitas_responden1' => 'required|numeric|min:1|max:5',
            'probabilitas_responden2' => 'required|numeric|min:1|max:5',
            'probabilitas_responden3' => 'required|numeric|min:1|max:5',
            'probabilitas_responden4' => 'required|numeric|min:1|max:5',
            'probabilitas_responden5' => 'required|numeric|min:1|max:5',
            'probabilitas_responden6' => 'required|numeric|min:1|max:5',

        ]);
        $atrributes = ([
            'dampak_responden1' => $request->dampak_responden1,
            'dampak_responden2' => $request->dampak_responden2,
            'dampak_responden3' => $request->dampak_responden3,
            'dampak_responden4' => $request->dampak_responden4,
            'dampak_responden5' => $request->dampak_responden5,
            'dampak_responden6' => $request->dampak_responden6,
            'dampak_responden7' => $request->dampak_responden7,
            'dampak_responden8' => $request->dampak_responden8,

            'probabilitas_responden1' => $request->probabilitas_responden1,
            'probabilitas_responden2' => $request->probabilitas_responden2,
            'probabilitas_responden3' => $request->probabilitas_responden3,
            'probabilitas_responden4' => $request->probabilitas_responden4,
            'probabilitas_responden5' => $request->probabilitas_responden5,
            'probabilitas_responden6' => $request->probabilitas_responden6,
            'probabilitas_responden7' => $request->probabilitas_responden7,
            'probabilitas_responden8' => $request->probabilitas_responden8,
        ]);
        FgdInherent::updateOrCreate(['risk_register_id' => $request->id], $atrributes);


        $riskRegisterKlinis = RiskRegister::find($request->id);
        $this->validate($request, [
            'osd1_dampak' => 'required',
            'osd1_probabilitas' => 'required',
        ]);
        $request->merge([
            'concatdp1' => $request->osd1_dampak . $request->osd1_probabilitas,
            'osd1_inherent' => $request->osd1_dampak * $request->osd1_probabilitas * $riskRegisterKlinis->osd1_controllability,
        ]);
        $riskRegisterKlinis->update([
            'osd1_dampak' => $request->osd1_dampak,
            'osd1_probabilitas' => $request->osd1_probabilitas,
            'concatdp1' => $request->concatdp1,
            'osd1_inherent' => $request->osd1_inherent,
        ]);
        return back()->with([
            'type' => 'success',
            'message' => 'Data FGD Inherent berhasil disimpan',
        ]);
    }
    public function fgdresidual(Request $request)
    {
        $this->validate($request, [
            'dampak_responden1' => 'required|numeric|min:1|max:5',
            'dampak_responden2' => 'required|numeric|min:1|max:5',
            'dampak_responden3' => 'required|numeric|min:1|max:5',
            'dampak_responden4' => 'required|numeric|min:1|max:5',
            'dampak_responden5' => 'required|numeric|min:1|max:5',
            'dampak_responden6' => 'required|numeric|min:1|max:5',


            'probabilitas_responden1' => 'required|numeric|min:1|max:5',
            'probabilitas_responden2' => 'required|numeric|min:1|max:5',
            'probabilitas_responden3' => 'required|numeric|min:1|max:5',
            'probabilitas_responden4' => 'required|numeric|min:1|max:5',
            'probabilitas_responden5' => 'required|numeric|min:1|max:5',
            'probabilitas_responden6' => 'required|numeric|min:1|max:5',

        ]);
        $atrributes = ([
            'dampak_responden1' => $request->dampak_responden1,
            'dampak_responden2' => $request->dampak_responden2,
            'dampak_responden3' => $request->dampak_responden3,
            'dampak_responden4' => $request->dampak_responden4,
            'dampak_responden5' => $request->dampak_responden5,
            'dampak_responden6' => $request->dampak_responden6,
            'dampak_responden7' => $request->dampak_responden7,
            'dampak_responden8' => $request->dampak_responden8,

            'probabilitas_responden1' => $request->probabilitas_responden1,
            'probabilitas_responden2' => $request->probabilitas_responden2,
            'probabilitas_responden3' => $request->probabilitas_responden3,
            'probabilitas_responden4' => $request->probabilitas_responden4,
            'probabilitas_responden5' => $request->probabilitas_responden5,
            'probabilitas_responden6' => $request->probabilitas_responden6,
            'probabilitas_responden7' => $request->probabilitas_responden7,
            'probabilitas_responden8' => $request->probabilitas_responden8,
        ]);
        FgdResidual::updateOrCreate(['risk_register_id' => $request->id], $atrributes);
        $riskRegisterKlinis = RiskRegister::find($request->id);
        $this->validate($request, [
            'osd2_dampak' => 'required',
            'osd2_probabilitas' => 'required',
        ]);
        $request->merge([
            'concatdp2' => $request->osd2_dampak . $request->osd2_probabilitas,
            'osd2_inherent' => $request->osd2_dampak * $request->osd2_probabilitas * $riskRegisterKlinis->osd2_controllability,
        ]);
        $riskRegisterKlinis->update([
            'osd2_dampak' => $request->osd2_dampak,
            'osd2_probabilitas' => $request->osd2_probabilitas,
            'concatdp2' => $request->concatdp2,
            'osd2_inherent' => $request->osd2_inherent,
        ]);
        return back()->with([
            'type' => 'success',
            'message' => 'Data FGD Residual berhasil disimpan',
        ]);
    }
    public function fgdtreated(Request $request)
    {
        $this->validate($request, [
            'dampak_responden1' => 'required|numeric|min:1|max:5',
            'dampak_responden2' => 'required|numeric|min:1|max:5',
            'dampak_responden3' => 'required|numeric|min:1|max:5',
            'dampak_responden4' => 'required|numeric|min:1|max:5',
            'dampak_responden5' => 'required|numeric|min:1|max:5',
            'dampak_responden6' => 'required|numeric|min:1|max:5',


            'probabilitas_responden1' => 'required|numeric|min:1|max:5',
            'probabilitas_responden2' => 'required|numeric|min:1|max:5',
            'probabilitas_responden3' => 'required|numeric|min:1|max:5',
            'probabilitas_responden4' => 'required|numeric|min:1|max:5',
            'probabilitas_responden5' => 'required|numeric|min:1|max:5',
            'probabilitas_responden6' => 'required|numeric|min:1|max:5',

        ]);
        $atrributes = ([
            'dampak_responden1' => $request->dampak_responden1,
            'dampak_responden2' => $request->dampak_responden2,
            'dampak_responden3' => $request->dampak_responden3,
            'dampak_responden4' => $request->dampak_responden4,
            'dampak_responden5' => $request->dampak_responden5,
            'dampak_responden6' => $request->dampak_responden6,
            'dampak_responden7' => $request->dampak_responden7,
            'dampak_responden8' => $request->dampak_responden8,

            'probabilitas_responden1' => $request->probabilitas_responden1,
            'probabilitas_responden2' => $request->probabilitas_responden2,
            'probabilitas_responden3' => $request->probabilitas_responden3,
            'probabilitas_responden4' => $request->probabilitas_responden4,
            'probabilitas_responden5' => $request->probabilitas_responden5,
            'probabilitas_responden6' => $request->probabilitas_responden6,
            'probabilitas_responden7' => $request->probabilitas_responden7,
            'probabilitas_responden8' => $request->probabilitas_responden8,
        ]);
        FgdTreated::updateOrCreate(['risk_register_id' => $request->id], $atrributes);
        $riskRegisterKlinis = RiskRegister::find($request->id);
        $this->validate($request, [
            'osd3_dampak' => 'required',
            'osd3_probabilitas' => 'required',
        ]);
        $request->merge([
            'concatdp3' => $request->osd3_dampak . $request->osd3_probabilitas,
        ]);
        $riskRegisterKlinis->update([
            'osd3_dampak' => $request->osd3_dampak,
            'osd3_probabilitas' => $request->osd3_probabilitas,
            'concatdp3' => $request->concatdp3,
        ]);
        return back()->with([
            'type' => 'success',
            'message' => 'Data FGD Treated berhasil disimpan',
        ]);
    }
    public function fgdactual(Request $request)
    {
        $this->validate($request, [
            'dampak_responden1' => 'required|numeric|min:1|max:5',
            'dampak_responden2' => 'required|numeric|min:1|max:5',
            'dampak_responden3' => 'required|numeric|min:1|max:5',
            'dampak_responden4' => 'required|numeric|min:1|max:5',
            'dampak_responden5' => 'required|numeric|min:1|max:5',
            'dampak_responden6' => 'required|numeric|min:1|max:5',


            'probabilitas_responden1' => 'required|numeric|min:1|max:5',
            'probabilitas_responden2' => 'required|numeric|min:1|max:5',
            'probabilitas_responden3' => 'required|numeric|min:1|max:5',
            'probabilitas_responden4' => 'required|numeric|min:1|max:5',
            'probabilitas_responden5' => 'required|numeric|min:1|max:5',
            'probabilitas_responden6' => 'required|numeric|min:1|max:5',

        ]);
        $atrributes = ([
            'dampak_responden1' => $request->dampak_responden1,
            'dampak_responden2' => $request->dampak_responden2,
            'dampak_responden3' => $request->dampak_responden3,
            'dampak_responden4' => $request->dampak_responden4,
            'dampak_responden5' => $request->dampak_responden5,
            'dampak_responden6' => $request->dampak_responden6,
            'dampak_responden7' => $request->dampak_responden7,
            'dampak_responden8' => $request->dampak_responden8,

            'probabilitas_responden1' => $request->probabilitas_responden1,
            'probabilitas_responden2' => $request->probabilitas_responden2,
            'probabilitas_responden3' => $request->probabilitas_responden3,
            'probabilitas_responden4' => $request->probabilitas_responden4,
            'probabilitas_responden5' => $request->probabilitas_responden5,
            'probabilitas_responden6' => $request->probabilitas_responden6,
            'probabilitas_responden7' => $request->probabilitas_responden7,
            'probabilitas_responden8' => $request->probabilitas_responden8,
        ]);
        FgdActual::updateOrCreate(['risk_register_id' => $request->id], $atrributes);
        $riskRegisterKlinis = RiskRegister::find($request->id);
        $this->validate($request, [
            'osd4_dampak' => 'required',
            'osd4_probabilitas' => 'required',
        ]);
        $request->merge([
            'concatdp4' => $request->osd4_dampak . $request->osd4_probabilitas,
        ]);
        $riskRegisterKlinis->update([
            'osd4_dampak' => $request->osd4_dampak,
            'osd4_probabilitas' => $request->osd4_probabilitas,
            'concatdp4' => $request->concatdp4,
        ]);
        return back()->with([
            'type' => 'success',
            'message' => 'Data FGD Actual berhasil disimpan',
        ]);
    }

    public function requestupdatestatus(Request $request)
    {
        $this->validate($request, [
            'tgl_perbaikan' => 'required',
            'jam_perbaikan' => 'required',
            'upaya_pengendalian' => 'required',
        ]);
        $atrributes = ([
            'tgl_perbaikan' => $request->tgl_perbaikan,
            'jam_perbaikan' => $request->jam_perbaikan,
            'upaya_pengendalian' => $request->upaya_pengendalian,
        ]);
        // dd($request->all());
        RequestUpdate::updateOrCreate(['risk_register_id' => $request->id], $atrributes);
        return back()->with([
            'type' => 'success',
            'message' => 'Request Berhasil di Kirim',
        ]);
    }
    public function updatestatus(Request $request)
    {
        // $this->validate($request, [
        //     'currently_id' => 'required',
        // ]);
        $atrributes = ([
            // 'currently_id' => $request->currently_id,
            'is_approved' => $request->currently_id - 1,
            'tgl_update_status' => now(),
        ]);
        // dd($request->all());
        RequestUpdate::updateOrCreate(['risk_register_id' => $request->id], $atrributes);
        RiskRegister::where('id', $request->id)->update(['currently_id' => $request->currently_id]);
        return back()->with([
            'type' => 'success',
            'message' => 'Status Berhasil dirubah',
        ]);
    }


    public function destroy($id)
    {
        // dd($id);
        $fgdInherent = FgdInherent::where('risk_register_id', $id);
        $fgdResidual = FgdResidual::where('risk_register_id', $id);
        $fgdTreated = FgdTreated::where('risk_register_id', $id);
        $fgdActual = FgdActual::where('risk_register_id', $id);
        $formulirRca = FormulirRca::where('risk_register_id', $id);
        $history = RiskRegisterHistory::where('risk_register_id', $id);
        $riskRegister = RiskRegister::find($id);

        $fgdInherent->delete();
        $fgdResidual->delete();
        $fgdTreated->delete();
        $fgdActual->delete();
        $history->delete();
        $riskRegister->delete();
        return back()->with([
            'type' => 'success',
            'message' => 'Register risiko berhasil dihapus',
        ]);
    }
}
