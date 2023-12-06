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
        Schema::create('mutu_indikators', function (Blueprint $table) {
            $table->id();
            $table->foreignId('indikator_fitur4_id')->constrained();
            $table->foreignId('mutu_kategori_id')->constrained();
            $table->foreignId('location_id')->constrained();
            $table->string('num_name');
            $table->string('denum_name');
            $table->float('standar');
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
        Schema::dropIfExists('mutu_indikators');
    }
};
