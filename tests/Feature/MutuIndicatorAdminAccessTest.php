<?php

namespace Tests\Feature;

use App\Models\IndikatorFitur4;
use App\Models\MUTU\MutuIndikator;
use App\Models\PeriodeKinerja;
use App\Models\Pic;
use App\Models\User;
use App\Services\MutuIndicatorInput;
use App\Services\RiskIndicatorAccess;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Tests\TestCase;

class MutuIndicatorAdminAccessTest extends TestCase
{
    use DatabaseTransactions;

    private function superAdmin(): User
    {
        $user = User::factory()->create(['pic_id' => Pic::where('location_id', '>', 0)->firstOrFail()->id]);
        $role = Role::findOrCreate('super admin', 'web');
        $user->assignRole($role);
        // Reproduce a server whose super admin role does not carry the explicit Mutu
        // permission. Gate::before cannot fake this any more: Spatie registers its own
        // before callback first, so a granted permission wins before ours is reached.
        $role->revokePermissionTo('lihat semua data indikator mutu');
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        return $user;
    }

    public function test_super_admin_gets_all_options_without_the_explicit_permission(): void
    {
        $user = $this->superAdmin();
        $this->assertFalse($user->can('lihat semua data indikator mutu'));
        $service = app(MutuIndicatorInput::class);
        $this->assertTrue($service->canViewAll($user));
        $expected = IndikatorFitur4::orderBy('id')->pluck('id')->all();
        $this->assertNotEmpty($expected);
        // Option values are permanent masters; each option still comes from one yearly placement.
        $this->assertSame($expected, $service->options($user)->sortBy('placement_id')->pluck('placement_id')->values()->all());
        $this->assertSame(IndikatorFitur4::orderBy('id')->pluck('master_id')->all(), $service->options($user)->sortBy('placement_id')->pluck('id')->values()->all());
        $this->actingAs($user);
        $period = PeriodeKinerja::orderByDesc('tahun')->firstOrFail();
        // The page itself offers one year only, so it carries far fewer options than the master list.
        $ofYear = IndikatorFitur4::where('periode_kinerja_id', $period->id)->whereNotNull('master_id')->count();
        $this->assertLessThan(count($expected), $ofYear);
        $this->get(route('MutuIndikator.index', ['tahun' => $period->tahun]))->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('MUTU/MutuIndikator/Index')
            ->has('IndikatorFitur4', $ofYear)
            ->where('MutuIndikator.filtered.tahun', $period->tahun));
    }

    public function test_regular_user_remains_scoped_to_assigned_indicators(): void
    {
        $user = User::factory()->create(['pic_id' => Pic::firstOrFail()->id]);
        Gate::before(fn () => false);
        $service = app(MutuIndicatorInput::class);
        $this->assertFalse($service->canViewAll($user));
        $expected = app(RiskIndicatorAccess::class)->forPic($user->pic_id)->orderBy('id')->pluck('id')->all();
        $this->assertSame($expected, $service->options($user)->sortBy('placement_id')->pluck('placement_id')->values()->all());
        $this->assertLessThan(IndikatorFitur4::count(), count($expected));
    }

    public function test_explicit_permission_still_grants_all_options_without_super_admin_role(): void
    {
        $user = User::factory()->create(['pic_id' => Pic::firstOrFail()->id]);
        Gate::before(fn ($user, $ability) => $ability === 'lihat semua data indikator mutu');
        $service = app(MutuIndicatorInput::class);
        $this->assertFalse($user->hasRole('super admin'));
        $this->assertTrue($service->canViewAll($user));
        $this->assertCount(IndikatorFitur4::count(), $service->options($user));
    }

    public function test_index_flags_indicators_not_yet_placed_and_exposes_the_unit_pic(): void
    {
        $this->actingAs($this->superAdmin());
        $year = (int) PeriodeKinerja::orderByDesc('tahun')->value('tahun');
        $periodId = PeriodeKinerja::where('tahun', $year)->value('id');
        $placement = DB::table('indikator_fitur4s')->where('periode_kinerja_id', $periodId)
            ->whereNotNull('master_id')->whereNotNull('indikator_fitur3_id')->first();
        $this->assertNotNull($placement);
        DB::table('indikator_fitur4s')->where('id', $placement->id)->update(['indikator_fitur3_id' => null]);
        $this->get(route('MutuIndikator.index', ['tahun' => $year]))->assertOk()->assertInertia(fn (Assert $page) => $page
            ->where('UnplacedIndicators', fn ($ids) => collect($ids)->contains($placement->master_id))
            // The responsible person of a dictionary comes from the PIC of its unit.
            ->where('MutuIndikator.data', fn ($rows) => collect($rows)->every(fn ($row) => empty($row['location']) || array_key_exists('pic', $row['location']))));
    }

    public function test_activity_options_carry_the_responsible_pic_of_that_year(): void
    {
        $this->actingAs($this->superAdmin());
        $period = PeriodeKinerja::orderByDesc('tahun')->firstOrFail();
        $expected = DB::table('indikator_fitur3s as f')
            ->leftJoin('kinerja_penanggung_jawabs as j', 'j.id', '=', 'f.penanggung_jawab_id')
            ->leftJoin('pics as p', 'p.id', '=', 'j.pic_id')
            ->where('f.periode_kinerja_id', $period->id)->where('f.is_active', true)
            ->selectRaw('f.id, coalesce(p.name, f.jabatan) as pj')->get()->pluck('pj', 'id');
        $this->assertNotEmpty($expected);
        $this->get(route('MutuIndikator.index', ['tahun' => $period->tahun]))->assertOk()
            ->assertInertia(fn (Assert $page) => $page->where('IndikatorFitur3', function ($rows) use ($expected, $period) {
                $rows = collect($rows);
                $this->assertCount($expected->count(), $rows);
                foreach ($rows as $row) {
                    // Only the requested year, and the PIC behind the position, not the stored jabatan.
                    $this->assertSame($period->id, (int) $row['periode_kinerja_id']);
                    $this->assertSame($expected[$row['id']], $row['penanggung_jawab']);
                }

                return true;
            }));
    }

    public function test_options_offer_only_the_indicators_of_the_requested_year(): void
    {
        $user = $this->superAdmin();
        $service = app(MutuIndicatorInput::class);
        foreach (PeriodeKinerja::orderByDesc('tahun')->take(2)->get() as $period) {
            $options = $service->options($user, $period->id);
            $this->assertNotEmpty($options);
            $this->assertTrue($options->every(fn ($option) => (int) $option['periode_kinerja_id'] === $period->id));
            $this->assertSame(
                IndikatorFitur4::where('periode_kinerja_id', $period->id)->whereNotNull('master_id')->count(),
                $options->count()
            );
        }
    }

    public function test_editing_a_dictionary_never_touches_the_feature_hierarchy(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();
        $user = User::factory()->create(['pic_id' => Pic::where('location_id', '>', 0)->firstOrFail()->id]);
        $user->assignRole(Role::findOrCreate('super admin', 'web'));
        $this->actingAs($user);
        $period = PeriodeKinerja::orderByDesc('tahun')->firstOrFail();
        $unplaced = DB::table('indikator_fitur4s')->where('periode_kinerja_id', $period->id)
            ->whereNotNull('master_id')->whereNull('indikator_fitur3_id')->pluck('master_id');
        // A dictionary that is not measured yet, so the definition guard stays out of the way.
        $dictionary = MutuIndikator::whereIn('indikator_fitur4_id', $unplaced)->whereDoesntHave('unit')->first();
        $this->assertNotNull($dictionary, 'Butuh kamus yang indikatornya belum tertaut dan belum dipakai.');
        $placement = DB::table('indikator_fitur4s')->where('periode_kinerja_id', $period->id)
            ->where('master_id', $dictionary->indikator_fitur4_id)->first();
        $master = DB::table('indikator_fitur4s')->where('id', $dictionary->indikator_fitur4_id)->first();
        // The master still carries its pre-annual parent, which exists in no period.
        $this->assertNotNull($master->indikator_fitur3_id);
        $this->assertFalse(DB::table('indikator_fitur3s')->where('id', $master->indikator_fitur3_id)
            ->where('periode_kinerja_id', $period->id)->exists());
        $payload = [
            'periode_kinerja_id' => $period->id, 'IndikatorBaru' => 0,
            'indikator_fitur4_id' => $dictionary->indikator_fitur4_id,
            'mutu_kategori_id' => $dictionary->mutu_kategori_id,
            'num_name' => $dictionary->num_name, 'denum_name' => $dictionary->denum_name,
            'standar' => $dictionary->standar, 'operator' => $dictionary->operator,
            'penyebut' => $dictionary->penyebut,
        ];
        $route = route('MutuIndikator.update', $dictionary->id);
        // Even the master's own legacy parent, which exists in no period, is simply ignored.
        $this->put($route, $payload + ['indikator_fitur3_id' => $master->indikator_fitur3_id])->assertSessionHasNoErrors();
        $this->put($route, $payload)->assertSessionHasNoErrors();
        // The placement keeps waiting for /kinerja; the dictionary never positions it.
        $this->assertNull(DB::table('indikator_fitur4s')->where('id', $placement->id)->value('indikator_fitur3_id'));
    }

    public function test_rows_carry_the_edit_flag_that_matches_server_authorization(): void
    {
        $user = $this->superAdmin();
        $this->actingAs($user);
        $service = app(MutuIndicatorInput::class);
        // A super admin without the explicit permission reads every unit but edits only its own.
        $this->assertTrue($service->canViewAll($user));
        $this->assertFalse($user->can('lihat semua data indikator mutu'));
        $year = (int) PeriodeKinerja::orderByDesc('tahun')->value('tahun');
        $this->get(route('MutuIndikator.index', ['tahun' => $year, 'load' => 50]))->assertOk()
            ->assertInertia(fn (Assert $page) => $page->where('MutuIndikator.data', function ($rows) use ($user, $service) {
                $rows = collect($rows);
                $this->assertNotEmpty($rows);
                foreach ($rows as $row) {
                    $allowed = true;
                    try {
                        $service->authorize($user, new MutuIndikator(['location_id' => $row['location_id']]));
                    } catch (HttpException $e) {
                        $allowed = false;
                    }
                    $this->assertSame($allowed, $row['can_edit'], 'can_edit tidak sama dengan otorisasi server untuk kamus #'.$row['id']);
                }

                return true;
            }));
    }

    public function test_the_super_admin_role_now_carries_the_mutu_permission_and_may_edit_other_units(): void
    {
        // Granted on 2026-09-20 by migration 2026_09_20_120000, removing the asymmetry where
        // canViewAll() accepted the role but authorize() only accepted the permission.
        app(PermissionRegistrar::class)->forgetCachedPermissions();
        $user = User::factory()->create(['pic_id' => Pic::where('location_id', '>', 0)->firstOrFail()->id]);
        $user->assignRole(Role::findOrCreate('super admin', 'web'));
        $this->assertTrue($user->can('lihat semua data indikator mutu'));
        $service = app(MutuIndicatorInput::class);
        $service->authorize($user, new MutuIndikator(['location_id' => $user->pic->location_id + 1]));
        $this->actingAs($user);
        $year = (int) PeriodeKinerja::orderByDesc('tahun')->value('tahun');
        $this->get(route('MutuIndikator.index', ['tahun' => $year, 'load' => 50]))->assertOk()
            ->assertInertia(fn (Assert $page) => $page->where('MutuIndikator.data',
                fn ($rows) => collect($rows)->isNotEmpty() && collect($rows)->every(fn ($row) => $row['can_edit'] === true)));
    }

    public function test_a_super_admin_without_the_mutu_permission_stays_limited_to_its_own_unit(): void
    {
        // The fallback path: read access through the role alone never grants edit access.
        $user = $this->superAdmin();
        $model = new MutuIndikator(['location_id' => $user->pic->location_id + 1]);
        $this->expectException(HttpException::class);
        $this->expectExceptionCode(0);
        try {
            app(MutuIndicatorInput::class)->authorize($user, $model);
        } catch (HttpException $exception) {
            $this->assertSame(403, $exception->getStatusCode());
            throw $exception;
        }
    }
}