"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, RotateCcw, Trash2, Check } from "lucide-react";

type Category = "clothing" | "documents" | "electronics" | "toiletries" | "other";

type ChecklistItem = {
  id: string;
  label: string;
  category: Category;
  isPacked: boolean;
  createdAt: string;
};

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "clothing",    label: "Clothing" },
  { value: "documents",   label: "Documents" },
  { value: "electronics", label: "Electronics" },
  { value: "toiletries",  label: "Toiletries" },
  { value: "other",       label: "Other" },
];

export function ChecklistClient({
  tripId, initialItems,
}: { tripId: string; initialItems: ChecklistItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [newLabel, setNewLabel] = useState("");
  const [newCategory, setNewCategory] = useState<Category>("other");
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const packed = items.filter((i) => i.isPacked).length;
  const total = items.length;
  const pct = total > 0 ? Math.round((packed / total) * 100) : 0;

  async function addItem() {
    if (!newLabel.trim()) return;
    setAdding(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/checklist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newLabel.trim(), category: newCategory }),
      });
      if (res.ok) {
        const item = await res.json();
        setItems((prev) => [...prev, { ...item, createdAt: item.createdAt }]);
        setNewLabel(""); setShowForm(false);
      }
    } finally { setAdding(false); }
  }

  async function togglePacked(item: ChecklistItem) {
    const next = !item.isPacked;
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, isPacked: next } : i));
    await fetch(`/api/trips/${tripId}/checklist/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPacked: next }),
    });
  }

  async function deleteItem(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/trips/${tripId}/checklist/${id}`, { method: "DELETE" });
      if (res.ok) setItems((prev) => prev.filter((i) => i.id !== id));
    } finally { setDeletingId(null); }
  }

  async function resetAll() {
    setResetting(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/checklist/reset`, { method: "POST" });
      if (res.ok) setItems((prev) => prev.map((i) => ({ ...i, isPacked: false })));
    } finally { setResetting(false); }
  }

  const grouped = CATEGORIES.map((cat) => ({
    ...cat,
    items: items
      .filter((i) => i.category === cat.value)
      .sort((a, b) => Number(a.isPacked) - Number(b.isPacked)),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="space-y-6">
      {/* Progress */}
      {total > 0 && (
        <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-5 py-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-[rgba(240,237,230,0.55)]">Packing progress</span>
            <span className="font-medium text-[#F0EDE6]">
              {packed}/{total} packed
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
            <div
              className="h-1.5 rounded-full bg-[#E8C547] transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          {pct === 100 && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-[#7D9B76]">
              <Check size={15} /> All packed! Ready to go
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => setShowForm(!showForm)}
          className="h-9 rounded-full bg-[#E8C547] px-4 text-sm font-semibold text-[#080C10] hover:bg-[#d4b33f]"
        >
          <Plus size={14} className="mr-1.5" />
          Add Item
        </Button>
        {total > 0 && (
          <Button
            variant="outline"
            onClick={resetAll}
            disabled={resetting}
            className="h-9 rounded-full border-[rgba(255,255,255,0.08)] px-3 text-xs text-[rgba(240,237,230,0.55)] hover:bg-[rgba(255,255,255,0.06)]"
          >
            <RotateCcw size={12} className="mr-1.5" />
            {resetting ? "Resetting…" : "Reset All"}
          </Button>
        )}
      </div>

      {/* Add form */}
      {showForm && (
        <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1">
              <Label className="text-xs text-[rgba(240,237,230,0.45)]">Item name</Label>
              <Input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g. Passport, Sunscreen…"
                className="border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[#F0EDE6] placeholder:text-[rgba(240,237,230,0.25)] focus:border-[#E8C547]"
                onKeyDown={(e) => e.key === "Enter" && addItem()}
                autoFocus
              />
            </div>
            <div className="col-span-2 space-y-1">
              <Label className="text-xs text-[rgba(240,237,230,0.45)]">Category</Label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setNewCategory(cat.value)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      newCategory === cat.value
                        ? "border-[#E8C547] bg-[rgba(232,197,71,0.12)] text-[#E8C547]"
                        : "border-[rgba(255,255,255,0.08)] text-[rgba(240,237,230,0.45)] hover:border-[#E8C547] hover:text-[#E8C547]"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={addItem}
              disabled={adding || !newLabel.trim()}
              className="h-8 rounded-full bg-[#E8C547] px-4 text-xs font-semibold text-[#080C10] hover:bg-[#d4b33f] disabled:opacity-50"
            >
              {adding ? "Adding…" : "Add"}
            </Button>
            <Button
              variant="outline"
              onClick={() => { setShowForm(false); setNewLabel(""); }}
              className="h-8 rounded-full border-[rgba(255,255,255,0.08)] bg-transparent text-xs text-[rgba(240,237,230,0.55)] hover:bg-[rgba(255,255,255,0.06)]"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Items by category */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] py-14 text-center">
          <p className="text-2xl mb-2 text-[rgba(240,237,230,0.2)]">🎒</p>
          <p className="font-medium text-[#F0EDE6]">Nothing packed yet</p>
          <p className="mt-1 text-sm text-[rgba(240,237,230,0.45)]">Add items to your packing list</p>
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map((group) => {
            const groupPacked = group.items.filter((i) => i.isPacked).length;
            return (
              <div key={group.value} className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] overflow-hidden">
                <div className="flex items-center justify-between bg-[rgba(255,255,255,0.03)] px-4 py-2.5 border-b border-[rgba(255,255,255,0.06)]">
                  <span className="text-sm font-medium text-[#F0EDE6]">
                    {group.label}
                  </span>
                  <span className="text-xs text-[rgba(240,237,230,0.35)]">
                    {groupPacked}/{group.items.length}
                  </span>
                </div>
                <div className="divide-y divide-[rgba(255,255,255,0.04)]">
                  {group.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      <button
                        onClick={() => togglePacked(item)}
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                          item.isPacked
                            ? "border-[#E8C547] bg-[#E8C547] text-[#080C10]"
                            : "border-[rgba(255,255,255,0.15)] bg-transparent hover:border-[#E8C547]"
                        }`}
                      >
                        {item.isPacked && <Check size={12} />}
                      </button>
                      <span className={`flex-1 text-sm ${item.isPacked ? "text-[rgba(240,237,230,0.35)] line-through" : "text-[#F0EDE6]"}`}>
                        {item.label}
                      </span>
                      <button
                        onClick={() => deleteItem(item.id)}
                        disabled={deletingId === item.id}
                        className="shrink-0 text-[rgba(240,237,230,0.2)] transition-colors hover:text-[#E05252] disabled:opacity-40"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
