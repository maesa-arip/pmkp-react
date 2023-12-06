<?php

namespace App\Http\Controllers\MUTU;

use App\Http\Controllers\Controller;
use App\Http\Resources\MUTU\MutuKategoriResource;
use App\Models\MUTU\MutuKategori;
use Illuminate\Http\Request;

class MutuKategoriController extends Controller
{
    public $loadDefault = 10;
    public function index(Request $request)
    {
        $MutuKategori = MutuKategori::query();
        if ($request->q) {
            $MutuKategori->where('name','like','%'.$request->q.'%');
        }

        if ($request->has(['field','direction'])) {
            $MutuKategori->orderBy($request->field,$request->direction);
        }
        $MutuKategori = (
            MutuKategoriResource::collection($MutuKategori->latest()->fastPaginate($request->load)->withQueryString())
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
        return inertia('MUTU/MutuKategori/Index',['MutuKategori'=>$MutuKategori]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        MutuKategori::create($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Kategori berhasil disimpan',
        ]);
    }
    public function update(Request $request, MutuKategori $MutuKategori)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $MutuKategori->update($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Kategori berhasil diubah',
        ]);
    }
    public function destroy(MutuKategori $MutuKategori)
    {
        $MutuKategori->delete();
        return back()->with([
            'type' => 'success',
            'message' => 'Data Kategori berhasil dihapus',
        ]);
    }
}

