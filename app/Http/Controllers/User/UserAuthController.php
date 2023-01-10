<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

use App\Models\User;

use Illuminate\Validation\Rules\Password;

class UserAuthController extends Controller
{
    public function login(Request $req)
    {
        $validator = Validator::make($req->all(), [
            'email' => 'required|email',
            'password' => ['required', Password::min(8)->mixedCase()->numbers()->symbols()],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $success = Auth::attempt([
            'email' => $req->email,
            'password' => $req->password,
        ]);

        if (!$success) {
            return response()->json(['message' => 'These credentials do not match our records.'], 422);
        }

        $auth = Auth::user();

        $user = User::find($auth->id);

        return response()->json(
            ['user' => $user->toFeObject()]
        );
    }

    public function register(Request $req)
    {
        $validator = Validator::make($req->all(), [
            'alliance' => 'required|string|min:3',
            'name' => 'required|string|min:3',
            'email' => 'required|email|unique:users',
            'password' => ['required', 'confirmed', Password::min(8)->mixedCase()->numbers()->symbols()],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = new User;
        $user->alliance = $req->alliance;
        $user->password = Hash::make($req->password);
        $user->email = $req->email;
        $user->name = $req->name;
        $user->save();

        $user->assignRole('user');

        Auth::login($user);

        return response()->json(
            ['user' => $user->toFeObject()]
        );
    }

    public function auth()
    {
        $auth = Auth::user();

        $user = User::find($auth->id);

        return response()->json(
            ['user' => $user->toFeObject()]
        );
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logout success']);
    }
}
