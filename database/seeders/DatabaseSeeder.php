<?php

namespace Database\Seeders;

use App\Models\Task;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Task::query()->insert([
            [
                'title' => 'Read the Week 11 module',
                'description' => 'Review Laravel routing, Eloquent, and Inertia integration.',
                'priority' => 'high',
                'due_date' => now()->addDay()->toDateString(),
                'is_done' => true,
                'completed_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Finish Task Manager documentation',
                'description' => 'Add the repository link and final screenshots to the PDF.',
                'priority' => 'medium',
                'due_date' => now()->addDays(3)->toDateString(),
                'is_done' => false,
                'completed_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

