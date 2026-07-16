import { Response, NextFunction } from "express";
import { z } from "zod";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { TaskStatus, Priority } from "@prisma/client";
import {
  createTaskService,
  getTasksService,
  getTaskByIdService,
  updateTaskService,
  deleteTaskService,
  createSubtaskService,
  getAllTasksService,
} from "./task.service";

const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(TaskStatus).optional(),
  priority: z.enum(Priority).optional(),
  dueDate: z.string().optional(),
  parentId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  status: z.enum(TaskStatus).optional(),
  priority: z.enum(Priority).optional(),
  dueDate: z.string().optional(),
});

export const createTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const input = createTaskSchema.parse(req.body);
    const task = await createTaskService(
      req.userId!,
      req.params.projectId as string,
      input,
    );
    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

export const getTasks = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    const result = await getTasksService({
      projectId: req.params.projectId as string,
      status: req.query.status as TaskStatus | undefined,
      priority: req.query.priority as Priority | undefined,
      page: isNaN(page) || page < 1 ? 1 : page,
      limit: isNaN(limit) || limit < 1 ? 10 : limit,
    });
    res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const getTaskById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const task = await getTaskByIdService(
      req.params.taskId as string,
      req.userId!, // ! is a TypeScript non-null assertion operator. Guaranteed by authMiddleware
    );
    res.status(200).json({
      success: true,
      message: "Task fetched successfully",
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const input = updateTaskSchema.parse(req.body);
    const task = await updateTaskService(
      req.params.taskId as string,
      req.userId!,
      input,
    );
    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await deleteTaskService(req.params.taskId as string, req.userId!);
    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const createSubtask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const input = createTaskSchema.parse(req.body);
    const subtask = await createSubtaskService(
      req.params.taskId as string,
      req.userId!,
      input,
    );
    res.status(201).json({
      success: true,
      message: "Subtask created successfully",
      data: subtask,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllTasks = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    const result = await getAllTasksService(req.userId!, {
      status: req.query.status as TaskStatus | undefined,
      priority: req.query.priority as Priority | undefined,
      page: isNaN(page) || page < 1 ? 1 : page,
      limit: isNaN(limit) || limit < 1 ? 10 : limit,
    });
    res.status(200).json({
      success: true,
      message: "All tasks fetched successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
