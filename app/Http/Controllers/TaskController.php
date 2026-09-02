<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'status' => ['nullable', Rule::in(['all', 'active', 'completed'])],
            'search' => ['nullable', 'string', 'max:100'],
        ]);

        $status = $filters['status'] ?? 'all';
        $search = trim($filters['search'] ?? '');

        $tasks = Task::query()
            ->when($status === 'active', fn ($query) => $query->where('is_done', false))
            ->when($status === 'completed', fn ($query) => $query->where('is_done', true))
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->orderBy('is_done')
            ->orderByRaw("case priority when 'high' then 1 when 'medium' then 2 else 3 end")
            ->latest()
            ->get();

        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks,
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
            'counts' => [
                'all' => Task::count(),
                'active' => Task::where('is_done', false)->count(),
                'completed' => Task::where('is_done', true)->count(),
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Task::create($this->validatedTask($request));

        return to_route('tasks.index')->with('success', 'Task created successfully.');
    }

    public function update(Request $request, Task $task): RedirectResponse
    {
        $task->update($this->validatedTask($request));

        return back()->with('success', 'Task updated successfully.');
    }

    public function toggle(Task $task): RedirectResponse
    {
        $isDone = ! $task->is_done;

        $task->update([
            'is_done' => $isDone,
            'completed_at' => $isDone ? now() : null,
        ]);

        return back()->with('success', $isDone ? 'Task completed.' : 'Task reopened.');
    }

    public function destroy(Task $task): RedirectResponse
    {
        $task->delete();

        return back()->with('success', 'Task deleted successfully.');
    }

    private function validatedTask(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'priority' => ['required', Rule::in(['low', 'medium', 'high'])],
            'due_date' => ['nullable', 'date'],
        ]);
    }
}

