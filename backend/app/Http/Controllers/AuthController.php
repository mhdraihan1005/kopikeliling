<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Kredensial yang Anda berikan tidak cocok dengan data kami.'],
            ]);
        }

        return response()->json([
            'user' => $user,
            'token' => bin2hex(random_bytes(20)),
            'role' => $user->role
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'role' => 'customer' // Default role
        ]);

        return response()->json([
            'user' => $user,
            'token' => bin2hex(random_bytes(20)),
            'role' => $user->role
        ], 201);
    }

    public function logout(Request $request)
    {
        return response()->json([
            'message' => 'Berhasil logout.'
        ]);
    }
}
