import { Todo, Task, SubTask, Note } from "@/types/todos";

// Type for Prisma Todo with relations
interface PrismaTodo {
  id: string;
  createdAt: string;
  updatedAt: string;
  hasCompletedAllTasks: boolean;
  task: PrismaTask[];
  Notes: PrismaNote[];
}

interface PrismaTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  SubTask: PrismaSubTask[];
}

interface PrismaSubTask {
  id: string;
  title: string;
  completed: boolean;
  taskId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PrismaNote {
  id: string;
  note: string;
  createdAt: Date;
  updatedAt: Date;
}

export function transformPrismaToTodo(prismaTodo: PrismaTodo): Todo {
  return {
    id: prismaTodo.id,
    createdAt: prismaTodo.createdAt,
    updatedAt: prismaTodo.updatedAt,
    hasCompletedAllTasks: prismaTodo.hasCompletedAllTasks,
    tasks: prismaTodo.task.map(transformPrismaToTask),
    notes: prismaTodo.Notes.map(transformPrismaToNote),
  };
}

export function transformPrismaToTask(prismaTask: PrismaTask): Task {
  return {
    id: prismaTask.id,
    title: prismaTask.title,
    completed: prismaTask.completed,
    isEditing: false, // This is UI state, not persisted
    isExpanded: prismaTask.SubTask.length > 0, // Expand if has subtasks
    subtasks: prismaTask.SubTask.map(transformPrismaToSubTask),
  };
}

export function transformPrismaToSubTask(
  prismaSubTask: PrismaSubTask
): SubTask {
  return {
    id: prismaSubTask.id,
    title: prismaSubTask.title,
    completed: prismaSubTask.completed,
    taskId: prismaSubTask.taskId,
  };
}

export function transformPrismaToNote(prismaNote: PrismaNote): Note {
  return {
    id: prismaNote.id,
    note: prismaNote.note,
  };
}

// Helper functions for common transformations
export function getTodoDateFromId(todoId: string): string {
  // Extract date from todo ID format: "todo-YYYY-MM-DD"
  return todoId.replace("todo-", "");
}

export function createTodoIdFromDate(date: string): string {
  // Create todo ID from date: "todo-YYYY-MM-DD"
  return `todo-${date}`;
}

export function formatDateForDatabase(date: Date): string {
  return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD
}

// Validation helpers
export function isValidTodo(todo: any): todo is Todo {
  return (
    typeof todo === "object" &&
    typeof todo.id === "string" &&
    Array.isArray(todo.tasks) &&
    Array.isArray(todo.notes) &&
    typeof todo.hasCompletedAllTasks === "boolean" &&
    typeof todo.createdAt === "string" &&
    typeof todo.updatedAt === "string"
  );
}

export function isValidTask(task: any): task is Task {
  return (
    typeof task === "object" &&
    typeof task.id === "string" &&
    typeof task.title === "string" &&
    typeof task.completed === "boolean" &&
    typeof task.isEditing === "boolean" &&
    typeof task.isExpanded === "boolean" &&
    Array.isArray(task.subtasks)
  );
}

export function isValidSubTask(subtask: any): subtask is SubTask {
  return (
    typeof subtask === "object" &&
    typeof subtask.id === "string" &&
    typeof subtask.title === "string" &&
    typeof subtask.completed === "boolean" &&
    typeof subtask.taskId === "string"
  );
}
