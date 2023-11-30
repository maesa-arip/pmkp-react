<?php

namespace App\Http\Controllers\IKP\Master;

use App\Http\Controllers\Controller;
use App\Http\Resources\IKP\IKPPelaporResource;
use App\Models\IKP\IkpPelapor;
use Illuminate\Http\Request;

class IKPPelaporController extends Controller
{
    public $loadDefault = 10;
    public function index(Request $request)
    {
        $IkpPelapor = IkpPelapor::query();
        if ($request->q) {
            $IkpPelapor->where('name','like','%'.$request->q.'%');
        }

        if ($request->has(['field','direction'])) {
            $IkpPelapor->orderBy($request->field,$request->direction);
        }
        $IkpPelapor = (
            IKPPelaporResource::collection($IkpPelapor->latest()->fastPaginate($request->load)->withQueryString())
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
        return inertia('IKP/Master/IKPPelapor/Index',['IkpPelapor'=>$IkpPelapor]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        IkpPelapor::create($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Pelapor berhasil disimpan',
        ]);
    }
    public function update(Request $request, IkpPelapor $IkpPelapor)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $IkpPelapor->update($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Pelapor berhasil diubah',
        ]);
    }
    public function destroy(IkpPelapor $IkpPelapor)
    {
        $IkpPelapor->delete();
        return back()->with([
            'type' => 'success',
            'message' => 'Data Pelapor berhasil dihapus',
        ]);
    }
}
