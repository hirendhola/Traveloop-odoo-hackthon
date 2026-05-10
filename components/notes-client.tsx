"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Pencil, Check, X, BookOpen } from "lucide-react";

type Note = {
  id: string;
  content: string;
  stopId: string | null;
  cityName: string | null;
  createdAt: string;
  updatedAt: string;
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function NotesClient({
  tripId, initialNotes,
}: { tripId: string; initialNotes: Note[] }) {
  const [notes, setNotes] = useState(initialNotes);
  const [newContent, setNewContent] = useState("");
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function addNote() {
    if (!newContent.trim()) return;
    setAdding(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newContent.trim() }),
      });
      if (res.ok) {
        const note = await res.json();
        setNotes((prev) => [
          { ...note, cityName: null, createdAt: note.createdAt, updatedAt: note.updatedAt },
          ...prev,
        ]);
        setNewContent("");
        setShowForm(false);
      }
    } finally { setAdding(false); }
  }

  function startEdit(note: Note) {
    setEditingId(note.id);
    setEditContent(note.content);
  }

  async function saveEdit(noteId: string) {
    if (!editContent.trim()) return;
    setSavingId(noteId);
    try {
      const res = await fetch(`/api/trips/${tripId}/notes/${noteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent.trim() }),
      });
      if (res.ok) {
        const updated = await res.json();
        setNotes((prev) =>
          prev.map((n) =>
            n.id === noteId ? { ...n, content: updated.content, updatedAt: updated.updatedAt } : n
          )
        );
        setEditingId(null);
      }
    } finally { setSavingId(null); }
  }

  async function deleteNote(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/trips/${tripId}/notes/${id}`, { method: "DELETE" });
      if (res.ok) setNotes((prev) => prev.filter((n) => n.id !== id));
    } finally { setDeletingId(null); }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-[rgba(240,237,230,0.45)]">{notes.length} {notes.length === 1 ? "note" : "notes"}</p>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="h-9 rounded-full bg-[#E8C547] px-4 text-sm font-semibold text-[#080C10] hover:bg-[#d4b33f]"
        >
          <Plus size={14} className="mr-1.5" />
          New Note
        </Button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4 space-y-3">
          <Textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Write your note… tips, reminders, ideas"
            rows={4}
            autoFocus
            className="resize-none border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-sm text-[#F0EDE6] placeholder:text-[rgba(240,237,230,0.25)] focus-visible:border-[#E8C547]"
          />
          <div className="flex gap-2">
            <Button
              onClick={addNote}
              disabled={adding || !newContent.trim()}
              className="h-8 rounded-full bg-[#E8C547] px-4 text-xs font-semibold text-[#080C10] hover:bg-[#d4b33f] disabled:opacity-50"
            >
              {adding ? "Saving…" : "Save Note"}
            </Button>
            <Button
              variant="outline"
              onClick={() => { setShowForm(false); setNewContent(""); }}
              className="h-8 rounded-full border-[rgba(255,255,255,0.08)] bg-transparent text-xs text-[rgba(240,237,230,0.55)] hover:bg-[rgba(255,255,255,0.06)]"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {notes.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] py-16 text-center">
          <BookOpen size={40} className="mb-3 text-[rgba(240,237,230,0.2)]" />
          <p className="font-medium text-[#F0EDE6]">No notes yet</p>
          <p className="mt-1 text-sm text-[rgba(240,237,230,0.45)]">Jot down tips, reminders, or ideas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="group rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-4"
            >
              {editingId === note.id ? (
                <div className="space-y-3">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={4}
                    autoFocus
                    className="resize-none border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-sm text-[#F0EDE6] focus-visible:border-[#E8C547]"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => saveEdit(note.id)}
                      disabled={savingId === note.id}
                      className="flex items-center gap-1 rounded-full bg-[#7D9B76] px-3 py-1.5 text-xs text-white hover:bg-[#6A8A64] disabled:opacity-50"
                    >
                      <Check size={12} />
                      {savingId === note.id ? "Saving…" : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="flex items-center gap-1 rounded-full border border-[rgba(255,255,255,0.08)] px-3 py-1.5 text-xs text-[rgba(240,237,230,0.55)] hover:bg-[rgba(255,255,255,0.06)]"
                    >
                      <X size={12} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#F0EDE6]">
                    {note.content}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {note.cityName && (
                        <span className="rounded-full bg-[rgba(255,255,255,0.06)] px-2 py-0.5 text-xs text-[rgba(240,237,230,0.5)]">
                          {note.cityName}
                        </span>
                      )}
                      <span className="text-xs text-[rgba(240,237,230,0.35)]">
                        {timeAgo(note.updatedAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => startEdit(note)}
                        className="rounded p-1.5 text-[rgba(240,237,230,0.35)] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#F0EDE6] transition-colors"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteNote(note.id)}
                        disabled={deletingId === note.id}
                        className="rounded p-1.5 text-[rgba(240,237,230,0.35)] hover:bg-[#E05252]/10 hover:text-[#E05252] transition-colors disabled:opacity-40"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
