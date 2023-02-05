<?php

namespace App\Http\Controllers;

use App\Http\Resources\RiskRegisterResource;
use App\Models\ControlValue;
use App\Models\IdentificationSource;
use App\Models\ImpactValue;
use App\Models\IncidentVariety;
use App\Models\Location;
use App\Models\Pic;
use App\Models\ProbabilityValue;
use App\Models\RiskCategory;
use App\Models\RiskRegister;
use App\Models\RiskType;
use App\Models\RiskVariety;
use Carbon\Carbon;
use Illuminate\Http\Request;

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
        $riskRegisterKlinis = RiskRegister::query()->where('tipe_id', 1)
            ->with('risk_category')
            ->with('identification_source')
            ->with('location')
            ->with('risk_variety')
            ->with('risk_type')
            ->with('pic')
            ->with('user');
        if ($request->q) {
            $riskRegisterKlinis->where('tipe_id', 'like', '%' . $request->q . '%');
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
        $pics = Pic::get();
        $impactValues = ImpactValue::get();
        $probabilityValues = ProbabilityValue::get();
        $controlValues = ControlValue::get();
        return inertia('RiskRegister/Klinis/Index', ['riskRegisterKlinis' => $riskRegisterKlinis, 'riskCategories' => $riskCategories, 'identificationSources' => $identificationSources, 'locations' => $locations, 'riskVarieties' => $riskVarieties, 'riskTypes' => $riskTypes, 'pics' => $pics, 'impactValues' => $impactValues, 'probabilityValues' => $probabilityValues, 'controlValues' => $controlValues,]);
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
        $this->validate($request, [
            'proses_id' => 'required',
            'tgl_register' => 'required',
            'tgl_selesai' => 'required',
            'risk_category_id' => 'required',
            'identification_source_id' => 'required',
            'location_id' => 'required',
            'pernyataan_risiko' => 'required',
            'sebab' => 'required',
            'risk_variety_id' => 'required',
            'risk_type_id' => 'required',
            'efek' => 'required',
            'osd1_dampak' => 'required',
            'osd1_probabilitas' => 'required',
            'osd1_controllability' => 'required',
            'osd2_dampak' => 'required',
            'osd2_probabilitas' => 'required',
            'osd2_controllability' => 'required',
            'grading' => 'required',
            'pengendalian_risiko' => 'required',
            'pic_id' => 'required',
            'pengawasan_id' => 'required',
        ]);
        $request->merge([
            'user_id' => auth()->user()->id,
            'tipe_id' => 1,
            'osd1_inherent' => $request->osd1_dampak * $request->osd1_probabilitas * $request->osd1_controllability,
            'osd2_inherent' => $request->osd1_dampak * $request->osd1_probabilitas * $request->osd1_controllability,
        ]);
        // dd($request->all());

        RiskRegister::create($request->except('name'));
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
            'proses_id' => 'required',
            'tgl_register' => 'required',
            'tgl_selesai' => 'required',
            'risk_category_id' => 'required',
            'identification_source_id' => 'required',
            'location_id' => 'required',
            'pernyataan_risiko' => 'required',
            'sebab' => 'required',
            'risk_variety_id' => 'required',
            'risk_type_id' => 'required',
            'efek' => 'required',
            'osd1_dampak' => 'required',
            'osd1_probabilitas' => 'required',
            'osd1_controllability' => 'required',
            'osd2_dampak' => 'required',
            'osd2_probabilitas' => 'required',
            'osd2_controllability' => 'required',
            'grading' => 'required',
            'pengendalian_risiko' => 'required',
            'pic_id' => 'required',
            'pengawasan_id' => 'required',
        ]);
        $request->merge([
            'osd1_inherent' => $request->osd1_dampak * $request->osd1_probabilitas * $request->osd1_controllability,
            'osd2_inherent' => $request->osd1_dampak * $request->osd1_probabilitas * $request->osd1_controllability,
        ]);
        $riskRegisterKlinis = RiskRegister::find($id);

        $riskRegisterKlinis->update($request->except('home'));
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
