<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DonationController;
use App\Http\Controllers\Api\NgoDonationController;
use App\Http\Controllers\Api\VolunteerController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/donations', [DonationController::class, 'index']);
    Route::post('/donations', [DonationController::class, 'store']);
    Route::get('/donations/{donation}', [DonationController::class, 'show']);
    Route::put('/donations/{donation}', [DonationController::class, 'update']);
    Route::delete('/donations/{donation}', [DonationController::class, 'destroy']);

    Route::get('/ngo/donations', [NgoDonationController::class, 'index']);
    Route::get('/ngo/donations/{donation}', [NgoDonationController::class, 'show']);
    Route::post('/ngo/donations/{donation}/accept', [NgoDonationController::class, 'accept']);
    Route::get('/ngo/volunteers', [NgoDonationController::class, 'volunteers']);
    Route::post('/ngo/donations/{donation}/assign', [NgoDonationController::class, 'assign']);

    Route::get('/volunteer/assignments', [VolunteerController::class, 'assignments']);
    Route::patch('/volunteer/availability', [VolunteerController::class, 'updateAvailability']);
});
