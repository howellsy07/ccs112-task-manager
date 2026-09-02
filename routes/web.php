<?php

use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/tasks');

Route::controller(TaskController::class)->group(function (): void {
    Route::get('/tasks', 'index')->name('tasks.index');
    Route::post('/tasks', 'store')->name('tasks.store');
    Route::put('/tasks/{task}', 'update')->name('tasks.update');
    Route::patch('/tasks/{task}/toggle', 'toggle')->name('tasks.toggle');
    Route::delete('/tasks/{task}', 'destroy')->name('tasks.destroy');
});

