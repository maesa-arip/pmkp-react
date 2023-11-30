<?php

namespace App\Http\Controllers\IKP\Master;

use App\Http\Controllers\Controller;
use App\Http\Resources\IKP\IKPPenindakResource;
use App\Models\IKP\IkpPenindak;
use Illuminate\Http\Request;

class IKPPenindakController extends Controller
{
    public $loadDefault = 10;
    public function index(Request $request)
    {
        $IkpPenindak = IkpPenindak::query();
        if ($request->q) {
            $IkpPenindak->where('name','like','%'.$request->q.'%');
        }

        if ($request->has(['field','direction'])) {
            $IkpPenindak->orderBy($request->field,$request->direction);
        }
        $IkpPenindak = (
            IKPPenindakResource::collection($IkpPenindak->latest()->fastPaginate($request->load)->withQueryString())
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
        return inertia('IKP/Master/IKPPenindak/Index',['IkpPenindak'=>$IkpPenindak]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        IkpPenindak::create($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Penindak berhasil disimpan',
        ]);
    }
    public function update(Request $request, IkpPenindak $IkpPenindak)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $IkpPenindak->update($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Penindak berhasil diubah',
        ]);
    }
    public function destroy(IkpPenindak $IkpPenindak)
    {
        $IkpPenindak->delete();
        return back()->with([
            'type' => 'success',
            'message' => 'Data Penindak berhasil dihapus',
        ]);
    }
}
