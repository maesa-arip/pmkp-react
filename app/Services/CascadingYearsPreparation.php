<?php

namespace App\Services;

use App\Models\PeriodeKinerja;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;

/**
 * Approved reconstruction: unchanged legacy source -> 2024 and 2025;
 * the supplied workbook -> active 2026. Transactional and intentionally one-shot.
 */
class CascadingYearsPreparation
{
    public function run(string $path, bool $apply = false): array
    {
        DB::beginTransaction();
        try {
            if (DB::table('periode_kinerjas')->exists()) {
                throw new RuntimeException('Periode sudah tersedia. Rekonsiliasi diperlukan sebelum mengulang persiapan.');
            }
            foreach (['kinerja_penanggung_jawabs', 'kinerja_penanggung_jawab_units', 'cascading_concepts', 'cascading_workbook_templates', 'indikator_kinerjas'] as $table) {
                if (DB::table($table)->exists()) {
                    throw new RuntimeException('Tabel awal tidak lagi kosong: '.$table);
                }
            }
            $source = [];
            $lineages = [];
            foreach (AnnualIndicatorService::TABLES as $table) {
                $source[$table] = DB::table($table)->whereNull('periode_kinerja_id')->orderBy('id')->get()->map(fn ($r) => (array) $r)->keyBy('id')->all();
                foreach ($source[$table] as $id => $row) {
                    $lineages[$table][$id] = $row['lineage_id'] ?: (string) Str::uuid();
                }
            }
            $expected = ['sasaran_strategis' => 10, 'indikator_fitur1s' => 4, 'indikator_fitur2s' => 25, 'indikator_fitur3s' => 55, 'indikator_fitur4s' => 571, 'indikator_fitur04s' => 0];
            foreach ($expected as $table => $count) {
                if (count($source[$table]) !== $count) {
                    throw new RuntimeException('Data sumber berubah: '.$table);
                }
            }
            $positions = $this->positions($source['indikator_fitur4s']);
            $orphans = array_values(array_filter(array_keys($source['sasaran_strategis']), fn ($id) => $source['sasaran_strategis'][$id]['parent_id'] && ! isset($source['sasaran_strategis'][$source['sasaran_strategis'][$id]['parent_id']])));
            if ($orphans !== [6, 9, 10, 12]) {
                throw new RuntimeException('Daftar sasaran tanpa induk berubah.');
            }
            $report = ['applied' => $apply, 'source_sha256' => hash_file('sha256', $path), 'orphan_sasaran_ids' => $orphans, 'periods' => []];
            foreach ([2024, 2025] as $year) {
                $period = PeriodeKinerja::create([
                    'tahun' => $year, 'status' => 'draft', 'feature_schema_version' => 1,
                    'nama_organisasi' => 'RSUD Bali Mandara Provinsi Bali', 'tujuan' => '', 'rekonstruksi' => true,
                    'reconstruction_notes' => [
                        'source' => 'Database hasil pemulihan, baris tanpa periode',
                        'orphan_sasaran_ids' => $orphans,
                        'original_parents' => array_map(fn ($id) => ['id' => $id, 'parent_id' => $source['sasaran_strategis'][$id]['parent_id']], $orphans),
                        'note' => 'Salinan 2024 dan 2025 sama dengan master sumber. Empat sasaran tanpa induk menjadi akar sesuai persetujuan pengguna; sumber asli dipertahankan.',
                    ],
                ]);
                $maps = [];
                foreach ($source as $table => $rows) {
                    $pending = $rows;
                    while ($pending) {
                        $progress = false;
                        foreach ($pending as $id => $row) {
                            if ($table === 'sasaran_strategis' && $row['parent_id'] && isset($rows[$row['parent_id']]) && ! isset($maps[$table][$row['parent_id']])) {
                                continue;
                            }
                            $data = $row;
                            unset($data['id']);
                            $data['periode_kinerja_id'] = $period->id;
                            $data['lineage_id'] = $lineages[$table][$id];
                            $data['copied_from_id'] = $id;
                            $data['created_at'] = $data['updated_at'] = now();
                            if ($table === 'sasaran_strategis') {
                                $data['parent_id'] = $maps[$table][$row['parent_id']] ?? 0;
                            }
                            foreach (array_filter([AnnualIndicatorService::PARENTS[$table] ?? null, isset($row['sasaran_strategis_id']) ? ['sasaran_strategis_id', 'sasaran_strategis'] : null]) as [$column,$parentTable]) {
                                if (! isset($maps[$parentTable][$row[$column]])) {
                                    throw new RuntimeException('Induk tidak tersedia: '.$table.'#'.$id);
                                }
                                $data[$column] = $maps[$parentTable][$row[$column]];
                            }
                            if (array_key_exists('penanggung_jawab_id', $data)) {
                                $data['penanggung_jawab_id'] = $positions[$this->key($row['jabatan'] ?? '')] ?? null;
                            }
                            $maps[$table][$id] = DB::table($table)->insertGetId($data);
                            unset($pending[$id]);
                            $progress = true;
                        }
                        if (! $progress) {
                            throw new RuntimeException('Siklus data sumber.');
                        }
                    }
                }
                $this->verifyCopy($source, $maps, $period);
                $this->verifyHierarchy($period);
                $period->update(['status' => 'ditutup', 'closed_at' => now()]);
                $report['periods'][$year] = ['id' => $period->id, 'status' => 'ditutup', 'counts' => $expected, 'source_equal' => true];
            }
            app(CascadingWorkbookImportService::class)->import($path, 2026);
            app(CascadingConceptImportService::class)->import($path, 2026);
            $aligned = app(CascadingFeatureAlignment::class)->apply(2026);
            $period = PeriodeKinerja::where('tahun', 2026)->firstOrFail();
            $this->verifyHierarchy($period);
            $period->update(['status' => 'aktif', 'activated_at' => now()]);
            $report['periods'][2026] = ['id' => $period->id, 'status' => 'aktif', 'features' => $aligned['features'], 'performance_indicators' => $aligned['performance_indicators'], 'pending_owner_mapping' => $aligned['pending_owner_mapping']];
            foreach ($source as $table => $rows) {
                $after = DB::table($table)->whereNull('periode_kinerja_id')->orderBy('id')->get()->map(fn ($r) => (array) $r)->keyBy('id')->all();
                if ($rows !== $after) {
                    throw new RuntimeException('Sumber asli berubah: '.$table);
                }
            }
            $report['source_unchanged'] = true;
            // Level-four rows of every year get a permanent master after the source check.
            $report['fitur4_masters_created'] = Fitur4Master::ensureAll();
            if ($apply) {
                activity('indikator_tahunan')->withProperties($report)->log('Cascading lama disalin ke 2024 dan 2025; Excel menjadi cascading aktif 2026.');
                DB::commit();
            } else {
                DB::rollBack();
            }

            return $report;
        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        }
    }

