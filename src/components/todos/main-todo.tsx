"use client";
import { useState, useEffect, type KeyboardEvent } from "react";
import type { Todo, Task, SubTask } from "@/types/todos";
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
import { Loader2, Clock, CheckCircle2, AlertCircle } from "lucide-react";

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
  const [saveError, setSaveError] = useState<string>("");

  useEffect(() => {
    loadTodoForDate();
  }, [dateKey, userId]);

  useEffect(() => {
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
      setSaveError("");
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
      setSaveError("Failed to load todo data");
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
      setSaveError("");

      if (todo.id) {
        await updateTodoWithRelations(todo, userId);
      } else {
        const created = await createTodoWithRelations(todo, userId);
        setTodo(created);
      }

      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error saving todo:", error);
      setSaveError("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const updateTodoState = (updater: (prev: Todo) => Todo) => {
    setTodo((prev) => {
      if (!prev) return prev;
      const updated = updater(prev);
      setHasUnsavedChanges(true);
      setSaveError("");
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
    if (!todo || !todo.id) return;

    try {
      await deleteTodoWithRelations(todo.id, userId);
      const newTodo = createNewTodo(dateKey);
      setTodo(newTodo);
      setFocusedTaskId(newTodo.tasks[0].id);
    } catch (error) {
      console.error("Error deleting todo:", error);
      setSaveError("Failed to delete todo");
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
      <div className="min-h-screen bg-gradient-to-br from-[#191919] via-[#1a1a1a] to-[#181818] text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-300">
                  Loading your workspace
                </h3>
                <p className="text-sm text-gray-400">
                  Preparing your tasks for {formattedDate}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!todo) return null;

  const stats = calculateStats(todo.tasks);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#191919] via-[#1a1a1a] to-[#181818] text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Enhanced Status Indicator */}
        <div className="mb-6">
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-800/30 to-gray-700/20 rounded-lg border border-gray-700/30 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              {isSaving ? (
                <>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                  <span className="text-sm font-medium text-blue-400">
                    Saving changes...
                  </span>
                </>
              ) : hasUnsavedChanges ? (
                <>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <Clock className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-400">
                    Auto-saving in progress
                  </span>
                </>
              ) : saveError ? (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium text-red-400">
                    {saveError}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-green-400">
                    All changes saved
                  </span>
                </>
              )}
            </div>

            {/* Last updated timestamp */}
            {todo.updatedAt && !hasUnsavedChanges && !isSaving && (
              <div className="ml-auto text-xs text-gray-500 font-mono">
                Last updated: {new Date(todo.updatedAt).toLocaleTimeString()}
              </div>
            )}
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

        <div className="space-y-8">
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
            <div className="animate-in slide-in-from-bottom-4 duration-300">
              <NoteSection
                note={todo.notes[0]}
                updateNote={updateNote}
                deleteNote={deleteNote}
              />
            </div>
          )}
        </div>

        {/* Floating Action Hint */}
        {todo.tasks.length === 1 && todo.tasks[0].title === "" && (
          <div className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full shadow-lg shadow-blue-500/25 animate-bounce">
            <div className="text-white text-sm font-medium">
              Start typing to create your first task!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
