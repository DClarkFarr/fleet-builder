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

Route::get('/login', function () {
    return view('home');
})->name('user.login');

Route::get('/signup', function () {
    return view('home');
})->name('user.signup');

Route::any('/{any}', function () {
    return view('home');
})
    ->middleware(['auth'])
    ->where('any', '.*');
