import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getCompletedTodos, getCurrentStreak } from "../actions/streak-actions";
import { StreakDashboard } from "@/components/streaks/streak-dashboard";

export default async function StreakPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Not authenticated</div>
      </div>
    );
  }

  const userId = session.user.id;

  try {
    // Fetch data in parallel
    const [todos, streakData] = await Promise.all([
      getCompletedTodos(userId),
      getCurrentStreak(userId),
    ]);
    console.log(streakData.longestStreak);

    return (
      <div className="min-h-screen bg-gray-900 ">
        <StreakDashboard
          todos={todos}
          streakData={streakData}
          userId={userId}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading streak data:", error);
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500 text-xl">Error loading streak data</div>
      </div>
    );
  }
}
