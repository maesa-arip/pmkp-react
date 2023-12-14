<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    @vite('resources/css/app.css')
    <title>PDSA</title>
</head>

<body>
        @php
            $year = date('Y', strtotime($startDate));
            $tw = '?';
        @endphp
        @if ($startDate == $year.'-01-01' && $endDate == $year.'-03-01')
            @php
                $tw = 'I';
            @endphp
        @endif
        @if ($startDate == $year.'-04-01' && $endDate == $year.'-06-01')
            @php
                $tw = 'II';
            @endphp
        @endif
        @if ($startDate == $year.'-07-01' && $endDate == $year.'-09-01')
            @php
                $tw = 'III';
            @endphp
        @endif
        @if ($startDate == $year.'-10-01' && $endDate == $year.'-12-01')
            @php
                $tw = 'IV';
            @endphp
        @endif
        
        @foreach ($data as $item)
        <div class="p-5 mt-10 font-sans text-base" >
            <h1 class="ml-8 font-sans text-2xl font-bold">{{ $item->mutu_indikator->location?->name }}</h1>
            <h2 class="mt-4 ml-8 font-sans text-lg font-bold">PDSA TW {{ $tw }} {{ $item->mutu_indikator->location?->name }} {{ $year }}</h2>
            <div class="mt-2 mb-0 ml-20">
                <div class="font-sans"><strong>{{ $loop->index + 1 }}. PDSA</strong> {{ $item->mutu_pdsa?->problem }}</div>
            </div>
        </div>
        <div class="ml-12 mr-20" style = "display:block; clear:both; page-break-after:always;">
            <table style="border:1px solid black;" class="border-2 border-collapse border-emerald-400 ml-14">
                <tbody>
                    <tr>
                        <td style="border:1px solid black;" class="w-1/4 p-2 border-2 border-collapse border-emerald-400">
                            <p class="font-sans text-base"><strong>PROBLEM</strong></p>
                        </td>
                        <td style="border:1px solid black;" class="w-3/4 p-2 border-2 border-collapse border-emerald-400 ">
                            <p class="font-sans text-base">{{ $item->mutu_pdsa?->problem }}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="border:1px solid black;" class="w-1/4 p-2 border-2 border-collapse border-emerald-400 ">
                            <p class="font-sans text-base"><strong>STEP</strong></p>
                        </td>
                        <td style="border:1px solid black;" class="w-3/4 p-2 border-2 border-collapse border-emerald-400 ">
                            <p class="font-sans text-base">{{ $item->mutu_pdsa?->step }}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="border:1px solid black;" class="w-1/4 p-2 border-2 border-collapse border-emerald-400 ">
                            <p class="font-sans text-base"><strong>PLAN</strong></p>
                        </td>
                        <td style="border:1px solid black;" class="w-3/4 p-2 border-2 border-collapse border-emerald-400 ">
                            <p class="font-sans text-base">Saya berencana : </p>
                            <p class="font-sans text-base">{{ $item->mutu_pdsa?->plan_rencana }}
                            </p>
                            <p class="font-sans text-base">Saya berharap : </p>
                            <p class="font-sans text-base">{{ $item->mutu_pdsa?->plan_harapan }}
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="border:1px solid black;" class="w-1/4 p-2 border-2 border-collapse border-emerald-400 ">
                            <p class="font-sans text-base"><strong>DO</strong></p>
                        </td>
                        <td style="border:1px solid black;" class="w-3/4 p-2 border-2 border-collapse border-emerald-400 ">
                            <p class="font-sans text-base">{{ $item->mutu_pdsa?->do }}
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="border:1px solid black;" class="w-1/4 p-2 border-2 border-collapse border-emerald-400 ">
                            <p class="font-sans text-base"><strong>STUDY</strong></p>
                        </td>
                        <td style="border:1px solid black;" class="w-3/4 p-2 border-2 border-collapse border-emerald-400 ">
                            <p class="font-sans text-base">{{ $item->mutu_pdsa?->study }}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="border:1px solid black;" class="w-1/4 p-2 border-2 border-collapse border-emerald-400 ">
                            <p class="font-sans text-base"><strong>ACTION</strong></p>
                        </td>
                        <td style="border:1px solid black;" class="w-3/4 p-2 border-2 border-collapse border-emerald-400 ">
                            <p class="font-sans text-base">{{ $item->mutu_pdsa?->action }} </p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        @endforeach
    

</body>

</html>
