# CCS112 Task Manager

A full CRUD task manager built for the Week 11 asynchronous activity on Laravel data, routing, and frontend integration. Laravel handles requests and validation, Eloquent persists task data, React renders the interface, and Inertia connects them without a separate REST API.

## Features

- Create tasks with a title, description, priority, and due date
- View, search, and filter tasks by status
- Edit task information
- Mark tasks complete or active
- Delete tasks with confirmation
- Server-side validation with Inertia error feedback
- Completion counts and progress percentage
- Responsive React interface
- Feature tests for request handling and CRUD

## Technology

- PHP 8.2+
- Laravel 12
- SQLite (default; MySQL can be configured)
- Inertia.js 2
- React 19
- Vite 7

## Local setup

```bash
git clone https://github.com/howellsy07/ccs112-task-manager.git
cd ccs112-task-manager
composer install
cp .env.example .env
php artisan key:generate
```

Create the SQLite file:

```bash
# Windows PowerShell
New-Item database/database.sqlite -ItemType File

# macOS / Linux / Git Bash
touch database/database.sqlite
```

Then finish setup and run the project:

```bash
php artisan migrate --seed
npm install
npm run build
php artisan serve
```

Open `http://127.0.0.1:8000/tasks`.

For frontend hot reload during development, run `npm run dev` in a second terminal while `php artisan serve` remains active.

## Request flow

1. A browser request reaches a route in `routes/web.php`.
2. The route invokes a method on `TaskController`.
3. The controller validates the request and reads or writes through the `Task` Eloquent model.
4. For the index page, Laravel sends task data as Inertia props.
5. `resources/js/Pages/Tasks/Index.jsx` renders those props and sends later actions through Inertia.
6. Laravel redirects back and Inertia refreshes the relevant page data without a traditional full-page reload.

## Main routes

| Method | URI | Controller action | Purpose |
| --- | --- | --- | --- |
| GET | `/tasks` | `index` | Render and filter the task list |
| POST | `/tasks` | `store` | Validate and create a task |
| PUT | `/tasks/{task}` | `update` | Validate and edit a task |
| PATCH | `/tasks/{task}/toggle` | `toggle` | Complete or reopen a task |
| DELETE | `/tasks/{task}` | `destroy` | Delete a task |

## Tests

```bash
php artisan test
```

The feature suite verifies Inertia rendering, creation, validation, update, status toggling, and deletion using an in-memory SQLite database.

## Repository

Live submission URL: <https://github.com/howellsy07/ccs112-task-manager>
