<?php

namespace App\Http\Controllers;

use App\Models\PeriodeKinerja;
use App\Services\OperationalConceptLink;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class IndikatorKinerjaController extends Controller
{
    private function activities($user, int $period, int $level)
    {
        $q = DB::table('indikator_fitur'.$level.'s')->where('periode_kinerja_id', $period)->where('is_active', true);
        if (! $user->can('atur data master manajemen risiko') && ! $user->can('atur hak akses')) {
            $positions = DB::table('kinerja_penanggung_jawabs')->where('pic_id', $user->pic_id)->where('is_active', true)->pluck('id');
            $q->whereIn('penanggung_jawab_id', $positions);
        }

        return $q;
    }

    public function index(Request $r)
    {
        $r->validate(['tahun' => 'nullable|integer|min:2000|max:2100']);
        $period = PeriodeKinerja::where('tahun', $r->integer('tahun', now()->year))->first();
        $activities = [];
        $ids = [2 => [], 3 => []];
        if ($period) {
            foreach ([2, 3] as $level) {
                foreach ($this->activities($r->user(), $period->id, $level)->orderBy('name')->get() as $a) {
                    $ids[$level][] = $a->id;
                    $activities[] = (array) $a + ['level' => $level];
                }
            }
        }
        $rows = $period ? DB::table('indikator_kinerjas')->where('periode_kinerja_id', $period->id)->where('is_active', true)->where(fn ($q) => $q->whereIn('indikator_fitur2_id', $ids[2])->orWhereIn('indikator_fitur3_id', $ids[3]))->orderBy('sort_order')->orderBy('id')->get() : [];

        return inertia('Kinerja/Performance', ['period' => $period, 'periods' => PeriodeKinerja::orderByDesc('tahun')->get(['id', 'tahun', 'status']), 'activities' => $activities, 'indicators' => $rows, 'directorNodes' => $period && (int) $period->feature_schema_version === 2 ? app(\App\Services\DirectorCascadingService::class)->nodes($r->user(), $period) : []]);
    }

    public function destroy(Request $r, int $indicator)
    {
        $data = $r->validate(['periode_kinerja_id' => 'required|integer|exists:periode_kinerjas,id', 'level' => 'required|integer|in:2,3', 'activity_id' => 'required|integer']);
        DB::transaction(function () use ($r, $data, $indicator) {
            $period = PeriodeKinerja::whereKey($data['periode_kinerja_id'])->lockForUpdate()->firstOrFail();
            if (! in_array($period->status, ['draft', 'aktif'], true)) {
                throw ValidationException::withMessages(['name' => 'Periode sudah ditutup.']);
            }
            $level = (int) $data['level'];
            abort_unless($this->activities($r->user(), $period->id, $level)->where('id', $data['activity_id'])->exists(), 403);
            $row = DB::table('indikator_kinerjas')->where('id', $indicator)->where('periode_kinerja_id', $period->id)
                ->where('indikator_fitur'.$level.'_id', $data['activity_id'])->where('is_active', true)->first();
            abort_unless($row, 404);
            $concepts = DB::table('cascading_concepts')->where('periode_kinerja_id', $period->id)
                ->where('legacy_table', 'indikator_kinerjas')->where('legacy_id', $indicator)->pluck('id');
            if (DB::table('cascading_concepts')->where('periode_kinerja_id', $period->id)->whereIn('parent_id', $concepts)->where('is_active', true)->exists()) {
                throw ValidationException::withMessages(['name' => 'Indikator masih memiliki turunan aktif. Kelola turunannya terlebih dahulu.']);
            }
            // Preserve source bindings and past snapshots; future exports clear inactive cells.
            DB::table('indikator_kinerjas')->where('id', $indicator)->update(['is_active' => false, 'updated_at' => now()]);
            DB::table('cascading_concepts')->whereIn('id', $concepts)->update(['is_active' => false, 'updated_at' => now()]);
            activity('indikator_tahunan')->performedOn($period)->causedBy($r->user())
                ->withProperties(['indicator_id' => $indicator, 'old' => (array) $row])->log('Indikator kinerja dihapus');
        });

        return back()->with(['type' => 'success', 'message' => 'Indikator kinerja dihapus.']);
    }

    public function save(Request $r, ?int $indicator = null)
    {
        $data = $r->validate(['periode_kinerja_id' => 'required|integer|exists:periode_kinerjas,id', 'level' => 'required|integer|in:2,3', 'activity_id' => 'required|integer', 'name' => 'required|string|max:255', 'kode_cascading' => 'nullable|string|max:50']);
        DB::transaction(function () use ($r, $data, $indicator) {
            $p = PeriodeKinerja::whereKey($data['periode_kinerja_id'])->lockForUpdate()->firstOrFail();
            if (! in_array($p->status, ['draft', 'aktif'], true)) {
                throw ValidationException::withMessages(['name' => 'Periode sudah ditutup.']);
            }
            $level = (int) $data['level'];
            $parent = $this->activities($r->user(), $p->id, $level)->where('id', $data['activity_id'])->first();
            if (! $parent) {
                throw ValidationException::withMessages(['activity_id' => 'Pilih kegiatan yang menjadi tanggung jawab Anda pada tahun ini.']);
            }
            $row = null;
            if ($indicator) {
                $row = DB::table('indikator_kinerjas')->where('id', $indicator)->where('periode_kinerja_id', $p->id)->first();
                abort_unless($row && $row->is_active, 404);
                $oldLevel = $row->indikator_fitur2_id ? 2 : 3;
                abort_unless($this->activities($r->user(), $p->id, $oldLevel)->where('id', $row->{'indikator_fitur'.$oldLevel.'_id'})->exists(), 403);
                if ($row->{'indikator_fitur'.$level.'_id'} != $parent->id && DB::table('cascading_concepts')->where('legacy_table', 'indikator_kinerjas')->where('legacy_id', $indicator)->where('source_sheet', '<>', 'INPUT')->exists()) {
                    throw ValidationException::withMessages(['activity_id' => 'Indikator sumber Excel tetap mengikuti kegiatan asalnya. Buat indikator baru untuk kegiatan berbeda.']);
                }
            }
            $values = ['name' => trim($data['name']), 'kode_cascading' => trim($data['kode_cascading'] ?? '') ?: null, 'jabatan' => $parent->jabatan, 'indikator_fitur2_id' => $level === 2 ? $parent->id : null, 'indikator_fitur3_id' => $level === 3 ? $parent->id : null, 'updated_at' => now()];
            if ($row) {
                DB::table('indikator_kinerjas')->where('id', $row->id)->update($values);
            } else {
                $indicator = DB::table('indikator_kinerjas')->insertGetId($values + ['periode_kinerja_id' => $p->id, 'is_active' => true, 'sort_order' => 0, 'lineage_id' => (string) Str::uuid(), 'created_at' => now()]);
            }
            app(OperationalConceptLink::class)->sync($p->id, 'indikator_kinerjas', $indicator, 'indikator_fitur'.$level.'s', $parent->id, 'indikator_kinerja', $level === 2 ? 'wadir' : 'kabag_kabid');
        });

        return back()->with(['type' => 'success', 'message' => 'Indikator kinerja kegiatan disimpan.']);
    }
}