    private function key(string $name): string
    {
        return mb_strtoupper(preg_replace('/\s+/u', ' ', trim($name)));
    }

    private function positions(array $legacyIndicators): array
    {
        $names = ['DIREKTUR', 'WAKIL DIREKTUR ADMINISTRASI DAN SUMBER DAYA', 'WAKIL DIREKTUR PELAYANAN', 'WAKIL DIREKTUR PENUNJANG', 'KEPALA BAGIAN PERENCANAAN DAN PENGEMBANGAN', 'KEPALA BAGIAN KEUANGAN', 'KEPALA BAGIAN ADMINISTRASI UMUM', 'KEPALA BIDANG PELAYANAN MEDIK', 'KEPALA BIDANG KEPERAWATAN', 'KEPALA BIDANG PENUNJANG MEDIK', 'KEPALA BIDANG PENUNJANG NON MEDIK'];
        $map = [];
        $parents = [1 => 0, 2 => 0, 3 => 0, 4 => 1, 5 => 1, 6 => 1, 7 => 2, 8 => 2, 9 => 3, 10 => 3];
        foreach ($names as $i => $name) {
            $pic = DB::table('pics')->where('name', $name)->first();
            if (! $pic) {
                throw new RuntimeException('PIC jabatan belum tersedia: '.$name);
            }
            $map[$name] = DB::table('kinerja_penanggung_jawabs')->insertGetId([
                'name' => $name, 'pic_id' => $pic->id, 'parent_id' => $i ? $map[$names[$parents[$i]]] : null,
                'is_active' => true, 'can_use_descendant_indicators' => false, 'created_at' => now(), 'updated_at' => now(),
            ]);
        }
        // Only inherit unit mappings explicitly attached to that same office in the legacy data.
        $locations = DB::table('locations')->pluck('id')->map(fn ($id) => (int) $id)->all();
        $links = [];
        foreach ($legacyIndicators as $row) {
            $position = $map[$this->key($row['jabatan'] ?? '')] ?? null;
            if (! $position) {
                continue;
            }
            foreach (AnnualIndicatorService::ids($row['location_id']) as $location) {
                if ($location === 0) {
                    continue;
                }
                if (! in_array($location, $locations, true)) {
                    throw new RuntimeException('Unit sumber tidak ditemukan: '.$location);
                }
                $links[$position.':'.$location] = ['penanggung_jawab_id' => $position, 'location_id' => $location];
            }
        }
        if ($links) {
            DB::table('kinerja_penanggung_jawab_units')->insert(array_values($links));
        }

        return $map;
    }

