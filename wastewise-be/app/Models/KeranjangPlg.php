<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KeranjangPlg extends Model
{
    protected $table = 'keranjangplg';
    protected $primaryKey = 'NoAuto';
    public $timestamps = false;

    protected $fillable = [
        'UserPlg',
        'KodeResto',
        'KodeMenu',
        'Harga',
        'Jumlah',
        'NoAuto',
    ];

    protected $casts = [
        'Harga'  => 'integer',
        'Jumlah' => 'integer',
        'NoAuto' => 'integer',
    ];

    // Keranjang belongs to one pelanggan
    public function pelanggan()
    {
        return $this->belongsTo(Pelanggan::class, 'UserPlg', 'KodePlg');
    }

    // Keranjang belongs to one resto
    public function resto()
    {
        return $this->belongsTo(Resto::class, 'KodeResto', 'KodeResto');
    }

    // Keranjang belongs to one menu
    public function menu()
    {
        return $this->belongsTo(Menu::class, 'KodeMenu', 'KodeMenu');
    }
}
