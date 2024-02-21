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
        Schema::create('mutu_units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mutu_indikator_id')->constrained();
            $table->integer('bulan');
            $table->integer('tahun');
            $table->string('num');
            $table->string('denum');
            $table->float('capaian');
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
        Schema::dropIfExists('mutu_units');
    }
};
