<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ShipClass;
use App\Services\ShipService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class ShipClassController extends Controller
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
            'name' => 'required|string|min:3|unique:ship_classes',
            'sort' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $name = $request->name;
        $sort = $request->sort;

        $shipClass = $this->shipService->createShipClass($name, $sort);

        return response()->json(
            ['row' => $shipClass->toArray()]
        );
    }

    public function update(Request $request, $id_class)
    {

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|min:3',
            'sort' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $name = $request->name;
        $sort = $request->sort;

        [$status, $messageOrModel] = $this->shipService->updateShipClass($id_class, $name, $sort);

        if ($status) {
            return response()->json(
                ['row' => $messageOrModel->toArray()]
            );
        } else {
            return response()->json(['message' => $messageOrModel], 422);
        }
    }

    public function list()
    {
        $shipClasses = ShipClass::orderBy('sort', 'asc')->get();

        return response()->json(
            ['rows' => $shipClasses->values()->toArray()]
        );
    }

    public function delete($id_class)
    {

        [$status, $message] = $this->shipService->deleteShipClass($id_class);

        if (!$status) {
            return response()->json(['message' => $message], 422);
        }

        return response()->json(
            ['message' => 'Ship class deleted']
        );
    }
}
