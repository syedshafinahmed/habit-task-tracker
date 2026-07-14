import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import {
  createHabit,
  getHabits,
  getHabitById,
  logHabit,
  getHabitStreak,
  deleteHabit,
} from "./habit.controller";

const router = Router();

router.use(authMiddleware);

router.post("/", createHabit);
router.get("/", getHabits);
router.get("/:habitId", getHabitById);
router.delete("/:habitId", deleteHabit);
router.post("/:habitId/logs", logHabit);
router.get("/:habitId/streak", getHabitStreak);

export default router;
