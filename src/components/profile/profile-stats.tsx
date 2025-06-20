import {
  Target,
  CheckCircle,
  Flame,
  Calendar,
  Trophy,
  TrendingUp,
} from "lucide-react";
import type { ProfileStats } from "@/types/profile";

interface ProfileStatsProps {
  stats: ProfileStats;
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const statItems = [
    {
      icon: Target,
      value: stats.totalCommitments,
      label: "Total Commitments",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      description: "created",
    },
    {
      icon: CheckCircle,
      value: stats.completedCommitments,
      label: "Completed",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      description: "achievements",
    },
    {
      icon: Flame,
      value: stats.currentStreak,
      label: "Current Streak",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      description: "days",
    },
    {
      icon: Trophy,
      value: stats.longestStreak,
      label: "Best Streak",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
      description: "personal record",
    },
    {
      icon: Calendar,
      value: stats.totalTodos,
      label: "Total Todos",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      description: "created",
    },
    {
      icon: TrendingUp,
      value: `${stats.completionRate}%`,
      label: "Success Rate",
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
      description: "overall",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
          <TrendingUp className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Your Statistics</h2>
          <p className="text-gray-400">Track your progress and achievements</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statItems.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`
                relative overflow-hidden bg-[#1a1a1a] border ${stat.borderColor} 
                rounded-2xl p-6 transition-all duration-300 hover:scale-105 
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
                  <div className={`p-3 ${stat.bgColor} rounded-xl`}>
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
                  <div className="text-gray-400 text-sm">
                    {stat.description}
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
