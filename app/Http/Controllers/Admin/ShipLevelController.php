<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ShipLevel;
use App\Services\ShipService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class ShipLevelController extends Controller
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
            'name' => 'required|string|min:3|unique:ship_levels',
            'sort' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $name = $request->name;
        $sort = $request->sort;

        $shipLevel = $this->shipService->createShipLevel($name, $sort);

        return response()->json(
            ['row' => $shipLevel->toArray()]
        );
    }

    public function update(Request $request, $id_level)
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

        [$status, $messageOrModel] = $this->shipService->updateShipLevel($id_level, $name, $sort);

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
        $shipLevels = ShipLevel::orderBy('sort', 'asc')->get();

        return response()->json(
            ['rows' => $shipLevels->values()->toArray()]
        );
    }

    public function delete($id_level)
    {

        [$status, $message] = $this->shipService->deleteShipLevel($id_level);

        if (!$status) {
            return response()->json(['message' => $message], 422);
        }

        return response()->json(
            ['message' => 'Ship level deleted']
        );
    }
}
