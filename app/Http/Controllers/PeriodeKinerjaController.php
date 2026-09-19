<?php

namespace App\Http\Controllers;

use App\Models\PeriodeKinerja;
use App\Services\AnnualIndicatorService;
use App\Services\CascadingExportService;
use App\Services\CascadingHierarchyService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class PeriodeKinerjaController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            abort_unless(auth()->user()->can('atur data master manajemen risiko') || auth()->user()->can('atur hak akses'), 403);

            return $next($request);
        });
    }

    public function index(Request $request)
    {
        $request->validate(['tahun' => 'nullable|integer|min:2000|max:2100']);
        $period = PeriodeKinerja::where('tahun', $request->integer('tahun', now()->year))->first();
        $data = [];
        foreach (CascadingHierarchyService::TABLES as $level => $table) {
            $data[$level] = $period ? DB::table($table)->where('periode_kinerja_id', $period->id)->orderBy('sort_order')->orderBy('id')->get()->all() : [];
        }
        $data['sasaran'] = $period ? DB::table('sasaran_strategis')->where('periode_kinerja_id', $period->id)->where('is_active', true)->get()->all() : [];
        $hierarchy = app(CascadingHierarchyService::class);
        $positionUnits = DB::table('kinerja_penanggung_jawab_units')->orderBy('location_id')->get()->groupBy('penanggung_jawab_id');

        return inertia('Kinerja/Index', [
            'periods' => PeriodeKinerja::orderByDesc('tahun')->get(), 'period' => $period, 'nodes' => $hierarchy->decorate($data),
            'cascadingConcepts' => $period ? array_values(array_filter(app(\App\Services\CascadingConceptService::class)->rows($period->id), fn ($row) => $row['kind'] !== 'indikator_kinerja' || $row['is_active'])) : [],
            'performanceIndicators' => $period ? DB::table('indikator_kinerjas')->where('periode_kinerja_id', $period->id)->where('is_active', true)->orderBy('sort_order')->orderBy('id')->get() : [],
            'cascadingTree' => $hierarchy->build($data),
            'cascadingIssues' => array_values(array_filter($hierarchy->unlinked($data, $hierarchy->build($data)), fn ($issue) => $issue['level'] !== '4' || ! $this->isUnplaced($data['4'], $issue['id']))),
            'unplacedIndicators' => count(array_filter($data['4'], fn ($row) => $row->is_active && ! $row->indikator_fitur3_id)),
            'locations' => DB::table('locations')->select('id', 'name')->orderBy('name')->get(),
            'pics' => DB::table('pics')->select('id', 'name', 'location_id')->orderBy('name')->get(),
            'responsiblePositions' => DB::table('kinerja_penanggung_jawabs')->orderBy('name')->get()->map(function ($position) use ($positionUnits) {
                $position->location_ids = ($positionUnits[$position->id] ?? collect())->pluck('location_id');

                return $position;
            }),
            'exports' => $period ? DB::table('cascading_exports')->where('periode_kinerja_id', $period->id)->select('id', 'created_at', 'template_version')->orderByDesc('id')->limit(20)->get() : [],
        ]);
    }

    public function saveConcept(Request $request, PeriodeKinerja $period, int $concept)
    {
        $data = $request->validate(['name' => 'required|string|max:10000', 'code' => 'nullable|string|max:80']);
        $data['code'] = trim($data['code'] ?? '') ?: null;
        app(\App\Services\CascadingConceptService::class)->update($period, $concept, $data);

        return back()->with('message', 'Data cascading diperbarui.');
    }

    public function store(Request $request, AnnualIndicatorService $service)
    {
        $data = $request->validate(['tahun' => 'required|integer|min:2000|max:2100|unique:periode_kinerjas,tahun', 'source_period_id' => 'nullable|exists:periode_kinerjas,id']);
        $period = DB::transaction(function () use ($data, $service) {
            $source = ! empty($data['source_period_id']) ? PeriodeKinerja::findOrFail($data['source_period_id']) : null;
            $period = PeriodeKinerja::create(['tahun' => $data['tahun'], 'updated_by' => auth()->id(), 'tujuan' => $source?->tujuan,
                'reconstruction_notes' => $source?->reconstruction_notes,
                'feature_schema_version' => $source?->feature_schema_version ?? 2,
                'nama_organisasi' => $source?->nama_organisasi ?? 'RSUD Bali Mandara Provinsi Bali']);
            if ($source) {
                $service->copyHierarchy($source->id, $period);
            }

            return $period;
        });

        return redirect()->route('kinerja.index', ['tahun' => $period->tahun])->with('message', 'Periode draft dibuat. Sesuaikan hierarki sebelum aktivasi.');
    }

    public function update(Request $request, PeriodeKinerja $period)
    {
        $data = $request->validate(['status' => ['required', Rule::in(['draft', 'aktif', 'ditutup'])], 'nama_organisasi' => 'required|string|max:255', 'tujuan' => 'nullable|string|max:5000']);
        DB::transaction(function () use ($period, $data) {
            $period = PeriodeKinerja::whereKey($period->id)->lockForUpdate()->firstOrFail();
            if ($period->status === 'ditutup' || ($period->status === 'aktif' && $data['status'] !== 'ditutup')) {
                throw ValidationException::withMessages(['status' => 'Periode aktif hanya dapat ditutup; periode ditutup bersifat baca saja.']);
            }
            if ($data['status'] === 'aktif') {
                if (! DB::table('indikator_fitur4s')->where('periode_kinerja_id', $period->id)->where('is_active', true)->exists()) {
                    throw ValidationException::withMessages(['status' => 'Isi indikator sampai level 4 sebelum aktivasi.']);
                }
                $this->validateHierarchy($period);
                $data['activated_at'] = now();
            }
            if ($data['status'] === 'ditutup') {
                if ($period->status !== 'aktif') {
                    throw ValidationException::withMessages(['status' => 'Aktifkan periode sebelum menutupnya.']);
                }
                $data['closed_at'] = now();
                // Metadata of a published period is immutable as well.
                $data['nama_organisasi'] = $period->nama_organisasi;
                $data['tujuan'] = $period->tujuan;
            }
            $period->update($data + ['updated_by' => auth()->id()]);
        });

        return back()->with('message', 'Periode disimpan.');
    }

    private function validateHierarchy(PeriodeKinerja $period): void
    {
        foreach (CascadingHierarchyService::TABLES as $table) {
            if (! Schema::hasTable($table)) {
                continue;
            }
            foreach (DB::table($table)->where('periode_kinerja_id', $period->id)->where('is_active', true)->get() as $row) {
                $parents = array_filter([AnnualIndicatorService::PARENTS[$table] ?? null]);
                if ((int) $period->feature_schema_version === 2) {
                    $parents[] = ['sasaran_strategis_id', 'sasaran_strategis'];
                }
                foreach ($parents as [$column, $parentTable]) {
                    // Linked masters may wait to be positioned under an activity.
                    if ($table === 'indikator_fitur4s' && ! $row->indikator_fitur3_id) {
                        continue;
                    }
                    if (! DB::table($parentTable)->where('id', $row->$column)->where('periode_kinerja_id', $period->id)->where('is_active', true)->exists()) {
                        throw ValidationException::withMessages(['status' => "Parent/sasaran {$table} #{$row->id} tidak aktif atau berbeda tahun."]);
                    }
                }
            }
        }
    }

    public function saveNode(Request $request, PeriodeKinerja $period, string $level)
    {
        abort_unless(isset(CascadingHierarchyService::TABLES[$level]), 404);
        $table = CascadingHierarchyService::TABLES[$level];
        $rules = ['id' => 'nullable|integer', 'name' => 'required|string|max:255', 'tujuan' => 'nullable|string|max:255',
            'penanggung_jawab_id' => [$level === '4' && ! $request->input('id') ? 'required' : 'nullable', 'integer', Rule::exists('kinerja_penanggung_jawabs', 'id')],
            'kode_cascading' => 'nullable|string|max:50', 'sort_order' => 'required|integer|min:0', 'is_active' => 'required|boolean'];
        if ($parent = AnnualIndicatorService::PARENTS[$table]) {
            $rules[$parent[0]] = ['required', Rule::exists($parent[1], 'id')->where('periode_kinerja_id', $period->id)];
        }
        if ($level === '1' && (int) $period->feature_schema_version === 2) {
            $rules['sasaran_strategis_id'] = ['nullable', 'required_without:sasaran_baru', Rule::exists('sasaran_strategis', 'id')->where('periode_kinerja_id', $period->id)->where('is_active', true)];
            $rules['sasaran_baru'] = ['nullable', 'required_without:sasaran_strategis_id', 'string', 'max:255'];
        }
        if ($level === '1') {
            $rules['cascading_color'] = ['nullable', 'string', 'regex:/^#[0-9a-fA-F]{6}$/'];
        }
        $data = $request->validate($rules);
        if (array_key_exists('cascading_color', $data)) {
            $data['cascading_color'] = \App\Services\CascadingDisplayColor::normalize($data['cascading_color']);
        }
        DB::transaction(function () use ($period, $table, $level, $data) {
            $period = PeriodeKinerja::whereKey($period->id)->lockForUpdate()->firstOrFail();
            if (! in_array($period->status, ['draft', 'aktif'], true)) {
                throw ValidationException::withMessages(['name' => 'Periode sudah ditutup. Indikator bersifat baca saja.']);
            }
            $id = $data['id'] ?? null;
            $newGoal = $data['sasaran_baru'] ?? null;
            if ($newGoal && $period->status !== 'draft') {
                throw ValidationException::withMessages(['sasaran_baru' => 'Sasaran baru hanya dapat dibuat pada periode draft.']);
            }
            unset($data['id'], $data['sasaran_baru']);
            $before = null;
            if ($id) {
                $before = DB::table($table)->where('id', $id)->where('periode_kinerja_id', $period->id)->first();
                abort_unless($before, 404);
                $parentColumn = (AnnualIndicatorService::PARENTS[$table] ?? ['sasaran_strategis_id'])[0];
                if ((int) $period->feature_schema_version === 2 && isset($data[$parentColumn])
                    && (int) $before->$parentColumn !== (int) $data[$parentColumn]
                    && DB::table('cascading_concepts')->where('periode_kinerja_id', $period->id)->where('legacy_table', $table)->where('legacy_id', $id)->where('source_sheet', '<>', 'INPUT')->exists()) {
                    throw ValidationException::withMessages([$parentColumn => 'Data dari Excel tetap mengikuti induk asalnya. Buat data baru untuk cabang berbeda.']);
                }
            } elseif ($period->status === 'aktif') {
                throw ValidationException::withMessages(['name' => 'Penambahan indikator dilakukan pada periode draft. Pilih indikator yang sudah ada untuk mengedit periode aktif.']);
            }
            $data['penanggung_jawab_id'] = $data['penanggung_jawab_id'] ?? ($level === '4' ? $before?->penanggung_jawab_id : null);
            $position = $data['penanggung_jawab_id'] ? DB::table('kinerja_penanggung_jawabs')->where('id', $data['penanggung_jawab_id'])->lockForUpdate()->first() : null;
            if ($position && ! $position->is_active) {
                throw ValidationException::withMessages(['penanggung_jawab_id' => 'Pilih penanggung jawab yang aktif.']);
            }
            $data['jabatan'] = $level === '4' && $before && (int) $before->penanggung_jawab_id === (int) $data['penanggung_jawab_id'] ? $before->jabatan : $position?->name;
            if ($level === '4' && $before) {
                // The unit belongs to the permanent master and stays the same in every year.
                $data['location_id'] = AnnualIndicatorService::ids($before->location_id);
            } elseif ($level === '4') {
                $units = DB::table('kinerja_penanggung_jawab_units')->where('penanggung_jawab_id', $position->id)->orderBy('location_id')->pluck('location_id')->map(fn ($id) => (int) $id)->all();
                if (! $units && ! $position->pic_id) {
                    throw ValidationException::withMessages(['penanggung_jawab_id' => 'Hubungkan PIC jabatan atau atur unit pelaksana pada master penanggung jawab terlebih dahulu.']);
                }
                // Derive permitted units on the server, never trust the submitted unit list.
                $data['location_id'] = $units;
            }
            if ($period->status === 'aktif') {
                $parent = AnnualIndicatorService::PARENTS[$table];
                if ($data['is_active'] && $parent && ! DB::table($parent[1])->where('id', $data[$parent[0]])
                    ->where('periode_kinerja_id', $period->id)->where('is_active', true)->exists()) {
                    throw ValidationException::withMessages([$parent[0] => 'Pilih induk aktif pada tahun yang sama.']);
                }
                if (! $data['is_active'] && (int) $level < 4 && DB::table('indikator_fitur'.((int) $level + 1).'s')
                    ->where('periode_kinerja_id', $period->id)->where('indikator_fitur'.$level.'_id', $id)->where('is_active', true)->exists()) {
                    throw ValidationException::withMessages(['is_active' => 'Masih ada anak aktif. Pindahkan atau nonaktifkan anak terlebih dahulu agar bagan tetap terhubung.']);
                }
            }
            $data['tujuan'] = $data['tujuan'] ?? '';
            $data['kode_cascading'] = trim($data['kode_cascading'] ?? '') ?: null;
            if ($data['kode_cascading']) {
                $duplicates = DB::table($table)->where('periode_kinerja_id', $period->id)->where('kode_cascading', $data['kode_cascading']);
                if ($id) {
                    $duplicates->where('id', '<>', $id);
                }
                if ($parent = AnnualIndicatorService::PARENTS[$table]) {
                    $duplicates->where($parent[0], $data[$parent[0]]);
                }
                // The reference restarts sasaran/kegiatan codes for each responsible office.
                if (in_array((int) $level, [1, 2, 3], true)) {
                    $duplicates->where('penanggung_jawab_id', $data['penanggung_jawab_id']);
                }
                if ($duplicates->exists()) {
                    throw ValidationException::withMessages(['kode_cascading' => 'Kode sudah dipakai pada cabang yang sama.']);
                }
            }
            // Retain the legacy FK for BPKP; it is not a user-managed hierarchy level.
            $parent = AnnualIndicatorService::PARENTS[$table];
            $context = $data['sasaran_strategis_id'] ?? ($id ? DB::table($table)->where('id', $id)->value('sasaran_strategis_id') : null);
            if ($parent) {
                $context = DB::table($parent[1])->where('id', $data[$parent[0]])->value('sasaran_strategis_id');
            }
            if (! $context) {
                $context = DB::table('sasaran_strategis')->insertGetId([
                    'name' => $newGoal ?: $data['name'], 'parent_id' => 0, 'periode_kinerja_id' => $period->id,
                    'lineage_id' => (string) Str::uuid(), 'is_active' => true, 'sort_order' => 0,
                    'created_at' => now(), 'updated_at' => now(),
                ]);
            }
            $data['sasaran_strategis_id'] = $context;
            if ($level === '4') {
                $data['location_id'] = json_encode(array_map('intval', $data['location_id']));
            }
            $data['updated_at'] = now();
            if ($id) {
                DB::table($table)->where('id', $id)->update($data);
                if ((int) $before->sasaran_strategis_id !== (int) $context) {
                    $this->syncDescendantContext((int) $level, (int) $id, $period->id, (int) $context);
                }
                activity('indikator_tahunan')->performedOn($period)->causedBy(auth()->user())
                    ->withProperties(['level' => $level, 'indicator_id' => $id,
                        'old' => (array) $before, 'attributes' => (array) DB::table($table)->find($id)])
                    ->log('Indikator fitur '.$level.' diubah');
            } else {
                $id = DB::table($table)->insertGetId($data + ['periode_kinerja_id' => $period->id, 'lineage_id' => (string) Str::uuid(), 'created_at' => now()]);
            }
            if ($level === '4') {
                \App\Services\Fitur4Master::syncFromPlacement($id);
            }
            if ((int) $period->feature_schema_version === 2) {
                $parentSpec = AnnualIndicatorService::PARENTS[$table] ?? ['sasaran_strategis_id', 'sasaran_strategis'];
                app(\App\Services\OperationalConceptLink::class)->sync($period->id, $table, $id, $parentSpec[1], $data[$parentSpec[0]],
                    ['1' => 'iku', '2' => 'kegiatan', '3' => 'kegiatan', '4' => 'indikator_mutu'][$level],
                    ['1' => 'organisasi', '2' => 'wadir', '3' => 'kabag_kabid', '4' => 'tim_kerja'][$level]);
            }
            $period->update(['updated_by' => auth()->id()]);
        });

        return back()->with(['type' => 'success', 'message' => 'Indikator fitur '.$level.' berhasil disimpan.']);
    }

    private function isUnplaced(array $rows, $id): bool
    {
        foreach ($rows as $row) {
            if ((int) $row->id === (int) $id) {
                return ! $row->indikator_fitur3_id;
            }
        }

        return false;
    }

    private function syncDescendantContext(int $level, int $id, int $periodId, int $context): void
    {
        $ids = [$id];
        for ($childLevel = $level + 1; $childLevel <= 4 && $ids; $childLevel++) {
            $table = 'indikator_fitur'.$childLevel.'s';
            $ids = DB::table($table)->where('periode_kinerja_id', $periodId)
                ->whereIn('indikator_fitur'.($childLevel - 1).'_id', $ids)->pluck('id')->all();
            DB::table($table)->whereIn('id', $ids)->update(['sasaran_strategis_id' => $context, 'updated_at' => now()]);
        }
        if ($ids && Schema::hasTable('indikator_fitur04s')) {
            DB::table('indikator_fitur04s')->where('periode_kinerja_id', $periodId)
                ->whereIn('indikator_fitur4_id', $ids)->update(['sasaran_strategis_id' => $context, 'updated_at' => now()]);
        }
    }

    public function saveResponsible(Request $request)
    {
        $data = $request->validate([
            'id' => 'nullable|integer|exists:kinerja_penanggung_jawabs,id',
            'name' => ['required', 'string', 'max:255', Rule::unique('kinerja_penanggung_jawabs')->ignore($request->input('id'))],
            'is_active' => 'required|boolean',
            'pic_id' => ['sometimes', 'nullable', 'integer', 'exists:pics,id', Rule::unique('kinerja_penanggung_jawabs', 'pic_id')->ignore($request->input('id'))],
            'parent_id' => 'sometimes|nullable|integer|exists:kinerja_penanggung_jawabs,id',
            'can_use_descendant_indicators' => 'sometimes|boolean',
            'location_ids' => 'present|array',
            'location_ids.*' => 'required|integer|distinct|exists:locations,id',
        ]);
        DB::transaction(function () use ($data) {
            // Same lock order as indicator edits: periods, then responsible position.
            $openPeriods = PeriodeKinerja::whereIn('status', ['draft', 'aktif'])->orderBy('id')->lockForUpdate()->pluck('id');
            $id = $data['id'] ?? null;
            $before = $id ? DB::table('kinerja_penanggung_jawabs')->where('id', $id)->lockForUpdate()->first() : null;
            if ($id && ! $before) {
                abort(404);
            }
            $picId = array_key_exists('pic_id', $data) ? $data['pic_id'] : ($before->pic_id ?? null);
            $parentId = array_key_exists('parent_id', $data) ? $data['parent_id'] : ($before->parent_id ?? null);
            $descendants = $data['can_use_descendant_indicators'] ?? ($before->can_use_descendant_indicators ?? false);
            if (! $picId && ! $data['location_ids']) {
                throw ValidationException::withMessages(['location_ids' => 'Pilih unit pelaksana atau hubungkan PIC jabatan.']);
            }
            if ($descendants && ! $picId) {
                throw ValidationException::withMessages(['pic_id' => 'Hubungkan PIC jabatan sebelum memberi akses indikator bawahan.']);
            }
            $visited = $id ? [(int) $id] : [];
            $ancestorId = $parentId;
            while ($ancestorId) {
                if (in_array((int) $ancestorId, $visited, true)) {
                    throw ValidationException::withMessages(['parent_id' => 'Atasan jabatan tidak boleh membentuk hubungan berputar.']);
                }
                $visited[] = (int) $ancestorId;
                $ancestor = DB::table('kinerja_penanggung_jawabs')->where('id', $ancestorId)->first();
                if (! $ancestor || ! $ancestor->is_active) {
                    throw ValidationException::withMessages(['parent_id' => 'Pilih atasan jabatan yang aktif.']);
                }
                $ancestorId = $ancestor->parent_id;
            }
            $oldUnits = $id ? DB::table('kinerja_penanggung_jawab_units')->where('penanggung_jawab_id', $id)->pluck('location_id')->all() : [];
            if ($id && ! $data['is_active']) {
                foreach (CascadingHierarchyService::TABLES as $table) {
                    if (DB::table($table)->whereIn('periode_kinerja_id', $openPeriods)->where('penanggung_jawab_id', $id)->where('is_active', true)->exists()) {
                        throw ValidationException::withMessages(['is_active' => 'Penanggung jawab masih dipakai indikator aktif. Ganti penanggung jawab indikator terlebih dahulu.']);
                    }
                }
            }
            $name = $picId ? DB::table('pics')->where('id', $picId)->value('name') : trim($data['name']);
            if (DB::table('kinerja_penanggung_jawabs')->where('name', $name)->when($id, fn ($q) => $q->where('id', '<>', $id))->exists()) {
                throw ValidationException::withMessages(['name' => 'Nama jabatan sudah digunakan. Hubungkan PIC pada jabatan yang sudah ada.']);
            }
            $attributes = ['name' => $name, 'is_active' => $data['is_active'], 'pic_id' => $picId,
                'parent_id' => $parentId, 'can_use_descendant_indicators' => $descendants, 'updated_at' => now()];
            if ($id) {
                DB::table('kinerja_penanggung_jawabs')->where('id', $id)->update($attributes);
            } else {
                $id = DB::table('kinerja_penanggung_jawabs')->insertGetId($attributes + ['created_at' => now()]);
            }
            $units = array_map('intval', $data['location_ids']);
            sort($units);
            DB::table('kinerja_penanggung_jawab_units')->where('penanggung_jawab_id', $id)->delete();
            DB::table('kinerja_penanggung_jawab_units')->insert(array_map(fn ($unit) => ['penanggung_jawab_id' => $id, 'location_id' => $unit], $units));
            foreach (CascadingHierarchyService::TABLES as $level => $table) {
                $changes = ['jabatan' => $attributes['name'], 'updated_at' => now()];
                if ((string) $level === '4') {
                    $changes['location_id'] = json_encode($units);
                }
                $syncPeriods = $table === 'indikator_fitur4s'
                    ? PeriodeKinerja::whereIn('id', $openPeriods)->where('feature_schema_version', '<>', 2)->pluck('id')
                    : $openPeriods;
                DB::table($table)->whereIn('periode_kinerja_id', $syncPeriods)->where('penanggung_jawab_id', $id)->update($changes);
                if ($table === 'indikator_fitur4s') {
                    foreach (DB::table($table)->whereIn('periode_kinerja_id', $syncPeriods)->where('penanggung_jawab_id', $id)->get()->unique('master_id') as $placement) {
                        \App\Services\Fitur4Master::syncFromPlacement($placement->id);
                    }
                }
            }
            activity('indikator_tahunan')->causedBy(auth()->user())->withProperties([
                'penanggung_jawab_id' => $id, 'old' => (array) $before + ['location_ids' => $oldUnits],
                'attributes' => $attributes + ['location_ids' => $units], 'periode_ids' => $openPeriods->all(),
            ])->log('Master penanggung jawab disimpan');
        });

        return back()->with(['type' => 'success', 'message' => 'Master penanggung jawab dan unit indikator periode terbuka berhasil disimpan.']);
    }

    public function mapping(Request $request)
    {
        $data = $request->validate(['source_indicator_id' => 'required|exists:indikator_fitur4s,id', 'target_period_id' => 'required|exists:periode_kinerjas,id',
            'target_indicator_id' => ['required', Rule::exists('indikator_fitur4s', 'id')->where('periode_kinerja_id', $request->target_period_id)->where('is_active', true)]]);
        DB::transaction(function () use ($data) {
            $period = PeriodeKinerja::whereKey($data['target_period_id'])->lockForUpdate()->firstOrFail();
            if ($period->status === 'ditutup') {
                throw ValidationException::withMessages(['target_period_id' => 'Periode tujuan ditutup.']);
            }
            DB::table('indikator_year_mappings')->updateOrInsert(['source_indicator_id' => $data['source_indicator_id'], 'target_period_id' => $period->id],
                ['target_indicator_id' => $data['target_indicator_id'], 'mapped_by' => auth()->id(), 'updated_at' => now(), 'created_at' => now()]);
        });

        return back()->with('message', 'Pemetaan disimpan. Jalankan ulang preview copy risiko.');
    }

    public function export(PeriodeKinerja $period, CascadingExportService $service)
    {
        return $service->download($period);
    }

    public function archivedExport(int $export, CascadingExportService $service)
    {
        return $service->downloadArchive($export);
    }
}
