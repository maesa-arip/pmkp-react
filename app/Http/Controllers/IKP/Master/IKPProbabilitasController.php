<?php

namespace App\Http\Controllers\IKP\Master;

use App\Http\Controllers\Controller;
use App\Http\Resources\IKP\IKPProbabilitasResource;
use App\Models\IKP\IkpProbabilitas;
use Illuminate\Http\Request;

class IKPProbabilitasController extends Controller
{
    public $loadDefault = 10;
    public function index(Request $request)
    {
        $IkpProbabilitas = IkpProbabilitas::query();
        if ($request->q) {
            $IkpProbabilitas->where('name','like','%'.$request->q.'%');
        }

        if ($request->has(['field','direction'])) {
            $IkpProbabilitas->orderBy($request->field,$request->direction);
        }
        $IkpProbabilitas = (
            IKPProbabilitasResource::collection($IkpProbabilitas->latest()->fastPaginate($request->load)->withQueryString())
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
        return inertia('IKP/Master/IKPProbabilitas/Index',['IkpProbabilitas'=>$IkpProbabilitas]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'value' => 'required|numeric',
            'name' => 'required|string|max:255',
        ]);

        IkpProbabilitas::create($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Probabilitas berhasil disimpan',
        ]);
    }
    public function update(Request $request, IkpProbabilitas $IkpProbabilita)
    {
        $validated = $request->validate([
            'value' => 'required|numeric',
            'name' => 'required|string|max:255',
        ]);
        $IkpProbabilita->update($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Probabilitas berhasil diubah',
        ]);
    }
    public function destroy(IkpProbabilitas $IkpProbabilitas)
    {
        $IkpProbabilitas->delete();
        return back()->with([
            'type' => 'success',
            'message' => 'Data Probabilitas berhasil dihapus',
        ]);
    }
}