<?php

namespace App\Http\Controllers\MUTU;

use App\Http\Controllers\Controller;
use App\Http\Resources\MUTU\MutuUnitResource;
use App\Models\MUTU\MutuIndikator;
use App\Models\MUTU\MutuKategori;
use App\Models\MUTU\MutuUnit;
use Carbon\Carbon;
use Illuminate\Http\Request;

class MutuUnitController extends Controller
{
    public $loadDefault = 10;
    public function index(Request $request)
    {
        $MutuUnit = MutuUnit::query()->with('mutu_indikator.indikator_fitur4')->with('mutu_indikator.kategori')->with('mutu_indikator.location');
        if ($request->q) {
            $MutuUnit->where('name','like','%'.$request->q.'%');
        }

        if ($request->has(['field','direction'])) {
            $MutuUnit->orderBy($request->field,$request->direction);
        }
        $MutuUnit = (
            MutuUnitResource::collection($MutuUnit->latest()->fastPaginate($request->load)->withQueryString())
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
        $MutuIndikator = MutuIndikator::with('indikator_fitur4')->get();
        return inertia('MUTU/MutuUnit/Index',['MutuUnit'=>$MutuUnit,'MutuIndikator'=>$MutuIndikator]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'mutu_indikator_id' => 'required',
            'tanggal_mutu' => 'required|string|max:255',
            'num' => 'required|string|max:255',
            'denum' => 'required|string|max:255',
        ]);
        $validated['tanggal_mutu'] = Carbon::parse($validated['tanggal_mutu'])->format('Y-m-d');
        $validated['capaian'] =  $request->num / $request->denum * 100;
        // dd($validated);
        MutuUnit::create($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Mutu Unit berhasil disimpan',
        ]);
    }
    public function update(Request $request, MutuUnit $MutuUnit)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $MutuUnit->update($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Mutu Unit berhasil diubah',
        ]);
    }
    public function destroy(MutuUnit $MutuUnit)
    {
        $MutuUnit->delete();
        return back()->with([
            'type' => 'success',
            'message' => 'Data Mutu Unit berhasil dihapus',
        ]);
    }
}
