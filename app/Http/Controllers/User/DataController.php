<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\ShipClass;
use App\Services\ShipService;
use Illuminate\Http\Request;


class DataController extends Controller
{

    /**
     * @var ShipService
     */
    public $shipService;


    public function __construct()
    {
        $this->shipService = new ShipService;
    }



    public function get($id_ship)
    {
        $ship = $this->shipService->getShip($id_ship, true);

        return response()->json(
            ['row' => $ship->toArray()]
        );
    }

    public function list(Request $request)
    {
        $ships = $this->shipService->getShips([
            'public' => true
        ]);

        return response()->json(
            ['rows' => $ships->toArray()]
        );
    }

    public function getClasses()
    {
        $shipClasses = ShipClass::orderBy('sort', 'asc')->get();

        return response()->json(
            ['rows' => $shipClasses->values()->toArray()]
        );
    }

    public function getWorkshop($id_workshop)
    {
        $workshop = $this->shipService->getPopulatedWorkshop($id_workshop);

        return response()->json(
            ['row' => $workshop->toArray()]
        );
    }

    public function submitShipForReview(Request $request)
    {
        $form = $request->form;
        $slots = $request->slots;
        $abilities = $request->abilities;


        if (!$form || !isset($form['name'])) {
            return response()->json(
                ['success' => false, 'message' => 'Invalid form data'],
                400
            );
        }

        if (!$slots || !isset($slots['weapon'])) {
            return response()->json(
                ['success' => false, 'message' => 'Invalid slots data'],
                400
            );
        }


        try {
            $this->shipService->submitShipForReview($form, $slots, $abilities);
        } catch (\Exception $err) {
            return response()->json(
                ['success' => false, 'message' => $err->getMessage()],
                400
            );
        }

        return response()->json(
            ['success' => true]
        );
    }
}
