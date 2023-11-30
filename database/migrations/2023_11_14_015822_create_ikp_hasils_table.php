<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ikp_hasils', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ikp_pasien_id')->constrained();
            $table->string('penyebab');
            $table->string('akarmasalah');
            $table->string('rekomendasi');
            $table->string('pj1');
            $table->timestamp('tanggal_rekomendasi');
            $table->string('tindakan');
            $table->string('pj2');
            $table->timestamp('tanggal_tindakan');
            $table->string('nama');
            $table->boolean('verifikasi');
            $table->timestamp('tanggal_mulai_investigasi');
            $table->timestamp('tanggal_selesaii_investigasi');
            $table->boolean('investigasi_lengkap');
            $table->timestamp('tanggal_investigasi');
            $table->boolean('investigasi_lanjut');
            $table->tinyInteger('ikp_dampak2_id');
            $table->tinyInteger('ikp_probabilitas2_id');
            $table->string('concatdp2');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ikp_hasils');
    }
};
