"use client";

import { useState } from "react";
import { Plus, Target } from "lucide-react";
import { CommitmentStats } from "./commitment-stats";
import { CommitmentList } from "./commitment-list";
import { AddCommitmentModal } from "./add-commitment-modal";
import { CommitmentCalendar } from "./commitment-calender";
import type { Commitments } from "@/generated/prisma";
import type { CommitmentStats as CommitmentStatsType } from "@/types/commitments";

interface CommitmentDashboardProps {
  commitments: Commitments[];
  stats: CommitmentStatsType;
  userId: string;
}

export function CommitmentDashboard({
  commitments,
  stats,
  userId,
}: CommitmentDashboardProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [view, setView] = useState<"list" | "calendar">("list");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Target className="w-8 h-8 text-blue-500" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  My Commitments
                </h1>
                <p className="text-gray-400 text-base sm:text-lg">
                  Set goals and track your progress
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              {/* View Toggle */}
              <div className="flex items-center bg-[#1a1a1a] border border-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setView("list")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    view === "list"
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setView("calendar")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    view === "calendar"
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Calendar
                </button>
              </div>

              {/* Add Commitment Button */}
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 shadow-lg shadow-blue-500/25"
              >
                <Plus className="w-5 h-5" />
                <span>Add Commitment</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <CommitmentStats stats={stats} />
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {view === "list" ? (
            <CommitmentList commitments={commitments} userId={userId} />
          ) : (
            <CommitmentCalendar commitments={commitments} userId={userId} />
          )}
        </div>

        {/* Add Commitment Modal */}
        <AddCommitmentModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          userId={userId}
        />
      </div>
    </div>
  );
}
