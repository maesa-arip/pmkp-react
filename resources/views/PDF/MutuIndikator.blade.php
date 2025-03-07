<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Mutu Indikator</title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <script>
        function updatePrintedAt() {
            var currentDate = new Date();
            var printedAt = currentDate.toLocaleString('id-ID');
            document.querySelector('.date').textContent = printedAt;
        }
    </script>
    <script>
        // Update printed-at timestamp when the document is loaded
        window.onload = function () {
            updatePrintedAt();
        };
    </script>
    <style>
        .printed-at {
            /* position: fixed;
            bottom: 10px;
            left: 10px; */
            font-size: 10px;
            color: #555;
        }
    </style>
</head>

<body>
    <img class="h-auto mx-auto"
        src="data:image/jpeg;base64,{{ base64_encode(@file_get_contents(url(asset('Cop.jpeg')))) }}">
    {{-- <img src={{ asset('Cop.jpeg') }} style="width: 100%; height: 100%;"> --}}
    <p class="flex mb-4 font-serif font-semibold text-right">Form......../KPMKP/2018</p>
    <p class="flex mb-4 font-serif font-semibold text-center mx-36">PENGUMPULAN DATA INDIKATOR MUTU DAN KESELAMATAN
        PASIEN RSUD BALI MANDARA PROVINSI BALI</p>
    {{-- <p class="ml-4 font-serif font-semibold uppercase">{{ $first->mutu_indikator?->location->name }}</p> --}}
    <p class="ml-4 font-serif font-semibold uppercase">BULAN :
        {{ \Carbon\Carbon::parse($first->tanggal_mutu)->isoFormat('MMMM Y') }}</p>

    <table class="px-4 mx-4">
        <thead class="bg-gray-50">
            <tr>
                <th style="border:1px solid black;" colspan="1" scope="col"
                    class="px-1 py-1 text-center text-gray-800 border border-slate-300">
                    <div class="flex items-center cursor-pointer gap-x-1">No</div>
                </th>
                <th style="border:1px solid black;" colspan="1" scope="col"
                    class="px-1 py-1 text-center text-gray-800 border border-slate-300">
                    <div class="flex items-center cursor-pointer gap-x-1">Indikator</div>
                </th>
                <th style="border:1px solid black;" colspan="2" scope="col"
                    class="px-1 py-1 text-center text-gray-800 border border-slate-300">
                    <div class="cursor-pointer whitespace-nowrap gap-x-1">Numerator(N) & Denuminator(D)
                    </div>
                </th>
                <th style="border:1px solid black;" colspan="1" scope="col"
                    class="px-1 py-1 text-center text-gray-800 border border-slate-300">
                    <div class="flex items-center cursor-pointer gap-x-1">Hasil</div>
                </th>
                <th style="border:1px solid black;" colspan="1" scope="col"
                    class="px-1 py-1 text-center text-gray-800 border border-slate-300">
                    <div class="flex items-center cursor-pointer gap-x-1">Capaian</div>
                </th>
                <th style="border:1px solid black;" colspan="1" scope="col"
                    class="px-1 py-1 text-center text-gray-800 border border-slate-300">
                    <div class="flex items-center cursor-pointer gap-x-1">Standar</div>
                </th>
            </tr>
        </thead>
        <thead class="py-3 bg-white">
            <tr class="py-3">
                <td style="border: 1px solid white; border-bottom: 1px solid black;" colspan="12"
                    class="py-3 bg-white divide-y-0 divide-white"></td>
            </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
            @foreach ($data as $item)
                <tr>
                    <td style="border:1px solid black;" rowspan="2"
                        class="px-1 py-4 text-sm font-normal border border-slate-300 "><span
                            class="inline-flex items-center px-2 py-1 mr-1 font-medium text-blue-600 rounded-md bg-blue-50 ring-blue-500/10 ring-1 ring-inset ">{{ $loop->index + 1 }}</span>
                    </td>
                    <td style="border:1px solid black;" rowspan="2"
                        class="px-1 py-4 text-sm font-normal border border-slate-300 ">
                        {{ $item->mutu_indikator->indikator_fitur4->name }}</td>
                    <td style="border:1px solid black;" rowspan="1"
                        class="px-1 py-4 text-sm font-normal border border-slate-300 ">N</td>
                    <td style="border:1px solid black;" rowspan="1"
                        class="px-1 py-4 text-sm font-normal border border-slate-300 ">
                        {{ $item->mutu_indikator->num_name }}</td>
                    <td style="border:1px solid black;" rowspan="1"
                        class="px-1 py-4 text-sm font-normal text-center border border-slate-300 ">{{ $item->num }}
                    </td>
                    <td style="border:1px solid black;" rowspan="2"
                        class="px-1 py-4 text-sm font-normal text-center border border-slate-300 whitespace-nowrap">
                        {{ $item->capaian }}{{ $item->mutu_indikator->penyebut }}</td>
                    <td style="border:1px solid black;" rowspan="2"
                        class="px-1 py-4 text-sm font-normal text-center border border-slate-300 whitespace-nowrap">
                        @if ($item->mutu_indikator->operator != '=')
                            {{ $item->mutu_indikator->operator }}
                        @endif
                        {{ $item->mutu_indikator->standar }}{{ $item->mutu_indikator->penyebut }}
                    </td>


                </tr>
                <tr>
                    <td style="border:1px solid black;" rowspan="1"
                        class="px-1 py-4 text-sm font-normal border border-slate-300 ">D</td>
                    <td style="border:1px solid black;" rowspan="1"
                        class="px-1 py-4 text-sm font-normal border border-slate-300 ">
                        {{ $item->mutu_indikator->denum_name }}</td>
                    <td style="border:1px solid black;" rowspan="1"
                        class="px-1 py-4 text-sm font-normal text-center border border-slate-300 ">{{ $item->denum }}
                    </td>
                </tr>
            @endforeach




        </tbody>

    </table>
    <table class="w-[894px] px-4 mx-4">
        {{-- <thead class="w-full bg-gray-50">
            <tr class="w-[120px]" style="border:1px solid black;">
                <th class="w1/2"></th>
                <th class="w1/2"></th>
            </tr>
        </thead> --}}
        <tbody>
            <tr class="pb-8" style="border-left:1px solid black; border-top:1px solid white; border-right:1px solid black; border-bottom:1px solid black;">
                <td style="width: 600px;height: 50px; vertical-align:bottom; border-bottom:1px solid white; border-right:1px solid white;" class="mb-8"></td>
                <td style="width: 600px;height: 50px; vertical-align:bottom; border-bottom:1px solid white; border-right:1px solid black;" class="printed-at">Printed at: <span class="date"></span></td>
                
                {{-- <td style="width: 600px;height: 50px; vertical-align:bottom; border-bottom:1px solid white; border-left:1px solid white;" class="mb-8">Disusun Oleh :</td> --}}
            </tr>
            <tr class="pb-8" style="border-left:1px solid black; border-top:1px solid white; border-right:1px solid black; border-bottom:1px solid black;">
                {{-- <td style="width: 600px;height: 50px; vertical-align:bottom; border-bottom:1px solid white; border-right:1px solid white;" class="printed-at">Printed at: <span class="date"></span></td> --}}
                <td style="width: 600px;vertical-align:bottom; border-bottom:1px solid white; border-right:1px solid white;" class="mb-8">Verifikasi</td>
                <td style="width: 600px;vertical-align:bottom; border-bottom:1px solid white; border-left:1px solid white;" class="mb-8">Disusun Oleh :</td>
            </tr>
            <tr style="border-top:1px solid black; border-right:1px solid black; border-left:1px solid black; border-bottom:1px solid white;">
                {{-- <td style="height: 150px; vertical-align:top; border-right:1px solid white;">Komite Mutu</td> --}}
                <td style="height: 150px; vertical-align:top; border-right:1px solid white;">Komite Mutu</td>
                <td style="height: 150px; vertical-align:top; border-left:1px solid white;">Kepala {{ $first->mutu_indikator->location->name }}</td>
            </tr>
            <tr style="border-top:1px solid black; border-right:1px solid black; border-left:1px solid black; border-bottom:1px solid black;">
                <td style="border-right:1px solid white;">Tanggal</td>
                <td style="border-left:1px solid white;"></td>
            </tr>
        </tbody>
    </table>

    
</body>

</html>
