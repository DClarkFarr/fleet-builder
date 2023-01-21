<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ShipLevel;
use App\Models\User;
use App\Services\ShipService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class UserController extends Controller
{


    public function list()
    {
        $users = User::with(['roles'])->get()->map(function ($model) {
            return $model->toFeObject();
        });
        return response()->json(['rows' => $users->toArray()]);
    }
}
