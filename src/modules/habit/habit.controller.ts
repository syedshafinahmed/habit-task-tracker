import { Response, NextFunction } from "express";
import { z } from "zod";
import { AuthRequest } from "../../middlewares/auth.middleware";
import {
  createHabitService,
  getHabitsService,
  getHabitByIdService,
  logHabitService,
  getHabitStreakService,
  deleteHabitService,
} from "./habit.service";

const createHabitSchema = z.object({
  name: z.string().min(1, "Habit name is required"),
});

const logHabitSchema = z.object({
  date: z.string().optional(),
});

export const createHabit = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const input = createHabitSchema.parse(req.body);
    const habit = await createHabitService(req.userId!, input);
    res.status(201).json({
      success: true,
      message: "Habit created successfully",
      data: habit,
    });
  } catch (err) {
    next(err);
  }
};

export const getHabits = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const habits = await getHabitsService(req.userId!);
    res.status(200).json({
      success: true,
      message: "Habits fetched successfully",
      data: habits,
    });
  } catch (err) {
    next(err);
  }
};

export const getHabitById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const habit = await getHabitByIdService(
      req.params.habitId as string,
      req.userId!,
    );
    res.status(200).json({
      success: true,
      message: "Habit fetched successfully",
      data: habit,
    });
  } catch (err) {
    next(err);
  }
};

export const logHabit = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const input = logHabitSchema.parse(req.body);
    const log = await logHabitService(
      req.params.habitId as string,
      req.userId!,
      input,
    );
    res.status(201).json({
      success: true,
      message: "Habit logged successfully",
      data: log,
    });
  } catch (err) {
    next(err);
  }
};

export const getHabitStreak = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await getHabitStreakService(
      req.params.habitId as string,
      req.userId!,
    );
    res.status(200).json({
      success: true,
      message: "Habit streak fetched successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteHabit = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await deleteHabitService(req.params.habitId as string, req.userId!);
    res.status(200).json({
      success: true,
      message: "Habit deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
