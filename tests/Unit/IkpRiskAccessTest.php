<?php

namespace Tests\Unit;

use App\Models\RiskRegister;
use App\Models\User;
use App\Support\IkpRiskAccess;
use Tests\TestCase;

class IkpRiskAccessTest extends TestCase
{
    /** @dataProvider unitFormats */
    public function test_it_normalizes_stored_unit_formats($value, array $expected): void
    {
        $this->assertSame($expected, IkpRiskAccess::unitIds($value));
    }

    public function unitFormats(): array
    {
        return [
            [8, [8]], ['8', [8]], ['8,21,73', [8, 21, 73]],
            ['"8,21,73"', [8, 21, 73]], ['[8,21]', [8, 21]],
            ['["8","21"]', [8, 21]], [[8, '21'], [8, 21]],
            [0, [0]], [null, []], ['', []], ['invalid', []],
        ];
    }

    public function test_unit_user_can_select_own_unit_risk_created_by_someone_else(): void
    {
        $user = $this->userWithAccess(false, 8);
        $risk = new RiskRegister(['tipe_id' => 1, 'pic_id' => '"21,8"', 'user_id' => 999]);
        $this->assertTrue(IkpRiskAccess::canSelect($user, $risk));

        $risk->pic_id = '18';
        $this->assertFalse(IkpRiskAccess::canSelect($user, $risk));
        $risk->pic_id = '0';
        $this->assertTrue(IkpRiskAccess::canSelect($user, $risk));
    }

    public function test_user_without_unit_cannot_select_any_risk(): void
    {
        $this->assertFalse(IkpRiskAccess::canSelect(
            $this->userWithAccess(false, null),
            new RiskRegister(['tipe_id' => 1, 'pic_id' => '0'])
        ));
    }

    public function test_admin_can_select_other_units_but_not_deleted_or_nonclinical_risks(): void
    {
        $user = $this->userWithAccess(true, 8);
        $risk = new RiskRegister(['tipe_id' => 1, 'pic_id' => '21']);
        $this->assertTrue(IkpRiskAccess::canSelect($user, $risk));
        $risk->tipe_id = 2;
        $this->assertFalse(IkpRiskAccess::canSelect($user, $risk));
        $risk->tipe_id = 1;
        $risk->deleted_at = now();
        $this->assertFalse(IkpRiskAccess::canSelect($user, $risk));
    }

    public function test_risk_management_admin_can_also_view_all_risks(): void
    {
        $user = $this->getMockBuilder(User::class)->onlyMethods(['can'])->getMock();
        $user->method('can')->willReturnCallback(fn ($permission) => $permission === 'lihat data semua risk register');
        $this->assertTrue(IkpRiskAccess::canViewAll($user));
    }

    private function userWithAccess(bool $admin, ?int $unit): User
    {
        $user = $this->getMockBuilder(User::class)->onlyMethods(['can'])->getMock();
        $user->method('can')->willReturn($admin);
        $user->pic_id = $unit;
        return $user;
    }
}
