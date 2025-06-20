import React from "react";
import { Todo, StreakData } from "@/utils/streak-utils";
import {
  getCompletedDaysForMonth,
  getMonthGridData,
} from "@/utils/streak-utils";
import { StreakStats } from "./streak-stats";
import { MonthlyGrid } from "./monthly-grid";
import { Calendar, Target, TrendingUp, Award } from "lucide-react";

interface StreakDashboardProps {
  todos: Todo[];
  streakData: StreakData;
  userId: string;
}

export function StreakDashboard({
  todos,
  streakData,
  userId,
}: StreakDashboardProps) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const today = currentDate.getDate();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get completed days for current month
  const completedDays = getCompletedDaysForMonth(
    todos,
    currentYear,
    currentMonth
  );
  const gridData = getMonthGridData(currentYear, currentMonth, completedDays);

  // Calculate stats
  const completedCount = completedDays.size;
  const totalDaysUpToToday = today;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Streak Dashboard
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Track your daily progress and maintain your momentum with visual
            insights
          </p>
        </div>

        {/* Streak Statistics */}
        <div className="mb-8">
          <StreakStats
            currentStreak={streakData.currentStreak}
            longestStreak={streakData.longestStreak}
            completedCount={completedCount}
            totalDays={totalDaysUpToToday}
          />
        </div>

        {/* Monthly Grid Container */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6 mb-8">
          <MonthlyGrid
            gridData={gridData}
            monthName={monthNames[currentMonth]}
            year={currentYear}
          />
        </div>

        {/* Enhanced Legend */}
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Legend
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-[#0f0f0f] rounded-lg border border-gray-800">
              <div className="w-4 h-4 bg-gray-700 rounded-md border border-gray-600"></div>
              <span className="text-sm text-gray-300">Not completed</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#0f0f0f] rounded-lg border border-gray-800">
              <div className="w-4 h-4 bg-blue-500 rounded-md shadow-lg shadow-blue-500/25"></div>
              <span className="text-sm text-gray-300">Completed</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#0f0f0f] rounded-lg border border-gray-800">
              <div className="w-4 h-4 bg-orange-500 rounded-md ring-2 ring-orange-400/50"></div>
              <span className="text-sm text-gray-300">Today</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#0f0f0f] rounded-lg border border-gray-800">
              <div className="w-4 h-4 bg-[#0a0a0a] border-2 border-gray-700 rounded-md"></div>
              <span className="text-sm text-gray-300">Future</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
