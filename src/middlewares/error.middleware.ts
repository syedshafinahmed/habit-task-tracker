import { Request, Response, NextFunction } from "express";
import { Prisma } from "../generated/prisma";
import { ZodError } from "zod";

export interface AppError extends Error {
  statusCode?: number;
}

const errorMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation error",
      errors: err.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
    return;
  }

  // Prisma known errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      res.status(409).json({
        success: false,
        message: "A record with this value already exists",
      });
      return;
    }
    if (err.code === "P2025") {
      res.status(404).json({
        success: false,
        message: "Record not found",
      });
      return;
    }
  }

  // Generic / custom errors
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

export default errorMiddleware;
