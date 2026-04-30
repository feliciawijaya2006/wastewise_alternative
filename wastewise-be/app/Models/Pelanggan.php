<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pelanggan extends Model
{
    protected $table = 'mpelanggan';
    protected $primaryKey = 'KodePlg';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'KodePlg',
        'Nama',
        'Email',
        'NoTelp',
    ];

    // One pelanggan can have many pesanan
    public function pesanan()
    {
        return $this->hasMany(Pesanan::class, 'Plg', 'KodePlg');
    }

    // One pelanggan can have many keranjang items
    public function keranjang()
    {
        return $this->hasMany(KeranjangPlg::class, 'UserPlg', 'KodePlg');
    }
}
