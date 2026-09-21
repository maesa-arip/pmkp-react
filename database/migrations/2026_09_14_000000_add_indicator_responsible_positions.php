<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kinerja_penanggung_jawabs', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
        Schema::create('kinerja_penanggung_jawab_units', function (Blueprint $table) {
            $table->foreignId('penanggung_jawab_id')->constrained('kinerja_penanggung_jawabs')->cascadeOnDelete();
            $table->foreignId('location_id')->constrained('locations')->restrictOnDelete();
            $table->primary(['penanggung_jawab_id', 'location_id'], 'kinerja_pj_unit_primary');
        });
        foreach (range(1, 4) as $level) {
            $table = 'indikator_fitur'.$level.'s';
            Schema::table($table, function (Blueprint $table) {
                $table->foreignId('penanggung_jawab_id')->nullable()->constrained('kinerja_penanggung_jawabs')->restrictOnDelete();
            });
            // Preserve existing position names. Unit supervision must be configured explicitly.
            foreach (DB::table($table)->whereNotNull('jabatan')->where('jabatan', '<>', '')->distinct()->pluck('jabatan') as $name) {
                if (trim($name) === '') {
                    continue;
                }
                DB::table('kinerja_penanggung_jawabs')->insertOrIgnore(['name' => trim($name), 'created_at' => now(), 'updated_at' => now()]);
                $id = DB::table('kinerja_penanggung_jawabs')->where('name', trim($name))->value('id');
                DB::table($table)->where('jabatan', $name)->update(['penanggung_jawab_id' => $id]);
            }
        }
    }

    public function down(): void
    {
        foreach (range(1, 4) as $level) {
            Schema::table('indikator_fitur'.$level.'s', fn (Blueprint $table) => $table->dropConstrainedForeignId('penanggung_jawab_id'));
        }
        Schema::dropIfExists('kinerja_penanggung_jawab_units');
        Schema::dropIfExists('kinerja_penanggung_jawabs');
    }
};
