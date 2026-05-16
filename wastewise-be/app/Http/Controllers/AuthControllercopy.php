<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthControllercopy extends Controller
{
    // ──────────────────────────────────────────────
    // POST /api/register  — public
    // Payload:  { name, phone, email, password, password_confirmation }
    // Returns:  { access_token, user }  → auth.js checks data.access_token
    // ──────────────────────────────────────────────
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'phone'    => 'required|string|max:15|unique:users,phone',
            'email'    => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'phone'    => $request->phone,
            'password' => Hash::make($request->password),
            'role'     => 'pelanggan',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message'      => 'Registration successful.',
            'access_token' => $token,   // ← auth.js reads data.access_token
            'token_type'   => 'Bearer',
            'user'         => [
                'name'  => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role'  => $user->role,
            ],
        ], 201);
    }

    // ──────────────────────────────────────────────
    // POST /api/login  — public
    // Payload:  { phone, password }
    // Returns:  { token, user }  → auth.js checks data.token
    // Uses ValidationException so wrong credentials return 422
    // which auth.js handles in its status===422 block. ✓
    // ──────────────────────────────────────────────
    public function login(Request $request)
    {
        $request->validate([
            'phone'    => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('phone', $request->phone)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'phone' => ['Nomor handphone atau kata sandi salah.'],
            ]);
        }

        // Revoke previous tokens so only one active session per user
        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message'    => 'Login successful.',
            'token'      => $token,     // ← auth.js reads data.token
            'token_type' => 'Bearer',
            'user'       => [
                'name'  => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role'  => $user->role,
            ],
        ]);
    }

    // ──────────────────────────────────────────────
    // POST /api/logout  — protected (Sanctum)
    // Revokes ONLY the current token.
    // Called by logout() in app.js.
    // ──────────────────────────────────────────────
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logout successful.']);
    }

    // ──────────────────────────────────────────────
    // GET /api/me  — protected (Sanctum)
    // Returns the authenticated user's full record.
    // Called by: fetchProfile() and fetchUserProfile() in app.js
    //
    // ✅ FIX: Method was MISSING → every call returned 500.
    // ──────────────────────────────────────────────
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    // ──────────────────────────────────────────────
    // PUT /api/me  — protected (Sanctum)
    // Updates name, email, address of the current user.
    // Called by: updateProfile() in app.js → saveProfile() in profile.html
    //
    // ✅ FIX: Method was MISSING → profile save would have returned 500.
    // ──────────────────────────────────────────────
    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name'    => 'required|string|min:3|max:255',
            'email'   => 'required|email|unique:users,email,' . $user->id,
            'address' => 'nullable|string|max:255',
        ]);

        $user->update([
            'name'    => $request->name,
            'email'   => $request->email,
            'address' => $request->address ?? $user->address,
        ]);

        return response()->json($user->fresh());
    }
}