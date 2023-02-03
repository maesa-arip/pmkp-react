<?php

namespace App\Http\Controllers;

use App\Http\Resources\IdentificationSourceResource;
use App\Models\IdentificationSource;
use Illuminate\Http\Request;

class IdentificationSourceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public $loadDefault = 10;
    public function index(Request $request)
    {
        $identificationSources = IdentificationSource::query();
        
        if ($request->q) {
            $identificationSources->where('name','like','%'.$request->q.'%');
        }

        if ($request->has(['field','direction'])) {
            $identificationSources->orderBy($request->field,$request->direction);
        }
        $identificationSources = (
            IdentificationSourceResource::collection($identificationSources->latest()->fastPaginate($request->load)->withQueryString())
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
        return inertia('Master/IdentificationSource/Index',['identificationSources'=>$identificationSources]);
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
        ]);

        IdentificationSource::create($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Sumber identifikasi berhasil disimpan',
        ]);
    }

    public function show(IdentificationSource $identificationSource)
    {
        //
    }

    public function edit(IdentificationSource $identificationSource)
    {
        //
    }

    public function update(Request $request, IdentificationSource $identificationSource)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $identificationSource->update($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Sumber identifikasi berhasil diubah',
        ]);
    }

    public function destroy(IdentificationSource $identificationSource)
    {
        $identificationSource->delete();
        return back()->with([
            'type' => 'success',
            'message' => 'Sumber identifikasi berhasil dihapus',
        ]);
    }
}
