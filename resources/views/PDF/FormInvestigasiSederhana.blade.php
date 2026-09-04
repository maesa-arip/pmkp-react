<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Form Investigasi Sederhana</title>
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
            font-family: "Times New Roman", Times, serif;
            font-size: 12pt;
            line-height: 1.4;
        }

        .letterhead {
            display: block;
            width: 100%;
            height: auto;
            margin-bottom: 12px;
        }

        .heading {
            margin-bottom: 14px;
            border-top: 2px solid #111827;
            border-bottom: 1px solid #111827;
            padding: 8px 0 10px;
            text-align: center;
            page-break-inside: avoid;
        }

        .heading p {
            margin: 0 0 3px;
            font-weight: 700;
        }

        .heading .main-title {
            margin-top: 8px;
            font-size: 13pt;
            text-transform: uppercase;
        }

        .meta {
            width: 100%;
            margin-bottom: 12px;
            border-collapse: collapse;
            page-break-inside: avoid;
        }

        .meta td {
            padding: 3px 4px;
            vertical-align: top;
        }

        .meta .label {
            width: 150px;
            font-weight: 700;
        }

        .meta .colon {
            width: 12px;
            font-weight: 700;
        }

        .section {
            margin-bottom: 12px;
            border-top: 1px solid #111827;
            page-break-inside: avoid;
        }

        .section-title {
            margin: 0;
            border-bottom: 1px solid #cbd5e1;
            background: #f6f8fa;
            padding: 6px 8px;
            font-size: 11pt;
            font-weight: 700;
            page-break-after: avoid;
        }

        .section-body {
            min-height: 38px;
            padding: 8px 8px 2px;
            white-space: pre-line;
            word-break: break-word;
            overflow-wrap: break-word;
        }

        .action-meta {
            width: 100%;
            border-collapse: collapse;
            margin-top: 6px;
            border-top: 1px solid #d1d5db;
            page-break-inside: avoid;
        }

        .action-meta td {
            width: 50%;
            border-right: 1px solid #d1d5db;
            padding: 6px 8px;
            vertical-align: top;
        }

        .action-meta td:last-child {
            border-right: 0;
        }

        .grid {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
            page-break-inside: auto;
        }

        .grid th,
        .grid td {
            border: 1px solid #1f2937;
            padding: 7px 8px;
            vertical-align: top;
            word-break: break-word;
            overflow-wrap: break-word;
        }

        .grid th {
            background: #f3f6f8;
            font-size: 11pt;
            text-align: left;
        }

        .grid thead {
            display: table-header-group;
        }

        .grid tr {
            page-break-inside: auto;
        }

        .w-half {
            width: 50%;
        }

        .w-quarter {
            width: 25%;
        }

        .sign-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            border-top: 1px solid #111827;
            border-left: 1px solid #111827;
            page-break-inside: avoid;
        }

        .sign-table th,
        .sign-table td {
            border-right: 1px solid #111827;
            border-bottom: 1px solid #111827;
            padding: 7px 8px;
            vertical-align: top;
        }

        .sign-table th {
            background: #f3f6f8;
            text-align: left;
        }

        .signature-space td {
            height: 70px;
        }
    </style>
</head>

<body>
    <img class="letterhead" src="data:image/jpeg;base64,{{ base64_encode(@file_get_contents(public_path('Cop.jpeg'))) }}">

    <header class="heading">
        <p>Unit Keselamatan Pasien</p>
        <p>RSUD Bali Mandara Provinsi Bali</p>
        <p class="main-title">Lembar Kerja Investigasi Sederhana</p>
        <p>(Untuk Bands Risiko Biru / Hijau)</p>
    </header>

    <table class="meta">
        <tbody>
            <tr>
                <td class="label">Jenis Insiden</td>
                <td class="colon">:</td>
                <td><strong>{{ $data->jenis_insiden->name }}</strong></td>
            </tr>
            <tr>
                <td class="label">Tanggal Insiden</td>
                <td class="colon">:</td>
                <td><strong>{{ $data->tanggal_insiden }}</strong></td>
            </tr>
        </tbody>
    </table>

    <section class="section">
        <h2 class="section-title">Penyebab Langsung Insiden</h2>
        <div class="section-body">{{ $data->ikp_hasil?->penyebab ?: '-' }}</div>
    </section>

    <section class="section">
        <h2 class="section-title">Penyebab yang Melatarbelakangi / Akar Masalah Insiden</h2>
        <div class="section-body">{{ $data->ikp_hasil?->akarmasalah ?: '-' }}</div>
    </section>

    <section class="section">
        <h2 class="section-title">Rekomendasi</h2>
        <div class="section-body">{{ $data->ikp_hasil?->rekomendasi ?: '-' }}</div>
        <table class="action-meta">
            <tbody>
                <tr>
                    <td><strong>Penanggung jawab:</strong> {{ $data->ikp_hasil?->pj1 ?: '-' }}</td>
                    <td><strong>Tanggal:</strong> {{ $data->ikp_hasil?->tanggal_rekomendasi ?: '-' }}</td>
                </tr>
            </tbody>
        </table>
    </section>

    <section class="section">
        <h2 class="section-title">Tindakan yang Akan Dilakukan</h2>
        <div class="section-body">{{ $data->ikp_hasil?->tindakan ?: '-' }}</div>
        <table class="action-meta">
            <tbody>
                <tr>
                    <td><strong>Penanggung jawab:</strong> {{ $data->ikp_hasil?->pj2 ?: '-' }}</td>
                    <td><strong>Tanggal:</strong> {{ $data->ikp_hasil?->tanggal_tindakan ?: '-' }}</td>
                </tr>
            </tbody>
        </table>
    </section>

    <table class="sign-table">
        <thead>
            <tr>
                <th colspan="2">Manager / Kepala Bagian / Kepala Unit</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="w-half"><strong>Nama:</strong> {{ $data->ikp_hasil?->nama ?: '-' }}</td>
                <td class="w-half"><strong>Tanggal mulai investigasi:</strong> {{ $data->ikp_hasil?->tanggal_mulai_investigasi ?: '-' }}</td>
            </tr>
            <tr class="signature-space">
                <td><strong>Tanda Tangan:</strong></td>
                <td><strong>Tanggal selesai investigasi:</strong> {{ $data->ikp_hasil?->tanggal_selesai_investigasi ?: $data->ikp_hasil?->tanggal_mulai_investigasi ?: '-' }}</td>
            </tr>
        </tbody>
    </table>
</body>

</html>
