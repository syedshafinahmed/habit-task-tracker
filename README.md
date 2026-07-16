# 📋 Habit & Task Tracker API

<div align="center">

  **Your All-in-One Productivity Backend — Track Habits & Manage Projects**

  [![Node.js](https://img.shields.io/badge/Node.js-22+-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Express](https://img.shields.io/badge/Express-5.2.1-000000?style=flat-square&logo=express)](https://expressjs.com/)
  [![Prisma](https://img.shields.io/badge/Prisma-6.14.0-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-4169E1?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
  [![Zod](https://img.shields.io/badge/Zod-4.4.3-3068B7?style=flat-square&logo=zod)](https://zod.dev/)
  [![JWT](https://img.shields.io/badge/JWT-9.0.3-D63AFF?style=flat-square&logo=jsonwebtokens)](https://jwt.io/)
  [![Swagger](https://img.shields.io/badge/Swagger-UI-85EA2D?style=flat-square&logo=swagger)](http://localhost:5000/api-docs)

</div>

---

## 📖 Overview

**Habit & Task Tracker API** is a robust, fully-typed backend service for personal productivity. It provides a clean RESTful architecture for managing users, projects, tasks (with subtasks and tags), and habits with streak tracking. Built on Express.js 5 with TypeScript, Prisma ORM for type-safe database access, and Zod for strict request validation.

---

## ✨ Features

### 🔐 Authentication
- Secure user registration and login
- JWT-based stateless authentication with configurable expiry
- Password hashing with bcryptjs
- Protected routes via auth middleware

### 📁 Project Management
- Create and organize projects per user
- Soft-delete support — projects are never hard-deleted
- Per-project task statistics (total, done, in-progress, todo counts)
- Full CRUD: create, list, get by ID, update, soft-delete

### ✅ Task Management
- Tasks scoped to projects with status (`TODO`, `IN_PROGRESS`, `DONE`) and priority (`LOW`, `MEDIUM`, `HIGH`) enums
- **Subtask support** — tasks can have nested child tasks (self-referencing relation)
- **Tag system** — attach multiple tags to any task; tags are auto-created if they don't exist
- Optional due dates and descriptions
- **Paginated listing** with filtering by status and priority
- Soft-delete support
- Cross-project task listing via `/api/tasks`

### 🔄 Habit Tracking
- Create daily habits linked to your account
- Log habit completion for any date
- **Streak calculation** — get current and longest streaks per habit
- Full CRUD with per-habit logs and history

### 🛡️ Data Validation & Error Handling
- Strict request body validation using Zod schemas
- Centralized error handling middleware with structured error responses
- 404 handler for undefined routes
- Input sanitization and type safety throughout

### 📚 Interactive API Documentation
- Swagger UI available at `/api-docs`
- Full OpenAPI 3.0 specification
- Bearer token auth support via Swagger's **Authorize** button
- Try out every endpoint directly from the browser

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Runtime** | Node.js (v22+) |
| **Language** | TypeScript 6 |
| **Framework** | Express.js 5 |
| **Database ORM** | Prisma 6 |
| **Database** | PostgreSQL |
| **Validation** | Zod 4 |
| **Authentication** | JSON Web Tokens (JWT) |
| **Password Hashing** | bcryptjs |
| **API Docs** | Swagger (swagger-jsdoc + swagger-ui-express) |
| **Dev Server** | ts-node-dev |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm**
- A **PostgreSQL** database (local or cloud — e.g. [Neon](https://neon.tech/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/habit-task-tracker-API.git
   cd habit-task-tracker-API
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**

   Copy the example env file and fill in your values:
   ```bash
   cp .env.example .env
   ```

   ```env
   PORT=5000
   DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
   JWT_SECRET="your-super-secret-key"
   JWT_EXPIRES_IN="7d"
   NODE_ENV="development"
   ```

4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open the interactive API docs**

   Navigate to `http://localhost:5000/api-docs`

---

## 📁 Project Structure

```
habit-task-tracker-API/
├── prisma/
│   └── schema.prisma           # Database models (User, Project, Task, Habit, etc.)
├── src/
│   ├── config/
│   │   ├── db.ts               # Prisma client instance
│   │   └── swagger.ts          # OpenAPI 3.0 spec (full JSDoc definitions)
│   ├── middlewares/
│   │   ├── auth.middleware.ts  # JWT verification middleware
│   │   └── error.middleware.ts # Centralized error handler
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.service.ts
│   │   ├── project/
│   │   │   ├── project.controller.ts
│   │   │   ├── project.routes.ts
│   │   │   └── project.service.ts
│   │   ├── task/
│   │   │   ├── task.controller.ts
│   │   │   ├── task.routes.ts
│   │   │   └── task.service.ts
│   │   └── habit/
│   │       ├── habit.controller.ts
│   │       ├── habit.routes.ts
│   │       └── habit.service.ts
│   ├── utils/
│   │   └── jwt.ts              # JWT sign/verify helpers
│   ├── app.ts                  # Express app setup, middleware & routes
│   └── server.ts               # HTTP server entry point
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload (ts-node-dev) |
| `npm run build` | Generate Prisma client and compile TypeScript to `dist/` |
| `npm start` | Start production server from compiled `dist/server.js` |
| `npm run generate` | Re-generate Prisma client manually |

---

## 📚 API Documentation (Swagger)

This project uses **Swagger UI** for interactive API documentation. You can explore all endpoints, view request/response schemas, and test routes directly from the browser.

### Access Swagger UI

| Environment | URL |
|---|---|
| **Local** | `http://localhost:5000/api-docs` |

### 🔑 Using Bearer Auth in Swagger UI

Protected routes require a JWT token. Here's how to authenticate inside Swagger UI:

1. Call `POST /api/auth/login` with your credentials and **copy the `token`** from the response.
2. Click the **🔒 Authorize** button at the top right of the Swagger UI page.
3. In the **bearerAuth** field, paste your raw token (not `Bearer <token>` — just the token itself).
4. Click **Authorize** → **Close**.
5. All protected endpoints will now **automatically include your token** when you use **Try it out**.

---

## 🌐 API Endpoints

### Auth Routes
| Method | Path | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login and receive JWT | ❌ |

### Project Routes
| Method | Path | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/projects` | Create a new project | ✅ |
| `GET` | `/api/projects` | Get all user's projects | ✅ |
| `GET` | `/api/projects/:id` | Get project by ID | ✅ |
| `PATCH` | `/api/projects/:id` | Update a project | ✅ |
| `DELETE` | `/api/projects/:id` | Soft-delete a project | ✅ |
| `GET` | `/api/projects/:id/stats` | Get project task statistics | ✅ |

### Task Routes
| Method | Path | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/api/tasks` | Get all tasks across all projects (paginated) | ✅ |
| `POST` | `/api/projects/:projectId/tasks` | Create a task in a project | ✅ |
| `GET` | `/api/projects/:projectId/tasks` | Get tasks for a project (paginated, filterable) | ✅ |
| `GET` | `/api/projects/:projectId/tasks/:taskId` | Get a specific task by ID | ✅ |
| `PATCH` | `/api/projects/:projectId/tasks/:taskId` | Update a task | ✅ |
| `DELETE` | `/api/projects/:projectId/tasks/:taskId` | Soft-delete a task | ✅ |
| `POST` | `/api/projects/:projectId/tasks/:taskId/subtasks` | Create a subtask under a task | ✅ |

### Habit Routes
| Method | Path | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/habits` | Create a new habit | ✅ |
| `GET` | `/api/habits` | Get all user's habits | ✅ |
| `GET` | `/api/habits/:habitId` | Get a habit by ID | ✅ |
| `DELETE` | `/api/habits/:habitId` | Delete a habit | ✅ |
| `POST` | `/api/habits/:habitId/logs` | Log habit completion for a date | ✅ |
| `GET` | `/api/habits/:habitId/streak` | Get current and longest streak | ✅ |

---

## 🗄️ Database Schema

The following models are defined in [`prisma/schema.prisma`](./prisma/schema.prisma):

```
User ──< Project ──< Task ──< Task (subtasks, self-referencing)
                         └──< TaskTag >── Tag
User ──< Habit ──< HabitLog
```

| Model | Key Fields |
|---|---|
| `User` | `id`, `email`, `password`, `name` |
| `Project` | `id`, `name`, `description`, `userId`, `deletedAt` |
| `Task` | `id`, `title`, `status`, `priority`, `dueDate`, `parentId`, `projectId`, `deletedAt` |
| `Tag` | `id`, `name` (unique) |
| `TaskTag` | composite PK (`taskId`, `tagId`) |
| `Habit` | `id`, `name`, `userId` |
| `HabitLog` | `id`, `date`, `done`, `habitId` — unique per `(habitId, date)` |

**Enums:**
- `TaskStatus`: `TODO` · `IN_PROGRESS` · `DONE`
- `Priority`: `LOW` · `MEDIUM` · `HIGH`

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<div align="center">
  <p>Built to keep your habits consistent and your tasks organized 📋✅</p>
</div>
