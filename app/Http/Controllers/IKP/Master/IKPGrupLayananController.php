<?php

namespace App\Http\Controllers\IKP\Master;

use App\Http\Controllers\Controller;
use App\Http\Resources\IKP\IKPGrupLayananResource;
use App\Models\IKP\IkpGruplayanan;
use Illuminate\Http\Request;

class IKPGrupLayananController extends Controller
{
    public $loadDefault = 10;
    public function index(Request $request)
    {
        $IkpGrupLayanan = IkpGruplayanan::query();
        if ($request->q) {
            $IkpGrupLayanan->where('name','like','%'.$request->q.'%');
        }

        if ($request->has(['field','direction'])) {
            $IkpGrupLayanan->orderBy($request->field,$request->direction);
        }
        $IkpGrupLayanan = (
            IKPGrupLayananResource::collection($IkpGrupLayanan->latest()->fastPaginate($request->load)->withQueryString())
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
        return inertia('IKP/Master/IKPGrupLayanan/Index',['IkpGrupLayanan'=>$IkpGrupLayanan]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        IkpGrupLayanan::create($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Grup Layanan berhasil disimpan',
        ]);
    }
    public function update(Request $request, IkpGrupLayanan $IkpGrupLayanan)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $IkpGrupLayanan->update($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Grup Layanan berhasil diubah',
        ]);
    }
    public function destroy(IkpGrupLayanan $IkpGrupLayanan)
    {
        $IkpGrupLayanan->delete();
        return back()->with([
            'type' => 'success',
            'message' => 'Data Grup Layanan berhasil dihapus',
        ]);
    }
}
