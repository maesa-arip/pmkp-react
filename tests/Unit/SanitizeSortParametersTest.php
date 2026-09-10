<?php

namespace Tests\Unit;

use App\Http\Middleware\SanitizeSortParameters;
use Illuminate\Http\Request;
use PHPUnit\Framework\TestCase;

class SanitizeSortParametersTest extends TestCase
{
    public function test_it_keeps_safe_sort_parameters()
    {
        $request = Request::create('/riskCategories', 'GET', [
            'field' => 'created_at',
            'direction' => 'DESC',
        ]);

        (new SanitizeSortParameters())->handle($request, fn ($request) => $request);

        $this->assertSame('created_at', $request->input('field'));
        $this->assertSame('desc', $request->input('direction'));
    }

    public function test_it_removes_unsafe_sort_parameters()
    {
        $request = Request::create('/riskCategories', 'GET', [
            'field' => 'name;drop table users',
            'direction' => 'desc',
        ]);

        (new SanitizeSortParameters())->handle($request, fn ($request) => $request);

        $this->assertFalse($request->has('field'));
        $this->assertFalse($request->has('direction'));
    }

    public function test_it_removes_invalid_sort_direction()
    {
        $request = Request::create('/riskCategories', 'GET', [
            'field' => 'name',
            'direction' => 'sideways',
        ]);

        (new SanitizeSortParameters())->handle($request, fn ($request) => $request);

        $this->assertFalse($request->has('field'));
        $this->assertFalse($request->has('direction'));
    }
}
