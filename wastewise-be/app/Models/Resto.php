<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resto extends Model
{
    protected $table = 'mresto';
    protected $primaryKey = 'KodeResto';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'KodeResto',
        'Nama',
        'Alamat',
        'Kategori',
        'JamTutup',
    ];

    protected $casts = [
        'JamTutup' => 'string',
    ];

    // Resto has many menus
    public function menu()
    {
        return $this->hasMany(Menu::class, 'KodeResto', 'KodeResto');
    }

    // Resto has many pesanan
    public function pesanan()
    {
        return $this->hasMany(Pesanan::class, 'KodeResto', 'KodeResto');
    }

    // Resto has many tambah stok transactions
    public function tambahStok()
    {
        return $this->hasMany(TambahStok::class, 'KodeResto', 'KodeResto');
    }

    // Resto has many keranjang entries
    public function keranjang()
    {
        return $this->hasMany(KeranjangPlg::class, 'KodeResto', 'KodeResto');
    }
}
