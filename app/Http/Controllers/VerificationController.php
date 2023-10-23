<?php

namespace App\Http\Controllers;

use App\Http\Resources\RiskRegisterResource;
use App\Models\RiskRegister;
use Illuminate\Http\Request;
use App\Models\IndikatorFitur04;
use Illuminate\Support\Facades\DB;
use App\Models\ControlValue;
use App\Models\IdentificationSource;
use App\Models\ImpactValue;
use App\Models\IncidentVariety;
use App\Models\IndikatorFitur4;
use App\Models\Location;
use App\Models\Pic;
use App\Models\ProbabilityValue;
use App\Models\RiskCategory;
use App\Models\RiskRegisterHistory;
use App\Models\RiskType;
use App\Models\RiskVariety;
use App\Models\User;
use App\Models\VerificationAdmin;
use App\Models\VerificationManagement;
use App\Models\VerificationPriorityAdmin;
use Illuminate\Contracts\Database\Eloquent\Builder;

class VerificationController extends Controller
{
    public $loadDefault = 10;
    public function occurringmanagement(Request $request)
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $riskRegisterKlinis = RiskRegister::query()
        ->whereHas('requestupdate', function (Builder $query) {
            $query->where('is_approved', 1);
        })
            ->has('requestupdate')
            ->with('risk_category')
            ->with('identification_source')
            ->with('risk_variety')
            ->with('risk_type')
            ->with('pic')
            ->with('risk_register_histories')
            ->with('user')
            ->with('requestupdate')
            ->with('requestupdateverificationmanagement')
            ->where($whosLogin)
            ->orderBy('currently_id', 'ASC');
        if ($request->q) {
            $riskRegisterKlinis->where('tipe_id', 'like', '%' . $request->q . '%');
        }
        if ($request->has(['field', 'direction'])) {
            $riskRegisterKlinis->orderBy($request->field, $request->direction);
        }
        $riskRegisterKlinis = (RiskRegisterResource::collection($riskRegisterKlinis->fastPaginate($request->load ?? $this->loadDefault)->withQueryString())
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
        $pics = Pic::get();
        $impactValues = ImpactValue::get();
        $probabilityValues = ProbabilityValue::get();
        $controlValues = ControlValue::get();

        $location_login = auth()->user() ? Pic::where('id', auth()->user()->pic_id)->get() : Pic::where('id', 41)->get();
        $indikatorFitur04s = IndikatorFitur04::where('location_id', $location_login[0]->location_id)->orderBy('name', 'DESC')->get();
        // dd($indikatorFitur04s);
        return inertia('RiskRegister/Verification/Occurring/Management/Index', ['riskRegisterKlinis' => $riskRegisterKlinis, 'riskCategories' => $riskCategories, 'identificationSources' => $identificationSources, 'locations' => $locations, 'riskVarieties' => $riskVarieties, 'riskTypes' => $riskTypes, 'pics' => $pics, 'impactValues' => $impactValues, 'probabilityValues' => $probabilityValues, 'controlValues' => $controlValues, 'indikatorFitur04s' => $indikatorFitur04s]);
    }
    public function occurringadmin(Request $request)
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $riskRegisterKlinis = RiskRegister::query()
        ->whereHas('requestupdate', function (Builder $query) {
            $query->where('is_approved', 1);
        })
            ->has('requestupdate')
            ->with('risk_category')
            ->with('identification_source')
            ->with('risk_variety')
            ->with('risk_type')
            ->with('pic')
            ->with('risk_register_histories')
            ->with('user')
            ->with('requestupdate')
            ->with('requestupdateverificationadmin')
            ->where($whosLogin)
            ->orderBy('currently_id', 'ASC');
        if ($request->q) {
            $riskRegisterKlinis->where('tipe_id', 'like', '%' . $request->q . '%');
        }
        if ($request->has(['field', 'direction'])) {
            $riskRegisterKlinis->orderBy($request->field, $request->direction);
        }
        $riskRegisterKlinis = (RiskRegisterResource::collection($riskRegisterKlinis->fastPaginate($request->load ?? $this->loadDefault)->withQueryString())
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
        $pics = Pic::get();
        $impactValues = ImpactValue::get();
        $probabilityValues = ProbabilityValue::get();
        $controlValues = ControlValue::get();

        $location_login = auth()->user() ? Pic::where('id', auth()->user()->pic_id)->get() : Pic::where('id', 41)->get();
        $indikatorFitur04s = IndikatorFitur04::where('location_id', $location_login[0]->location_id)->orderBy('name', 'DESC')->get();
        // dd($indikatorFitur04s);
        return inertia('RiskRegister/Verification/Occurring/Admin/Index', ['riskRegisterKlinis' => $riskRegisterKlinis, 'riskCategories' => $riskCategories, 'identificationSources' => $identificationSources, 'locations' => $locations, 'riskVarieties' => $riskVarieties, 'riskTypes' => $riskTypes, 'pics' => $pics, 'impactValues' => $impactValues, 'probabilityValues' => $probabilityValues, 'controlValues' => $controlValues, 'indikatorFitur04s' => $indikatorFitur04s]);
    }

