<?php

namespace App\Console\Commands;

use App\Services\CascadingConceptImportService;
use App\Services\CascadingConceptParser;
use Illuminate\Console\Command;

class ImportCascadingConcepts extends Command
{
    protected $signature = 'cascading:import-concepts {year} {--apply}';

    protected $description = 'Perbaiki konsep cascading dari lima sheet dengan mempertahankan ID indikator lama';

    public function handle(): int
    {
        try {
            $year = filter_var($this->argument('year'), FILTER_VALIDATE_INT);
            if (! $year || $year < 2000 || $year > 2100) {
                throw new \RuntimeException('Tahun tidak valid.');
            }
            $path = base_path('docs/CASCADING.xlsx');
            $plan = app(CascadingConceptParser::class)->parse($path);
            $result = $this->option('apply') ? app(CascadingConceptImportService::class)->import($path, $year) :
                ['count' => count($plan['nodes']), 'kinds' => array_count_values(array_column($plan['nodes'], 'kind')), 'warnings' => $plan['warnings']];
            $this->line(json_encode($result, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

            return self::SUCCESS;
        } catch(\Throwable $e) {
            $this->error($e->getMessage());

            return self::FAILURE;
        }
    }
}
