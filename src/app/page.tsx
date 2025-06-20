"use client";
import { useState, useEffect } from "react";
import TodoWorkSpace from "../components/todos/main-todo";
import { getAllTodos } from "@/app/actions/todo-actions";
import { Calendar, Plus, ChevronDown, Sparkles } from "lucide-react";
import { toast } from "sonner";

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
  const [isLoading, setIsLoading] = useState(true);
  const [showOtherWorkspaces, setShowOtherWorkspaces] = useState(false);

  useEffect(() => {
    async function loadWorkspaces() {
      try {
        setIsLoading(true);
        const todos = await getAllTodos(userId);

        const uniqueDates = Array.from(
          new Set(
            todos.map((todo: any) => {
              const dateStr =
                typeof todo.createdAt === "string"
                  ? todo.createdAt
                  : todo.createdAt.toISOString();
              return dateStr.split("T")[0];
            })
          )
        );

        // Create workspace objects and sort by date (newest first)
        const ws: Workspace[] = uniqueDates
          .map((date) => ({ date }))
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );

        setWorkspaces(ws);

        if (!uniqueDates.includes(today)) {
          setWorkspaces((prev) => [{ date: today }, ...prev]);
        }
      } catch (err) {
        console.error("Error loading workspaces:", err);
        toast.error("Failed to load workspaces", {
          description: "Please try refreshing the page",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadWorkspaces();
  }, [userId, today]);

  const handleAddWorkspace = () => {
    const existingWorkspace = workspaces.find((ws) => ws.date === selectedDate);

    if (existingWorkspace) {
      toast.error("Workspace already exists", {
        description: `A workspace for ${formatDateDisplay(
          selectedDate
        )} already exists`,
      });
      return;
    }

    const newWorkspace = { date: selectedDate };
    setWorkspaces((prev) => {
      const updated = [newWorkspace, ...prev];
      return updated.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });

    toast.success("Workspace created!", {
      description: `New workspace for ${formatDateDisplay(
        selectedDate
      )} has been created`,
    });
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

  const currentWorkspace = workspaces.find((ws) => ws.date === today);
  const otherWorkspaces = workspaces.filter((ws) => ws.date !== today);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0f0f0f] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/25 animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">
              Loading Workspaces
            </h3>
            <p className="text-gray-400">Setting up your productivity hub...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0f0f0f]">
      {/* Compact Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/95 to-transparent backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-white">Workspaces</h1>
              <div className="text-xs text-gray-400 px-2 py-1 bg-gray-800/50 rounded-md border border-gray-700/30">
                {workspaces.length} total
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Calendar className="w-4 h-4 text-blue-400 absolute left-3 top-1/2 transform -translate-y-1/2 z-10" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-9 pr-3 py-2 text-sm bg-gray-800/50 border border-gray-600/30 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                />
              </div>
              <button
                onClick={handleAddWorkspace}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:from-blue-700 hover:to-blue-600 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-blue-500/50 transform hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Current Workspace - Centered and Prominent */}
        {currentWorkspace && (
          <div className="mb-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 border border-blue-500/30 rounded-full backdrop-blur-sm mb-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-blue-300 font-medium text-sm">
                  Current Workspace
                </span>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent mb-2">
                {formatDateDisplay(currentWorkspace.date)}
              </h2>
              <p className="text-gray-400 font-mono text-sm">
                {currentWorkspace.date}
              </p>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-sm rounded-3xl border border-gray-700/40 shadow-2xl shadow-black/30 overflow-hidden group-hover:border-gray-600/50 group-hover:shadow-black/40 transition-all duration-500">
                <TodoWorkSpace
                  userId={userId}
                  selectedDate={currentWorkspace.date}
                />
              </div>
            </div>
          </div>
        )}

        {/* Other Workspaces - Collapsible Section */}
        {otherWorkspaces.length > 0 && (
          <div className="border-t border-gray-800/50 pt-8">
            <button
              onClick={() => setShowOtherWorkspaces(!showOtherWorkspaces)}
              className="flex items-center justify-between w-full p-4 bg-gray-900/30 hover:bg-gray-800/30 rounded-xl border border-gray-700/30 transition-all duration-200 group mb-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-gray-300" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-medium">
                    Previous Workspaces
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {otherWorkspaces.length} workspace
                    {otherWorkspaces.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                  showOtherWorkspaces ? "rotate-180" : ""
                }`}
              />
            </button>

            {showOtherWorkspaces && (
              <div className="space-y-8 animate-in slide-in-from-top-4 duration-300">
                {otherWorkspaces.map((ws, index) => (
                  <div
                    key={ws.date}
                    className="group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-4 mb-4 px-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl flex items-center justify-center text-sm font-medium text-white shadow-lg">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-200 group-hover:text-white transition-colors duration-200">
                          {formatDateDisplay(ws.date)}
                        </h3>
                        <p className="text-gray-500 font-mono text-xs">
                          {ws.date}
                        </p>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="bg-gradient-to-br from-gray-900/40 via-gray-800/20 to-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-700/20 shadow-xl shadow-black/10 overflow-hidden group-hover:border-gray-600/30 group-hover:shadow-black/20 transition-all duration-300">
                        <TodoWorkSpace userId={userId} selectedDate={ws.date} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {workspaces.length === 0 && (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-gray-900/50">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <div className="space-y-4 max-w-md mx-auto">
              <h3 className="text-xl font-bold text-white">
                Ready to Get Started?
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Create your first workspace using the date picker above and
                start organizing your tasks.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
