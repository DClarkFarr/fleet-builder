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
}
