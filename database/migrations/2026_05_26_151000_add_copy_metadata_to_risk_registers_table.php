<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        $copyMetadataAfterColumn = Schema::hasColumn('risk_registers', 'pihak_terkena')
            ? 'pihak_terkena'
            : 'target_waktu';

        Schema::table('risk_registers', function (Blueprint $table) use ($copyMetadataAfterColumn) {
            if (!Schema::hasColumn('risk_registers', 'copied_from_risk_register_id')) {
                $table->foreignId('copied_from_risk_register_id')
                    ->nullable()
                    ->after($copyMetadataAfterColumn)
                    ->constrained('risk_registers')
                    ->nullOnDelete();
            }

            if (!Schema::hasColumn('risk_registers', 'copied_from_year')) {
                $table->unsignedSmallInteger('copied_from_year')
                    ->nullable()
                    ->after('copied_from_risk_register_id');
            }

            if (!Schema::hasColumn('risk_registers', 'copied_to_year')) {
                $table->unsignedSmallInteger('copied_to_year')
                    ->nullable()
                    ->after('copied_from_year');
            }

            if (!Schema::hasColumn('risk_registers', 'copied_by_user_id')) {
                $table->foreignId('copied_by_user_id')
                    ->nullable()
                    ->after('copied_to_year')
                    ->constrained('users')
                    ->nullOnDelete();
            }

            if (!Schema::hasColumn('risk_registers', 'copied_at')) {
                $table->timestamp('copied_at')
                    ->nullable()
                    ->after('copied_by_user_id');
            }
        });

        Schema::table('risk_registers', function (Blueprint $table) {
            $table->unique(
                ['copied_from_risk_register_id', 'copied_to_year'],
                'risk_registers_copy_source_target_unique'
            );
        });
    }

    public function down()
    {
        Schema::table('risk_registers', function (Blueprint $table) {
            $table->dropUnique('risk_registers_copy_source_target_unique');
        });

        Schema::table('risk_registers', function (Blueprint $table) {
            if (Schema::hasColumn('risk_registers', 'copied_from_risk_register_id')) {
                $table->dropConstrainedForeignId('copied_from_risk_register_id');
            }

            if (Schema::hasColumn('risk_registers', 'copied_by_user_id')) {
                $table->dropConstrainedForeignId('copied_by_user_id');
            }

            if (Schema::hasColumn('risk_registers', 'copied_from_year')) {
                $table->dropColumn('copied_from_year');
            }

            if (Schema::hasColumn('risk_registers', 'copied_to_year')) {
                $table->dropColumn('copied_to_year');
            }

            if (Schema::hasColumn('risk_registers', 'copied_at')) {
                $table->dropColumn('copied_at');
            }
        });
    }
};
