<?php

namespace App\Http\Controllers\IKP\Master;

use App\Http\Controllers\Controller;
use App\Http\Resources\IKP\IKPLokasiResource;
use App\Models\IKP\IkpLokasi;
use Illuminate\Http\Request;

class IKPLokasiController extends Controller
{
    public $loadDefault = 10;
    public function index(Request $request)
    {
        $IkpLokasi = IkpLokasi::query();
        if ($request->q) {
            $IkpLokasi->where('name','like','%'.$request->q.'%');
        }

        if ($request->has(['field','direction'])) {
            $IkpLokasi->orderBy($request->field,$request->direction);
        }
        $IkpLokasi = (
            IKPLokasiResource::collection($IkpLokasi->latest()->fastPaginate($request->load)->withQueryString())
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
        return inertia('IKP/Master/IKPLokasi/Index',['IkpLokasi'=>$IkpLokasi]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        IkpLokasi::create($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Lokasi berhasil disimpan',
        ]);
    }
    public function update(Request $request, IkpLokasi $IkpLokasi)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $IkpLokasi->update($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Lokasi berhasil diubah',
        ]);
    }
    public function destroy(IkpLokasi $IkpLokasi)
    {
        $IkpLokasi->delete();
        return back()->with([
            'type' => 'success',
            'message' => 'Data Lokasi berhasil dihapus',
        ]);
    }
}

