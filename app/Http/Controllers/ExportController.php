<?php

namespace App\Http\Controllers;

use App\Exports\FormatBPKPExport;
use App\Exports\FormatBPKPNonKlinisExport;
use App\Exports\FormatFitur4Export;
use App\Exports\FormatLARSDHPExport;
use App\Models\IndikatorFitur04;
use App\Models\IndikatorFitur1;
use App\Models\IndikatorFitur2;
use App\Models\IndikatorFitur3;
use App\Models\IndikatorFitur4;
use App\Models\RiskRegister;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\SimpleExcel\SimpleExcelWriter;
use PDF;


use App\Exports\ExampleExport;

use PhpOffice\PhpSpreadsheet\Chart\Chart;
use PhpOffice\PhpSpreadsheet\Chart\DataSeries;
use PhpOffice\PhpSpreadsheet\Chart\DataSeriesValues;
use PhpOffice\PhpSpreadsheet\Chart\Legend as ChartLegend;
use PhpOffice\PhpSpreadsheet\Chart\PlotArea;
use PhpOffice\PhpSpreadsheet\Chart\Properties;
use PhpOffice\PhpSpreadsheet\Chart\Title;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Settings;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

use PhpOffice\PhpSpreadsheet\IOFactory;



class ExportController extends Controller
{
    public function riskregisterklinis()
    {
        $stream = SimpleExcelWriter::streamDownload('RiskRegisterFitur4.xlsx');
        $writer = $stream->getWriter();
        $rows = [];
        IndikatorFitur1::query()
            ->join('sasaran_strategis', 'sasaran_strategis.id', 'indikator_fitur1s.sasaran_strategis_id')
            ->select('indikator_fitur1s.id as Nomor', 'sasaran_strategis.name as Sasaran_Strategis', 'indikator_fitur1s.name as Indikator', 'indikator_fitur1s.tujuan')
            ->chunk(2000, function ($fitur1) use (&$rows) {
                foreach ($fitur1->toArray() as $fitur1) {
                    $rows[] = $fitur1;
                }
            });

        // Set the name of the current sheet to Names
        $nameSheet = $writer->getCurrentSheet();
        $nameSheet->setName('FITUR 1 DIREKTUR');
        $stream->addRows($rows);


        $addressSheet = $writer->addNewSheetAndMakeItCurrent();
        $addressSheet->setName('FITUR 2 WADIR DAN KOMITE');
        $stream->addRow(['Nomor', 'Sasaran Strategis', 'Indikator', 'Tujuan']);
        $rows2 = [];
        IndikatorFitur2::query()
            ->join('sasaran_strategis', 'sasaran_strategis.id', 'indikator_fitur2s.sasaran_strategis_id')
            ->select('indikator_fitur2s.id as Nomor', 'sasaran_strategis.name as Sasaran_Strategis', 'indikator_fitur2s.name as Indikator', 'indikator_fitur2s.tujuan')
            ->chunk(2000, function ($fitur2) use (&$rows2) {
                foreach ($fitur2->toArray() as $fitur2) {
                    $rows2[] = $fitur2;
                }
            });
        $stream->addRows($rows2);

        $addressSheet = $writer->addNewSheetAndMakeItCurrent();
        $addressSheet->setName('FITUR 3 BIDANG & BAGIAN');
        $stream->addRow(['Nomor', 'Sasaran Strategis', 'Indikator', 'Tujuan']);
        $rows3 = [];
        IndikatorFitur3::query()
            ->join('sasaran_strategis', 'sasaran_strategis.id', 'indikator_fitur3s.sasaran_strategis_id')
            ->select('indikator_fitur3s.id as Nomor', 'sasaran_strategis.name as Sasaran_Strategis', 'indikator_fitur3s.name as Indikator', 'indikator_fitur3s.tujuan')
            ->chunk(2000, function ($fitur3) use (&$rows3) {
                foreach ($fitur3->toArray() as $fitur3) {
                    $rows3[] = $fitur3;
                }
            });
        $stream->addRows($rows3);

        $addressSheet = $writer->addNewSheetAndMakeItCurrent();
        $addressSheet->setName('FITUR 4 UNIT');
        $stream->addRow(['Nomor', 'Nama Kegiatan', 'Tujuan Kegiatan', 'Area/Lokasi', 'Sebab', 'Risiko', 'Dampak', 'Pernyataan Risiko', 'Pengendalian yang sudah ada saat ini', 'Dampak', 'Probabilitas', 'Controlability', 'Skor', 'Peringkat Risiko', 'Apakah perlu penanganan risiko?', 'Opsi teknik pengendalian risiko', 'Uraian penanganan risiko', 'Pembiayaan risiko', 'Dampak', 'Probabilitas', 'Skor', 'Peringkat Risiko', 'Pemilik Risiko/ Penanggungjawab', 'Target waktu']);
        $rows4 = [];
        RiskRegister::query()
            ->select('risk_registers.id', 'indikator_fitur04s.name', 'indikator_fitur04s.tujuan', 'locations.name', 'risk_registers.sebab', 'risk_registers.resiko', 'risk_registers.dampak', 'risk_registers.pernyataan_risiko', 'risk_registers.pengendalian_risiko', 'risk_registers.osd1_dampak', 'risk_registers.osd1_probabilitas', 'osd1_controllability', 'risk_registers.osd1_inherent', 'risk_registers.osd1_inherent', 'risk_registers.id', 'risk_registers.id', 'risk_registers.id', 'risk_registers.id', 'risk_registers.id', 'risk_registers.osd2_probabilitas', 'osd2_controllability', 'risk_registers.osd2_inherent', 'risk_registers.osd2_inherent', 'pics.name', 'risk_registers.target_waktu')
            ->leftjoin('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
            ->leftjoin('indikator_fitur04s', 'indikator_fitur04s.id', 'risk_registers.indikator_fitur04_id')
            ->leftjoin('identification_sources', 'identification_sources.id', 'risk_registers.identification_source_id')
            ->leftjoin('locations', 'locations.id', 'indikator_fitur04s.location_id')
            ->leftjoin('sasaran_strategis', 'sasaran_strategis.id', 'indikator_fitur04s.sasaran_strategis_id')
            ->leftjoin('risk_varieties', 'risk_varieties.id', 'risk_registers.risk_variety_id')
            ->leftjoin('risk_types', 'risk_types.id', 'risk_registers.risk_type_id')
            ->leftjoin('impact_values', 'impact_values.id', 'risk_registers.osd1_dampak')
            ->leftjoin('probability_values', 'probability_values.id', 'risk_registers.osd1_probabilitas')
            ->leftjoin('control_values', 'control_values.id', 'risk_registers.osd1_controllability')
            ->leftjoin('impact_values as sa1', 'sa1.id', 'risk_registers.osd2_dampak')
            ->leftjoin('probability_values as sa2', 'sa2.id', 'risk_registers.osd2_probabilitas')
            ->leftjoin('control_values as sa3', 'sa3.id', 'risk_registers.osd2_controllability')
            ->leftjoin('pics', 'pics.id', 'risk_registers.pic_id')
            ->leftjoin('users', 'users.id', 'risk_registers.user_id')
            ->where('tipe_id', 1)
            ->chunk(2000, function ($users) use (&$rows4) {
                foreach ($users->toArray() as $user) {
                    $rows4[] = $user;
                }
            });
        $stream->addRows($rows4);

        $addressSheet = $writer->addNewSheetAndMakeItCurrent();
        $addressSheet->setName('TABEL BANTU KEGIATAN & SASARAN');
        $stream->addRow(['Nomor', 'Nama Kegiatan', 'Tujuan Kegiatan', 'Pemilik Risiko', 'Kategori Risiko']);
        $rows5 = [];
        RiskRegister::query()
            ->select('risk_registers.id', 'indikator_fitur04s.name as nama_kegiatan', 'indikator_fitur04s.tujuan', 'pics.name as nama_pic', 'risk_categories.name as nama_kategori')
            ->leftjoin('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
            ->leftjoin('indikator_fitur04s', 'indikator_fitur04s.id', 'risk_registers.indikator_fitur04_id')
            ->leftjoin('identification_sources', 'identification_sources.id', 'risk_registers.identification_source_id')
            ->leftjoin('locations', 'locations.id', 'indikator_fitur04s.location_id')
            ->leftjoin('sasaran_strategis', 'sasaran_strategis.id', 'indikator_fitur04s.sasaran_strategis_id')
            ->leftjoin('risk_varieties', 'risk_varieties.id', 'risk_registers.risk_variety_id')
            ->leftjoin('risk_types', 'risk_types.id', 'risk_registers.risk_type_id')
            ->leftjoin('impact_values', 'impact_values.id', 'risk_registers.osd1_dampak')
            ->leftjoin('probability_values', 'probability_values.id', 'risk_registers.osd1_probabilitas')
            ->leftjoin('control_values', 'control_values.id', 'risk_registers.osd1_controllability')
            ->leftjoin('impact_values as sa1', 'sa1.id', 'risk_registers.osd2_dampak')
            ->leftjoin('probability_values as sa2', 'sa2.id', 'risk_registers.osd2_probabilitas')
            ->leftjoin('control_values as sa3', 'sa3.id', 'risk_registers.osd2_controllability')
            ->leftjoin('pics', 'pics.id', 'risk_registers.pic_id')
            ->leftjoin('users', 'users.id', 'risk_registers.user_id')
            ->where('tipe_id', 1)

            ->chunk(2000, function ($users) use (&$rows5) {
                foreach ($users->toArray() as $user) {
                    $rows5[] = $user;
                }
            });
        $stream->addRows($rows5);

        $addressSheet = $writer->addNewSheetAndMakeItCurrent();
        $addressSheet->setName('RENCANA PENANGANAN');
        $stream->addRow(['Nomor', 'Nama Kegiatan', 'Tujuan Kegiatan', 'Pemilik Risiko', 'Kategori Risiko']);
        $rows6 = [];
        RiskRegister::query()
            ->select('risk_registers.id', 'indikator_fitur04s.name as nama_kegiatan', 'indikator_fitur04s.tujuan', 'pics.name as nama_pic', 'risk_categories.name as nama_kategori')
            ->leftjoin('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
            ->leftjoin('indikator_fitur04s', 'indikator_fitur04s.id', 'risk_registers.indikator_fitur04_id')
            ->leftjoin('identification_sources', 'identification_sources.id', 'risk_registers.identification_source_id')
            ->leftjoin('locations', 'locations.id', 'indikator_fitur04s.location_id')
            ->leftjoin('sasaran_strategis', 'sasaran_strategis.id', 'indikator_fitur04s.sasaran_strategis_id')
            ->leftjoin('risk_varieties', 'risk_varieties.id', 'risk_registers.risk_variety_id')
            ->leftjoin('risk_types', 'risk_types.id', 'risk_registers.risk_type_id')
            ->leftjoin('impact_values', 'impact_values.id', 'risk_registers.osd1_dampak')
            ->leftjoin('probability_values', 'probability_values.id', 'risk_registers.osd1_probabilitas')
            ->leftjoin('control_values', 'control_values.id', 'risk_registers.osd1_controllability')
            ->leftjoin('impact_values as sa1', 'sa1.id', 'risk_registers.osd2_dampak')
            ->leftjoin('probability_values as sa2', 'sa2.id', 'risk_registers.osd2_probabilitas')
            ->leftjoin('control_values as sa3', 'sa3.id', 'risk_registers.osd2_controllability')
            ->leftjoin('pics', 'pics.id', 'risk_registers.pic_id')
            ->leftjoin('users', 'users.id', 'risk_registers.user_id')
            ->where('tipe_id', 1)

            ->chunk(2000, function ($users) use (&$rows6) {
                foreach ($users->toArray() as $user) {
                    $rows6[] = $user;
                }
            });
        $stream->addRows($rows6);
        $addressSheet = $writer->addNewSheetAndMakeItCurrent();
        $addressSheet->setName('PEMANTAUAN PENGENDALIAN');
        $stream->addRow(['Nomor', 'Nama Kegiatan', 'Tujuan Kegiatan', 'Pemilik Risiko', 'Kategori Risiko']);
        $rows7 = [];
        RiskRegister::query()
            ->select('risk_registers.id', 'indikator_fitur04s.name as nama_kegiatan', 'indikator_fitur04s.tujuan', 'pics.name as nama_pic', 'risk_categories.name as nama_kategori')
            ->leftjoin('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
            ->leftjoin('indikator_fitur04s', 'indikator_fitur04s.id', 'risk_registers.indikator_fitur04_id')
            ->leftjoin('identification_sources', 'identification_sources.id', 'risk_registers.identification_source_id')
            ->leftjoin('locations', 'locations.id', 'indikator_fitur04s.location_id')
            ->leftjoin('sasaran_strategis', 'sasaran_strategis.id', 'indikator_fitur04s.sasaran_strategis_id')
            ->leftjoin('risk_varieties', 'risk_varieties.id', 'risk_registers.risk_variety_id')
            ->leftjoin('risk_types', 'risk_types.id', 'risk_registers.risk_type_id')
            ->leftjoin('impact_values', 'impact_values.id', 'risk_registers.osd1_dampak')
            ->leftjoin('probability_values', 'probability_values.id', 'risk_registers.osd1_probabilitas')
            ->leftjoin('control_values', 'control_values.id', 'risk_registers.osd1_controllability')
            ->leftjoin('impact_values as sa1', 'sa1.id', 'risk_registers.osd2_dampak')
            ->leftjoin('probability_values as sa2', 'sa2.id', 'risk_registers.osd2_probabilitas')
            ->leftjoin('control_values as sa3', 'sa3.id', 'risk_registers.osd2_controllability')
            ->leftjoin('pics', 'pics.id', 'risk_registers.pic_id')
            ->leftjoin('users', 'users.id', 'risk_registers.user_id')
            ->where('tipe_id', 1)

            ->chunk(2000, function ($users) use (&$rows7) {
                foreach ($users->toArray() as $user) {
                    $rows7[] = $user;
                }
            });
        $stream->addRows($rows7);
        $addressSheet = $writer->addNewSheetAndMakeItCurrent();
        $addressSheet->setName('LAPORAN PEMANTAUAN');
        $stream->addRow(['Nomor', 'Nama Kegiatan', 'Tujuan Kegiatan', 'Pemilik Risiko', 'Kategori Risiko']);
        $rows8 = [];
        RiskRegister::query()
            ->select('risk_registers.id', 'indikator_fitur04s.name as nama_kegiatan', 'indikator_fitur04s.tujuan', 'pics.name as nama_pic', 'risk_categories.name as nama_kategori')
            ->leftjoin('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
            ->leftjoin('indikator_fitur04s', 'indikator_fitur04s.id', 'risk_registers.indikator_fitur04_id')
            ->leftjoin('identification_sources', 'identification_sources.id', 'risk_registers.identification_source_id')
            ->leftjoin('locations', 'locations.id', 'indikator_fitur04s.location_id')
            ->leftjoin('sasaran_strategis', 'sasaran_strategis.id', 'indikator_fitur04s.sasaran_strategis_id')
            ->leftjoin('risk_varieties', 'risk_varieties.id', 'risk_registers.risk_variety_id')
            ->leftjoin('risk_types', 'risk_types.id', 'risk_registers.risk_type_id')
            ->leftjoin('impact_values', 'impact_values.id', 'risk_registers.osd1_dampak')
            ->leftjoin('probability_values', 'probability_values.id', 'risk_registers.osd1_probabilitas')
            ->leftjoin('control_values', 'control_values.id', 'risk_registers.osd1_controllability')
            ->leftjoin('impact_values as sa1', 'sa1.id', 'risk_registers.osd2_dampak')
            ->leftjoin('probability_values as sa2', 'sa2.id', 'risk_registers.osd2_probabilitas')
            ->leftjoin('control_values as sa3', 'sa3.id', 'risk_registers.osd2_controllability')
            ->leftjoin('pics', 'pics.id', 'risk_registers.pic_id')
            ->leftjoin('users', 'users.id', 'risk_registers.user_id')
            ->where('tipe_id', 1)

            ->chunk(2000, function ($users) use (&$rows8) {
                foreach ($users->toArray() as $user) {
                    $rows8[] = $user;
                }
            });
        $stream->addRows($rows8);


        return $stream->toBrowser();

        // $rows = [];

        // // RiskRegister::query()
        // //     ->join('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
        // //     ->join('identification_sources', 'identification_sources.id', 'risk_registers.identification_source_id')
        // //     ->join('locations', 'locations.id', 'risk_registers.location_id')
        // //     ->join('risk_varieties', 'risk_varieties.id', 'risk_registers.risk_variety_id')
        // //     ->join('risk_types', 'risk_types.id', 'risk_registers.risk_type_id')
        // //     ->join('impact_values', 'impact_values.id', 'risk_registers.osd1_dampak')
        // //     ->join('probability_values', 'probability_values.id', 'risk_registers.osd1_probabilitas')
        // //     ->join('control_values', 'control_values.id', 'risk_registers.osd1_controllability')
        // //     ->join('impact_values as sa1', 'sa1.id', 'risk_registers.osd2_dampak')
        // //     ->join('probability_values as sa2', 'sa2.id', 'risk_registers.osd2_probabilitas')
        // //     ->join('control_values as sa3', 'sa3.id', 'risk_registers.osd2_controllability')
        // //     ->join('pics', 'pics.id', 'risk_registers.pic_id')
        // //     ->join('users', 'users.id', 'risk_registers.user_id')
        // //     ->where('tipe_id', 1)
        // //     ->select('risk_registers.tgl_register', 'risk_registers.tgl_selesai', 'risk_categories.name')
        // //     ->chunk(2000, function ($users) use (&$rows) {
        // //         foreach ($users->toArray() as $user) {
        // //             $rows[] = $user;
        // //         }
        // //     });
        // RiskRegister::query()->lazyById(2000, 'id')
        //     ->each(function ($user) use (&$rows) {
        //         $rows[] = $user->toArray();
        //     });
        // SimpleExcelWriter::streamDownload('RiskRegisterKlinis.csv')
        //     ->addRows($rows);

        // // $border = new Border(
        // //     new BorderPart(Border::BOTTOM, Color::LIGHT_BLUE, Border::WIDTH_THIN, Border::STYLE_SOLID),
        // //     new BorderPart(Border::LEFT, Color::LIGHT_BLUE, Border::WIDTH_THIN, Border::STYLE_SOLID),
        // //     new BorderPart(Border::RIGHT, Color::LIGHT_BLUE, Border::WIDTH_THIN, Border::STYLE_SOLID),
        // //     new BorderPart(Border::TOP, Color::LIGHT_BLUE, Border::WIDTH_THIN, Border::STYLE_SOLID)
        // // );

        // // $style = (new Style())
        // //     ->setFontBold()
        // //     ->setFontSize(17)
        // //     ->setFontColor(Color::BLUE)
        // //     ->setShouldWrapText()
        // //     ->setBackgroundColor(Color::YELLOW)
        // //     ->setBorder($border);

        // // SimpleExcelWriter::streamDownload('RiskRegisterKlinis.csv')
        // //     ->addRows($rows, $style);
    }
    public function riskregisterklinisbpkp()
    {
        return Excel::download(new FormatBPKPExport, 'Proses Manajemen Risiko RSBM.xlsx');
        // return (new IndikatorFitur04sExport)->download('invoices.xlsx');
    }
    public function riskregisternonklinisbpkp()
    {
        return Excel::download(new FormatBPKPNonKlinisExport, 'Proses Manajemen Risiko RSBM.xlsx');
        // return (new IndikatorFitur04sExport)->download('invoices.xlsx');
    }
    public function riskregisterklinisfitur4()
    {
        return Excel::download(new FormatFitur4Export, 'Form Manajemen Risiko Fitur 4.xlsx');
        // return (new IndikatorFitur04sExport)->download('invoices.xlsx');
    }

    public function riskregisterklinislarsdhpasli(Request $request)
    {
        $startDate = $request->input('startDate');
        $endDate = $request->input('endDate');
        $export = new FormatLARSDHPExport($startDate, $endDate, null);
        return Excel::download($export, 'Form Manajemen Risiko LARS DHP1.xlsx');
    }
    public function riskregisterklinislarsdhp(Request $request)
    {
        $startDate = $request->input('startDate');
        $endDate = $request->input('endDate');
        $chartData = $this->generateChartData($startDate, $endDate);
        $export = new FormatLARSDHPExport($startDate, $endDate, $chartData);
        $spreadsheet = $export->sheets()[2]->createChart();
        $exportFile = public_path('Form Manajemen Risiko LARS DHP2.xlsx');
        $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
        $writer->setIncludeCharts(true);
        $writer->save($exportFile);
        return response()->download($exportFile, 'Form Manajemen Risiko LARS DHP2.xlsx')->deleteFileAfterSend();
    }
    public function riskregisterklinislarsdhpcombine(Request $request)
    {
        // Call the first function and get the first export file
        $startDate = $request->input('startDate');
        $endDate = $request->input('endDate');
        $export1 = new FormatLARSDHPExport($startDate, $endDate, null);
        $sheets1 = $export1->sheets();
        $spreadsheet1 = new Spreadsheet();
        foreach ($sheets1 as $sheet) {
            $spreadsheet1->addSheet($sheet);
        }

        // Call the second function and get the second export file
        $chartData = $this->generateChartData($startDate, $endDate);
        $export2 = new FormatLARSDHPExport($startDate, $endDate, $chartData);
        $sheets2 = $export2->sheets();
        $spreadsheet2 = new Spreadsheet();
        foreach ($sheets2 as $sheet) {
            $spreadsheet2->addSheet($sheet);
        }

        // Create a new merged spreadsheet
        $mergedSpreadsheet = new Spreadsheet();

        // Copy the content of the first export file
        $sheet1 = $spreadsheet1->getSheetByName('Sheet1'); // Replace 'Sheet1' with the correct sheet name from $export1
        $clonedSheet1 = clone $sheet1;
        $clonedSheet1->setTitle('Sheet1'); // Rename the sheet to avoid name conflicts
        $mergedSpreadsheet->addSheet($clonedSheet1);
        $mergedSpreadsheet->setActiveSheetIndex(0);

        // Copy the content of the second export file
        $sheet2 = $spreadsheet2->getSheetByName('Sheet1'); // Replace 'Sheet1' with the correct sheet name from $export2
        $clonedSheet2 = clone $sheet2;
        $clonedSheet2->setTitle('Sheet2'); // Rename the sheet to avoid name conflicts
        $mergedSpreadsheet->addSheet($clonedSheet2);
        $mergedSpreadsheet->setActiveSheetIndex(1);

        // Save the merged spreadsheet to a new file
        $mergedExportFile = tempnam(sys_get_temp_dir(), 'Merged_Form_Manajemen_Risiko_LARS_DHP') . '.xlsx';
        $writer = IOFactory::createWriter($mergedSpreadsheet, 'Xlsx');
        $writer->setIncludeCharts(true);
        $writer->save($mergedExportFile);

        // Provide the merged export file for download
        return response()->download($mergedExportFile, 'Merged_Form_Manajemen_Risiko_LARS_DHP.xlsx')
            ->deleteFileAfterSend();
    }

    private function generateChartData($startDate, $endDate)
    {
        $query = $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $query = RiskRegister::query()
            ->select(
                DB::raw("CONCAT('R.', risk_registers.id) AS Kode"),
                'risk_registers.osd1_dampak',
                'risk_registers.osd1_probabilitas',
            )
            ->where('risk_registers.osd1_dampak', '>', 0)
            ->where('risk_registers.osd1_probabilitas', '>', 0)
            ->where($whosLogin)
            ->take(10);

        if (!empty($startDate) && !empty($endDate)) {
            $query->where('risk_registers.created_at', '>=', $startDate)
                ->where('risk_registers.created_at', '<=', $endDate);
        }

        $chartData = $query->get();
        return $chartData->toArray();
    }
    public function exampleexport()
    {
        $sheet = new ExampleExport;
        return $sheet->download('example.xlsx');
    }

    // public function riskregisterklinislarsdhp(Request $request)
    // {
    //     $startDate = $request->input('startDate');
    //     $endDate = $request->input('endDate');
    //     // Enable query logging
    //     DB::enableQueryLog();

    //     $query = DB::table('risk_registers')
    //         ->join('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
    //         ->join('indikator_fitur04s', 'indikator_fitur04s.id', 'risk_registers.indikator_fitur04_id') 
    //         ->join('pics', 'pics.id', 'risk_registers.pic_id')
    //         ->join('users', 'users.id', 'risk_registers.user_id')
    //         ->select('risk_registers.id', 'indikator_fitur04s.name', 'indikator_fitur04s.tujuan', 'pics.name as pic_name', 'risk_categories.name as kategori_risiko');

    //     $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
    //     $query->where($whosLogin);

    //     if (!empty($startDate) && !empty($endDate)) {
    //         $query->where('risk_registers.created_at', '>=', $startDate)
    //               ->where('risk_registers.created_at', '<=', $endDate);
    //     }

    //     // Get the executed SQL query
    //     $sql = $query->toSql();
    //     $bindings = $query->getBindings();
    //     $fullSql = vsprintf(str_replace(['%', '?'], ['%%', "'%s'"], $sql), $bindings);

    //     dd($fullSql); // Output the SQL query for debugging
    //     return Excel::download(new FormatLARSDHPExport($startDate, $endDate), 'Form Manajemen Risiko LARS DHP.xlsx');
    // }
    public function exportpdf(Request $request)
    {
        $users = User::get();
        view()->share('users', $users);

        if ($request->has('download')) {
            // pass view file
            $pdf = PDF::loadView('pdfview');
            // download pdf
            // return $pdf->download('userlist.pdf');
            return $pdf->stream();
        }
        return view('pdfview');
    }
}
