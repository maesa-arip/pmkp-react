<?php

namespace App\Http\Controllers;

use App\Http\Resources\CasemixResource;
use App\Models\SIMtrRegistrasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CasemixController extends Controller
{
    public $loadDefault = 15;
    public function index(Request $request)
    {
        // $users = DB::select("Select 
        // 'TarifKoding'=
        // case
        //         when Alias.KelasPelayanan='Kelas I' and Alias.TitipKelas=0 then Alias.TarifKelas1
        //         when Alias.KelasPelayanan='Kelas II' and Alias.TitipKelas=0 then Alias.TarifKelas2
        //         when Alias.KelasPelayanan='Kelas III' and Alias.TitipKelas=0 then Alias.TarifKelas3
        //         when Alias.KelasAsal='Kelas I' and Alias.TitipKelas=1 then Alias.TarifKelas1
        //         when Alias.KelasAsal='Kelas II' and Alias.TitipKelas=1 then Alias.TarifKelas2
        //         when Alias.KelasAsal='Kelas III' and Alias.TitipKelas=1 then Alias.TarifKelas3
        // end,
        // 'Tarif'= (SELECT SUM(Qty * Nilai) FROM GetDetailRincianBiaya(alias.noreg,1)), 
        // KodingSementara, NoReg,KodeICD, DiagnosaRuangan,NRM,NamaPasien,NamaDOkter,KelasAsal,KelasPelayanan,TitipKelas
        //         from 
        //         (
        //         select SIMmTarifINA.Tarif as TarifKelas1, SIMmTarifINA.TarifKelas2 as TarifKelas2,SIMmTarifINA.TarifKelas3 as TarifKelas3,
        //         SIMtrRegistrasi.noreg, SIMtrRegistrasi.NRM,SIMtrRegistrasi.NamaPasien_Reg as NamaPasien,
        //         SIMtrRegistrasi.KdKelasAsal,SIMtrRegistrasi.KdKelasPertanggungan,SIMtrRegistrasi.TitipKelas,SIMtrRegistrasi.KodingSementara,
        //         SIMmKelas.NamaKelas as KelasAsal, sa.NamaKelas as KelasPelayanan,
        //         SIMtrRJ.NoBukti,mICD.KodeICD, mICD.Descriptions as DiagnosaRuangan, mDokter.NamaDOkter,SIMtrRJ.Batal as BatalPeriksa,
        //         SIMtrRegistrasi.StatusBayar,SIMtrRegistrasi.Batal,SIMtrRegistrasi.RawatInap
        //         from
        //          SIMtrRegistrasi 
        //         left outer join SIMtrRJ on simtrrj.RegNo=SIMtrRegistrasi.NoReg
        //         left outer join SIMtrRegistrasiDiagnosa on SIMtrRegistrasiDiagnosa.NoReg=SIMtrRegistrasi.NoReg
        //         left outer join mICD on mICD.KodeICD=SIMtrRegistrasiDiagnosa.KodeICD
        //         left outer join SIMmTarifINA on SIMmTarifINA.Kode=SIMtrRegistrasi.KodingSementara
        //         left outer join SIMmKelas on SIMmKelas.KelasID=SIMtrRegistrasi.KdKelasPertanggungan
        //         left outer join SIMmKelas sa on sa.KelasID=SIMtrRegistrasi.KdKelas
        //         left outer join mDokter on mDokter.DokterID=SIMtrRegistrasi.DokterRawatID
        //         )alias
        //         where alias.StatusBayar='Belum' and alias.RawatInap='1' and alias.Batal='0' and BatalPeriksa='0' 
        //         group by TarifKelas1,TarifKelas2,TarifKelas3, KodingSementara, NoReg,KodeICD, DiagnosaRuangan,NRM,NamaPasien,NamaDOkter,KelasAsal,KelasPelayanan,TitipKelas");
        $users = SIMtrRegistrasi::select(
            'SIMtrRegistrasi.TglReg',
            'SIMmTarifINA.Tarif as TarifKelas1',
            'SIMmTarifINA.TarifKelas2 as TarifKelas2',
            'SIMmTarifINA.TarifKelas3 as TarifKelas3',
            'KodingSementara',
            'SIMtrRegistrasi.NoReg',
            'mICD.KodeICD',
            'mICD.Descriptions as DiagnosaRuangan',
            'SIMtrRegistrasi.NRM',
            'SIMtrRegistrasi.NamaPasien_Reg as NamaPasien',
            'NamaDOkter',
            'SIMmKelas.NamaKelas as KelasAsal',
            'sa.NamaKelas as KelasPelayanan',
            'SIMtrRegistrasi.TitipKelas',
            DB::raw("( CASE
        when sa.NamaKelas='Kelas I' and SIMtrRegistrasi.TitipKelas=0 then SIMmTarifINA.Tarif
        when sa.NamaKelas='Kelas II' and SIMtrRegistrasi.TitipKelas=0 then SIMmTarifINA.TarifKelas2
        when sa.NamaKelas='Kelas III' and SIMtrRegistrasi.TitipKelas=0 then SIMmTarifINA.TarifKelas3
        when SIMmKelas.NamaKelas='Kelas I' and SIMtrRegistrasi.TitipKelas=1 then SIMmTarifINA.Tarif
        when SIMmKelas.NamaKelas='Kelas II' and SIMtrRegistrasi.TitipKelas=1 then SIMmTarifINA.TarifKelas2
        when SIMmKelas.NamaKelas='Kelas III' and SIMtrRegistrasi.TitipKelas=1 then SIMmTarifINA.TarifKelas3
end ) AS TarifKoding"),
            DB::raw("(SELECT SUM(Qty * Nilai) FROM GetDetailRincianBiaya(SIMtrRegistrasi.NoReg,1)) as Tarif"),
        )
            ->leftjoin('SIMtrRJ', 'SIMtrRJ.RegNo', 'SIMtrRegistrasi.NoReg')
            ->leftjoin('SIMtrRegistrasiDiagnosa', 'SIMtrRegistrasiDiagnosa.NoReg', 'SIMtrRegistrasi.NoReg')
            ->leftjoin('mICD', 'mICD.KodeICD', 'SIMtrRegistrasiDiagnosa.KodeICD')
            ->leftjoin('SIMmTarifINA', 'SIMmTarifINA.Kode', 'SIMtrRegistrasi.KodingSementara')
            ->leftjoin('SIMmKelas', 'SIMmKelas.KelasID', 'SIMtrRegistrasi.KdKelasPertanggungan')
            ->leftjoin('SIMmKelas as sa', 'sa.KelasID', 'SIMtrRegistrasi.KdKelas')
            ->leftjoin('mDokter', 'mDokter.DokterID', 'SIMtrRegistrasi.DokterRawatID')
            ->where('StatusBayar', 'Belum')
            ->where('SIMtrRegistrasi.RawatInap', '1')
            ->where('SIMtrRegistrasi.Batal', '0')->orderBy('SIMtrRegistrasi.TglReg', 'DESC')->groupBy('SIMtrRegistrasi.TglReg',
            'SIMmTarifINA.Tarif',
            'SIMmTarifINA.TarifKelas2',
            'SIMmTarifINA.TarifKelas3',
            'KodingSementara',
            'SIMtrRegistrasi.NoReg',
            'mICD.KodeICD',
            'mICD.Descriptions',
            'SIMtrRegistrasi.NRM',
            'SIMtrRegistrasi.NamaPasien_Reg',
            'NamaDOkter',
            'SIMmKelas.NamaKelas',
            'sa.NamaKelas',
            'SIMtrRegistrasi.TitipKelas');
            // dd($users);
        if ($request->q) {
            $users->where('SIMtrRegistrasi.NoReg', 'like', '%' . $request->q . '%')
                ->orWhere('KodingSementara', 'like', '%' . $request->q . '%')
                ->orWhere('mICD.KodeICD', 'like', '%' . $request->q . '%')
                ->orWhere('mICD.Descriptions', 'like', '%' . $request->q . '%')
                ->orWhere('SIMtrRegistrasi.NRM', 'like', '%' . $request->q . '%')
                ->orWhere('SIMtrRegistrasi.NamaPasien_Reg', 'like', '%' . $request->q . '%')
                ->orWhere('sa.NamaKelas', 'like', '%' . $request->q . '%')
                ;
        }
        if ($request->has(['field', 'direction'])) {
            $users->orderBy($request->field, $request->direction);
        }
        $users = (CasemixResource::collection($users->Paginate($request->load)->withQueryString())
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
        return inertia('Casemix/Index', ['users' => $users]);
    }
}
