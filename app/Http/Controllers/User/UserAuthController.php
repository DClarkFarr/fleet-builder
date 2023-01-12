<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

use App\Models\User;
use App\Services\ShipService;
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

    public function getShips()
    {
        $shipService = new ShipService;
        $user = Auth::user();
        $ships = $shipService->getUserShips($user->id);

        return response()->json(
            ['rows' => $ships->toArray()]
        );
    }

    public function createOrUpdateShip(Request $request)
    {
        $auth = Auth::user();
        $user = User::find($auth->id);

        $validator = Validator::make($request->all(), [
            'id_ship' => 'required|integer|min:0',
            'id_user_ship' => 'integer|min:0',
            // 'name' => 'string',
            'chip_level' => 'required|integer|min:0|max:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $shipService = new ShipService;

        $userShip = $shipService->createOrUpdateUserShip($user, $request->all());


        return response()->json(
            ['row' => $userShip->toArray()]
        );
    }

    public function deleteShip(Request $request, $id_user_ship)
    {
        $auth = Auth::user();
        $user = User::find($auth->id);

        $shipService = new ShipService;

        $shipService->deleteUserShip($user, $id_user_ship);

        return response()->json(
            ['message' => 'Ship deleted']
        );
    }

    public function createOrUpdateWorkshop(Request $request)
    {
        $auth = Auth::user();
        $user = User::find($auth->id);

        $shipService = new ShipService;

        $workshop = $shipService->createOrUpdateWorkshop($user, $request->all());

        return response()->json([
            'row' => $workshop->toArray(),
        ]);
    }

    public function listWorkshops()
    {

        $auth = Auth::user();
        $user = User::find($auth->id);

        $shipService = new ShipService;

        $workshops = $shipService->listWorkshops($user);

        return response()->json([
            'rows' => $workshops->toArray(),
        ]);
    }

    public function deleteWorkshop($id_workshop)
    {
        $auth = Auth::user();
        $user = User::find($auth->id);

        $shipService = new ShipService;

        $shipService->deleteWorkshop($user, $id_workshop);

        return response()->json(
            ['message' => 'Workshop deleted']
        );
    }

    public function getWorkshopFleets($id_workshop)
    {
        $auth = Auth::user();
        $user = User::find($auth->id);

        $shipService = new ShipService;

        $workshopFleets = $shipService->getWorkshopFleets($user, $id_workshop);

        return response()->json([
            'rows' => $workshopFleets->toArray(),
        ]);
    }

    public function createOrUpdateWorkshopFleet(Request $request, $id_workshop)
    {
        $validator = Validator::make($request->all(), [
            'leadership' => 'required|integer|min:0',
            'location' => 'required|string',
            'name' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $auth = Auth::user();
        $user = User::find($auth->id);

        $shipService = new ShipService;

        $workshopFleet = $shipService->createOrUpdateWorkshopFleet($user, $id_workshop, $request->all());

        return response()->json([
            'row' => $workshopFleet->toArray(),
        ]);
    }
}
