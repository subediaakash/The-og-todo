"use client";
import React, { useState, useEffect } from "react";
import TodoWorkSpace from "./main-todo";
import { getAllTodos } from "@/app/actions/todo-actions";

interface Workspace {
  date: string;
}

interface TodoWorkspaceManagerProps {
  userId: string;
}

export default function TodoWorkspaceManager({
  userId,
}: TodoWorkspaceManagerProps) {
  const today = new Date().toISOString().split("T")[0];
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function loadWorkspaces() {
      try {
        const todos = await getAllTodos(userId);

        // Extract unique dates from todos
        const uniqueDates = Array.from(
          new Set(
            todos.map((todo: any) => {
              // Handle both string and date formats
              const dateStr =
                typeof todo.createdAt === "string"
                  ? todo.createdAt
                  : todo.createdAt.toISOString();
              return dateStr.split("T")[0];
            })
          )
        );

        // Create workspace objects and sort by date (oldest first - reverse chronological)
        const ws: Workspace[] = uniqueDates
          .map((date) => ({ date }))
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );

        setWorkspaces(ws);

        // Auto-create today's workspace if it doesn't exist
        if (!uniqueDates.includes(today)) {
          setWorkspaces((prev) => [...prev, { date: today }]);
        }
      } catch (err) {
        console.error("Error loading workspaces:", err);
      }
    }

    loadWorkspaces();
  }, [userId, today]);

  const handleAddWorkspace = () => {
    // Check if workspace for selected date already exists
    const existingWorkspace = workspaces.find((ws) => ws.date === selectedDate);

    if (existingWorkspace) {
      setError(`Workspace for ${selectedDate} already exists.`);
      return;
    }

    // Add new workspace
    const newWorkspace = { date: selectedDate };
    setWorkspaces((prev) => {
      const updated = [...prev, newWorkspace];
      // Sort by date (oldest first)
      return updated.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    });

    setError("");
  };

  const formatDateDisplay = (date: string) => {
    const workspaceDate = new Date(date);
    const todayDate = new Date(today);
    const yesterday = new Date(todayDate);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date === today) {
      return "Today";
    } else if (date === yesterday.toISOString().split("T")[0]) {
      return "Yesterday";
    } else {
      return workspaceDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#191919] p-4">
      {/* Fixed Header */}
      <div className="sticky top-0 bg-[#191919] z-10 pb-4 border-b border-gray-700 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setError(""); // Clear error when date changes
            }}
            className="p-2 border border-gray-400 rounded bg-gray-800 text-white"
          />
          <button
            onClick={handleAddWorkspace}
            className="p-2 bg-blue-500 text-white rounded transition-colors hover:bg-blue-600"
          >
            Add Workspace
          </button>
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className="text-sm text-gray-400">
          Total workspaces: {workspaces.length}
        </div>
      </div>

      {/* Workspaces Container */}
      <div className="space-y-8">
        {workspaces.map((ws, index) => (
          <div key={ws.date} className="workspace-container">
            {/* Workspace Header */}
            <div className="flex items-center justify-between mb-4 px-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-medium text-white">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {formatDateDisplay(ws.date)}
                  </h3>
                  <p className="text-sm text-gray-400">{ws.date}</p>
                </div>
              </div>

              {ws.date === today && (
                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                  Active
                </span>
              )}
            </div>

            {/* Workspace Content - Wrapped to prevent full page takeover */}
            <div className="workspace-content bg-[#1a1a1a] rounded-lg border border-gray-700 overflow-hidden">
              <div className="workspace-wrapper">
                <TodoWorkSpace userId={userId} selectedDate={ws.date} />
              </div>
            </div>
          </div>
        ))}

        {workspaces.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>
              No workspaces yet. Create your first workspace using the form
              above.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .workspace-wrapper {
          /* Override the min-h-screen from TodoWorkSpace */
          min-height: auto !important;
        }

        .workspace-wrapper > div {
          min-height: auto !important;
          padding: 2rem !important;
        }

        .workspace-content {
          /* Ensure the workspace content fits its content */
          height: auto;
          overflow: visible;
        }

        /* Make the TodoWorkSpace component more compact */
        .workspace-wrapper .min-h-screen {
          min-height: auto !important;
        }
      `}</style>
    </div>
  );
}
