<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('risk_grading_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('value', 50);
            $table->timestamps();
        });

        $now = now();
        DB::table('risk_grading_settings')->insert([
            ['key' => 'risk_register_klinis', 'value' => 'klinis', 'created_at' => $now, 'updated_at' => $now],
            ['key' => 'risk_register_nonklinis', 'value' => 'nonklinis_pergub', 'created_at' => $now, 'updated_at' => $now],
            ['key' => 'export_lars_dhp_klinis', 'value' => 'klinis', 'created_at' => $now, 'updated_at' => $now],
            ['key' => 'export_lars_dhp_nonklinis', 'value' => 'nonklinis_pergub', 'created_at' => $now, 'updated_at' => $now],
            ['key' => 'export_bpkp', 'value' => 'bpkp', 'created_at' => $now, 'updated_at' => $now],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('risk_grading_settings');
    }
};
