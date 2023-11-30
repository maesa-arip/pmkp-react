<?php

namespace App\Http\Controllers\IKP\Master;

use App\Http\Controllers\Controller;
use App\Http\Resources\IKP\IKPSpesialisasiResource;
use App\Models\IKP\IkpSpesialisasi;
use Illuminate\Http\Request;

class IKPSpesialisasiController extends Controller
{
    public $loadDefault = 10;
    public function index(Request $request)
    {
        $IkpSpesialisasi = IkpSpesialisasi::query();
        if ($request->q) {
            $IkpSpesialisasi->where('name','like','%'.$request->q.'%');
        }

        if ($request->has(['field','direction'])) {
            $IkpSpesialisasi->orderBy($request->field,$request->direction);
        }
        $IkpSpesialisasi = (
            IKPSpesialisasiResource::collection($IkpSpesialisasi->latest()->fastPaginate($request->load)->withQueryString())
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
        return inertia('IKP/Master/IKPSpesialisasi/Index',['IkpSpesialisasi'=>$IkpSpesialisasi]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        IkpSpesialisasi::create($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Spesialisasi berhasil disimpan',
        ]);
    }
    public function update(Request $request, IkpSpesialisasi $IkpSpesialisasi)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $IkpSpesialisasi->update($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Spesialisasi berhasil diubah',
        ]);
    }
    public function destroy(IkpSpesialisasi $IkpSpesialisasi)
    {
        $IkpSpesialisasi->delete();
        return back()->with([
            'type' => 'success',
            'message' => 'Data Spesialisasi berhasil dihapus',
        ]);
    }
}
