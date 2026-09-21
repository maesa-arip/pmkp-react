<?php

namespace Tests\Feature;

use App\Http\Middleware\VerifyCsrfToken;
use App\Models\Pic;
use App\Models\RiskRegister;
use App\Models\User;
use App\Models\VerificationPriorityAdmin;
use App\Models\VerificationPriorityManagement;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Gate;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

/**
 * Temuan #33: the verification screens and writes were only behind `auth`, so any
 * unit could supervise any register - including its own.
 */
class VerificationAuthorizationTest extends TestCase
{
    use DatabaseTransactions;

    protected function setUp(): void
    {
        parent::setUp();

        // The authorization layer is what is under test, so CSRF is taken out of
        // the way; otherwise a checkout with cached config returns 419 before the
        // guard runs. Same reasoning as AccessModuleAuthorizationTest.
        $this->withoutMiddleware(VerifyCsrfToken::class);
    }

    protected function tearDown(): void
    {
        // CACHE_DRIVER is array, so Spatie's cache outlives a single test.
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        parent::tearDown();
    }

    private function user(): User
    {
        return User::factory()->create([
            'pic_id' => Pic::firstOrFail()->id,
            'username' => 'verif-authz-'.uniqid(),
        ]);
    }

    private function screens(): array
    {
        return [
            route('riskregister.verificationadminoccurring'),
            route('riskregister.verificationmanagementoccurring'),
            route('riskregister.verificationadminpriority'),
            route('riskregister.verificationmanagementpriority'),
        ];
    }

    /** Each write is listed rather than sampled: each one signs off a register. */
    private function writes(): array
    {
        return [
            route('riskregister.storeverificationadminoccurring'),
            route('riskregister.storeverificationmanagementoccurring'),
            route('riskregister.storeverificationadminpriority'),
            route('riskregister.storeverificationmanagementpriority'),
        ];
    }

    public function test_user_without_the_verification_permission_is_refused(): void
    {
        $user = $this->user();
        Gate::before(fn () => false);
        $this->assertFalse($user->can('lihat data verifikasi'));
        $this->actingAs($user);

        foreach ($this->screens() as $url) {
            $this->get($url)->assertForbidden();
        }

        foreach ($this->writes() as $url) {
            $this->put($url, ['keterangan' => 'percobaan'])->assertForbidden();
        }
    }

    /**
     * The real abuse: the owner of a register signing off its own supervision.
     */
    public function test_the_refused_user_can_not_supervise_its_own_register(): void
    {
        $user = $this->user();
        $risk = RiskRegister::withoutTrashed()->firstOrFail();
        $risk->forceFill(['user_id' => $user->id])->saveQuietly();

        Gate::before(fn () => false);
        $this->actingAs($user);

        $adminBefore = VerificationPriorityAdmin::where('risk_register_id', $risk->id)->count();
        $managementBefore = VerificationPriorityManagement::where('risk_register_id', $risk->id)->count();

        $this->put(route('riskregister.storeverificationadminpriority'), [
            'id' => $risk->id,
            'keterangan' => 'supervisi oleh pemilik register',
        ])->assertForbidden();
        $this->put(route('riskregister.storeverificationmanagementpriority'), [
            'id' => $risk->id,
            'keterangan' => 'supervisi oleh pemilik register',
        ])->assertForbidden();

        $this->assertSame($adminBefore, VerificationPriorityAdmin::where('risk_register_id', $risk->id)->count());
        $this->assertSame($managementBefore, VerificationPriorityManagement::where('risk_register_id', $risk->id)->count());
    }

    public function test_user_holding_the_verification_permission_is_allowed(): void
    {
        $user = $this->user();
        $user->assignRole(Role::findOrCreate('verif-authz-admin', 'web')
            ->givePermissionTo(Permission::findOrCreate('lihat data verifikasi', 'web')));
        Gate::before(fn () => null);
        $this->actingAs($user);

        foreach ($this->screens() as $url) {
            $this->get($url)->assertOk();
        }
    }

    public function test_super_admin_is_allowed_even_without_the_explicit_permission(): void
    {
        $user = $this->user();
        $role = Role::findOrCreate('super admin', 'web');
        $user->assignRole($role);

        // A super admin whose explicit permission was unassigned must not be
        // locked out; the transaction puts the permission back afterwards.
        $role->revokePermissionTo(Permission::findOrCreate('lihat data verifikasi', 'web'));
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $this->assertFalse($user->fresh()->can('lihat data verifikasi'));
        $this->actingAs($user->fresh());

        $this->get(route('riskregister.verificationadminpriority'))->assertOk();
    }

    /** A permitted supervisor still cannot write against a register that does not exist. */
    public function test_supervision_of_an_unknown_register_is_rejected(): void
    {
        $user = $this->user();
        $user->assignRole(Role::findOrCreate('verif-authz-admin', 'web')
            ->givePermissionTo(Permission::findOrCreate('lihat data verifikasi', 'web')));
        Gate::before(fn () => null);
        $this->actingAs($user);

        $missing = (RiskRegister::withTrashed()->max('id') ?? 0) + 1000;
        $this->put(route('riskregister.storeverificationadminpriority'), [
            'id' => $missing,
            'keterangan' => 'register tidak ada',
        ])->assertSessionHasErrors('id');

        $this->assertSame(0, VerificationPriorityAdmin::where('risk_register_id', $missing)->count());
    }
}
