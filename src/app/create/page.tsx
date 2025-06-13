"use client";
import React, {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  MouseEvent,
  ChangeEvent,
  FocusEvent,
} from "react";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  StickyNote,
  Trash2,
  Calendar,
} from "lucide-react";

interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  taskId: string;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  isEditing: boolean;
  subtasks: SubTask[];
  isExpanded: boolean;
}

interface Note {
  id: string;
  note: string;
}

interface Todo {
  id: string;
  tasks: Task[];
  notes: Note[];
  hasCompletedAllTasks: boolean;
  createdAt: string;
  updatedAt: string;
}

function TodoWorkSpace() {
  const date = new Date();
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
  const [showHelp, setShowHelp] = useState<boolean>(false);

  const generateId = () =>
    Math.random().toString(36).substring(2) + Date.now().toString(36);

  // Task operations
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

  // Notes operations
  const addNote = () => {
    const newNoteId = generateId();
    setTodo((prev) => ({
      ...prev,
      notes: [
        ...prev.notes,
        {
          id: newNoteId,
          note: "",
        },
      ],
    }));
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
      setTodo((prev) => {
        const allTasksCompleted = prev.tasks.every((task) => {
          if (task.subtasks.length === 0) {
            return task.completed;
          }
          return (
            task.completed &&
            task.subtasks.every((subtask) => subtask.completed)
          );
        });
        return { ...prev, hasCompletedAllTasks: allTasksCompleted };
      });
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

  const handleEmptyAreaClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      addNewTask();
    }
  };

  // Calculate stats
  const totalTasks = todo.tasks.length;
  const completedTasks = todo.tasks.filter((task) => task.completed).length;
  const totalSubTasks = todo.tasks.reduce(
    (acc, task) => acc + task.subtasks.length,
    0
  );
  const completedSubTasks = todo.tasks.reduce(
    (acc, task) =>
      acc + task.subtasks.filter((subtask) => subtask.completed).length,
    0
  );

  return (
    <div className="min-h-screen bg-[#191919] text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
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
                {todo.hasCompletedAllTasks && (
                  <span className="text-green-500 text-sm font-medium">
                    🎉 All Done!
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={addNote}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
                title="Add Note"
              >
                <StickyNote className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowHelp(!showHelp)}
                className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-400 transition-colors"
                title="Help"
              >
                <span className="text-sm font-medium">?</span>
              </button>

              {/* Help Dropdown */}
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

        {/* Main Content */}
        <div className="space-y-6">
          {/* Tasks Section */}
          <div
            className="bg-[#0f0f0f] rounded-lg p-6 border border-gray-800"
            onClick={handleEmptyAreaClick}
          >
            <div className="space-y-2">
              {todo.tasks.map((task) => (
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

            {todo.tasks.length === 1 && todo.tasks[0].title === "" && (
              <div className="text-gray-500 text-sm mt-4 italic">
                Click anywhere to add your first task for today...
              </div>
            )}
          </div>

          {/* Notes Section */}
          {todo.notes.length > 0 && (
            <div className="bg-[#0f0f0f] rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-gray-300">
                <StickyNote className="w-5 h-5" />
                Notes
              </h3>
              <div className="space-y-3">
                {todo.notes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-[#1a1a1a] rounded-lg p-4 group"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <textarea
                        value={note.note}
                        onChange={(e) => updateNote(note.id, e.target.value)}
                        placeholder="Write your notes here..."
                        className="flex-1 bg-transparent border-none outline-none text-gray-300 placeholder-gray-500 resize-none min-h-[80px]"
                      />
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface TaskItemProps {
  task: Task;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  addSubTask: (taskId: string) => void;
  updateSubTask: (subTaskId: string, updates: Partial<SubTask>) => void;
  deleteSubTask: (subTaskId: string) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>, taskId: string) => void;
  focusedTaskId: string;
  setFocusedTaskId: React.Dispatch<React.SetStateAction<string>>;
}

function TaskItem({
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

  const handleSubTaskCheck = (subTaskId: string, completed: boolean) => {
    updateSubTask(subTaskId, { completed });
  };

  const handleItemClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div className="space-y-2" onClick={handleItemClick}>
      {/* Main Task */}
      <div className="flex items-center gap-3 p-2 rounded-md hover:bg-[#1a1a1a] transition-colors group">
        {/* Expand/Collapse for subtasks */}
        {task.subtasks.length > 0 && (
          <button
            onClick={toggleSubtasks}
            className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
          >
            {task.isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        )}

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
        <div className="ml-8 space-y-1">
          {task.subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-[#1a1a1a] transition-colors group"
            >
              <div className="flex-shrink-0">
                <input
                  type="checkbox"
                  checked={subtask.completed}
                  onChange={(e) =>
                    handleSubTaskCheck(subtask.id, e.target.checked)
                  }
                  className="w-3 h-3 rounded border-gray-600 bg-transparent border-2 
                             checked:bg-green-500 checked:border-green-500 
                             cursor-pointer transition-all"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={subtask.title}
                  onChange={(e) =>
                    updateSubTask(subtask.id, { title: e.target.value })
                  }
                  placeholder="Enter subtask..."
                  className={`w-full bg-transparent border-none outline-none text-sm text-gray-300 placeholder-gray-500
                             ${
                               subtask.completed
                                 ? "line-through text-gray-500"
                                 : ""
                             }
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
          ))}
        </div>
      )}
    </div>
  );
}

export default TodoWorkSpace;
