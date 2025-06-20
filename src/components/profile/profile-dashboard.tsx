"use client";

import { useState } from "react";
import { User, Settings, Shield } from "lucide-react";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileStats } from "@/components/profile/profile-stats";
import { AccountSettings } from "./account-settings";
import { DangerZone } from "./danger-zone";
import type { User as UserType } from "@/generated/prisma";
import type { ProfileStats as ProfileStatsType } from "@/types/profile";

interface ProfileDashboardProps {
  user: UserType;
  stats: ProfileStatsType;
}

export function ProfileDashboard({ user, stats }: ProfileDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "settings" | "security"
  >("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <ProfileHeader user={user} />

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex items-center bg-[#1a1a1a] border border-gray-700 rounded-xl p-1 w-fit">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                      : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === "overview" && (
            <>
              <ProfileStats stats={stats} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AccountSettings user={user} />
                <DangerZone userId={user.id} />
              </div>
            </>
          )}

          {activeTab === "settings" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AccountSettings user={user} />
              {/* Add more settings components here */}
            </div>
          )}

          {activeTab === "security" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <DangerZone userId={user.id} />
              {/* Add security settings here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
