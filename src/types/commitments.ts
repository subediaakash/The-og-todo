import type { Commitments, Priority } from "@/generated/prisma";

// Re-export the Prisma types
export type Commitment = Commitments;
export type CommitmentPriority = Priority;

// Enhanced stats interface matching server actions
export interface CommitmentStats {
  totalCommitments: number;
  completedCommitments: number;
  activeCommitments: number;
  completionRate: number;
  overdue: number;
  dueSoon: number; // Due within 7 days
}

// Filter interface for commitments
export interface CommitmentFilters {
  priority?: Priority;
  category?: string;
  isCompleted?: boolean;
  overdue?: boolean;
  dueSoon?: boolean;
}

// Form data interface for creating commitments
export interface CommitmentFormData {
  title: string;
  description: string;
  priority: Priority;
  category: string;
  dueDate: string;
}
