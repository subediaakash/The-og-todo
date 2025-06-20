"use server";

import { prisma } from "@/lib/prisma";
import { Commitments, Priority } from "@/generated/prisma";
import { revalidatePath } from "next/cache";

// Enhanced interface for commitment stats
export interface CommitmentStats {
  totalCommitments: number;
  completedCommitments: number;
  activeCommitments: number;
  completionRate: number;
  overdue: number;
  dueSoon: number; // Due within 7 days
}

// Interface for creating a new commitment
export type CreateCommitmentInput = Pick<
  Commitments,
  "title" | "description" | "priority" | "category" | "dueDate"
>;

// Interface for updating a commitment
export type UpdateCommitmentInput = Partial<
  Pick<
    Commitments,
    | "title"
    | "description"
    | "priority"
    | "category"
    | "dueDate"
    | "isCompleted"
  >
>;

// Interface for filtering commitments
export interface CommitmentFilters {
  priority?: Priority;
  category?: string;
  isCompleted?: boolean;
  overdue?: boolean;
  dueSoon?: boolean;
}

/**
 * Fetches all commitments for a user with optional filtering
 */
export async function getCommitments(
  userId: string,
  filters?: CommitmentFilters
): Promise<Commitments[]> {
  try {
    if (!userId?.trim()) {
      throw new Error("User ID is required");
    }

    const where: any = { userId };
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Apply filters
    if (filters) {
      if (filters.priority) {
        where.priority = filters.priority;
      }

      if (filters.category) {
        where.category = filters.category;
      }

      if (typeof filters.isCompleted === "boolean") {
        where.isCompleted = filters.isCompleted;
      }

      if (filters.overdue) {
        where.dueDate = { lt: now };
        where.isCompleted = false;
      }

      if (filters.dueSoon) {
        where.dueDate = {
          gte: now,
          lte: weekFromNow,
        };
        where.isCompleted = false;
      }
    }

    const commitments = await prisma.commitments.findMany({
      where: {
        userId: userId,
      },
      orderBy: [
        { isCompleted: "asc" }, // Show incomplete first
        { priority: "desc" }, // High priority first
        { dueDate: "asc" }, // Earliest due date first
        { createdAt: "desc" },
      ],
    });

    return commitments;
  } catch (error) {
    console.error("Error fetching commitments:", error);
    throw new Error(
      `Failed to fetch commitments: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Fetches comprehensive commitment statistics for a user
 */
export async function getCommitmentStats(
  userId: string
): Promise<CommitmentStats> {
  try {
    if (!userId?.trim()) {
      throw new Error("User ID is required");
    }

    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const [total, completed, overdue, dueSoon] = await Promise.all([
      prisma.commitments.count({
        where: { userId },
      }),
      prisma.commitments.count({
        where: { userId, isCompleted: true },
      }),
      prisma.commitments.count({
        where: {
          userId,
          isCompleted: false,
          dueDate: { lt: now },
        },
      }),
      prisma.commitments.count({
        where: {
          userId,
          isCompleted: false,
          dueDate: {
            gte: now,
            lte: weekFromNow,
          },
        },
      }),
    ]);

    const activeCommitments = total - completed;
    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      totalCommitments: total,
      completedCommitments: completed,
      activeCommitments,
      completionRate,
      overdue,
      dueSoon,
    };
  } catch (error) {
    console.error("Error fetching commitment stats:", error);
    throw new Error(
      `Failed to fetch commitment stats: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Creates a new commitment for a user
 */
export async function addCommitment(
  userId: string,
  commitment: CreateCommitmentInput
): Promise<Commitments> {
  try {
    if (!userId?.trim()) {
      throw new Error("User ID is required");
    }

    // Validate required fields
    if (!commitment.title?.trim()) {
      throw new Error("Title is required");
    }

    if (!commitment.description?.trim()) {
      throw new Error("Description is required");
    }

    if (!commitment.category?.trim()) {
      throw new Error("Category is required");
    }

    if (!commitment.dueDate) {
      throw new Error("Due date is required");
    }

    if (!Object.values(Priority).includes(commitment.priority)) {
      throw new Error("Valid priority is required");
    }

    // Ensure due date is in the future
    const now = new Date();
    if (new Date(commitment.dueDate) <= now) {
      throw new Error("Due date must be in the future");
    }

    const newCommitment = await prisma.commitments.create({
      data: {
        title: commitment.title.trim(),
        description: commitment.description.trim(),
        priority: commitment.priority,
        category: commitment.category.trim(),
        dueDate: commitment.dueDate,
        userId,
        isCompleted: false,
      },
    });

    revalidatePath("/commitments");
    return newCommitment;
  } catch (error) {
    console.error("Error adding commitment:", error);
    throw new Error(
      `Failed to add commitment: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Updates an existing commitment
 */
export async function updateCommitment(
  commitmentId: string,
  updates: UpdateCommitmentInput
): Promise<Commitments> {
  try {
    if (!commitmentId?.trim()) {
      throw new Error("Commitment ID is required");
    }

    // Check if commitment exists
    const existingCommitment = await prisma.commitments.findUnique({
      where: { id: commitmentId },
    });

    if (!existingCommitment) {
      throw new Error("Commitment not found");
    }

    // Validate updates
    const updateData: any = {};

    if (updates.title !== undefined) {
      if (!updates.title?.trim()) {
        throw new Error("Title cannot be empty");
      }
      updateData.title = updates.title.trim();
    }

    if (updates.description !== undefined) {
      if (!updates.description?.trim()) {
        throw new Error("Description cannot be empty");
      }
      updateData.description = updates.description.trim();
    }

    if (updates.category !== undefined) {
      if (!updates.category?.trim()) {
        throw new Error("Category cannot be empty");
      }
      updateData.category = updates.category.trim();
    }

    if (updates.priority !== undefined) {
      if (!Object.values(Priority).includes(updates.priority)) {
        throw new Error("Valid priority is required");
      }
      updateData.priority = updates.priority;
    }

    if (updates.dueDate !== undefined) {
      updateData.dueDate = updates.dueDate;
    }

    if (typeof updates.isCompleted === "boolean") {
      updateData.isCompleted = updates.isCompleted;
    }

    const updatedCommitment = await prisma.commitments.update({
      where: { id: commitmentId },
      data: updateData,
    });

    revalidatePath("/commitments");
    return updatedCommitment;
  } catch (error) {
    console.error("Error updating commitment:", error);
    throw new Error(
      `Failed to update commitment: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Toggles the completion status of a commitment
 */
export async function toggleCommitment(
  commitmentId: string
): Promise<Commitments> {
  try {
    if (!commitmentId?.trim()) {
      throw new Error("Commitment ID is required");
    }

    const commitment = await prisma.commitments.findUnique({
      where: { id: commitmentId },
    });

    if (!commitment) {
      throw new Error("Commitment not found");
    }

    const updatedCommitment = await prisma.commitments.update({
      where: { id: commitmentId },
      data: {
        isCompleted: !commitment.isCompleted,
      },
    });

    revalidatePath("/commitments");
    return updatedCommitment;
  } catch (error) {
    console.error("Error toggling commitment:", error);
    throw new Error(
      `Failed to toggle commitment: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Deletes a commitment
 */
export async function deleteCommitment(
  commitmentId: string
): Promise<{ success: boolean }> {
  try {
    if (!commitmentId?.trim()) {
      throw new Error("Commitment ID is required");
    }

    // Check if commitment exists before deleting
    const existingCommitment = await prisma.commitments.findUnique({
      where: { id: commitmentId },
    });

    if (!existingCommitment) {
      throw new Error("Commitment not found");
    }

    await prisma.commitments.delete({
      where: { id: commitmentId },
    });

    revalidatePath("/commitments");
    return { success: true };
  } catch (error) {
    console.error("Error deleting commitment:", error);
    throw new Error(
      `Failed to delete commitment: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Gets a single commitment by ID
 */
export async function getCommitmentById(
  commitmentId: string
): Promise<Commitments | null> {
  try {
    if (!commitmentId?.trim()) {
      throw new Error("Commitment ID is required");
    }

    const commitment = await prisma.commitments.findUnique({
      where: { id: commitmentId },
    });

    return commitment;
  } catch (error) {
    console.error("Error fetching commitment by ID:", error);
    throw new Error(
      `Failed to fetch commitment: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Gets all unique categories for a user
 */
export async function getCommitmentCategories(
  userId: string
): Promise<string[]> {
  try {
    if (!userId?.trim()) {
      throw new Error("User ID is required");
    }

    const categories = await prisma.commitments.findMany({
      where: { userId },
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    });

    return categories.map((c) => c.category);
  } catch (error) {
    console.error("Error fetching commitment categories:", error);
    throw new Error(
      `Failed to fetch categories: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Bulk update commitments (mark multiple as complete/incomplete)
 */
export async function bulkUpdateCommitments(
  commitmentIds: string[],
  updates: Pick<UpdateCommitmentInput, "isCompleted">
): Promise<{ count: number }> {
  try {
    if (!commitmentIds?.length) {
      throw new Error("Commitment IDs are required");
    }

    if (typeof updates.isCompleted !== "boolean") {
      throw new Error("Valid completion status is required");
    }

    const result = await prisma.commitments.updateMany({
      where: {
        id: { in: commitmentIds },
      },
      data: {
        isCompleted: updates.isCompleted,
      },
    });

    revalidatePath("/commitments");
    return { count: result.count };
  } catch (error) {
    console.error("Error bulk updating commitments:", error);
    throw new Error(
      `Failed to bulk update commitments: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
