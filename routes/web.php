<?php

use App\Http\Controllers\CasemixController;
use App\Http\Controllers\ControlValueController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\IdentificationSourceController;
use App\Http\Controllers\ImpactValueController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\PicController;
use App\Http\Controllers\ProbabilityValueController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RiskCategoryController;
use App\Http\Controllers\RiskRegisterKlinisController;
use App\Http\Controllers\RiskRegisterNonKlinisController;
use App\Http\Controllers\RiskTypeController;
use App\Http\Controllers\RiskVarietyController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});



Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/dashboard ', HomeController::class)->name('dashboard');
    
    Route::Resource('users', UserController::class);
    // Route::Resource('casemix', CasemixController::class);
    Route::apiResource('roles', RoleController::class);
    Route::apiResource('permissions', PermissionController::class);
    Route::Resource('riskCategories', RiskCategoryController::class);
    Route::Resource('identificationSources', IdentificationSourceController::class);
    Route::apiResource('locations', LocationController::class);
    Route::apiResource('riskVarieties', RiskVarietyController::class);
    Route::apiResource('riskTypes', RiskTypeController::class);
    Route::apiResource('pics', PicController::class);
    Route::apiResource('impactValues', ImpactValueController::class);
    Route::apiResource('probabilityValues', ProbabilityValueController::class);
    Route::apiResource('controlValues', ControlValueController::class);
    Route::apiResource('riskRegisterKlinis', RiskRegisterKlinisController::class);
    Route::apiResource('riskRegisterNonKlinis', RiskRegisterNonKlinisController::class);
    
    Route::get('export/riskregisterklinis', [ExportController::class, 'riskregisterklinis'])->name('export.riskregisterklinis');
    Route::get('export/riskregisterklinisbpkp', [ExportController::class, 'riskregisterklinisbpkp'])->name('export.riskregisterklinisbpkp');
    Route::get('export/riskregisternonklinisbpkp', [ExportController::class, 'riskregisternonklinisbpkp'])->name('export.riskregisternonklinisbpkp');
    Route::get('export/riskregisterklinisfitur4', [ExportController::class, 'riskregisterklinisfitur4'])->name('export.riskregisterklinisfitur4');
    Route::get('export/riskregisterklinislarsdhp', [ExportController::class, 'riskregisterklinislarsdhp'])->name('export.riskregisterklinislarsdhp');
    Route::get('export/riskregisterklinispdf', [ExportController::class, 'exportpdf'])->name('export.riskregisterklinispdf');

    // Route::post('/riskregisterklinislarsdhp', [ExportController::class, 'riskregisterklinislarsdhp']);
    Route::match(['GET', 'POST'], '/riskregisterklinislarsdhp', [ExportController::class, 'riskregisterklinislarsdhp']);
});

require __DIR__.'/auth.php';
