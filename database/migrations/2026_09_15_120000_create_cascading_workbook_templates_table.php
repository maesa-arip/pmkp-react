<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cascading_workbook_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('periode_kinerja_id')->unique()->constrained('periode_kinerjas')->restrictOnDelete();
            $table->string('source_name');
            $table->string('source_sha256', 64);
            $table->string('sheet_name');
            $table->longText('workbook_base64');
            $table->json('bindings');
            $table->json('structure');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cascading_workbook_templates');
    }
};