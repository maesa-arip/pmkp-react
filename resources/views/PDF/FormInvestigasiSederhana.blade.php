<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">


{{-- <link href="/var/www/pmkp-react/public/css/app.css" rel="stylesheet" type="text/css" /> --}}
<link rel="stylesheet" href="{{ asset('css/app.css') }}">
<link href='http://fonts.googleapis.com/css?family=Times' rel='stylesheet' type='text/css'>

    <title>Form Investigasi Sederhana</title>
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
    <p class="flex font-bold text-center times">Unit Keselamatan Pasien</p>
    <p class="flex mb-4 font-bold text-center times"">RSUD
        Bali Mandara Provinsi Bali</p>
    <p class="flex font-bold text-center times ">"LEMBAR KERJA INVESTIGASI SEDERHANA"</p>
    <p class="flex mb-4 font-bold text-center times ">( Untuk Bands Risiko Biru / Hijau )
    </p>
    @php
        $rectangle = '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4-none icon icon-tabler icon-tabler-rectangle-vertical" width="24" height="24" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" /></svg>';
    @endphp
    <div class="times">

        
        <table class="px-4 mx-4">
            <thead style="display: table-row-group;" class="">
                <tr>
                    <th colspan="1" scope="col" class="px-1 py-1 text-left text-gray-800 ">
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
                    <td rowspan="1" class="px-1 py-1 font-normal ">
                    </td>
                    <td colspan="2" class="px-1 py-1 font-normal "><b>Jenis Insiden</b></td>
                    <td rowspan="1" class="px-1 py-1 font-normal "><b>:</b></td>
                    <td rowspan="1" class="px-1 py-1 font-normal "><b>{{ $data->jenis_insiden->name }}</b></td>
                </tr>
                <tr>
                    <td rowspan="1" class="px-1 py-1 font-normal ">
                    </td>
                    <td colspan="2" class="px-1 py-1 font-normal "><b>Tanggal Insiden</b></td>
                    <td rowspan="1" class="px-1 py-1 font-normal "><b>:</b></td>
                    <td rowspan="1" class="px-1 py-1 font-normal "><b>{{ $data->tanggal_insiden }}</b></td>
                    </td>
                </tr>
                
            </tbody>
        </table>
        <table class="px-4 mx-4 mt-4 border">
            <thead style="display: table-row-group;" class="border">
                <tr>
                    <th style="border-right:1px solid black;" colspan="1" scope="col"
                        class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1" style="width: 60px;"></div>
                    </th>
                    <th style="border-top:1px solid black;border-right:1px solid black;" colspan="1" scope="col"
                        class="px-1 py-1 text-left text-gray-800">
                        <div class="flex items-start font-normal cursor-pointer gap-x-1 text-bold"><b>Penyebab Langsung Insiden :</b>
                        </div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                </tr>
            </thead>
            <tbody class="border divide">
                
                <tr>
                    <td style="border-right:1px solid black;" rowspan="1" class="px-1 py-1 font-normal ">
                    </td>
                    <td style="border:1px solid black;" class="w-full px-1 py-1 font-normal text-left">
                        {{$data->ikp_hasil?->penyebab}}
                    </td>
                    {{-- <td style="border:1px solid black;" class="w-2/3 px-1 py-1 font-normal"></td> --}}
                    <td rowspan="1" class="px-1 py-1 font-normal ">
                    </td>
                </tr>
               
                
                


            </tbody>
        </table>
        <table class="px-4 mx-4 mt-4 border">
            <thead style="display: table-row-group;" class="border">
                <tr>
                    <th style="border-right:1px solid black;" colspan="1" scope="col"
                        class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1" style="width: 60px;"></div>
                    </th>
                    <th style="border-top:1px solid black;border-right:1px solid black;" colspan="1" scope="col"
                        class="px-1 py-1 text-left text-gray-800">
                        <div class="flex items-start font-normal cursor-pointer gap-x-1 text-bold"><b>Penyebab yang melatar belakangi / akar masalah Insiden</b>
                        </div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                </tr>
            </thead>
            <tbody class="border divide">
                
                <tr>
                    <td style="border-right:1px solid black;" rowspan="1" class="px-1 py-1 font-normal ">
                    </td>
                    <td style="border:1px solid black;" class="w-full px-1 py-1 font-normal text-left">
                        {{$data->ikp_hasil?->akarmasalah}}
                    </td>
                    {{-- <td style="border:1px solid black;" class="w-2/3 px-1 py-1 font-normal"></td> --}}
                    <td rowspan="1" class="px-1 py-1 font-normal ">
                    </td>
                </tr>
               
                
                


            </tbody>
        </table>

        <table class="px-4 mx-4 mt-4 border">
            <thead style="display: table-row-group;" class="w-full border">
                <tr>
                    <th style="border-right:1px solid black;" colspan="1" scope="col"
                        class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1" style="width: 60px;"></div>
                    </th>
                    <th style="border-right:1px solid black; border-top:1px solid black;" colspan="1" scope="col"
                        class="px-1 py-1 text-center text-gray-800">
                        <div class="flex items-center font-normal text-left cursor-pointer gap-x-1"><b>Rekomendasi :</b>
                        </div>
                    </th>
                    <th style="border-right:1px solid black; border-top:1px solid black;" colspan="1" scope="col"
                        class="px-1 py-1 text-center text-gray-800">
                        <div class="flex items-center font-normal text-left cursor-pointer gap-x-1"><b>Penanggung jawab :</b>
                        </div>
                    </th>
                    <th style="border-right:1px solid black; border-top:1px solid black;" colspan="1" scope="col"
                        class="px-1 py-1 text-center text-gray-800">
                        <div class="flex items-center font-normal text-left cursor-pointer gap-x-1"><b>Tanggal :</b>
                        </div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                </tr>
            </thead>
            <tbody class="w-full border divide">
                
                <tr class="w-full">
                    <td style="border-right:1px solid black;" rowspan="1" class="px-1 py-1 font-normal ">
                    </td>
                    <td style="border:1px solid black;" class="w-2/4 px-1 py-1 font-normal text-left">
                        {{ $data->ikp_hasil?->rekomendasi }}
                    </td>
                    <td style="border:1px solid black;" class="w-1/4 px-1 py-1 font-normal text-left">{{ $data->ikp_hasil?->pj1 }}</td>
                    <td style="border:1px solid black;" class="w-1/4 px-1 py-1 font-normal text-left">{{ $data->ikp_hasil?->tanggal_rekomendasi }}</td>
                    <td rowspan="1" class="px-1 py-1 font-normal ">
                    </td>
                </tr>
                
                
                


            </tbody>
        </table>
        <table class="px-4 mx-4 mt-4 border">
            <thead style="display: table-row-group;" class="border">
                <tr>
                    <th style="border-right:1px solid black;" colspan="1" scope="col"
                        class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1" style="width: 60px;"></div>
                    </th>
                    <th style="border-right:1px solid black;border-top:1px solid black;" colspan="1" scope="col"
                        class="px-1 py-1 text-center text-gray-800">
                        <div class="flex items-center font-normal text-left cursor-pointer gap-x-1"><b>Tindakan yang akan dilakukan :</b>
                        </div>
                    </th>
                    <th style="border-right:1px solid black;border-top:1px solid black;" colspan="1" scope="col"
                        class="px-1 py-1 text-center text-gray-800">
                        <div class="flex items-center font-normal text-left cursor-pointer gap-x-1"><b>Penanggung jawab :</b>
                        </div>
                    </th>
                    <th style="border-right:1px solid black;border-top:1px solid black;" colspan="1" scope="col"
                        class="px-1 py-1 text-center text-gray-800">
                        <div class="flex items-center font-normal text-left cursor-pointer gap-x-1"><b>Tanggal</b>
                        </div>
                    </th>
                    <th colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                </tr>
            </thead>
            <tbody class="border divide">
                
                <tr>
                    <td style="border-right:1px solid black;" rowspan="1" class="px-1 py-1 font-normal ">
                    </td>
                    <td style="border:1px solid black;" class="w-2/4 px-1 py-1 font-normal text-left">
                        {{ $data->ikp_hasil?->tindakan }}
                    </td>
                    <td style="border:1px solid black;" class="items-start w-1/4 px-1 py-1 font-normal text-left">{{ $data->ikp_hasil?->pj2 }}</td>
                    <td style="border:1px solid black;" class="items-start w-1/4 px-1 py-1 font-normal text-left">{{ $data->ikp_hasil?->tanggal_tindakan }}</td>
                    <td rowspan="1" class="px-1 py-1 font-normal ">
                    </td>
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
                    <th style="border-top:1px solid black;" colspan="1" scope="col"
                        class="px-1 py-1 text-center text-gray-800">
                        <div class="flex items-center font-normal text-left cursor-pointer gap-x-1"><b>Manager / Kepala Bagian / Kepala Unit</b>
                        </div>
                    </th>
                    <th style="border-right:1px solid black;border-top:1px solid black;" colspan="1" scope="col"
                        class="px-1 py-1 text-center text-gray-800">
                        <div class="flex items-center font-normal text-left cursor-pointer gap-x-1">
                        </div>
                    </th>
                    <th  colspan="1" scope="col" class="px-1 py-1 text-center text-gray-800 ">
                        <div class="flex items-center cursor-pointer gap-x-1"></div>
                    </th>
                </tr>
            </thead>
            <tbody class="border divide">
                
                <tr>
                    <td style="border-right:1px solid black;" rowspan="1" class="px-1 py-1 font-normal ">
                    </td>
                    <td  class="w-1/2 px-1 py-1 font-normal text-left">
                        <b>Nama :</b> {{ $data->ikp_hasil?->nama }}
                       
                    </td>
                    <td style="border-right:1px solid black;" class="w-1/2 px-1 py-1 font-normal text-right"><b>Tanggal mulai investigasi :</b> {{ $data->ikp_hasil?->tanggal_mulai_investigasi }}</td>
                    <td rowspan="1" class="px-1 py-1 font-normal ">
                    </td>
                </tr>
                <tr class="mb-4">
                    <td style="border-right:1px solid black;" rowspan="1" class="px-1 py-1 font-normal ">
                    </td>
                    <td style="border-bottom:1px solid black;" class="w-1/2 px-1 py-1 mb-4 font-normal text-left">
                        <b>Tanda Tangan :</b>
                       
                    </td>
                    <td style="border-bottom:1px solid black;border-right:1px solid black;" class="w-1/2 px-1 py-1 mb-4 font-normal text-right"><b>Tanggal selesai investigasi :</b> {{ $data->ikp_hasil?->tanggal_mulai_investigasi }}</td>
                    <td rowspan="1" class="px-1 py-1 font-normal ">
                    </td>
                </tr>
                
                
                
                


            </tbody>
        </table>
       
    </div>
</body>

</html>
