# Ethara AI Team Task Manager

A full-stack team task management application built for collaborative project delivery. The app includes authentication, role-based access control, project membership, task assignment, task status tracking, dashboard metrics, and task comments.

The project is structured as a production-minded assignment build: a React frontend, an Express API, MongoDB persistence, Zod validation, JWT auth with refresh-token cookies, and Docker-based local setup.

## Live Link - [http://15.135.140.182:5173/](http://15.135.140.182:5173/)
     deployed with Docker Compose on a AWS EC2 instance. The frontend is served by Nginx, and the backend API is accessible at `http://15.135.140.182:4000/`

## Features

- User signup, login, refresh, and logout flows.
- Access-token authentication with refresh tokens stored in an HttpOnly cookie.
- Role-based access control for `admin`, `project_manager`, and `team_member`.
- Project creation, listing, update, and deletion.
- Project ownership and project member relationships.
- Task creation, assignment, priority, due date, and status tracking.
- Task statuses: `todo`, `in_progress`, `review`, and `done`.
- Dashboard summary for projects, total tasks, overdue tasks, tasks assigned to the current user, and counts by status.
- Task comments for collaboration and discussion history.
- Backend request validation with Zod.
- Centralized error handling and not-found handling.
- Docker Compose setup for frontend, backend, and MongoDB.

## What Makes It Strong From a Developer Side

- Clear backend layering: routes, controllers, services, models, validators, middleware, and shared utilities are separated by responsibility.
- Business rules live in services, keeping controllers thin and easy to test.
- Validation is schema-driven with Zod before requests reach business logic.
- MongoDB relationships are modeled with Mongoose refs for users, projects, tasks, and comments.
- Authorization is enforced at both role level and resource level. Non-admin users only access projects and tasks they belong to.
- Refresh token rotation is supported through persisted refresh tokens on the user record.
- Sensitive user fields such as password and refresh token are excluded from JSON responses.
- Project deletion cleans up related tasks and comments.
- Task deletion cleans up related comments.
- Dashboard metrics use database queries and aggregation instead of frontend-only counting.
- Frontend API handling automatically retries requests after token refresh when possible.
- The frontend keeps workspace state in a dedicated hook, keeping the main app component focused on orchestration.
- Docker setup mirrors deployable services: MongoDB, API, and a static frontend served by Nginx.

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Nginx for production container serving

### Backend

- Bun runtime
- TypeScript
- Express
- Mongoose
- MongoDB
- Zod
- JSON Web Tokens
- bcrypt
- cookie-parser
- CORS
- Morgan

### DevOps

- Docker
- Docker Compose
- Separate Dockerfiles for frontend and backend
- MongoDB volume persistence through Docker Compose

## Project Structure

```text
.
|-- backend
|   |-- index.ts
|   |-- src
|   |   |-- config
|   |   |-- constants
|   |   |-- controllers
|   |   |-- middleware
|   |   |-- models
|   |   |-- routes
|   |   |-- services
|   |   |-- types
|   |   |-- utils
|   |   `-- validators
|   |-- Dockerfile
|   `-- package.json
|-- frontend
|   |-- src
|   |   |-- components
|   |   |-- hooks
|   |   |-- pages
|   |   |-- types
|   |   `-- utils
|   |-- Dockerfile
|   |-- nginx.conf
|   `-- package.json
|-- docker-compose.yml
`-- README.md
```

## Local Setup With Docker

Docker is the easiest way to run the whole project locally.

### Prerequisites

- Docker
- Docker Compose

### 1. Create Backend Environment File

Copy the backend example file:

```bash
cp backend/.env.example backend/.env
```

Update secrets in `backend/.env`. Both JWT secrets must be at least 32 characters long.

```env
NODE_ENV=development
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/team-task-manager
JWT_ACCESS_SECRET=replace-with-at-least-32-characters-access-secret
JWT_REFRESH_SECRET=replace-with-at-least-32-characters-refresh-secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

When running with Docker Compose, `docker-compose.yml` overrides `MONGO_URI` to use the MongoDB service:

```env
MONGO_URI=mongodb://mongo:27017/team-task-manager
```

### 2. Start All Services

```bash
docker compose up --build
```

The services will be available at:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:4000`
- Backend health check: `http://localhost:4000/health`
- MongoDB: `localhost:27017`

### 3. Stop Services

```bash
docker compose down
```

To also remove the MongoDB volume:

```bash
docker compose down -v
```

## Local Setup Without Docker

Use this path if you want to run the frontend and backend directly during development.

### Prerequisites

- Bun
- MongoDB running locally

### 1. Backend

```bash
cd backend
cp .env.example .env
bun install
bun run dev
```

The backend runs on `http://localhost:4000`.

### 2. Frontend

Open another terminal:

