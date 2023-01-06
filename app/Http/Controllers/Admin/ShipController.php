<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ShipService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class ShipController extends Controller
{

    /**
     * @var ShipService
     */
    public $shipService;


    public function __construct()
    {
        $this->shipService = new ShipService;
    }

    public function create(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|min:3|unique:ships',
            'id_class' => 'required',
            'id_level' => 'required',
            'energy' => 'required|integer|min:0',
            'public' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->input();

        $ship = $this->shipService->createShip($data);

        return response()->json(
            ['row' => $ship->toArray()]
        );
    }

    public function update(Request $request, $id_ship)
    {

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|min:3',
            'id_class' => 'required',
            'id_level' => 'required',
            'energy' => 'required|integer|min:0',
            'public' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->input();

        $ship = $this->shipService->updateShip($id_ship, $data);

        return response()->json(
            ['row' => $this->shipService->populateShipForResponse($ship)->toArray()]
        );
    }

    public function get(Request $request, $id_ship)
    {
        $ship = $this->shipService->getShip($id_ship, true);

        return response()->json(
            ['row' => $ship->toArray()]
        );
    }

    public function list(Request $request)
    {
        $public = $request->boolean('public');

        $ships = $this->shipService->getShips([
            'public' => $public
        ]);

        return response()->json(
            ['rows' => $ships->toArray()]
        );
    }

    public function updateSlotsByType(Request $request, $id_ship)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|string',
            'slots' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $type = $request->type;
        $slots = $request->slots;

        $ship = $this->shipService->updateSlotsByType($id_ship, $type, $slots);

        return response()->json(
            ['row' => $this->shipService->populateShipForResponse($ship)->toArray()]
        );
    }
}
