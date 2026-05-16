<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('mresto', function (Blueprint $table) {
            $table->string('foto_url')->nullable()->after('JamTutup');
            $table->decimal('rating', 2, 1)->nullable()->default(0.0)->after('foto_url'); // e.g., 4.5
            $table->integer('waktu_tunggu')->nullable()->after('rating'); // e.g., 15 (minutes)
            $table->integer('diskon')->nullable()->after('waktu_tunggu'); // e.g., 20 (percent)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mresto', function (Blueprint $table) {
            $table->dropColumn(['foto_url', 'rating', 'waktu_tunggu', 'diskon']);
        });
    }
};
