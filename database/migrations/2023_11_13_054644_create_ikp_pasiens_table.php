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
        Schema::create('ikp_pasiens', function (Blueprint $table) {
            $table->id();
            $table->string('namapasien');
            $table->string('nrm');
            $table->integer('umur_tahun');
            $table->integer('umur_bulan');
            $table->integer('umur_hari');
            $table->foreignId('ikp_penanggung_id')->constrained();
            $table->string('jeniskelamin');
            $table->timestamp('tanggal_pelayanan');
            $table->timestamp('tanggal_insiden');
            $table->string('insiden');
            $table->string('kronologi');
            $table->foreignId('ikp_jenis_insiden_id')->constrained();
            $table->foreignId('ikp_tipe_insiden_id')->constrained();
            $table->foreignId('ikp_spesialisasi_id')->constrained();
            $table->foreignId('ikp_dampak_id');
            $table->foreignId('ikp_probabilitas_id');
            $table->string('concatdp');
            $table->foreignId('ikp_pelapor_id')->constrained();
            $table->foreignId('ikp_gruplayanan_id')->constrained();
            $table->foreignId('ikp_lokasi_id')->constrained();
            $table->string('lokasi_name');
            $table->foreignId('pic_id')->constrained();
            $table->string('tindak_lanjut_hasil');
            $table->foreignId('ikp_tindaklanjut_id')->constrained();
            $table->boolean('terjadi_tempatlain')->default(0);
            $table->foreignId('user_id')->constrained();
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
        Schema::dropIfExists('ikp_pasiens');
    }
};
