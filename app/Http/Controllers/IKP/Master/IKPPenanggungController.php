<?php

namespace App\Http\Controllers\IKP\Master;

use App\Http\Controllers\Controller;
use App\Http\Resources\IKP\IKPPenanggungResource;
use App\Models\IKP\IkpPenanggung;
use Illuminate\Http\Request;

class IKPPenanggungController extends Controller
{
    public $loadDefault = 10;
    public function index(Request $request)
    {
        $IkpPenanggung = IkpPenanggung::query();
        if ($request->q) {
            $IkpPenanggung->where('name','like','%'.$request->q.'%');
        }

        if ($request->has(['field','direction'])) {
            $IkpPenanggung->orderBy($request->field,$request->direction);
        }
        $IkpPenanggung = (
            IKPPenanggungResource::collection($IkpPenanggung->latest()->fastPaginate($request->load)->withQueryString())
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
        return inertia('IKP/Master/IKPPenanggung/Index',['IkpPenanggung'=>$IkpPenanggung]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        IkpPenanggung::create($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Penanggung berhasil disimpan',
        ]);
    }
    public function update(Request $request, IkpPenanggung $IkpPenanggung)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $IkpPenanggung->update($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Penanggung berhasil diubah',
        ]);
    }
    public function destroy(IkpPenanggung $IkpPenanggung)
    {
        $IkpPenanggung->delete();
        return back()->with([
            'type' => 'success',
            'message' => 'Data Penanggung berhasil dihapus',
        ]);
    }
}
