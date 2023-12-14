<?php

namespace App\Http\Controllers\MUTU;

use App\Http\Controllers\Controller;
use App\Http\Resources\MUTU\MutuPDSAResource;
use App\Models\MUTU\MutuIndikator;
use App\Models\MUTU\MutuUnit;
use App\Models\Pic;
use App\Models\User;
use Illuminate\Http\Request;

class MutuPDSAController extends Controller
{
    public $loadDefault = 10;
    public function index(Request $request)
    {
        $user = User::where('id',auth()->user()->id)->first();
        $pic = Pic::where('id',$user->pic_id)->first();
        $whosLogin = auth()->user()->can('lihat semua  data indikator mutu') ? [['approved', 1]] : [['location_id', $pic->location_id]];
        $MutuUnit = MutuUnit::query()->with('mutu_indikator.indikator_fitur4')->with('mutu_indikator.kategori')->with('mutu_indikator.location')->whereRelation('mutu_indikator',$whosLogin);
        if ($request->q) {
            $MutuUnit->where('name','like','%'.$request->q.'%');
        }

        if ($request->has(['field','direction'])) {
            $MutuUnit->orderBy($request->field,$request->direction);
        }
        $MutuUnit = (
            MutuPDSAResource::collection($MutuUnit->latest()->fastPaginate($request->load)->withQueryString())
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
        $whosLogin = auth()->user()->can('lihat semua  data indikator mutu') ? [['location_id', '<>', 0]] : [['location_id', $pic->location_id]];
        $MutuIndikator = MutuIndikator::query()->with('indikator_fitur4')->with('kategori')->with('location')->where($whosLogin)->where('approved',1)->get();
        return inertia('MUTU/MutuUnit/Index',['MutuUnit'=>$MutuUnit,'MutuIndikator'=>$MutuIndikator]);
    }
}
