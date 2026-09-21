<?php

namespace Tests\Feature;

use App\Models\RiskRegister;
use App\Services\RegisterHierarchyResolver;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * Temuan #22 / TASK_13: registers store the fitur 4 master id, so the exports used
 * to climb the master's own parent and printed the legacy tree for every year.
 *
 * Resolution is exercised through the service rather than through the four export
 * endpoints, because only one Format*Export may be loaded per process (temuan #25).
 */
class RegisterHierarchyResolverTest extends TestCase
{
    use DatabaseTransactions;

    private function hierarchyOf(int $registerId): ?object
    {
        $query = RiskRegister::query()->where('risk_registers.id', $registerId);
        RegisterHierarchyResolver::join($query);
        $c = RegisterHierarchyResolver::columns();

        return $query->selectRaw(
            $c['sasaran_strategis'].' as sasaran, '.
            $c['iku'].' as iku, '.
            $c['program'].' as program, '.
            $c['kegiatan'].' as kegiatan, '.
            $c['tujuan_kegiatan'].' as tujuan_kegiatan, '.
            $c['indikator'].' as indikator'
        )->first();
    }

    /** A register whose indicator is placed under that year's kegiatan follows it. */
    public function test_register_follows_the_hierarchy_of_its_own_year(): void
    {
        $register = RiskRegister::query()
            ->whereNotNull('indikator_fitur4_id')
            ->whereNotNull('tgl_register')
            ->firstOrFail();
        $year = (int) date('Y', strtotime($register->tgl_register));
        $periodId = DB::table('periode_kinerjas')->where('tahun', $year)->value('id');
        $this->assertNotNull($periodId, 'tahun register harus punya periode kinerja');

        $placement = DB::table('indikator_fitur4s')
            ->where('master_id', $register->indikator_fitur4_id)
            ->where('periode_kinerja_id', $periodId)
            ->first();
        $this->assertNotNull($placement, 'master harus punya penempatan di tahunnya');

        $kegiatan = DB::table('indikator_fitur3s')->where('periode_kinerja_id', $periodId)->first();
        $this->assertNotNull($kegiatan, 'periode harus punya kegiatan fitur 3');
        DB::table('indikator_fitur4s')->where('id', $placement->id)
            ->update(['indikator_fitur3_id' => $kegiatan->id]);

        $resolved = $this->hierarchyOf($register->id);
        $this->assertSame($kegiatan->name, $resolved->kegiatan);
    }

    /**
     * An indicator not linked for the register's year leaves the hierarchy blank
     * instead of quietly printing the master's legacy parent, so the export shows
     * which indicators still need linking.
     */
    public function test_unlinked_indicator_leaves_the_hierarchy_blank(): void
    {
        $register = RiskRegister::query()
            ->whereNotNull('indikator_fitur4_id')
            ->whereNotNull('tgl_register')
            ->firstOrFail();
        $year = (int) date('Y', strtotime($register->tgl_register));
        $periodId = DB::table('periode_kinerjas')->where('tahun', $year)->value('id');

        // Detach every placement of this master for the register's year.
        DB::table('indikator_fitur4s')
            ->where('master_id', $register->indikator_fitur4_id)
            ->where('periode_kinerja_id', $periodId)
            ->update(['indikator_fitur3_id' => null]);

        // The master still has a parent; the point is that it is no longer used.
        $this->assertNotNull(
            DB::table('indikator_fitur4s')->where('id', $register->indikator_fitur4_id)->value('indikator_fitur3_id'),
            'master harus tetap punya induk lama supaya uji ini bermakna'
        );

        $resolved = $this->hierarchyOf($register->id);
        $this->assertNull($resolved->kegiatan);
        $this->assertNull($resolved->program);
        $this->assertNull($resolved->iku);
        $this->assertNull($resolved->sasaran);

        // The row must still say which indicator it is, otherwise the blank rows
        // are useless as a checklist.
        $this->assertNotNull($resolved->indikator);
    }

    /** The indicator name is a master attribute and must not move with the year. */
    public function test_indicator_name_comes_from_the_master(): void
    {
        $register = RiskRegister::query()->whereNotNull('indikator_fitur4_id')->firstOrFail();
        $masterName = DB::table('indikator_fitur4s')->where('id', $register->indikator_fitur4_id)->value('name');

        $this->assertSame($masterName, $this->hierarchyOf($register->id)->indikator);
    }

    /**
     * A register whose indicator IS linked for its year must never come back blank.
     * Blank is only ever allowed to mean "not linked yet", never "resolver lost it".
     */
    public function test_linked_registers_never_come_back_blank(): void
    {
        $tertaut = RiskRegister::query()
            ->join('indikator_fitur4s as m', 'm.id', 'risk_registers.indikator_fitur4_id')
            ->join('periode_kinerjas as pk', DB::raw('pk.tahun'), '=', DB::raw('YEAR(risk_registers.tgl_register)'))
            ->join('indikator_fitur4s as pen', function ($join) {
                $join->on('pen.master_id', '=', 'm.id')
                    ->whereRaw('pen.periode_kinerja_id = pk.id')
                    ->whereNotNull('pen.indikator_fitur3_id');
            })
            ->pluck('risk_registers.id');

        $this->assertGreaterThan(0, $tertaut->count(), 'butuh minimal satu register tertaut untuk diuji');

        $baru = RiskRegister::query()->whereIn('risk_registers.id', $tertaut);
        RegisterHierarchyResolver::join($baru);
        $kosong = $baru->selectRaw('risk_registers.id, '.RegisterHierarchyResolver::columns()['kegiatan'].' kegiatan')
            ->pluck('kegiatan', 'id')
            ->filter(fn ($name) => $name === null);

        $this->assertCount(0, $kosong, 'register tertaut kehilangan kegiatan: '.$kosong->keys()->implode(', '));
    }
}
