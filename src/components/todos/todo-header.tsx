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
          <h1 className="text-2xl font-bold mb-2">Todos</h1>
          <div className="flex items-center gap-6 text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className="text">{formattedDate}</span>
            </div>
            <div className="text-sm">
              {completedTasks}/{totalTasks} tasks
              {totalSubTasks > 0 &&
                ` • ${completedSubTasks}/${totalSubTasks} subtasks`}
            </div>
            {hasCompletedAllTasks && (
              <span className="text-green-500 text-base font-semibold">
                🎉 All Done!
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 relative">
          {!hasNote && (
            <button
              onClick={onAddNote}
              className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
              title="Add Note"
            >
              <StickyNote className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-400 transition-colors bg-gray-800"
            title="Help"
          >
            <span className="text-lg font-light">?</span>
          </button>
          {showHelp && (
            <div className="absolute right-0 top-12 bg-[#1f1f1f] border border-gray-700 rounded-lg p-4 w-80 text-sm text-gray-300 shadow-lg z-10">
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
