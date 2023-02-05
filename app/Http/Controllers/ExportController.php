<?php

namespace App\Http\Controllers;

use App\Models\RiskRegister;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\SimpleExcel\SimpleExcelWriter;

class ExportController extends Controller
{
    public function riskregisterklinis()
    {
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

        // RiskRegister::query()->lazyById(2000, 'id')
        //     ->each(function ($user) use (&$rows) {
        //         $rows[] = $user->toArray();
        //     });
        SimpleExcelWriter::streamDownload('RiskRegisterKlinis.csv')
            // ->addHeader(['first_name', 'last_name'])
            // ->noHeaderRow()
            ->addRows($rows);
    }
}
