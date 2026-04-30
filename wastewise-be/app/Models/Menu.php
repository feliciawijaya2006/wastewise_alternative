<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    protected $table = 'mmenu';
    protected $primaryKey = 'KodeMenu';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'KodeMenu',
        'NamaMenu',
        'Stok',
        'HargaMenu',
        'KodeResto',
        'Tipe',
        'Random',
        'Deskripsi',
    ];

    protected $casts = [
        'Stok'      => 'integer',
        'HargaMenu' => 'integer',
        'Random'    => 'boolean',
        'Tipe'      => 'string',
    ];

    // Menu belongs to one resto
    public function resto()
    {
        return $this->belongsTo(Resto::class, 'KodeResto', 'KodeResto');
    }

    // Menu has many keranjang entries
    public function keranjang()
    {
        return $this->hasMany(KeranjangPlg::class, 'KodeMenu', 'KodeMenu');
    }

    // Menu has many pesanan detail lines
    public function pesananDet()
    {
        return $this->hasMany(PesananDet::class, 'Kode', 'KodeMenu');
    }

    // Menu has many tambah stok detail lines
    public function tambahStokDet()
    {
        return $this->hasMany(TambahStokDet::class, 'KodeMenu', 'KodeMenu');
    }
}
