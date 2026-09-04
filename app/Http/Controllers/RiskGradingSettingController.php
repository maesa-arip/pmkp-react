<?php

namespace App\Http\Controllers;

use App\Models\RiskGradingSetting;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class RiskGradingSettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Master/RiskGradingSetting/Index', [
            'settings' => RiskGradingSetting::allValues(),
            'options' => collect(RiskGradingSetting::OPTIONS)
                ->map(fn ($label, $value) => ['value' => $value, 'label' => $label])
                ->values(),
        ]);
    }

    public function update(Request $request)
    {
        $rules = collect(RiskGradingSetting::DEFAULTS)
            ->mapWithKeys(fn ($default, $key) => [
                $key => ['required', Rule::in(RiskGradingSetting::allowedValues())],
            ])
            ->all();

        $validated = $request->validate($rules);

        foreach ($validated as $key => $value) {
            RiskGradingSetting::query()->updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        return redirect()
            ->route('riskGradingSettings.index')
            ->with('type', 'success')
            ->with('message', 'Aturan grading berhasil disimpan');
    }
}
