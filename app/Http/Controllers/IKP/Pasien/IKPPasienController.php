<?php

namespace App\Http\Controllers\IKP\Pasien;

use App\Http\Controllers\Controller;
use App\Http\Resources\IKP\IKPPasienResource;
use App\Models\IKP\IkpDampak;
use App\Models\IKP\IkpGruplayanan;
use App\Models\IKP\IkpHasil;
use App\Models\IKP\IkpJenisInsiden;
use App\Models\IKP\IkpKronologiPasien;
use App\Models\IKP\IkpLokasi;
use App\Models\IKP\IkpPasien;
use App\Models\IKP\IkpPelapor;
use App\Models\IKP\IkpPenanggung;
use App\Models\IKP\IkpPenindak;
use App\Models\IKP\IkpProbabilitas;
use App\Models\IKP\IkpSpesialisasi;
use App\Models\IKP\IkpTipeInsiden;
use App\Models\Pic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class IKPPasienController extends Controller
{
    public $loadDefault = 10;
    public function index(Request $request)
    {
        $whosLogin = auth()->user()->can('lihat semua data ikp') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $IkpPasien = IkpPasien::query()
            ->with('penanggung')
            ->with('jenis_insiden')
            ->with('tipe_insiden')
            ->with('spesialisasi')
            ->with('dampak')
            ->with('probabilitas')
            ->with('riskgrading')
            ->with('pelapor')
            ->with('grup_layanan')
            ->with('lokasi')
            ->with('hasil_grading')
            ->with('ikp_hasil')
            ->with('penindak')
            ->with('kronologis')
            ->where($whosLogin);
        if ($request->q) {
            $IkpPasien->whereRelation('tipe_insiden', 'name', 'like', '%'.$request->q.'%')
            ->orWhere('insiden', 'like', '%' . $request->q . '%')
            ->orWhere('lokasi_name', 'like', '%' . $request->q . '%');
        }

        if ($request->has(['field', 'direction'])) {
            $IkpPasien->orderBy($request->field, $request->direction);
        }
        $IkpPasien = (
            IKPPasienResource::collection($IkpPasien->latest()->fastPaginate($request->load ?? $this->loadDefault)->withQueryString())
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
        $IkpJenisInsiden = IkpJenisInsiden::get();
        $IkpTipeInsiden = IkpTipeInsiden::get();
        $IkpSpesialisasi = IkpSpesialisasi::get();
        $IkpDampak = IkpDampak::get();
        $IkpProbabilitas = IkpProbabilitas::get();
        $IkpPelapor = IkpPelapor::get();
        $IkpGrupLayanan = IkpGruplayanan::get();
        $IkpPenanggung = IkpPenanggung::get();
        $IkpLokasi = IkpLokasi::get();
        $IkpPenindak = IkpPenindak::get();
        // $IkpKronologiPasien = IkpKronologiPasien::get();
        $pics = Pic::get();
        return inertia('IKP/Pasien/Index', ['IkpPasien' => $IkpPasien, 'IkpJenisInsiden' => $IkpJenisInsiden, 'IkpTipeInsiden' => $IkpTipeInsiden, 'IkpSpesialisasi' => $IkpSpesialisasi, 'IkpDampak' => $IkpDampak, 'IkpProbabilitas' => $IkpProbabilitas, 'IkpPelapor' => $IkpPelapor, 'IkpGrupLayanan' => $IkpGrupLayanan, 'IkpPenanggung' => $IkpPenanggung, 'IkpLokasi' => $IkpLokasi, 'IkpPenindak' => $IkpPenindak, 'pics' => $pics]);
    }
    public function store(Request $request)
    {
        // dd($request->all());
        $validated = $this->validate($request, [
            'namapasien' => 'required|max:255',
            'nrm' => 'required|max:8',
            'umur_tahun' => 'required',
            'umur_bulan' => 'required',
            'umur_hari' => 'required',
            'ikp_penanggung_id' => 'required',
            'jeniskelamin' => 'required',
            'tanggal_pelayanan' => 'required',
            'tanggal_insiden' => 'required',
            'insiden' => 'required|max:255',
            // 'kronologi' => 'required',
            'ikp_jenis_insiden_id' => 'required',
            'ikp_tipe_insiden_id' => 'required',
            'ikp_spesialisasi_id' => 'required',
            'ikp_dampak_id' => 'required',
            'ikp_probabilitas_id' => 'required',
            'ikp_pelapor_id' => 'required',
            'ikp_gruplayanan_id' => 'required',
            'ikp_lokasi_id' => 'required',
            'lokasi_name' => 'required|max:255',
            'pic_id' => 'required',
            'tindak_lanjut_hasil' => 'required|max:5000',
            'ikp_penindak_id' => 'required',
            'terjadi_tempatlain' => 'required',
            'langkah_tempatlain' => 'required_if:terjadi_tempatlain,1|max:255',
        ]);
        $encodedPic = json_encode($request->pic_id, JSON_NUMERIC_CHECK);
        // $validated = $validator->validated();
        $validated['user_id'] = auth()->user()->id;
        $validated['pic_id'] = $encodedPic;
        $validated['concatdp'] = $request->ikp_dampak_id . $request->ikp_probabilitas_id;
        // dd($validated);
        $IkpPasien = IkpPasien::create($validated);
        foreach ($request->kronologis as $kronologis) {
            IkpKronologiPasien::create([
                'ikp_pasien_id' => $IkpPasien->id,
                'waktu' => $kronologis['waktu'],
                'kronologi' => $kronologis['kronologi'],
            ]);
        }
        return back()->with([
            'type' => 'success',
            'message' => 'Data IKP Pasien berhasil disimpan',
        ]);
    }
    public function update(Request $request, IkpPasien $IkpPasien)
    {
        $idAll = IkpPasien::where('id','>',248)->get();
        foreach ($idAll as $key) {
            IkpPasien::where('id', $key->id)->update(['code'=>Str::random(8)]);
        }
        $validated = $this->validate($request, [
            'namapasien' => 'required|max:255',
            'nrm' => 'required|max:8',
            'umur_tahun' => 'required',
            'umur_bulan' => 'required',
            'umur_hari' => 'required',
            'ikp_penanggung_id' => 'required',
            'jeniskelamin' => 'required',
            'tanggal_pelayanan' => 'required',
            'tanggal_insiden' => 'required',
            'insiden' => 'required|max:255',
            // 'kronologi' => 'required',
            'ikp_jenis_insiden_id' => 'required',
            'ikp_tipe_insiden_id' => 'required',
            'ikp_spesialisasi_id' => 'required',
            'ikp_dampak_id' => 'required',
            'ikp_probabilitas_id' => 'required',
            'ikp_pelapor_id' => 'required',
            'ikp_gruplayanan_id' => 'required',
            'ikp_lokasi_id' => 'required',
            'lokasi_name' => 'required|max:255',
            'pic_id' => 'required',
            'tindak_lanjut_hasil' => 'required|max:5000',
            'ikp_penindak_id' => 'required',
            'terjadi_tempatlain' => 'required',
            'langkah_tempatlain' => 'required_if:terjadi_tempatlain,1|max:255',
        ]);
        $encodedPic = json_encode($request->pic_id, JSON_NUMERIC_CHECK);
        $validated['user_id'] = auth()->user()->id;
        $validated['pic_id'] = $encodedPic;
        $validated['concatdp'] = $request->ikp_dampak_id . $request->ikp_probabilitas_id;
        $IkpPasien->update($validated);
        $IkpKronologiPasien = IkpKronologiPasien::where('ikp_pasien_id',$IkpPasien->id);
        $IkpKronologiPasien->delete();
        foreach ($request->kronologis as $kronologis) {
            IkpKronologiPasien::create([
                'ikp_pasien_id' => $IkpPasien->id,
                'waktu' => $kronologis['waktu'],
                'kronologi' => $kronologis['kronologi'],
            ]);
        }
        return back()->with([
            'type' => 'success',
            'message' => 'Data IKP Pasien berhasil diubah',
        ]);
    }
    public function destroy(IkpPasien $IkpPasien)
    {
        $IkpPasien->delete();
        return back()->with([
            'type' => 'success',
            'message' => 'Data Dampak berhasil dihapus',
        ]);
    }
    public function hasilinvestigasi(Request $request, IkpPasien $IkpPasien)
    {
        $this->validate($request, [
            'penyebab' => 'required|max:255',
            'akarmasalah' => 'required|max:255',
            'rekomendasi' => 'required|max:255',
            'pj1' => 'required',
            'tanggal_rekomendasi' => 'required',
            'tindakan' => 'required|max:255',
            'pj2' => 'required|max:255',
            'nama' => 'required|max:255',
            'verifikasi' => 'required',
            'tanggal_mulai_investigasi' => 'required',
            'tanggal_selesaii_investigasi' => 'required',
            'investigasi_lengkap' => 'required',
            'tanggal_investigasi' => 'required',
            'investigasi_lanjut' => 'required',
        ]);
        $request->merge([
            'tanggal_tindakan' => $request->tanggal_rekomendasi,
        ]);
        if (auth()->user()->hasPermissionTo('regrading data ikp')) {
            $this->validate($request, [
                'ikp_dampak2_id' => 'required',
                'ikp_probabilitas2_id' => 'required',
                'tanggal_cek' => 'required',
                'tindak_lanjut' => 'required',
            ]);
            $request->merge([
                'concatdp2' => $request->ikp_dampak2_id . $request->ikp_probabilitas2_id,
            ]);
        }
        IkpHasil::updateOrCreate(['ikp_pasien_id' => $IkpPasien->id], $request->all());
        return back()->with([
            'type' => 'success',
            'message' => 'Hhasil Investigasi berhasil disimpan',
        ]);
    }
}
