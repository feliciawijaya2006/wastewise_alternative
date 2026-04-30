<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PesananDet extends Model
{
    protected $table = 'pesanandet';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'NoPesanan',
        'Kode',
        'Jumlah',
        'Harga',
    ];

    protected $casts = [
        'Jumlah' => 'integer',
        'Harga'  => 'integer',
    ];

    // Detail belongs to one pesanan
    public function pesanan()
    {
        return $this->belongsTo(Pesanan::class, 'NoPesanan', 'NoPesanan');
    }

    // Detail belongs to one menu (Kode = KodeMenu)
    public function menu()
    {
        return $this->belongsTo(Menu::class, 'Kode', 'KodeMenu');
    }
}
