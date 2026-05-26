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
        $riskGradings = RiskGrading::query();

        if ($request->q) {
            $riskGradings->where(function ($query) use ($request) {
                $query->where('kode', 'like', '%' . $request->q . '%')
                    ->orWhere('tahun', 'like', '%' . $request->q . '%')
                    ->orWhere('name', 'like', '%' . $request->q . '%')
                    ->orWhere('name_nonklinis', 'like', '%' . $request->q . '%')
                    ->orWhere('name_nonklinis_pergub', 'like', '%' . $request->q . '%')
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

        return inertia('Master/RiskGrading/Index', ['riskGradings' => $riskGradings]);
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
        return $request->validate([
            'tahun' => ['required', 'integer', 'digits:4', 'min:2000', 'max:2100'],
            'kode' => [
                'required',
                'string',
                'max:10',
                Rule::unique('risk_gradings', 'kode')
                    ->where(fn ($query) => $query->where('tahun', $request->tahun))
                    ->ignore($riskGrading?->id),
            ],
            'warna' => ['nullable', 'regex:/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/', 'max:20'],
            'name' => ['required', 'string', 'max:255'],
            'name_nonklinis' => ['required', 'string', 'max:255'],
            'name_nonklinis_pergub' => ['required', 'string', 'max:255'],
            'name_ikp' => ['required', 'string', 'max:255'],
            'name_bpkp' => ['required', 'string', 'max:255'],
        ], [
            'kode.unique' => 'Kode grading sudah ada untuk tahun yang sama.',
            'warna.regex' => 'Warna harus format hex, contoh #dc2626.',
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
