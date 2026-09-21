<?php

namespace Tests\Feature;

use App\Models\Pic;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Gate;
use Tests\TestCase;

/**
 * The register sheets group rows without a year key, so a file spanning several years
 * melts registers of different years into one row (finding #23). One file is one year.
 */
class RegisterExportRangeTest extends TestCase
{
    use DatabaseTransactions;

    /** @var array<string> */
    private array $urls = [
        '/riskregisterbpkp',
        '/riskregisterklinislarsdhp',
        '/riskregisternonklinislarsdhp',
        '/riskregistersedangterjadi',
    ];

    protected function setUp(): void
    {
        parent::setUp();
        $this->actingAs(User::factory()->create(['pic_id' => Pic::firstOrFail()->id]));
        Gate::before(fn () => true);
    }

    public function test_range_is_required_on_every_register_export(): void
    {
        foreach ($this->urls as $url) {
            $this->postJson($url, [])->assertStatus(422)
                ->assertJsonValidationErrors(['startDate', 'endDate']);
        }
    }

    public function test_range_may_not_cross_a_year_boundary(): void
    {
        foreach ($this->urls as $url) {
            $this->postJson($url, ['startDate' => '2025-11-01', 'endDate' => '2026-02-28'])
                ->assertStatus(422)->assertJsonValidationErrors(['endDate']);
            // An end before the start is rejected as well.
            $this->postJson($url, ['startDate' => '2026-03-01', 'endDate' => '2026-01-31'])
                ->assertStatus(422)->assertJsonValidationErrors(['endDate']);
        }
    }

    public function test_a_single_year_quarter_downloads_a_file_named_after_that_year(): void
    {
        // Only one register export may be built per process: every Format*Export file
        // declares its own App\Exports\Sheet1..Sheet11, so two of them collide (finding #25).
        // Validation above never reaches those classes, so it can cover all four URLs.
        $response = $this->post('/riskregisterbpkp', ['startDate' => '2026-01-01', 'endDate' => '2026-03-31']);
        $response->assertOk();
        $this->assertStringContainsString('2026.xlsx', $response->headers->get('content-disposition'));
    }
}
