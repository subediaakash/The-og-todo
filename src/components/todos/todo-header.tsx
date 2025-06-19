"use client";
import { useState } from "react";
import {
  Calendar,
  StickyNote,
  HelpCircle,
  Target,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface TodoHeaderProps {
  formattedDate: string;
  totalTasks: number;
  completedTasks: number;
  totalSubTasks: number;
  completedSubTasks: number;
  hasCompletedAllTasks: boolean;
  hasNote: boolean;
  onAddNote: () => void;
}

export function TodoHeader({
  formattedDate,
  totalTasks,
  completedTasks,
  totalSubTasks,
  completedSubTasks,
  hasCompletedAllTasks,
  hasNote,
  onAddNote,
}: TodoHeaderProps) {
  const [showHelp, setShowHelp] = useState<boolean>(false);

  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const subtaskProgress =
    totalSubTasks > 0 ? (completedSubTasks / totalSubTasks) * 100 : 0;

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-gray-800/20 via-gray-700/10 to-gray-800/20 rounded-xl p-6 border border-gray-700/30 shadow-lg backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Section - Title and Date */}
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
                Todos
              </h1>
              <div className="flex items-center gap-3 text-gray-400">
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 rounded-lg border border-gray-700/30">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-gray-300">
                    {formattedDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="space-y-3">
              {/* Tasks Progress */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 min-w-0">
                  <Target className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span className="text-sm text-gray-400 whitespace-nowrap">
                    Tasks
                  </span>
                </div>
                <div className="flex-1 max-w-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">
                      {completedTasks}/{totalTasks}
                    </span>
                    <span className="text-xs text-gray-500">
                      {Math.round(taskProgress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${taskProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Subtasks Progress */}
              {totalSubTasks > 0 && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span className="text-sm text-gray-400 whitespace-nowrap">
                      Subtasks
                    </span>
                  </div>
                  <div className="flex-1 max-w-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">
                        {completedSubTasks}/{totalSubTasks}
                      </span>
                      <span className="text-xs text-gray-500">
                        {Math.round(subtaskProgress)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${subtaskProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Completion Celebration */}
              {hasCompletedAllTasks && totalTasks > 0 && (
                <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-700/30 rounded-lg animate-in slide-in-from-left-2 duration-500">
                  <Sparkles className="w-5 h-5 text-green-400 animate-pulse" />
                  <span className="text-green-400 font-semibold">
                    🎉 All tasks completed!
                  </span>
                  <Sparkles className="w-5 h-5 text-green-400 animate-pulse" />
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-3 relative">
            {!hasNote && (
              <button
                onClick={onAddNote}
                className="group p-3 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200 border border-gray-700/30 hover:border-gray-600/50 hover:shadow-lg hover:shadow-gray-900/20"
                title="Add Note"
              >
                <StickyNote className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              </button>
            )}

            <button
              onClick={() => setShowHelp(!showHelp)}
              className={`group relative w-11 h-11 rounded-xl border flex items-center justify-center transition-all duration-200 hover:shadow-lg hover:shadow-gray-900/20 ${
                showHelp
                  ? "border-blue-500/50 bg-blue-900/20 text-blue-400"
                  : "border-gray-600/50 bg-gray-800/50 text-gray-400 hover:text-white hover:border-gray-500/50"
              }`}
              title="Help & Shortcuts"
            >
              <HelpCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            </button>

            {/* Enhanced Help Tooltip */}
            {showHelp && (
              <div className="absolute right-0 top-14 bg-gradient-to-br from-[#1f1f1f] to-[#1a1a1a] border border-gray-700/50 rounded-xl p-5 w-80 text-sm shadow-2xl shadow-black/30 z-20 animate-in slide-in-from-top-2 duration-200">
                <div className="absolute -top-2 right-4 w-4 h-4 bg-[#1f1f1f] border-l border-t border-gray-700/50 rotate-45"></div>

                <div className="mb-4">
                  <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-400" />
                    Keyboard Shortcuts
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-gray-800/30 rounded-lg border border-gray-700/20">
                    <span className="text-gray-300">Add new task</span>
                    <kbd className="px-2 py-1 bg-gray-700/50 rounded text-xs font-mono text-gray-400 border border-gray-600/30">
                      Click empty area
                    </kbd>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-800/30 rounded-lg border border-gray-700/20">
                    <span className="text-gray-300">Create new task</span>
                    <kbd className="px-2 py-1 bg-gray-700/50 rounded text-xs font-mono text-gray-400 border border-gray-600/30">
                      Enter
                    </kbd>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-800/30 rounded-lg border border-gray-700/20">
                    <span className="text-gray-300">Create subtask</span>
                    <kbd className="px-2 py-1 bg-gray-700/50 rounded text-xs font-mono text-gray-400 border border-gray-600/30">
                      Shift + Enter
                    </kbd>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-800/30 rounded-lg border border-gray-700/20">
                    <span className="text-gray-300">Delete task</span>
                    <kbd className="px-2 py-1 bg-gray-700/50 rounded text-xs font-mono text-gray-400 border border-gray-600/30">
                      Delete
                    </kbd>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-800/30 rounded-lg border border-gray-700/20">
                    <span className="text-gray-300">Remove empty task</span>
                    <kbd className="px-2 py-1 bg-gray-700/50 rounded text-xs font-mono text-gray-400 border border-gray-600/30">
                      Backspace
                    </kbd>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-700/30">
                  <p className="text-xs text-gray-500 text-center">
                    Click outside to close this help panel
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showHelp && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowHelp(false)}
        />
      )}
    </div>
  );
}
