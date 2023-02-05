<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProbabilityValueResource;
use App\Models\ProbabilityValue;
use Illuminate\Http\Request;

class ProbabilityValueController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public $loadDefault = 10;
    public function index(Request $request)
    {
        $probabilityValues = ProbabilityValue::query();
        if ($request->q) {
            $probabilityValues->where('name','like','%'.$request->q.'%');
        }
        if ($request->has(['field','direction'])) {
            $probabilityValues->orderBy($request->field,$request->direction);
        }
        $probabilityValues = (
            ProbabilityValueResource::collection($probabilityValues->latest()->fastPaginate($request->load)->withQueryString())
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
        return inertia('Value/ProbabilityValue/Index',['probabilityValues'=>$probabilityValues]);
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
            'value' => 'required|numeric',
            'name' => 'required|string|max:255',
            'type' => 'required|numeric',
        ]);

        ProbabilityValue::create($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Nilai Probability berhasil disimpan',
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ProbabilityValue  $probabilityValue
     * @return \Illuminate\Http\Response
     */
    public function show(ProbabilityValue $probabilityValue)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProbabilityValue  $probabilityValue
     * @return \Illuminate\Http\Response
     */
    public function edit(ProbabilityValue $probabilityValue)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProbabilityValue  $probabilityValue
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ProbabilityValue $probabilityValue)
    {
        $validated = $request->validate([
            'value' => 'required|numeric',
            'name' => 'required|string|max:255',
            'type' => 'required|numeric',
        ]);
        $probabilityValue->update($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Nilai Probability berhasil diubah',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProbabilityValue  $probabilityValue
     * @return \Illuminate\Http\Response
     */
    public function destroy(ProbabilityValue $probabilityValue)
    {
        $probabilityValue->delete();
        return back()->with([
            'type' => 'success',
            'message' => 'Nilai Probability berhasil dihapus',
        ]);
    }
}
