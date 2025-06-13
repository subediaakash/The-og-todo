"use client";
import React, { useState } from "react";
import { Calendar, StickyNote } from "lucide-react";

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

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">📝 Daily Todo</h1>
          <div className="flex items-center gap-4 text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="text-sm">
              {completedTasks}/{totalTasks} tasks
              {totalSubTasks > 0 &&
                ` • ${completedSubTasks}/${totalSubTasks} subtasks`}
            </div>
            {hasCompletedAllTasks && (
              <span className="text-green-500 text-sm font-medium">
                🎉 All Done!
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 relative">
          {!hasNote && (
            <button
              onClick={onAddNote}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
              title="Add Note"
            >
              <StickyNote className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setShowHelp(!showHelp)}
            className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-400 transition-colors"
            title="Help"
          >
            <span className="text-sm font-medium">?</span>
          </button>

          {showHelp && (
            <div className="absolute right-0 top-16 bg-[#0f0f0f] border border-gray-700 rounded-lg p-4 w-80 text-sm text-gray-300 z-10">
              <div className="space-y-2">
                <p>• Click anywhere in empty area to add new task</p>
                <p>• Press Enter to create new task</p>
                <p>• Press Shift+Enter to create subtask</p>
                <p>• Press Delete to remove task</p>
                <p>• Press Backspace on empty task to delete it</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
