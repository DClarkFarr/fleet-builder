<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
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
}
