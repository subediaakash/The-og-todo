import { Todo, Task, SubTask, Note } from "@/types/todos";

type PrismaTodo = {
  id: string;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
  hasCompletedAllTasks: boolean;
  task: {
    id: string;
    todoId: string;
    title: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
    SubTask: {
      id: string;
      taskId: string;
      title: string;
      completed: boolean;
      createdAt: Date;
      updatedAt: Date;
    }[];
  }[];
  Notes: {
    id: string;
    note: string;
    createdAt: Date;
    updatedAt: Date;
    todoId: string | null;
  }[];
};

export function transformPrismaToTodo(prismaTodo: PrismaTodo): Todo {
  return {
    id: prismaTodo.id,
    createdAt: prismaTodo.createdAt,
    updatedAt: prismaTodo.updatedAt,
    hasCompletedAllTasks: prismaTodo.hasCompletedAllTasks,
    tasks: prismaTodo.task.map((task) => ({
      id: task.id,
      title: task.title,
      completed: task.completed,
      isEditing: false,
      isExpanded: false,
      subtasks: task.SubTask.map((subtask) => ({
        id: subtask.id,
        title: subtask.title,
        completed: subtask.completed,
        taskId: subtask.taskId,
      })),
    })),
    notes: prismaTodo.Notes.map((note) => ({
      id: note.id,
      note: note.note,
    })),
  };
}

export function transformTodoToPrisma(todo: Todo) {
  return {
    id: todo.id,
    createdAt: todo.createdAt,
    updatedAt: todo.updatedAt,
    hasCompletedAllTasks: todo.hasCompletedAllTasks,
  };
}
