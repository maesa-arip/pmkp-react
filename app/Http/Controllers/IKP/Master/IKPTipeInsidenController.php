<?php

namespace App\Http\Controllers\IKP\Master;

use App\Http\Controllers\Controller;
use App\Http\Resources\IKP\IKPTipeInsidenResource;
use App\Models\IKP\IkpTipeInsiden;
use Illuminate\Http\Request;

class IKPTipeInsidenController extends Controller
{
    public $loadDefault = 10;
    public function index(Request $request)
    {
        $IkpTipeInsiden = IkpTipeInsiden::query();
        if ($request->q) {
            $IkpTipeInsiden->where('name','like','%'.$request->q.'%');
        }

        if ($request->has(['field','direction'])) {
            $IkpTipeInsiden->orderBy($request->field,$request->direction);
        }
        $IkpTipeInsiden = (
            IKPTipeInsidenResource::collection($IkpTipeInsiden->latest()->fastPaginate($request->load)->withQueryString())
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
        return inertia('IKP/Master/IKPTipeInsiden/Index',['IkpTipeInsiden'=>$IkpTipeInsiden]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        IkpTipeInsiden::create($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Tipe Insiden berhasil disimpan',
        ]);
    }
    public function update(Request $request, IkpTipeInsiden $IkpTipeInsiden)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $IkpTipeInsiden->update($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Tipe Insiden berhasil diubah',
        ]);
    }
    public function destroy(IkpTipeInsiden $IkpTipeInsiden)
    {
        $IkpTipeInsiden->delete();
        return back()->with([
            'type' => 'success',
            'message' => 'Data Tipe Insiden berhasil dihapus',
        ]);
    }
}

