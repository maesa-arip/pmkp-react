<?php

namespace App\Http\Controllers;

use App\Models\RiskRegister;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

class ExcelController extends Controller
{
    public function exportXls()
    {
        $spreadsheet = new Spreadsheet();
        $worksheet = $spreadsheet->getActiveSheet();
        $query = $whosLogin = auth()->user()->can('lihat data semua risk register') ? [['user_id', '<>', 0]] : [['user_id', auth()->user()->id]];
        $query = RiskRegister::query()
            ->select(
                DB::raw("CONCAT('R.', risk_registers.id) AS Kode"),
                'risk_registers.osd1_dampak',
                'risk_registers.osd1_probabilitas',
            )
            ->where('risk_registers.osd1_dampak', '>', 0)
            ->where('risk_registers.osd1_probabilitas', '>', 0)
            ->where($whosLogin)->take(10);


        $data = $query->get();

        // Build the data for the chart
        $dataGraph = [['', 'Dampak', 'Probabilitas']];

        foreach ($data as $row) {
            $dataGraph[] = [
                $row->Kode,
                $row->osd1_dampak,
                $row->osd1_probabilitas,
            ];
        }

        $totalData = count($dataGraph);

        $worksheet->fromArray($dataGraph);
        $dataSeriesValues = [];
        for ($i = 1; $i < count($dataGraph[0]); $i++) {
            $pos = $i + 65;
            $posTitle = chr($pos);
            $dataSeriesValues[] = new DataSeriesValues(
                DataSeriesValues::DATASERIES_TYPE_NUMBER,
                'Worksheet!$' . $posTitle . '$2:$' . $posTitle . '$' . $totalData,
                null,
                4
            );
        }

        // Set the line width for each data series
        foreach ($dataSeriesValues as $dataSeriesValue) {
            $dataSeriesValue->setLineWidth(60000 / Properties::POINTS_WIDTH_MULTIPLIER);
        }


        // ... (rest of the code remains unchanged)
        // Set the Labels for each data series we want to plot
        //     Datatype
        //     Cell reference for data
        //     Format Code
        //     Number of datapoints in series
        //     Data values
        //     Data Marker
        // Build the dataseries
        $dataSeriesValues = [];
        for ($i = 1; $i < count($dataGraph[0]); $i++) {
            $pos = $i + 65;
            $posTitle = chr($pos);
            $dataSeriesValues[] = new DataSeriesValues(
                DataSeriesValues::DATASERIES_TYPE_NUMBER,
                'Worksheet!$' . $posTitle . '$2:$' . $posTitle . '$' . $totalData,
                null,
                4
            );
        }

        // Set the line width for each data series
        foreach ($dataSeriesValues as $dataSeriesValue) {
            $dataSeriesValue->setLineWidth(60000 / Properties::POINTS_WIDTH_MULTIPLIER);
        }

        $dataSeriesLabels = [];
        //B:66
        for ($i = 1; $i < count($dataGraph[0]); $i++) {
            $pos = $i + 65;
            $posTitle = chr($pos);
            $dataSeriesLabels[] = new DataSeriesValues(
                DataSeriesValues::DATASERIES_TYPE_STRING,
                'Worksheet!$' . $posTitle . '$1',
                null,
                1
            );
        }

        $dataSeriesLabels[0]->setFillColor('FF0000');
        // Set the X-Axis Labels
        //     Datatype
        //     Cell reference for data
        //     Format Code
        //     Number of datapoints in series
        //     Data values
        //     Data Marker
        $xAxisTickValues = [
            new DataSeriesValues(
                DataSeriesValues::DATASERIES_TYPE_STRING,
                'Worksheet!$A$2:$A$' . $totalData,
                null,
                4
            ), // Q1 to Q(last)
        ];
        // Set the Data values for each data series we want to plot
        //     Datatype
        //     Cell reference for data
        //     Format Code
        //     Number of datapoints in series
        //     Data values
        //     Data Marker
        $dataSeriesValues = [];
        for ($i = 1; $i < count($dataGraph[0]); $i++) {
            $pos = $i + 65;
            $posTitle = chr($pos);
            $dataSeriesValues[] = new DataSeriesValues(
                DataSeriesValues::DATASERIES_TYPE_NUMBER,
                'Worksheet!$' . $posTitle . '$2:$' . $posTitle . '$' . $totalData,
                null,
                4
            );
        }

        // $dataSeriesValues[2]->setLineWidth(60000 / Properties::POINTS_WIDTH_MULTIPLIER);

        // Build the dataseries
        $series = new DataSeries(
            DataSeries::TYPE_LINECHART, // plotType
            null, // plotGrouping, was DataSeries::GROUPING_STACKED, not a usual choice for line chart
            range(0, count($dataSeriesValues) - 1), // plotOrder
            $dataSeriesLabels, // plotLabel
            $xAxisTickValues, // plotCategory
            $dataSeriesValues        // plotValues
        );

        // Set the series in the plot area
        $plotArea = new PlotArea(null, [$series]);
        // Set the chart legend
        $legend = new ChartLegend(ChartLegend::POSITION_TOPRIGHT, null, false);

        $title = new Title('Test Line Chart');
        $yAxisLabel = new Title('Value ($k)');

        // Create the chart
        $chart = new Chart(
            'chart1', // name
            $title, // title
            $legend, // legend
            $plotArea, // plotArea
            true, // plotVisibleOnly
            'gap',  // displayBlanksAs
            null, // xAxisLabel
            $yAxisLabel  // yAxisLabel
        );

        // Set the position where the chart should appear in the worksheet
        // $chart->setTopLeftPosition('A'.($totalData + 3) );
        // $chart->setBottomRightPosition('M'.($totalData+15) );
        $chart->setTopLeftPosition('G1');
        $chart->setBottomRightPosition('S12');
        // Add the chart to the worksheet
        $worksheet->addChart($chart);

        // Export the chart to an Excel file
        $exportFile = public_path('example.xlsx');

        $writer = new Xlsx($spreadsheet);
        $writer->setIncludeCharts(true);
        $writer->save($exportFile);

        // Download the file to the user
        return response()->download($exportFile, 'contoh' . date("Ymdhis") . '.xlsx')->deleteFileAfterSend();
    }
}
