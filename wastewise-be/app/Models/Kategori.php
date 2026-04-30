<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kategori extends Model
{
    protected $table = 'mkategori';
    protected $primaryKey = 'Kode';
    public $timestamps = false;

    protected $fillable = [
        'Kode',
        'Kategori',
    ];
}
