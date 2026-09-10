<?php

namespace App\Console\Commands;

use App\Models\PeriodeKinerja;
use App\Services\AnnualIndicatorService;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class InitializeAnnualIndicators extends Command
{
    protected $signature = 'indikator:initialize-years {--apply : Terapkan rekonstruksi dalam satu transaksi}';

    protected $description = 'Rekonstruksi versi tahunan indikator dan relasi risiko/MUTU. Default hanya menampilkan rencana.';

    public function handle(AnnualIndicatorService $service): int
    {
        $years = DB::table('risk_registers')->whereNotNull('tgl_register')->pluck('tgl_register')
            ->merge(DB::table('mutu_units')->pluck('tanggal_mutu'))
            ->map(fn ($date) => Carbon::parse($date)->year)->push(now()->year)->unique()->sort()->values();
        $this->info('Periode rekonstruksi: '.$years->implode(', ').'. Redaksi historis berasal dari master existing.');
        if (! $this->option('apply')) {
            return self::SUCCESS;
        }
        DB::transaction(function () use ($years, $service) {
            foreach ($years as $year) {
                $period = PeriodeKinerja::firstOrCreate(['tahun' => $year], ['rekonstruksi' => true, 'status' => 'draft']);
                if ($period->status === 'draft') {
                    $service->copyHierarchy(null, $period);
                    $period->update(['status' => 'aktif', 'activated_at' => now()]);
                }
                DB::table('risk_registers')->whereNull('periode_kinerja_id')->whereYear('tgl_register', $year)
                    ->orderBy('id')->chunkById(100, function ($risks) use ($period, $service) {
                        foreach ($risks as $risk) {
                            $target = $service->resolve($risk->indikator_fitur4_id, $period->id);
                            if (! $target) {
                                throw new \RuntimeException("Indikator risiko #{$risk->id} tidak dapat dipetakan.");
                            }
                            DB::table('risk_registers')->where('id', $risk->id)->update([
                                'periode_kinerja_id' => $period->id,
                                'indikator_fitur4_id' => $target->id,
                                'indikator_snapshot' => json_encode($service->snapshot($target->id)),
                            ]);
                        }
                    });
                foreach (DB::table('mutu_indikators')->whereNull('periode_kinerja_id')->get() as $master) {
                    $lineage = $master->lineage_id ?: (string) Str::uuid();
                    DB::table('mutu_indikators')->where('id', $master->id)->update(['lineage_id' => $lineage]);
                    $target = $service->resolve($master->indikator_fitur4_id, $period->id);
                    if (! $target) {
                        throw new \RuntimeException("Indikator MUTU #{$master->id} tidak dapat dipetakan.");
                    }
                    $copy = DB::table('mutu_indikators')->where('periode_kinerja_id', $period->id)->where('lineage_id', $lineage)->first();
                    if (! $copy) {
                        $data = (array) $master;
                        unset($data['id']);
                        $data['periode_kinerja_id'] = $period->id;
                        $data['indikator_fitur4_id'] = $target->id;
                        $data['lineage_id'] = $lineage;
                        $data['copied_from_id'] = $master->id;
                        $copyId = DB::table('mutu_indikators')->insertGetId($data);
                    } else {
                        $copyId = $copy->id;
                    }
                    DB::table('mutu_units')->where('mutu_indikator_id', $master->id)->whereYear('tanggal_mutu', $year)->update(['mutu_indikator_id' => $copyId]);
                }
            }
        });
        $this->info('Rekonstruksi selesai. Periode existing aktif; pengelola dapat menutup tahun yang sudah final.');

        return self::SUCCESS;
    }
}
