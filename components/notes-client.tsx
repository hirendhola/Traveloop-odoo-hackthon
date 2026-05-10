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
      {/* Add note CTA */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-[#5A6B7A]">{notes.length} {notes.length === 1 ? "note" : "notes"}</p>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="h-8 rounded-full bg-[#FF5733] px-4 text-sm text-[#0D1B2A] hover:bg-[#FF8A6C]"
        >
          <Plus size={14} className="mr-1.5" />
          New Note
        </Button>
      </div>

      {/* New note form */}
      {showForm && (
        <div className="rounded-xl border-2 border-[#FF5733]/20 bg-white/90 p-4 space-y-3">
          <Textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Write your note… tips, reminders, ideas"
            rows={4}
            autoFocus
            className="resize-none border-[#D4C9B0] bg-[#F8F4EC] text-sm focus-visible:border-[#FF5733]"
          />
          <div className="flex gap-2">
            <Button
              onClick={addNote}
              disabled={adding || !newContent.trim()}
              className="rounded-full bg-[#FF5733] px-4 text-sm text-[#0D1B2A] hover:bg-[#FF8A6C] disabled:opacity-50"
            >
              {adding ? "Saving…" : "Save Note"}
            </Button>
            <Button
              variant="outline"
              onClick={() => { setShowForm(false); setNewContent(""); }}
              className="rounded-full border-[#D4C9B0] px-4 text-sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Notes list */}
      {notes.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-[#D4C9B0] bg-[#F5ECD7] py-16 text-center">
          <BookOpen size={40} className="mb-3 text-[#D4C9B0]" />
          <p className="font-medium text-[#0D1B2A]">No notes yet</p>
          <p className="mt-1 text-sm text-[#5A6B7A]">Jot down tips, reminders, or ideas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="group rounded-xl border border-[#D4C9B0] bg-white/80 p-4"
            >
              {editingId === note.id ? (
                <div className="space-y-3">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={4}
                    autoFocus
                    className="resize-none border-[#D4C9B0] bg-[#F8F4EC] text-sm focus-visible:border-[#FF5733]"
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
                      className="flex items-center gap-1 rounded-full border border-[#D4C9B0] px-3 py-1.5 text-xs text-[#5A6B7A] hover:bg-[#EDE4CF]"
                    >
                      <X size={12} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Note content */}
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#0D1B2A]">
                    {note.content}
                  </p>

                  {/* Footer */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {note.cityName && (
                        <span className="rounded-full bg-[#F0E8D9] px-2 py-0.5 text-xs text-[#5A6B7A]">
                          📍 {note.cityName}
                        </span>
                      )}
                      <span className="text-xs text-[#A0AEBF]">
                        {timeAgo(note.updatedAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => startEdit(note)}
                        className="rounded p-1.5 text-[#A0AEBF] hover:bg-[#EDE4CF] hover:text-[#0D1B2A] transition-colors"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteNote(note.id)}
                        disabled={deletingId === note.id}
                        className="rounded p-1.5 text-[#A0AEBF] hover:bg-[#E11D48]/10 hover:text-[#E11D48] transition-colors disabled:opacity-40"
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
