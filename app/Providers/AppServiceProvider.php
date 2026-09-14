<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->scoped('annual.periods', fn () => \App\Models\PeriodeKinerja::pluck('tahun', 'id')->all());
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        \App\Models\RiskRegister::observe(\App\Observers\AnnualRiskObserver::class);
        \App\Models\MUTU\MutuUnit::observe(\App\Observers\AnnualMutuObserver::class);
    }
}
