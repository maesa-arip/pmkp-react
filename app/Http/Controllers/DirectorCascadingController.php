<?php

namespace App\Http\Controllers;

use App\Models\PeriodeKinerja;
use App\Services\DirectorCascadingService;
use Illuminate\Http\Request;

class DirectorCascadingController extends Controller
{
    public function save(Request $request, PeriodeKinerja $period, DirectorCascadingService $service, ?int $concept = null)
    {
        $data = $request->validate([
            'kind' => 'required|in:kegiatan,indikator_kinerja', 'parent_id' => 'required|integer',
            'name' => 'required|string|max:10000', 'code' => 'nullable|string|max:80',
        ]);
        $service->save($request->user(), $period, $data, $concept);

        return back()->with(['type' => 'success', 'message' => 'Data Direktur disimpan. Ekspor berikutnya mengikuti data terbaru.']);
    }
}
