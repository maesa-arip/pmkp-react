<?php

namespace App\Console\Commands;

use App\Services\CascadingYearsPreparation;
use Illuminate\Console\Command;

class PrepareCascadingYears extends Command
{
    protected $signature = 'cascading:prepare-2024-2026 {--apply : Simpan; tanpa opsi ini transaksi dibatalkan} {--backup= : Path cadangan SQL lengkap}';

    protected $description = 'Persiapan cascading historis 2024/2025 dan Excel aktif 2026 sesuai persetujuan pengguna';

    public function handle(CascadingYearsPreparation $service): int
    {
        try {
            if ($this->option('apply') && (! $this->option('backup') || ! is_file($this->option('backup')) || filesize($this->option('backup')) < 1000)) {
                throw new \RuntimeException('Cadangan SQL lengkap wajib tersedia sebelum penerapan.');
            }
            $result = $service->run(base_path('docs/CASCADING.xlsx'), (bool) $this->option('apply'));
            $this->line(json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

            return self::SUCCESS;
        } catch (\Throwable $e) {
            $this->error($e->getMessage());

            return self::FAILURE;
        }
    }
}
