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
            $table->string('penyebab');
            $table->string('akarmasalah');
            $table->string('rekomendasi');
            $table->foreignId('pic_id');
            $table->timestamp('tanggal_rekomendasi');
            $table->string('tindakan');
            $table->foreignId('pic2_id');
            $table->timestamp('tanggal_tindakan');
            $table->string('nama');
            $table->boolean('verifikasi');
            $table->timestamp('tanggal_mulai_investigasi');
            $table->timestamp('tanggal_selesaii_investigasi');
            $table->boolean('verifikasi_lengkap');
            $table->timestamp('tanggal_investigasi');
            $table->boolean('investigasi_lanjut');
            $table->foreignId('ikp_dampak_id')->constrained();
            $table->foreignId('ikp_probabilitas_id')->constrained();
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
