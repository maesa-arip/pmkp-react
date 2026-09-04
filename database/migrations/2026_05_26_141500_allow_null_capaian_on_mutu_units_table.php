<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('mutu_units', 'capaian')) {
            return;
        }

        DB::statement('ALTER TABLE mutu_units MODIFY capaian FLOAT NULL');
    }

    public function down(): void
    {
        if (!Schema::hasColumn('mutu_units', 'capaian')) {
            return;
        }

        DB::table('mutu_units')->whereNull('capaian')->update(['capaian' => 0]);
        DB::statement('ALTER TABLE mutu_units MODIFY capaian FLOAT NOT NULL');
    }
};
