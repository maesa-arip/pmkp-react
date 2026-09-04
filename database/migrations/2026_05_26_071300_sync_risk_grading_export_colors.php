<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('risk_gradings')) {
            return;
        }

        $columns = [
            'warna',
            'warna_klinis',
            'warna_nonklinis',
            'warna_nonklinis_pergub',
            'warna_ikp',
            'warna_bpkp',
        ];

        foreach ($columns as $column) {
            if (!Schema::hasColumn('risk_gradings', $column)) {
                return;
            }
        }

        $clinical = [
            'Extreme' => '#FF0D0D',
            'High' => '#FFFF00',
            'Moderate' => '#00B050',
            'Low' => '#00B0F0',
        ];

        $nonClinical = [
            'EKSTRIM' => '#FF0D0D',
            'SANGAT TINGGI' => '#FF0D0D',
            'TINGGI' => '#FFC000',
            'SEDANG' => '#FFFF00',
            'RENDAH' => '#00B0F0',
            'SANGAT RENDAH' => '#00B050',
        ];

        $ikp = [
            'Ekstrim' => '#FF0D0D',
            'Tinggi' => '#FFFF00',
            'Moderat' => '#00B050',
            'Rendah' => '#00B0F0',
        ];

        DB::table('risk_gradings')
            ->orderBy('id')
            ->get()
            ->each(function ($row) use ($clinical, $nonClinical, $ikp) {
                DB::table('risk_gradings')
                    ->where('id', $row->id)
                    ->update([
                        'warna' => $clinical[$row->name] ?? $row->warna,
                        'warna_klinis' => $clinical[$row->name] ?? $row->warna_klinis,
                        'warna_nonklinis' => $nonClinical[$row->name_nonklinis] ?? $row->warna_nonklinis,
                        'warna_nonklinis_pergub' => $nonClinical[$row->name_nonklinis_pergub] ?? $row->warna_nonklinis_pergub,
                        'warna_ikp' => $ikp[$row->name_ikp] ?? $row->warna_ikp,
                        'warna_bpkp' => $nonClinical[$row->name_bpkp] ?? $row->warna_bpkp,
                        'updated_at' => now(),
                    ]);
            });
    }

    public function down(): void
    {
        // Keep data intact on rollback; colors may have been edited from the UI after deploy.
    }
};
