<?php

namespace Tests\Feature;

use App\Models\Pic;
use App\Models\RiskRegister;
use App\Models\User;
use App\Services\RiskRegisterYearCopyService;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Tests\TestCase;

/**
 * The unit filters of Copy Risk Register used JSON contains, which misses the
 * legacy pic_id values (scalars and repeatedly encoded "21,8,73" strings).
 */
class RiskRegisterCopyUnitFilterTest extends TestCase
{
    use DatabaseTransactions;

    // A year no real register uses, so the source query sees only this test's row.
    private const SOURCE_YEAR = 2091;

    public function test_unit_filters_match_legacy_encoded_pic_ids(): void
    {
        [$mine, $other, $unrelated] = Pic::orderBy('id')->take(3)->get()->all();
        $targetUser = User::factory()->create(['pic_id' => $other->id, 'username' => 'copy-filter-'.uniqid()]);
        // The source query scopes to the caller unless it may see every register.
        $this->actingAs(User::factory()->create(['pic_id' => $mine->id, 'username' => 'copy-admin-'.uniqid()]));
        Gate::before(fn () => true);
        $risk = RiskRegister::withoutTrashed()->firstOrFail();
        DB::table('risk_registers')->where('id', $risk->id)->update(['tgl_register' => self::SOURCE_YEAR.'-03-01']);

        $service = app(RiskRegisterYearCopyService::class);
        $filters = ['source_year' => self::SOURCE_YEAR, 'target_year' => self::SOURCE_YEAR + 1];

        foreach ([json_encode(json_encode(json_encode("{$other->id},{$mine->id}"))), (string) $mine->id, json_encode([$mine->id])] as $stored) {
            DB::table('risk_registers')->where('id', $risk->id)->update(['pic_id' => $stored]);

            $this->assertSame(1, $service->preview($filters + ['pic_id' => $mine->id])['source_total'], $stored);
            $this->assertSame(1, $service->previewUnit($filters + [
                'source_pic_id' => $mine->id,
                'target_pic_id' => $other->id,
                'target_user_id' => $targetUser->id,
            ])['source_total'], $stored);
        }

        $this->assertSame(0, $service->preview($filters + ['pic_id' => $unrelated->id])['source_total']);
    }
}
