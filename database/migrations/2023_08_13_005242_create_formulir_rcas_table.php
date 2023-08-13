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
        Schema::create('formulir_rcas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('risk_register_id')->constrained();
            $table->string('why1')->nullable();
            $table->string('why2')->nullable();
            $table->string('why3')->nullable();
            $table->string('why4')->nullable();
            $table->string('why5')->nullable();
            $table->string('akar_penyebab')->nullable();
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
        Schema::dropIfExists('formulir_rcas');
    }
};
