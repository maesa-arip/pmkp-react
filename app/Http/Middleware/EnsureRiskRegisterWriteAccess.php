<?php

namespace App\Http\Middleware;

use App\Models\RiskRegister;
use App\Services\RiskRegisterWriteAccess;
use Closure;
use Illuminate\Http\Request;

class EnsureRiskRegisterWriteAccess
{
    public function handle(Request $request, Closure $next)
    {
        $types = [
            'riskRegisterKlinis.update' => 1, 'riskRegisterKlinis.destroy' => 1,
            'riskRegisterNonKlinis.update' => 2, 'riskRegisterNonKlinis.destroy' => 2,
            'riskRegisterKlinisPengendalian.update' => 1, 'klinisOpsiPengendalian.update' => 1,
        ];
        // These endpoints intentionally serve the subforms of BOTH risk types.
        $shared = ['riskregister.formulirrca', 'riskregister.fgdinherent', 'riskregister.fgdresidual',
            'riskregister.fgdtreated', 'riskregister.fgdactual', 'riskRegisterKlinisOsd2.update',
            'riskregister.requestupdatestatus', 'riskregister.updatestatus'];
        $name = $request->route()?->getName();
        if (! $request->user() || (! isset($types[$name]) && ! in_array($name, $shared, true))) {
            return $next($request);
        }
        $parameters = $request->route()->parameters();
        $id = $parameters ? reset($parameters) : $request->input('id');
        abort_unless($id instanceof RiskRegister || (is_scalar($id) && ctype_digit((string) $id)), 404);
        $risk = $id instanceof RiskRegister ? $id : RiskRegister::findOrFail($id);
        if (isset($types[$name])) {
            abort_unless((int) $risk->tipe_id === $types[$name], 404);
        }
        abort_unless(app(RiskRegisterWriteAccess::class)->allows($request->user(), $risk), 403);

        return $next($request);
    }
}
