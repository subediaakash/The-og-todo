// components/SubTaskItem.tsx
"use client";
import React from "react";
import { Trash2 } from "lucide-react";
import { SubTask } from "@/types/todos";

interface SubTaskItemProps {
  subtask: SubTask;
  updateSubTask: (subTaskId: string, updates: Partial<SubTask>) => void;
  deleteSubTask: (subTaskId: string) => void;
}

export function SubTaskItem({
  subtask,
  updateSubTask,
  deleteSubTask,
}: SubTaskItemProps) {
  const handleSubTaskCheck = (completed: boolean) => {
    updateSubTask(subtask.id, { completed });
  };

  return (
    <div className="flex items-center gap-3 p-2 rounded-md hover:bg-[#1a1a1a] transition-colors group">
      <div className="flex-shrink-0">
        <input
          type="checkbox"
          checked={subtask.completed}
          onChange={(e) => handleSubTaskCheck(e.target.checked)}
          className="w-3 h-3 rounded border-gray-600 bg-transparent border-2 
                     checked:bg-green-500 checked:border-green-500 
                     cursor-pointer transition-all"
        />
      </div>
      <div className="flex-1">
        <input
          type="text"
          value={subtask.title}
          onChange={(e) => updateSubTask(subtask.id, { title: e.target.value })}
          placeholder="Enter subtask..."
          className={`w-full bg-transparent border-none outline-none text-sm text-gray-300 placeholder-gray-500
                     ${subtask.completed ? "line-through text-gray-500" : ""}
                     focus:placeholder-gray-400 transition-colors`}
        />
      </div>
      <button
        onClick={() => deleteSubTask(subtask.id)}
        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-400 transition-all"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
}
