import {
  Target,
  CheckCircle,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Clock,
} from "lucide-react";
import type { CommitmentStats } from "@/types/commitments";

interface CommitmentStatsProps {
  stats: CommitmentStats;
}

export function CommitmentStats({ stats }: CommitmentStatsProps) {
  const statItems = [
    {
      icon: Target,
      value: stats.totalCommitments,
      label: "Total Commitments",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      description: "all time",
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
      icon: AlertTriangle,
      value: stats.overdue,
      label: "Overdue",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      description: "need attention",
    },
    {
      icon: Clock,
      value: stats.dueSoon,
      label: "Due Soon",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      description: "within 7 days",
    },
    {
      icon: Calendar,
      value: stats.activeCommitments,
      label: "Active",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      description: "in progress",
    },
    {
      icon: TrendingUp,
      value: `${stats.completionRate}%`,
      label: "Success Rate",
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
      description: "completion rate",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statItems.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`
              relative overflow-hidden bg-[#1a1a1a] border ${stat.borderColor} 
              rounded-xl p-4 transition-all duration-300 hover:scale-105 
              hover:shadow-lg hover:shadow-black/20 group
            `}
          >
            {/* Background gradient */}
            <div
              className={`absolute inset-0 ${stat.bgColor} opacity-50 group-hover:opacity-70 transition-opacity`}
            />

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-white font-semibold text-sm mb-1">
                  {stat.label}
                </div>
                <div className="text-gray-400 text-xs">{stat.description}</div>
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
