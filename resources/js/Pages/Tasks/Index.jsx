import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

const emptyTask = {
  title: '',
  description: '',
  priority: 'medium',
  due_date: '',
};

export default function Index({ tasks, counts, filters, flash }) {
  const createForm = useForm(emptyTask);
  const editForm = useForm(emptyTask);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState(filters.search ?? '');

  useEffect(() => {
    setSearch(filters.search ?? '');
  }, [filters.search]);

  const completionRate = useMemo(() => {
    if (!counts.all) return 0;
    return Math.round((counts.completed / counts.all) * 100);
  }, [counts]);

  function addTask(event) {
    event.preventDefault();
    createForm.post('/tasks', {
      preserveScroll: true,
      onSuccess: () => createForm.reset(),
    });
  }

  function beginEdit(task) {
    setEditingId(task.id);
    editForm.setData({
      title: task.title,
      description: task.description ?? '',
      priority: task.priority,
      due_date: task.due_date ?? '',
    });
    editForm.clearErrors();
  }

  function saveEdit(event, taskId) {
    event.preventDefault();
    editForm.put(`/tasks/${taskId}`, {
      preserveScroll: true,
      onSuccess: () => setEditingId(null),
    });
  }

  function applyFilters(nextStatus = filters.status, nextSearch = search) {
    router.get(
      '/tasks',
      { status: nextStatus, search: nextSearch || undefined },
      { preserveState: true, replace: true },
    );
  }

  function deleteTask(task) {
    if (window.confirm(`Delete “${task.title}”?`)) {
      router.delete(`/tasks/${task.id}`, { preserveScroll: true });
    }
  }

  return (
    <>
      <Head title="My Tasks" />

      <main className="page-shell">
        <section className="hero-panel">
          <div>
            <p className="eyebrow">CCS112 · WEEK 11 ACTIVITY PROJECT · JOHN HOWELL J. SY</p>
            <h1>Make the day feel doable.</h1>
            <p className="hero-copy">
              A focused task manager powered by Laravel, Eloquent, React, and Inertia.
            </p>
          </div>
          <div className="progress-card" aria-label={`${completionRate}% complete`}>
            <strong>{completionRate}%</strong>
            <span>complete</span>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${completionRate}%` }} />
            </div>
          </div>
        </section>

        {flash?.success && <div className="flash-message">{flash.success}</div>}

        <section className="workspace-grid">
          <aside className="create-card">
            <div className="section-heading">
              <span className="section-number">01</span>
              <div>
                <h2>Add a task</h2>
                <p>Capture it now. Organize it quickly.</p>
              </div>
            </div>

            <TaskForm
              form={createForm}
              onSubmit={addTask}
              submitLabel={createForm.processing ? 'Adding…' : 'Add task'}
            />
          </aside>

          <section className="tasks-card">
            <div className="section-heading task-heading">
              <span className="section-number">02</span>
              <div>
                <h2>Your tasks</h2>
                <p>{counts.active} active · {counts.completed} completed</p>
              </div>
            </div>

            <form
              className="search-row"
              onSubmit={(event) => {
                event.preventDefault();
                applyFilters();
              }}
            >
              <input
                aria-label="Search tasks"
                placeholder="Search title or description"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <button className="secondary-button" type="submit">Search</button>
            </form>

            <div className="filter-tabs" role="tablist" aria-label="Task status">
              {['all', 'active', 'completed'].map((status) => (
                <button
                  className={filters.status === status ? 'active' : ''}
                  key={status}
                  onClick={() => applyFilters(status)}
                  type="button"
                >
                  {status} <span>{counts[status]}</span>
                </button>
              ))}
            </div>

            <div className="task-list">
              {tasks.length === 0 ? (
                <div className="empty-state">
                  <span>✓</span>
                  <h3>No matching tasks</h3>
                  <p>Add a task or change your current filters.</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <article className={`task-item ${task.is_done ? 'is-done' : ''}`} key={task.id}>
                    {editingId === task.id ? (
                      <TaskForm
                        compact
                        form={editForm}
                        onCancel={() => setEditingId(null)}
                        onSubmit={(event) => saveEdit(event, task.id)}
                        submitLabel={editForm.processing ? 'Saving…' : 'Save changes'}
                      />
                    ) : (
                      <>
                        <button
                          aria-label={task.is_done ? 'Mark task active' : 'Mark task complete'}
                          className="check-button"
                          onClick={() => router.patch(`/tasks/${task.id}/toggle`, {}, { preserveScroll: true })}
                          type="button"
                        >
                          {task.is_done ? '✓' : ''}
                        </button>
                        <div className="task-content">
                          <div className="task-title-row">
                            <h3>{task.title}</h3>
                            <span className={`priority priority-${task.priority}`}>{task.priority}</span>
                          </div>
                          {task.description && <p>{task.description}</p>}
                          <div className="task-meta">
                            <span>{task.due_date ? `Due ${formatDate(task.due_date)}` : 'No due date'}</span>
                            <span>Created {formatDate(task.created_at)}</span>
                          </div>
                        </div>
                        <div className="task-actions">
                          <button onClick={() => beginEdit(task)} type="button">Edit</button>
                          <button className="danger-link" onClick={() => deleteTask(task)} type="button">Delete</button>
                        </div>
                      </>
                    )}
                  </article>
                ))
              )}
            </div>
          </section>
        </section>
      </main>
    </>
  );
}

function TaskForm({ compact = false, form, onCancel, onSubmit, submitLabel }) {
  return (
    <form className={`task-form ${compact ? 'compact-form' : ''}`} onSubmit={onSubmit}>
      <label>
        <span>Title</span>
        <input
          autoFocus={compact}
          maxLength="255"
          placeholder="What needs to be done?"
          value={form.data.title}
          onChange={(event) => form.setData('title', event.target.value)}
        />
        {form.errors.title && <small className="field-error">{form.errors.title}</small>}
      </label>

      <label>
        <span>Description <em>optional</em></span>
        <textarea
          maxLength="1000"
          placeholder="Add useful details"
          rows={compact ? 2 : 4}
          value={form.data.description}
          onChange={(event) => form.setData('description', event.target.value)}
        />
        {form.errors.description && <small className="field-error">{form.errors.description}</small>}
      </label>

      <div className="form-row">
        <label>
          <span>Priority</span>
          <select
            value={form.data.priority}
            onChange={(event) => form.setData('priority', event.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <label>
          <span>Due date</span>
          <input
            type="date"
            value={form.data.due_date}
            onChange={(event) => form.setData('due_date', event.target.value)}
          />
        </label>
      </div>

      <div className="form-actions">
        {onCancel && <button className="secondary-button" onClick={onCancel} type="button">Cancel</button>}
        <button className="primary-button" disabled={form.processing} type="submit">{submitLabel}</button>
      </div>
    </form>
  );
}

function formatDate(dateValue) {
  return new Intl.DateTimeFormat('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateValue));
}

