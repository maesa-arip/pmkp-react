<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('risk_registers', function (Blueprint $table) {
            if (!Schema::hasColumn('risk_registers', 'copy_type')) {
                $table->string('copy_type', 20)->nullable()->after('copied_at')->index();
            }

            if (!Schema::hasColumn('risk_registers', 'copied_to_pic_id')) {
                $table->foreignId('copied_to_pic_id')
                    ->nullable()
                    ->after('copy_type')
                    ->constrained('pics')
                    ->nullOnDelete();
            }

            if (!Schema::hasColumn('risk_registers', 'copied_to_user_id')) {
                $table->foreignId('copied_to_user_id')
                    ->nullable()
                    ->after('copied_to_pic_id')
                    ->constrained('users')
                    ->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('risk_registers', function (Blueprint $table) {
            if (Schema::hasColumn('risk_registers', 'copied_to_user_id')) {
                $table->dropConstrainedForeignId('copied_to_user_id');
            }

            if (Schema::hasColumn('risk_registers', 'copied_to_pic_id')) {
                $table->dropConstrainedForeignId('copied_to_pic_id');
            }

            if (Schema::hasColumn('risk_registers', 'copy_type')) {
                $table->dropColumn('copy_type');
            }
        });
    }
};
