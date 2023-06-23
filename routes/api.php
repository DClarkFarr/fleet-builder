<?php

use App\Http\Controllers\Admin\ShipClassController;
use App\Http\Controllers\Admin\ShipController;
use App\Http\Controllers\Admin\ShipLevelController;
use App\Http\Controllers\Admin\TesseractController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\User\BuilderController;
use App\Http\Controllers\User\DataController;
use App\Http\Controllers\User\UserAuthController;
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
    Route::post('/logout', [UserAuthController::class, 'logout']);
    Route::get('/', [UserAuthController::class, 'auth']);

    Route::middleware(['auth'])->group(function () {
        /** UserShips */
        Route::get('/ships', [BuilderController::class, 'getShips']);
        Route::post('/ships', [BuilderController::class, 'createOrUpdateShip']);
        Route::post('/ships/{id_user_ship}/upload', [BuilderController::class, 'uploadStatImage']);
        Route::delete('/ships/{id_user_ship}/upload', [BuilderController::class, 'deleteStatImage']);
        Route::delete('/ships/{id_user_ship}', [BuilderController::class, 'deleteShip']);
        Route::delete('/ships', [BuilderController::class, 'deleteAllUserShips']);

        Route::prefix('/workshops')->group(function () {

            Route::get('/', [BuilderController::class, 'listWorkshops']);
            Route::post('/', [BuilderController::class, 'createOrUpdateWorkshop']);

            Route::prefix('/{id_workshop}')->group(function () {

                Route::delete('/', [BuilderController::class, 'deleteWorkshop']);

                Route::prefix('/fleets')->group(function () {

                    Route::get('/', [BuilderController::class, 'getWorkshopFleets']);
                    Route::post('/', [BuilderController::class, 'createOrUpdateWorkshopFleet']);

                    Route::prefix('/{id_workshop_fleet}')->group(function () {
                        Route::delete('/', [BuilderController::class, 'deleteWorkshopFleet']);
                        Route::post('/ships', [BuilderController::class, 'addShipToWorkshopFleet']);
                        Route::post('/flagship', [BuilderController::class, 'setWorkshopFleetFlagship']);
                        Route::delete('/ships/{id_user_fleet}', [BuilderController::class, 'removeShipFromWorkshopFleet']);
                    });
                });
            });
        });
    });
});


/**
 * Share public routes 
 */

Route::prefix('/data')->group(function () {
    Route::get('/ships', [DataController::class, 'list']);
    Route::get('/ships/classes', [DataController::class, 'getClasses']);
    Route::get('/workshop/{id_workshop}', [DataController::class, 'getWorkshop']);
});


Route::prefix('/data')->middleware(['auth'])->group(function () {
    Route::post('/ships', [DataController::class, 'submitShipForReview']);
});

Route::prefix('/admin')->middleware(['role:admin'])->group(function () {

    Route::prefix('/user')->group(function () {
        Route::get('/', [UserController::class, 'list']);
    });

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
            Route::put('/abilities', [ShipController::class, 'updateShipAbilities']);
            Route::delete('/abilities/{id_ability}', [ShipController::class, 'deleteShipAbility']);
        });
    });

    Route::prefix('/tesseract')->group(function () {
        Route::get('/options', [TesseractController::class, 'getTrainingOptions']);
        Route::get('/file/{file_name}', [TesseractController::class, 'getFile']);
        Route::post('/file/{file_name}', [TesseractController::class, 'saveFile']);
    });
});

Route::any('/{any}', function () {
    return response()->json(['message' => 'Not found'], 404);
})
    ->where('any', '.*');
