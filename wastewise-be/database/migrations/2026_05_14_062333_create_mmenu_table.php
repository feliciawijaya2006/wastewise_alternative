<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('mmenu', function (Blueprint $table) {
        $table->string('KodeMenu', 5)->primary();
        $table->string('KodeResto', 5);
        $table->string('NamaMenu');
        $table->integer('HargaMenu');
        $table->integer('Stok')->default(99);
        $table->string('foto_url')->nullable()->after('Stok');
        $table->timestamps();

        $table->foreign('KodeResto')->references('KodeResto')->on('mresto')->onDelete('cascade');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
{
    Schema::table('mmenu', function (Blueprint $table) {
        $table->dropColumn('foto_url');
    });
}
};
