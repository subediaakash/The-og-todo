"use client";
import type React from "react";
import type { MouseEvent, KeyboardEvent } from "react";
import type { Task, SubTask } from "@/types/todos";
import { TaskItem } from "./task-items";
import { Plus, CheckSquare } from "lucide-react";

interface TasksSectionProps {
  tasks: Task[];
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  addSubTask: (taskId: string) => void;
  updateSubTask: (subTaskId: string, updates: Partial<SubTask>) => void;
  deleteSubTask: (subTaskId: string) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>, taskId: string) => void;
  focusedTaskId: string;
  setFocusedTaskId: React.Dispatch<React.SetStateAction<string>>;
  onAddNewTask: () => void;
}

export function TasksSection({
  tasks,
  updateTask,
  deleteTask,
  addSubTask,
  updateSubTask,
  deleteSubTask,
  handleKeyDown,
  focusedTaskId,
  setFocusedTaskId,
  onAddNewTask,
}: TasksSectionProps) {
  const handleEmptyAreaClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onAddNewTask();
    }
  };

  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const hasEmptyTask = tasks.length === 1 && tasks[0].title === "";

  return (
    <div className="relative group">
      {/* Progress indicator */}
      {totalTasks > 0 && !hasEmptyTask && (
        <div className="mb-4 p-4 bg-gradient-to-r from-gray-800/30 to-gray-700/20 rounded-lg border border-gray-700/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-gray-300">
                Progress
              </span>
            </div>
            <span className="text-xs text-gray-400 font-mono">
              {completedTasks}/{totalTasks}
            </span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${
                  totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
                }%`,
              }}
            ></div>
          </div>
        </div>
      )}

      <div
        className="bg-gradient-to-br from-[#0f0f0f] via-[#111111] to-[#0d0d0d] rounded-xl p-6 border border-gray-800/50 shadow-2xl shadow-black/20 cursor-pointer transition-all duration-300 hover:border-gray-700/50 hover:shadow-black/30 relative overflow-hidden"
        onClick={handleEmptyAreaClick}
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative z-10">
          <div className="space-y-3">
            {tasks.map((task, index) => (
              <div
                key={task.id}
                className="animate-in fade-in-50 slide-in-from-left-2 duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TaskItem
                  task={task}
                  updateTask={updateTask}
                  deleteTask={deleteTask}
                  addSubTask={addSubTask}
                  updateSubTask={updateSubTask}
                  deleteSubTask={deleteSubTask}
                  handleKeyDown={handleKeyDown}
                  focusedTaskId={focusedTaskId}
                  setFocusedTaskId={setFocusedTaskId}
                />
              </div>
            ))}
          </div>

          {hasEmptyTask && (
            <div className="text-center py-12 animate-in fade-in-50 duration-500">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-700/50 to-gray-600/50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-400 text-sm italic leading-relaxed max-w-xs mx-auto">
                Click anywhere to add your first task for today...
              </p>
            </div>
          )}

          {/* Add task hint for non-empty state */}
          {!hasEmptyTask && (
            <div className="mt-6 p-4 border-2 border-dashed border-gray-700/30 rounded-lg text-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:border-gray-600/50 hover:bg-gray-800/20">
              <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                <Plus className="w-4 h-4" />
                <span>Click here to add another task</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
