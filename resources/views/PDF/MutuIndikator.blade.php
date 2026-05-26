<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Mutu Indikator</title>
    <style>
        @page {
            margin: 10mm 10mm 10mm 20mm;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            color: #111827;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 8.8pt;
            line-height: 1.32;
        }

        .letterhead {
            display: block;
            width: 100%;
            height: auto;
            margin-bottom: 8px;
        }

        .form-code {
            margin: 0 0 8px;
            font-family: "Times New Roman", Times, serif;
            font-size: 10pt;
            font-weight: 700;
            text-align: right;
        }

        .title {
            margin: 0;
            font-family: "Times New Roman", Times, serif;
            font-size: 12pt;
            font-weight: 700;
            line-height: 1.3;
            text-align: center;
            text-transform: uppercase;
        }

        .period {
            margin: 12px 0 8px;
            font-family: "Times New Roman", Times, serif;
            font-size: 10.5pt;
            font-weight: 700;
            text-transform: uppercase;
        }

        table {
            width: 100%;
            table-layout: fixed;
            border-collapse: collapse;
        }

        thead {
            display: table-header-group;
        }

        tfoot {
            display: table-footer-group;
        }

        th,
        td {
            padding: 5px 6px;
            vertical-align: top;
            word-break: break-word;
            overflow-wrap: break-word;
        }

        .indicator-table th,
        .indicator-table > tbody > tr > td {
            border: 1px solid #111827;
        }

        th {
            background: #e6f4f1;
            color: #0f3f3a;
            font-size: 8.5pt;
            font-weight: 700;
            text-align: center;
            text-transform: uppercase;
        }

        .indicator-group {
            page-break-inside: avoid;
        }

        .col-no {
            width: 5%;
            text-align: center;
            vertical-align: middle;
        }

        .col-indicator {
            width: 29%;
        }

        .col-nd {
            width: 4%;
            color: #0f3f3a;
            font-weight: 700;
            text-align: center;
            vertical-align: middle;
        }

        .col-measure-text {
            width: 37%;
        }

        .col-score {
            width: 8%;
            text-align: center;
            vertical-align: middle;
            white-space: nowrap;
        }

        .col-achievement,
        .col-standard {
            width: 8.5%;
            text-align: center;
            vertical-align: middle;
            white-space: nowrap;
        }

        .number {
            display: inline-block;
            min-width: 16px;
            font-weight: 700;
            text-align: center;
        }

        .signature {
            margin-top: 18px;
            page-break-inside: avoid;
        }

        .signature td {
            height: 28px;
            border: 0;
            padding: 4px 8px;
            vertical-align: top;
        }

        .signature .sign-space td {
            height: 86px;
        }

        .muted {
            color: #4b5563;
            font-size: 8pt;
        }

        .printed-at {
            text-align: right;
        }

        .empty-state {
            margin: 16px 0;
            padding: 14px;
            border: 1px solid #111827;
            color: #4b5563;
            font-weight: 700;
            text-align: center;
        }

        .page-break {
            page-break-after: always;
        }
    </style>
</head>

<body>
    @php
        $periodDate = $startDate ?: optional($first)->tanggal_mutu;
        $periodText = $periodDate ? \Carbon\Carbon::parse($periodDate)->isoFormat('MMMM Y') : '-';
        $locationName = optional(optional($first)->mutu_indikator)->location?->name ?: '-';
    @endphp

    <img class="letterhead" src="data:image/jpeg;base64,{{ base64_encode(@file_get_contents(public_path('Cop.jpeg'))) }}">

    <p class="form-code">Form......../KPMKP/2018</p>
    <h1 class="title">Pengumpulan Data Indikator Mutu dan Keselamatan Pasien<br>RSUD Bali Mandara Provinsi Bali</h1>
    <p class="period">Bulan: {{ $periodText }}</p>

    @forelse ($data->chunk(8) as $chunk)
        <table class="indicator-table">
            <colgroup>
                <col class="col-no">
                <col class="col-indicator">
                <col class="col-nd">
                <col class="col-measure-text">
                <col class="col-score">
                <col class="col-achievement">
                <col class="col-standard">
            </colgroup>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Indikator</th>
                    <th>N/D</th>
                    <th>Numerator / Denominator</th>
                    <th>Hasil</th>
                    <th>Capaian</th>
                    <th>Standar</th>
                </tr>
            </thead>
            @foreach ($chunk as $item)
                <tbody class="indicator-group">
                    <tr>
                        <td class="col-no" rowspan="2"><span class="number">{{ $loop->parent->index * 8 + $loop->index + 1 }}</span></td>
                        <td class="col-indicator" rowspan="2">{{ $item->mutu_indikator->indikator_fitur4->name }}</td>
                        <td class="col-nd">N</td>
                        <td class="col-measure-text">{{ $item->mutu_indikator->num_name }}</td>
                        <td class="col-score">{{ $item->num }}</td>
                        <td class="col-achievement" rowspan="2">{{ $item->capaian }}{{ $item->mutu_indikator->penyebut }}</td>
                        <td class="col-standard" rowspan="2">
                            @if ($item->mutu_indikator->operator != '=')
                                {{ $item->mutu_indikator->operator }}
                            @endif
                            {{ $item->mutu_indikator->standar }}{{ $item->mutu_indikator->penyebut }}
                        </td>
                    </tr>
                    <tr>
                        <td class="col-nd">D</td>
                        <td class="col-measure-text">{{ $item->mutu_indikator->denum_name }}</td>
                        <td class="col-score">{{ $item->denum }}</td>
                    </tr>
                </tbody>
            @endforeach
        </table>

        @if (!$loop->last)
            <div class="page-break"></div>
        @endif
    @empty
        <div class="empty-state">Tidak ada data indikator mutu untuk bulan ini.</div>
    @endforelse

    <table class="signature">
        <tbody>
            <tr>
                <td></td>
                <td class="printed-at muted">Printed at: {{ now()->timezone(config('app.timezone'))->format('d/m/Y H:i') }}</td>
            </tr>
            <tr>
                <td>Verifikasi</td>
                <td>Disusun Oleh:</td>
            </tr>
            <tr class="sign-space">
                <td>Komite Mutu</td>
                <td>Kepala {{ $locationName }}</td>
            </tr>
            <tr>
                <td>Tanggal</td>
                <td></td>
            </tr>
        </tbody>
    </table>
</body>

</html>
