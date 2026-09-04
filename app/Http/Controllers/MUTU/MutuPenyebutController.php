<?php

namespace App\Http\Controllers\MUTU;

use App\Http\Controllers\Controller;
use App\Http\Resources\MUTU\MutuPenyebutResource;
use App\Models\MUTU\MutuPenyebut;
use Illuminate\Http\Request;

class MutuPenyebutController extends Controller
{
    public $loadDefault = 10;

    public function index(Request $request)
    {
        $MutuPenyebut = MutuPenyebut::query();
        if ($request->q) {
            $MutuPenyebut->where('name', 'like', '%' . $request->q . '%');
        }

        if ($request->has(['field', 'direction'])) {
            $MutuPenyebut->orderBy($request->field, $request->direction);
        }

        $MutuPenyebut = (
            MutuPenyebutResource::collection($MutuPenyebut->latest()->fastPaginate($request->load)->withQueryString())
        )->additional([
            'attributes' => [
                'total' => MutuPenyebut::count(),
                'per_page' => 10,
            ],
            'filtered' => [
                'load' => $request->load ?? $this->loadDefault,
                'q' => $request->q ?? '',
                'page' => $request->page ?? 1,
                'field' => $request->field ?? '',
                'direction' => $request->direction ?? '',
            ],
        ]);

        return inertia('MUTU/MutuPenyebut/Index', ['MutuPenyebut' => $MutuPenyebut]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:mutu_penyebuts,name',
            'multiplier' => 'required|numeric|min:0',
        ]);

        MutuPenyebut::create($validated);

        return back()->with([
            'type' => 'success',
            'message' => 'Data Penyebut berhasil disimpan',
        ]);
    }

    public function update(Request $request, MutuPenyebut $MutuPenyebut)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:mutu_penyebuts,name,' . $MutuPenyebut->id,
            'multiplier' => 'required|numeric|min:0',
        ]);

        $MutuPenyebut->update($validated);

        return back()->with([
            'type' => 'success',
            'message' => 'Data Penyebut berhasil diubah',
        ]);
    }

    public function destroy(MutuPenyebut $MutuPenyebut)
    {
        $MutuPenyebut->delete();

        return back()->with([
            'type' => 'success',
            'message' => 'Data Penyebut berhasil dihapus',
        ]);
    }
}
