"use server";
import { prisma } from "@/lib/prisma";
import { User } from "@/generated/prisma/";
import type { ProfileStats, UpdateProfileData } from "@/types/profile";
import { revalidatePath } from "next/cache";
import { authClient } from "@/lib/auth-client";
import { redirect as nextRedirect } from "next/navigation";

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

export async function exportUserData(userId: string): Promise<void> {
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
    // TODO : create a pdf file and send the data
    console.log("User data export:", userData);
  } catch (error) {
    console.error("Error exporting user data:", error);
    throw new Error("Failed to export user data");
  }
}

export async function deleteAccount(userId: string): Promise<void> {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    throw new Error("Failed to delete account");
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
