<?php

namespace App\Services;

use App\Models\IndikatorFitur4;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class RiskIndicatorAccess
{
    public function positionIds(?int $picId): array
    {
        if (! $picId) {
            return [];
        }
        $positions = DB::table('kinerja_penanggung_jawabs')->where('is_active', true)->get()->keyBy('id');
        $own = $positions->first(fn ($position) => (int) $position->pic_id === $picId);
        if (! $own) {
            return [];
        }
        $ids = [(int) $own->id];
        if ($own->can_use_descendant_indicators) {
            for ($i = 0; $i < count($ids); $i++) {
                foreach ($positions as $position) {
                    if ((int) $position->parent_id === $ids[$i] && ! in_array((int) $position->id, $ids, true)) {
                        $ids[] = (int) $position->id;
                    }
                }
            }
        }

        return $ids;
    }

    public function forPic(?int $picId): Builder
    {
        $location = $picId ? DB::table('pics')->where('id', $picId)->value('location_id') : null;
        $positions = $this->positionIds($picId);

        return IndikatorFitur4::query()->where(function (Builder $query) use ($location, $positions) {
            $query->whereJsonContains('indikator_fitur4s.location_id', 0)
                ->orWhereJsonContains('indikator_fitur4s.location_id', '0');
            if ($location) {
                $query->orWhereJsonContains('indikator_fitur4s.location_id', (int) $location)
                    ->orWhereJsonContains('indikator_fitur4s.location_id', (string) $location);
            }
            if ($positions) {
                $query->orWhereIn('indikator_fitur4s.penanggung_jawab_id', $positions);
                // An owner assigned to a program/sasaran can use its level-four descendants.
                $query->orWhereIn('indikator_fitur4s.indikator_fitur3_id', function ($parents) use ($positions) {
                    $parents->select('f3.id')->from('indikator_fitur3s as f3')
                        ->leftJoin('indikator_fitur2s as f2', 'f2.id', '=', 'f3.indikator_fitur2_id')
                        ->leftJoin('indikator_fitur1s as f1', 'f1.id', '=', 'f2.indikator_fitur1_id')
                        ->whereColumn('f3.periode_kinerja_id', 'indikator_fitur4s.periode_kinerja_id')
                        ->where('f3.is_active', true)
                        ->where(function ($owners) use ($positions) {
                            $owners->whereIn('f3.penanggung_jawab_id', $positions)
                                ->orWhere(function ($q) use ($positions) {
                                    $q->whereColumn('f2.periode_kinerja_id', 'f3.periode_kinerja_id')
                                        ->where('f2.is_active', true)->whereIn('f2.penanggung_jawab_id', $positions);
                                })->orWhere(function ($q) use ($positions) {
                                    $q->whereColumn('f2.periode_kinerja_id', 'f3.periode_kinerja_id')
                                        ->whereColumn('f1.periode_kinerja_id', 'f3.periode_kinerja_id')
                                        ->where('f2.is_active', true)->where('f1.is_active', true)
                                        ->whereIn('f1.penanggung_jawab_id', $positions);
                                });
                        });
                });
            }
        });
    }

    public function allowsUser(User $user, int $indicatorId): bool
    {
        return $user->can('lihat data semua risk register')
            || $this->forPic($user->pic_id)->whereKey($indicatorId)->exists();
    }

    public function optionsForUser(User $user)
    {
        if ($user->can('lihat data semua risk register')) {
            return IndikatorFitur4::orderBy('name')->get()->each(fn ($indicator) => $indicator->setAttribute('can_select', true));
        }
        $available = $this->forPic($user->pic_id)->pluck('indikator_fitur4s.id')->all();
        $historical = DB::table('risk_registers')->where('user_id', $user->id)->whereNull('deleted_at')->pluck('indikator_fitur4_id')->all();

        return IndikatorFitur4::whereIn('id', array_unique(array_merge($available, $historical)))->orderBy('name')->get()
            ->each(fn ($indicator) => $indicator->setAttribute('can_select', in_array($indicator->id, $available)));
    }
}
