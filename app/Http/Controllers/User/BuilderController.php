<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

use App\Models\User;
use App\Services\ShipService;

class BuilderController extends Controller
{

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

    public function deleteWorkshopFleet($id_workshop, $id_workshop_fleet)
    {
        $auth = Auth::user();
        $user = User::find($auth->id);

        $shipService = new ShipService;

        $shipService->deleteWorkshopFleet($user, $id_workshop, $id_workshop_fleet);

        return response()->json(
            ['message' => 'Workshop fleet deleted']
        );
    }

    public function addShipToWorkshopFleet(Request $request, $id_workshop, $id_workshop_fleet)
    {
        $validator = Validator::make($request->all(), [
            'id_user_ship' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $auth = Auth::user();
        $user = User::find($auth->id);

        $shipService = new ShipService;

        $fleet = $shipService->addShipToWorkshopFleet($user, $id_workshop, $id_workshop_fleet, $request->id_user_ship);

        return response()->json(
            ['row' => $fleet->toArray()]
        );
    }

    public function removeShipFromWorkshopFleet(Request $request, $id_workshop, $id_workshop_fleet, $id_user_ship)
    {
        $auth = Auth::user();
        $user = User::find($auth->id);

        $shipService = new ShipService;

        $fleet = $shipService->removeShipFromWorkshopFleet($user, $id_workshop, $id_workshop_fleet, $id_user_ship);

        return response()->json(
            ['row' => $fleet->toArray()]
        );
    }
}
