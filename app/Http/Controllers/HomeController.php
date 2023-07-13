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
        $subquery = RiskRegister::query()
            ->join('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
            ->join('indikator_fitur04s', 'indikator_fitur04s.id', 'risk_registers.indikator_fitur04_id')
            ->join('users', 'users.id', 'risk_registers.user_id')
            ->leftjoin('opsi_pengendalians', 'opsi_pengendalians.id', 'risk_registers.opsi_pengendalian_id')
            ->leftjoin('efektifs', 'efektifs.id', 'risk_registers.efektif_id')
            ->leftjoin('waktu_pengendalians', 'waktu_pengendalians.id', 'risk_registers.waktu_pengendalian_id')
            ->leftjoin('jenis_pengendalians', 'jenis_pengendalians.id', 'risk_registers.jenis_pengendalian_id')
            ->selectRaw(
                    'indikator_fitur04s.name, ' .
                    'indikator_fitur04s.tujuan, ' .
                    'risk_registers.pernyataan_risiko, ' .
                    'opsi_pengendalians.name as opsi, ' .
                    'risk_registers.pengendalian_risiko as uraian, ' .
                    'risk_registers.pengendalian_risiko, ' .
                    'efektifs.name as efektif, ' .
                    'risk_registers.pengendalian_risiko as harusada, ' .
                    'risk_registers.pengendalian_risiko as kegiatan, ' .
                    'waktu_pengendalians.name as waktu, ' .
                    'jenis_pengendalians.name as jenis_pengendalian, ' .
                    'users.name as pemilik, ' .
                    'row_number() OVER (ORDER BY risk_registers.osd1_dampak * risk_registers.osd1_probabilitas * risk_registers.osd1_controllability DESC) AS `Peringkat`'
            )
            ->groupBy(
                'indikator_fitur04s.name',
                'indikator_fitur04s.tujuan',
                'risk_registers.pernyataan_risiko',
                'opsi_pengendalians.name',
                'risk_registers.pengendalian_risiko',
                'risk_registers.pengendalian_risiko',
                'efektifs.name',
                'risk_registers.pengendalian_risiko',
                'risk_registers.pengendalian_risiko',
                'waktu_pengendalians.name',
                'jenis_pengendalians.name',
                'users.name',
                'risk_registers.osd1_dampak',
                'risk_registers.osd1_probabilitas',
                'risk_registers.osd1_controllability'
            );
        $query = DB::query()
            ->select(
                'Peringkat',
                'name',
                'tujuan',
                'pernyataan_risiko',
                'opsi',
                'uraian',
                'pengendalian_risiko',
                'efektif',
                'harusada',
                'kegiatan',
                'waktu',
                'jenis_pengendalian',
                'pemilik'
            )
            ->fromSub($subquery, 'sub')
            ->orderBy('sub.Peringkat', 'ASC');

        $fullQuery = $query->get();
        dd($fullQuery);

        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $riskRegisterKlinis = RiskRegister::query()
            ->with('risk_category')
            ->with('identification_source')
            // ->with('location')
            ->with('risk_variety')
            ->with('risk_type')
            ->with('pic')
            ->with('risk_register_histories')
            ->with('user')
            // ->where('risk_registers.pic_id',auth()->user()->id)
            ->where($whosLogin)
            ->orderBy('currently_id', 'ASC');
        if ($request->q) {
            $riskRegisterKlinis->where('tipe_id', 'like', '%' . $request->q . '%');
        }
        if ($request->has(['field', 'direction'])) {
            $riskRegisterKlinis->orderBy($request->field, $request->direction);
        }
        $riskRegisterKlinis = (RiskRegisterResource::collection($riskRegisterKlinis->fastPaginate($request->load)->withQueryString())
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
        $location_login = Pic::where('id', auth()->user()->pic_id)->get();
        $indikatorFitur04s = IndikatorFitur04::where('location_id', $location_login[0]->location_id)->orderBy('name', 'DESC')->get();
        // dd($indikatorFitur04s);
        return inertia('RiskRegister/History/Index', ['riskRegisterKlinis' => $riskRegisterKlinis, 'riskCategories' => $riskCategories, 'identificationSources' => $identificationSources, 'locations' => $locations, 'riskVarieties' => $riskVarieties, 'riskTypes' => $riskTypes, 'pics' => $pics, 'impactValues' => $impactValues, 'probabilityValues' => $probabilityValues, 'controlValues' => $controlValues, 'indikatorFitur04s' => $indikatorFitur04s]);
    }
}
