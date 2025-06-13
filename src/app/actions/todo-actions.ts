"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Todo } from "@/types/todos";
import { transformPrismaToTodo } from "@/utils/dataTransformers";

export async function createTodoWithRelations(todoData: Todo, userId: string) {
  try {
    const todo = await prisma.todo.create({
      data: {
        id: todoData.id,
        hasCompletedAllTasks: todoData.hasCompletedAllTasks,
        // Ensure dates are properly formatted
        createdAt:
          typeof todoData.createdAt === "string"
            ? todoData.createdAt
            : new Date(todoData.createdAt).toISOString(),
        updatedAt:
          typeof todoData.updatedAt === "string"
            ? todoData.updatedAt
            : new Date(todoData.updatedAt).toISOString(),
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
    return todo;
  } catch (error) {
    console.error("Error creating todo:", error);
    throw error;
  }
}

export async function updateTodoWithRelations(todoData: Todo, userId: string) {
  try {
    const todo = await prisma.$transaction(async (tx) => {
      await tx.task.deleteMany({
        where: { todoId: todoData.id },
      });

      await tx.notes.deleteMany({
        where: { todoId: todoData.id },
      });

      return await tx.todo.update({
        where: {
          id: todoData.id,
          userId: userId,
        },
        data: {
          hasCompletedAllTasks: todoData.hasCompletedAllTasks,
          updatedAt:
            typeof todoData.updatedAt === "string"
              ? todoData.updatedAt
              : new Date(todoData.updatedAt).toISOString(),
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
    return todo;
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
