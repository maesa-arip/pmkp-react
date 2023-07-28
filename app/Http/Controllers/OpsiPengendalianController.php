<?php

namespace App\Http\Controllers;

use App\Http\Resources\OpsiPengendalianResource;
use App\Models\OpsiPengendalian;
use Illuminate\Http\Request;

class OpsiPengendalianController extends Controller
{
    public $loadDefault = 10;
    public function index(Request $request)
    {
        $opsiPengendalian = OpsiPengendalian::query();
        if ($request->q) {
            $opsiPengendalian->where('name','like','%'.$request->q.'%');
        }

        if ($request->has(['field','direction'])) {
            $opsiPengendalian->orderBy($request->field,$request->direction);
        }
        $opsiPengendalian = (
            OpsiPengendalianResource::collection($opsiPengendalian->latest()->fastPaginate($request->load)->withQueryString())
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
        return inertia('Master/OpsiPengendalian/Index',['opsiPengendalian'=>$opsiPengendalian]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        OpsiPengendalian::create($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Opsi Pengendalian berhasil disimpan',
        ]);
    }
    public function update(Request $request, OpsiPengendalian $opsiPengendalian)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $opsiPengendalian->update($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Opsi Pengendalian berhasil diubah',
        ]);
    }
    public function destroy(OpsiPengendalian $opsiPengendalian)
    {
        $opsiPengendalian->delete();
        return back()->with([
            'type' => 'success',
            'message' => 'Opsi Pengendalian berhasil dihapus',
        ]);
    }
}
