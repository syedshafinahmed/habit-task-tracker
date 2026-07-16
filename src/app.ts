import express, { Application, Request, Response } from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import projectRoutes from "./modules/project/project.routes";
import taskRoutes, { standaloneTaskRouter } from "./modules/task/task.routes";
import habitRoutes from "./modules/habit/habit.routes";
import errorMiddleware from "./middlewares/error.middleware";

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route - API entry point
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Habit Task Tracker",
    version: "1.0.0",
    status: "running",
    documentation: "coming-soon",
  });
});

// Health check route
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", standaloneTaskRouter);
app.use("/api/projects/:projectId/tasks", taskRoutes);
app.use("/api/habits", habitRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Error middleware
app.use(errorMiddleware);

export default app;
