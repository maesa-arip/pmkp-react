<?php

namespace App\Console\Commands;

use App\Services\CascadingFeatureAlignment;
use Illuminate\Console\Command;

class AlignCascadingFeatures extends Command
{
    protected $signature = 'cascading:align-features {year}';

    protected $description = 'Selaraskan draft cascading ke IKU, kegiatan Wadir, kegiatan Kabag/Kabid, dan indikator mutu';

    public function handle(): int
    {
        try {
            $r = app(CascadingFeatureAlignment::class)->apply((int) $this->argument('year'));
            \App\Services\Fitur4Master::ensureAll();
            $this->line(json_encode($r, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

            return self::SUCCESS;
        } catch(\Throwable $e) {
            $this->error($e->getMessage());

            return self::FAILURE;
        }
    }
}
