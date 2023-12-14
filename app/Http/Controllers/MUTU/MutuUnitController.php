<?php

namespace App\Http\Controllers\MUTU;

use App\Http\Controllers\Controller;
use App\Http\Resources\MUTU\MutuUnitResource;
use App\Models\MUTU\MutuIndikator;
use App\Models\MUTU\MutuKategori;
use App\Models\MUTU\MutuPdsa;
use App\Models\MUTU\MutuUnit;
use App\Models\Pic;
use App\Models\User;
use Barryvdh\Snappy\Facades\SnappyPdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use PDF;

class MutuUnitController extends Controller
{
    public $loadDefault = 10;
    public function index(Request $request)
    {
        $user = User::where('id',auth()->user()->id)->first();
        $pic = Pic::where('id',$user->pic_id)->first();
        $whosLogin = auth()->user()->can('lihat semua data indikator mutu') ? [['approved', 1]] : [['location_id', $pic->location_id]];
        $MutuUnit = MutuUnit::query()->with('mutu_indikator.indikator_fitur4')->with('mutu_indikator.kategori')->with('mutu_indikator.location')->with('mutu_pdsa')->whereRelation('mutu_indikator',$whosLogin);
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
       
        $user = User::where('id',auth()->user()->id)->first();
        $pic = Pic::where('id',$user->pic_id)->first();
        $whosLogin = auth()->user()->can('lihat semua data indikator mutu') ? [['location_id', '<>', 0]] : [['location_id', $pic->location_id]];
        $MutuIndikator = MutuIndikator::query()->with('indikator_fitur4')->with('kategori')->with('location')->where($whosLogin)->where('approved',1)->get();
        return inertia('MUTU/MutuUnit/Index',['MutuUnit'=>$MutuUnit,'MutuIndikator'=>$MutuIndikator,'pic'=>$pic]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'mutu_indikator_id' => 'required',
            'tanggal_mutu' => 'required|string|max:255',
            'num' => 'required|string|max:255',
            'denum' => 'required|string|max:255',
        ]);
        $MutuIndikator = MutuIndikator::where('id',$request->mutu_indikator_id)->first();
        if ($MutuIndikator->penyebut == '%') {
            $penyebut  = 100;
        }
        if ($MutuIndikator->penyebut == '‰') {
            $penyebut  = 1000;
        }
        $validated['tanggal_mutu'] = Carbon::parse($validated['tanggal_mutu'])->format('Y-m-d');
        $validated['capaian'] =  $request->num / $request->denum * $penyebut;
        $validated['code'] =  Str::random(8);
        MutuUnit::create($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Mutu Unit berhasil disimpan',
        ]);
    }
    public function update(Request $request, MutuUnit $MutuUnit)
    {
        $validated = $request->validate([
            'mutu_indikator_id' => 'required',
            'tanggal_mutu' => 'required|string|max:255',
            'num' => 'required|string|max:255',
            'denum' => 'required|string|max:255',
        ]);
        $validated['tanggal_mutu'] = Carbon::parse($validated['tanggal_mutu'])->format('Y-m-d');
        $validated['capaian'] =  $request->num / $request->denum * 100;
        $MutuUnit->update($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Mutu Unit berhasil diubah',
        ]);
    }
    public function formulirpdsa(Request $request)
    {
        $validated = $this->validate($request, [
            'problem' => 'required',
            'step' => 'required',
            'plan_rencana' => 'required',
            'plan_harapan' => 'required',
            'do' => 'required',
            'study' => 'required',
            'action' => 'required',
        ]);
        MutuPdsa::updateOrCreate(['mutu_unit_id' => $request->id], $validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Formulir PDSA berhasil disimpan',
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
    // public function exportpdf()
    // {
    //     return inertia('MUTU/Export/ViewDocument');
    // }
    // public function exportpdf()
    // {
    //     $html = '<h1>Your PDF Content</h1>'; // Replace this with your HTML content

    //     $pdf = PDF::loadHTML($html);

    //     return $pdf->download('invoice.pdf');
    // }
}
