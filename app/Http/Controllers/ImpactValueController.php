<?php

namespace App\Http\Controllers;

use App\Http\Resources\ImpactValueResource;
use App\Models\ImpactValue;
use Illuminate\Http\Request;

class ImpactValueController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public $loadDefault = 10;
    public function index(Request $request)
    {
        $impactValues = ImpactValue::query();
        if ($request->q) {
            $impactValues->where('name','like','%'.$request->q.'%');
        }
        if ($request->has(['field','direction'])) {
            $impactValues->orderBy($request->field,$request->direction);
        }
        $impactValues = (
            ImpactValueResource::collection($impactValues->latest()->fastPaginate($request->load)->withQueryString())
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
        return inertia('Value/ImpactValue/Index',['impactValues'=>$impactValues]);
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

        ImpactValue::create($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Nilai Dampak berhasil disimpan',
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ImpactValue  $impactValue
     * @return \Illuminate\Http\Response
     */
    public function show(ImpactValue $impactValue)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ImpactValue  $impactValue
     * @return \Illuminate\Http\Response
     */
    public function edit(ImpactValue $impactValue)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ImpactValue  $impactValue
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ImpactValue $impactValue)
    {
        $validated = $request->validate([
            'value' => 'required|numeric',
            'name' => 'required|string|max:255',
            'type' => 'required|numeric',
        ]);
        $impactValue->update($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Nilai Dampak berhasil diubah',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ImpactValue  $impactValue
     * @return \Illuminate\Http\Response
     */
    public function destroy(ImpactValue $impactValue)
    {
        $impactValue->delete();
        return back()->with([
            'type' => 'success',
            'message' => 'Nilai Dampak berhasil dihapus',
        ]);
    }
}
