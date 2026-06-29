<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SettingController;

// 1. Public Routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::get('/settings', [SettingController::class, 'index']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/reviews', [ReviewController::class, 'index']);

Route::post('/reviews', [ReviewController::class, 'store']);
Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders/{id}', [OrderController::class, 'show']);
Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);
Route::post('/webhook/midtrans', [OrderController::class, 'handleWebhook']);

// 2. Authenticated Routes (Customers & Admins)
Route::middleware('api.auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/user', function (Request $request) {
        return auth()->user();
    });

    // 3. Admin Only Routes
    Route::middleware('api.admin')->group(function () {
        Route::post('/settings', [SettingController::class, 'update']);
        
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);
        Route::delete('/product-images/{id}', [ProductController::class, 'deleteImage']);
        
        Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);

        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
    });
});


