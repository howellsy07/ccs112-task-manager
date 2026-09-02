# CCS112 Task Manager

A student activity for **CCS112 - Application Development and Emerging Technologies**. This project applies the Week 11 topics on Laravel data handling, routing and controllers, Eloquent database modeling, and React frontend integration through Inertia.js.

## Activity Objectives

- Create a working Task Manager application.
- Implement Laravel routes and controller actions.
- Perform create, read, update, and delete operations.
- Store task records using Eloquent and SQLite.
- Display the frontend using React and Inertia.js.

## Features

- Add tasks with a title, description, priority, and due date
- View, search, and filter tasks
- Edit existing tasks
- Mark tasks as completed or active
- Delete tasks with confirmation
- Save task records in an SQLite database
- Display validation errors for incomplete or invalid input
- Use a responsive React interface

## Technologies Used

| Technology | Purpose |
| --- | --- |
| Laravel 12 | Backend request handling and routing |
| PHP 8.2+ | Backend programming language |
| React 19 | User interface |
| Inertia.js 2 | Connects the Laravel backend and React frontend |
| SQLite | Stores task records |
| Vite 7 | Runs and builds frontend assets |

## Laravel Routes

| Method | URI | Controller Action | Purpose |
| --- | --- | --- | --- |
| GET | `/tasks` | `index` | Display and filter tasks |
| POST | `/tasks` | `store` | Create a new task |
| PUT | `/tasks/{task}` | `update` | Edit task information |
| PATCH | `/tasks/{task}/toggle` | `toggle` | Complete or reopen a task |
| DELETE | `/tasks/{task}` | `destroy` | Delete a task |

## Database

The application uses the `tasks` table. Its main fields are:

- `title`
- `description`
- `priority`
- `due_date`
- `is_done`
- `completed_at`
- `created_at` and `updated_at`

Laravel migrations define the table structure, while the `Task` Eloquent model is used to create, retrieve, update, and delete records.

## How the Application Works

React displays the Task Manager interface and sends actions through Inertia.js. Laravel receives each request through a route, processes it in `TaskController`, and uses the `Task` model to update the SQLite database. Inertia then returns the updated data to the React page without requiring a traditional full-page reload.

## Running the Project on Windows

Requirements: PHP, Composer, Node.js, npm, and Git.

```powershell
git clone https://github.com/howellsy07/ccs112-task-manager.git
cd ccs112-task-manager
composer install
npm install
Copy-Item .env.example .env
php artisan key:generate
New-Item database\database.sqlite -ItemType File
php artisan migrate --seed
composer run dev
```

Open <http://127.0.0.1:8000/tasks> while the development servers are running.

## Documentation Evidence

The activity documentation includes screenshots of:

1. Laravel and Vite running in PowerShell
2. Laravel task routes
3. The SQLite `tasks` table and saved records
4. The Task Manager interface
5. A completed CRUD operation

## Activity Result

The Task Manager successfully demonstrates backend request handling, Laravel routing and controllers, CRUD operations through Eloquent, SQLite database persistence, and a React frontend served through Inertia.js.

## Repository

<https://github.com/howellsy07/ccs112-task-manager>
