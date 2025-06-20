"use server";
import { prisma } from "@/lib/prisma";

export async function checkStreak(userId: string): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // First get the current streak record
  let streak = await prisma.streak.findFirst({
    where: { userId: userId },
  });

  if (streak?.lastUpdated && new Date(streak.lastUpdated) >= today) {
    return streak.currentStreak;
  }

  // Create date strings for today and yesterday
  const todayStr = today.toDateString();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  // Fetch todos for the user
  const todos = await prisma.todo.findMany({
    where: { userId: userId },
    select: {
      hasCompletedAllTasks: true,
      updatedAt: true,
    },
  });

  // Find today's and yesterday's todos (if any)
  const todaysTodo = todos.find((todo) => {
    const updated = new Date(todo.updatedAt);
    return updated.toDateString() === todayStr;
  });
  const yesterdaysTodo = todos.find((todo) => {
    const updated = new Date(todo.updatedAt);
    return updated.toDateString() === yesterdayStr;
  });

  let newStreak = 0;

  if (todaysTodo?.hasCompletedAllTasks) {
    if (yesterdaysTodo?.hasCompletedAllTasks) {
      // Continue the streak
      newStreak = (streak?.currentStreak || 0) + 1;
    } else {
      // Start a new streak
      newStreak = 1;
    }
  }
  // else case: streak remains 0

  // Update longest streak if current is higher
  const longestStreak = streak
    ? Math.max(newStreak, streak.longestStreak)
    : newStreak;

  if (streak) {
    await prisma.streak.update({
      where: { id: streak.id },
      data: {
        currentStreak: newStreak,
        longestStreak: longestStreak,
        lastUpdated: new Date(), // Mark that we've updated today
      },
    });
  } else {
    await prisma.streak.create({
      data: {
        currentStreak: newStreak,
        longestStreak: longestStreak,
        userId: userId,
        lastUpdated: new Date(),
      },
    });
  }

  return newStreak;
}

export async function getCompletedTodos(userId: string) {
  const todos = await prisma.todo.findMany({
    where: {
      userId: userId,
    },
    select: {
      hasCompletedAllTasks: true,
      updatedAt: true,
    },
  });
  return todos;
}

export async function getCurrentStreak(userId: string) {
  await checkStreak(userId);
  const streak = await prisma.streak.findFirst({
    where: { userId: userId },
    select: {
      currentStreak: true,
      longestStreak: true,
    },
  });

  return {
    currentStreak: streak?.currentStreak || 0,
    longestStreak: streak?.longestStreak || 0,
  };
}

// Types (types.ts)
export interface Todo {
  hasCompletedAllTasks: boolean;
  updatedAt: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
}

export interface CompletedDay {
  day: number;
  isCompleted: boolean;
}
