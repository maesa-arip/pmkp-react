<?php

namespace Tests\Feature;

use App\Models\Pic;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Gate;
use Tests\TestCase;

class PreloadResponseHeadersTest extends TestCase
{
    use DatabaseTransactions;

    public function test_authenticated_pages_keep_preloads_in_html_without_oversized_link_headers(): void
    {
        $this->actingAs(User::factory()->create([
            'pic_id' => Pic::firstOrFail()->id,
            'username' => 'preload-test-'.uniqid(),
        ]));
        Gate::before(fn () => true);

        foreach (['/kinerja', '/dashboard'] as $url) {
            $response = $this->get($url)->assertOk();
            $this->assertFalse($response->headers->has('Link'),
                $url.' emits '.strlen($response->headers->get('Link', '')).' bytes of Link headers.');
            $response->assertSee('rel="modulepreload"', false);
            $response->assertSee('type="module"', false);
        }
    }
}
