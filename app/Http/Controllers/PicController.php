<?php

namespace App\Http\Controllers;

use App\Http\Resources\PICResource;
use App\Models\Location;
use App\Models\Pic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PicController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public $loadDefault = 10;
    public function index(Request $request)
    {
        $pics = Pic::query()->with('location');
        if ($request->q) {
            $pics->where('name','like','%'.$request->q.'%');
        }

        if ($request->has(['field','direction'])) {
            $pics->orderBy($request->field,$request->direction);
        }
        $pics = (
            PICResource::collection($pics->latest()->fastPaginate($request->load)->withQueryString())
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
        $locations = Location::get();
        // dd($locations);
        return inertia('Master/PIC/Index',['pics'=>$pics, 'locations'=> $locations]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location_id' => 'required|numeric',
        ]);

        Pic::create($validated);
        return back()->with([
            'type' => 'success',
            'message' => 'Data Penanggungjawab berhasil disimpan',
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Pic  $pic
     * @return \Illuminate\Http\Response
     */
    public function show(Pic $pic)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Pic  $pic
     * @return \Illuminate\Http\Response
     */
    public function edit(Pic $pic)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Pic  $pic
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Pic $pic)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location_id' => 'required|numeric',
        ]);
        DB::transaction(function () use ($pic, $validated) {
            $periods = DB::table('periode_kinerjas')->whereIn('status', ['draft', 'aktif'])->orderBy('id')->lockForUpdate()->pluck('id');
            $position = DB::table('kinerja_penanggung_jawabs')->where('pic_id', $pic->id)->lockForUpdate()->first();
            if ($position) {
                abort_unless(auth()->user()->can('atur data master manajemen risiko') || auth()->user()->can('atur hak akses'), 403);
            }
            if ($position && $pic->name !== $validated['name']) {
                if (DB::table('kinerja_penanggung_jawabs')->where('name', trim($validated['name']))->where('id', '<>', $position->id)->exists()) {
                    throw ValidationException::withMessages(['name' => 'Nama sudah digunakan jabatan kinerja lain.']);
                }
                DB::table('kinerja_penanggung_jawabs')->where('id', $position->id)->update(['name' => trim($validated['name']), 'updated_at' => now()]);
                foreach (\App\Services\CascadingHierarchyService::TABLES as $table) {
                    DB::table($table)->whereIn('periode_kinerja_id', $periods)->where('penanggung_jawab_id', $position->id)
                        ->update(['jabatan' => trim($validated['name']), 'updated_at' => now()]);
                }
                activity('indikator_tahunan')->causedBy(auth()->user())->withProperties([
                    'pic_id' => $pic->id, 'old_name' => $pic->name, 'name' => trim($validated['name']),
                ])->log('Nama PIC jabatan diperbarui');
            }
            $pic->update($validated);
        });
        return back()->with([
            'type' => 'success',
            'message' => 'Penanggungjawab berhasil diubah',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Pic  $pic
     * @return \Illuminate\Http\Response
     */
    public function destroy(Pic $pic)
    {
        if (DB::table('kinerja_penanggung_jawabs')->where('pic_id', $pic->id)->exists()) {
            return back()->with(['type' => 'error', 'message' => 'PIC masih terhubung ke jabatan kinerja. Lepaskan relasinya melalui master penanggung jawab sebelum menghapus.']);
        }
        $pic->delete();
        return back()->with([
            'type' => 'success',
            'message' => 'Penanggungjawab berhasil dihapus',
        ]);
    }
}
