export interface Todo {
  hasCompletedAllTasks: boolean;
  updatedAt: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
}

export interface CompletedDay {
  day: number;
  isCompleted: boolean;
}
export function getCompletedDaysForMonth(
  todos: Todo[],
  year: number,
  month: number
): Set<number> {
  const completedDays = new Set<number>();

  todos.forEach((todo) => {
    if (todo.hasCompletedAllTasks) {
      const todoDate = new Date(todo.updatedAt);
      if (todoDate.getFullYear() === year && todoDate.getMonth() === month) {
        completedDays.add(todoDate.getDate());
      }
    }
  });

  return completedDays;
}

export function getMonthGridData(
  year: number,
  month: number,
  completedDays: Set<number>
) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const today = new Date().getDate();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const isCurrentMonth = year === currentYear && month === currentMonth;

  const grid = [];

  // Add empty cells for days before the first day of month
  for (let i = 0; i < firstDayOfMonth; i++) {
    grid.push({ day: null, isEmpty: true });
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    grid.push({
      day,
      isEmpty: false,
      isCompleted: completedDays.has(day),
      isToday: isCurrentMonth && day === today,
      isFuture: isCurrentMonth && day > today,
    });
  }

  return grid;
}
