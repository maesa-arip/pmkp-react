<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('periode_kinerjas', fn (Blueprint $t) => $t->json('reconstruction_notes')->nullable());
        // MySQL TIMESTAMP ends in 2038; the UI supports annual periods through 2100.
        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE risk_registers MODIFY tgl_register DATETIME NULL, MODIFY tgl_selesai DATETIME NULL');
        }
        $orphans = DB::table('sasaran_strategis as s')->leftJoin('sasaran_strategis as p', 'p.id', '=', 's.parent_id')
            ->whereNull('s.periode_kinerja_id')->where('s.parent_id', '>', 0)->whereNull('p.id')->pluck('s.id')->all();
        DB::table('periode_kinerjas')->where('rekonstruksi', true)->update(['reconstruction_notes' => json_encode([
            'orphan_sasaran_ids' => $orphans,
            'note' => 'Parent sasaran lama yang tidak ditemukan dipertahankan pada sumber. Versi rekonstruksi ditempatkan sementara sebagai akar dan perlu verifikasi.',
        ])]);
    }

    public function down(): void
    {
        Schema::table('periode_kinerjas', fn (Blueprint $t) => $t->dropColumn('reconstruction_notes'));
        // Do not narrow DATETIME: future periods could otherwise be truncated.
    }
};
