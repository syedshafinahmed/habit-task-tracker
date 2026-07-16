import prisma from "../../config/db";
import { TaskStatus, Priority } from "@prisma/client";

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  dueDate?: string;
  parentId?: string;
  tags?: string[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  dueDate?: string;
}

export interface GetTasksQuery {
  projectId: string;
  status?: TaskStatus;
  priority?: Priority;
  page?: number;
  limit?: number;
}

export const createTaskService = async (
  userId: string,
  projectId: string,
  input: CreateTaskInput,
) => {
  // verify project belongs to user
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId, deletedAt: null },
  });

  if (!project) {
    const error: any = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }

  // verify parent task exists if parentId is provided
  if (input.parentId) {
    const parentTask = await prisma.task.findFirst({
      where: { id: input.parentId, projectId, deletedAt: null },
    });

    if (!parentTask) {
      const error: any = new Error("Parent task not found");
      error.statusCode = 404;
      throw error;
    }
  }

  const { tags, dueDate, ...rest } = input;

  const task = await prisma.task.create({
    data: {
      ...rest,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      projectId,
      tags: tags
        ? {
            create: tags.map((name) => ({
              tag: {
                connectOrCreate: {
                  where: { name },
                  create: { name },
                },
              },
            })),
          }
        : undefined,
    },
    include: {
      tags: {
        include: { tag: true },
      },
    },
  });

  return task;
};

export const getTasksService = async (query: GetTasksQuery) => {
  const { projectId, status, priority, page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

  const where = {
    projectId,
    deletedAt: null,
    ...(status && { status }),
    ...(priority && { priority }),
  };

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        tags: { include: { tag: true } },
        subtasks: {
          where: { deletedAt: null },
          select: { id: true, title: true, status: true },
        },
      },
    }),
    prisma.task.count({ where }),
  ]);

  return {
    tasks,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getTaskByIdService = async (taskId: string, userId: string) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      deletedAt: null,
      project: { userId },
    },
    include: {
      tags: { include: { tag: true } },
      subtasks: {
        where: { deletedAt: null },
        select: { id: true, title: true, status: true, priority: true },
      },
    },
  });

  if (!task) {
    const error: any = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }

  return task;
};

export const updateTaskService = async (
  taskId: string,
  userId: string,
  input: UpdateTaskInput,
) => {
  await getTaskByIdService(taskId, userId);

  const { dueDate, ...rest } = input;

  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...rest,
      ...(dueDate && { dueDate: new Date(dueDate) }),
    },
    include: {
      tags: { include: { tag: true } },
    },
  });

  return task;
};

export const deleteTaskService = async (taskId: string, userId: string) => {
  await getTaskByIdService(taskId, userId);

  await prisma.task.update({
    where: { id: taskId },
    data: { deletedAt: new Date() },
  });
};

export const createSubtaskService = async (
  parentId: string,
  userId: string,
  input: CreateTaskInput,
) => {
  const parentTask = await getTaskByIdService(parentId, userId);

  return createTaskService(userId, parentTask.projectId, {
    ...input,
    parentId,
  });
};

export const getAllTasksService = async (
  userId: string,
  query: Omit<GetTasksQuery, "projectId">,
) => {
  const { status, priority, page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,
    project: { userId },
    ...(status && { status }),
    ...(priority && { priority }),
  };

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        tags: { include: { tag: true } },
        subtasks: {
          where: { deletedAt: null },
          select: { id: true, title: true, status: true },
        },
        project: {
          select: { id: true, name: true },
        },
      },
    }),
    prisma.task.count({ where }),
  ]);

  return {
    tasks,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
