// components/TaskItem.tsx
"use client";
import React, {
  useRef,
  useEffect,
  MouseEvent,
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
} from "react";
import { Plus, ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { TaskItemProps } from "@/types/todos";
import { SubTaskItem } from "./subclass-item";

export function TaskItem({
  task,
  updateTask,
  deleteTask,
  addSubTask,
  updateSubTask,
  deleteSubTask,
  handleKeyDown,
  focusedTaskId,
  setFocusedTaskId,
}: TaskItemProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (task.isEditing && focusedTaskId === task.id && inputRef.current) {
      inputRef.current.focus();
    }
  }, [task.isEditing, focusedTaskId, task.id]);

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateTask(task.id, { completed: e.target.checked });
  };

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateTask(task.id, { title: e.target.value });
  };

  const handleInputFocus = (_e: FocusEvent<HTMLInputElement>) => {
    setFocusedTaskId(task.id);
    updateTask(task.id, { isEditing: true });
  };

  const handleInputBlur = (_e: FocusEvent<HTMLInputElement>) => {
    updateTask(task.id, { isEditing: false });
  };

  const toggleSubtasks = () => {
    updateTask(task.id, { isExpanded: !task.isExpanded });
  };

  const handleItemClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div className="space-y-2" onClick={handleItemClick}>
      {/* Main Task */}
      <div className="flex items-center gap-3 p-2 rounded-md hover:bg-[#1a1a1a] transition-colors group">
        {/* Expand/Collapse for subtasks */}
        <div className="flex-shrink-0 w-4 flex justify-center">
          {task.subtasks.length > 0 && (
            <button
              onClick={toggleSubtasks}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {task.isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Checkbox */}
        <div className="flex-shrink-0">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleCheckboxChange}
            className="w-4 h-4 rounded border-gray-600 bg-transparent border-2 
                       checked:bg-blue-500 checked:border-blue-500 
                       focus:ring-2 focus:ring-blue-500 focus:ring-offset-0
                       cursor-pointer transition-all"
          />
        </div>

        {/* Text Input */}
        <div className="flex-1">
          <input
            ref={inputRef}
            type="text"
            value={task.title}
            onChange={handleTextChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={(e) => handleKeyDown(e, task.id)}
            placeholder="Enter a task..."
            className={`w-full bg-transparent border-none outline-none text-white placeholder-gray-500
                       ${task.completed ? "line-through text-gray-500" : ""}
                       focus:placeholder-gray-400 transition-colors`}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => addSubTask(task.id)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Add Subtask (Shift+Enter)"
          >
            <Plus className="w-3 h-3" />
          </button>
          <button
            onClick={() => deleteTask(task.id)}
            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
            title="Delete Task"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Subtasks */}
      {task.isExpanded && task.subtasks.length > 0 && (
        <div className="ml-7 space-y-1">
          {task.subtasks.map((subtask) => (
            <SubTaskItem
              key={subtask.id}
              subtask={subtask}
              updateSubTask={updateSubTask}
              deleteSubTask={deleteSubTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}
