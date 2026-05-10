"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign, AlertTriangle } from "lucide-react";

type Expense = {
  id: string;
  category: string;
  label: string;
  amount: number;
  stopId: string | null;
  createdAt: string;
};

type Category = "transport" | "stay" | "activity" | "meals" | "other";

const CATEGORIES: { value: Category; label: string; color: string; bg: string }[] = [
  { value: "transport", label: "Transport", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  { value: "stay",      label: "Stay",      color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
  { value: "activity",  label: "Activity",  color: "text-green-700", bg: "bg-green-50 border-green-200" },
  { value: "meals",     label: "Meals",     color: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
  { value: "other",     label: "Other",     color: "text-gray-600",  bg: "bg-gray-50 border-gray-200" },
];

const CAT_ICONS: Record<string, string> = {
  transport: "✈️", stay: "🏨", activity: "🎯", meals: "🍽", other: "📦",
};

export function BudgetClient({
  tripId, totalBudget: initialBudget, expenses: initialExpenses, totalDays,
}: {
  tripId: string;
  totalBudget: number | null;
  expenses: Expense[];
  totalDays: number;
}) {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [newLabel, setNewLabel] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newCategory, setNewCategory] = useState<Category>("other");
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = initialBudget ? initialBudget - totalSpent : null;
  const pct = initialBudget ? Math.min((totalSpent / initialBudget) * 100, 100) : 0;
  const overBudget = initialBudget ? totalSpent > initialBudget : false;
  const avgPerDay = totalDays > 0 ? totalSpent / totalDays : 0;
  const budgetPerDay = initialBudget && totalDays > 0 ? initialBudget / totalDays : null;

  const byCategory = CATEGORIES.map((cat) => {
    const catExpenses = expenses.filter((e) => e.category === cat.value);
    const total = catExpenses.reduce((s, e) => s + e.amount, 0);
    return { ...cat, total, count: catExpenses.length };
  }).filter((c) => c.total > 0);

  async function addExpense() {
    if (!newLabel.trim() || !newAmount) return;
    setAdding(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newLabel.trim(), amount: parseFloat(newAmount), category: newCategory }),
      });
      if (res.ok) {
        const expense = await res.json();
        setExpenses((prev) => [{ ...expense, amount: Number(expense.amount), createdAt: expense.createdAt }, ...prev]);
        setNewLabel(""); setNewAmount(""); setNewCategory("other"); setShowForm(false);
      }
    } finally { setAdding(false); }
  }

  async function deleteExpense(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/trips/${tripId}/expenses/${id}`, { method: "DELETE" });
      if (res.ok) setExpenses((prev) => prev.filter((e) => e.id !== id));
    } finally { setDeletingId(null); }
  }

  return (
    <div className="space-y-6">
      {/* Over-budget alert */}
      {overBudget && (
        <div className="flex items-start gap-3 rounded-xl border border-[#E11D48]/30 bg-[#E11D48]/10 px-4 py-3">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[#E11D48]" />
          <div>
            <p className="text-sm font-semibold text-[#E11D48]">Over budget!</p>
            <p className="text-xs text-[#5A6B7A]">
              You've exceeded your budget by ${Math.abs(remaining!).toLocaleString()}.
              Consider reviewing your expenses.
            </p>
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[#D4C9B0] bg-white/80 p-4">
          <p className="text-xs text-[#A0AEBF]">Total Budget</p>
          <p className="mt-1 text-xl font-bold text-[#0D1B2A]">
            {initialBudget ? `$${initialBudget.toLocaleString()}` : "—"}
          </p>
        </div>
        <div className="rounded-xl border border-[#D4C9B0] bg-white/80 p-4">
          <p className="text-xs text-[#A0AEBF]">Spent</p>
          <p className={`mt-1 text-xl font-bold ${overBudget ? "text-[#E11D48]" : "text-[#0D1B2A]"}`}>
            ${totalSpent.toLocaleString()}
          </p>
        </div>
        {remaining !== null && (
          <div className={`rounded-xl border p-4 sm:col-span-1 col-span-2 ${overBudget ? "border-[#E11D48]/30 bg-[#E11D48]/5" : "border-[#7D9B76]/30 bg-[#7D9B76]/5"}`}>
            <p className="text-xs text-[#A0AEBF]">{overBudget ? "Over Budget" : "Remaining"}</p>
            <p className={`mt-1 text-xl font-bold flex items-center gap-1 ${overBudget ? "text-[#E11D48]" : "text-[#7D9B76]"}`}>
              {overBudget ? <TrendingDown size={18} /> : <TrendingUp size={18} />}
              ${Math.abs(remaining).toLocaleString()}
            </p>
          </div>
        )}
        <div className="rounded-xl border border-[#D4C9B0] bg-white/80 p-4 col-span-2 sm:col-span-1">
          <p className="text-xs text-[#A0AEBF]">Avg / Day</p>
          <p className="mt-1 text-xl font-bold text-[#0D1B2A]">${avgPerDay.toFixed(0)}</p>
          {budgetPerDay && (
            <p className={`text-xs mt-0.5 ${avgPerDay > budgetPerDay ? "text-[#E11D48]" : "text-[#7D9B76]"}`}>
              Budget: ${budgetPerDay.toFixed(0)}/day
            </p>
          )}
        </div>
      </div>

      {/* Budget progress bar */}
      {initialBudget && (
        <div className="rounded-xl border border-[#D4C9B0] bg-white/80 px-5 py-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-[#5A6B7A]">Budget used</span>
            <span className={`font-semibold ${overBudget ? "text-[#E11D48]" : "text-[#0D1B2A]"}`}>
              {pct.toFixed(1)}%
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-[#EDE4CF]">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${overBudget ? "bg-[#E11D48]" : "bg-[#7D9B76]"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {/* Category breakdown */}
      {byCategory.length > 0 && (
        <div className="rounded-xl border border-[#D4C9B0] bg-white/80 p-5">
          <h3 className="mb-3 text-sm font-semibold text-[#0D1B2A]">Spending by Category</h3>
          <div className="space-y-3">
            {byCategory.map((cat) => (
              <div key={cat.value} className="flex items-center gap-3">
                <span className="text-lg w-6">{CAT_ICONS[cat.value]}</span>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs font-medium text-[#0D1B2A]">{cat.label}</span>
                    <span className="text-xs text-[#5A6B7A]">${cat.total.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#EDE4CF]">
                    <div
                      className="h-1.5 rounded-full bg-[#FF5733]"
                      style={{ width: `${totalSpent > 0 ? (cat.total / totalSpent) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add expense */}
      <div className="rounded-xl border border-[#D4C9B0] bg-white/80 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[#0D1B2A]">Expenses</h3>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="h-8 rounded-full bg-[#FF5733] px-3 text-xs text-[#0D1B2A] hover:bg-[#FF8A6C]"
          >
            <Plus size={13} className="mr-1" />
            Add Expense
          </Button>
        </div>

        {showForm && (
          <div className="mb-4 space-y-3 rounded-xl border-2 border-[#FF5733]/20 bg-[#F8F4EC] p-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1">
                <Label className="text-xs text-[#5A6B7A]">Label</Label>
                <Input
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. Train Tokyo → Kyoto"
                  className="border-[#D4C9B0] bg-white"
                  onKeyDown={(e) => e.key === "Enter" && addExpense()}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-[#5A6B7A]">Amount ($)</Label>
                <Input
                  type="number" min="0" step="0.01"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="0.00"
                  className="border-[#D4C9B0] bg-white"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-[#5A6B7A]">Category</Label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as Category)}
                  className="h-10 w-full rounded-lg border border-[#D4C9B0] bg-white px-3 text-sm text-[#0D1B2A] focus:outline-none focus:ring-1 focus:ring-[#FF5733]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={addExpense}
                disabled={adding || !newLabel.trim() || !newAmount}
                className="rounded-full bg-[#FF5733] px-4 text-sm text-[#0D1B2A] hover:bg-[#FF8A6C] disabled:opacity-50"
              >
                {adding ? "Adding…" : "Add"}
              </Button>
              <Button
                variant="outline"
                onClick={() => { setShowForm(false); setNewLabel(""); setNewAmount(""); }}
                className="rounded-full border-[#D4C9B0] px-4 text-sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {expenses.length === 0 ? (
          <p className="py-6 text-center text-sm text-[#A0AEBF]">No expenses recorded yet</p>
        ) : (
          <div className="divide-y divide-[#F0E8D9]">
            {expenses.map((e) => {
              const cat = CATEGORIES.find((c) => c.value === e.category);
              return (
                <div key={e.id} className="flex items-center gap-3 py-3">
                  <span className="text-lg">{CAT_ICONS[e.category] ?? "📦"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-[#0D1B2A]">{e.label}</p>
                    <span className={`inline-block rounded-full border px-2 py-0.5 text-xs ${cat?.bg ?? ""} ${cat?.color ?? ""}`}>
                      {cat?.label ?? e.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-semibold text-[#0D1B2A]">
                      ${e.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => deleteExpense(e.id)}
                      disabled={deletingId === e.id}
                      className="text-[#A0AEBF] hover:text-[#E11D48] disabled:opacity-40"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
