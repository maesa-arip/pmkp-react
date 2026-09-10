<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run archived project migrations that are stored outside Laravel's
     * top-level migration scan path.
     */
    public function up()
    {
        foreach ($this->archivedMigrationFiles() as $file) {
            $table = $this->tableNameFromCreateMigration($file);

            if ($table && Schema::hasTable($table)) {
                continue;
            }

            $migration = $this->resolveMigration($file);

            if (method_exists($migration, 'up')) {
                $migration->up();
            }
        }
    }

    /**
     * Reverse archived migrations in the opposite order.
     */
    public function down()
    {
        $files = array_reverse($this->archivedMigrationFiles());

        foreach ($files as $file) {
            $migration = $this->resolveMigration($file);

            if (method_exists($migration, 'down')) {
                $migration->down();
            }
        }
    }

    private function archivedMigrationFiles(): array
    {
        return collect([
            database_path('migrations/done'),
            database_path('migrations/ikp'),
        ])
            ->flatMap(fn ($path) => glob($path.'/*.php') ?: [])
            ->sortBy(fn ($path) => str_contains($path, 'create_risk_registers_table')
                ? '2023_04_03_000000_create_risk_registers_table.php'
                : basename($path))
            ->map(fn ($path) => new SplFileInfo($path))
            ->values()
            ->all();
    }

    private function resolveMigration(SplFileInfo $file): object
    {
        if (!$this->usesNamedClass($file)) {
            return require $file->getPathname();
        }

        require_once $file->getPathname();

        $name = $this->classNameFromMigrationFile($file);

        return new $name();
    }

    private function usesNamedClass(SplFileInfo $file): bool
    {
        return str_contains(file_get_contents($file->getPathname()), 'class '.$this->classNameFromMigrationFile($file));
    }

    private function classNameFromMigrationFile(SplFileInfo $file): string
    {
        return Str::studly(implode('_', array_slice(explode('_', $file->getBasename('.php')), 4)));
    }

    private function tableNameFromCreateMigration(SplFileInfo $file): ?string
    {
        $migrationName = implode('_', array_slice(explode('_', $file->getBasename('.php')), 4));

        if (!str_starts_with($migrationName, 'create_') || !str_ends_with($migrationName, '_table')) {
            return null;
        }

        return Str::before(Str::after($migrationName, 'create_'), '_table');
    }
};
