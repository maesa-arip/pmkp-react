<?php

namespace App\Http\Controllers;

use App\Http\Resources\JenisSebabResource;
use App\Models\JenisSebab;
use Illuminate\Http\Request;

class JenisSebabController extends Controller
{
    public $loadDefault = 10;
    public function index(Request $request)
    {
        $jenisSebabs = JenisSebab::query();
        if ($request->q) {
            $jenisSebabs->where('name','like','%'.$request->q.'%');
        }

        if ($request->has(['field','direction'])) {
            $jenisSebabs->orderBy($request->field,$request->direction);
        }
        $jenisSebabs = (
            JenisSebabResource::collection($jenisSebabs->latest()->fastPaginate($request->load)->withQueryString())
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
        return inertia('Master/JenisSebab/Index',['jenisSebabs'=>$jenisSebabs]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
        ]);

        JenisSebab::create($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Jenis Sebab berhasil disimpan',
        ]);
    }
    public function update(Request $request, JenisSebab $jenisSebab)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
        ]);
        $jenisSebab->update($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Jenis Sebab berhasil diubah',
        ]);
    }
    public function destroy(JenisSebab $jenisSebab)
    {
        $jenisSebab->delete();
        return back()->with([
            'type' => 'success',
            'message' => 'Jenis Sebab berhasil dihapus',
        ]);
    }
}
