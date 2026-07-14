import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  createSubtask,
} from "./task.controller";

const router = Router({ mergeParams: true });

router.use(authMiddleware);

router.post("/", createTask);
router.get("/", getTasks);
router.get("/:taskId", getTaskById);
router.patch("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);
router.post("/:taskId/subtasks", createSubtask);

export default router;
