<?php

namespace App\Http\Controllers\MUTU;

use App\Http\Controllers\Controller;
use App\Http\Resources\MUTU\MutuIndikatorResource;
use App\Models\MUTU\MutuIndikator;
use App\Models\MUTU\MutuKategori;
use App\Models\MUTU\MutuPenyebut;
use App\Models\PeriodeKinerja;
use App\Services\MutuIndicatorInput;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class MutuIndikatorController extends Controller
{
    public $loadDefault = 10;

    public function index(Request $request, MutuIndicatorInput $service)
    {
        $request->validate(['tahun' => 'nullable|integer|min:2000|max:2100', 'field' => 'nullable|in:id,num_name,created_at,approved,mutu_kategori_id,indikator_fitur4_id,standar,location_id', 'direction' => 'nullable|in:asc,desc']);
        $year = $request->integer('tahun', now()->year);
        $user = $request->user();
        $query = MutuIndikator::with(['indikator_fitur4', 'kategori', 'location'])->where('periode_kinerja_id', PeriodeKinerja::where('tahun', $year)->value('id'));
        if (! $service->canViewAll($user)) {
            $query->where('location_id', $user->pic?->location_id ?? -1);
        }
        if ($request->q) {
            $query->where(fn ($q) => $q->where('num_name', 'like', '%'.$request->q.'%')
                ->orWhere('denum_name', 'like', '%'.$request->q.'%')
                ->orWhereHas('indikator_fitur4', fn ($i) => $i->where('name', 'like', '%'.$request->q.'%')));
        }
        if ($request->field) {
            $query->orderBy($request->field, $request->direction ?? 'asc');
        }
        $items = MutuIndikatorResource::collection($query->latest()->fastPaginate($request->load)->withQueryString())->additional([
            'attributes' => ['total' => 1100, 'per_page' => 10],
            'filtered' => ['tahun' => $year, 'load' => $request->load ?? 10, 'q' => $request->q ?? '', 'page' => $request->page ?? 1, 'field' => $request->field ?? '', 'direction' => $request->direction ?? ''],
        ]);
        $activities = DB::table('indikator_fitur3s as f')->join('periode_kinerjas as p', 'p.id', '=', 'f.periode_kinerja_id')->select('f.*', 'p.tahun', 'p.status as periode_status')->orderBy('f.name')->get();

        return inertia('MUTU/MutuIndikator/Index', ['MutuIndikator' => $items, 'MutuKategori' => MutuKategori::get(), 'MutuPenyebut' => MutuPenyebut::orderBy('name')->pluck('name')->map(fn ($name) => ['id' => $name, 'name' => $name]),
            'IndikatorFitur3' => $activities, 'IndikatorFitur4' => $service->options($user), 'MutuPeriods' => PeriodeKinerja::orderBy('tahun')->get(['id', 'tahun', 'status'])]);
    }

    private function validated(Request $r, bool $editing = false): array
    {
        return $r->validate([
            'periode_kinerja_id' => ['required', 'integer', 'exists:periode_kinerjas,id'],
            'indikator_fitur3_id' => ['required', 'integer', 'exists:indikator_fitur3s,id'],
            'IndikatorBaru' => [$editing ? 'nullable' : 'required', Rule::in($editing ? [0] : [0, 1])],
            'indikator' => ['nullable', 'required_if:IndikatorBaru,1', 'string', 'max:255'],
            'indikator_fitur4_id' => ['nullable', Rule::requiredIf($editing || (int) $r->IndikatorBaru === 0), 'integer'],
            'mutu_kategori_id' => 'required|integer|exists:mutu_kategoris,id',
            'num_name' => 'required|string|max:255', 'denum_name' => 'required|string|max:255',
            'standar' => 'required|numeric', 'operator' => ['required', Rule::in(['≥', '≤', '>', '<', '='])], 'penyebut' => 'required|string|max:255',
        ]);
    }

    public function store(Request $r, MutuIndicatorInput $service)
    {
        $service->save($r->user(), $this->validated($r));

        return back()->with(['type' => 'success', 'message' => 'Indikator mutu disimpan pada kegiatan Kabag/Kabid yang dipilih.']);
    }

    public function update(Request $r, MutuIndikator $MutuIndikator, MutuIndicatorInput $service)
    {
        $service->save($r->user(), $this->validated($r, true), $MutuIndikator);

        return back()->with(['type' => 'success', 'message' => 'Indikator mutu diperbarui.']);
    }

    public function approved(Request $r, MutuIndikator $MutuIndikator, MutuIndicatorInput $service)
    {
        abort_unless($r->user()->can('approved indikator mutu'), 403);
        $service->authorize($r->user(), $MutuIndikator);
        $MutuIndikator->update(['approved' => 1]);

        return back()->with(['type' => 'success', 'message' => 'Indikator disetujui.']);
    }

    public function destroy(Request $r, MutuIndikator $MutuIndikator, MutuIndicatorInput $service)
    {
        $service->authorize($r->user(), $MutuIndikator);
        $MutuIndikator->delete();

        return back()->with(['type' => 'success', 'message' => 'Indikator dihapus.']);
    }
}
