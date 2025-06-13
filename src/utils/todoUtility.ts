import { Task } from "../types/todos";
export const generateId = (): string =>
  Math.random().toString(36).substring(2) + Date.now().toString(36);

export const formatDate = (date: Date): string =>
  date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export const calculateStats = (tasks: Task[]) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalSubTasks = tasks.reduce(
    (acc, task) => acc + task.subtasks.length,
    0
  );
  const completedSubTasks = tasks.reduce(
    (acc, task) =>
      acc + task.subtasks.filter((subtask) => subtask.completed).length,
    0
  );

  return {
    totalTasks,
    completedTasks,
    totalSubTasks,
    completedSubTasks,
  };
};

export const checkAllTasksCompleted = (tasks: Task[]): boolean => {
  return tasks.every((task) => {
    if (task.subtasks.length === 0) {
      return task.completed;
    }
    return (
      task.completed && task.subtasks.every((subtask) => subtask.completed)
    );
  });
};
