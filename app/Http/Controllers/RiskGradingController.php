<?php

namespace App\Http\Controllers;

use App\Http\Resources\RiskGradingResource;
use App\Models\RiskGrading;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class RiskGradingController extends Controller
{
    public $loadDefault = 25;

    public function index(Request $request)
    {
        $latestYear = RiskGrading::max('tahun');
        $currentYear = (int) now()->year;
        $selectedYear = $request->year ? (int) $request->year : $currentYear;
        $selectedType = $request->type ?: 'klinis';
        $riskGradings = RiskGrading::query();

        if ($request->q) {
            $riskGradings->where(function ($query) use ($request) {
                $query->where('kode', 'like', '%' . $request->q . '%')
                    ->orWhere('tahun', 'like', '%' . $request->q . '%')
                    ->orWhere('name', 'like', '%' . $request->q . '%')
                    ->orWhere('name_nonklinis', 'like', '%' . $request->q . '%')
                    ->orWhere('name_klinis_pergub', 'like', '%' . $request->q . '%')
                    ->orWhere('name_nonklinis_pergub', 'like', '%' . $request->q . '%')
                    ->orWhere('name_klinis_bpkp', 'like', '%' . $request->q . '%')
                    ->orWhere('name_nonklinis_bpkp', 'like', '%' . $request->q . '%')
                    ->orWhere('name_ikp', 'like', '%' . $request->q . '%')
                    ->orWhere('name_bpkp', 'like', '%' . $request->q . '%');
            });
        }

        if ($request->has(['field', 'direction'])) {
            $riskGradings->orderBy($request->field, $request->direction);
        } else {
            $riskGradings->orderByDesc('tahun')->orderBy('kode');
        }

        $riskGradings = (
            RiskGradingResource::collection($riskGradings->fastPaginate($request->load ?? $this->loadDefault)->withQueryString())
        )->additional([
            'attributes' => [
                'total' => RiskGrading::count(),
                'per_page' => $this->loadDefault,
            ],
            'filtered' => [
                'load' => $request->load ?? $this->loadDefault,
                'q' => $request->q ?? '',
                'page' => $request->page ?? 1,
                'field' => $request->field ?? '',
                'direction' => $request->direction ?? '',
            ],
        ]);

        $matrixRiskGradings = RiskGrading::query()
            ->where('tahun', $selectedYear)
            ->orderBy('kode')
            ->get()
            ->keyBy(fn ($riskGrading) => (string) $riskGrading->kode)
            ->map(fn ($riskGrading) => (new RiskGradingResource($riskGrading))->resolve());

        $availableYears = RiskGrading::query()
            ->select('tahun')
            ->distinct()
            ->orderByDesc('tahun')
            ->pluck('tahun')
            ->push($currentYear)
            ->push($currentYear + 1)
            ->push($currentYear + 2)
            ->push($selectedYear)
            ->filter()
            ->map(fn ($year) => (int) $year)
            ->unique()
            ->sortDesc()
            ->values();

        $yearCounts = RiskGrading::query()
            ->select('tahun', DB::raw('count(*) as total'))
            ->groupBy('tahun')
            ->pluck('total', 'tahun')
            ->mapWithKeys(fn ($total, $year) => [(int) $year => (int) $total]);

        $latestRiskGradings = RiskGrading::query()
            ->when($latestYear, fn ($query) => $query->where('tahun', $latestYear))
            ->orderBy('kode')
            ->get()
            ->keyBy(fn ($riskGrading) => (string) $riskGrading->kode)
            ->map(fn ($riskGrading) => [
                'kode' => (string) $riskGrading->kode,
                'name' => $riskGrading->name,
                'warna_klinis' => $riskGrading->warna_klinis,
                'name_nonklinis' => $riskGrading->name_nonklinis,
                'warna_nonklinis' => $riskGrading->warna_nonklinis,
                'name_klinis_pergub' => $riskGrading->name_klinis_pergub,
                'warna_klinis_pergub' => $riskGrading->warna_klinis_pergub,
                'name_nonklinis_pergub' => $riskGrading->name_nonklinis_pergub,
                'warna_nonklinis_pergub' => $riskGrading->warna_nonklinis_pergub,
                'name_klinis_bpkp' => $riskGrading->name_klinis_bpkp,
                'warna_klinis_bpkp' => $riskGrading->warna_klinis_bpkp,
                'name_nonklinis_bpkp' => $riskGrading->name_nonklinis_bpkp,
                'warna_nonklinis_bpkp' => $riskGrading->warna_nonklinis_bpkp,
                'name_ikp' => $riskGrading->name_ikp,
                'warna_ikp' => $riskGrading->warna_ikp,
                'name_bpkp' => $riskGrading->name_bpkp,
                'warna_bpkp' => $riskGrading->warna_bpkp,
            ]);

        return inertia('Master/RiskGrading/Index', [
            'riskGradings' => $riskGradings,
            'matrixRiskGradings' => $matrixRiskGradings,
            'availableYears' => $availableYears,
            'selectedYear' => $selectedYear,
            'selectedType' => $selectedType,
            'yearCounts' => $yearCounts,
            'latestRiskGradings' => $latestRiskGradings,
            'latestRiskGradingYear' => $latestYear,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateRiskGrading($request);

        RiskGrading::create($validated);

        return back()->with([
            'type' => 'success',
            'message' => 'Aturan grading risiko berhasil disimpan',
        ]);
    }

    public function copyYear(Request $request)
    {
        $validated = $request->validate([
            'source_year' => ['required', 'integer', 'digits:4', 'min:2000', 'max:2100', 'different:target_year'],
            'target_year' => ['required', 'integer', 'digits:4', 'min:2000', 'max:2100'],
        ], [
            'source_year.different' => 'Tahun sumber dan tujuan harus berbeda.',
        ]);

        $sourceRows = RiskGrading::query()
            ->where('tahun', $validated['source_year'])
            ->orderBy('kode')
            ->get();

        if ($sourceRows->isEmpty()) {
            return back()->with([
                'type' => 'error',
                'message' => 'Data grading tahun sumber tidak ditemukan',
            ]);
        }

        $targetRowsCount = RiskGrading::query()
            ->where('tahun', $validated['target_year'])
            ->count();

        if ($targetRowsCount > 0) {
            return back()->with([
                'type' => 'error',
                'message' => "Copy dibatalkan. Tahun {$validated['target_year']} sudah punya {$targetRowsCount} data grading, jadi tidak boleh ditimpa.",
            ]);
        }

        DB::transaction(function () use ($sourceRows, $validated) {
            foreach ($sourceRows as $source) {
                RiskGrading::create([
                    'tahun' => $validated['target_year'],
                    'kode' => (string) $source->kode,
                    'warna' => $source->warna,
                    'name' => $source->name,
                    'warna_klinis' => $source->warna_klinis,
                    'name_nonklinis' => $source->name_nonklinis,
                    'warna_nonklinis' => $source->warna_nonklinis,
                    'name_klinis_pergub' => $source->name_klinis_pergub,
                    'warna_klinis_pergub' => $source->warna_klinis_pergub,
                    'name_nonklinis_pergub' => $source->name_nonklinis_pergub,
                    'warna_nonklinis_pergub' => $source->warna_nonklinis_pergub,
                    'name_klinis_bpkp' => $source->name_klinis_bpkp,
                    'warna_klinis_bpkp' => $source->warna_klinis_bpkp,
                    'name_nonklinis_bpkp' => $source->name_nonklinis_bpkp,
                    'warna_nonklinis_bpkp' => $source->warna_nonklinis_bpkp,
                    'name_ikp' => $source->name_ikp,
                    'warna_ikp' => $source->warna_ikp,
                    'name_bpkp' => $source->name_bpkp,
                    'warna_bpkp' => $source->warna_bpkp,
                ]);
            }
        });

        return back()->with([
            'type' => 'success',
            'message' => "Grading tahun {$validated['source_year']} berhasil disalin ke {$validated['target_year']}",
        ]);
    }

    public function show(RiskGrading $riskGrading)
    {
        //
    }

    public function update(Request $request, RiskGrading $riskGrading)
    {
        $validated = $this->validateRiskGrading($request, $riskGrading);

        $riskGrading->update($validated);

        return back()->with([
            'type' => 'success',
            'message' => 'Aturan grading risiko berhasil diubah',
        ]);
    }

    public function destroy(RiskGrading $riskGrading)
    {
        if ($this->isUsedByTransaction($riskGrading)) {
            return back()->with([
                'type' => 'error',
                'message' => 'Aturan grading tidak bisa dihapus karena sudah dipakai transaksi pada tahun tersebut',
            ]);
        }

        $riskGrading->delete();

        return back()->with([
            'type' => 'success',
            'message' => 'Aturan grading risiko berhasil dihapus',
        ]);
    }

    private function validateRiskGrading(Request $request, ?RiskGrading $riskGrading = null): array
    {
        $request->merge([
            'tahun' => $riskGrading ? (int) $riskGrading->tahun : ($request->tahun ? (int) $request->tahun : null),
            'kode' => $riskGrading ? (string) $riskGrading->kode : ($request->kode !== null ? (string) $request->kode : null),
            'warna' => $request->warna ?: null,
            'warna_klinis' => $request->warna_klinis ?: null,
            'warna_nonklinis' => $request->warna_nonklinis ?: null,
            'warna_klinis_pergub' => $request->warna_klinis_pergub ?: null,
            'warna_nonklinis_pergub' => $request->warna_nonklinis_pergub ?: null,
            'warna_klinis_bpkp' => $request->warna_klinis_bpkp ?: null,
            'warna_nonklinis_bpkp' => $request->warna_nonklinis_bpkp ?: null,
            'warna_ikp' => $request->warna_ikp ?: null,
            'warna_bpkp' => $request->warna_bpkp ?: null,
        ]);

        $colorRules = ['nullable', 'regex:/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/', 'max:20'];

        return $request->validate([
            'tahun' => ['required', 'integer', 'digits:4', 'min:2000', 'max:2100'],
            'kode' => [
                'required',
                'string',
                'max:10',
                'regex:/^[1-5]{2}$/',
                Rule::unique('risk_gradings', 'kode')
                    ->where(fn ($query) => $query->where('tahun', $request->tahun))
                    ->ignore($riskGrading?->id),
            ],
            'warna' => $colorRules,
            'warna_klinis' => $colorRules,
            'name' => ['required', 'string', 'max:255'],
            'warna_nonklinis' => $colorRules,
            'name_nonklinis' => ['required', 'string', 'max:255'],
            'warna_klinis_pergub' => $colorRules,
            'name_klinis_pergub' => ['required', 'string', 'max:255'],
            'warna_nonklinis_pergub' => $colorRules,
            'name_nonklinis_pergub' => ['required', 'string', 'max:255'],
            'warna_klinis_bpkp' => $colorRules,
            'name_klinis_bpkp' => ['required', 'string', 'max:255'],
            'warna_nonklinis_bpkp' => $colorRules,
            'name_nonklinis_bpkp' => ['required', 'string', 'max:255'],
            'warna_ikp' => $colorRules,
            'name_ikp' => ['required', 'string', 'max:255'],
            'warna_bpkp' => $colorRules,
            'name_bpkp' => ['required', 'string', 'max:255'],
        ], [
            'kode.regex' => 'Kode harus berupa gabungan Dampak dan Probabilitas, contoh 11 sampai 55.',
            'kode.unique' => 'Kode grading sudah ada untuk tahun yang sama.',
            'warna.regex' => 'Warna harus format hex, contoh #dc2626.',
            'warna_klinis.regex' => 'Warna klinis harus format hex, contoh #dc2626.',
            'warna_nonklinis.regex' => 'Warna non klinis harus format hex, contoh #dc2626.',
            'warna_klinis_pergub.regex' => 'Warna klinis pergub harus format hex, contoh #dc2626.',
            'warna_nonklinis_pergub.regex' => 'Warna non klinis pergub harus format hex, contoh #dc2626.',
            'warna_klinis_bpkp.regex' => 'Warna klinis BPKP harus format hex, contoh #dc2626.',
            'warna_nonklinis_bpkp.regex' => 'Warna non klinis BPKP harus format hex, contoh #dc2626.',
            'warna_ikp.regex' => 'Warna IKP harus format hex, contoh #dc2626.',
            'warna_bpkp.regex' => 'Warna BPKP harus format hex, contoh #dc2626.',
        ]);
    }

    private function isUsedByTransaction(RiskGrading $riskGrading): bool
    {
        $usedByRiskRegister = DB::table('risk_registers')
            ->where(function ($query) use ($riskGrading) {
                $query->whereYear('tgl_register', $riskGrading->tahun);

                if ((int) $riskGrading->tahun === RiskGrading::DEFAULT_TAHUN) {
                    $query->orWhereNull('tgl_register');
                }
            })
            ->where(function ($query) use ($riskGrading) {
                $query->where('concatdp1', $riskGrading->kode)
                    ->orWhere('concatdp2', $riskGrading->kode)
                    ->orWhere('concatdp3', $riskGrading->kode)
                    ->orWhere('concatdp4', $riskGrading->kode);
            })
            ->exists();

        if ($usedByRiskRegister) {
            return true;
        }

        return DB::table('ikp_pasiens')
            ->where(function ($query) use ($riskGrading) {
                $query->whereYear('tanggal_insiden', $riskGrading->tahun)
                    ->orWhere(function ($fallback) use ($riskGrading) {
                        $fallback->whereNull('tanggal_insiden')
                            ->whereYear('created_at', $riskGrading->tahun);
                    });
            })
            ->where('concatdp', $riskGrading->kode)
            ->exists();
    }
}
