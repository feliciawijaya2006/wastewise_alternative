<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // CRITICAL: Added DB Facade


class MenuController extends Controller
{
    public function show($id)
    {
        // 1. Get the Tenant Detail
        $tenant = DB::table('mresto')->where('KodeResto', $id)->first();
        
        if (!$tenant) {
            return response()->json(['status' => 'error', 'message' => 'Tenant tidak ditemukan'], 404);
        }

        // 2. Get all Menus belonging to this Tenant
        // Pulling exactly what exists in your database snapshot
        $menus = DB::table('mmenu')
            ->where('KodeResto', $id)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'tenant' => $tenant,
                'menus' => $menus
            ]
        ]);
    }

    public function showMenu($id)
    {
        // Get a specific menu item and join it with the tenant name
        $menu = DB::table('mmenu')
            ->join('mresto', 'mmenu.KodeResto', '=', 'mresto.KodeResto')
            ->where('mmenu.KodeMenu', $id)
            ->select('mmenu.*', 'mresto.Nama as NamaResto') 
            ->first();

        if (!$menu) {
            return response()->json(['status' => 'error', 'message' => 'Menu tidak ditemukan'], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $menu
        ]);
    }
}