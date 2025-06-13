// components/NoteSection.tsx
"use client";
import React from "react";
import { StickyNote, Trash2 } from "lucide-react";
import { Note } from "@/types/todos";

interface NoteSectionProps {
  note: Note;
  updateNote: (noteId: string, note: string) => void;
  deleteNote: (noteId: string) => void;
}

export function NoteSection({
  note,
  updateNote,
  deleteNote,
}: NoteSectionProps) {
  return (
    <div className="bg-[#0f0f0f] rounded-lg p-6 border border-gray-800">
      <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-gray-300">
        <StickyNote className="w-5 h-5" />
        Notes
      </h3>
      <div className="bg-[#1a1a1a] rounded-lg p-4 group">
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
    </div>
  );
}
