<?php

namespace Tests\Feature;

use App\Models\MUTU\MutuUnit;
use App\Models\PeriodeKinerja;
use App\Services\AnnualIndicatorService;
use App\Models\Pic;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class MutuYearFilterTest extends TestCase
{
    use DatabaseTransactions;

    public function test_filter_uses_transaction_year_without_changing_indicator_options(): void
    {
        $sample = MutuUnit::whereHas('mutu_indikator')->firstOrFail();
        $pic = Pic::where('location_id', '>', 0)->firstOrFail();
        $this->actingAs(User::factory()->create(['pic_id' => $pic->id, 'username' => 'mutu-year-'.uniqid()]));
        Gate::before(fn () => true);
        DB::table('mutu_indikators')->where('id', $sample->mutu_indikator_id)->update(['approved' => 1, 'location_id' => $pic->location_id]);
        // The dictionary is permanent; each new year only places its level-four master.
        $source = DB::table('indikator_fitur4s')->where('master_id', $sample->mutu_indikator->indikator_fitur4_id)->value('periode_kinerja_id');
        DB::table('mutu_indikators')->where('id', $sample->mutu_indikator_id)->update(['is_active' => true]);
        foreach ([2097, 2098] as $year) {
            $period = PeriodeKinerja::create(['tahun' => $year, 'status' => 'draft']);
            app(AnnualIndicatorService::class)->copyHierarchy($source, $period);
            $period->update(['status' => 'aktif']);
        }
        $first = $sample->replicate();
        $first->mutu_indikator_id = $sample->mutu_indikator_id;
        $first->tanggal_mutu = '2097-01-15';
        $first->code = 'yr2097';
        $first->save();
        $second = $sample->replicate();
        $second->mutu_indikator_id = $sample->mutu_indikator_id;
        $second->tanggal_mutu = '2098-01-15';
        $second->code = 'yr2098';
        $second->save();

        foreach ([2097 => $first, 2098 => $second] as $year => $expected) {
            $this->get(route('MutuUnit.index', ['tahun' => $year]))->assertOk()->assertInertia(fn (Assert $page) => $page
                ->component('MUTU/MutuUnit/Index')
                ->where('MutuUnit.filtered.tahun', $year)
                ->where('MutuUnit.data', fn ($rows) => collect($rows)->contains('id', $expected->id)
                    && collect($rows)->every(fn ($row) => substr($row['tanggal_mutu'], 0, 4) === (string) $year))
                ->where('dataYears', fn ($years) => collect($years)->contains(2097) && collect($years)->contains(2098))
                ->where('MutuIndikator', fn ($rows) => collect($rows)->contains('id', $sample->mutu_indikator_id))
            );
        }

        $this->get(route('MutuUnit.index'))->assertOk()->assertInertia(fn (Assert $page) => $page
            ->where('MutuUnit.filtered.tahun', now()->year));
        $this->get(route('MutuUnit.index', ['tahun' => 'invalid']))->assertSessionHasErrors('tahun');
    }
}
