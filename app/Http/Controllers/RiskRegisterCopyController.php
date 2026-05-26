<?php

namespace App\Http\Controllers;

use App\Models\IdentificationSource;
use App\Models\Pic;
use App\Models\RiskCategory;
use App\Models\RiskType;
use App\Models\RiskVariety;
use App\Models\User;
use App\Services\RiskRegisterYearCopyService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RiskRegisterCopyController extends Controller
{
    public function index(Request $request, RiskRegisterYearCopyService $copyService)
    {
        $this->authorizeAccess();

        $filters = $this->filters($request);

        return Inertia::render('RiskRegister/Copy/Index', [
            'filters' => $filters,
            'preview' => $copyService->preview($filters),
            'options' => $this->options(),
        ]);
    }

    public function store(Request $request, RiskRegisterYearCopyService $copyService)
    {
        $this->authorizeAccess();

        $filters = $this->filters($request);
        $result = $copyService->copy($filters);

        return back()->with([
            'type' => $result['type'],
            'message' => $result['message'],
        ]);
    }

    private function filters(Request $request): array
    {
        $validated = $request->validate([
            'source_year' => ['nullable', 'integer', 'digits:4', 'min:2000', 'max:2100'],
            'target_year' => ['nullable', 'integer', 'digits:4', 'min:2000', 'max:2100', 'gt:source_year'],
            'tipe_id' => ['nullable', 'integer', 'in:1,2'],
            'currently_id' => ['nullable', 'integer', 'in:1,2'],
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'pic_id' => ['nullable', 'integer', 'exists:pics,id'],
            'risk_category_id' => ['nullable', 'integer', 'exists:risk_categories,id'],
            'risk_type_id' => ['nullable', 'integer', 'exists:risk_types,id'],
            'risk_variety_id' => ['nullable', 'integer', 'exists:risk_varieties,id'],
            'identification_source_id' => ['nullable', 'integer', 'exists:identification_sources,id'],
            'priority_scope' => ['nullable', 'string', 'in:all,priority,bpkp'],
        ]);

        return [
            'source_year' => (int) ($validated['source_year'] ?? 2025),
            'target_year' => (int) ($validated['target_year'] ?? 2026),
            'tipe_id' => $validated['tipe_id'] ?? null,
            'currently_id' => $validated['currently_id'] ?? null,
            'user_id' => $validated['user_id'] ?? null,
            'pic_id' => $validated['pic_id'] ?? null,
            'risk_category_id' => $validated['risk_category_id'] ?? null,
            'risk_type_id' => $validated['risk_type_id'] ?? null,
            'risk_variety_id' => $validated['risk_variety_id'] ?? null,
            'identification_source_id' => $validated['identification_source_id'] ?? null,
            'priority_scope' => $validated['priority_scope'] ?? 'all',
        ];
    }

    private function options(): array
    {
        return [
            'users' => User::query()
                ->select('id', 'name', 'pic_id')
                ->orderBy('name')
                ->get(),
            'pics' => Pic::query()
                ->select('id', 'name')
                ->orderBy('name')
                ->get(),
            'riskCategories' => RiskCategory::query()
                ->select('id', 'name')
                ->orderBy('name')
                ->get(),
            'riskTypes' => RiskType::query()
                ->select('id', 'name')
                ->orderBy('name')
                ->get(),
            'riskVarieties' => RiskVariety::query()
                ->select('id', 'name')
                ->orderBy('name')
                ->get(),
            'identificationSources' => IdentificationSource::query()
                ->select('id', 'name')
                ->orderBy('name')
                ->get(),
        ];
    }

    private function authorizeAccess(): void
    {
        abort_unless(
            auth()->user()->can('lihat data semua risk register')
                || auth()->user()->can('atur data master manajemen risiko')
                || auth()->user()->can('atur hak akses'),
            403
        );
    }
}
