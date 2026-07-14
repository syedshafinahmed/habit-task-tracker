import prisma from "../../config/db";

export interface CreateHabitInput {
  name: string;
}

export interface LogHabitInput {
  date?: string;
}

export const createHabitService = async (
  userId: string,
  input: CreateHabitInput,
) => {
  const habit = await prisma.habit.create({
    data: {
      name: input.name,
      userId,
    },
  });
  return habit;
};

export const getHabitsService = async (userId: string) => {
  const habits = await prisma.habit.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { logs: true } },
    },
  });
  return habits;
};

export const getHabitByIdService = async (habitId: string, userId: string) => {
  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId },
  });

  if (!habit) {
    const error: any = new Error("Habit not found");
    error.statusCode = 404;
    throw error;
  }

  return habit;
};

export const logHabitService = async (
  habitId: string,
  userId: string,
  input: LogHabitInput,
) => {
  await getHabitByIdService(habitId, userId);

  const date = input.date ? new Date(input.date) : new Date();
  // normalize to midnight Bangladesh time (UTC+6)
  date.setUTCHours(18, 0, 0, 0);

  const log = await prisma.habitLog.create({
    data: {
      habitId,
      date,
      done: true,
    },
  });

  return log;
};

export const getHabitStreakService = async (
  habitId: string,
  userId: string,
) => {
  await getHabitByIdService(habitId, userId);

  const logs = await prisma.habitLog.findMany({
    where: { habitId, done: true },
    orderBy: { date: "desc" },
    select: { date: true },
  });

  if (logs.length === 0) {
    return { streak: 0, totalLogs: 0 };
  }

  let streak = 1;
  for (let i = 0; i < logs.length - 1; i++) {
    const current = new Date(logs[i].date);
    const next = new Date(logs[i + 1].date);

    const diffInDays =
      (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24);

    if (diffInDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return { streak, totalLogs: logs.length };
};

export const deleteHabitService = async (habitId: string, userId: string) => {
  await getHabitByIdService(habitId, userId);

  await prisma.habit.delete({
    where: { id: habitId },
  });
};
