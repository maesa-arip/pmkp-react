<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('ikp_pasiens', function (Blueprint $table) {
            $table->boolean('risiko_teridentifikasi')->default(false)->after('langkah_tempatlain');
            $table->foreignId('risk_register_id')
                ->nullable()
                ->after('risiko_teridentifikasi')
                ->constrained('risk_registers')
                ->nullOnDelete();
        });
    }

    public function down()
    {
        Schema::table('ikp_pasiens', function (Blueprint $table) {
            $table->dropConstrainedForeignId('risk_register_id');
            $table->dropColumn('risiko_teridentifikasi');
        });
    }
};
