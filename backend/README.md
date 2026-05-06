# backend

To install dependencies:

```bash
bun install
```

Create a `.env` file from `.env.example`, then run the API:

```bash
bun run dev
```

Main routes:

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET|POST /api/projects`
- `GET|PATCH|DELETE /api/projects/:id`
- `GET|POST /api/tasks`
- `GET|PATCH|DELETE /api/tasks/:id`
- `POST /api/comments`
- `GET /api/comments/task/:taskId`
- `GET /api/dashboard`
- `GET /api/users`

Run `bun run typecheck` before committing backend changes.
