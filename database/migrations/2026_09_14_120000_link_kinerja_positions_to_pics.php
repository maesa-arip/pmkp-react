<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('kinerja_penanggung_jawabs', function (Blueprint $table) {
            $table->foreignId('pic_id')->nullable()->unique()->constrained('pics')->restrictOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('kinerja_penanggung_jawabs')->restrictOnDelete();
            $table->boolean('can_use_descendant_indicators')->default(false);
        });
    }

    public function down(): void
    {
        Schema::table('kinerja_penanggung_jawabs', function (Blueprint $table) {
            $table->dropConstrainedForeignId('parent_id');
            $table->dropConstrainedForeignId('pic_id');
            $table->dropColumn('can_use_descendant_indicators');
        });
    }
};
