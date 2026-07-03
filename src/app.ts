import express, { Application, Request, Response } from "express";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware";

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

// Routes will be mounted here in later phases
// app.use("/api/auth", authRoutes);
// app.use("/api/projects", projectRoutes);
// app.use("/api/tasks", taskRoutes);
// app.use("/api/habits", habitRoutes);

// Error middleware — must be last
app.use(errorMiddleware);

export default app;
