<?php

namespace App\Http\Controllers;

use App\Http\Resources\ControlValueResource;
use App\Models\ControlValue;
use Illuminate\Http\Request;

class ControlValueController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public $loadDefault = 10;
    public function index(Request $request)
    {
        $controlValues = ControlValue::query();
        if ($request->q) {
            $controlValues->where('name','like','%'.$request->q.'%');
        }
        if ($request->has(['field','direction'])) {
            $controlValues->orderBy($request->field,$request->direction);
        }
        $controlValues = (
            ControlValueResource::collection($controlValues->latest()->fastPaginate($request->load)->withQueryString())
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
        return inertia('Value/ControlValue/Index',['controlValues'=>$controlValues]);
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

        ControlValue::create($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Nilai Controllability berhasil disimpan',
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ControlValue  $controlValue
     * @return \Illuminate\Http\Response
     */
    public function show(ControlValue $controlValue)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ControlValue  $controlValue
     * @return \Illuminate\Http\Response
     */
    public function edit(ControlValue $controlValue)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ControlValue  $controlValue
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ControlValue $controlValue)
    {
        $validated = $request->validate([
            'value' => 'required|numeric',
            'name' => 'required|string|max:255',
            'type' => 'required|numeric',
        ]);
        $controlValue->update($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Nilai Controllability berhasil diubah',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ControlValue  $controlValue
     * @return \Illuminate\Http\Response
     */
    public function destroy(ControlValue $controlValue)
    {
        $controlValue->delete();
        return back()->with([
            'type' => 'success',
            'message' => 'Nilai Controllability berhasil dihapus',
        ]);
    }
}
