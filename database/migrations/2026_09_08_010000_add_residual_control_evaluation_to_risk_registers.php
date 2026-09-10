<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('risk_registers', function (Blueprint $table) {
            $table->boolean('osd2_pengendalian_dilakukan')->nullable();
            $table->boolean('osd2_pengendalian_efektif')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('risk_registers', function (Blueprint $table) {
            $table->dropColumn(['osd2_pengendalian_dilakukan', 'osd2_pengendalian_efektif']);
        });
    }
};
