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
        Schema::create('request_updates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('risk_register_id')->constrained();
            $table->date('tgl_perbaikan');
            $table->time('jam_perbaikan');
            $table->string('upaya_pengendalian');
            $table->timestamp('tgl_update_status')->nullable();
            $table->boolean('is_approved')->default(0);
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
        Schema::dropIfExists('request_updates');
    }
};
