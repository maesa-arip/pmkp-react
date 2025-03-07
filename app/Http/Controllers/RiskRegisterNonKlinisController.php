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

class RiskRegisterNonKlinisController extends Controller
{
    public $loadDefault = 10;
    public function index(Request $request)
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $riskRegisterKlinis = RiskRegister::query()->where('tipe_id', 2)
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
        $riskRegisterCount = $riskRegisterKlinis->count();
        $riskRegisterPengendalianCount = RiskRegister::query()->where($whosLogin)->where('tipe_id', 2)->where('efektif_id','=',0)->count();
        $OpsiPengendalianCount = RiskRegister::query()->where($whosLogin)->where('tipe_id', 2)->where('opsi_pengendalian_id','=',0)->count();
        $riskRegisterOsd2Count = RiskRegister::query()->where($whosLogin)->where('tipe_id', 2)->where('osd2_dampak','=',0)->count();
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
        $impactValues = ImpactValue::where('type',2)->orderBy('value','ASC')->get();
        $probabilityValues = ProbabilityValue::where('type',2)->orderBy('value','ASC')->get();
        $controlValues = ControlValue::where('type',2)->orderBy('value','ASC')->get();
        $location_login = Pic::where('id',auth()->user()->pic_id)->pluck('location_id');
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? $indikatorFitur4s = IndikatorFitur4::orderBy('name','DESC')->get() : $indikatorFitur4s = IndikatorFitur4::whereJsonContains('location_id', $location_login[0])->orwhereJsonContains('location_id', 0)->orderBy('name','DESC')->get();
        return Inertia::render('RiskRegister/NonKlinis/Index', [
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
        // dd($request->all());
        
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
        $encodedPic = json_encode($request->pic_id,JSON_NUMERIC_CHECK);
        // $osd1_dampak = ImpactValue::where('id',$request->osd1_dampak)->pluck('value');
        // $osd1_probabilitas = ProbabilityValue::where('id',$request->osd1_probabilitas)->pluck('value');
        $osd1_controllability = ControlValue::where('id',$request->osd1_controllability)->pluck('value');
        $request->merge([
            'user_id' => auth()->user()->id,
            'tipe_id' => 2,
            'tgl_selesai' => $tgl_selesai,
            'pic_id' => $encodedPic,
            'waktudenumnum' => $request->target_waktu,
            'grading1' => 1,
            'grading2' => 1,
            // 'osd1_dampak' => $osd1_dampak[0],
            // 'osd1_probabilitas' => $osd1_probabilitas[0],
            'osd1_controllability' => $osd1_controllability[0],
            // 'concatdp1' => $request->osd1_dampak . $request->osd1_probabilitas,
            // 'osd1_inherent' => $request->osd1_dampak * $request->osd1_probabilitas * $request->osd1_controllability,
        ]);

        $risk = RiskRegister::create($request->except('name'));

        $riskHistory = RiskRegisterHistory::create(['risk_register_id'=>$risk->id, 'currently_id'=>$request->currently_id]);
        // $user = User::whereHas('roles', function ($query) {
        //     $query->where('name', 'super admin');
        // })->get();
        // Notification::send($user, new RiskRegisterNewNotification($risk));
        return back()->with([
            'type' => 'success',
            'message' => 'Data Risk Register Non Klinis berhasil disimpan',
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
        $encodedPic = json_encode($request->pic_id,JSON_NUMERIC_CHECK);
        // $osd1_dampak = ImpactValue::where('id',$request->osd1_dampak)->pluck('value');
        // $osd1_probabilitas = ProbabilityValue::where('id',$request->osd1_probabilitas)->pluck('value');
        $osd1_controllability = ControlValue::where('id',$request->osd1_controllability)->pluck('value');
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
            'message' => 'Data Risk Register Non Klinis berhasil diubah',
        ]);
    }

    


    public function destroy($id)
    {
        // dd($id);
        $fgdInherent = FgdInherent::where('risk_register_id',$id);
        $fgdResidual = FgdResidual::where('risk_register_id',$id);
        $fgdTreated = FgdTreated::where('risk_register_id',$id);
        $fgdActual = FgdActual::where('risk_register_id',$id);
        $formulirRca = FormulirRca::where('risk_register_id',$id);
        $history = RiskRegisterHistory::where('risk_register_id',$id);
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
