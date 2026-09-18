<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class LinkKinerjaPics extends Command
{
    protected $signature = 'kinerja:link-pics {--pic=* : ID PIC jabatan yang sudah diverifikasi} {--apply : Simpan relasi; tanpa opsi ini hanya pratinjau}';

    protected $description = 'Hubungkan PIC jabatan ke master kinerja tanpa mengubah PIC, indikator, atau risk register lama';

    public function handle(): int
    {
        $ids = $this->option('pic');
        $validator = Validator::make(['ids' => $ids], ['ids' => 'required|array|min:1', 'ids.*' => 'required|integer|distinct|exists:pics,id']);
        if ($validator->fails()) {
            $this->error($validator->errors()->first());
            return self::FAILURE;
        }
        $pics = DB::table('pics')->whereIn('id', $ids)->orderBy('id')->get();
        $this->table(['PIC ID', 'Nama jabatan'], $pics->map(fn ($pic) => [$pic->id, $pic->name])->all());
        if (! $this->option('apply')) {
            $this->info('Pratinjau saja. Gunakan --apply untuk menghubungkan PIC yang dipilih.');
            return self::SUCCESS;
        }
        DB::transaction(function () use ($pics) {
            foreach ($pics as $pic) {
                $position = DB::table('kinerja_penanggung_jawabs')->where('pic_id', $pic->id)->first();
                if ($position) {
                    continue;
                }
                $sameName = DB::table('kinerja_penanggung_jawabs')->where('name', $pic->name)->first();
                if ($sameName && $sameName->pic_id) {
                    throw new \RuntimeException('Nama sudah terhubung ke PIC lain: '.$pic->name);
                }
                if ($sameName) {
                    DB::table('kinerja_penanggung_jawabs')->where('id', $sameName->id)->update(['pic_id' => $pic->id, 'updated_at' => now()]);
                } else {
                    DB::table('kinerja_penanggung_jawabs')->insert([
                        'name' => $pic->name, 'pic_id' => $pic->id, 'is_active' => true,
                        'parent_id' => null, 'can_use_descendant_indicators' => false,
                        'created_at' => now(), 'updated_at' => now(),
                    ]);
                }
            }
            activity('indikator_tahunan')->withProperties(['pic_ids' => $pics->pluck('id')->all()])
                ->log('PIC jabatan dihubungkan ke master kinerja');
        });
        $this->info('PIC jabatan terhubung. Atur atasan, cakupan unit, dan penanggung jawab indikator melalui /kinerja.');
        return self::SUCCESS;
    }
}
