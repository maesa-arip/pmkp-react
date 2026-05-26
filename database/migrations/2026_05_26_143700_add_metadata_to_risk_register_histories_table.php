<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('risk_register_histories', function (Blueprint $table) {
            if (!Schema::hasColumn('risk_register_histories', 'user_id')) {
                $table->foreignId('user_id')
                    ->nullable()
                    ->after('currently_id')
                    ->constrained()
                    ->nullOnDelete();
            }

            if (!Schema::hasColumn('risk_register_histories', 'event_type')) {
                $table->string('event_type', 50)
                    ->nullable()
                    ->after('user_id')
                    ->index();
            }

            if (!Schema::hasColumn('risk_register_histories', 'snapshot')) {
                $table->json('snapshot')
                    ->nullable()
                    ->after('event_type');
            }
        });

        DB::table('risk_register_histories')
            ->whereNull('event_type')
            ->update(['event_type' => 'status_changed']);

        DB::statement("
            UPDATE risk_register_histories h
            JOIN (
                SELECT MIN(id) AS id
                FROM risk_register_histories
                GROUP BY risk_register_id
            ) first_histories ON first_histories.id = h.id
            SET h.event_type = 'created'
        ");
    }

    public function down(): void
    {
        Schema::table('risk_register_histories', function (Blueprint $table) {
            if (Schema::hasColumn('risk_register_histories', 'user_id')) {
                $table->dropConstrainedForeignId('user_id');
            }

            if (Schema::hasColumn('risk_register_histories', 'event_type')) {
                $table->dropIndex(['event_type']);
                $table->dropColumn('event_type');
            }

            if (Schema::hasColumn('risk_register_histories', 'snapshot')) {
                $table->dropColumn('snapshot');
            }
        });
    }
};
