"use client";
import React, { MouseEvent, KeyboardEvent } from "react";
import { Task, SubTask } from "@/types/todos";
import { TaskItem } from "./task-items";

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

  return (
    <div
      className="bg-[#0f0f0f] rounded-lg p-6 border border-gray-800"
      onClick={handleEmptyAreaClick}
    >
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
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
        ))}
      </div>

      {tasks.length === 1 && tasks[0].title === "" && (
        <div className="text-gray-500 text-sm mt-4 italic">
          Click anywhere to add your first task for today...
        </div>
      )}
    </div>
  );
}
