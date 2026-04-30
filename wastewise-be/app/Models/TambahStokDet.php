<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TambahStokDet extends Model
{
    protected $table = 'tambahstokdet';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'NoTambah',
        'KodeMenu',
        'Jumlah',
    ];

    protected $casts = [
        'Jumlah' => 'integer',
    ];

    // Detail belongs to one tambah stok header
    public function tambahStok()
    {
        return $this->belongsTo(TambahStok::class, 'NoTambah', 'NoTambah');
    }

    // Detail belongs to one menu
    public function menu()
    {
        return $this->belongsTo(Menu::class, 'KodeMenu', 'KodeMenu');
    }
}
