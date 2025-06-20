export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  taskId: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  isEditing: boolean;
  subtasks: SubTask[];
  isExpanded: boolean;
}

export interface Note {
  id: string;
  note: string;
}

export interface Todo {
  id?: string;
  tasks: Task[];
  notes: Note[];
  hasCompletedAllTasks: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskItemProps {
  task: Task;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  addSubTask: (taskId: string) => void;
  updateSubTask: (subTaskId: string, updates: Partial<SubTask>) => void;
  deleteSubTask: (subTaskId: string) => void;
  handleKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    taskId: string
  ) => void;
  focusedTaskId: string;
  setFocusedTaskId: React.Dispatch<React.SetStateAction<string>>;
}
