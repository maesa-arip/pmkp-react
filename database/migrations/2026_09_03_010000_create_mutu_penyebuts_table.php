<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('mutu_penyebuts', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->decimal('multiplier', 10, 2)->default(1);
            $table->timestamps();
        });

        DB::table('mutu_penyebuts')->insert([
            ['name' => '%', 'multiplier' => 100, 'created_at' => now(), 'updated_at' => now()],
            ['name' => '‰', 'multiplier' => 1000, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'menit', 'multiplier' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'angka bulat', 'multiplier' => 1, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down()
    {
        Schema::dropIfExists('mutu_penyebuts');
    }
};
