<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private array $columns = [
        'name_klinis_pergub' => ['after' => 'warna_nonklinis'],
        'warna_klinis_pergub' => ['after' => 'name_klinis_pergub', 'length' => 20],
        'name_klinis_bpkp' => ['after' => 'warna_nonklinis_pergub'],
        'warna_klinis_bpkp' => ['after' => 'name_klinis_bpkp', 'length' => 20],
        'name_nonklinis_bpkp' => ['after' => 'warna_klinis_bpkp'],
        'warna_nonklinis_bpkp' => ['after' => 'name_nonklinis_bpkp', 'length' => 20],
    ];

    public function up(): void
    {
        if (!Schema::hasTable('risk_gradings')) {
            return;
        }

        Schema::table('risk_gradings', function (Blueprint $table) {
            foreach ($this->columns as $column => $options) {
                if (Schema::hasColumn('risk_gradings', $column)) {
                    continue;
                }

                $definition = $table->string($column, $options['length'] ?? 255)->nullable();

                if (isset($options['after'])) {
                    $definition->after($options['after']);
                }
            }
        });

        DB::table('risk_gradings')->update([
            'name_klinis_pergub' => DB::raw('COALESCE(name_klinis_pergub, name_nonklinis_pergub)'),
            'warna_klinis_pergub' => DB::raw('COALESCE(warna_klinis_pergub, warna_nonklinis_pergub)'),
            'name_klinis_bpkp' => DB::raw('COALESCE(name_klinis_bpkp, name_bpkp)'),
            'warna_klinis_bpkp' => DB::raw('COALESCE(warna_klinis_bpkp, warna_bpkp)'),
            'name_nonklinis_bpkp' => DB::raw('COALESCE(name_nonklinis_bpkp, name_bpkp)'),
            'warna_nonklinis_bpkp' => DB::raw('COALESCE(warna_nonklinis_bpkp, warna_bpkp)'),
            'updated_at' => now(),
        ]);

        if (Schema::hasTable('risk_grading_settings')) {
            DB::table('risk_grading_settings')
                ->where('value', 'bpkp')
                ->update(['value' => 'nonklinis_bpkp', 'updated_at' => now()]);
        }
    }

    public function down(): void
    {
        if (!Schema::hasTable('risk_gradings')) {
            return;
        }

        Schema::table('risk_gradings', function (Blueprint $table) {
            foreach (array_reverse(array_keys($this->columns)) as $column) {
                if (Schema::hasColumn('risk_gradings', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
