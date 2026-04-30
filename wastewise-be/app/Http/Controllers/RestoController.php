<?php

namespace App\Http\Controllers;

use App\Models\Resto;
use Illuminate\Http\Request;

class RestoController extends Controller
{
    /**
     * Return all restaurants.
     */
    public function index(Request $request)
    {
        $restos = Resto::select('KodeResto', 'Nama', 'Alamat', 'Kategori', 'JamTutup')
            ->orderBy('Nama')
            ->get();

        return response()->json([
            'data' => $restos,
        ]);
    }

    /**
     * Return a single restaurant with its menu.
     */
    public function show(string $kodeResto)
    {
        $resto = Resto::with(['menu' => function ($q) {
            $q->select('KodeMenu', 'NamaMenu', 'HargaMenu', 'Stok', 'Tipe', 'Deskripsi', 'KodeResto');
        }])
        ->where('KodeResto', $kodeResto)
        ->firstOrFail();

        return response()->json([
            'data' => $resto,
        ]);
    }
}
