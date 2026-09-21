<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('risk_registers', 'location_id')) {
            return;
        }
        // The non-clinical form has always offered a unit; it had nowhere to be stored.
        Schema::table('risk_registers', function (Blueprint $table) {
            $table->foreignId('location_id')->nullable()->after('pic_id')->constrained('locations')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('risk_registers', function (Blueprint $table) {
            $table->dropConstrainedForeignId('location_id');
        });
    }
};
