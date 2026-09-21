<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('indikator_kinerjas', function (Blueprint $t) {
        $t->dropUnique(['lineage_id']);
        $t->unique(['periode_kinerja_id', 'lineage_id'], 'indikator_kinerja_period_lineage');
        });
    }

    public function down(): void
    {
        Schema::table('indikator_kinerjas', fn (Blueprint $t) => $t->dropUnique('indikator_kinerja_period_lineage'));
    }
};
