<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    /**
     * Return a single menu's details by its KodeMenu.
     */
    public function show($kodeMenu)
    {
        $menu = Menu::with('resto:KodeResto,Nama,Alamat,JamTutup')
            ->where('KodeMenu', $kodeMenu)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'message' => 'Menu retrieved successfully.',
            'data'    => $menu
        ]);
    }
}
