<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::prefix('/dashboard')->middleware(['role:admin'])->group(function () {
    Route::get("/{any?}", function () {
        return view('dashboard');
    })
        ->where('any', '.*')
        ->name('dashboard');
});

Route::prefix('/builder')->middleware(['auth'])->group(function () {
    Route::get("/{any?}", function () {
        return view('builder');
    })
        ->where('any', '.*')
        ->name('builder');
});



Route::get('/login', function () {
    return view('home');
})->name('user.login');

Route::get('/signup', function () {
    return view('home');
})->name('user.signup');

Route::get('/', function () {
    return view('home');
})->name('home');
