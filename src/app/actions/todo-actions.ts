"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Todo } from "@/types/todos";
import { transformPrismaToTodo } from "@/utils/dataTransformers";

export async function createTodoWithRelations(todoData: Todo, userId: string) {
  try {
    const todo = await prisma.todo.create({
      data: {
        hasCompletedAllTasks: todoData.hasCompletedAllTasks,
        createdAt: todoData.createdAt,
        updatedAt: todoData.updatedAt,
        User: { connect: { id: userId } },
        task: {
          create: todoData.tasks.map((task) => ({
            id: task.id,
            title: task.title,
            completed: task.completed,
            createdAt: new Date(),
            updatedAt: new Date(),
            SubTask: {
              create: task.subtasks.map((subtask) => ({
                id: subtask.id,
                title: subtask.title,
                completed: subtask.completed,
                createdAt: new Date(),
                updatedAt: new Date(),
              })),
            },
          })),
        },
        Notes: {
          create: todoData.notes.map((note) => ({
            id: note.id,
            note: note.note,
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
        },
      },
      include: {
        task: {
          include: {
            SubTask: true,
          },
        },
        Notes: true,
      },
    });

    revalidatePath("/todos");
    return transformPrismaToTodo(todo);
  } catch (error) {
    console.error("Error creating todo:", error);
    throw error;
  }
}

export async function updateTodoWithRelations(todoData: Todo, userId: string) {
  try {
    const todo = await prisma.$transaction(async (tx) => {
      // Delete existing tasks and notes
      await tx.subTask.deleteMany({
        where: {
          task: {
            todoId: todoData.id,
          },
        },
      });

      await tx.task.deleteMany({
        where: { todoId: todoData.id },
      });

      await tx.notes.deleteMany({
        where: { todoId: todoData.id },
      });

      // Update todo with new data
      return await tx.todo.update({
        where: {
          id: todoData.id,
          userId: userId,
        },
        data: {
          hasCompletedAllTasks: todoData.hasCompletedAllTasks,
          updatedAt: todoData.updatedAt,
          task: {
            create: todoData.tasks.map((task) => ({
              id: task.id,
              title: task.title,
              completed: task.completed,
              createdAt: new Date(),
              updatedAt: new Date(),
              SubTask: {
                create: task.subtasks.map((subtask) => ({
                  id: subtask.id,
                  title: subtask.title,
                  completed: subtask.completed,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                })),
              },
            })),
          },
          Notes: {
            create: todoData.notes.map((note) => ({
              id: note.id,
              note: note.note,
              createdAt: new Date(),
              updatedAt: new Date(),
            })),
          },
        },
        include: {
          task: {
            include: {
              SubTask: true,
            },
          },
          Notes: true,
        },
      });
    });

    revalidatePath("/todos");
    return transformPrismaToTodo(todo);
  } catch (error) {
    console.error("Error updating todo:", error);
    throw error;
  }
}

export async function deleteTodoWithRelations(todoId: string, userId: string) {
  try {
    await prisma.todo.delete({
      where: {
        id: todoId,
        userId: userId,
      },
    });

    revalidatePath("/todos");
    return { success: true, message: "Todo deleted successfully" };
  } catch (error) {
    console.error("Error deleting todo:", error);
    throw error;
  }
}

export async function getTodoById(
  todoId: string,
  userId: string
): Promise<Todo | null> {
  try {
    const prismaTodo = await prisma.todo.findUnique({
      where: {
        id: todoId,
        userId: userId,
      },
      include: {
        task: {
          include: {
            SubTask: true,
          },
        },
        Notes: true,
      },
    });

    return prismaTodo ? transformPrismaToTodo(prismaTodo) : null;
  } catch (error) {
    console.error("Error fetching todo:", error);
    throw error;
  }
}

export async function getTodoByDate(
  date: string, // Format: YYYY-MM-DD
  userId: string
): Promise<Todo | null> {
  try {
    // Find the todo for the user where createdAt starts with the date string
    const prismaTodo = await prisma.todo.findFirst({
      where: {
        userId: userId,
        createdAt: {
          startsWith: date,
        },
      },
      include: {
        task: {
          include: {
            SubTask: true,
          },
        },
        Notes: true,
      },
    });
    return prismaTodo ? transformPrismaToTodo(prismaTodo) : null;
  } catch (error) {
    console.error("Error fetching todo by date:", error);
    return null;
  }
}

export async function getTodayTodo(userId: string): Promise<Todo | null> {
  const today = new Date().toISOString().split("T")[0];
  return getTodoByDate(today, userId);
}

export async function getAllTodos(userId: string): Promise<Todo[]> {
  try {
    const prismaTodos = await prisma.todo.findMany({
      where: {
        userId: userId,
      },
      include: {
        task: {
          include: {
            SubTask: true,
          },
        },
        Notes: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return prismaTodos.map(transformPrismaToTodo);
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw error;
  }
}

export async function getTodosByDateRange(
  startDate: string,
  endDate: string,
  userId: string
): Promise<Todo[]> {
  try {
    const prismaTodos = await prisma.todo.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        task: {
          include: {
            SubTask: true,
          },
        },
        Notes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return prismaTodos.map(transformPrismaToTodo);
  } catch (error) {
    console.error("Error fetching todos by date range:", error);
    throw error;
  }
}

// Additional CRUD operations for individual tasks and subtasks
export async function updateSingleTask(
  taskId: string,
  updates: { title?: string; completed?: boolean },
  userId: string
) {
  try {
    const task = await prisma.task.update({
      where: {
        id: taskId,
        todo: {
          userId: userId,
        },
      },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
    });

    // Update parent todo's updatedAt
    await prisma.todo.update({
      where: {
        id: task.todoId,
        userId: userId,
      },
      data: {
        updatedAt: new Date().toISOString(),
      },
    });

    revalidatePath("/todos");
    return task;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}

export async function updateSingleSubTask(
  subTaskId: string,
  updates: { title?: string; completed?: boolean },
  userId: string
) {
  try {
    const subtask = await prisma.subTask.update({
      where: {
        id: subTaskId,
        task: {
          todo: {
            userId: userId,
          },
        },
      },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
      include: {
        task: true,
      },
    });

    // Update parent todo's updatedAt
    await prisma.todo.update({
      where: {
        id: subtask.task.todoId,
        userId: userId,
      },
      data: {
        updatedAt: new Date().toISOString(),
      },
    });

    revalidatePath("/todos");
    return subtask;
  } catch (error) {
    console.error("Error updating subtask:", error);
    throw error;
  }
}

export async function deleteTask(taskId: string, userId: string) {
  try {
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
        todo: {
          userId: userId,
        },
      },
      select: {
        todoId: true,
      },
    });

    if (!task) {
      throw new Error("Task not found or unauthorized");
    }

    await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    // Update parent todo's updatedAt
    await prisma.todo.update({
      where: {
        id: task.todoId,
        userId: userId,
      },
      data: {
        updatedAt: new Date().toISOString(),
      },
    });

    revalidatePath("/todos");
    return { success: true };
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
}

export async function deleteSubTask(subTaskId: string, userId: string) {
  try {
    const subtask = await prisma.subTask.findUnique({
      where: {
        id: subTaskId,
        task: {
          todo: {
            userId: userId,
          },
        },
      },
      include: {
        task: true,
      },
    });

    if (!subtask) {
      throw new Error("Subtask not found or unauthorized");
    }

    await prisma.subTask.delete({
      where: {
        id: subTaskId,
      },
    });

    await prisma.todo.update({
      where: {
        id: subtask.task.todoId,
        userId: userId,
      },
      data: {
        updatedAt: new Date().toISOString(),
      },
    });

    revalidatePath("/todos");
    return { success: true };
  } catch (error) {
    console.error("Error deleting subtask:", error);
    throw error;
  }
}
