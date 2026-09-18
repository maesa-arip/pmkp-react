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
use Illuminate\Support\Facades\Gate;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Tests\TestCase;

class MutuIndicatorAdminAccessTest extends TestCase
{
    use DatabaseTransactions;

    private function superAdmin(): User
    {
        $user = User::factory()->create(['pic_id' => Pic::where('location_id', '>', 0)->firstOrFail()->id]);
        $user->assignRole(Role::findOrCreate('super admin', 'web'));
        // Reproduce a super admin without the explicit Mutu permission.
        Gate::before(fn () => false);

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
        $this->assertSame($expected, $service->options($user)->sortBy('id')->pluck('id')->values()->all());
        $this->actingAs($user);
        $year = (int) PeriodeKinerja::orderByDesc('tahun')->value('tahun');
        $this->get(route('MutuIndikator.index', ['tahun' => $year]))->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('MUTU/MutuIndikator/Index')
            ->has('IndikatorFitur4', count($expected))
            ->where('MutuIndikator.filtered.tahun', $year));
    }

    public function test_regular_user_remains_scoped_to_assigned_indicators(): void
    {
        $user = User::factory()->create(['pic_id' => Pic::firstOrFail()->id]);
        Gate::before(fn () => false);
        $service = app(MutuIndicatorInput::class);
        $this->assertFalse($service->canViewAll($user));
        $expected = app(RiskIndicatorAccess::class)->forPic($user->pic_id)->orderBy('id')->pluck('id')->all();
        $this->assertSame($expected, $service->options($user)->sortBy('id')->pluck('id')->values()->all());
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

    public function test_super_admin_read_access_does_not_grant_edit_or_delete_access_to_other_units(): void
    {
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