<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TambahStok extends Model
{
    protected $table = 'tambahstok';
    protected $primaryKey = 'NoTambah';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'NoTambah',
        'Tgl',
        'Opr',
        'KodeResto',
    ];

    protected $casts = [
        'Tgl' => 'date',
    ];

    // TambahStok belongs to one resto
    public function resto()
    {
        return $this->belongsTo(Resto::class, 'KodeResto', 'KodeResto');
    }

    // TambahStok has many detail lines
    public function detail()
    {
        return $this->hasMany(TambahStokDet::class, 'NoTambah', 'NoTambah');
    }
}
