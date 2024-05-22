<?php

namespace App\Http\Controllers;

use App\Models\IKP\IkpDampak;
use App\Models\IKP\IkpGruplayanan;
use App\Models\IKP\IkpJenisInsiden;
use App\Models\IKP\IkpLokasi;
use App\Models\IKP\IkpPasien;
use App\Models\IKP\IkpPelapor;
use App\Models\IKP\IkpPenanggung;
use App\Models\IKP\IkpPenindak;
use App\Models\IKP\IkpProbabilitas;
use App\Models\IKP\IkpSpesialisasi;
use App\Models\IKP\IkpTipeInsiden;
use App\Models\MUTU\MutuUnit;
use App\Models\Pic;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Faker\Factory as Faker; //import Faker untuk generate random data
use PDF; //import Fungsi PDF

class ExportPDFController extends Controller
{
    // public function printTable($code) {
    //     $dataDummy = [];
    //     $faker = Faker::create();

    //     //Max Data yang akan coba ditampilkan
    //     $MAX_DATA = 5000;

    //     //Membuat Data Faker sebanyak MAX_DATA
    //     for ($i = 0; $i < $MAX_DATA; $i++) {
    //         $people = (Object) [
    //             "id" => $i,
    //             "name" => $faker->name,
    //             "address" => $faker->address,
    //             "email" => $faker->email,
    //             "company" => $code
    //         ];

    //         array_push($dataDummy, $people);
    //     }


    //     $data = [
    //         "dataDummy" => $dataDummy
    //     ];

    //     $pdf = PDF::loadView('tableView', $data);

    //     //Aktifkan Local File Access supaya bisa pakai file external ( cth File .CSS )
    //     $pdf->setOption('enable-local-file-access', true);

    //     // Stream untuk menampilkan tampilan PDF pada browser
    //     return $pdf->stream('table.pdf');

