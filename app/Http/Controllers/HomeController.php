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
        // $data = \DB::table("risk_registers")
        // ->select("risk_registers.*",\DB::raw("GROUP_CONCAT(pics.name) as picsname"))
        // ->leftjoin("pics",\DB::raw("FIND_IN_SET(pics.id,risk_registers.pic_id)"),">",\DB::raw("'0'"))
        // ->groupBy("risk_registers.id")->orderBy("risk_registers.id","DESC")->take('10')
        // ->get();
        // dd($data);

        // $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        // $subquery = RiskRegister::query()
        //     ->leftjoin('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
        //     ->leftjoin('indikator_fitur4s', 'indikator_fitur4s.id', 'risk_registers.indikator_fitur4_id')
        //     ->leftJoin('indikator_fitur3s', 'indikator_fitur3s.id', 'indikator_fitur4s.indikator_fitur3_id')
        //     ->leftJoin('indikator_fitur2s', 'indikator_fitur2s.id', 'indikator_fitur3s.indikator_fitur2_id')
        //     ->leftJoin('indikator_fitur1s', 'indikator_fitur1s.id', 'indikator_fitur2s.indikator_fitur1_id')
        //     ->leftJoin('sasaran_strategis', 'sasaran_strategis.id', 'indikator_fitur3s.sasaran_strategis_id')
        //     ->leftjoin('users', 'users.id', 'risk_registers.user_id')
        //     ->leftjoin('waktu_pengendalians', 'waktu_pengendalians.id', 'risk_registers.waktu_pengendalian_id')
        //     ->leftjoin("pics",\DB::raw("FIND_IN_SET(pics.id,risk_registers.pic_id)"),">",\DB::raw("'0'"))
        //     ->select(DB::raw('row_number() OVER (ORDER BY risk_registers.osd1_dampak * risk_registers.osd1_probabilitas * risk_registers.osd1_controllability DESC) AS `Peringkat`'), 'indikator_fitur3s.name', 'indikator_fitur1s.name as sasaran_name',  'risk_registers.pernyataan_risiko', 'risk_registers.pengendalian_harus_ada as rencana', 'risk_registers.rencana_pengendalian as realisasi', 'risk_registers.belum_tertangani', 'risk_registers.usulan_perbaikan',  DB::raw("CONCAT(risk_registers.target_waktu, ' Hari') AS target_waktu"), 'waktu_pengendalians.name as waktu', 'users.name as pemilik_name',\DB::raw("GROUP_CONCAT(pics.name) as picsname"))->groupBy("risk_registers.id")
        //     ->where($whosLogin);
        // if (!empty($this->startDate) && !empty($this->endDate)) {
        //     $subquery->where('risk_registers.tgl_register', '>=', $this->startDate)
        //         ->where('risk_registers.tgl_register', '<=', Carbon::parse($this->endDate)->addDay());
        // }
        // if (!empty($this->userId) && auth()->user()->can('lihat data semua risk register')) {
        //     $userIds = !empty($this->userId) ? array_map('intval', explode(',', $this->userId)) : [];
        //     $subquery->whereIn('risk_registers.user_id', $userIds);
        // }
        // $query = DB::query()
        //     ->select('Peringkat', 'name', 'sasaran_name', 'pernyataan_risiko', 'rencana', 'realisasi', 'belum_tertangani', 'usulan_perbaikan', 'target_waktu', 'waktu', 'pemilik_name','picsname')
        //     ->fromSub($subquery, 'sub')
        //     ->orderBy('sub.Peringkat', 'ASC');
            // dd($query->get());
        // $this->data = $query->get();
        // return $query;

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
