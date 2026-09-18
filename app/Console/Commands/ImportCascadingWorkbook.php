<?php

namespace App\Console\Commands;

use App\Services\AnnualIndicatorService;
use App\Services\CascadingWorkbookImportService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Throwable;

class ImportCascadingWorkbook extends Command
{
    protected $signature = 'cascading:import-workbook {year} {file=docs/CASCADING.xlsx} {--apply : Simpan ke periode draft kosong}';
    protected $description = 'Periksa/impor lembar utama CASCADING beserta pemetaan sel untuk ekspor sesuai sumber';

    public function handle(CascadingWorkbookImportService $service): int
    {
        try {
            $year = filter_var($this->argument('year'), FILTER_VALIDATE_INT);
            if (! $year || $year < 2000 || $year > 2100) {
                throw new \RuntimeException('Tahun harus antara 2000 dan 2100.');
            }
            $path = realpath($this->argument('file'));
            if (! $path) {
                throw new \RuntimeException('File sumber tidak ditemukan.');
            }
            $plan = $service->inspect($path);
            $this->line(json_encode(['year' => $year, 'sheet' => $service::SHEET, 'counts' => $plan['counts'],
                'warnings' => $plan['warnings'], 'source_sha256' => $plan['source_sha256']], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
            if (! $this->option('apply')) {
                $this->info('Pemeriksaan selesai. Database belum diubah.');
                return self::SUCCESS;
            }
            $period = DB::table('periode_kinerjas')->where('tahun', $year)->first();
            $backup = ['period' => $period, 'tables' => []];
            foreach (AnnualIndicatorService::TABLES as $table) {
                $backup['tables'][$table] = $period ? DB::table($table)->where('periode_kinerja_id', $period->id)->get()->all() : [];
            }
            $backup['positions'] = DB::table('kinerja_penanggung_jawabs')->get()->all();
            File::ensureDirectoryExists(storage_path('app/cascading-import-backups'));
            $backupPath = storage_path('app/cascading-import-backups/'.$year.'-'.now()->format('Ymd-His').'-'.bin2hex(random_bytes(3)).'.json');
            File::put($backupPath, json_encode($backup, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR));
            $result = $service->import($path, $year);
            $this->info(json_encode($result, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
            $this->line('Cadangan: '.$backupPath);
            return self::SUCCESS;
        } catch (Throwable $e) {
            $this->error($e->getMessage());
            return self::FAILURE;
        }
    }
}