    //     // Jika ingin langsung download (tanpai melihat tampilannya terlebih dahulu) kalian bisa pakai fungsi download
    //     // return $pdf->download('table.pdf);
    // }
    public function printPDSA(Request $request){
        // dd($request->all());
        $startDate = Carbon::parse($request->startDate)->addDay(1)->format('Y-m-d');
        $endDate = Carbon::parse($request->endDate)->addDay(1)->format('Y-m-d');
        $data = MutuUnit::with('mutu_pdsa')->with('mutu_indikator.location')->whereHas('mutu_pdsa');
        if (!empty($request->startDate) && !empty($request->endDate)) {
            $data->where('tanggal_mutu', '>=', $startDate)
                ->where('tanggal_mutu', '<=', $endDate);
        }
        if (!empty($request->userId)) {
            $data->whereHas('mutu_indikator', function ($query) use ($request) {
                $query->whereIn('location_id', [$request->userId]);
            });
        }
        $data = $data->get();
        // dd($data);
        $pdf = PDF::loadView('PDF/PDSA', ['data' => $data,'startDate'=>$startDate,'endDate'=>$endDate]);
        $pdf->setOption('enable-local-file-access', true);
        $pdf->setPaper('letter')->setOrientation('portrait');
        return $pdf->stream('mutu_pdsa'.$startDate.$endDate.'.pdf');
    }
    public function printMutuIndikator(Request $request){
        $startDate = Carbon::parse($request->startDate)->addDay(1)->format('Y-m-d');
        // $endDate = Carbon::parse($request->endDate)->addDay(1)->format('Y-m-d');
        $user = User::where('id',auth()->user()->id)->first();
        $pic = Pic::where('id',$user->pic_id)->first();
        $whosLogin = auth()->user()->can('lihat semua data indikator mutu') ? [['approved', 1]] : [['location_id', $pic->location_id]];
        $dataRaw = MutuUnit::query()->with('mutu_indikator.indikator_fitur4')->with('mutu_indikator.kategori')->with('mutu_indikator.location')->with('mutu_pdsa')->whereRelation('mutu_indikator',$whosLogin);
        if (!empty($request->startDate)) {
            $dataRaw->where('tanggal_mutu', '=', $startDate);
        }
        // if (!empty($request->userId)) {
        //     $data->whereHas('mutu_indikator', function ($query) use ($request) {
        //         $query->whereIn('location_id', [$request->userId]);
        //     });
        // }
        $data = $dataRaw->get();
        $first = $dataRaw->first();
        // return view('PDF/MutuIndikator', ['data' => $data,'startDate'=>$startDate,'first'=>$first]);
        $pdf = PDF::loadView('PDF/MutuIndikator', ['data' => $data,'startDate'=>$startDate,'first'=>$first]);
        $pdf->setOption('enable-local-file-access', true);
        $pdf->setPaper('letter')->setOrientation('portrait');
        return $pdf->stream('mutu_indikator'.$startDate.'.pdf');
    }
    public function printIkpForm(Request $request, $code)
    {
        $whosLogin = auth()->user()->can('lihat semua data ikp') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $data = IkpPasien::query()->with('penanggung')->with('jenis_insiden')->with('tipe_insiden')
        ->with('spesialisasi')
        ->with('dampak')
        ->with('probabilitas')
        ->with('pelapor')
        ->with('grup_layanan')
        ->with('lokasi')
        ->with('penindak')
        ->with('riskgrading')
        ->with('pic')
        ->with('ikp_hasil')
        ->with('kronologis')
        ->with('hasil_grading')
        ->where('code',$code)
        ->where($whosLogin)->first();
        // dd($data);
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
        // return view('PDF/FormInvestigasiSederhana', ['data' => $data,'IkpJenisInsiden' => $IkpJenisInsiden, 'IkpTipeInsiden' => $IkpTipeInsiden, 'IkpSpesialisasi' => $IkpSpesialisasi, 'IkpDampak' => $IkpDampak, 'IkpProbabilitas' => $IkpProbabilitas, 'IkpPelapor' => $IkpPelapor, 'IkpGrupLayanan' => $IkpGrupLayanan, 'IkpPenanggung' => $IkpPenanggung, 'IkpLokasi' => $IkpLokasi, 'IkpPenindak' => $IkpPenindak]);
        $pdf = PDF::loadView('PDF/FormIKP', ['data' => $data,'IkpJenisInsiden' => $IkpJenisInsiden, 'IkpTipeInsiden' => $IkpTipeInsiden, 'IkpSpesialisasi' => $IkpSpesialisasi, 'IkpDampak' => $IkpDampak, 'IkpProbabilitas' => $IkpProbabilitas, 'IkpPelapor' => $IkpPelapor, 'IkpGrupLayanan' => $IkpGrupLayanan, 'IkpPenanggung' => $IkpPenanggung, 'IkpLokasi' => $IkpLokasi, 'IkpPenindak' => $IkpPenindak]);
        $pdf->setOption('enable-local-file-access', true);
        $pdf->setOption('page-width', '215.9')->setOption('page-height', '330')->setOrientation('portrait');
        return $pdf->stream('mutu_indikator.pdf');
    }
    public function printFormInvestigasiSederhana(Request $request, $code)
    {
        $whosLogin = auth()->user()->can('lihat semua data ikp') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $data = IkpPasien::query()->with('penanggung')->with('jenis_insiden')->with('tipe_insiden')
        ->with('spesialisasi')
        ->with('dampak')
        ->with('probabilitas')
        ->with('pelapor')
        ->with('grup_layanan')
        ->with('lokasi')
        ->with('penindak')
        ->with('riskgrading')
        ->with('pic')
        ->with('ikp_hasil')
        ->with('kronologis')
        ->with('hasil_grading')
        ->with('jenis_insiden')
        ->where('code',$code)
        ->where($whosLogin)->first();
        // dd($data);
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
        // dd($data);
        // return view('PDF/FormInvestigasiSederhana', ['data' => $data,'IkpJenisInsiden' => $IkpJenisInsiden, 'IkpTipeInsiden' => $IkpTipeInsiden, 'IkpSpesialisasi' => $IkpSpesialisasi, 'IkpDampak' => $IkpDampak, 'IkpProbabilitas' => $IkpProbabilitas, 'IkpPelapor' => $IkpPelapor, 'IkpGrupLayanan' => $IkpGrupLayanan, 'IkpPenanggung' => $IkpPenanggung, 'IkpLokasi' => $IkpLokasi, 'IkpPenindak' => $IkpPenindak]);
        $pdf = PDF::loadView('PDF/FormInvestigasiSederhana', ['data' => $data,'IkpJenisInsiden' => $IkpJenisInsiden, 'IkpTipeInsiden' => $IkpTipeInsiden, 'IkpSpesialisasi' => $IkpSpesialisasi, 'IkpDampak' => $IkpDampak, 'IkpProbabilitas' => $IkpProbabilitas, 'IkpPelapor' => $IkpPelapor, 'IkpGrupLayanan' => $IkpGrupLayanan, 'IkpPenanggung' => $IkpPenanggung, 'IkpLokasi' => $IkpLokasi, 'IkpPenindak' => $IkpPenindak]);
        $pdf->setOption('enable-local-file-access', true);
        $pdf->setOption('page-width', '215.9')->setOption('page-height', '330')->setOrientation('portrait');
        return $pdf->stream('mutu_indikator.pdf');
    }
}
