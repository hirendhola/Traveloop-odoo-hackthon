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

const CATEGORIES: { value: Category; label: string; emoji: string }[] = [
  { value: "clothing",    label: "Clothing",    emoji: "👕" },
  { value: "documents",   label: "Documents",   emoji: "📄" },
  { value: "electronics", label: "Electronics", emoji: "🔋" },
  { value: "toiletries",  label: "Toiletries",  emoji: "🧴" },
  { value: "other",       label: "Other",       emoji: "📦" },
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
        <div className="rounded-xl border border-[#D4C9B0] bg-white/80 px-5 py-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-[#5A6B7A]">Packing progress</span>
            <span className="font-semibold text-[#0D1B2A]">
              {packed}/{total} packed
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-[#EDE4CF]">
            <div
              className="h-3 rounded-full bg-[#7D9B76] transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          {pct === 100 && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-[#7D9B76]">
              <Check size={15} /> All packed! Ready to go 🎉
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => setShowForm(!showForm)}
          className="h-8 rounded-full bg-[#FF5733] px-4 text-sm text-[#0D1B2A] hover:bg-[#FF8A6C]"
        >
          <Plus size={14} className="mr-1.5" />
          Add Item
        </Button>
        {total > 0 && (
          <Button
            variant="outline"
            onClick={resetAll}
            disabled={resetting}
            className="h-8 rounded-full border-[#D4C9B0] px-3 text-xs text-[#5A6B7A] hover:bg-[#EDE4CF]"
          >
            <RotateCcw size={12} className="mr-1.5" />
            {resetting ? "Resetting…" : "Reset All"}
          </Button>
        )}
      </div>

      {/* Add form */}
      {showForm && (
        <div className="rounded-xl border-2 border-[#FF5733]/20 bg-white/80 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1">
              <Label className="text-xs text-[#5A6B7A]">Item name</Label>
              <Input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g. Passport, Sunscreen…"
                className="border-[#D4C9B0]"
                onKeyDown={(e) => e.key === "Enter" && addItem()}
                autoFocus
              />
            </div>
            <div className="col-span-2 space-y-1">
              <Label className="text-xs text-[#5A6B7A]">Category</Label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setNewCategory(cat.value)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      newCategory === cat.value
                        ? "border-[#FF5733] bg-[#FF5733] text-white"
                        : "border-[#D4C9B0] text-[#5A6B7A] hover:border-[#FF5733]"
                    }`}
                  >
                    {cat.emoji} {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={addItem}
              disabled={adding || !newLabel.trim()}
              className="rounded-full bg-[#FF5733] px-4 text-sm text-[#0D1B2A] hover:bg-[#FF8A6C] disabled:opacity-50"
            >
              {adding ? "Adding…" : "Add"}
            </Button>
            <Button
              variant="outline"
              onClick={() => { setShowForm(false); setNewLabel(""); }}
              className="rounded-full border-[#D4C9B0] px-4 text-sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Items by category */}
      {items.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-[#D4C9B0] bg-[#F5ECD7] py-14 text-center">
          <p className="text-2xl mb-2">🎒</p>
          <p className="font-medium text-[#0D1B2A]">Nothing packed yet</p>
          <p className="mt-1 text-sm text-[#5A6B7A]">Add items to your packing list</p>
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map((group) => {
            const groupPacked = group.items.filter((i) => i.isPacked).length;
            return (
              <div key={group.value} className="rounded-xl border border-[#D4C9B0] bg-white/80 overflow-hidden">
                <div className="flex items-center justify-between bg-[#F8F4EC] px-4 py-2.5 border-b border-[#D4C9B0]">
                  <span className="flex items-center gap-2 text-sm font-semibold text-[#0D1B2A]">
                    <span>{group.emoji}</span>
                    {group.label}
                  </span>
                  <span className="text-xs text-[#A0AEBF]">
                    {groupPacked}/{group.items.length}
                  </span>
                </div>
                <div className="divide-y divide-[#F0E8D9]">
                  {group.items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                        item.isPacked ? "bg-[#7D9B76]/5" : ""
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => togglePacked(item)}
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all ${
                          item.isPacked
                            ? "border-[#7D9B76] bg-[#7D9B76] text-white"
                            : "border-[#D4C9B0] hover:border-[#7D9B76]"
                        }`}
                      >
                        {item.isPacked && <Check size={11} />}
                      </button>
                      <span
                        className={`flex-1 text-sm transition-all ${
                          item.isPacked ? "text-[#A0AEBF] line-through" : "text-[#0D1B2A]"
                        }`}
                      >
                        {item.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteItem(item.id)}
                        disabled={deletingId === item.id}
                        className="shrink-0 text-[#D4C9B0] hover:text-[#E11D48] disabled:opacity-40 transition-colors"
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
