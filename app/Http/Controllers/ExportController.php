<?php

namespace App\Http\Controllers;

use App\Models\RiskRegister;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\SimpleExcel\SimpleExcelWriter;
use PDF;

use OpenSpout\Common\Entity\Style\Color;
use OpenSpout\Common\Entity\Style\CellAlignment;
use OpenSpout\Common\Entity\Style\Style;
use OpenSpout\Common\Entity\Style\Border;
use OpenSpout\Common\Entity\Style\BorderPart;
use OpenSpout\Common\Entity\Cell;
use OpenSpout\Common\Entity\Row;
use OpenSpout\Writer\XLSX\Writer;
use OpenSpout\Writer\XLSX\Options;

class ExportController extends Controller
{
    public function riskregisterklinis()
    {
        
        $stream = SimpleExcelWriter::streamDownload('your-export.xlsx');

        $writer = $stream->getWriter();

        $rows = [];
        RiskRegister::query()
            ->join('risk_categories', 'risk_categories.id', 'risk_registers.risk_category_id')
            ->join('identification_sources', 'identification_sources.id', 'risk_registers.identification_source_id')
            ->join('locations', 'locations.id', 'risk_registers.location_id')
            ->join('risk_varieties', 'risk_varieties.id', 'risk_registers.risk_variety_id')
            ->join('risk_types', 'risk_types.id', 'risk_registers.risk_type_id')
            ->join('impact_values', 'impact_values.id', 'risk_registers.osd1_dampak')
            ->join('probability_values', 'probability_values.id', 'risk_registers.osd1_probabilitas')
            ->join('control_values', 'control_values.id', 'risk_registers.osd1_controllability')
            ->join('impact_values as sa1', 'sa1.id', 'risk_registers.osd2_dampak')
            ->join('probability_values as sa2', 'sa2.id', 'risk_registers.osd2_probabilitas')
            ->join('control_values as sa3', 'sa3.id', 'risk_registers.osd2_controllability')
            ->join('pics', 'pics.id', 'risk_registers.pic_id')
            ->join('users', 'users.id', 'risk_registers.user_id')
            ->where('tipe_id', 1)
            ->select('risk_registers.tgl_register', 'risk_registers.tgl_selesai', 'risk_categories.name')
            ->chunk(2000, function ($users) use (&$rows) {
                foreach ($users->toArray() as $user) {
                    $rows[] = $user;
                }
            });
        
        // Set the name of the current sheet to Names
        $nameSheet = $writer->getCurrentSheet();
        $nameSheet->setName('Names');
        
        // Add rows to the Names sheet
        $stream->addRows($rows);
        
        // Create a new sheet and set the name to Addresses
        $addressSheet = $writer->addNewSheetAndMakeItCurrent();
        $addressSheet->setName('Addresses');
        
        // Manually add header rows to the Addresses sheet
        $stream->addRow(['house_number', 'postcode']);
        
        // Add rows to the Addresses sheet
        $stream->addRows([
            ['house_number' => '1', 'postcode' => 'AB1 2BC'],
            ['house_number' => '2', 'postcode' => 'AB1 2BD'],
        ]);
        
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
        // //     ->setFontSize(15)
        // //     ->setFontColor(Color::BLUE)
        // //     ->setShouldWrapText()
        // //     ->setBackgroundColor(Color::YELLOW)
        // //     ->setBorder($border);

        // // SimpleExcelWriter::streamDownload('RiskRegisterKlinis.csv')
        // //     ->addRows($rows, $style);
    }
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
    // public function riskregisterklinis()
    // {

    //     /* Create a border around a cell */
    //     $border = new Border(
    //         new BorderPart(Border::BOTTOM, Color::LIGHT_BLUE, Border::WIDTH_THIN, Border::STYLE_SOLID),
    //         new BorderPart(Border::LEFT, Color::LIGHT_BLUE, Border::WIDTH_THIN, Border::STYLE_SOLID),
    //         new BorderPart(Border::RIGHT, Color::LIGHT_BLUE, Border::WIDTH_THIN, Border::STYLE_SOLID),
    //         new BorderPart(Border::TOP, Color::LIGHT_BLUE, Border::WIDTH_THIN, Border::STYLE_SOLID)
    //     );

    //     $style = (new Style())
    //         ->setFontBold()
    //         ->setFontSize(15)
    //         ->setFontColor(Color::BLUE)
    //         ->setShouldWrapText()
    //         ->setBackgroundColor(Color::YELLOW)
    //         ->setBorder($border);
    //     $style1 = (new Style())
    //         ->setFontBold()
    //         ->setFontSize(15)
    //         ->setFontColor(Color::BLUE)
    //         ->setShouldWrapText()
    //         ->setBackgroundColor(Color::RED)
    //         ->setBorder($border);

    //     $writer = SimpleExcelWriter::streamDownload('your-export.xlsx')
    //         ->addRows([
    //             [
    //                 'first_name' => 'John',
    //                 'last_name' => 'Doe',
    //             ],
    //             [
    //                 'first_name' => 'Jane',
    //                 'last_name' => 'Doe',
    //             ],
    //         ], $style);

    //         $cells = [
    //             Cell::fromValue('jane', $style1),
    //         ];
    //         $row = new Row($cells, $style);
    //         $writer->addRow($row);
    //     $writer->setHeaderStyle($style);
    // }
}
