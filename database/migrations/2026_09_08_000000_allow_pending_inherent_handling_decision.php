<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE risk_registers MODIFY perlu_penanganan_id INT NULL DEFAULT NULL');
    }

    public function down(): void
    {
        if (DB::table('risk_registers')->whereNull('perlu_penanganan_id')->exists()) {
            throw new RuntimeException('Lengkapi keputusan penanganan FGD Inherent sebelum rollback.');
        }

        DB::statement('ALTER TABLE risk_registers MODIFY perlu_penanganan_id INT NOT NULL');
    }
};
