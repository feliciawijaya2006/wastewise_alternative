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
    Schema::create('pesanan', function (Blueprint $table) {
        $table->string('NoPesanan', 13)->primary();
        $table->date('Tgl');
        $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // ← The vital link to your users table
        $table->string('KodeResto', 5);
        $table->integer('Status')->default(0); // 0 = pending, 1 = success
        $table->integer('NoUrutPesan');
        $table->timestamps();

        $table->foreign('KodeResto')->references('KodeResto')->on('mresto')->onDelete('cascade');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pesanan');
    }
};
