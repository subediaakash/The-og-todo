import React from "react";
import { Flame, Trophy, Calendar, Target } from "lucide-react";

interface StreakStatsProps {
  currentStreak: number;
  longestStreak: number;
  completedCount: number;
  totalDays: number;
}

export function StreakStats({
  currentStreak,
  longestStreak,
  completedCount,
  totalDays,
}: StreakStatsProps) {
  const completionRate =
    totalDays > 0 ? Math.round((completedCount / totalDays) * 100) : 0;

  const stats = [
    {
      icon: Flame,
      value: currentStreak,
      label: "Current Streak",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      description: "days in a row",
    },
    {
      icon: Trophy,
      value: longestStreak,
      label: "Longest Streak",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
      description: "personal best",
    },
    {
      icon: Calendar,
      value: completedCount,
      label: "Days Completed",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      description: "this month",
    },
    {
      icon: Target,
      value: `${completionRate}%`,
      label: "Success Rate",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      description: "completion rate",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`
              relative overflow-hidden bg-[#1a1a1a] border ${stat.borderColor} 
              rounded-xl p-6 transition-all duration-300 hover:scale-105 
              hover:shadow-lg hover:shadow-black/20 group
            `}
          >
            {/* Background gradient */}
            <div
              className={`absolute inset-0 ${stat.bgColor} opacity-50 group-hover:opacity-70 transition-opacity`}
            />

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-white font-semibold text-lg mb-1">
                  {stat.label}
                </div>
                <div className="text-gray-400 text-sm">{stat.description}</div>
              </div>
            </div>

            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </div>
        );
      })}
    </div>
  );
}
