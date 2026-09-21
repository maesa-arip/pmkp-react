<?php

namespace Tests\Feature;

use App\Models\IndikatorFitur4;
use App\Models\MUTU\MutuIndikator;
use App\Models\PeriodeKinerja;
use App\Models\Pic;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Tests\TestCase;

class MutuIndicatorPenyebutTest extends TestCase
{
    use DatabaseTransactions;

    protected function setUp(): void
    {
        parent::setUp();
        $this->actingAs(User::factory()->create(['pic_id' => Pic::where('location_id', '>', 0)->firstOrFail()->id]));
        Gate::before(fn () => true);
    }

    private function dropdownOptions(): array
    {
        $response = $this->get(route('MutuIndikator.index'));
        $response->assertOk();

        return $response->viewData('page')['props']['MutuPenyebut'];
    }

    private function payload(): array
    {
        $period = PeriodeKinerja::where('status', 'aktif')->firstOrFail();
        $indicator = IndikatorFitur4::where('periode_kinerja_id', $period->id)->where('is_active', true)->firstOrFail();

        return [
            'periode_kinerja_id' => $period->id,
            'indikator_fitur4_id' => $indicator->id,
            'IndikatorBaru' => 0,
            'mutu_kategori_id' => DB::table('mutu_kategoris')->value('id'),
            'num_name' => 'QA penyebut '.Str::uuid(),
            'denum_name' => 'Jumlah seluruh sampel',
            'standar' => 95.5,
            'operator' => '≥',
        ];
    }

    public function test_dropdown_values_are_unique_unit_strings(): void
    {
        $options = $this->dropdownOptions();
        $this->assertNotEmpty($options);
        $expected = DB::table('mutu_penyebuts')->orderBy('name')->pluck('name')->all();
        $this->assertSame($expected, array_column($options, 'id'));
        foreach ($options as $option) {
            $this->assertIsString($option['id']);
            $this->assertSame($option['name'], $option['id']);
        }
    }

    public function test_actual_dropdown_values_can_be_saved_for_existing_and_new_indicators_and_edited(): void
    {
        $options = $this->dropdownOptions();
        $this->assertNotEmpty($options);
        foreach ($options as $index => $option) {
            foreach ([0, 1] as $isNew) {
                $payload = $this->payload() + ['penyebut' => $option['id']];
                $payload['IndikatorBaru'] = $isNew;
                if ($isNew) {
                    // A new indicator must declare its activity straight away.
                    $payload['indikator_fitur3_id'] = DB::table('indikator_fitur3s')->where('periode_kinerja_id', $payload['periode_kinerja_id'])->where('is_active', true)->value('id');
                    $payload['indikator_fitur4_id'] = '';
                    $payload['indikator'] = 'QA indikator penyebut '.Str::uuid();
                }
                $this->post(route('MutuIndikator.store'), $payload)->assertSessionHasNoErrors()->assertRedirect();
                $saved = MutuIndikator::where('num_name', $payload['num_name'])->firstOrFail();
                $this->assertSame($option['name'], $saved->penyebut);
                $next = $options[($index + 1) % count($options)];
                $payload['IndikatorBaru'] = 0;
                $payload['indikator_fitur4_id'] = $saved->indikator_fitur4_id;
                $payload['penyebut'] = $next['id'];
                $this->put(route('MutuIndikator.update', $saved), $payload)->assertSessionHasNoErrors()->assertRedirect();
                $this->assertSame($next['name'], $saved->fresh()->penyebut);
            }
        }
    }

    public function test_numeric_penyebut_is_still_rejected(): void
    {
        $this->post(route('MutuIndikator.store'), $this->payload() + ['penyebut' => 0])->assertSessionHasErrors('penyebut');
    }
}