    private function verifyCopy(array $source, array $maps, PeriodeKinerja $period): void
    {
        foreach ($source as $table => $rows) {
            $copies = DB::table($table)->where('periode_kinerja_id', $period->id)->get()->keyBy('copied_from_id');
            if ($copies->count() !== count($rows)) {
                throw new RuntimeException('Jumlah salinan berbeda: '.$table);
            }
            foreach ($rows as $id => $row) {
                $copy = (array) $copies[$id];
                foreach (['id', 'periode_kinerja_id', 'lineage_id', 'copied_from_id', 'created_at', 'updated_at', 'penanggung_jawab_id'] as $column) {
                    unset($row[$column],$copy[$column]);
                }
                if ($table === 'sasaran_strategis') {
                    $row['parent_id'] = $maps[$table][$row['parent_id']] ?? 0;
                }
                foreach (array_filter([AnnualIndicatorService::PARENTS[$table] ?? null, isset($row['sasaran_strategis_id']) ? ['sasaran_strategis_id', 'sasaran_strategis'] : null]) as [$column,$parentTable]) {
                    $row[$column] = $maps[$parentTable][$row[$column]];
                }
                if ($row !== $copy) {
                    throw new RuntimeException('Isi salinan berubah: '.$table.'#'.$id);
                }
            }
        }
    }

    private function verifyHierarchy(PeriodeKinerja $period): void
    {
        $levels = [];
        foreach (CascadingHierarchyService::TABLES as $level => $table) {
            $levels[$level] = DB::table($table)->where('periode_kinerja_id', $period->id)->get()->all();
            foreach ($levels[$level] as $row) {
                $parents = array_filter([AnnualIndicatorService::PARENTS[$table] ?? null, ['sasaran_strategis_id', 'sasaran_strategis']]);
                foreach ($parents as [$column,$parentTable]) {
                    if (! DB::table($parentTable)->where('id', $row->$column)->where('periode_kinerja_id', $period->id)->exists()) {
                        throw new RuntimeException('Relasi lintas tahun/putus: '.$table.'#'.$row->id);
                    }
                }
            }
        }
        $hierarchy = app(CascadingHierarchyService::class);
        if ($hierarchy->unlinked($levels, $hierarchy->build($levels))) {
            throw new RuntimeException('Data aktif terputus dari bagan.');
        }
    }
}
