<?php

namespace App\Http\Controllers\IKP\Master;

use App\Http\Controllers\Controller;
use App\Http\Resources\IKP\IKPDampakResource;
use App\Models\IKP\IkpDampak;
use Illuminate\Http\Request;

class IKPDampakController extends Controller
{
    public $loadDefault = 10;
    public function index(Request $request)
    {
        $IkpDampak = IkpDampak::query();
        if ($request->q) {
            $IkpDampak->where('name','like','%'.$request->q.'%');
        }

        if ($request->has(['field','direction'])) {
            $IkpDampak->orderBy($request->field,$request->direction);
        }
        $IkpDampak = (
            IKPDampakResource::collection($IkpDampak->latest()->fastPaginate($request->load)->withQueryString())
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
        return inertia('IKP/Master/IKPDampak/Index',['IkpDampak'=>$IkpDampak]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'value' => 'required|numeric',
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
        ]);

        IkpDampak::create($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Dampak berhasil disimpan',
        ]);
    }
    public function update(Request $request, IkpDampak $IkpDampak)
    {
        $validated = $request->validate([
            'value' => 'required|numeric',
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
        ]);
        $IkpDampak->update($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Dampak berhasil diubah',
        ]);
    }
    public function destroy(IkpDampak $IkpDampak)
    {
        $IkpDampak->delete();
        return back()->with([
            'type' => 'success',
            'message' => 'Data Dampak berhasil dihapus',
        ]);
    }
}

