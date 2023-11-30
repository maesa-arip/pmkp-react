<?php

namespace App\Http\Controllers\IKP\Master;

use App\Http\Controllers\Controller;
use App\Http\Resources\IKP\IKPJenisPengendalianResource;
use App\Models\IKP\IkpJenisInsiden;
use Illuminate\Http\Request;

class IKPJenisInsidenController extends Controller
{
    public $loadDefault = 10;
    public function index(Request $request)
    {
        $IkpJenisInsiden = IkpJenisInsiden::query();
        if ($request->q) {
            $IkpJenisInsiden->where('name','like','%'.$request->q.'%');
        }

        if ($request->has(['field','direction'])) {
            $IkpJenisInsiden->orderBy($request->field,$request->direction);
        }
        $IkpJenisInsiden = (
            IKPJenisPengendalianResource::collection($IkpJenisInsiden->latest()->fastPaginate($request->load)->withQueryString())
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
        return inertia('IKP/Master/IKPJenisInsiden/Index',['IkpJenisInsiden'=>$IkpJenisInsiden]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        IkpJenisInsiden::create($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Jenis Insiden berhasil disimpan',
        ]);
    }
    public function update(Request $request, IkpJenisInsiden $IkpJenisInsiden)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $IkpJenisInsiden->update($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Jenis Insiden berhasil diubah',
        ]);
    }
    public function destroy(IkpJenisInsiden $IkpJenisInsiden)
    {
        $IkpJenisInsiden->delete();
        return back()->with([
            'type' => 'success',
            'message' => 'Data Jenis Insiden berhasil dihapus',
        ]);
    }
}
