import { ChevronLeft, ChevronRight } from "lucide-react";

interface GridCell {
  day: number | null;
  isEmpty: boolean;
  isCompleted?: boolean;
  isToday?: boolean;
  isFuture?: boolean;
}

interface MonthlyGridProps {
  gridData: GridCell[];
  monthName: string;
  year: number;
}

export function MonthlyGrid({ gridData, monthName, year }: MonthlyGridProps) {
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getSquareColor = (cell: GridCell) => {
    if (cell.isEmpty) return "bg-transparent";
    if (cell.isFuture) return "bg-[#0a0a0a] border-2 border-gray-700/50";
    if (cell.isCompleted)
      return "bg-blue-500 hover:bg-blue-400 shadow-lg shadow-blue-500/25";
    if (cell.isToday)
      return "bg-orange-500 ring-2 ring-orange-400/50 shadow-lg shadow-orange-500/25";
    return "bg-gray-700 border-2 border-gray-600/50 hover:bg-gray-600 hover:border-gray-500";
  };

  const getTextColor = (cell: GridCell) => {
    if (cell.isEmpty) return "";
    if (cell.isFuture) return "text-gray-500";
    if (cell.isCompleted) return "text-white font-semibold";
    if (cell.isToday) return "text-white font-bold";
    return "text-gray-300";
  };

  return (
    <div>
      {/* Month Header */}
      <div className="flex items-center justify-between mb-6">
        <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-400" />
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-1">
            {monthName} {year}
          </h2>
          <div className="text-sm text-gray-400">Track your daily progress</div>
        </div>

        <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-2 mb-3">
        {dayLabels.map((label) => (
          <div key={label} className="text-center py-2">
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {gridData.map((cell, index) => (
          <div
            key={index}
            className={`
              relative w-12 h-12 rounded-lg transition-all duration-200 
              ${getSquareColor(cell)}
              ${
                !cell.isEmpty && !cell.isFuture
                  ? "cursor-pointer hover:scale-110 transform"
                  : ""
              }
              group
            `}
            title={
              cell.isEmpty
                ? ""
                : cell.isFuture
                ? `${monthName} ${cell.day} - Future`
                : `${monthName} ${cell.day} - ${
                    cell.isCompleted ? "Completed ✅" : "Not completed ❌"
                  }`
            }
          >
            {/* Day number */}
            {cell.day && !cell.isEmpty && (
              <div
                className={`
                w-full h-full flex items-center justify-center text-sm 
                ${getTextColor(cell)}
              `}
              >
                {cell.day}
              </div>
            )}

            {/* Completion indicator */}
            {cell.isCompleted && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-[#1a1a1a]" />
            )}

            {/* Today indicator */}
            {cell.isToday && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-orange-300 rounded-full" />
            )}

            {/* Hover effect */}
            <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>

      {/* Month Summary */}
      <div className="mt-6 p-4 bg-[#0f0f0f] rounded-lg border border-gray-800">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">This month's progress</span>
          <span className="text-blue-400 font-semibold">
            {gridData.filter((cell) => cell.isCompleted).length} days completed
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-500"
            style={{
              width: `${
                (gridData.filter((cell) => cell.isCompleted).length /
                  gridData.filter((cell) => !cell.isEmpty && !cell.isFuture)
                    .length) *
                100
              }%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
