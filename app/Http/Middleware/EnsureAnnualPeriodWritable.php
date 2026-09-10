<?php

namespace App\Http\Middleware;

use App\Models\PeriodeKinerja;
use App\Models\RiskRegister;
use Closure;
use Illuminate\Http\Request;

class EnsureAnnualPeriodWritable
{
    public function handle(Request $request, Closure $next)
    {
        if (! $request->isMethodSafe()) {
            $name = $request->route()?->getName() ?? '';
            if (str_starts_with($name, 'riskregister.') || str_starts_with($name, 'riskRegister') || str_starts_with($name, 'klinisOpsiPengendalian')) {
                // Check before FGD/RCA/verification child rows are written by legacy controllers.
                $parameters = $request->route()->parameters();
                $candidate = $parameters ? reset($parameters) : $request->input('id');
                $risk = $candidate instanceof RiskRegister ? $candidate : (is_numeric($candidate) ? RiskRegister::find($candidate) : null);
                if ($risk?->periode_kinerja_id) {
                    PeriodeKinerja::findOrFail($risk->periode_kinerja_id)->assertWritable();
                }
            }
            if ($name === 'MutuUnit.formulirpdsa') {
                $unit = \App\Models\MUTU\MutuUnit::findOrFail($request->input('id'));
                PeriodeKinerja::findOrFail($unit->mutu_indikator->periode_kinerja_id)->assertWritable();
            }
        }

        return $next($request);
    }
}
