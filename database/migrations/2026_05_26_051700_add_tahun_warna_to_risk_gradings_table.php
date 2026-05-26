<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('risk_gradings', function (Blueprint $table) {
            if (!Schema::hasColumn('risk_gradings', 'tahun')) {
                $table->unsignedSmallInteger('tahun')->nullable()->after('kode');
            }

            if (!Schema::hasColumn('risk_gradings', 'warna')) {
                $table->string('warna', 20)->nullable()->after('name');
            }
        });

        DB::table('risk_gradings')
            ->whereNull('tahun')
            ->update(['tahun' => 2025]);

        $rows2025 = DB::table('risk_gradings')->where('tahun', 2025)->get();

        foreach ($rows2025 as $row) {
            $exists = DB::table('risk_gradings')
                ->where('tahun', 2026)
                ->where('kode', $row->kode)
                ->exists();

            if ($exists) {
                continue;
            }

            $copy = (array) $row;
            unset($copy['id']);
            $copy['tahun'] = 2026;
            $copy['created_at'] = now();
            $copy['updated_at'] = now();

            DB::table('risk_gradings')->insert($copy);
        }

        DB::statement('ALTER TABLE risk_gradings MODIFY tahun SMALLINT UNSIGNED NOT NULL');

        Schema::table('risk_gradings', function (Blueprint $table) {
            $table->unique(['tahun', 'kode'], 'risk_gradings_tahun_kode_unique');
        });
    }

    public function down()
    {
        Schema::table('risk_gradings', function (Blueprint $table) {
            $table->dropUnique('risk_gradings_tahun_kode_unique');
            $table->dropColumn(['tahun', 'warna']);
        });
    }
};
