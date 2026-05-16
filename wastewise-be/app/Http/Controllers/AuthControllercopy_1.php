<?php

// INI FILE BACKUP. JANGAN DIHAPUS. KALAU ADA KENAPA-KENAPA ROLLBACK DISINI
namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Pelanggan;
use App\Models\Resto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthControllercopy_1 extends Controller
{
    /**
     * Register a new user as either 'pelanggan' or 'resto'.
     */
    public function register(Request $request)
    {
        // 1. Validate exactly what auth.js sends
        $request->validate([
            'name'     => 'required|string|max:255',
            'phone'    => 'required|string|max:15|unique:users,phone',
            'email'    => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        // 2. Create the user using the default table
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'phone'    => $request->phone,
            'password' => Hash::make($request->password),
            'role'     => 'pelanggan', // <--- Automatically set here
        ]);

        // 3. Issue Token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message'      => 'Registration successful.',
            'access_token' => $token, // auth.js looks for data.access_token
            'token_type'   => 'Bearer',
            'user'         => [
                'name'  => $user->name,
                'role'  => $user->role,
            ],
        ], 201);
    }

    public function login(Request $request)
    {
        // 1. Users login with their phone number
        $request->validate([
            'phone'    => 'required|string',
            'password' => 'required|string',
        ]);

        // 2. Find the standard User by phone
        $user = User::where('phone', $request->phone)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'phone' => ['Nomor handphone atau kata sandi salah.'],
            ]);
        }

        // 3. Issue Token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message'      => 'Login successful.',
            'token'        => $token, // auth.js looks for data.token here
            'token_type'   => 'Bearer',
            'user'         => [
                'name'  => $user->name,
                'role'  => $user->role,
            ],
        ]);
    }
}