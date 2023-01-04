<?php

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

Route::any('/{any}', function () {
    return response()->json(['message' => 'Not found'], 404);
})
    ->where('any', '.*');
