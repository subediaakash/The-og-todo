"use client";
import React, { useState, KeyboardEvent } from "react";
import { Todo, Task, SubTask } from "@/types/todos";
import {
  generateId,
  formatDate,
  calculateStats,
  checkAllTasksCompleted,
} from "@/utils/todoUtility";
import { TodoHeader } from "@/components/todos/todo-header";
import { TasksSection } from "@/components/todos/task-section";
import { NoteSection } from "@/components/todos/note-section";

export default function TodoWorkSpace() {
  const date = new Date();
  const formattedDate = formatDate(date);

  const [todo, setTodo] = useState<Todo>({
    id: "daily-todo",
    tasks: [
      {
        id: "1",
        title: "",
        completed: false,
        isEditing: true,
        subtasks: [],
        isExpanded: false,
      },
    ],
    notes: [],
    hasCompletedAllTasks: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const [focusedTaskId, setFocusedTaskId] = useState<string>("1");

  const addNewTask = () => {
    const newTaskId = generateId();
    setTodo((prev) => ({
      ...prev,
      tasks: [
        ...prev.tasks,
        {
          id: newTaskId,
          title: "",
          completed: false,
          isEditing: true,
          subtasks: [],
          isExpanded: false,
        },
      ],
      updatedAt: new Date().toISOString(),
    }));
    setFocusedTaskId(newTaskId);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTodo((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      ),
      updatedAt: new Date().toISOString(),
    }));
    updateCompletion();
  };

  const deleteTask = (taskId: string) => {
    if (todo.tasks.length > 1) {
      setTodo((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((task) => task.id !== taskId),
        updatedAt: new Date().toISOString(),
      }));
    }
  };

  // SubTask operations
  const addSubTask = (taskId: string) => {
    const newSubTaskId = generateId();
    setTodo((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: [
                ...task.subtasks,
                {
                  id: newSubTaskId,
                  title: "",
                  completed: false,
                  taskId,
                },
              ],
              isExpanded: true,
            }
          : task
      ),
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateSubTask = (subTaskId: string, updates: Partial<SubTask>) => {
    setTodo((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) => ({
        ...task,
        subtasks: task.subtasks.map((subtask) =>
          subtask.id === subTaskId ? { ...subtask, ...updates } : subtask
        ),
      })),
      updatedAt: new Date().toISOString(),
    }));
    updateCompletion();
  };

  const deleteSubTask = (subTaskId: string) => {
    setTodo((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) => ({
        ...task,
        subtasks: task.subtasks.filter((subtask) => subtask.id !== subTaskId),
      })),
      updatedAt: new Date().toISOString(),
    }));
  };

  const addNote = () => {
    if (todo.notes.length === 0) {
      const newNoteId = generateId();
      setTodo((prev) => ({
        ...prev,
        notes: [
          {
            id: newNoteId,
            note: "",
          },
        ],
      }));
    }
  };

  const updateNote = (noteId: string, note: string) => {
    setTodo((prev) => ({
      ...prev,
      notes: prev.notes.map((n) => (n.id === noteId ? { ...n, note } : n)),
    }));
  };

  const deleteNote = (noteId: string) => {
    setTodo((prev) => ({
      ...prev,
      notes: prev.notes.filter((note) => note.id !== noteId),
    }));
  };

  // Update completion status
  const updateCompletion = () => {
    setTimeout(() => {
      setTodo((prev) => ({
        ...prev,
        hasCompletedAllTasks: checkAllTasksCompleted(prev.tasks),
      }));
    }, 0);
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    taskId: string
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.shiftKey) {
        addSubTask(taskId);
      } else {
        addNewTask();
      }
    } else if (e.key === "Delete") {
      e.preventDefault();
      deleteTask(taskId);
    } else if (
      e.key === "Backspace" &&
      (e.target as HTMLInputElement).value === ""
    ) {
      e.preventDefault();
      deleteTask(taskId);
    }
  };

  const stats = calculateStats(todo.tasks);

  return (
    <div className="min-h-screen bg-[#191919] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <TodoHeader
          formattedDate={formattedDate}
          totalTasks={stats.totalTasks}
          completedTasks={stats.completedTasks}
          totalSubTasks={stats.totalSubTasks}
          completedSubTasks={stats.completedSubTasks}
          hasCompletedAllTasks={todo.hasCompletedAllTasks}
          hasNote={todo.notes.length > 0}
          onAddNote={addNote}
        />

        <div className="space-y-6">
          <TasksSection
            tasks={todo.tasks}
            updateTask={updateTask}
            deleteTask={deleteTask}
            addSubTask={addSubTask}
            updateSubTask={updateSubTask}
            deleteSubTask={deleteSubTask}
            handleKeyDown={handleKeyDown}
            focusedTaskId={focusedTaskId}
            setFocusedTaskId={setFocusedTaskId}
            onAddNewTask={addNewTask}
          />

          {todo.notes.length > 0 && (
            <NoteSection
              note={todo.notes[0]}
              updateNote={updateNote}
              deleteNote={deleteNote}
            />
          )}
        </div>
      </div>
    </div>
  );
}
