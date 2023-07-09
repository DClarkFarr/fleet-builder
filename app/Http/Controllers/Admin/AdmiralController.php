<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AdmiralService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class AdmiralController extends Controller
{

    /**
     * @var AdmiralService
     */
    public $admiralService;


    public function __construct()
    {
        $this->admiralService = new AdmiralService;
    }

    public function create(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|min:3|unique:admirals',
            'public' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->input();

        $admiral = $this->admiralService->createAdmiral($data);

        return response()->json(
            ['row' => $admiral->toArray()]
        );
    }

    public function update(Request $request, $id_admiral)
    {

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|min:3',
            'public' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->input();

        $admiral = $this->admiralService->updateAdmiral($id_admiral, $data);

        return response()->json(
            ['row' => $this->admiralService->populateAdmiralForResponse($admiral)->toArray()]
        );
    }

    public function get(Request $request, $id_admiral)
    {
        $admiral = $this->admiralService->getAdmiral($id_admiral, true);

        return response()->json(
            ['row' => $admiral->toArray()]
        );
    }

    public function list(Request $request)
    {
        $public = $request->boolean('public');

        $admirals = $this->admiralService->getAdmirals([
            'public' => $public
        ]);

        return response()->json(
            ['rows' => $admirals->toArray()]
        );
    }

    public function updateAdmiralAbilities(Request $request, $id_admiral)
    {
        $validator = Validator::make($request->all(), [
            'location' => 'required|string',
            'abilities' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $location = $request->location;
        $abilities = $request->abilities;

        $abilities = $this->admiralService->updateAdmiralAbilities($id_admiral, $location, $abilities);

        return response()->json(
            ['rows' => $abilities->toArray()]
        );
    }

    public function deleteAdmiralAbility(Request $request, $id_admiral, $id_ability)
    {
        $this->admiralService->deleteAdmiralAbility($id_admiral, $id_ability);

        return response()->json(
            ['success' => true]
        );
    }

    public function createSkill(Request $request, $id_admiral)
    {
        $validator = Validator::make($request->all(), [
            'location' => ['required', Rule::in(['skill_1', 'skill_2', 'skill_3']),],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $location = $request->input('location');

        $skill = $this->admiralService->createSkill($id_admiral, $location);

        return response()->json(
            ['row' => $skill->toArray()]
        );
    }
}
