<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cascading_concepts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('periode_kinerja_id')->constrained('periode_kinerjas')->restrictOnDelete();
            $table->string('kind', 40);
            $table->string('tier', 30);
            $table->string('office');
            $table->string('code', 80)->nullable();
            $table->text('name');
            $table->foreignId('parent_id')->nullable()->constrained('cascading_concepts')->restrictOnDelete();
            $table->text('relation_note')->nullable();
            $table->string('source_sheet');
            $table->string('source_cell', 12);
            $table->string('legacy_table')->nullable();
            $table->unsignedBigInteger('legacy_id')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->unique(['periode_kinerja_id', 'source_sheet', 'source_cell'], 'cascading_concept_source_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cascading_concepts');
    }
};
