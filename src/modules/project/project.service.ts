import prisma from "../../config/db";
import { TaskStatus, Priority } from "../../generated/prisma";

export interface CreateProjectInput {
  name: string;
  description?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
}

export const createProjectService = async (
  userId: string,
  input: CreateProjectInput,
) => {
  const project = await prisma.project.create({
    data: {
      ...input,
      userId,
    },
  });
  return project;
};

export const getProjectsService = async (userId: string) => {
  const projects = await prisma.project.findMany({
    where: {
      userId,
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return projects;
};

export const getProjectByIdService = async (
  userId: string,
  projectId: string,
) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
      deletedAt: null,
    },
  });

  if (!project) {
    const error: any = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }

  return project;
};

export const updateProjectService = async (
  userId: string,
  projectId: string,
  input: UpdateProjectInput,
) => {
  await getProjectByIdService(userId, projectId);

  const project = await prisma.project.update({
    where: { id: projectId },
    data: input,
  });

  return project;
};

export const deleteProjectService = async (
  userId: string,
  projectId: string,
) => {
  await getProjectByIdService(userId, projectId);

  await prisma.project.update({
    where: { id: projectId },
    data: { deletedAt: new Date() },
  });
};

export const getProjectStatsService = async (
  userId: string,
  projectId: string,
) => {
  // verify project belongs to user
  await getProjectByIdService(userId, projectId);

  const [statusStats, priorityStats, total] = await Promise.all([
    prisma.task.groupBy({
      by: ["status"],
      where: { projectId, deletedAt: null },
      _count: { status: true },
    }),
    prisma.task.groupBy({
      by: ["priority"],
      where: { projectId, deletedAt: null },
      _count: { priority: true },
    }),
    prisma.task.count({
      where: { projectId, deletedAt: null },
    }),
  ]);

  return {
    total,
    byStatus: statusStats.map((s: { status: TaskStatus; _count: { status: number } }) => ({
      status: s.status,
      count: s._count.status,
    })),
    byPriority: priorityStats.map((p: { priority: Priority; _count: { priority: number } }) => ({
      priority: p.priority,
      count: p._count.priority,
    })),
  };
};
