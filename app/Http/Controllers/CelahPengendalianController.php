<?php

namespace App\Http\Controllers;

use App\Models\CelahPengendalian;
use App\Models\RiskRegister;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Validation\Rule;

class CelahPengendalianController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $user = $request->user();
            abort_unless($user && ($user->hasRole('super admin')
                || $user->can('atur data master manajemen risiko')
                || $user->can('edit data master manajemen risiko')), 403);

            return $next($request);
        });
    }

    public function index(Request $request)
    {
        $request->validate([
            'q' => 'nullable|string|max:255', 'load' => 'nullable|integer|min:1|max:100',
            'field' => ['nullable', Rule::in(['name', 'description', 'is_active', 'created_at'])],
            'direction' => ['nullable', Rule::in(['asc', 'desc'])],
        ]);
        $query = CelahPengendalian::query();
        if ($request->filled('q')) {
            $query->where(fn ($q) => $q->where('name', 'like', '%'.$request->q.'%')
                ->orWhere('description', 'like', '%'.$request->q.'%'));
        }
        $items = $query->orderBy($request->input('field') ?: 'name', $request->input('direction') ?: 'asc')
            ->orderBy('id')->paginate($request->integer('load', 10))->withQueryString();

        return inertia('Master/CelahPengendalian/Index', [
            'celahPengendalians' => JsonResource::collection($items)->additional([
                'attributes' => ['total' => $items->total(), 'per_page' => $items->perPage()],
                'filtered' => [
                    'load' => $items->perPage(), 'q' => $request->q ?? '', 'page' => $items->currentPage(),
                    'field' => $request->field ?? '', 'direction' => $request->direction ?? '',
                ],
            ]),
        ]);
    }

    private function validated(Request $request, ?CelahPengendalian $model = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('celah_pengendalians', 'name')->ignore($model?->id)],
            'description' => 'nullable|string|max:2000',
            'is_active' => 'required|boolean',
        ]);
    }

    public function store(Request $request)
    {
        CelahPengendalian::create($this->validated($request));

        return back()->with(['type' => 'success', 'message' => 'Celah pengendalian berhasil ditambahkan.']);
    }

    public function update(Request $request, CelahPengendalian $celahPengendalian)
    {
        $celahPengendalian->update($this->validated($request, $celahPengendalian));

        return back()->with(['type' => 'success', 'message' => 'Celah pengendalian berhasil diperbarui.']);
    }

    public function destroy(CelahPengendalian $celahPengendalian)
    {
        if (RiskRegister::withTrashed()->where('celah_pengendalian', $celahPengendalian->name)->exists()) {
            return back()->with(['type' => 'error', 'message' => 'Celah pengendalian sudah digunakan. Nonaktifkan melalui Edit agar tidak ditawarkan untuk input baru.']);
        }
        $celahPengendalian->delete();

        return back()->with(['type' => 'success', 'message' => 'Celah pengendalian berhasil dihapus.']);
    }
}
