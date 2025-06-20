"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import type { Commitments } from "@/generated/prisma";

interface CommitmentCalendarProps {
  commitments: Commitments[];
  userId: string;
}

export function CommitmentCalendar({
  commitments,
  userId,
}: CommitmentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

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

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const previousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const getCommitmentsForDate = (day: number) => {
    const targetDate = new Date(currentYear, currentMonth, day);
    return commitments.filter((commitment) => {
      const commitmentDate = new Date(commitment.dueDate);
      return (
        commitmentDate.getFullYear() === targetDate.getFullYear() &&
        commitmentDate.getMonth() === targetDate.getMonth() &&
        commitmentDate.getDate() === targetDate.getDate()
      );
    });
  };

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-400" />
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-1">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <div className="text-sm text-gray-400 flex items-center justify-center gap-1">
            <Calendar className="w-4 h-4" />
            Commitment Calendar
          </div>
        </div>

        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Day Labels */}
      <div className="grid grid-cols-7 gap-2 mb-3">
        {dayLabels.map((label) => (
          <div key={label} className="text-center py-2">
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="h-24" />
        ))}

        {/* Days of the month */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const dayCommitments = getCommitmentsForDate(day);
          const isToday =
            new Date().toDateString() ===
            new Date(currentYear, currentMonth, day).toDateString();
          const now = new Date();

          return (
            <div
              key={day}
              className={`
                h-24 p-2 rounded-lg border transition-all hover:border-gray-600
                ${
                  isToday
                    ? "border-blue-500 bg-blue-500/5"
                    : "border-gray-800 bg-[#0f0f0f]"
                }
              `}
            >
              <div
                className={`text-sm font-medium mb-1 ${
                  isToday ? "text-blue-400" : "text-gray-300"
                }`}
              >
                {day}
              </div>

              <div className="space-y-1">
                {dayCommitments.slice(0, 2).map((commitment) => {
                  const isOverdue =
                    new Date(commitment.dueDate) < now &&
                    !commitment.isCompleted;
                  return (
                    <div
                      key={commitment.id}
                      className={`
                        text-xs px-2 py-1 rounded truncate
                        ${
                          commitment.isCompleted
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : isOverdue
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        }
                      `}
                      title={`${commitment.title} - ${commitment.priority} priority`}
                    >
                      {commitment.title}
                    </div>
                  );
                })}

                {dayCommitments.length > 2 && (
                  <div className="text-xs text-gray-500 px-2">
                    +{dayCommitments.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-800">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 bg-blue-500/20 border border-blue-500/30 rounded"></div>
          <span className="text-gray-400">Active</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 bg-green-500/20 border border-green-500/30 rounded"></div>
          <span className="text-gray-400">Completed</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 bg-red-500/20 border border-red-500/30 rounded"></div>
          <span className="text-gray-400">Overdue</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 border-2 border-blue-500 rounded"></div>
          <span className="text-gray-400">Today</span>
        </div>
      </div>
    </div>
  );
}
