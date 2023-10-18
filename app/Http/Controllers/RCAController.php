<?php

namespace App\Http\Controllers;

use App\Http\Resources\RiskRegisterResource;
use App\Models\RiskRegister;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RCAController extends Controller
{
    public $loadDefault = 10;
    public function sedangterjadi(Request $request)
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $riskRegisterKlinis = RiskRegister::query()->where('currently_id', 1)
            ->with('risk_category')
            ->with('identification_source')
            ->with('opsi_pengendalian')
            ->with('pembiayaan_risiko')
            ->with('risk_variety')
            ->with('risk_type')
            ->with('jenis_sebab')
            ->with('pic')
            ->with('user')
            ->with('formulirrca')
            ->with('fgdinherent')
            ->with('fgdresidual')
            ->with('fgdtreated')
            ->where($whosLogin);
        $riskRegisterCount = $riskRegisterKlinis->count();
        if ($request->q) {
            $riskRegisterKlinis->where('pernyataan_risiko', 'like', '%' . $request->q . '%');
        }
        if ($request->has(['field', 'direction'])) {
            $riskRegisterKlinis->orderBy($request->field, $request->direction);
        }
        $riskRegisterKlinis = (RiskRegisterResource::collection($riskRegisterKlinis->latest()->fastPaginate($request->load ?? $this->loadDefault)->withQueryString())
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
        return Inertia::render('RCA/SedangTerjadi', [
            'riskRegisterKlinis' => $riskRegisterKlinis,
            'riskRegisterCount' => $riskRegisterCount,
        ]);
    }
    public function risikoprioritas(Request $request)
    {
        $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $riskRegisterKlinis = RiskRegister::query()->whereHas('riskgrading', function (Builder $query) {
            $query->where('name_bpkp', 'like', '%TINGGI%');
        })
            ->with('risk_category')
            ->with('identification_source')
            ->with('opsi_pengendalian')
            ->with('pembiayaan_risiko')
            ->with('risk_variety')
            ->with('risk_type')
            ->with('jenis_sebab')
            ->with('pic')
            ->with('user')
            ->with('riskgrading')
            ->with('formulirrca')
            ->with('fgdinherent')
            ->with('fgdresidual')
            ->with('fgdtreated')
            ->where($whosLogin);
        $riskRegisterCount = $riskRegisterKlinis->count();
        if ($request->q) {
            $riskRegisterKlinis->where('pernyataan_risiko', 'like', '%' . $request->q . '%');
        }
        if ($request->has(['field', 'direction'])) {
            $riskRegisterKlinis->orderBy($request->field, $request->direction);
        }
        $riskRegisterKlinis = (RiskRegisterResource::collection($riskRegisterKlinis->latest()->fastPaginate($request->load ?? $this->loadDefault)->withQueryString())
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
        return Inertia::render('RCA/RisikoPrioritas', [
            'riskRegisterKlinis' => $riskRegisterKlinis,
            'riskRegisterCount' => $riskRegisterCount,
        ]);
    }

    public function store(Request $request)
    {

        $this->validate($request, [
            'indikator_fitur4_id' => 'required',
            'risk_category_id' => 'required',
            'tgl_register' => 'required',
            'sebab' => 'required',
            'currently_id' => 'required',
            'pic_id' => 'required',
            'identification_source_id' => 'required',
            'resiko' => 'required',
            'dampak' => 'required',
            'pernyataan_risiko' => 'required',
            'risk_variety_id' => 'required',
            'risk_type_id' => 'required',
            'jenis_sebab_id' => 'required',
            'num' => 'required',
            'denum' => 'required',
            'target_waktu' => 'required|numeric|min:1|not_in:0|in:90,180,365',
            'osd1_controllability' => 'required',
            'perlu_penanganan_id' => 'required',
            'pengendalian_risiko' => 'required',
            'efektif_id' => 'required',
            'pengendalian_harus_ada' => 'required',
            'opsi_pengendalian_id' => 'required',
            'penanganan_risiko' => 'required',
            'pembiayaan_risiko_id' => 'required',
            'jenis_pengendalian_id' => 'required',
            'waktu_pengendalian_id' => 'required',
            'rencana_pengendalian' => 'required',
            'pihak_terkena' => 'required',
        ]);
        $date = Carbon::parse($request->tgl_register);
        $encodedPic = json_encode($request->pic_id, JSON_NUMERIC_CHECK);
        // dd($encodedPic);
        $tgl_selesai = $date->addDays($request->target_waktu);
        $osd1_controllability = ControlValue::where('id', $request->osd1_controllability)->pluck('value');
        $request->merge([
            'user_id' => auth()->user()->id,
            'tipe_id' => 1,
            'tgl_selesai' => $tgl_selesai,
            'pic_id' => $encodedPic,
            'waktudenumnum' => $request->target_waktu,
            'grading1' => 1,
            'grading2' => 1,
            'osd1_controllability' => $osd1_controllability[0],
        ]);


        $risk = RiskRegister::create($request->except('name'));

        $riskHistory = RiskRegisterHistory::create(['risk_register_id' => $risk->id, 'currently_id' => $request->currently_id]);
        // $user = User::whereHas('roles', function ($query) {
        //     $query->where('name', 'super admin');
        // })->get();
        // Notification::send($user, new RiskRegisterNewNotification($risk));
        return back()->with([
            'type' => 'success',
            'message' => 'Data Risk Register Klinis berhasil disimpan',
        ]);
    }

    public function update(Request $request, $id)
    {
        $this->validate($request, [
            'indikator_fitur4_id' => 'required',
            'risk_category_id' => 'required',
            'tgl_register' => 'required',
            'sebab' => 'required',
            'currently_id' => 'required',
            'pic_id' => 'required',
            'identification_source_id' => 'required',
            'resiko' => 'required',
            'dampak' => 'required',
            'pernyataan_risiko' => 'required',
            'risk_variety_id' => 'required',
            'risk_type_id' => 'required',
            'jenis_sebab_id' => 'required',
            'num' => 'required',
            'denum' => 'required',
            'target_waktu' => 'required|numeric|min:1|not_in:0|in:90,180,365',
            // 'osd1_dampak' => 'required',
            // 'osd1_probabilitas' => 'required',
            'osd1_controllability' => 'required',
            'perlu_penanganan_id' => 'required',
            'pengendalian_risiko' => 'required',
            'efektif_id' => 'required',
            'pengendalian_harus_ada' => 'required',
            'opsi_pengendalian_id' => 'required',
            'penanganan_risiko' => 'required',
            'pembiayaan_risiko_id' => 'required',
            'jenis_pengendalian_id' => 'required',
            'waktu_pengendalian_id' => 'required',
            'rencana_pengendalian' => 'required',
            'pihak_terkena' => 'required',
        ]);
        $date = Carbon::parse($request->tgl_register);
        $tgl_selesai = $date->addDays($request->target_waktu);
        $encodedPic = json_encode($request->pic_id, JSON_NUMERIC_CHECK);
        // $osd1_dampak = ImpactValue::where('id', $request->osd1_dampak)->pluck('value');
        // $osd1_probabilitas = ProbabilityValue::where('id', $request->osd1_probabilitas)->pluck('value');
        $osd1_controllability = ControlValue::where('id', $request->osd1_controllability)->pluck('value');
        $request->merge([
            'tgl_selesai' => $tgl_selesai,
            'waktudenumnum' => $request->target_waktu,
            'pic_id' => $encodedPic,
            // 'osd1_dampak' => $osd1_dampak[0],
            // 'osd1_probabilitas' => $osd1_probabilitas[0],
            'osd1_controllability' => $osd1_controllability[0],
            // 'concatdp1' => $request->osd1_dampak . $request->osd1_probabilitas,
            // 'osd1_inherent' => $request->osd1_dampak * $request->osd1_probabilitas * $request->osd1_controllability,
        ]);
        $riskRegisterKlinis = RiskRegister::find($id);

        $riskRegisterKlinis->update($request->except('home'));
        $riskHistory = RiskRegisterHistory::create(['risk_register_id' => $id, 'currently_id' => $riskRegisterKlinis->currently_id]);
        // $user = User::whereHas('roles', function ($query) {
        //     $query->where('name', 'super admin');
        // })->get();
        // Notification::send($user, new RiskRegisterEditNotification($riskRegisterKlinis));
        return back()->with([
            'type' => 'success',
            'message' => 'Data Risk Register Klinis berhasil diubah',
        ]);
    }
}
