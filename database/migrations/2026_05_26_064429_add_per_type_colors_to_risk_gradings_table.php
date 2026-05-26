<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private array $columns = [
        'warna_klinis',
        'warna_nonklinis',
        'warna_nonklinis_pergub',
        'warna_ikp',
        'warna_bpkp',
    ];

    public function up()
    {
        Schema::table('risk_gradings', function (Blueprint $table) {
            foreach ($this->columns as $column) {
                if (!Schema::hasColumn('risk_gradings', $column)) {
                    $table->string($column, 20)->nullable()->after('warna');
                }
            }
        });

        foreach ($this->columns as $column) {
            DB::table('risk_gradings')
                ->whereNull($column)
                ->update([$column => DB::raw('warna')]);
        }
    }

    public function down()
    {
        Schema::table('risk_gradings', function (Blueprint $table) {
            foreach ($this->columns as $column) {
                if (Schema::hasColumn('risk_gradings', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
