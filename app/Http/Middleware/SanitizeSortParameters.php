<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SanitizeSortParameters
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->has(['field', 'direction'])) {
            return $next($request);
        }

        $field = $request->input('field');
        $direction = strtolower((string) $request->input('direction'));

        if (!$this->isSafeField($field) || !in_array($direction, ['asc', 'desc'], true)) {
            $this->removeSortParameters($request);

            return $next($request);
        }

        $request->merge(['direction' => $direction]);

        return $next($request);
    }

    private function isSafeField(mixed $field): bool
    {
        if (!is_string($field)) {
            return false;
        }

        return preg_match('/\A[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)?\z/', $field) === 1;
    }

    private function removeSortParameters(Request $request): void
    {
        foreach (['field', 'direction'] as $key) {
            $request->query->remove($key);
            $request->request->remove($key);
        }
    }
}
