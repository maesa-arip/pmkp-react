<?php

namespace App\Http\Controllers;

use App\Http\Resources\RiskVarietyResource;
use App\Models\RiskVariety;
use Illuminate\Http\Request;

class RiskVarietyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public $loadDefault = 10;
    public function index(Request $request)
    {
        $riskVarieties = RiskVariety::query();
        if ($request->q) {
            $riskVarieties->where('name','like','%'.$request->q.'%');
            $riskVarieties->where('description','like','%'.$request->q.'%');
        }

        if ($request->has(['field','direction'])) {
            $riskVarieties->orderBy($request->field,$request->direction);
        }
        $riskVarieties = (
            RiskVarietyResource::collection($riskVarieties->latest()->fastPaginate($request->load)->withQueryString())
        )->additional([
            'attributes' => [
                'total' => 1100,
                'per_page' =>10,
            ],
            'filtered' => [
                'load' => $request->load ?? $this->loadDefault,
                'q' => $request->q ?? '',
                'page' => $request->page ?? 1,
                'field' => $request->field ?? '',
                'direction' => $request->direction ?? '',

            ]
        ]);
        return inertia('Master/RiskVariety/Index',['riskVarieties'=>$riskVarieties]);
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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
        ]);

        RiskVariety::create($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Jenis insiden berhasil disimpan',
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\RiskVariety  $riskVariety
     * @return \Illuminate\Http\Response
     */
    public function show(RiskVariety $riskVariety)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\RiskVariety  $riskVariety
     * @return \Illuminate\Http\Response
     */
    public function edit(RiskVariety $riskVariety)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\RiskVariety  $riskVariety
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, RiskVariety $riskVariety)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
        ]);
        $riskVariety->update($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Jenis insiden berhasil diubah',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\RiskVariety  $riskVariety
     * @return \Illuminate\Http\Response
     */
    public function destroy(RiskVariety $riskVariety)
    {
        $riskVariety->delete();
        return back()->with([
            'type' => 'success',
            'message' => 'Jenis insiden berhasil dihapus',
        ]);
    }
}
