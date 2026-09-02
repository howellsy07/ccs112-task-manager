<?php

namespace Tests\Feature;

use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class TaskManagerTest extends TestCase
{
    use RefreshDatabase;

    public function test_task_page_is_rendered_with_backend_data(): void
    {
        Task::create(['title' => 'Review routing', 'priority' => 'high']);

        $this->get('/tasks')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Tasks/Index')
                ->has('tasks', 1)
                ->where('tasks.0.title', 'Review routing'));
    }

    public function test_a_task_can_be_created(): void
    {
        $this->post('/tasks', [
            'title' => 'Build the React page',
            'description' => 'Use Inertia useForm.',
            'priority' => 'medium',
            'due_date' => '2026-09-05',
        ])->assertRedirect('/tasks');

        $this->assertDatabaseHas('tasks', [
            'title' => 'Build the React page',
            'is_done' => false,
        ]);
    }

    public function test_title_is_required_when_creating_a_task(): void
    {
        $this->from('/tasks')->post('/tasks', [
            'title' => '',
            'priority' => 'medium',
        ])->assertRedirect('/tasks')->assertSessionHasErrors('title');
    }

    public function test_a_task_can_be_updated_toggled_and_deleted(): void
    {
        $task = Task::create(['title' => 'Old title', 'priority' => 'low']);

        $this->put("/tasks/{$task->id}", [
            'title' => 'Updated title',
            'description' => null,
            'priority' => 'high',
            'due_date' => null,
        ])->assertRedirect();

        $this->patch("/tasks/{$task->id}/toggle")->assertRedirect();
        $this->assertDatabaseHas('tasks', ['id' => $task->id, 'is_done' => true]);

        $this->delete("/tasks/{$task->id}")->assertRedirect();
        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }
}

