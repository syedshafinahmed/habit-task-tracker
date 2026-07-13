import express, { Application, Request, Response } from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
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

// Routes 
app.use("/api/auth", authRoutes);


// Error middleware 
app.use(errorMiddleware);

export default app;
