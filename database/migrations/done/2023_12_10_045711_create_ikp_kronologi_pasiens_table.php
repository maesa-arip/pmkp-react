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
        Schema::create('ikp_kronologi_pasiens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ikp_pasien_id')->constrained();
            $table->dateTime('waktu');
            $table->text('kronologi');
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
        Schema::dropIfExists('ikp_kronologi_pasiens');
    }
};
