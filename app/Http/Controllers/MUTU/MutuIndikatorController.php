<?php

namespace App\Http\Controllers\MUTU;

use App\Http\Controllers\Controller;
use App\Http\Resources\MUTU\MutuIndikatorResource;
use App\Models\IndikatorFitur3;
use App\Models\IndikatorFitur4;
use App\Models\MUTU\MutuIndikator;
use App\Models\MUTU\MutuKategori;
use App\Models\MUTU\MutuUnit;
use App\Models\Pic;
use App\Models\User;
use Illuminate\Http\Request;

class MutuIndikatorController extends Controller
{
    public $loadDefault = 10;
    public function index(Request $request)
    {
        $user = User::where('id',auth()->user()->id)->first();
        $pic = Pic::where('id',$user->pic_id)->first();
        $whosLogin = auth()->user()->can('lihat semua data indikator mutu') ? [['location_id', '<>', 0]] : [['location_id', $pic->location_id]];
        $MutuIndikator = MutuIndikator::query()->with('indikator_fitur4')->with('kategori')->with('location')->where($whosLogin);
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
        $location_login = Pic::where('id', auth()->user()->pic_id)->pluck('location_id');
        $whosLogin = auth()->user()->can('lihat semua data indikator mutu') ? $IndikatorFitur4 = IndikatorFitur4::orderBy('name', 'DESC')->get() : $IndikatorFitur4 = IndikatorFitur4::whereJsonContains('location_id', $location_login[0])->orwhereJsonContains('location_id', 0)->orderBy('name', 'DESC')->get();
        // $IndikatorFitur4 = IndikatorFitur4::get();
        $IndikatorFitur3 = IndikatorFitur3::get();
        return inertia('MUTU/MutuIndikator/Index',['MutuIndikator'=>$MutuIndikator,'MutuKategori'=>$MutuKategori,'IndikatorFitur3'=>$IndikatorFitur3,'IndikatorFitur4'=>$IndikatorFitur4]);
    }
    public function store(Request $request)
    {
        $validatedMutuIndikator = $request->validate([
            'mutu_kategori_id' => 'required',
            'num_name' => 'required|string|max:255',
            'denum_name' => 'required|string|max:255',
            'standar' => 'required|string|max:255',
            'operator' => 'required|string|max:255',
            'penyebut' => 'required|string|max:255',
        ]);
        if ($request->IndikatorBaru == 1) {
            $indikator = $request->validate([
                'indikator' => 'required',
                'indikator_fitur3_id' => 'required',
            ]);
            $validatedFitur4['name'] = $indikator['indikator'];
            $validatedFitur4['tujuan'] = $indikator['indikator'];
            $validatedFitur4['indikator_fitur3_id'] = $indikator['indikator_fitur3_id'];
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

        $validatedFitur4['location_id'] =  $pic->location_id; 
        $validatedFitur4['sasaran_strategis_id'] =  1; 

        if ($request->IndikatorBaru == 1) {
            $indikatorFitur4 = IndikatorFitur4::create($validatedFitur4);
            $validatedMutuIndikator['indikator_fitur4_id'] = $indikatorFitur4->id;
        }
        MutuIndikator::create($validatedMutuIndikator);
        
        return back()->with([
            'type' => 'success',
            'message' => 'Data Indikator berhasil disimpan',
        ]);
    }
    public function update(Request $request, MutuIndikator $MutuIndikator)
    {
        // dd($MutuIndikator);
        $validatedMutuIndikator = $request->validate([
            'indikator_fitur4_id' => 'required',
            'mutu_kategori_id' => 'required',
            'num_name' => 'required|string|max:255',
            'denum_name' => 'required|string|max:255',
            'standar' => 'required',
            'operator' => 'required',
        ]);
        // dd($validatedMutuIndikator);
        $MutuIndikator->update($validatedMutuIndikator);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Indikator berhasil diubah',
        ]);
    }
    public function approved(Request $request, MutuIndikator $MutuIndikator)
    {
        $MutuIndikator->update(['approved'=>1]);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Indikator berhasil di approved',
        ]);
    }
    public function destroy(MutuIndikator $MutuIndikator)
    {
        $MutuUnit = MutuUnit::where('mutu_indikator_id',$MutuIndikator->id);
        $MutuUnit->delete();
        $MutuIndikator->delete();
        return back()->with([
            'type' => 'success',
            'message' => 'Data Indikator berhasil dihapus',
        ]);
    }
}
