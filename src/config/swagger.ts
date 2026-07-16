import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Habit & Task Tracker API",
      version: "1.0.0",
      description:
        "A RESTful API for tracking habits and managing tasks/projects. Supports user authentication, project management, task management with subtasks, and habit tracking with streaks.",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server",
      },
      {
        url: "https://habit-task-tracker.onrender.com",
        description: "Production Render server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token obtained from the login endpoint.",
        },
      },
      schemas: {
        // ── Auth ──────────────────────────────────────────────────────────
        RegisterRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "user@example.com" },
            password: {
              type: "string",
              minLength: 6,
              example: "Pass@123",
              description:
                "Min 6 chars, must include uppercase, lowercase, and a special character.",
            },
            name: { type: "string", example: "John Doe" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "user@example.com" },
            password: { type: "string", example: "Pass@123" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Login successful" },
            data: {
              type: "object",
              properties: {
                token: {
                  type: "string",
                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                },
                user: {
                  type: "object",
                  properties: {
                    id: { type: "string", example: "cuid_abc123" },
                    email: { type: "string", example: "user@example.com" },
                    name: { type: "string", example: "John Doe" },
                  },
                },
              },
            },
          },
        },

        // ── Project ───────────────────────────────────────────────────────
        CreateProjectRequest: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", minLength: 1, example: "My Project" },
            description: { type: "string", example: "A sample project description" },
          },
        },
        UpdateProjectRequest: {
          type: "object",
          properties: {
            name: { type: "string", minLength: 1, example: "Updated Project Name" },
            description: { type: "string", example: "Updated description" },
          },
        },
        Project: {
          type: "object",
          properties: {
            id: { type: "string", example: "cuid_abc123" },
            name: { type: "string", example: "My Project" },
            description: { type: "string", example: "Project description" },
            userId: { type: "string", example: "cuid_user123" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ProjectStats: {
          type: "object",
          properties: {
            totalTasks: { type: "integer", example: 10 },
            completedTasks: { type: "integer", example: 4 },
            inProgressTasks: { type: "integer", example: 3 },
            todoTasks: { type: "integer", example: 3 },
          },
        },

        // ── Task ──────────────────────────────────────────────────────────
        TaskStatus: {
          type: "string",
          enum: ["TODO", "IN_PROGRESS", "DONE"],
          example: "TODO",
        },
        Priority: {
          type: "string",
          enum: ["LOW", "MEDIUM", "HIGH"],
          example: "MEDIUM",
        },
        CreateTaskRequest: {
          type: "object",
          required: ["title"],
          properties: {
            title: { type: "string", minLength: 1, example: "Design homepage" },
            description: { type: "string", example: "Create wireframes for the homepage" },
            status: { $ref: "#/components/schemas/TaskStatus" },
            priority: { $ref: "#/components/schemas/Priority" },
            dueDate: {
              type: "string",
              example: "2026-08-01T00:00:00.000Z",
              description: "ISO 8601 date string",
            },
            parentId: { type: "string", example: "cuid_parent_task" },
            tags: {
              type: "array",
              items: { type: "string" },
              example: ["design", "frontend"],
            },
          },
        },
        UpdateTaskRequest: {
          type: "object",
          properties: {
            title: { type: "string", minLength: 1, example: "Updated task title" },
            description: { type: "string", example: "Updated description" },
            status: { $ref: "#/components/schemas/TaskStatus" },
            priority: { $ref: "#/components/schemas/Priority" },
            dueDate: { type: "string", example: "2026-09-01T00:00:00.000Z" },
          },
        },
        Task: {
          type: "object",
          properties: {
            id: { type: "string", example: "cuid_task123" },
            title: { type: "string", example: "Design homepage" },
            description: { type: "string", example: "Create wireframes" },
            status: { $ref: "#/components/schemas/TaskStatus" },
            priority: { $ref: "#/components/schemas/Priority" },
            dueDate: { type: "string", format: "date-time", nullable: true },
            projectId: { type: "string", example: "cuid_project123" },
            userId: { type: "string", example: "cuid_user123" },
            parentId: { type: "string", nullable: true, example: null },
            tags: {
              type: "array",
              items: { type: "string" },
              example: ["design"],
            },
            subtasks: {
              type: "array",
              items: { $ref: "#/components/schemas/Task" },
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        PaginatedTasks: {
          type: "object",
          properties: {
            tasks: {
              type: "array",
              items: { $ref: "#/components/schemas/Task" },
            },
            total: { type: "integer", example: 25 },
            page: { type: "integer", example: 1 },
            limit: { type: "integer", example: 10 },
            totalPages: { type: "integer", example: 3 },
          },
        },

        // ── Habit ─────────────────────────────────────────────────────────
        CreateHabitRequest: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", minLength: 1, example: "Morning run" },
          },
        },
        LogHabitRequest: {
          type: "object",
          properties: {
            date: {
              type: "string",
              example: "2026-07-17",
              description: "ISO date string (defaults to today if omitted)",
            },
          },
        },
        Habit: {
          type: "object",
          properties: {
            id: { type: "string", example: "cuid_habit123" },
            name: { type: "string", example: "Morning run" },
            userId: { type: "string", example: "cuid_user123" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        HabitLog: {
          type: "object",
          properties: {
            id: { type: "string", example: "cuid_log123" },
            habitId: { type: "string", example: "cuid_habit123" },
            date: { type: "string", format: "date-time" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        HabitStreak: {
          type: "object",
          properties: {
            currentStreak: { type: "integer", example: 7 },
            longestStreak: { type: "integer", example: 14 },
            totalLogs: { type: "integer", example: 30 },
          },
        },

        // ── Common ────────────────────────────────────────────────────────
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Operation successful" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "An error occurred" },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    tags: [
      { name: "Auth", description: "User registration and authentication" },
      { name: "Projects", description: "Project management endpoints" },
      { name: "Tasks", description: "Task management endpoints (per-project and global)" },
      { name: "Habits", description: "Habit tracking and streak endpoints" },
    ],
    paths: {
      // ═══════════════════════════════════════════════════════════════════
      // AUTH
      // ═══════════════════════════════════════════════════════════════════
      "/api/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Register a new user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RegisterRequest" },
              },
            },
          },
          responses: {
            "201": {
              description: "User registered successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/AuthResponse" },
                },
              },
            },
            "400": {
              description: "Validation error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            "409": {
              description: "Email already in use",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
      "/api/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login with email and password",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
              },
            },
          },
          responses: {
            "200": {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/AuthResponse" },
                },
              },
            },
            "400": {
              description: "Validation error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            "401": {
              description: "Invalid credentials",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },

      // ═══════════════════════════════════════════════════════════════════
      // PROJECTS
      // ═══════════════════════════════════════════════════════════════════
      "/api/projects": {
        post: {
          tags: ["Projects"],
          summary: "Create a new project",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateProjectRequest" },
              },
            },
          },
          responses: {
            "201": {
              description: "Project created",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/SuccessResponse" },
                      {
                        type: "object",
                        properties: {
                          data: { $ref: "#/components/schemas/Project" },
                        },
                      },
                    ],
                  },
                },
              },
            },
            "400": { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
        get: {
          tags: ["Projects"],
          summary: "Get all projects for the authenticated user",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Projects fetched",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/SuccessResponse" },
                      {
                        type: "object",
                        properties: {
                          data: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Project" },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },
      "/api/projects/{id}": {
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Project ID",
          },
        ],
        get: {
          tags: ["Projects"],
          summary: "Get a project by ID",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Project fetched",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/SuccessResponse" },
                      { type: "object", properties: { data: { $ref: "#/components/schemas/Project" } } },
                    ],
                  },
                },
              },
            },
            "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            "404": { description: "Project not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
        patch: {
          tags: ["Projects"],
          summary: "Update a project",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UpdateProjectRequest" },
              },
            },
          },
          responses: {
            "200": {
              description: "Project updated",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/SuccessResponse" },
                      { type: "object", properties: { data: { $ref: "#/components/schemas/Project" } } },
                    ],
                  },
                },
              },
            },
            "400": { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            "404": { description: "Project not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
        delete: {
          tags: ["Projects"],
          summary: "Delete a project",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Project deleted",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/SuccessResponse" },
                },
              },
            },
            "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            "404": { description: "Project not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },
      "/api/projects/{id}/stats": {
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Project ID",
          },
        ],
        get: {
          tags: ["Projects"],
          summary: "Get task statistics for a project",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Project stats fetched",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/SuccessResponse" },
                      { type: "object", properties: { data: { $ref: "#/components/schemas/ProjectStats" } } },
                    ],
                  },
                },
              },
            },
            "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            "404": { description: "Project not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },

      // ═══════════════════════════════════════════════════════════════════
      // TASKS (global)
      // ═══════════════════════════════════════════════════════════════════
      "/api/tasks": {
        get: {
          tags: ["Tasks"],
          summary: "Get all tasks for the authenticated user (across all projects)",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "status", in: "query", schema: { $ref: "#/components/schemas/TaskStatus" }, description: "Filter by status" },
            { name: "priority", in: "query", schema: { $ref: "#/components/schemas/Priority" }, description: "Filter by priority" },
            { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "Page number" },
            { name: "limit", in: "query", schema: { type: "integer", default: 10 }, description: "Items per page" },
          ],
          responses: {
            "200": {
              description: "All tasks fetched",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/SuccessResponse" },
                      { type: "object", properties: { data: { $ref: "#/components/schemas/PaginatedTasks" } } },
                    ],
                  },
                },
              },
            },
            "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },

      // ═══════════════════════════════════════════════════════════════════
      // TASKS (per-project)
      // ═══════════════════════════════════════════════════════════════════
      "/api/projects/{projectId}/tasks": {
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Project ID",
          },
        ],
        post: {
          tags: ["Tasks"],
          summary: "Create a task in a project",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateTaskRequest" },
              },
            },
          },
          responses: {
            "201": {
              description: "Task created",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/SuccessResponse" },
                      { type: "object", properties: { data: { $ref: "#/components/schemas/Task" } } },
                    ],
                  },
                },
              },
            },
            "400": { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            "404": { description: "Project not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
        get: {
          tags: ["Tasks"],
          summary: "Get all tasks in a project",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "status", in: "query", schema: { $ref: "#/components/schemas/TaskStatus" }, description: "Filter by status" },
            { name: "priority", in: "query", schema: { $ref: "#/components/schemas/Priority" }, description: "Filter by priority" },
            { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "Page number" },
            { name: "limit", in: "query", schema: { type: "integer", default: 10 }, description: "Items per page" },
          ],
          responses: {
            "200": {
              description: "Tasks fetched",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/SuccessResponse" },
                      { type: "object", properties: { data: { $ref: "#/components/schemas/PaginatedTasks" } } },
                    ],
                  },
                },
              },
            },
            "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },
      "/api/projects/{projectId}/tasks/{taskId}": {
        parameters: [
          { name: "projectId", in: "path", required: true, schema: { type: "string" }, description: "Project ID" },
          { name: "taskId", in: "path", required: true, schema: { type: "string" }, description: "Task ID" },
        ],
        get: {
          tags: ["Tasks"],
          summary: "Get a task by ID",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Task fetched",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/SuccessResponse" },
                      { type: "object", properties: { data: { $ref: "#/components/schemas/Task" } } },
                    ],
                  },
                },
              },
            },
            "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            "404": { description: "Task not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
        patch: {
          tags: ["Tasks"],
          summary: "Update a task",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UpdateTaskRequest" },
              },
            },
          },
          responses: {
            "200": {
              description: "Task updated",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/SuccessResponse" },
                      { type: "object", properties: { data: { $ref: "#/components/schemas/Task" } } },
                    ],
                  },
                },
              },
            },
            "400": { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            "404": { description: "Task not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
        delete: {
          tags: ["Tasks"],
          summary: "Delete a task",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Task deleted",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/SuccessResponse" },
                },
              },
            },
            "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            "404": { description: "Task not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },
      "/api/projects/{projectId}/tasks/{taskId}/subtasks": {
        parameters: [
          { name: "projectId", in: "path", required: true, schema: { type: "string" }, description: "Project ID" },
          { name: "taskId", in: "path", required: true, schema: { type: "string" }, description: "Parent Task ID" },
        ],
        post: {
          tags: ["Tasks"],
          summary: "Create a subtask under an existing task",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateTaskRequest" },
              },
            },
          },
          responses: {
            "201": {
              description: "Subtask created",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/SuccessResponse" },
                      { type: "object", properties: { data: { $ref: "#/components/schemas/Task" } } },
                    ],
                  },
                },
              },
            },
            "400": { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            "404": { description: "Parent task not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },

      // ═══════════════════════════════════════════════════════════════════
      // HABITS
      // ═══════════════════════════════════════════════════════════════════
      "/api/habits": {
        post: {
          tags: ["Habits"],
          summary: "Create a new habit",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateHabitRequest" },
              },
            },
          },
          responses: {
            "201": {
              description: "Habit created",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/SuccessResponse" },
                      { type: "object", properties: { data: { $ref: "#/components/schemas/Habit" } } },
                    ],
                  },
                },
              },
            },
            "400": { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
        get: {
          tags: ["Habits"],
          summary: "Get all habits for the authenticated user",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Habits fetched",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/SuccessResponse" },
                      {
                        type: "object",
                        properties: {
                          data: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Habit" },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },
      "/api/habits/{habitId}": {
        parameters: [
          { name: "habitId", in: "path", required: true, schema: { type: "string" }, description: "Habit ID" },
        ],
        get: {
          tags: ["Habits"],
          summary: "Get a habit by ID",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Habit fetched",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/SuccessResponse" },
                      { type: "object", properties: { data: { $ref: "#/components/schemas/Habit" } } },
                    ],
                  },
                },
              },
            },
            "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            "404": { description: "Habit not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
        delete: {
          tags: ["Habits"],
          summary: "Delete a habit",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Habit deleted",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/SuccessResponse" },
                },
              },
            },
            "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            "404": { description: "Habit not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },
      "/api/habits/{habitId}/logs": {
        parameters: [
          { name: "habitId", in: "path", required: true, schema: { type: "string" }, description: "Habit ID" },
        ],
        post: {
          tags: ["Habits"],
          summary: "Log a habit completion for a date",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: false,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LogHabitRequest" },
              },
            },
          },
          responses: {
            "201": {
              description: "Habit logged",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/SuccessResponse" },
                      { type: "object", properties: { data: { $ref: "#/components/schemas/HabitLog" } } },
                    ],
                  },
                },
              },
            },
            "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            "404": { description: "Habit not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },
      "/api/habits/{habitId}/streak": {
        parameters: [
          { name: "habitId", in: "path", required: true, schema: { type: "string" }, description: "Habit ID" },
        ],
        get: {
          tags: ["Habits"],
          summary: "Get the current streak and stats for a habit",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Habit streak fetched",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/SuccessResponse" },
                      { type: "object", properties: { data: { $ref: "#/components/schemas/HabitStreak" } } },
                    ],
                  },
                },
              },
            },
            "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            "404": { description: "Habit not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },
    },
  },
  apis: [], // paths defined inline above; no file scanning needed
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
