<?php

namespace App\Http\Controllers;

use App\Http\Resources\RiskRegisterResource;
use App\Models\IndikatorFitur04;
use App\Models\RiskRegister;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\ControlValue;
use App\Models\IdentificationSource;
use App\Models\IKP\IkpPasien;
use App\Models\ImpactValue;
use App\Models\IncidentVariety;
use App\Models\IndikatorFitur4;
use App\Models\Location;
use App\Models\Pic;
use App\Models\ProbabilityValue;
use App\Models\RiskCategory;
use App\Models\RiskRegisterHistory;
use App\Models\RiskType;
use App\Models\RiskVariety;
use App\Models\User;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Carbon\Carbon; // Untuk memanipulasi waktu

class HomeController extends Controller
{
    public $loadDefault = 10;
    
    public function index(Request $request)
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['pic_id', '<>', 0]] : [['pic_id', auth()->user()->pic_id]];
        
        // ---------------------------------------------------------
        // 1. DATA KPI KARTU ATAS
        // ---------------------------------------------------------
        $riskRegisterKlinis = RiskRegister::query()->where('tipe_id', 1)->where($whosLogin)->count();
        $riskRegisterNonKlinis = RiskRegister::query()->where('tipe_id', 2)->where($whosLogin)->count();
        
        $priorityRisk = RiskRegister::query()->whereHas('riskgrading', function (Builder $query) {
            $query->where('name_bpkp', 'like', '%TINGGI%')->orWhere('name_bpkp', 'SEDANG');
        })->with('riskgrading')->where($whosLogin)->count();
        
        $occuringManagement = RiskRegister::query()
            ->whereHas('requestupdate', function (Builder $query) {
                $query->where('request_updates.is_approved', 1);
            })->whereDoesntHave('requestupdateverificationmanagement', function (Builder $query) {
                $query->where('request_updates.is_approved', 1);
            })->where($whosLogin)->count();
            
        $occuringAdmin = RiskRegister::query()
            ->whereHas('requestupdate', function (Builder $query) {
                $query->where('is_approved', 1);
            })->whereDoesntHave('requestupdateverificationadmin', function (Builder $query) {
                $query->where('request_updates.is_approved', 1);
            })->where($whosLogin)->count();

        // Hitung Total Seluruh IKP Pasien
        $totalIkp = IkpPasien::count(); 

        // ---------------------------------------------------------
        // 2. DATA GRAFIK TREN (6 BULAN TERAKHIR)
        // ---------------------------------------------------------
        $trendData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $monthName = $month->translatedFormat('M'); // Menghasilkan: Jan, Feb, Mar, dll.
            
            $ikpCount = IkpPasien::whereYear('created_at', $month->year)
                                 ->whereMonth('created_at', $month->month)
                                 ->count();
                                 
            $risikoCount = RiskRegister::whereYear('created_at', $month->year)
                                       ->whereMonth('created_at', $month->month)
                                       ->count();

            $trendData[] = [
                'name' => $monthName,
                'ikp' => $ikpCount,
                'risiko' => $risikoCount
            ];
        }

        // ---------------------------------------------------------
        // 3. DATA PIE CHART (TIPE INSIDEN IKP)
        // ---------------------------------------------------------
        try {
            $ikpTipeDataRaw = DB::table('ikp_pasiens')
                ->join('ikp_tipe_insidens', 'ikp_pasiens.ikp_tipe_insiden_id', '=', 'ikp_tipe_insidens.id')
                ->select('ikp_tipe_insidens.name', DB::raw('count(*) as value'))
                ->whereNull('ikp_pasiens.deleted_at')
                ->groupBy('ikp_tipe_insidens.name')
                ->get();
        } catch (\Exception $e) {
            // Fallback jika tabel relasi belum ada
            $ikpTipeDataRaw = DB::table('ikp_pasiens')
                ->select('ikp_tipe_insiden_id as name', DB::raw('count(*) as value'))
                ->whereNull('deleted_at')
                ->groupBy('ikp_tipe_insiden_id')
                ->get();
        }

        $colors = ['#e11d48', '#f59e0b', '#3b82f6', '#334155', '#10b981', '#8b5cf6'];
        $ikpTipeData = $ikpTipeDataRaw->map(function ($item, $key) use ($colors) {
            return [
                'name' => $item->name,
                'value' => $item->value,
                'color' => $colors[$key % count($colors)]
            ];
        });

        // ---------------------------------------------------------
        // 4. DATA HEATMAP MATRIKS (Dampak vs Probabilitas)
        // ---------------------------------------------------------
        $heatmapRaw = DB::table('ikp_pasiens')
            ->select('ikp_probabilitas_id', 'ikp_dampak_id', DB::raw('count(*) as count'))
            ->whereNull('deleted_at')
            ->groupBy('ikp_probabilitas_id', 'ikp_dampak_id')
            ->get();

        $heatmapCounts = new \stdClass();
        foreach ($heatmapRaw as $item) {
            // Asumsi IDs adalah 1 sampai 5.
            // Rumus Indexing Array JS (0-4):
            // Probabilitas 5 di array index ke-0 -> 5 - probabilitas
            // Dampak 1 di array index ke-0 -> dampak - 1
            $rIndex = 5 - (int)$item->ikp_probabilitas_id;
            $cIndex = (int)$item->ikp_dampak_id - 1;
            
            if ($rIndex >= 0 && $rIndex <= 4 && $cIndex >= 0 && $cIndex <= 4) {
                $key = "{$rIndex}-{$cIndex}";
                $heatmapCounts->$key = $item->count;
            }
        }

        // ---------------------------------------------------------
       // ---------------------------------------------------------
        // 5. DATA AKTIVITAS TERAKHIR (Activity Log Spatie)
        // ---------------------------------------------------------
        Carbon::setLocale('id'); 
        
        $activities = DB::table(config('activitylog.table_name', 'activity_log'))
            ->leftJoin('users', 'activity_log.causer_id', '=', 'users.id')
            ->select('activity_log.*', 'users.name as user_name')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $recentActivities = $activities->map(function($act) {
            $descRaw = strtolower($act->description);
            $event = 'updated';
            $actionText = 'Memperbarui';
            
            // 1. Tentukan Jenis Event & Kata Kerjanya
            if ($descRaw === 'created' || str_contains($descRaw, 'tambah') || str_contains($descRaw, 'lapor')) {
                $event = 'created';
                $actionText = 'Menambahkan';
            } elseif ($descRaw === 'deleted' || str_contains($descRaw, 'hapus')) {
                $event = 'deleted';
                $actionText = 'Menghapus';
            } elseif (str_contains($descRaw, 'verif') || str_contains($descRaw, 'approve') || str_contains($descRaw, 'setuju')) {
                $event = 'verified';
                $actionText = 'Memverifikasi';
            }

            // 2. Ekstrak Data dari JSON Properties
            $props = json_decode($act->properties, true) ?? [];
            $attributes = $props['attributes'] ?? $props; // Ambil data baru (attributes)
            
            // 3. Kenali Subject (Model apa yang diubah?)
            $subjectClass = class_basename($act->subject_type); // Menghasilkan: 'IkpPasien', 'RiskRegister', dll
            $detailText = "Data " . $subjectClass;

            if ($subjectClass === 'IkpPasien') {
                $namaPasien = $attributes['namapasien'] ?? 'Pasien';
                $insiden = $attributes['insiden'] ?? 'Insiden';
                $detailText = "IKP: {$namaPasien} ({$insiden})";
            } elseif ($subjectClass === 'RiskRegister') {
                $kode = $attributes['kode_risiko'] ?? '';
                $detailText = "Risiko: {$kode}";
            } elseif ($subjectClass === 'MutuIndikator') {
                $detailText = "Kamus Indikator Mutu";
            }

            return [
                'id' => $act->id,
                'event' => $event,
                'log_name' => strtoupper($act->log_name ?? 'Sistem'),
                'desc' => "{$actionText} {$detailText}",
                'time' => Carbon::parse($act->created_at)->diffForHumans(),
                'user' => $act->user_name ?? 'Sistem',
            ];
        });

        // ---------------------------------------------------------
        // KEMBALIKAN KE INERTIA
        // ---------------------------------------------------------
        return inertia('Dashboard', [
            'riskRegisterKlinis' => $riskRegisterKlinis, 
            'riskRegisterNonKlinis' => $riskRegisterNonKlinis, 
            'priorityRisk' => $priorityRisk, 
            'occuringManagement' => $occuringManagement, 
            'occuringAdmin' => $occuringAdmin,
            'totalIkp' => $totalIkp,
            'trendData' => $trendData,
            'ikpTipeData' => $ikpTipeData,
            'heatmapCounts' => $heatmapCounts,
            'recentActivities' => $recentActivities,
        ]);
    }

    public function notifications(Request $request)
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['pic_id', '<>', 0]] : [['pic_id', auth()->user()->pic_id]];
        $riskRegisterKlinis = RiskRegister::query()
            ->with('risk_category')
            ->with('identification_source')
            ->with('risk_variety')
            ->with('risk_type')
            ->with('pic')
            ->with('user')
            ->with('risk_register_histories')
            ->with('copiedFromRiskRegister.risk_register_histories')
            ->with('copiedFromRiskRegister.user')
            ->with('requestupdate')
            ->with('requestupdateverificationmanagement')
            ->with('requestupdateverificationadmin')
            ->with('verificationpriorityadmin')
            ->with('verificationprioritymanagement')
            ->where('currently_id', 1)
            ->where($whosLogin)
            ->orderBy('currently_id', 'ASC');
        if ($request->q) {
            $riskRegisterKlinis->where('tipe_id', 'like', '%' . $request->q . '%')->orWhere('pernyataan_risiko', 'like', '%' . $request->q . '%');
        }
        if ($request->has(['field', 'direction'])) {
            $riskRegisterKlinis->orderBy($request->field, $request->direction);
        }
        $riskRegisterKlinis = (RiskRegisterResource::collection($riskRegisterKlinis->fastPaginate($request->load ?? $this->loadDefault)->withQueryString())
        )->additional([
            'attributes' => [
                'total' => 1100,
                'per_page' => 10,
            ],
            'filtered' => [
                'load' => $request->load ?? $this->loadDefault,
                'q' => $request->q ?? '',
                'page' => $request->page ?? 1,
                'field' => $request->field ?? '',
                'direction' => $request->direction ?? '',

            ]
        ]);
        $riskCategories = RiskCategory::get();
        $identificationSources = IdentificationSource::get();
        $locations = Location::get();
        $riskVarieties = RiskVariety::get();
        $riskTypes = RiskType::get();
        $pics = Pic::get();
        $impactValues = ImpactValue::get();
        $probabilityValues = ProbabilityValue::get();
        $controlValues = ControlValue::get();

        $location_login = auth()->user() ? Pic::where('id', auth()->user()->pic_id)->get() : Pic::where('id', 41)->get();
        $indikatorFitur04s = IndikatorFitur04::where('location_id', $location_login[0]->location_id)->orderBy('name', 'DESC')->get();
        return inertia('RiskRegister/History/Index', ['riskRegisterKlinis' => $riskRegisterKlinis, 'riskCategories' => $riskCategories, 'identificationSources' => $identificationSources, 'locations' => $locations, 'riskVarieties' => $riskVarieties, 'riskTypes' => $riskTypes, 'pics' => $pics, 'impactValues' => $impactValues, 'probabilityValues' => $probabilityValues, 'controlValues' => $controlValues, 'indikatorFitur04s' => $indikatorFitur04s]);
    }
    
    public function requeststatus(Request $request)
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $riskRegisterKlinis = RiskRegister::query()
            ->has('requestupdate')
            ->with('risk_category')
            ->with('identification_source')
            // ->with('location')
            ->with('risk_variety')
            ->with('risk_type')
            ->with('pic')
            ->with('risk_register_histories')
            ->with('copiedFromRiskRegister.risk_register_histories')
            ->with('copiedFromRiskRegister.user')
            ->with('user')
            ->with('requestupdate')
            ->where('currently_id', 1)
            ->where($whosLogin)
            ->orderBy('currently_id', 'ASC');
        if ($request->q) {
            $riskRegisterKlinis->where('tipe_id', 'like', '%' . $request->q . '%');
        }
        if ($request->has(['field', 'direction'])) {
            $riskRegisterKlinis->orderBy($request->field, $request->direction);
        }
        $riskRegisterKlinis = (RiskRegisterResource::collection($riskRegisterKlinis->fastPaginate($request->load ?? $this->loadDefault)->withQueryString())
        )->additional([
            'attributes' => [
                'total' => 1100,
                'per_page' => 10,
            ],
            'filtered' => [
                'load' => $request->load ?? $this->loadDefault,
                'q' => $request->q ?? '',
                'page' => $request->page ?? 1,
                'field' => $request->field ?? '',
                'direction' => $request->direction ?? '',

            ]
        ]);
        $riskCategories = RiskCategory::get();
        $identificationSources = IdentificationSource::get();
        $locations = Location::get();
        $riskVarieties = RiskVariety::get();
        $riskTypes = RiskType::get();
        $pics = Pic::get();
        $impactValues = ImpactValue::get();
        $probabilityValues = ProbabilityValue::get();
        $controlValues = ControlValue::get();

        $location_login = auth()->user() ? Pic::where('id', auth()->user()->pic_id)->get() : Pic::where('id', 41)->get();
        $indikatorFitur04s = IndikatorFitur04::where('location_id', $location_login[0]->location_id)->orderBy('name', 'DESC')->get();
        
        return inertia('RiskRegister/UpdateStatus/Index', ['riskRegisterKlinis' => $riskRegisterKlinis, 'riskCategories' => $riskCategories, 'identificationSources' => $identificationSources, 'locations' => $locations, 'riskVarieties' => $riskVarieties, 'riskTypes' => $riskTypes, 'pics' => $pics, 'impactValues' => $impactValues, 'probabilityValues' => $probabilityValues, 'controlValues' => $controlValues, 'indikatorFitur04s' => $indikatorFitur04s]);
    }
}
