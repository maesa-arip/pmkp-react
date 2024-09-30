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
        Schema::create('fgd_actuals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('risk_register_id')->constrained();
            $table->integer('dampak_responden1')->nullable();
            $table->integer('dampak_responden2')->nullable();
            $table->integer('dampak_responden3')->nullable();
            $table->integer('dampak_responden4')->nullable();
            $table->integer('dampak_responden5')->nullable();
            $table->integer('dampak_responden6')->nullable();
            $table->integer('dampak_responden7')->nullable();
            $table->integer('dampak_responden8')->nullable();
            $table->integer('probabilitas_responden1')->nullable();
            $table->integer('probabilitas_responden2')->nullable();
            $table->integer('probabilitas_responden3')->nullable();
            $table->integer('probabilitas_responden4')->nullable();
            $table->integer('probabilitas_responden5')->nullable();
            $table->integer('probabilitas_responden6')->nullable();
            $table->integer('probabilitas_responden7')->nullable();
            $table->integer('probabilitas_responden8')->nullable();
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
        Schema::dropIfExists('fgd_actuals');
    }
};
