<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'pic_id')) {
                $table->foreignId('pic_id')
                    ->nullable()
                    ->after('email')
                    ->constrained('pics')
                    ->nullOnDelete();
            }
        });
    }

    public function down()
    {
        // Intentionally left non-destructive: some environments already had users.pic_id
        // before this safety migration was introduced.
    }
};
