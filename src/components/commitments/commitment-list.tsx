"use client";

import { useState, useTransition } from "react";
import {
  Check,
  Clock,
  Edit,
  Trash2,
  Calendar,
  Flag,
  Target,
  AlertTriangle,
} from "lucide-react";
import {
  toggleCommitment,
  deleteCommitment,
} from "@/app/actions/commitment-actions";
import type { Commitments, Priority } from "@/generated/prisma";
import { toast } from "sonner"; // Add toast notifications

interface CommitmentListProps {
  commitments: Commitments[];
  userId: string;
}

export function CommitmentList({ commitments, userId }: CommitmentListProps) {
  const [filter, setFilter] = useState<
    "all" | "active" | "completed" | "overdue" | "dueSoon"
  >("all");
  const [isPending, startTransition] = useTransition();

  const now = new Date();
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const filteredCommitments = commitments.filter((commitment) => {
    if (filter === "active") return !commitment.isCompleted;
    if (filter === "completed") return commitment.isCompleted;
    if (filter === "overdue")
      return !commitment.isCompleted && new Date(commitment.dueDate) < now;
    if (filter === "dueSoon")
      return (
        !commitment.isCompleted &&
        new Date(commitment.dueDate) >= now &&
        new Date(commitment.dueDate) <= weekFromNow
      );
    return true;
  });

  const handleToggleCommitment = async (commitmentId: string) => {
    startTransition(async () => {
      try {
        await toggleCommitment(commitmentId);
        toast.success("Commitment updated successfully!");
      } catch (error) {
        toast.error("Failed to update commitment");
        console.error(error);
      }
    });
  };

  const handleDeleteCommitment = async (commitmentId: string) => {
    if (!confirm("Are you sure you want to delete this commitment?")) return;

    startTransition(async () => {
      try {
        await deleteCommitment(commitmentId);
        toast.success("Commitment deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete commitment");
        console.error(error);
      }
    });
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "HIGH":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      case "MEDIUM":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "LOW":
        return "text-green-400 bg-green-500/10 border-green-500/20";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  const isOverdue = (dueDate: Date) => {
    return new Date(dueDate) < now;
  };

  const isDueSoon = (dueDate: Date) => {
    const due = new Date(dueDate);
    return due >= now && due <= weekFromNow;
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2">
        <div className="flex items-center bg-[#1a1a1a] border border-gray-700 rounded-lg p-1 min-w-fit">
          {[
            { key: "all", label: "All", count: commitments.length },
            {
              key: "active",
              label: "Active",
              count: commitments.filter((c) => !c.isCompleted).length,
            },
            {
              key: "completed",
              label: "Completed",
              count: commitments.filter((c) => c.isCompleted).length,
            },
            {
              key: "overdue",
              label: "Overdue",
              count: commitments.filter(
                (c) => !c.isCompleted && new Date(c.dueDate) < now
              ).length,
            },
            {
              key: "dueSoon",
              label: "Due Soon",
              count: commitments.filter(
                (c) =>
                  !c.isCompleted &&
                  new Date(c.dueDate) >= now &&
                  new Date(c.dueDate) <= weekFromNow
              ).length,
            },
          ].map((filterType) => (
            <button
              key={filterType.key}
              onClick={() => setFilter(filterType.key as any)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all capitalize whitespace-nowrap ${
                filter === filterType.key
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {filterType.label} ({filterType.count})
            </button>
          ))}
        </div>
      </div>

      {/* Commitments List */}
      <div className="space-y-4">
        {filteredCommitments.length === 0 ? (
          <div className="text-center py-12 bg-[#1a1a1a] rounded-xl border border-gray-800">
            <Target className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No commitments found
            </h3>
            <p className="text-gray-500">
              {filter === "all"
                ? "Start by adding your first commitment!"
                : `No ${filter} commitments yet.`}
            </p>
          </div>
        ) : (
          filteredCommitments.map((commitment) => {
            const dueDate = new Date(commitment.dueDate);
            const overdue = isOverdue(dueDate);
            const dueSoon = isDueSoon(dueDate);

            return (
              <div
                key={commitment.id}
                className={`
                  bg-[#1a1a1a] border rounded-xl p-6 transition-all duration-200 hover:border-gray-700
                  ${commitment.isCompleted ? "opacity-75" : ""}
                  ${
                    overdue && !commitment.isCompleted
                      ? "border-red-500/30"
                      : "border-gray-800"
                  }
                  ${
                    dueSoon && !commitment.isCompleted
                      ? "border-orange-500/30"
                      : ""
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggleCommitment(commitment.id)}
                    disabled={isPending}
                    className={`
                      flex-shrink-0 w-6 h-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center
                      ${
                        commitment.isCompleted
                          ? "bg-blue-500 border-blue-500 text-white"
                          : "border-gray-600 hover:border-blue-500"
                      }
                      ${isPending ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                  >
                    {commitment.isCompleted && <Check className="w-4 h-4" />}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3
                            className={`text-lg font-semibold ${
                              commitment.isCompleted
                                ? "line-through text-gray-500"
                                : "text-white"
                            }`}
                          >
                            {commitment.title}
                          </h3>
                          {overdue && !commitment.isCompleted && (
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                        {commitment.description && (
                          <p className="text-gray-400 mt-1">
                            {commitment.description}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                          disabled={isPending}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCommitment(commitment.id)}
                          disabled={isPending}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Meta Information */}
                    <div className="flex items-center gap-4 text-sm flex-wrap">
                      {/* Priority */}
                      <div
                        className={`flex items-center gap-1 px-2 py-1 rounded-md border ${getPriorityColor(
                          commitment.priority
                        )}`}
                      >
                        <Flag className="w-3 h-3" />
                        <span className="capitalize">
                          {commitment.priority.toLowerCase()}
                        </span>
                      </div>

                      {/* Due Date */}
                      <div
                        className={`flex items-center gap-1 ${
                          overdue && !commitment.isCompleted
                            ? "text-red-400"
                            : dueSoon && !commitment.isCompleted
                            ? "text-orange-400"
                            : "text-gray-400"
                        }`}
                      >
                        <Calendar className="w-3 h-3" />
                        <span>{dueDate.toLocaleDateString()}</span>
                        {overdue && !commitment.isCompleted && (
                          <span className="text-xs">(Overdue)</span>
                        )}
                        {dueSoon && !commitment.isCompleted && (
                          <span className="text-xs">(Due Soon)</span>
                        )}
                      </div>

                      {/* Category */}
                      {commitment.category && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-gray-700/50 rounded-md text-gray-300">
                          <span>{commitment.category}</span>
                        </div>
                      )}

                      {/* Status */}
                      <div className="flex items-center gap-1 text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>
                          {commitment.isCompleted ? "Completed" : "In Progress"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
