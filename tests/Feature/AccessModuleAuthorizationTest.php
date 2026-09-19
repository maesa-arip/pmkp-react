<?php

namespace Tests\Feature;

use App\Models\Pic;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Gate;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

class AccessModuleAuthorizationTest extends TestCase
{
    use DatabaseTransactions;

    private function user(): User
    {
        return User::factory()->create([
            'pic_id' => Pic::firstOrFail()->id,
            'username' => 'access-authz-'.uniqid(),
        ]);
    }

    /**
     * Every write here could hand the caller the whole application, so each
     * verb is listed rather than sampled.
     */
    private function writeRoutes(User $subject): array
    {
        return [
            ['post', route('users.store')],
            ['put', route('users.update', $subject->id)],
            ['delete', route('users.destroy', $subject->id)],
            ['post', route('roles.store')],
            ['put', route('roles.update', Role::findOrCreate('access-authz-role', 'web')->id)],
            ['post', route('permissions.store')],
        ];
    }

    public function test_user_without_the_access_permission_is_refused(): void
    {
        $user = $this->user();
        Gate::before(fn () => false);
        $this->assertFalse($user->can('atur hak akses'));
        $this->actingAs($user);

        foreach ([route('users.index'), route('roles.index'), route('permissions.index')] as $url) {
            $this->get($url)->assertForbidden();
        }

        foreach ($this->writeRoutes($user) as [$verb, $url]) {
            $this->$verb($url)->assertForbidden();
        }
    }

    public function test_the_refused_user_can_not_grant_itself_permissions(): void
    {
        $user = $this->user();
        Gate::before(fn () => false);
        $this->actingAs($user);

        $rolesBefore = Role::count();
        $this->post(route('roles.store'), [
            'name' => 'access-authz-escalation',
            'permissions' => Permission::pluck('id')->all(),
        ])->assertForbidden();

        $this->assertSame($rolesBefore, Role::count());
        $this->assertNull(Role::where('name', 'access-authz-escalation')->first());
        $this->assertFalse($user->fresh()->can('atur hak akses'));
    }

    public function test_user_holding_the_access_permission_is_allowed(): void
    {
        $user = $this->user();
        $user->assignRole(Role::findOrCreate('access-authz-admin', 'web')
            ->givePermissionTo(Permission::findOrCreate('atur hak akses', 'web')));
        Gate::before(fn () => null);
        $this->actingAs($user);

        foreach ([route('users.index'), route('roles.index'), route('permissions.index')] as $url) {
            $this->get($url)->assertOk();
        }
    }

    public function test_super_admin_is_allowed_even_without_the_explicit_permission(): void
    {
        $user = $this->user();
        $role = Role::findOrCreate('super admin', 'web');
        $user->assignRole($role);

        // Reproduce a super admin whose explicit permission was unassigned;
        // the role fallback is what keeps them from being locked out. Spatie
        // registers its own Gate::before first, so the permission has to go
        // for real - the transaction rolls it back.
        $role->revokePermissionTo(Permission::findOrCreate('atur hak akses', 'web'));
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $this->assertFalse($user->fresh()->can('atur hak akses'));
        $this->actingAs($user->fresh());

        $this->get(route('roles.index'))->assertOk();
    }
}
