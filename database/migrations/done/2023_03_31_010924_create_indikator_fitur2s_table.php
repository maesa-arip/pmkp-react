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
        Schema::create('indikator_fitur2s', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sasaran_strategis_id')->constrained();
            $table->foreignId('indikator_fitur1_id')->constrained();
            $table->string('name');
            $table->string('tujuan');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('indikator_fitur2s');
    }
};
