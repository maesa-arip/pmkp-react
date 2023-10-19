<?php

use App\Http\Controllers\CasemixController;
use App\Http\Controllers\CombinedRiskRegisterController;
use App\Http\Controllers\ControlValueController;
use App\Http\Controllers\ExcelController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\IdentificationSourceController;
use App\Http\Controllers\ImpactValueController;
use App\Http\Controllers\JenisSebabController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\OpsiPengendalianController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\PicController;
use App\Http\Controllers\ProbabilityValueController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RCAController;
use App\Http\Controllers\RiskCategoryController;
use App\Http\Controllers\RiskRegisterKlinisController;
use App\Http\Controllers\RiskRegisterKlinisOpsiPengendalianController;
use App\Http\Controllers\RiskRegisterKlinisOsd2Controller;
use App\Http\Controllers\RiskRegisterKlinisPengendalianController;
use App\Http\Controllers\RiskRegisterNonKlinisController;
use App\Http\Controllers\RiskTypeController;
use App\Http\Controllers\RiskVarietyController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VerificationController;
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

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });



Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/ ', [HomeController::class,'index'])->name('home');
    Route::get('/dashboard ', [HomeController::class,'index'])->name('dashboard');
    Route::get('/notifications ', [HomeController::class,'notifications'])->name('notifications');
    Route::get('/requeststatus ', [HomeController::class,'requeststatus'])->name('requeststatus');
    
    Route::Resource('users', UserController::class);
    // Route::Resource('casemix', CasemixController::class);
    Route::apiResource('roles', RoleController::class);
    Route::apiResource('permissions', PermissionController::class);
    Route::Resource('riskCategories', RiskCategoryController::class);
    Route::Resource('opsiPengendalians', OpsiPengendalianController::class);
    Route::Resource('identificationSources', IdentificationSourceController::class);
    Route::apiResource('locations', LocationController::class);
    Route::apiResource('riskVarieties', RiskVarietyController::class);
    Route::apiResource('riskTypes', RiskTypeController::class);
    Route::apiResource('pics', PicController::class);
    Route::apiResource('impactValues', ImpactValueController::class);
    Route::apiResource('probabilityValues', ProbabilityValueController::class);
    Route::apiResource('controlValues', ControlValueController::class);
    Route::apiResource('jenisSebabs', JenisSebabController::class);

    Route::apiResource('riskRegisterKlinis', RiskRegisterKlinisController::class);
    Route::get('/rca/sedangterjadi', [RCAController::class,'sedangterjadi'])->name('rca.sedangterjadi');
    Route::get('/rca/risikoprioritas', [RCAController::class,'risikoprioritas'])->name('rca.risikoprioritas');
    Route::put('/formulirrca', [RiskRegisterKlinisController::class,'formulirrca'])->name('riskregister.formulirrca');
    Route::put('/requestupdatestatus', [RiskRegisterKlinisController::class,'requestupdatestatus'])->name('riskregister.requestupdatestatus');
    Route::get('/verification/occurring/management', [VerificationController::class,'occurringmanagement'])->name('riskregister.verificationmanagementoccurring');
    Route::get('/verification/occurring/admin', [VerificationController::class,'occurringadmin'])->name('riskregister.verificationadminoccurring');

    Route::get('/verification/priority/management', [VerificationController::class,'prioritymanagement'])->name('riskregister.verificationmanagementpriority');
    Route::get('/verification/priority/admin', [VerificationController::class,'priorityadmin'])->name('riskregister.verificationadminpriority');
    Route::put('/updatestatus', [RiskRegisterKlinisController::class,'updatestatus'])->name('riskregister.updatestatus');
    Route::put('/fgdinherent', [RiskRegisterKlinisController::class,'fgdinherent'])->name('riskregister.fgdinherent');
    Route::put('/fgdresidual', [RiskRegisterKlinisController::class,'fgdresidual'])->name('riskregister.fgdresidual');
    Route::put('/fgdtreated', [RiskRegisterKlinisController::class,'fgdtreated'])->name('riskregister.fgdtreated');
    Route::apiResource('riskRegisterKlinisPengendalian', RiskRegisterKlinisPengendalianController::class);
    Route::apiResource('klinisOpsiPengendalian', RiskRegisterKlinisOpsiPengendalianController::class);
    Route::apiResource('riskRegisterKlinisOsd2', RiskRegisterKlinisOsd2Controller::class);

    Route::apiResource('riskRegisterNonKlinis', RiskRegisterNonKlinisController::class);
    
    Route::get('export/riskregisterklinis', [ExportController::class, 'riskregisterklinis'])->name('export.riskregisterklinis');
    Route::get('export/riskregisterbpkp', [ExportController::class, 'riskregisterbpkp'])->name('export.riskregisterbpkp');
    Route::get('export/riskregisterklinisbpkp', [ExportController::class, 'riskregisterklinisbpkp'])->name('export.riskregisterklinisbpkp');
    Route::get('export/riskregisternonklinisbpkp', [ExportController::class, 'riskregisternonklinisbpkp'])->name('export.riskregisternonklinisbpkp');
    Route::get('export/riskregisterklinisfitur4', [ExportController::class, 'riskregisterklinisfitur4'])->name('export.riskregisterklinisfitur4');
    Route::get('export/riskregisterklinislarsdhp', [ExportController::class, 'riskregisterklinislarsdhp'])->name('export.riskregisterklinislarsdhp');

    // Route::get('export/riskregisterklinislarsdhpasli', [ExportController::class, 'riskregisterklinislarsdhpasli'])->name('export.riskregisterklinislarsdhpasli');
    // Route::get('export/riskregisterklinislarsdhpcombine', [ExportController::class, 'riskregisterklinislarsdhpcombine'])->name('export.riskregisterklinislarsdhpcombine');
    // Route::get('export/riskregisterklinislarsdhpwithchart', [ExportController::class, 'riskregisterklinislarsdhpwithchart'])->name('export.riskregisterklinislarsdhpwithchart');
    Route::get('export/exampleexport', [ExportController::class, 'exampleexport'])->name('export.exampleexport');
    Route::get('export/export', [ExportController::class, 'export'])->name('export.export');
    Route::get('export/exportChart', [ExportController::class, 'exportChart'])->name('export.exportChart');
    Route::get('export/riskregisterklinispdf', [ExportController::class, 'exportpdf'])->name('export.riskregisterklinispdf');

    Route::get('/export-excel', [ExcelController::class, 'exportXls'])->name('export.excel');
    // Route::get('/excel-riskregisterklinislarsdhp', [ExcelController::class, 'riskregisterklinislarsdhp'])->name('excel.riskregisterklinislarsdhp');


    // Route::post('/riskregisterklinislarsdhp', [ExportController::class, 'riskregisterklinislarsdhp']);
    Route::match(['GET', 'POST'], '/riskregisterklinislarsdhp', [ExportController::class, 'riskregisterklinislarsdhp']);
    Route::match(['GET', 'POST'], '/riskregisternonklinislarsdhp', [ExportController::class, 'riskregisternonklinislarsdhp']);
    Route::match(['GET', 'POST'], '/riskregisterbpkp', [ExportController::class, 'riskregisterbpkp']);
    // Route::match(['GET', 'POST'], '/riskregisterklinisbpkp', [ExportController::class, 'riskregisterklinisbpkp']);
    // Route::match(['GET', 'POST'], '/riskregisternonklinisbpkp', [ExportController::class, 'riskregisternonklinisbpkp']);
});

require __DIR__.'/auth.php';