```bash
cd frontend
cp .env.example .env
bun install
bun run dev
```

The frontend runs on `http://localhost:5173`.

## Environment Variables

### Backend

| Variable | Purpose |
| --- | --- |
| `NODE_ENV` | Runtime mode: `development`, `test`, or `production`. |
| `PORT` | API port. Defaults to `4000`. |
| `MONGO_URI` | MongoDB connection string. |
| `JWT_ACCESS_SECRET` | Secret used to sign access tokens. Minimum 32 characters. |
| `JWT_REFRESH_SECRET` | Secret used to sign refresh tokens. Minimum 32 characters. |
| `ACCESS_TOKEN_EXPIRES_IN` | Access token lifetime. Defaults to `15m`. |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh token lifetime. Defaults to `7d`. |
| `CLIENT_ORIGIN` | Allowed frontend origin for CORS. |

### Frontend

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Backend API base URL. Example: `http://localhost:4000/api`. |

## Useful Commands

### Backend

```bash
cd backend
bun run dev
bun run start
bun run typecheck
```

### Frontend

```bash
cd frontend
bun run dev
bun run build
bun run lint
bun run preview
```

### Docker

```bash
docker compose up --build
docker compose down
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mongo
```

## API Overview

Base URL:

```text
http://localhost:4000/api
```

### Auth

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/auth/signup` | Create a new user account. |
| `POST` | `/auth/login` | Login and receive an access token. |
| `POST` | `/auth/refresh` | Refresh the access token using the refresh cookie. |
| `POST` | `/auth/logout` | Clear the refresh token and end the session. |

### Projects

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/projects` | List projects visible to the current user. |
| `POST` | `/projects` | Create a project. |
| `GET` | `/projects/:id` | Get one project. |
| `PATCH` | `/projects/:id` | Update a project. |
| `DELETE` | `/projects/:id` | Delete a project and its related tasks/comments. |

### Tasks

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/tasks` | List tasks visible to the current user. |
| `GET` | `/tasks?project=:id` | List tasks for a specific project. |
| `POST` | `/tasks` | Create a task. |
| `GET` | `/tasks/:id` | Get one task. |
| `PATCH` | `/tasks/:id` | Update task details or status. |
| `DELETE` | `/tasks/:id` | Delete a task and its comments. |

### Comments

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/comments` | Add a comment to a task. |
| `GET` | `/comments/task/:taskId` | List comments for a task. |

### Dashboard

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/dashboard` | Get workspace metrics for the current user. |

### Users

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/users` | List safe user directory fields for admins and project managers. |
| `GET` | `/users?search=:query` | Search users by name or email for project/task assignment. |

## Roles and Permissions

| Role | Access |
| --- | --- |
| `admin` | Can access all projects and tasks. |
| `project_manager` | Can create projects and tasks, and can update/delete projects they own. |
| `team_member` | Can view accessible project work, update accessible tasks, and add task comments. |

Resource-level access is enforced in the backend. A user cannot read or mutate project, task, or comment data unless they are allowed to access the related project.

## Data Model Summary

- `User`: name, email, password hash, role, refresh token.
- `Project`: name, description, owner, members.
- `Task`: title, description, project, assignee, creator, status, priority, due date.
- `Comment`: task, author, message.

## Validation and Error Handling

- Request bodies, params, and queries are validated with Zod.
- Errors are passed through centralized Express middleware.
- Invalid auth, forbidden access, missing resources, duplicate accounts, and invalid relationships return clear API errors.
- Environment variables are validated at startup, so misconfiguration fails early.

## Security Notes

- Passwords are hashed with bcrypt before storage.
- Refresh tokens are sent as HttpOnly cookies.
- Access tokens are sent with the `Authorization: Bearer <token>` header.
- CORS is restricted by `CLIENT_ORIGIN`.
- Sensitive fields are excluded from user JSON responses.
- Do not commit `.env` files, private keys, database dumps, or production secrets.

## Build and Deployment Notes

- The frontend Docker image builds the Vite app and serves static files with Nginx.
- The backend Docker image runs the Bun API on port `4000`.
- In production, set `NODE_ENV=production` so refresh cookies use the secure cookie setting.
- Configure `CLIENT_ORIGIN` to the deployed frontend URL.
- Configure `VITE_API_URL` at frontend build time to point to the deployed API URL.
- Use a managed MongoDB service or a persistent MongoDB volume.

## Suggested Pre-Commit Checks

Run these before submitting or deploying:

```bash
cd backend
bun run typecheck

cd ../frontend
bun run build
bun run lint
```

## Future Improvements

- Add automated backend tests for services and protected routes.
- Add frontend integration tests for auth and workspace flows.
- Add task filtering by status, priority, assignee, and due date.
- Add invite-based project membership.
- Add audit logs for task and project changes.
- Add pagination for large task and comment lists.
