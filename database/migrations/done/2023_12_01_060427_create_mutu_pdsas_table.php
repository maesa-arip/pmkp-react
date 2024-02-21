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
        Schema::create('mutu_pdsas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mutu_unit_id')->constrained();
            $table->string('problem');
            $table->string('step');
            $table->string('plan_rencana');
            $table->string('plan_harapan');
            $table->string('do');
            $table->string('study');
            $table->string('action');
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
        Schema::dropIfExists('mutu_pdsas');
    }
};
