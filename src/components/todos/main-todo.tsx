"use client";
import React, { useState, useEffect, KeyboardEvent } from "react";
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
import {
  createTodoWithRelations,
  updateTodoWithRelations,
  getTodoByDate,
  deleteTodoWithRelations,
} from "../../app/actions/todo-actions";

interface TodoWorkSpaceProps {
  userId: string;
  selectedDate?: string;
}

export default function TodoWorkSpace({
  userId,
  selectedDate,
}: TodoWorkSpaceProps) {
  const date = selectedDate ? new Date(selectedDate) : new Date();
  const formattedDate = formatDate(date);
  const dateKey = date.toISOString().split("T")[0];

  const [todo, setTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [focusedTaskId, setFocusedTaskId] = useState<string>("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    loadTodoForDate();
  }, [dateKey, userId]);

  useEffect(() => {
    // Autosave after every 5 seconds if there are unsaved changes
    if (hasUnsavedChanges && todo) {
      const timeoutId = setTimeout(() => {
        saveTodo();
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [todo, hasUnsavedChanges]);

  const loadTodoForDate = async () => {
    try {
      setIsLoading(true);
      const existingTodo = await getTodoByDate(dateKey, userId);

      if (existingTodo) {
        setTodo(existingTodo);
        const firstEmptyTask = existingTodo.tasks.find(
          (task: Task) => task.title === ""
        );
        if (firstEmptyTask) {
          setFocusedTaskId(firstEmptyTask.id);
        }
      } else {
        const newTodo = createNewTodo(dateKey);
        setTodo(newTodo);
        setFocusedTaskId(newTodo.tasks[0].id);
      }
    } catch (error) {
      console.error("Error loading todo:", error);
      const newTodo = createNewTodo(dateKey);
      setTodo(newTodo);
      setFocusedTaskId(newTodo.tasks[0].id);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewTodo = (dateKey: string): Todo => {
    const firstTaskId = generateId();
    return {
      id: `todo-${dateKey}`,
      tasks: [
        {
          id: firstTaskId,
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
    };
  };

  const saveTodo = async () => {
    if (!todo || isSaving) return;

    try {
      setIsSaving(true);

      const existingTodo = await getTodoByDate(dateKey, userId);

      if (existingTodo) {
        await updateTodoWithRelations(todo, userId);
      } else {
        await createTodoWithRelations(todo, userId);
      }

      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error saving todo:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateTodoState = (updater: (prev: Todo) => Todo) => {
    setTodo((prev) => {
      if (!prev) return prev;
      const updated = updater(prev);
      setHasUnsavedChanges(true);
      return updated;
    });
  };

  const addNewTask = () => {
    const newTaskId = generateId();
    updateTodoState((prev) => ({
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
    updateTodoState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      ),
      updatedAt: new Date().toISOString(),
    }));

    // Update completion status after state update
    setTimeout(() => {
      if (todo) {
        const updatedTasks = todo.tasks.map((task) =>
          task.id === taskId ? { ...task, ...updates } : task
        );
        const hasCompletedAll = checkAllTasksCompleted(updatedTasks);

        updateTodoState((prev) => ({
          ...prev,
          hasCompletedAllTasks: hasCompletedAll,
        }));
      }
    }, 0);
  };

  const deleteTask = (taskId: string) => {
    if (!todo || todo.tasks.length <= 1) return;

    updateTodoState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((task) => task.id !== taskId),
      updatedAt: new Date().toISOString(),
    }));
  };

  const addSubTask = (taskId: string) => {
    const newSubTaskId = generateId();
    updateTodoState((prev) => ({
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
    updateTodoState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) => ({
        ...task,
        subtasks: task.subtasks.map((subtask) =>
          subtask.id === subTaskId ? { ...subtask, ...updates } : subtask
        ),
      })),
      updatedAt: new Date().toISOString(),
    }));

    // Update completion status
    setTimeout(() => {
      if (todo) {
        updateTodoState((prev) => ({
          ...prev,
          hasCompletedAllTasks: checkAllTasksCompleted(prev.tasks),
        }));
      }
    }, 0);
  };

  const deleteSubTask = (subTaskId: string) => {
    updateTodoState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) => ({
        ...task,
        subtasks: task.subtasks.filter((subtask) => subtask.id !== subTaskId),
      })),
      updatedAt: new Date().toISOString(),
    }));
  };

  const addNote = () => {
    if (!todo || todo.notes.length > 0) return;

    const newNoteId = generateId();
    updateTodoState((prev) => ({
      ...prev,
      notes: [
        {
          id: newNoteId,
          note: "",
        },
      ],
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateNote = (noteId: string, note: string) => {
    updateTodoState((prev) => ({
      ...prev,
      notes: prev.notes.map((n) => (n.id === noteId ? { ...n, note } : n)),
      updatedAt: new Date().toISOString(),
    }));
  };

  const deleteNote = (noteId: string) => {
    updateTodoState((prev) => ({
      ...prev,
      notes: prev.notes.filter((note) => note.id !== noteId),
      updatedAt: new Date().toISOString(),
    }));
  };

  const deleteTodo = async () => {
    if (!todo) return;

    try {
      await deleteTodoWithRelations(todo.id, userId);
      // Navigate back or reset to new todo
      const newTodo = createNewTodo(dateKey);
      setTodo(newTodo);
      setFocusedTaskId(newTodo.tasks[0].id);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
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
    } else if (e.key === "Delete" && e.ctrlKey) {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#191919] text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded mb-4"></div>
            <div className="h-6 bg-gray-700 rounded mb-2"></div>
            <div className="h-6 bg-gray-700 rounded mb-2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!todo) return null;

  const stats = calculateStats(todo.tasks);

  return (
    <div className="min-h-screen bg-[#191919] text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Status Indicator */}
        <div className="mb-4">
          <div className="text-sm text-gray-400">
            {isSaving
              ? "Saving..."
              : hasUnsavedChanges
              ? "Unsaved changes (autosaving)"
              : "Saved"}
          </div>
        </div>

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
