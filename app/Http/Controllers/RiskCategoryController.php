<?php

namespace App\Http\Controllers;

use App\Http\Resources\RiskCategoryResource;
use App\Models\RiskCategory;
use Illuminate\Http\Request;

class RiskCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public $loadDefault = 10;
    public function index(Request $request)
    {
        $riskCategories = RiskCategory::query();
        if ($request->q) {
            $riskCategories->where('name','like','%'.$request->q.'%');
        }

        if ($request->has(['field','direction'])) {
            $riskCategories->orderBy($request->field,$request->direction);
        }
        $riskCategories = (
            RiskCategoryResource::collection($riskCategories->latest()->fastPaginate($request->load)->withQueryString())
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
        return inertia('Master/RiskCategory/Index',['riskCategories'=>$riskCategories]);
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

        RiskCategory::create($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Data kategori risiko berhasil disimpan',
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\RiskCategory  $riskCategory
     * @return \Illuminate\Http\Response
     */
    public function show(RiskCategory $riskCategory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\RiskCategory  $riskCategory
     * @return \Illuminate\Http\Response
     */
    public function edit(RiskCategory $riskCategory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\RiskCategory  $riskCategory
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, RiskCategory $riskCategory)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $riskCategory->update($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Kategori risiko berhasil diubah',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\RiskCategory  $riskCategory
     * @return \Illuminate\Http\Response
     */
    public function destroy(RiskCategory $riskCategory)
    {
        $riskCategory->delete();
        return back()->with([
            'type' => 'success',
            'message' => 'Kategori risiko berhasil dihapus',
        ]);
    }
}
