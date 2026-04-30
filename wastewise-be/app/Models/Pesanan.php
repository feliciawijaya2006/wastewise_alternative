<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pesanan extends Model
{
    protected $table = 'pesanan';
    protected $primaryKey = 'NoPesanan';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'NoPesanan',
        'Tgl',
        'Plg',
        'KodeResto',
        'Status',
        'NoUrutPesan',
    ];

    protected $casts = [
        'Tgl'         => 'date',
        'Status'      => 'integer',
        'NoUrutPesan' => 'integer',
    ];

    // Pesanan belongs to one pelanggan
    public function pelanggan()
    {
        return $this->belongsTo(Pelanggan::class, 'Plg', 'KodePlg');
    }

    // Pesanan belongs to one resto
    public function resto()
    {
        return $this->belongsTo(Resto::class, 'KodeResto', 'KodeResto');
    }

    // Pesanan has many detail lines
    public function detail()
    {
        return $this->hasMany(PesananDet::class, 'NoPesanan', 'NoPesanan');
    }
}
