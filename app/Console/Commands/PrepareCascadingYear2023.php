<?php

namespace App\Console\Commands;

use App\Models\PeriodeKinerja;
use App\Services\AnnualIndicatorService;
use App\Services\CascadingHierarchyService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use RuntimeException;

/**
 * Catch-up for servers prepared before this decision. The 2023 registers use the same
 * legacy hierarchy as 2024 and 2025, so 2023 gets an identical closed period copied
 * from 2024. Only 2026 onwards carries the new feature 1-3 structure.
 *
 * A server without any period uses cascading:prepare-2023-2026 instead, which already
 * covers 2023 in its single run. See docs/CASCADING-PRODUCTION-2024-2026.md.
 */
class PrepareCascadingYear2023 extends Command
{
    protected $signature = 'cascading:prepare-2023 {--apply : Simpan; tanpa opsi ini transaksi dibatalkan} {--backup= : Path cadangan SQL lengkap}';

    protected $description = 'Salin hierarki 2024 ke periode 2023 yang ditutup agar register 2023 punya penempatan indikator';

    public function handle(AnnualIndicatorService $service): int
    {
        $backup = $this->option('backup');
        if ($this->option('apply') && (! $backup || ! is_file($backup) || filesize($backup) < 1000)) {
            $this->error('Cadangan SQL lengkap wajib tersedia sebelum penerapan.');

            return self::FAILURE;
        }
        DB::beginTransaction();
        try {
            $source = PeriodeKinerja::where('tahun', 2024)->firstOrFail();
            if ((int) $source->feature_schema_version !== 1) {
                throw new RuntimeException('Periode 2024 bukan struktur fitur lama.');
            }
            if (PeriodeKinerja::where('tahun', 2023)->exists()) {
                throw new RuntimeException('Periode 2023 sudah tersedia.');
            }
            $before = $this->hierarchyText(2023);
            $period = PeriodeKinerja::create([
                'tahun' => 2023, 'status' => 'draft', 'feature_schema_version' => 1, 'rekonstruksi' => true,
                'nama_organisasi' => $source->nama_organisasi, 'tujuan' => $source->tujuan,
                'reconstruction_notes' => ['source' => 'Salinan periode 2024', 'note' => 'Register 2023 memakai hierarki lama yang sama dengan 2024 dan 2025. Perubahan fitur 1-3 berlaku mulai 2026.'],
            ]);
            $service->copyHierarchy($source->id, $period);
            $counts = [];
            foreach (CascadingHierarchyService::TABLES as $level => $table) {
                $counts[$table] = DB::table($table)->where('periode_kinerja_id', $period->id)->count();
                $expected = DB::table($table)->where('periode_kinerja_id', $source->id)->count();
                if ($counts[$table] !== $expected) {
                    throw new RuntimeException("Jumlah {$table} berbeda dari 2024: {$counts[$table]} vs {$expected}.");
                }
                if ($level === '4' && DB::table($table)->where('periode_kinerja_id', $period->id)->whereNull('indikator_fitur3_id')->exists()) {
                    throw new RuntimeException('Ada penempatan fitur 4 tanpa induk pada 2023.');
                }
            }
            $missing = DB::table('risk_registers')->whereNull('deleted_at')->whereYear('tgl_register', 2023)
                ->whereNotIn('indikator_fitur4_id', DB::table('indikator_fitur4s')->where('periode_kinerja_id', $period->id)->select('master_id'))
                ->count();
            if ($missing) {
                throw new RuntimeException("{$missing} register 2023 tidak menemukan penempatan indikatornya.");
            }
            $period->update(['status' => 'ditutup', 'closed_at' => now()]);
            // The report wording of 2023 must not shift; the copy only adds a placement path.
            $after = $this->hierarchyText(2023);
            if ($before !== $after) {
                throw new RuntimeException('Teks hierarki register 2023 berubah setelah penyalinan.');
            }
            $report = ['applied' => (bool) $this->option('apply'), 'periode_id' => $period->id, 'status' => 'ditutup',
                'counts' => $counts, 'register_2023' => count($before), 'hierarchy_text_unchanged' => true];
            $this->line(json_encode($report, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            if ($this->option('apply')) {
                activity('indikator_tahunan')->performedOn($period)->withProperties($report)->log('Hierarki 2024 disalin ke periode 2023 yang ditutup.');
                DB::commit();
            } else {
                DB::rollBack();
            }

            return self::SUCCESS;
        } catch (\Throwable $e) {
            DB::rollBack();
            $this->error($e->getMessage());

            return self::FAILURE;
        }
    }

    /** Sasaran/program/kegiatan/indikator exactly as the register exports resolve them today. */
    private function hierarchyText(int $year): array
    {
        return DB::table('risk_registers')->whereNull('risk_registers.deleted_at')->whereYear('tgl_register', $year)
            ->leftJoin('indikator_fitur4s', 'indikator_fitur4s.id', 'risk_registers.indikator_fitur4_id')
            ->leftJoin('indikator_fitur3s', 'indikator_fitur3s.id', 'indikator_fitur4s.indikator_fitur3_id')
            ->leftJoin('indikator_fitur2s', 'indikator_fitur2s.id', 'indikator_fitur3s.indikator_fitur2_id')
            ->leftJoin('indikator_fitur1s', 'indikator_fitur1s.id', 'indikator_fitur2s.indikator_fitur1_id')
            ->orderBy('risk_registers.id')
            ->selectRaw("risk_registers.id, concat_ws('\\n', indikator_fitur1s.name, indikator_fitur2s.name, indikator_fitur3s.name, indikator_fitur3s.tujuan, indikator_fitur4s.name) as teks")
            ->get()->pluck('teks', 'id')->all();
    }
}
