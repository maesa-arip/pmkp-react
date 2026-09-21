<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('periode_kinerjas', function (Blueprint $t) {
            $t->id();
            $t->unsignedSmallInteger('tahun')->unique();
            $t->string('status', 20)->default('draft');
            $t->string('nama_organisasi')->default('RSUD Bali Mandara Provinsi Bali');
            $t->text('tujuan')->nullable();
            $t->boolean('rekonstruksi')->default(false);
            $t->timestamp('activated_at')->nullable();
            $t->timestamp('closed_at')->nullable();
            $t->unsignedBigInteger('updated_by')->nullable();
            $t->timestamps();
        });
        foreach (['sasaran_strategis', 'indikator_fitur1s', 'indikator_fitur2s', 'indikator_fitur3s', 'indikator_fitur4s', 'indikator_fitur04s', 'mutu_indikators'] as $table) {
            if (! Schema::hasTable($table)) {
                continue;
            }
            Schema::table($table, function (Blueprint $t) use ($table) {
                $t->foreignId('periode_kinerja_id')->nullable()->constrained('periode_kinerjas')->restrictOnDelete();
                $t->uuid('lineage_id')->nullable();
                $t->unsignedBigInteger('copied_from_id')->nullable();
                $t->boolean('is_active')->default(true);
                $t->unsignedInteger('sort_order')->default(0);
                $t->unique(['periode_kinerja_id', 'lineage_id'], $table.'_period_lineage');
                if ($table !== 'mutu_indikators') {
                    $t->string('jabatan')->nullable();
                    $t->string('kode_cascading', 50)->nullable();
                }
            });
        }
        Schema::table('risk_registers', function (Blueprint $t) {
            $t->foreignId('periode_kinerja_id')->nullable()->constrained('periode_kinerjas')->restrictOnDelete();
            $t->json('indikator_snapshot')->nullable();
            $t->boolean('needs_review')->default(false);
            $t->string('copy_key', 64)->nullable()->unique();
        });
        Schema::create('indikator_year_mappings', function (Blueprint $t) {
            $t->id();
            $t->unsignedBigInteger('source_indicator_id');
            $t->foreignId('target_period_id')->constrained('periode_kinerjas')->restrictOnDelete();
            $t->unsignedBigInteger('target_indicator_id');
            $t->unsignedBigInteger('mapped_by')->nullable();
            $t->timestamps();
            $t->unique(['source_indicator_id', 'target_period_id'], 'indicator_mapping_source_period');
        });
        Schema::create('cascading_exports', function (Blueprint $t) {
            $t->id();
            $t->foreignId('periode_kinerja_id')->constrained('periode_kinerjas')->restrictOnDelete();
            $t->string('template_version', 30);
            $t->json('snapshot');
            $t->unsignedBigInteger('created_by')->nullable();
            $t->timestamps();
        });
    }

    public function down(): void
    {
        // Annual IDs may already be referenced by registers and MUTU. Restore a verified
        // backup for rollback; dropping these columns would silently destroy provenance.
        throw new RuntimeException('Rollback periode tahunan memerlukan pemulihan backup terverifikasi.');
    }
};
