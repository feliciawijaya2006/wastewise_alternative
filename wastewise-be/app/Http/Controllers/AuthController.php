<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // ──────────────────────────────────────────────
    // POST /api/register  — public
    // Payload:  { name, phone, email, password, password_confirmation }
    // Returns:  { access_token, user }
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
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => $this->formatUser($user),
        ], 201);
    }

    // ──────────────────────────────────────────────
    // POST /api/login  — public
    // Payload:  { phone, password }
    // Returns:  { token, user }
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

        // Revoke previous tokens → one active session per user
        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message'    => 'Login successful.',
            'token'      => $token,
            'token_type' => 'Bearer',
            'user'       => $this->formatUser($user),
        ]);
    }

    // ──────────────────────────────────────────────
    // POST /api/logout  — protected (Sanctum)
    // ──────────────────────────────────────────────
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logout successful.']);
    }

    // ──────────────────────────────────────────────
    // GET /api/me  — protected (Sanctum)
    // Returns full user record including photo_url as a full URL.
    // ──────────────────────────────────────────────
    public function me(Request $request)
    {
        return response()->json($this->formatUser($request->user()));
    }

    // ──────────────────────────────────────────────
    // PUT /api/me  — protected (Sanctum)
    // Accepts JSON: { name, email, address }
    // Phone is intentionally NOT updatable here.
    // ──────────────────────────────────────────────
    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name'    => 'required|string|min:3|max:255',
            'email'   => 'required|email|unique:users,email,' . $user->id,
            'address' => 'nullable|string|max:500',
        ]);

        $user->update([
            'name'    => $request->name,
            'email'   => $request->email,
            'address' => $request->address ?? $user->address,
        ]);

        return response()->json($this->formatUser($user->fresh()));
    }

    // ──────────────────────────────────────────────
    // POST /api/me/photo  — protected (Sanctum)
    // Accepts multipart/form-data with field "photo" (jpg/jpeg only).
    // Deletes the old avatar file before storing the new one.
    // Returns: { photo_url: "https://..." }
    //
    // FIX 1 (PRIMARY — caused the AuthController 500 / disappearing error):
    //   storeAs() does NOT auto-create the target directory on all Laravel/PHP
    //   versions. If storage/app/public/avatars/ didn't exist, storeAs() threw
    //   a FileException → Laravel returned an HTML debug page → JS could not
    //   parse it as JSON → the modal showed a blank/disappearing error while the
    //   browser Network tab showed the AuthController stack trace.
    //   Fix: call makeDirectory('avatars') before storeAs(). It is idempotent.
    //
    // FIX 2 (SECONDARY — blocked valid JPEG uploads silently):
    //   mimes:jpg,jpeg validates the file *extension* as well as the MIME type.
    //   A valid JPEG from a phone or camera that has no extension, or whose
    //   extension differs from the sniffed type, would fail with a 422 that
    //   surfaced as a generic AuthController-looking error.
    //   Fix: mimetypes:image/jpeg,image/jpg,image/pjpeg checks binary content only.
    //
    // FIX 3 (SAFETY — null-dereference guard):
    //   $request->user() is behind auth:sanctum middleware but a misconfigured
    //   route could return null. Explicit guard prevents a cryptic fatal error.
    // ──────────────────────────────────────────────
    public function uploadPhoto(Request $request)
    {
        // FIX 3: explicit null-guard (middleware should catch this, but belts + braces).
        $user = $request->user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // FIX 2: mimetypes checks the actual binary content, not the file extension.
        // image/pjpeg is a legacy alias some older browsers/encoders still emit.
        $request->validate([
            'photo' => [
                'required',
                'file',
                'mimetypes:image/jpeg,image/jpg,image/pjpeg',
                'max:2048',   // 2 MB
            ],
        ]);

        // FIX 1: Ensure the avatars directory exists before writing.
        // makeDirectory() is a no-op if the directory already exists.
        Storage::disk('public')->makeDirectory('avatars');

        // Delete the old avatar from disk (best-effort; silently ignored if gone).
        // $user->photo_url in the DB is always the relative path "avatars/uuid.jpg".
        if ($user->photo_url) {
            Storage::disk('public')->delete($user->photo_url);
        }

        // Store with a UUID filename to prevent collisions and enumeration.
        $filename = Str::uuid() . '.jpg';
        $path     = $request->file('photo')->storeAs('avatars', $filename, 'public');

        // Persist relative path in DB — formatUser() converts it to a full URL on read.
        $user->update(['photo_url' => $path]);

        return response()->json([
            'message'   => 'Photo updated successfully.',
            'photo_url' => Storage::disk('public')->url($path),
        ]);
    }

    // ──────────────────────────────────────────────
    // PRIVATE HELPER
    // Returns a consistent user array for all endpoints.
    // photo_url is always returned as a full URL (or null).
    // ──────────────────────────────────────────────
    private function formatUser(User $user): array
    {
        return [
            'id'        => $user->id,
            'name'      => $user->name,
            'email'     => $user->email,
            'phone'     => $user->phone,
            'role'      => $user->role,
            'address'   => $user->address,
            'photo_url' => $user->photo_url
                            ? Storage::disk('public')->url($user->photo_url)
                            : null,
        ];
    }
}