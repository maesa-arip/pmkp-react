<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>PDSA</title>
    <style>
        @page {
            margin: 1cm 1cm 1cm 2cm;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            color: #1f2933;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 11pt;
            line-height: 1.45;
        }

        .document {
            width: 100%;
        }

        .report {
            page-break-after: always;
        }

        .report:last-child {
            page-break-after: auto;
        }

        .header {
            margin-bottom: 14px;
            padding-bottom: 8px;
            border-bottom: 2px solid #0f766e;
            page-break-inside: avoid;
        }

        .unit {
            margin: 0 0 5px;
            color: #111827;
            font-size: 16pt;
            font-weight: 700;
            text-transform: uppercase;
        }

        .title {
            margin: 0;
            color: #0f766e;
            font-size: 12pt;
            font-weight: 700;
        }

        .summary {
            margin: 0 0 12px;
            padding: 8px 10px;
            background: #f3faf8;
            border-left: 4px solid #0f766e;
            page-break-inside: avoid;
        }

        .summary-label {
            display: inline;
            margin: 0;
            color: #111827;
            font-size: 11pt;
            font-weight: 700;
        }

        .summary-text {
            display: inline;
            margin: 0;
            white-space: pre-line;
            word-break: break-word;
            overflow-wrap: break-word;
        }

        .pdsa-section {
            margin-bottom: 10px;
            border: 1px solid #cbd5e1;
            page-break-inside: auto;
        }

        .pdsa-label {
            padding: 7px 10px;
            background: #e6f4f1;
            border-bottom: 1px solid #cbd5e1;
            color: #0f3f3a;
            font-size: 10pt;
            font-weight: 700;
            text-transform: uppercase;
            page-break-inside: avoid;
        }

        .pdsa-content {
            padding: 9px 10px;
            min-height: 34px;
            white-space: pre-line;
            word-break: break-word;
            overflow-wrap: break-word;
        }

        .plan-label {
            margin: 0 0 3px;
            font-weight: 700;
        }

        .plan-text {
            margin: 0 0 8px;
        }

        .plan-text:last-child {
            margin-bottom: 0;
        }
    </style>
</head>

<body>
    @php
        $start = $startDate ? \Carbon\Carbon::parse($startDate) : null;
        $end = $endDate ? \Carbon\Carbon::parse($endDate) : null;
        $year = $start ? $start->format('Y') : date('Y');
        $tw = '?';

        if ($start && $end && $start->month == 1 && $end->month == 3) {
            $tw = 'I';
        }

        if ($start && $end && $start->month == 4 && $end->month == 6) {
            $tw = 'II';
        }

        if ($start && $end && $start->month == 7 && $end->month == 9) {
            $tw = 'III';
        }

        if ($start && $end && $start->month == 10 && $end->month == 12) {
            $tw = 'IV';
        }
    @endphp

    <div class="document">
        @foreach ($data as $item)
            <section class="report">
                <header class="header">
                    <h1 class="unit">{{ $item->mutu_indikator->location?->name }}</h1>
                    <p class="title">PDSA TW {{ $tw }} {{ $item->mutu_indikator->location?->name }} {{ $year }}</p>
                </header>

                <div class="summary">
                    <p><span class="summary-label">{{ $loop->index + 1 }}. PDSA</span> <span class="summary-text">{{ $item->mutu_pdsa?->problem ?: '-' }}</span></p>
                </div>

                <div class="pdsa-section">
                    <div class="pdsa-label">Problem</div>
                    <div class="pdsa-content">{{ $item->mutu_pdsa?->problem ?: '-' }}</div>
                </div>
                <div class="pdsa-section">
                    <div class="pdsa-label">Step</div>
                    <div class="pdsa-content">{{ $item->mutu_pdsa?->step ?: '-' }}</div>
                </div>
                <div class="pdsa-section">
                    <div class="pdsa-label">Plan</div>
                    <div class="pdsa-content">
                        <p class="plan-label">Saya berencana:</p>
                        <p class="plan-text">{{ $item->mutu_pdsa?->plan_rencana ?: '-' }}</p>
                        <p class="plan-label">Saya berharap:</p>
                        <p class="plan-text">{{ $item->mutu_pdsa?->plan_harapan ?: '-' }}</p>
                    </div>
                </div>
                <div class="pdsa-section">
                    <div class="pdsa-label">Do</div>
                    <div class="pdsa-content">{{ $item->mutu_pdsa?->do ?: '-' }}</div>
                </div>
                <div class="pdsa-section">
                    <div class="pdsa-label">Study</div>
                    <div class="pdsa-content">{{ $item->mutu_pdsa?->study ?: '-' }}</div>
                </div>
                <div class="pdsa-section">
                    <div class="pdsa-label">Action</div>
                    <div class="pdsa-content">{{ $item->mutu_pdsa?->action ?: '-' }}</div>
                </div>
            </section>
        @endforeach
    </div>
</body>

</html>
