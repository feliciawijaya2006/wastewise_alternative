<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Muser extends Model
{
    use HasApiTokens;

    protected $table = 'muser';
    protected $primaryKey = 'Nama';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'Nama',
        'Password',
        'Restoran',
        'KodeRestoPlg',
        'Login',
    ];

    protected $hidden = [
        'Password',
    ];

    protected $casts = [
        'Restoran' => 'boolean',
        'Login'    => 'boolean',
    ];

    // User (operator) belongs to a resto
    public function resto()
    {
        return $this->belongsTo(Resto::class, 'KodeRestoPlg', 'KodeResto');
    }
}
