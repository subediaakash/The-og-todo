"use server";
import { prisma } from "@/lib/prisma";
import { User } from "@/generated/prisma/";
import type { ProfileStats, UpdateProfileData } from "@/types/profile";
import { revalidatePath } from "next/cache";
import { authClient } from "@/lib/auth-client";
import { redirect as nextRedirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function getUserProfile(userId: string): Promise<User> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to fetch user profile");
  }
}
export async function getProfileStats(userId: string): Promise<ProfileStats> {
  try {
    const [commitments, streak, todos] = await Promise.all([
      prisma.commitments.findMany({
        where: { userId },
        select: { isCompleted: true },
      }),
      prisma.streak.findUnique({
        where: { userId },
        select: { currentStreak: true, longestStreak: true },
      }),
      prisma.todo.findMany({
        where: { userId },
        select: { hasCompletedAllTasks: true },
      }),
    ]);

    const totalCommitments = commitments.length;
    const completedCommitments = commitments.filter(
      (c) => c.isCompleted
    ).length;
    const totalTodos = todos.length;
    const completedTodos = todos.filter((t) => t.hasCompletedAllTasks).length;
    const completionRate =
      totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

    return {
      totalCommitments,
      completedCommitments,
      currentStreak: streak?.currentStreak || 0,
      longestStreak: streak?.longestStreak || 0,
      totalTodos,
      completionRate,
    };
  } catch (error) {
    console.error("Error calculating profile stats:", error);
    throw new Error("Failed to fetch profile stats");
  }
}
export async function updateUserProfile(
  userId: string,
  data: UpdateProfileData
): Promise<User> {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
        updatedAt: new Date(),
      },
    });

    revalidatePath("/profile");
    return updatedUser;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update profile");
  }
}

export async function exportUserData(userId: string): Promise<string> {
  try {
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        todos: {
          include: {
            task: {
              include: {
                SubTask: true,
              },
            },
            Notes: true,
          },
        },
        Commitments: true,
        Streak: true,
      },
    });

    if (!userData) {
      throw new Error("User not found");
    }

    // Create a clean export object
    const exportData = {
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      },
      todos: userData.todos.map(todo => ({
        id: todo.id,
        createdAt: todo.createdAt,
        updatedAt: todo.updatedAt,
        hasCompletedAllTasks: todo.hasCompletedAllTasks,
        tasks: todo.task.map(task => ({
          id: task.id,
          title: task.title,
          completed: task.completed,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
          subtasks: task.SubTask.map(subtask => ({
            id: subtask.id,
            title: subtask.title,
            completed: subtask.completed,
            createdAt: subtask.createdAt,
            updatedAt: subtask.updatedAt,
          })),
        })),
        notes: todo.Notes.map(note => ({
          id: note.id,
          note: note.note,
          createdAt: note.createdAt,
          updatedAt: note.updatedAt,
        })),
      })),
      commitments: userData.Commitments.map(commitment => ({
        id: commitment.id,
        title: commitment.title,
        description: commitment.description,
        priority: commitment.priority,
        category: commitment.category,
        dueDate: commitment.dueDate,
        isCompleted: commitment.isCompleted,
        createdAt: commitment.createdAt,
        updatedAt: commitment.updatedAt,
      })),
      streak: userData.Streak.map(streak => ({
        id: streak.id,
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        lastUpdated: streak.lastUpdated,
      })),
      exportedAt: new Date().toISOString(),
    };

    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error("Error exporting user data:", error);
    throw new Error("Failed to export user data");
  }
}

export async function deleteAccount(userId: string): Promise<void> {
  try {
    // Start a transaction to ensure all data is deleted atomically
    await prisma.$transaction(async (tx) => {
      // Delete all user sessions first
      await tx.session.deleteMany({
        where: { userId },
      });

      // Delete all user accounts (auth providers)
      await tx.account.deleteMany({
        where: { userId },
      });

      // Delete user streaks
      await tx.streak.deleteMany({
        where: { userId },
      });

      // Delete user commitments
      await tx.commitments.deleteMany({
        where: { userId },
      });

      // Delete notes associated with user todos
      const userTodos = await tx.todo.findMany({
        where: { userId },
        select: { id: true },
      });

      if (userTodos.length > 0) {
        const todoIds = userTodos.map(todo => todo.id);
        
        await tx.notes.deleteMany({
          where: { todoId: { in: todoIds } },
        });

        // Get all tasks for these todos
        const userTasks = await tx.task.findMany({
          where: { todoId: { in: todoIds } },
          select: { id: true },
        });

        if (userTasks.length > 0) {
          const taskIds = userTasks.map(task => task.id);
          
          // Delete all subtasks
          await tx.subTask.deleteMany({
            where: { taskId: { in: taskIds } },
          });

          // Delete all tasks
          await tx.task.deleteMany({
            where: { todoId: { in: todoIds } },
          });
        }

        // Delete all todos
        await tx.todo.deleteMany({
          where: { userId },
        });
      }

      // Finally, delete the user
      await tx.user.delete({
        where: { id: userId },
      });
    });

    // Revalidate paths to ensure UI updates
    revalidatePath("/");
    revalidatePath("/profile");
  } catch (error) {
    console.error("Error deleting account:", error);
    throw new Error("Failed to delete account. Please try again.");
  }
}

// export async function logoutUser(): Promise<
//   boolean | { success: boolean; error?: string }
// > {
//   const router = useRouter();
//   try {
//     await authClient.signOut();
//     router.push("/login");
//     return { success: true };
//   } catch (error) {
//     console.error("Sign out failed:", error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Failed to sign out",
//     };
//   }
// }

function redirect(url: string): never {
  return nextRedirect(url);
}
