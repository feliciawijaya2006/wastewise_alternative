<?php

namespace App\Http\Controllers;

use App\Models\Resto;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class RestoController extends Controller
{
    /**
     * Return all restaurants.
     */
    public function index()
{
    $tenants = DB::table('mresto')
        ->select('KodeResto', 'Nama', 'Alamat', 'JamTutup', 'foto_url', 'rating', 'waktu_tunggu', 'diskon')
        ->get()
        ->map(function ($tenant) {
            // Fix relative image paths on the fly
            if ($tenant->foto_url && !str_starts_with($tenant->foto_url, 'http')) {
                $tenant->foto_url = asset('storage/' . $tenant->foto_url);
            }
            return $tenant;
        });

    return response()->json([
        'status' => 'success',
        'data' => $tenants
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
