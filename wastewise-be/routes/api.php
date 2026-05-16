<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\PesananController;
use App\Http\Controllers\RestoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ── Public routes (no token required) ────────────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// ── Protected routes (Bearer token required) ─────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', function (Request $request) {
        return response()->json([
            'status' => 'success',
            'data' => $request->user()
        ]);
    });

    // Profile
    Route::get('/me',          [AuthController::class, 'me']);
    Route::put('/me',          [AuthController::class, 'update']);
    Route::post('/me/photo',   [AuthController::class, 'uploadPhoto']); // ← NEW
    
    // Restaurants
    Route::get('/resto',        [RestoController::class, 'index']);   // all restos
    Route::get('/resto/{kode}', [RestoController::class, 'show']);    // single resto + menu

    // Tenants
    Route::get('/tenants', [\App\Http\Controllers\RestoController::class, 'index']);
    Route::get('/tenants/{id}', [\App\Http\Controllers\Api\RestoController::class, 'show']);
    Route::get('/tenants/{id}', [\App\Http\Controllers\MenuController::class, 'show']);

    // Menu
    Route::get('/menus/{id}', [\App\Http\Controllers\Api\RestoController::class, 'showMenu']);
    Route::get('/menus/{id}', [\App\Http\Controllers\MenuController::class, 'showMenu']);

    // Orders  (pelanggan only)
    Route::get('/pesanan',            [PesananController::class, 'index']);  // my orders
    Route::post('/pesanan',           [PesananController::class, 'store']);  // place order
    Route::get('/pesanan/{noPesanan}',[PesananController::class, 'show']);   // single order
    Route::post('/pesanan', [PesananController::class, 'store']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// For testing
Route::get('/truth-user', function (\Illuminate\Http\Request $request) {
    $rawToken = $request->bearerToken();
    $tokenRecord = \Laravel\Sanctum\PersonalAccessToken::findToken($rawToken);

    if (!$tokenRecord) {
        return response()->json(['error' => 'Token missing from database.']);
    }

    $user = $tokenRecord->tokenable;

    return response()->json([
        'token_belongs_to_id' => $tokenRecord->tokenable_id,
        'token_is_looking_for_model' => $tokenRecord->tokenable_type,
        'did_laravel_find_the_user' => $user ? 'YES' : 'NO',
        'user_data' => $user
    ]);
});