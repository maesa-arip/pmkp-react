<?php

namespace App\Http\Controllers;

use App\Http\Resources\RiskRegisterResource;
use App\Models\IndikatorFitur04;
use App\Models\RiskRegister;
use Illuminate\Http\Request;
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

class HomeController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public $loadDefault = 10;
    public function __invoke(Request $request)
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['pic_id', '<>', 0]] : [['pic_id', auth()->user()->pic_id]];
        $riskRegisterKlinis = RiskRegister::query()
            ->with('risk_category')
            ->with('identification_source')
            // ->with('location')
            ->with('risk_variety')
            ->with('risk_type')
            ->with('pic')
            // ->with(['risk_register_histories' => function ($query) {
            //     $query->orderBy('created_at', 'asc');
            // }])
            ->with('risk_register_histories')
            ->with('user')
            ->where('currently_id',1)
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
        return inertia('RiskRegister/History/Index', ['riskRegisterKlinis' => $riskRegisterKlinis, 'riskCategories' => $riskCategories, 'identificationSources' => $identificationSources, 'locations' => $locations, 'riskVarieties' => $riskVarieties, 'riskTypes' => $riskTypes, 'pics' => $pics, 'impactValues' => $impactValues, 'probabilityValues' => $probabilityValues, 'controlValues' => $controlValues, 'indikatorFitur04s' => $indikatorFitur04s]);
    }
    // public function __invoke(Request $request)
    // {
    //     $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
    //     $riskRegisterKlinis = RiskRegister::query()
    //         ->with('risk_category')
    //         ->with('identification_source')
    //         ->with('opsi_pengendalian')
    //         ->with('pembiayaan_risiko')
    //         ->with('risk_variety')
    //         ->with('risk_type')
    //         ->with('jenis_sebab')
    //         ->with('pic')
    //         ->with('user')
    //         ->with('formulirrca')
    //         ->with('fgdinherent')
    //         ->with('fgdresidual')
    //         ->with('fgdtreated')
    //         ->with('risk_register_histories')
    //         ->where('currently_id', 1)
    //         ->where($whosLogin);

    //     if ($request->q) {
    //         $riskRegisterKlinis->where('pernyataan_risiko', 'like', '%' . $request->q . '%');
    //     }
    //     if ($request->has(['field', 'direction'])) {
    //         $riskRegisterKlinis->orderBy($request->field, $request->direction);
    //     }
    //     $riskRegisterKlinis = (RiskRegisterResource::collection($riskRegisterKlinis->latest()->fastPaginate($request->load ?? $this->loadDefault)->withQueryString())
    //     )->additional([
    //         'attributes' => [
    //             'total' => 1100,
    //             'per_page' => 10,
    //         ],
    //         'filtered' => [
    //             'load' => $request->load ?? $this->loadDefault,
    //             'q' => $request->q ?? '',
    //             'page' => $request->page ?? 1,
    //             'field' => $request->field ?? '',
    //             'direction' => $request->direction ?? '',

    //         ]
    //     ]);
    //     $riskCategories = RiskCategory::get();
    //     $identificationSources = IdentificationSource::get();
    //     $locations = Location::get();
    //     $riskVarieties = RiskVariety::get();
    //     $riskTypes = RiskType::get();
    //     $pics = Pic::get();
    //     $location_login = Pic::where('id', auth()->user()->pic_id)->pluck('location_id');
    //     $whosLogin = auth()->user()->can('lihat data semua risk register') ? $indikatorFitur4s = IndikatorFitur4::orderBy('name', 'DESC')->get() : $indikatorFitur4s = IndikatorFitur4::whereJsonContains('location_id', $location_login[0])->orderBy('name', 'DESC')->get();
    //     return inertia('RiskRegister/History/Index', [
    //         'riskRegisterKlinis' => $riskRegisterKlinis,
    //         'riskCategories' => $riskCategories,
    //         'identificationSources' => $identificationSources,
    //         'locations' => $locations,
    //         'riskVarieties' => $riskVarieties,
    //         'riskTypes' => $riskTypes,
    //         'pics' => $pics,
    //     ]);
    // }
}