    public function storeoccurringadmin(Request $request)
    {
        // dd($request->all());
        $this->validate($request, [
            'keterangan' => 'required',
        ]);
        $atrributes = ([
            'keterangan' => $request->keterangan,
        ]);
        VerificationAdmin::updateOrCreate(['request_update_id' => $request->request_update_id], $atrributes);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Verifikasi Manajer Risiko berhasil disimpan',
        ]);
    }
    public function storeoccurringmanagement(Request $request)
    {
        // dd($request->all());
        $this->validate($request, [
            'keterangan' => 'required',
        ]);
        $atrributes = ([
            'keterangan' => $request->keterangan,
        ]);
        VerificationManagement::updateOrCreate(['request_update_id' => $request->request_update_id], $atrributes);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Verifikasi Manajemen berhasil disimpan',
        ]);
    }
    public function prioritymanagement(Request $request)
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $riskRegisterKlinis = RiskRegister::query()->whereHas('riskgrading', function (Builder $query) {
            $query->where('name_bpkp', 'like', '%TINGGI%')->orWhere('name_bpkp', 'SEDANG');
        })
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
            ->where($whosLogin);
        if ($request->q) {
            $riskRegisterKlinis->where('tipe_id', 'like', '%' . $request->q . '%');
        }
        if ($request->has(['field', 'direction'])) {
            $riskRegisterKlinis->orderBy($request->field, $request->direction);
        }
        $riskRegisterKlinis = (RiskRegisterResource::collection($riskRegisterKlinis->fastPaginate($request->load ?? $this->loadDefault)->withQueryString())
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
        $pics = Pic::get();
        $impactValues = ImpactValue::get();
        $probabilityValues = ProbabilityValue::get();
        $controlValues = ControlValue::get();

        $location_login = auth()->user() ? Pic::where('id', auth()->user()->pic_id)->get() : Pic::where('id', 41)->get();
        $indikatorFitur04s = IndikatorFitur04::where('location_id', $location_login[0]->location_id)->orderBy('name', 'DESC')->get();
        // dd($indikatorFitur04s);
        return inertia('RiskRegister/Verification/Priority/Management/Index', ['riskRegisterKlinis' => $riskRegisterKlinis, 'riskCategories' => $riskCategories, 'identificationSources' => $identificationSources, 'locations' => $locations, 'riskVarieties' => $riskVarieties, 'riskTypes' => $riskTypes, 'pics' => $pics, 'impactValues' => $impactValues, 'probabilityValues' => $probabilityValues, 'controlValues' => $controlValues, 'indikatorFitur04s' => $indikatorFitur04s]);
    }
    
    public function priorityadmin(Request $request)
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $riskRegisterKlinis = RiskRegister::query()->whereHas('riskgrading', function (Builder $query) {
            $query->where('name_bpkp', 'like', '%TINGGI%')->orWhere('name_bpkp', 'SEDANG');
        })
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
            ->with('verificationpriorityadmin')
            ->with('formulirrca')
            ->with('fgdinherent')
            ->with('fgdresidual')
            ->with('fgdtreated')
            ->where($whosLogin);
        if ($request->q) {
            $riskRegisterKlinis->where('tipe_id', 'like', '%' . $request->q . '%');
        }
        if ($request->has(['field', 'direction'])) {
            $riskRegisterKlinis->orderBy($request->field, $request->direction);
        }
        $riskRegisterKlinis = (RiskRegisterResource::collection($riskRegisterKlinis->fastPaginate($request->load ?? $this->loadDefault)->withQueryString())
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
        $pics = Pic::get();
        $impactValues = ImpactValue::get();
        $probabilityValues = ProbabilityValue::get();
        $controlValues = ControlValue::get();

        $location_login = auth()->user() ? Pic::where('id', auth()->user()->pic_id)->get() : Pic::where('id', 41)->get();
        $indikatorFitur04s = IndikatorFitur04::where('location_id', $location_login[0]->location_id)->orderBy('name', 'DESC')->get();
        // dd($indikatorFitur04s);
        return inertia('RiskRegister/Verification/Priority/Admin/Index', ['riskRegisterKlinis' => $riskRegisterKlinis, 'riskCategories' => $riskCategories, 'identificationSources' => $identificationSources, 'locations' => $locations, 'riskVarieties' => $riskVarieties, 'riskTypes' => $riskTypes, 'pics' => $pics, 'impactValues' => $impactValues, 'probabilityValues' => $probabilityValues, 'controlValues' => $controlValues, 'indikatorFitur04s' => $indikatorFitur04s]);
    }
    public function storepriorityadmin(Request $request)
    {
        // dd($request->all());
        $this->validate($request, [
            'keterangan' => 'required',
        ]);
        $atrributes = ([
            'keterangan' => $request->keterangan,
        ]);
        VerificationPriorityAdmin::updateOrCreate(['risk_register_id' => $request->id], $atrributes);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Verifikasi Manajer Risiko berhasil disimpan',
        ]);
    }
}
