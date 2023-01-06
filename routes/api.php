<?php

use App\Http\Controllers\Admin\ShipClassController;
use App\Http\Controllers\Admin\ShipController;
use App\Http\Controllers\Admin\ShipLevelController;
use App\Http\Controllers\User\UserAuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::prefix('/user')->group(function () {
    Route::post('/login', [UserAuthController::class, 'login']);
    Route::post('/register', [UserAuthController::class, 'register']);

    Route::middleware(['auth'])->group(function () {
        Route::post('/logout', [UserAuthController::class, 'logout']);
        Route::get('/', [UserAuthController::class, 'auth']);
    });
});

Route::prefix('/admin')->middleware(['role:admin'])->group(function () {

    Route::prefix('/ship')->group(function () {

        Route::prefix('/class')->group(function () {
            Route::get('/', [ShipClassController::class, 'list']);
            Route::post('/', [ShipClassController::class, 'create']);
            Route::put('/{id_class}', [ShipClassController::class, 'update']);
            Route::delete('/{id_class}', [ShipClassController::class, 'delete']);
        });

        Route::prefix('/level')->group(function () {
            Route::get('/', [ShipLevelController::class, 'list']);
            Route::post('/', [ShipLevelController::class, 'create']);
            Route::put('/{id_level}', [ShipLevelController::class, 'update']);
            Route::delete('/{id_level}', [ShipLevelController::class, 'delete']);
        });

        Route::get('/', [ShipController::class, 'list']);
        Route::post('/', [ShipController::class, 'create']);
        Route::prefix('/{id_ship}')->group(function () {
            Route::get('/', [ShipController::class, 'get']);
            Route::put('/', [ShipController::class, 'update']);
            Route::delete('/', [ShipController::class, 'delete']);

            Route::put('/slots', [ShipController::class, 'updateSlotsByType']);
        });
    });
});

Route::any('/{any}', function () {
    return response()->json(['message' => 'Not found'], 404);
})
    ->where('any', '.*');
