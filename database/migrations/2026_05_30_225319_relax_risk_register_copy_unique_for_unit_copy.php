<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if ($this->hasIndex('risk_registers_copy_source_target_unique')) {
            if (!$this->hasIndex('risk_registers_copy_source_index')) {
                DB::statement('ALTER TABLE risk_registers ADD INDEX risk_registers_copy_source_index (copied_from_risk_register_id)');
            }

            DB::statement('ALTER TABLE risk_registers DROP INDEX risk_registers_copy_source_target_unique');
        }

        if (Schema::hasColumn('risk_registers', 'copy_type')) {
            DB::table('risk_registers')
                ->whereNotNull('copied_from_risk_register_id')
                ->whereNull('copy_type')
                ->update(['copy_type' => 'year']);
        }
    }

    public function down(): void
    {
        // Do not recreate the old unique index. Unit copy can legitimately create
        // multiple rows from the same source risk and target year for different units.
    }

    private function hasIndex(string $indexName): bool
    {
        return collect(DB::select('SHOW INDEX FROM risk_registers'))
            ->contains(fn ($index) => $index->Key_name === $indexName);
    }
};
