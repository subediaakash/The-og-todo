"use client";
import React, { useState } from "react";
import TodoWorkSpace from "./main-todo";

interface Workspace {
  date: string;
}

interface TodoWorkspaceManagerProps {
  userId: string;
}

export default function TodoWorkspaceManager({
  userId,
}: TodoWorkspaceManagerProps) {
  const today = new Date().toISOString().split("T")[0];
  const [workspaces, setWorkspaces] = useState<Workspace[]>([{ date: today }]);
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [error, setError] = useState<string>("");

  const handleAddWorkspace = () => {
    if (workspaces.find((ws) => ws.date === selectedDate)) {
      setError("Workspace for this date already exists.");
      return;
    }
    setWorkspaces([...workspaces, { date: selectedDate }]);
    setError("");
  };

  return (
    <div className="p-4">
      <div className="mb-6 flex items-center gap-2">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-2 border border-gray-400 rounded"
        />
        <button
          onClick={handleAddWorkspace}
          className="p-2 bg-blue-500 text-white rounded transition-colors hover:bg-blue-600"
        >
          Add Workspace
        </button>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="space-y-8">
        {workspaces.map((ws) => (
          <TodoWorkSpace key={ws.date} userId={userId} selectedDate={ws.date} />
        ))}
      </div>
    </div>
  );
}
