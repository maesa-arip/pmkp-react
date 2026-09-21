<?php

use App\Services\Fitur4Master;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('indikator_fitur4s', function (Blueprint $t) {
            $t->foreignId('master_id')->nullable()->after('periode_kinerja_id')->constrained('indikator_fitur4s')->restrictOnDelete();
        });
        // A master linked to a year is not always positioned under an activity yet.
        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE indikator_fitur4s MODIFY indikator_fitur3_id BIGINT UNSIGNED NULL, MODIFY sasaran_strategis_id BIGINT UNSIGNED NULL');
        }
        // Existing yearly copies point to their legacy master; transactions already use it.
        DB::transaction(fn () => Fitur4Master::ensureAll());
    }

    public function down(): void
    {
        // Masters may already be referenced by placements and transactions.
        throw new RuntimeException('Rollback master fitur 4 memerlukan pemulihan backup terverifikasi.');
    }
};
