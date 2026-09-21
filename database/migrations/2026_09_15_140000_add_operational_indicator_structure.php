<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('periode_kinerjas', fn (Blueprint $t) => $t->unsignedTinyInteger('feature_schema_version')->default(1));
        Schema::create('indikator_kinerjas', function (Blueprint $t) {
            $t->id();
            $t->foreignId('periode_kinerja_id')->constrained('periode_kinerjas')->restrictOnDelete();
            $t->foreignId('indikator_fitur2_id')->nullable()->constrained('indikator_fitur2s')->restrictOnDelete();
            $t->foreignId('indikator_fitur3_id')->nullable()->constrained('indikator_fitur3s')->restrictOnDelete();
            $t->string('name');
            $t->string('kode_cascading', 50)->nullable();
            $t->string('jabatan')->nullable();
            $t->boolean('is_active')->default(true);
            $t->unsignedInteger('sort_order')->default(0);
            $t->uuid('lineage_id')->unique();
            $t->unsignedBigInteger('copied_from_id')->nullable();
            $t->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('indikator_kinerjas');
        Schema::table('periode_kinerjas', fn (Blueprint $t) => $t->dropColumn('feature_schema_version'));
    }
};
