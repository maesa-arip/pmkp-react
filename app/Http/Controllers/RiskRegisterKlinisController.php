<?php

namespace App\Http\Controllers;

use App\Http\Resources\RiskRegisterResource;
use App\Models\ControlValue;
use App\Models\Efektif;
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
            ->with('jenis_sebab')
            ->with('pic')
            ->with('user')
            ->with('formulirrca')
            ->with('fgdinherent')
            ->with('fgdresidual')
            ->with('fgdtreated')
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
        $impactValues = ImpactValue::where('type',1)->get();
        $probabilityValues = ProbabilityValue::where('type',1)->get();
        $controlValues = ControlValue::where('type',1)->get();
        $location_login = Pic::where('id',auth()->user()->pic_id)->pluck('location_id');
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? $indikatorFitur4s = IndikatorFitur4::orderBy('name','DESC')->get() : $indikatorFitur4s = IndikatorFitur4::whereJsonContains('location_id', $location_login[0])->orderBy('name','DESC')->get();
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
            'osd1_inherent' => $request->osd1_dampak * $request->osd1_probabilitas * $request->osd1_controllability,
        ]);

        $risk = RiskRegister::create($request->except('name'));

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

    public function update(Request $request, $id)
    {
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
            'jenis_sebab_id' => 'required',
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
            'tgl_selesai' => $tgl_selesai,
            'waktudenumnum' => $request->target_waktu,
            'concatdp1' => $request->osd1_dampak . $request->osd1_probabilitas,
            'osd1_inherent' => $request->osd1_dampak * $request->osd1_probabilitas * $request->osd1_controllability,
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
        FormulirRca::updateOrCreate(['risk_register_id'=>$request->id],$atrributes);
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
        FgdInherent::updateOrCreate(['risk_register_id'=>$request->id],$atrributes);
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
        FgdResidual::updateOrCreate(['risk_register_id'=>$request->id],$atrributes);
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
        FgdTreated::updateOrCreate(['risk_register_id'=>$request->id],$atrributes);
        return back()->with([
            'type' => 'success',
            'message' => 'Data FGD Treated berhasil disimpan',
        ]);
    }


    public function destroy($id)
    {
        //
    }
}
