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

class RiskRegisterKlinisOsd2Controller extends Controller
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
        $indikatorFitur4s = IndikatorFitur4::whereJsonContains('location_id', $location_login[0])->orderBy('name','DESC')->get();
        return Inertia::render('RiskRegister/KlinisOsd2/Index', [
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

    public function update(Request $request, $id)
    {
        $this->validate($request, [
            'osd2_dampak' => 'required|numeric|min:1|not_in:0',
            'osd2_probabilitas' => 'required|numeric|min:1|not_in:0',
            // 'osd2_controllability' => 'required|numeric|min:1|not_in:0',
            'belum_tertangani' => 'required',
            'usulan_perbaikan' => 'required',
            'waktu_implementasi_id' => 'required|numeric|min:1|not_in:0',
            'realisasi_id' => 'required|numeric|min:1|not_in:0',
            'output' => 'required',
        ]);
        $osd2_dampak = ImpactValue::where('id',$request->osd2_dampak)->pluck('value');
        $osd2_probabilitas = ProbabilityValue::where('id',$request->osd2_probabilitas)->pluck('value');
        // $osd2_controllability = ControlValue::where('id',$request->osd2_controllability)->pluck('value');
        $request->merge([
            'osd2_dampak' => $osd2_dampak[0],
            'osd2_probabilitas' => $osd2_probabilitas[0],
            // 'osd2_controllability' => $osd2_controllability[0],
            'concatdp2' => $osd2_dampak[0] . $osd2_probabilitas[0],
            'osd2_inherent' => $osd2_dampak[0] * $osd2_probabilitas[0],
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
}
