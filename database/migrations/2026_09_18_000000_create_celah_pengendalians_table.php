<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('celah_pengendalians', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Preserve existing vocabulary without changing historical risk records.
        if (Schema::hasColumn('risk_registers', 'celah_pengendalian')) {
            DB::table('risk_registers')->whereNotNull('celah_pengendalian')
                ->select('celah_pengendalian')->distinct()->orderBy('celah_pengendalian')
                ->get()->each(function ($row) {
                    $name = trim($row->celah_pengendalian);
                    if ($name !== '') {
                        DB::table('celah_pengendalians')->insertOrIgnore([
                            'name' => $name, 'is_active' => true,
                            'created_at' => now(), 'updated_at' => now(),
                        ]);
                    }
                });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('celah_pengendalians');
    }
};
