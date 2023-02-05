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
        Schema::create('risk_registers', function (Blueprint $table) {
            $table->id();
            $table->tinyInteger('tipe_id');
            $table->tinyInteger('proses_id');
            $table->timestamp('tgl_register')->nullable();
            $table->timestamp('tgl_selesai')->nullable();
            $table->foreignId('risk_category_id')->constrained();
            $table->foreignId('identification_source_id')->constrained();
            $table->foreignId('location_id')->constrained();
            $table->text('pernyataan_risiko');
            $table->text('sebab');
            $table->foreignId('risk_variety_id')->constrained();
            $table->foreignId('risk_type_id')->constrained();
            $table->text('efek');
            $table->tinyInteger('osd1_dampak');
            $table->tinyInteger('osd1_probabilitas');
            $table->tinyInteger('osd1_controllability');
            $table->tinyInteger('osd1_inherent');
            $table->tinyInteger('osd2_dampak');
            $table->tinyInteger('osd2_probabilitas');
            $table->tinyInteger('osd2_controllability');
            $table->tinyInteger('osd2_inherent');
            $table->tinyInteger('grading');
            $table->text('pengendalian_risiko');
            $table->foreignId('pic_id')->constrained();
            $table->foreignId('user_id')->constrained();
            $table->tinyInteger('pengawasan_id');
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
        Schema::dropIfExists('risk_registers');
    }
};
