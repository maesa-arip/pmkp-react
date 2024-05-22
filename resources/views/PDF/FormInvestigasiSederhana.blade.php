<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">


{{-- <link href="/var/www/pmkp-react/public/css/app.css" rel="stylesheet" type="text/css" /> --}}
<link rel="stylesheet" href="{{ asset('css/app.css') }}">
<link href='http://fonts.googleapis.com/css?family=Times' rel='stylesheet' type='text/css'>

    <title>Mutu Indikator</title>
</head>
<style>
    .times {
        font-family: "Times New Roman", Times, serif;
        font-size: 19px;
    }


    table,
    th,
    td {
        border: 1px solid white;
    }
</style>

<body>
    <img class="h-auto mx-auto"
        src="data:image/jpeg;base64,{{ base64_encode(@file_get_contents(url(asset('Cop.jpeg')))) }}">
    <p class="flex times ">RAHASIA, TIDAK BOLEH DIFOTOKOPI, DILAPORKAN MAKSIMAL 2 X 24 JAM</p>
    <p class="flex mb-4 times ">RSUD
        Bali Mandara Provinsi Bali</p>
    <p style="text-decoration: underline" class="flex text-center underline times underline-offset-2">LAPORAN INSIDEN
        KESELAMATAN PASIEN</p>
    <p style="text-decoration: underline" class="flex mb-4 text-center underline times underline-offset-2">( INTERNAL )
    </p>
    @php
        $rectangle = '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4-none icon icon-tabler icon-tabler-rectangle-vertical" width="24" height="24" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" /></svg>';
    @endphp
    <div class="times">
        <table class="px-4 mx-4">
            <thead style="display: table-row-group;" class="">
                <tr>
                    <th colspan="1" scope="col" class="px-1 py-1 text-left text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1" style="width: 60px;">I</div>
                    </th>
                    <th colspan="2" scope="col" class="px-1 py-1 text-left text-gray-800 ">
                        <div class="flex cursor-pointer items-left gap-x-1" style="width: 190px;">DATA PASIEN</div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="cursor-pointer whitespace-nowrap gap-x-1">
                        </div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                </tr>
            </thead>
            <tbody class="">
                <tr>
                    <td rowspan="1" class="px-1 py-1 font-normal ">
                    </td>
                    <td colspan="2" class="px-1 py-1 font-normal ">Nama</td>
                    <td rowspan="1" class="px-1 py-1 font-normal ">:</td>
                    <td rowspan="1" class="px-1 py-1 font-normal ">{{ $data->namapasien }}</td>
                </tr>
                <tr>
                    <td rowspan="1" class="px-1 py-1 font-normal ">
                    </td>
                    <td colspan="2" class="px-1 py-1 font-normal ">No. MR</td>
                    <td rowspan="1" class="px-1 py-1 font-normal ">:</td>
                    <td rowspan="1" class="px-1 py-1 font-normal ">{{ $data->nrm }} / {{ $data->lokasi_name }}
                    </td>
                </tr>
                <tr>
                    <td rowspan="1" class="px-1 py-1 font-normal ">
                    </td>
                    <td colspan="2" class="px-1 py-1 font-normal ">Umur</td>
                    <td rowspan="1" class="px-1 py-1 font-normal ">:</td>
                    <td rowspan="1" class="px-1 py-1 font-normal ">{{ $data->umur_tahun }} Tahun
                        {{ $data->umur_bulan }} Bulan {{ $data->umur_hari }} Hari</td>
                </tr>
                <tr>
                    <td rowspan="1" class="px-1 py-1 font-normal ">
                    </td>
                    <td colspan="2" class="px-1 py-1 font-normal ">Kelompok Umur*</td>
                    <td rowspan="1" class="px-1 py-1 font-normal ">:</td>
                </tr>
            </tbody>
        </table>
        <table class="px-4 mx-4">
            <thead style="display: table-row-group;" class="">
                <tr>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1" style="width: 90px;"></div>
                    </th>
                    <th colspan="2" scope="col" class="px-1 py-1 text-left text-gray-800 ">
                        <div class="flex cursor-pointer items-left gap-x-1"></div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="cursor-pointer whitespace-nowrap gap-x-1">
                        </div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                </tr>
            </thead>
            <tbody class="">
                <tr>
                    
    

                    <td></td>
                    <td></td>
                    <td class="flex text-right">
                        @if ($data->umur_tahun == 0 && $data->umur_bulan <= 1)v @else {!! $rectangle !!} @endif
                        </td>
                    <td></td>
                    <td>0-1 bulan</td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td>@if ($data->umur_tahun == 0 && $data->umur_bulan > 1)√ @else {!! $rectangle !!} @endif</td>
                    <td></td>
                    <td>> 1 bulan - 1 tahun</td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td class="flex text-right">@if ($data->umur_tahun >= 1 && $data->umur_tahun <= 5)v @else {!! $rectangle !!} @endif</td>
                    <td></td>
                    <td>> 1 tahun - 5 tahun</td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td class="flex text-right">@if ($data->umur_tahun > 5 && $data->umur_tahun <= 15)v @else {!! $rectangle !!} @endif</td>
                    <td></td>
                    <td>> 5 tahun - 15 tahun</td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td class="flex text-right">@if ($data->umur_tahun > 15 && $data->umur_tahun <= 30)v @else {!! $rectangle !!} @endif</td>
                    <td></td>
                    <td>> 15 tahun - 30 tahun</td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td class="flex text-right">@if ($data->umur_tahun > 30 && $data->umur_tahun <= 65)v @else {!! $rectangle !!} @endif</td>
                    <td></td>
                    <td>> 30 tahun - 65tahun</td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td class="flex text-right">@if ($data->umur_tahun > 65)v @else {!! $rectangle !!} @endif</td>
                    <td></td>
                    <td>> 65 tahun</td>
                </tr>

            </tbody>
        </table>
        <table class="px-4 mx-4">
            <thead style="display: table-row-group;" class="">
                <tr>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1" style="width: 60px;"></div>
                    </th>
                    <th colspan="2" scope="col" class="px-1 py-1 text-left text-gray-800 ">
                        <div class="flex cursor-pointer items-left gap-x-1" style="width: 190px;"></div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="cursor-pointer whitespace-nowrap gap-x-1">
                        </div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                </tr>
            </thead>
            <tbody class="">
                <tr>
                    <td rowspan="1" class="px-1 py-1 font-normal "></td>
                    <td colspan="2" class="px-1 py-1 font-normal ">Jenis Kelamin</td>
                    <td rowspan="1" class="px-1 py-1 font-normal ">:</td>
                    <td rowspan="1" class="px-1 py-1 font-normal ">
                        @if ($data->jeniskelamin == 1)
                            v
                        @else
                            {!! $rectangle !!}
                        @endif
                    </td>
                    <td rowspan="1" class="px-1 py-1 font-normal" style="display: inline-flex;">
                        Laki-laki
                    </td>
                    <td class="pl-10">
                        @if ($data->jeniskelamin == 2)
                            v
                        @else
                            {!! $rectangle !!}
                        @endif
                    </td>
                    <td rowspan="1" class="px-1 py-1 font-normal ">Perempuan</td>
                </tr>
            </tbody>
        </table>
        <table class="px-4 mx-4">
            <thead style="display: table-row-group;" class="">
                <tr>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1" style="width: 60px;"></div>
                    </th>
                    <th colspan="2" scope="col" class="px-1 py-1 text-left text-gray-800 ">
                        <div class="flex cursor-pointer items-left gap-x-1" style="width: 190px;"></div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="cursor-pointer whitespace-nowrap gap-x-1">
                        </div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                </tr>
            </thead>
            <tbody class="">
                <tr>
                    <td rowspan="1" class="px-1 py-1 font-normal "></td>
                    <td colspan="2" class="px-1 py-1 font-normal ">Penanggung Biaya Pasien</td>
                    <td rowspan="1" class="px-1 py-1 font-normal ">:</td>
                </tr>
                
                    @foreach ($IkpPenanggung as $item)
                        @if ($item->id % 2 == 1)
                        <tr>
                            <td></td>
                            <td>
                                @if ($item->id == $data->ikp_penanggung_id)
                                    v
                                @else
                                    {!! $rectangle !!}
                                @endif
                            </td>
                            <td rowspan="1" class="px-1 py-1 font-normal ">{{ $item->name }}</td>
                        
                        @endif
                        @if ($item->id % 2 != 1)
                        
                            {{-- <td></td> --}}
                            <td>
                                @if ($item->id == $data->ikp_penanggung_id)
                                    v
                                @else
                                    {!! $rectangle !!}
                                @endif
                            </td>
                            <td rowspan="1" class="px-1 py-1 font-normal ">{{ $item->name }}</td>
                        </tr>
                        @endif
                    @endforeach
                <tr>
                    <td rowspan="1" class="px-1 py-4 font-normal "></td>
                    <td colspan="2" class="px-1 py-4 font-normal ">Tanggal Masuk RS </td>
                    <td rowspan="1" class="px-1 py-4 font-normal ">:</td>
                    <td rowspan="1" class="px-1 py-4 font-normal ">
                        {{ \Carbon\Carbon::parse($data->tanggal_pelayanan)->isoFormat('D MMMM Y') }} Jam
                        {{ \Carbon\Carbon::parse($data->tanggal_pelayanan)->format('H:i') }} WITA</td>
                    <td></td>
                </tr>
            </tbody>
        </table>
        <table class="px-4 mx-4">
            <thead style="display: table-row-group;" class="">
                <tr>
                    <th colspan="1" scope="col" class="px-1 py-1 text-left text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1" style="width: 60px;">II</div>
                    </th>

                    <th colspan="3" scope="col" class="px-1 py-1 text-left text-gray-800 ">
                        <div class="flex cursor-pointer items-left gap-x-1">RINCIAN KEJADIAN</div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="cursor-pointer whitespace-nowrap gap-x-1">
                        </div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                </tr>
            </thead>
            <tbody class="">
                <tr>
                    <td rowspan="1" class="px-1 py-1 font-normal ">
                    </td>
                    <td rowspan="1" class="px-1 py-1 font-normal ">1.
                    </td>
                    <td colspan="2" class="px-1 py-1 font-normal ">Tanggal dan Waktu Insiden</td>
                    <td rowspan="1" class="px-1 py-1 font-normal "></td>
                    <td rowspan="1" class="px-1 py-1 font-normal "></td>
                </tr>
                <tr>
                    <td rowspan="1" class="px-1 py-1 font-normal ">
                    </td>
                    <td rowspan="1" class="px-1 pb-4 font-normal ">
                    </td>
                    <td colspan="6" class="px-1 pb-4 font-normal ">Tanggal :
                        {{ \Carbon\Carbon::parse($data->tanggal_insiden)->isoFormat('D MMMM Y') }} Jam
                        {{ \Carbon\Carbon::parse($data->tanggal_insiden)->format('H:i') }} WITA
                    </td>
                </tr>
                <tr>
                    <td rowspan="1" class="px-1 py-1 font-normal ">
                    </td>
                    <td rowspan="1" class="px-1 py-1 font-normal ">2.
                    </td>
                    <td colspan="2" class="px-1 py-1 font-normal ">Insiden</td>
                    <td rowspan="1" class="px-1 py-1 font-normal "></td>
                    <td rowspan="1" class="px-1 py-1 font-normal "></td>
                </tr>
                <tr>
                    <td rowspan="1" class="px-1 py-1 font-normal ">
                    </td>
                    <td rowspan="1" class="px-1 pb-4 font-normal ">
                    </td>
                    <td colspan="6" class="px-1 pb-4 font-normal ">{{ $data->insiden }}
                        yang sebenarnya</td>

                    </td>
                </tr>
                <tr>
                    <td rowspan="1" class="px-1 py-1 font-normal ">
                    </td>
                    <td rowspan="1" class="px-1 py-1 font-normal ">3.
                    </td>
                    <td colspan="2" class="px-1 py-1 font-normal ">Kronologis Insiden</td>
                    <td rowspan="1" class="px-1 py-1 font-normal "></td>
                    <td rowspan="1" class="px-1 py-1 font-normal "></td>
                </tr>
            </tbody>
        </table>
        <table class="px-4 mx-4 border">
            <thead style="display: table-row-group;" class="border">
                <tr>
                    <th style="border-right:1px solid black;" colspan="1" scope="col"
                        class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1" style="width: 60px;"></div>
                    </th>
                    <th style="border:1px solid black;" colspan="1" scope="col"
                        class="px-1 py-1 text-center text-gray-800">
                        <div class="flex items-center font-normal cursor-pointer gap-x-1">Tanggal dan Waktu
                            Insiden
                        </div>
                    </th>
                    <th style="border:1px solid black;" colspan="1" scope="col"
                        class="px-1 py-1 text-center text-gray-800">
                        <div class="flex items-center font-normal cursor-pointer gap-x-1">Urutan kronologis
                        </div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                </tr>
            </thead>
            <tbody class="border divide">
                @foreach ($data->kronologis as $item)
                <tr>
                    <td style="border-right:1px solid black;" rowspan="1" class="px-1 py-1 font-normal ">
                    </td>
                    <td style="border:1px solid black;" class="w-1/3 px-1 py-1 font-normal text-center">
                        Tanggal :
                        {{ \Carbon\Carbon::parse($data->waktu)->isoFormat('D MMMM Y') }} Jam
                        {{ \Carbon\Carbon::parse($data->waktu)->format('H:i') }} WITA
                    </td>
                    <td style="border:1px solid black;" class="w-2/3 px-1 py-1 font-normal">{{ $item->kronologi }}</td>
                    <td rowspan="1" class="px-1 py-1 font-normal ">
                    </td>
                </tr>
                @endforeach
                
                


            </tbody>
        </table>
        <table class="px-4 mx-4">
            <thead style="display: table-row-group;" class="">
                <tr>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1" style="width: 60px;"></div>
                    </th>
                    <th colspan="2" scope="col" class="px-1 py-1 text-left text-gray-800 ">
                        <div class="flex cursor-pointer items-left gap-x-1"></div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="cursor-pointer whitespace-nowrap gap-x-1">
                        </div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                </tr>
            </thead>
            <tbody class="">
                <div>
                    <tr>
                        <td rowspan="1" class="px-1 py-3 font-normal "></td>
                        <td colspan="2" class="px-1 py-3 font-normal "></td>
                        <td rowspan="1" class="px-1 py-3 font-normal "></td>
                    </tr>
                    <tr>
                        <td rowspan="1" class="px-1 py-1 font-normal text-right">4. </td>
                        <td colspan="2" class="px-1 py-1 font-normal ">Jenis Insiden * :</td>
                        <td rowspan="1" class="px-1 py-1 font-normal "></td>
                    </tr>
                    @foreach ($IkpJenisInsiden as $item)
                        <tr>
                            <td></td>
                            <td>
                                @if ($item->id == $data->ikp_jenis_insiden_id)
                                    v
                                @else
                                    {!! $rectangle !!}
                                @endif
                            </td>
                            <td rowspan="1" class="px-1 py-1 font-normal ">{{ $item->name }}</td>
                        </tr>
                    @endforeach
                    {{-- <tr>
                        <td></td>
                        <td>{!! $rectangle !!}</td>
                        <td rowspan="1" class="px-1 py-1 font-normal ">Kejadian Nyaris Cedera / KNC (Near miss)
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>{!! $rectangle !!}</td>
                        <td rowspan="1" class="px-1 py-1 font-normal ">Kejadian Tidak diharapkan / KTD (Adverse
                            Event)
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>v</td>
                        <td rowspan="1" class="px-1 py-1 font-normal ">Kejadian Sentinel (Sentinel Event)</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>{!! $rectangle !!}</td>
                        <td rowspan="1" class="px-1 py-1 font-normal ">Kejadian Tidak Cedera / KTC</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>{!! $rectangle !!}</td>
                        <td rowspan="1" class="px-1 py-1 font-normal ">Kejadian Potensial Cedera Signifikan / KPCS
                        </td>
                    </tr> --}}
                </div>
                <div class="mt-4">
                    <tr>
                        <td rowspan="1" class="px-1 py-3 font-normal "></td>
                        <td colspan="2" class="px-1 py-3 font-normal "></td>
                        <td rowspan="1" class="px-1 py-3 font-normal "></td>
                    </tr>
                    <tr>
                        <td rowspan="1" class="px-1 py-1 font-normal text-right">5. </td>
                        <td colspan="2" class="px-1 py-1 font-normal ">Insiden terjadi pada pasien :
                            (sesuai kasus
                            penyakit / spesialisasi) *</td>
                        <td rowspan="1" class="px-1 py-1 font-normal "></td>
                    </tr>
                    @foreach ($IkpSpesialisasi as $item)
                        <tr>
                            <td></td>
                            <td>
                                @if ($item->id == $data->ikp_spesialisasi_id)
                                    v
                                @else
                                    {!! $rectangle !!}
                                @endif
                            </td>
                            <td rowspan="1" class="px-1 py-1 font-normal ">{{ $item->name }}</td>
                        </tr>
                    @endforeach

                </div>
                <div>
                    <tr>
                        <td rowspan="1" class="px-1 py-3 font-normal "></td>
                        <td colspan="2" class="px-1 py-3 font-normal "></td>
                        <td rowspan="1" class="px-1 py-3 font-normal "></td>
                    </tr>
                    <tr>
                        <td rowspan="1" class="px-1 py-1 font-normal text-right">6. </td>
                        <td colspan="2" class="px-1 py-1 font-normal ">Dampak / Akibat Insiden Terhadap
                            Pasien* : (lihat Grading Matriks)</td>
                        <td rowspan="1" class="px-1 py-1 font-normal "></td>
                    </tr>
                    @foreach ($IkpDampak as $item)
                        <tr>
                            <td></td>
                            <td>
                                @if ($item->id == $data->ikp_dampak_id)
                                    v
                                @else
                                    {!! $rectangle !!}
                                @endif
                            </td>
                            <td rowspan="1" class="px-1 py-1 font-normal ">{{ $item->description }}</td>
                        </tr>
                    @endforeach

                </div>
                <div>
                    <tr>
                        <td rowspan="1" class="px-1 py-3 font-normal "></td>
                        <td colspan="2" class="px-1 py-3 font-normal "></td>
                        <td rowspan="1" class="px-1 py-3 font-normal "></td>
                    </tr>
                    <tr>
                        <td rowspan="1" class="px-1 py-1 font-normal text-right">7. </td>
                        <td colspan="2" class="px-1 py-1 font-normal ">Probabilitas *: (lihat Grading
                            Matriks)</td>
                        <td rowspan="1" class="px-1 py-1 font-normal "></td>
                    </tr>
                    @foreach ($IkpProbabilitas as $item)
                        <tr>
                            <td></td>
                            <td>
                                @if ($item->id == $data->ikp_probabilitas_id)
                                    v
                                @else
                                    {!! $rectangle !!}
                                @endif
                            </td>
                            <td rowspan="1" class="px-1 py-1 font-normal ">{{ $item->name }}</td>
                        </tr>
                    @endforeach

                </div>
                <div>
                    <tr>
                        <td rowspan="1" class="px-1 py-3 font-normal "></td>
                        <td colspan="2" class="px-1 py-3 font-normal "></td>
                        <td rowspan="1" class="px-1 py-3 font-normal "></td>
                    </tr>
                    <tr>
                        <td rowspan="1" class="px-1 py-1 font-normal text-right">8. </td>
                        <td colspan="2" class="px-1 py-1 font-normal ">Orang Pertama Yang Melaporkan
                            Insiden*</td>
                        <td rowspan="1" class="px-1 py-1 font-normal "></td>
                    </tr>
                    @foreach ($IkpPelapor as $item)
                        <tr>
                            <td></td>
                            <td>
                                @if ($item->id == $data->ikp_pelapor_id)
                                    v
                                @else
                                    {!! $rectangle !!}
                                @endif
                            </td>
                            <td rowspan="1" class="px-1 py-1 font-normal ">{{ $item->name }}</td>
                        </tr>
                    @endforeach
                </div>
                <div>
                    <tr>
                        <td rowspan="1" class="px-1 py-3 font-normal "></td>
                        <td colspan="2" class="px-1 py-3 font-normal "></td>
                        <td rowspan="1" class="px-1 py-3 font-normal "></td>
                    </tr>
                    <tr>
                        <td rowspan="1" class="px-1 py-1 font-normal text-right">9. </td>
                        <td colspan="2" class="px-1 py-1 font-normal ">Insiden menyangkut pasien *:</td>
                        <td rowspan="1" class="px-1 py-1 font-normal "></td>
                    </tr>
                    @foreach ($IkpGrupLayanan as $item)
                        <tr>
                            <td></td>
                            <td>
                                @if ($item->id == $data->ikp_gruplayanan_id)
                                    v
                                @else
                                    {!! $rectangle !!}
                                @endif
                            </td>
                            <td rowspan="1" class="px-1 py-1 font-normal ">{{ $item->name }}</td>
                        </tr>
                    @endforeach

                </div>
                <div>
                    <tr>
                        <td rowspan="1" class="px-1 py-3 font-normal "></td>
                        <td colspan="2" class="px-1 py-3 font-normal "></td>
                        <td rowspan="1" class="px-1 py-3 font-normal "></td>
                    </tr>
                    <tr>
                        <td rowspan="1" class="px-1 py-1 font-normal text-right">10. </td>
                        <td colspan="2" class="px-1 py-1 font-normal ">Tempat Insiden</td>
                        <td rowspan="1" class="px-1 py-1 font-normal "></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td rowspan="1" colspan="2" class="px-1 py-1 font-normal ">Lokasi kejadian di
                            {{ $data->lokasi_name }}
                            {{-- <td></td> --}}
                        </td>
                    </tr>

                </div>
                <div>
                    <tr>
                        <td rowspan="1" class="px-1 py-3 font-normal "></td>
                        <td colspan="2" class="px-1 py-3 font-normal "></td>
                        <td rowspan="1" class="px-1 py-3 font-normal "></td>
                    </tr>
                    <tr>
                        <td rowspan="1" class="px-1 py-1 font-normal text-right">11. </td>
                        <td colspan="2" class="px-1 py-1 font-normal ">Unit / Departemen terkait yang
                            menyebabkan insiden</td>
                        <td rowspan="1" class="px-1 py-1 font-normal "></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td colspan="2" class="px-1 py-1 font-normal ">Unit kerja penyebab
                            {{ $data->pic?->name }}</td>
                        </td>
                    </tr>
                </div>
                <div>
                    <tr>
                        <td rowspan="1" class="px-1 py-3 font-normal "></td>
                        <td colspan="2" class="px-1 py-3 font-normal "></td>
                        <td rowspan="1" class="px-1 py-3 font-normal "></td>
                    </tr>
                    <tr>
                        <td rowspan="1" class="px-1 py-1 font-normal text-right">12. </td>
                        <td colspan="2" class="px-1 py-1 font-normal ">Tindak lanjut yang dilakukan segera
                            setelah kejadian, dan hasilnya :</td>
                        <td rowspan="1" class="px-1 py-1 font-normal "></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td colspan="2" class="px-1 py-1 font-normal ">{{ $data->tindak_lanjut_hasil }}
                        </td>
                        </td>
                    </tr>

                </div>
                <div>
                    <tr>
                        <td rowspan="1" class="px-1 py-3 font-normal "></td>
                        <td colspan="2" class="px-1 py-3 font-normal "></td>
                        <td rowspan="1" class="px-1 py-3 font-normal "></td>
                    </tr>
                    <tr>
                        <td rowspan="1" class="px-1 py-1 font-normal text-right">13. </td>
                        <td colspan="2" class="px-1 py-1 font-normal ">Tindak lanjut setelah insiden
                            dilakukan oleh* :</td>
                        <td rowspan="1" class="px-1 py-1 font-normal "></td>
                    </tr>
                    @foreach ($IkpPelapor as $item)
                        <tr>
                            <td></td>
                            <td>
                                @if ($item->id == $data->ikp_pelapor_id)
                                    v
                                @else
                                    {!! $rectangle !!}
                                @endif
                            </td>
                            <td rowspan="1" class="px-1 py-1 font-normal ">{{ $item->name }}</td>
                        </tr>
                    @endforeach

                </div>
                <div>
                    <tr>
                        <td rowspan="1" class="px-1 py-3 font-normal "></td>
                        <td colspan="2" class="px-1 py-3 font-normal "></td>
                        <td rowspan="1" class="px-1 py-3 font-normal "></td>
                    </tr>
                    <tr>
                        <td rowspan="1" class="px-1 py-1 font-normal text-right">14. </td>
                        <td colspan="2" class="px-1 py-1 font-normal ">Apakah kejadian yang sama pernah
                            terjadi di Unit Kerja lain?*</td>
                        <td rowspan="1" class="px-1 py-1 font-normal "></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>v</td>
                        <td rowspan="1" class="px-1 py-1 font-normal ">Tidak
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>{!! $rectangle !!}</td>
                        <td rowspan="1" class="px-1 py-1 font-normal ">Ya</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td class="pt-4" colspan="2">Apabila ya, isi bagian dibawah ini.</td>

                    </tr>
                    <tr>
                        <td></td>
                        <td colspan="2">Kapan ? dan Langkah / tindakan apa yang telah diambil pada Unit
                            kerja Tersebut untuk mencegah terulangnya kejadian yang sama?</td>

                    </tr>

                    <tr>
                        <td></td>
                        <td class="py-4" colspan="2">
                            {{ $data->langkah_tempatlain ? '-' : $data->langkah_tempatlain }}</td>

                    </tr>

                </div>
            </tbody>
        </table>
        <table class="px-4 mx-4 border">
            <thead style="display: table-row-group;" class="">
                <tr>
                    <th style="border-bottom:1px border-right:1px solid black;" colspan="1" scope="col"
                        class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1" style="width: 60px;"></div>
                    </th>
                    <th style="border-bottom:1px solid black;" colspan="2" scope="col"
                        class="px-1 py-1 text-left text-gray-800 ">
                        <div class="flex cursor-pointer items-left gap-x-1"></div>
                    </th>
                    <th style="border-bottom:1px solid black;" colspan="1" scope="col"
                        class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                    <th style="border-bottom:1px solid black;" colspan="1" scope="col"
                        class="px-1 py-1 text-center text-gray-800 ">
                        <div class="cursor-pointer whitespace-nowrap gap-x-1">
                        </div>
                    </th>

                </tr>
            </thead>
            <tbody class="w-full border divide" style="border:1px solid black;">
                <tr>
                    <td style="border-right:1px solid black;"></td>
                    <td style="border:1px solid black;" rowspan="1" class="w-1/4 px-1 py-4 font-normal ">
                        Pembuat Laporan
                    </td>
                    <td style="border:1px solid black;" class="w-1/4 px-1 py-4 font-normal text-center">
                    </td>
                    <td style="border:1px solid black;" class="w-1/4 px-1 py-4 font-normal">Penerima Laporan
                    </td>
                    <td style="border:1px solid black;" rowspan="1" class="w-1/4 px-1 py-4 font-normal ">
                    </td>
                </tr>
                <tr>
                    <td class="pl-10" style="border-right:1px solid black;"></td>
                    <td style="border:1px solid black;" rowspan="1" class="w-1/4 px-1 py-4 font-normal ">
                        Paraf
                    </td>
                    <td style="border:1px solid black;" class="w-1/4 px-1 py-4 font-normal text-center">
                    </td>
                    <td style="border:1px solid black;" class="w-1/4 px-1 py-4 font-normal">Paraf</td>
                    <td style="border:1px solid black;" rowspan="1" class="w-1/4 px-1 py-4 font-normal ">
                    </td>
                </tr>
                <tr>
                    <td class="pl-10" style="border-right:1px solid black;"></td>
                    <td style="border:1px solid black;" rowspan="1" class="w-1/4 px-1 py-4 font-normal ">
                        Tanggal Lapor
                    </td>
                    <td style="border:1px solid black;" class="w-1/4 px-1 py-4 font-normal">
                        {{ \Carbon\Carbon::parse($data->created_at)->isoFormat('D MMMM Y') }}
                    </td>
                    <td style="border:1px solid black;" class="w-1/4 px-1 py-4 font-normal">Tanggal Terima
                    </td>
                    <td style="border:1px solid black;" rowspan="1" class="w-1/4 px-1 py-4 font-normal ">
                        {{ \Carbon\Carbon::parse($data->created_at)->isoFormat('D MMMM Y') }}
                    </td>
                </tr>



            </tbody>
        </table>
        <table class="px-4 mx-4 border">
            <thead style="display: table-row-group;" class="">
                <tr>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1" style="width: 60px;"></div>
                    </th>
                    <th colspan="2" scope="col" class="px-1 py-1 text-left text-gray-800 ">
                        <div class="flex cursor-pointer items-left gap-x-1"></div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="cursor-pointer whitespace-nowrap gap-x-1">
                        </div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                </tr>
            </thead>
            <tbody class="w-full border divide">
                <tr>
                    <td></td>
                    <td colspan="5" rowspan="1" class="w-1/4 px-1 pt-8 font-normal ">Grading
                        Risiko Kejadian* (Diisi oleh atasan pelapor):
                    </td>
                    <td rowspan="1" class="w-1/4 px-1 font-normal ">
                    </td>
                    <td></td>
                </tr>
                <tr>
                    {{-- {{ $data->riskgrading.name_ikp }} --}}
                    <td></td>
                    <td class="">
                        @if ($data->riskgrading->name_ikp == 'Rendah')
                            v
                        @else
                            {!! $rectangle !!}
                        @endif
                    </td>
                    <td rowspan="1"
                        class="w-1/4 px-1 uppercase text-xl @if ($data->riskgrading->name_ikp == 'Rndah') font-semibold @else font-normal @endif">
                        Biru
                    </td>
                    <td class="pl-10">
                        @if ($data->riskgrading->name_ikp == 'Moderat')
                            v
                        @else
                            {!! $rectangle !!}
                        @endif
                    </td>
                    <td rowspan="1"
                        class="w-1/4 px-1 uppercase text-xl @if ($data->riskgrading->name_ikp == 'Moderat') font-semibold @else font-normal @endif">
                        Hijau
                    </td>
                    <td class="pl-10">
                        @if ($data->riskgrading->name_ikp == 'Tinggi')
                            v
                        @else
                            {!! $rectangle !!}
                        @endif
                    </td>
                    <td rowspan="1"
                        class="w-1/4 px-1 uppercase text-xl @if ($data->riskgrading->name_ikp == 'Tinggi') font-semibold @else font-normal @endif">
                        Kuning
                    </td>
                    <td class="pl-10">
                        @if ($data->riskgrading->name_ikp == 'Ekstrim')
                            v
                        @else
                            {!! $rectangle !!}
                        @endif
                    </td>
                    <td rowspan="1"
                        class="w-1/4 px-1 uppercase text-xl @if ($data->riskgrading->name_ikp == 'Ekstrim') font-semibold @else font-normal @endif">
                        Merah
                    </td>

                </tr>
            </tbody>
        </table>
        <table class="px-4 mx-4 border">
            <thead style="display: table-row-group;" class="">
                <tr>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1" style="width: 60px;"></div>
                    </th>
                    <th colspan="2" scope="col" class="px-1 py-1 text-left text-gray-800 ">
                        <div class="flex cursor-pointer items-left gap-x-1"></div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="cursor-pointer whitespace-nowrap gap-x-1">
                        </div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                </tr>
            </thead>
            <tbody class="w-full border divide">
                <tr>
                    <td colspan="1"></td>
                    <td colspan="6" rowspan="1" class="px-1 pt-8 font-normal ">Penjelasan
                        mengenai JENIS INSIDEN :
                    </td>
                    {{-- <td colspan="1"></td> --}}
                </tr>
                <tr>
                    <td class="" colspan="1"></td>
                    <td class="pr-4 " colspan="1">1.</td>
                    <td rowspan="1" colspan="4" class="px-1 font-normal ">Kejadian Nyaris Cidera (KNC,
                        Near Missed) adalah terjadinya insiden yang belum
                        terpapar ke pasien
                    </td>
                </tr>
                <tr>
                    <td class="" colspan="1"></td>
                    <td class="pr-4 " colspan="1">2.</td>
                    <td rowspan="1" colspan="4" class="px-1 font-normal ">Kejadian Tidak Cidera (KTC,
                        No Harm Incident) adalah
                        suatu insiden yang sudah terpapar ke pasien tetapi tidak timbul cidera
                    </td>
                </tr>
                <tr>
                    <td class="" colspan="1"></td>
                    <td class="pr-4 " colspan="1">3.</td>
                    <td rowspan="1" colspan="4" class="px-1 font-normal ">Kejadian Tidak Diharapkan
                        (KTD, Harmful Incident, Adverse Event)
                        adalah insiden yang menyebabkan cidera terhadap pasien
                    </td>
                </tr>
                <tr>
                    <td class="" colspan="1"></td>
                    <td class="pr-4 " colspan="1">4.</td>
                    <td rowspan="1" colspan="4" class="px-1 font-normal ">Kejadian Sentinel (Sentinel
                        Event) adalah "suatu KTD" yang mengakibatkan kematian atau cidera yang serius yang
                        biasanya dipakai untuk kejadian yang sangat tidak diharapkan atau tidak dapat diterima.
                        Contoh : amputasi pada bagian tubuh yang salah.
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</body>

</html>
