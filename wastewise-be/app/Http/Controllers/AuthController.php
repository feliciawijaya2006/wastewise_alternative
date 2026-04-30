<?php

namespace App\Http\Controllers;

use App\Models\Muser;
use App\Models\Pelanggan;
use App\Models\Resto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user as either 'pelanggan' or 'resto'.
     */
    public function register(Request $request)
    {
        $request->validate([
            'role'     => 'required|in:pelanggan,resto',
            'username' => 'required|string|max:25|unique:muser,Nama',
            'Password' => 'required|string|min:6',
        ]);

        if ($request->role === 'pelanggan') {
            $request->validate([
                'KodePlg' => 'required|string|max:5|unique:mpelanggan,KodePlg',
                'Nama'    => 'required|string|max:50',
                'Email'   => 'nullable|email|max:50',
                'NoTelp'  => 'nullable|string|max:14',
            ]);

            $pelanggan = Pelanggan::create([
                'KodePlg' => $request->KodePlg,
                'Nama'    => $request->Nama,
                'Email'   => $request->Email,
                'NoTelp'  => $request->NoTelp,
            ]);

            $user = Muser::create([
                'Nama'         => $request->username,
                'Password'     => Hash::make($request->Password),
                'Restoran'     => false,
                'KodeRestoPlg' => $pelanggan->KodePlg,
                'Login'        => false,
            ]);

        } else {
            // role = resto
            $request->validate([
                'KodeResto' => 'required|string|max:5|unique:mresto,KodeResto',
                'NamaResto' => 'required|string|max:100',
                'Alamat'    => 'nullable|string|max:255',
                'Kategori'  => 'nullable|string|max:255',
                'JamTutup'  => 'nullable|date_format:H:i:s',
            ]);

            $resto = Resto::create([
                'KodeResto' => $request->KodeResto,
                'Nama'      => $request->NamaResto,
                'Alamat'    => $request->Alamat,
                'Kategori'  => $request->Kategori,
                'JamTutup'  => $request->JamTutup,
            ]);

            $user = Muser::create([
                'Nama'         => $request->username,
                'Password'     => Hash::make($request->Password),
                'Restoran'     => true,
                'KodeRestoPlg' => $resto->KodeResto,
                'Login'        => false,
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message'      => 'Registration successful.',
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => [
                'username'     => $user->Nama,
                'role'         => $user->Restoran ? 'resto' : 'pelanggan',
                'KodeRestoPlg' => $user->KodeRestoPlg,
            ],
        ], 201);
    }

    /**
     * Login and issue a Sanctum token.
     */
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'Password' => 'required|string',
        ]);

        $user = Muser::where('Nama', $request->username)->first();

        if (! $user || ! Hash::check($request->Password, $user->Password)) {
            throw ValidationException::withMessages([
                'username' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user->update(['Login' => true]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message'      => 'Login successful.',
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => [
                'username'     => $user->Nama,
                'role'         => $user->Restoran ? 'resto' : 'pelanggan',
                'KodeRestoPlg' => $user->KodeRestoPlg,
            ],
        ]);
    }

    /**
     * Logout and revoke the current token.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        $request->user()->update(['Login' => false]);

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }

    /**
     * Return the authenticated user info.
     */
    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'username'     => $user->Nama,
            'role'         => $user->Restoran ? 'resto' : 'pelanggan',
            'KodeRestoPlg' => $user->KodeRestoPlg,
        ]);
    }
}
