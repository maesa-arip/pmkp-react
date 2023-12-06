<?php

namespace App\Http\Controllers\MUTU;

use App\Http\Controllers\Controller;
use App\Http\Resources\MUTU\MutuIndikatorResource;
use App\Models\IndikatorFitur4;
use App\Models\MUTU\MutuIndikator;
use App\Models\MUTU\MutuKategori;
use App\Models\Pic;
use App\Models\User;
use Illuminate\Http\Request;

class MutuIndikatorController extends Controller
{
    public $loadDefault = 10;
    public function index(Request $request)
    {
        $MutuIndikator = MutuIndikator::query()->with('indikator_fitur4')->with('kategori')->with('location');
        if ($request->q) {
            $MutuIndikator->where('num_name','like','%'.$request->q.'%');
        }

        if ($request->has(['field','direction'])) {
            $MutuIndikator->orderBy($request->field,$request->direction);
        }
        $MutuIndikator = (
            MutuIndikatorResource::collection($MutuIndikator->latest()->fastPaginate($request->load)->withQueryString())
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
        $MutuKategori = MutuKategori::get();
        $IndikatorFitur4 = IndikatorFitur4::get();
        return inertia('MUTU/MutuIndikator/Index',['MutuIndikator'=>$MutuIndikator,'MutuKategori'=>$MutuKategori,'IndikatorFitur4'=>$IndikatorFitur4]);
    }
    public function store(Request $request)
    {
        $validatedMutuIndikator = $request->validate([
            'mutu_kategori_id' => 'required',
            'num_name' => 'required|string|max:255',
            'denum_name' => 'required|string|max:255',
            'standar' => 'required|string|max:255',
            'operator' => 'required|string|max:255',
        ]);
        if ($request->IndikatorBaru == 1) {
            $indikator = $request->validate([
                'indikator' => 'required',
            ]);
            $validated['indikator'] = $indikator['indikator'];
        }
        if ($request->IndikatorBaru == 0) {
            $indikator = $request->validate([
                'indikator_fitur4_id' => 'required',
            ]);
            $validatedMutuIndikator['indikator_fitur4_id'] = $indikator['indikator_fitur4_id'];
        }
        $user = User::where('id',auth()->user()->id)->first();
        $pic = Pic::where('id',$user->pic_id)->first();
        $validatedMutuIndikator['location_id'] =  $pic->location_id;
        MutuIndikator::create($validatedMutuIndikator);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Indikator berhasil disimpan',
        ]);
    }
    public function update(Request $request, MutuIndikator $MutuIndikator)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $MutuIndikator->update($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Indikator berhasil diubah',
        ]);
    }
    public function destroy(MutuIndikator $MutuIndikator)
    {
        $MutuIndikator->delete();
        return back()->with([
            'type' => 'success',
            'message' => 'Data Indikator berhasil dihapus',
        ]);
    }
}
