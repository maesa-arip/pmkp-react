<?php

namespace App\Console\Commands;

use App\Models\PeriodeKinerja;
use App\Services\Fitur4Master;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class LinkFitur4Masters extends Command
{
    protected $signature = 'indikator:link-masters {tahun}
        {--deactivate-existing : Nonaktifkan penautan dan master fitur 4 yang sudah ada di tahun itu sebelum penautan}
        {--apply : Simpan; tanpa opsi ini transaksi dibatalkan}';

    protected $description = 'Tautkan master fitur 4 aktif (indikator mutu unit) ke tahun tertentu tanpa induk kegiatan.';

    public function handle(): int
    {
        $period = PeriodeKinerja::where('tahun', (int) $this->argument('tahun'))->first();
        if (! $period) {
            $this->error('Periode tahun tersebut belum ada.');

            return self::FAILURE;
        }
        if ($period->status === 'ditutup') {
            $this->error('Periode ditutup bersifat baca saja.');

            return self::FAILURE;
        }
        DB::beginTransaction();
        try {
            $created = Fitur4Master::ensureAll();
            $deactivated = 0;
            if ($this->option('deactivate-existing')) {
                // A rerun would deactivate the linked unit indicators and their legacy masters.
                if (DB::table('indikator_fitur4s')->where('periode_kinerja_id', $period->id)->whereColumn('copied_from_id', 'master_id')->exists()) {
                    throw new \RuntimeException('Tahun ini sudah memiliki penautan master; --deactivate-existing hanya untuk penautan pertama.');
                }
                $existing = DB::table('indikator_fitur4s')->where('periode_kinerja_id', $period->id)->where('is_active', true);
                $masters = (clone $existing)->pluck('master_id')->all();
                $deactivated = $existing->update(['is_active' => false, 'updated_at' => now()]);
                // Their masters are not linked automatically to later years either.
                DB::table('indikator_fitur4s')->whereIn('id', $masters)->update(['is_active' => false, 'updated_at' => now()]);
            }
            $linked = Fitur4Master::linkMasters($period->id);
            $report = ['tahun' => $period->tahun, 'master_dibuat' => $created, 'dinonaktifkan' => $deactivated, 'ditautkan_tanpa_induk' => $linked, 'applied' => (bool) $this->option('apply')];
            if ($this->option('apply')) {
                activity('indikator_tahunan')->performedOn($period)->withProperties($report)->log('Master fitur 4 ditautkan ke periode');
                DB::commit();
            } else {
                DB::rollBack();
            }
            $this->line(json_encode($report, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

            return self::SUCCESS;
        } catch (\Throwable $e) {
            DB::rollBack();
            $this->error($e->getMessage());

            return self::FAILURE;
        }
    }
}
