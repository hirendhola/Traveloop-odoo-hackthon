"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const CATEGORIES: { value: Category; label: string; color: string }[] = [
  { value: "transport", label: "Transport", color: "#85C1E2" },
  { value: "stay",      label: "Stay",      color: "#C4A882" },
  { value: "activity",  label: "Activity",  color: "#7D9B76" },
  { value: "meals",     label: "Meals",     color: "#E8C547" },
  { value: "other",     label: "Other",     color: "rgba(240,237,230,0.4)" },
];

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
        <div className="flex items-start gap-3 rounded-xl border border-[#E05252]/20 bg-[#E05252]/10 px-4 py-3">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[#E05252]" />
          <div>
            <p className="text-sm font-medium text-[#E05252]">Over budget!</p>
            <p className="text-xs text-[rgba(240,237,230,0.45)]">
              You've exceeded your budget by ${Math.abs(remaining!).toLocaleString()}.
            </p>
          </div>
        </div>
      )}

      {/* Large total cost */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-[rgba(240,237,230,0.35)]">Total Spent</p>
        <p className="font-(family-name:--font-dm-mono) text-[3rem] font-medium text-[#E8C547]">
          ${totalSpent.toLocaleString()}
        </p>
      </div>

      {/* Budget bar */}
      {initialBudget && (
        <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-5 py-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-[rgba(240,237,230,0.55)]">Budget used</span>
            <span className={`font-medium ${overBudget ? "text-[#E05252]" : "text-[#E8C547]"}`}>
              {pct.toFixed(1)}%
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${overBudget ? "bg-[#E05252]" : "bg-[#E8C547]"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4">
          <p className="text-[10px] uppercase tracking-wider text-[rgba(240,237,230,0.35)]">Total Budget</p>
          <p className="mt-1 font-(family-name:--font-dm-mono) text-xl text-[#F0EDE6]">
            {initialBudget ? `$${initialBudget.toLocaleString()}` : "—"}
          </p>
        </div>
        <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4">
          <p className="text-[10px] uppercase tracking-wider text-[rgba(240,237,230,0.35)]">Spent</p>
          <p className={`mt-1 font-(family-name:--font-dm-mono) text-xl ${overBudget ? "text-[#E05252]" : "text-[#F0EDE6]"}`}>
            ${totalSpent.toLocaleString()}
          </p>
        </div>
        {remaining !== null && (
          <div className={`rounded-xl border p-4 ${overBudget ? "border-[#E05252]/20 bg-[#E05252]/5" : "border-[#7D9B76]/20 bg-[#7D9B76]/5"}`}>
            <p className="text-[10px] uppercase tracking-wider text-[rgba(240,237,230,0.35)]">{overBudget ? "Over Budget" : "Remaining"}</p>
            <p className={`mt-1 font-(family-name:--font-dm-mono) text-xl flex items-center gap-1 ${overBudget ? "text-[#E05252]" : "text-[#7D9B76]"}`}>
              {overBudget ? <TrendingDown size={18} /> : <TrendingUp size={18} />}
              ${Math.abs(remaining).toLocaleString()}
            </p>
          </div>
        )}
        <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4">
          <p className="text-[10px] uppercase tracking-wider text-[rgba(240,237,230,0.35)]">Avg / Day</p>
          <p className="mt-1 font-(family-name:--font-dm-mono) text-xl text-[#F0EDE6]">${avgPerDay.toFixed(0)}</p>
          {budgetPerDay && (
            <p className={`text-xs mt-0.5 ${avgPerDay > budgetPerDay ? "text-[#E05252]" : "text-[#7D9B76]"}`}>
              Budget: ${budgetPerDay.toFixed(0)}/day
            </p>
          )}
        </div>
      </div>

      {/* Category breakdown */}
      {byCategory.length > 0 && (
        <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-5">
          <h3 className="mb-4 text-sm font-medium text-[#F0EDE6]">Spending by Category</h3>
          <div className="space-y-3">
            {byCategory.map((cat) => (
              <div key={cat.value} className="flex items-center gap-3">
                <div className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: cat.color }} />
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs font-medium text-[#F0EDE6]">{cat.label}</span>
                    <span className="text-xs text-[rgba(240,237,230,0.4)]">${cat.total.toLocaleString()}</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
                    <div
                      className="h-1 rounded-full"
                      style={{ width: `${totalSpent > 0 ? (cat.total / totalSpent) * 100 : 0}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add expense */}
      <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-[#F0EDE6]">Expenses</h3>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="h-8 rounded-full bg-[#E8C547] px-3 text-xs font-semibold text-[#080C10] hover:bg-[#d4b33f]"
          >
            <Plus size={13} className="mr-1" />
            Add Expense
          </Button>
        </div>

        {showForm && (
          <div className="mb-4 space-y-3 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-[rgba(240,237,230,0.45)]">Label</Label>
                <Input
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. Hotel booking"
                  className="h-9 border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[#F0EDE6] placeholder:text-[rgba(240,237,230,0.25)] focus:border-[#E8C547]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-[rgba(240,237,230,0.45)]">Amount</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="0.00"
                  className="h-9 border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[#F0EDE6] placeholder:text-[rgba(240,237,230,0.25)] focus:border-[#E8C547]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-[rgba(240,237,230,0.45)]">Category</Label>
                <Select value={newCategory} onValueChange={(v) => setNewCategory(v as Category)}>
                  <SelectTrigger className="h-9 w-full rounded-md border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-sm text-[#F0EDE6] focus:ring-[#E8C547]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-[rgba(255,255,255,0.12)] bg-[#1B2333]">
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value} className="text-[#F0EDE6] focus:bg-[rgba(255,255,255,0.08)] focus:text-[#F0EDE6]">
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={addExpense}
                disabled={adding || !newLabel.trim() || !newAmount}
                className="h-8 rounded-full bg-[#E8C547] px-4 text-xs font-semibold text-[#080C10] hover:bg-[#d4b33f] disabled:opacity-60"
              >
                {adding ? "Adding…" : "Add"}
              </Button>
              <Button
                variant="outline"
                onClick={() => { setShowForm(false); setNewLabel(""); setNewAmount(""); }}
                className="h-8 border-[rgba(255,255,255,0.08)] bg-transparent text-xs text-[rgba(240,237,230,0.55)] hover:bg-[rgba(255,255,255,0.06)]"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {expenses.map((expense) => {
            const cat = CATEGORIES.find((c) => c.value === expense.category);
            return (
              <div
                key={expense.id}
                className="flex items-center gap-3 rounded-lg border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.02)] px-4 py-3"
              >
                <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: cat?.color ?? "rgba(240,237,230,0.3)" }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#F0EDE6] truncate">{expense.label}</p>
                  <p className="text-[10px] text-[rgba(240,237,230,0.35)] capitalize">{expense.category}</p>
                </div>
                <span className="shrink-0 font-(family-name:--font-dm-mono) text-sm text-[#E8C547]">
                  ${expense.amount.toLocaleString()}
                </span>
                <button
                  onClick={() => deleteExpense(expense.id)}
                  disabled={deletingId === expense.id}
                  className="shrink-0 text-[rgba(240,237,230,0.25)] transition-colors hover:text-[#E05252] disabled:opacity-50"
                  title="Delete expense"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
          {expenses.length === 0 && (
            <p className="py-6 text-center text-sm text-[rgba(240,237,230,0.35)]">No expenses yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
