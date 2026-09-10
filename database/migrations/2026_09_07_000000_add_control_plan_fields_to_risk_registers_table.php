<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('risk_registers', function (Blueprint $table) {
            $table->string('c_uc')->nullable()->after('pernyataan_risiko');
            $table->string('celah_pengendalian')->nullable()->after('pengendalian_harus_ada');
            $table->text('media_pengkomunikasian')->nullable()->after('celah_pengendalian');
            $table->text('penyedia_informasi')->nullable()->after('media_pengkomunikasian');
            $table->text('penerima_informasi')->nullable()->after('penyedia_informasi');
        });
    }

    public function down()
    {
        Schema::table('risk_registers', function (Blueprint $table) {
            $table->dropColumn([
                'c_uc',
                'celah_pengendalian',
                'media_pengkomunikasian',
                'penyedia_informasi',
                'penerima_informasi',
            ]);
        });
    }
};
