<?php

namespace Tests\Feature;

use App\Http\Middleware\VerifyCsrfToken;
use App\Models\Pic;
use App\Models\RiskRegister;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

/**
 * Update/destroy of a risk register were only behind `auth`, so any logged-in
 * user could change or delete another unit's register by its id.
 */
class RiskRegisterWriteAccessTest extends TestCase
{
    use DatabaseTransactions;

    protected function setUp(): void
    {
        parent::setUp();

        // Same reasoning as VerificationAuthorizationTest: CSRF is not under test.
        $this->withoutMiddleware(VerifyCsrfToken::class);
    }

    protected function tearDown(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        parent::tearDown();
    }

    /** Two PICs of different units. */
    private function pics(): array
    {
        $first = Pic::whereNotNull('location_id')->firstOrFail();
        $second = Pic::whereNotNull('location_id')->where('location_id', '<>', $first->location_id)->firstOrFail();

        return [$first, $second];
    }

    private function user(Pic $pic, string $permission): User
    {
        $user = User::factory()->create(['pic_id' => $pic->id, 'username' => 'rr-write-'.uniqid()]);
        $user->assignRole(Role::findOrCreate('rr-write-'.str_replace(' ', '-', $permission), 'web')
            ->givePermissionTo(Permission::findOrCreate($permission, 'web')));

        return $user->fresh();
    }

    private function register(User $owner, Pic $pic, int $tipe = 1): RiskRegister
    {
        $risk = RiskRegister::withoutTrashed()->where('tipe_id', $tipe)->firstOrFail();
        $risk->forceFill(['user_id' => $owner->id, 'pic_id' => json_encode([$pic->id])])->saveQuietly();

        return $risk->fresh();
    }

    public function test_unit_user_can_not_change_or_delete_another_units_register(): void
    {
        [$mine, $theirs] = $this->pics();
        $owner = $this->user($theirs, 'edit data risk register sesuai lokasi');
        $risk = $this->register($owner, $theirs);
        $statement = $risk->pernyataan_risiko;

        $this->actingAs($this->user($mine, 'edit data risk register sesuai lokasi'));

        $this->put(route('riskRegisterKlinis.update', $risk->id), ['pernyataan_risiko' => 'diubah unit lain'])
            ->assertForbidden();
        $this->put(route('riskregister.fgdinherent'), ['id' => $risk->id])->assertForbidden();
        $this->delete(route('riskRegisterKlinis.destroy', $risk->id))->assertForbidden();

        $this->assertNotNull(RiskRegister::find($risk->id));
        $this->assertSame($statement, RiskRegister::find($risk->id)->pernyataan_risiko);
    }

    public function test_owner_and_unit_members_pass_the_guard(): void
    {
        [$mine] = $this->pics();
        $owner = $this->user($mine, 'edit data risk register sesuai lokasi');
        $risk = $this->register($owner, $mine);

        // Not 403 is the assertion: the request then reaches the controller's own validation.
        $this->actingAs($owner);
        $this->assertNotSame(403, $this->put(route('riskRegisterKlinis.update', $risk->id), [])->status());

        $this->actingAs($this->user($mine, 'edit data risk register sesuai lokasi'));
        $this->assertNotSame(403, $this->put(route('riskRegisterKlinis.update', $risk->id), [])->status());
    }

    public function test_legacy_csv_pic_id_still_grants_the_tagged_unit(): void
    {
        [$mine, $theirs] = $this->pics();
        $owner = $this->user($theirs, 'edit data risk register sesuai lokasi');
        $risk = $this->register($owner, $theirs);
        $risk->forceFill(['pic_id' => json_encode($theirs->id.','.$mine->id)])->saveQuietly();

        $this->actingAs($this->user($mine, 'edit data risk register sesuai lokasi'));
        $this->assertNotSame(403, $this->put(route('riskRegisterKlinis.update', $risk->id), [])->status());
    }

    public function test_risk_admin_can_change_any_register(): void
    {
        [$mine, $theirs] = $this->pics();
        $risk = $this->register($this->user($theirs, 'edit data risk register sesuai lokasi'), $theirs);

        $this->actingAs($this->user($mine, 'edit data semua risk register'));
        $this->assertNotSame(403, $this->put(route('riskRegisterKlinis.update', $risk->id), [])->status());
    }

    public function test_route_of_the_other_risk_type_is_not_found(): void
    {
        [$mine] = $this->pics();
        $owner = $this->user($mine, 'edit data risk register sesuai lokasi');
        $risk = $this->register($owner, $mine, 2);

        $this->actingAs($owner);
        $this->delete(route('riskRegisterKlinis.destroy', $risk->id))->assertNotFound();
        $this->assertNotNull(RiskRegister::find($risk->id));
    }
}
