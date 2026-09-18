<?php

namespace App\Services;

use App\Models\MUTU\MutuIndikator;
use App\Models\PeriodeKinerja;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class MutuIndicatorInput
{
    public function canViewAll(User $user): bool
    {
        return $user->hasRole('super admin') || $user->can('lihat semua data indikator mutu');
    }

    public function options(User $user)
    {
        $query = \App\Models\IndikatorFitur4::query();
        if (! $this->canViewAll($user)) {
            $query = app(RiskIndicatorAccess::class)->forPic($user->pic_id);
        }

        return $query->orderBy('name')->get();
    }

    public function authorize(User $user, MutuIndikator $model): void
    {
        abort_unless($user->can('lihat semua data indikator mutu') || (int) $model->location_id === (int) $user->pic?->location_id, 403);
    }

    public function save(User $user, array $input, ?MutuIndikator $model = null): MutuIndikator
    {
        if ($model) {
            $this->authorize($user, $model);
        }

        return DB::transaction(function () use ($user, $input, $model) {
            $period = PeriodeKinerja::whereKey($input['periode_kinerja_id'])->lockForUpdate()->firstOrFail();
            $period->assertWritable();
            $parent = DB::table('indikator_fitur3s')->where('id', $input['indikator_fitur3_id'])->where('periode_kinerja_id', $period->id)->where('is_active', true)->first();
            if (! $parent) {
                throw ValidationException::withMessages(['indikator_fitur3_id' => 'Pilih kegiatan Kabag/Kabid aktif pada tahun yang sama.']);
            }
            $f2 = DB::table('indikator_fitur2s')->where('id', $parent->indikator_fitur2_id)->where('periode_kinerja_id', $period->id)->where('is_active', true)->first();
            if (! $f2 || ! DB::table('indikator_fitur1s')->where('id', $f2->indikator_fitur1_id)->where('periode_kinerja_id', $period->id)->where('is_active', true)->exists()) {
                throw ValidationException::withMessages(['indikator_fitur3_id' => 'Induk kegiatan Wadir atau IKU tidak aktif.']);
            }
            $location = $user->pic?->location_id;
            abort_unless($location, 403);
            if ((int) ($input['IndikatorBaru'] ?? 0) === 1) {
                if ($model) {
                    throw ValidationException::withMessages(['IndikatorBaru' => 'Buat indikator baru melalui formulir tambah.']);
                }
                $name = trim($input['indikator'] ?? '');
                if ($name === '') {
                    throw ValidationException::withMessages(['indikator' => 'Nama indikator mutu wajib diisi.']);
                }
                if (DB::table('indikator_fitur4s')->where('periode_kinerja_id', $period->id)->where('indikator_fitur3_id', $parent->id)->where('name', $name)->whereJsonContains('location_id', (int) $location)->exists()) {
                    throw ValidationException::withMessages(['indikator' => 'Indikator sudah tersedia untuk unit ini. Pilih indikator yang sudah ada.']);
                }
                $id = DB::table('indikator_fitur4s')->insertGetId(['periode_kinerja_id' => $period->id, 'indikator_fitur3_id' => $parent->id, 'sasaran_strategis_id' => $parent->sasaran_strategis_id,
                    'name' => $name, 'tujuan' => '', 'location_id' => json_encode([(int) $location]), 'jabatan' => $user->pic->name, 'penanggung_jawab_id' => $parent->penanggung_jawab_id,
                    'lineage_id' => (string) Str::uuid(), 'is_active' => true, 'sort_order' => 0, 'created_at' => now(), 'updated_at' => now()]);
                app(OperationalConceptLink::class)->sync($period->id, 'indikator_fitur4s', $id, 'indikator_fitur3s', $parent->id, 'indikator_mutu', 'tim_kerja');
            } else {
                $id = (int) ($input['indikator_fitur4_id'] ?? 0);
                $indicator = $this->options($user)->firstWhere('id', $id);
                if (! $indicator || ! $indicator->is_active || (int) $indicator->periode_kinerja_id !== $period->id || (int) $indicator->indikator_fitur3_id !== $parent->id) {
                    throw ValidationException::withMessages(['indikator_fitur4_id' => 'Pilih indikator mutu aktif milik unit/tim Anda yang sesuai kegiatan dan tahun.']);
                }
            }
            $data = array_intersect_key($input, array_flip(['mutu_kategori_id', 'num_name', 'denum_name', 'standar', 'operator', 'penyebut']));
            $data['indikator_fitur4_id'] = $id;
            if ($model) {
                $model->update($data);

                return $model;
            }
            $data['location_id'] = $location;

            return MutuIndikator::create($data);
        });
    }
}
