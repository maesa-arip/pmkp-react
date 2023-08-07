<?php

namespace App\Http\Middleware;

use App\Models\RiskRegister;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tightenco\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
            $whosLogin = $request->user() ? (auth()->user()->can('lihat data semua risk register') ? [['pic_id', '<>', 0]] : [['pic_id', auth()->user()->pic_id]]) : '';
            $notifications = $request->user() ? RiskRegister::query()
            ->where($whosLogin)->where('currently_id',1)->count() : '';
            $permissionNames = $request->user() ? $request->user()->getAllPermissions() : null;
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
            ],
            'ziggy' => function () use ($request) {
                return array_merge((new Ziggy)->toArray(), [
                    'location' => $request->url(),
                ]);
            },
            'flash' => [
                'type' => $request->session()->get('type'),
                'message' => $request->session()->get('message'),
            ],
            'notifications' => $notifications,
            'permissionNames' => $permissionNames,
        ]);
    }
}
