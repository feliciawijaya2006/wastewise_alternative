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
    Schema::create('mresto', function (Blueprint $table) {
        $table->string('KodeResto', 5)->primary();
        $table->string('Nama');
        $table->string('Alamat')->nullable();
        $table->string('JamTutup')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mresto');
    }
};
