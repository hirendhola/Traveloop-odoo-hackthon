"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronUp, ChevronDown, Trash2, Plus, X, Search,
  MapPin, Clock, DollarSign, Save, AlertTriangle,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type CityResult = {
  id: string; name: string; country: string; region: string; coverImageUrl: string | null;
};

type ActivityResult = {
  id: string; name: string; type: string; description: string | null;
  estimatedCost: number; durationMinutes: number;
};

type StopActivity = {
  id: string; activityId: string; scheduledTime: string | null; notes: string | null;
  activity: ActivityResult;
};

type Stop = {
  id: string; cityId: string; orderIndex: number;
  startDate: string; endDate: string;
  city: CityResult & { costIndex: number; popularityScore: number };
  activities: StopActivity[];
};

type TripData = {
  id: string; name: string; description: string | null;
  startDate: string; endDate: string; totalBudget: number | null;
  coverPhotoUrl: string | null; stops: Stop[];
};

// ─── Activity type colours ────────────────────────────────────────────────────

const TYPE_EMOJI: Record<string, string> = {
  sightseeing: "🏛", food: "🍜", adventure: "🏔", culture: "🎭", shopping: "🛍", other: "✨",
};

// ─── City search combobox ─────────────────────────────────────────────────────

function CitySearch({ onSelect }: { onSelect: (city: CityResult) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CityResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (query.length < 2) { setResults([]); setOpen(false); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/cities?search=${encodeURIComponent(query)}&limit=8`);
        if (res.ok) { setResults(await res.json()); setOpen(true); }
      } finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div className="relative">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(240,237,230,0.4)]" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search cities…"
          className="border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] pl-8"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#E8C547] border-t-transparent" />
        )}
      </div>
      {open && results.length > 0 && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#1B2333] shadow-lg">
          {results.map((city) => (
            <button
              key={city.id}
              type="button"
              onClick={() => { onSelect(city); setQuery(""); setResults([]); setOpen(false); }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-[rgba(255,255,255,0.08)]"
            >
              <MapPin size={14} className="shrink-0 text-[#E8C547]" />
              <div>
                <p className="text-sm font-medium text-[#F0EDE6]">{city.name}</p>
                <p className="text-xs text-[rgba(240,237,230,0.45)]">{city.country} · {city.region}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Activity search for a stop ───────────────────────────────────────────────

function ActivityPicker({
  cityId, existingIds, onAdd,
}: { cityId: string; existingIds: string[]; onAdd: (a: ActivityResult) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ActivityResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const url = `/api/activities?cityId=${cityId}${query ? `&search=${encodeURIComponent(query)}` : ""}`;
        const res = await fetch(url);
        if (res.ok) setResults(await res.json());
      } finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(t);
  }, [cityId, query]);

  const available = results.filter((a) => !existingIds.includes(a.id));

  return (
    <div className="mt-2 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-3">
      <div className="relative mb-2">
        <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[rgba(240,237,230,0.4)]" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search activities…"
          className="border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] pl-7 py-1.5 text-xs h-8"
        />
      </div>
      <div className="max-h-52 overflow-y-auto space-y-1">
        {loading && <p className="py-2 text-center text-xs text-[rgba(240,237,230,0.4)]">Loading…</p>}
        {!loading && available.length === 0 && (
          <p className="py-2 text-center text-xs text-[rgba(240,237,230,0.4)]">No activities found</p>
        )}
        {available.map((activity) => (
          <button
            key={activity.id}
            type="button"
            onClick={() => onAdd(activity)}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left hover:bg-[rgba(255,255,255,0.04)] transition-colors"
          >
            <span className="text-base">{TYPE_EMOJI[activity.type] ?? "✨"}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#F0EDE6] truncate">{activity.name}</p>
              <p className="text-xs text-[rgba(240,237,230,0.4)]">
                {activity.durationMinutes}m · ${activity.estimatedCost}
              </p>
            </div>
            <Plus size={14} className="shrink-0 text-[#E8C547]" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Editor ──────────────────────────────────────────────────────────────

export function TripEditor({ initialTrip }: { initialTrip: TripData }) {
  const router = useRouter();
  const [trip, setTrip] = useState(initialTrip);
  const [savingDetails, setSavingDetails] = useState(false);
  const [detailsMsg, setDetailsMsg] = useState("");

  // Add-stop form state
  const [addingStop, setAddingStop] = useState(false);
  const [newStopCity, setNewStopCity] = useState<CityResult | null>(null);
  const [newStopStart, setNewStopStart] = useState("");
  const [newStopEnd, setNewStopEnd] = useState("");
  const [addingStopLoading, setAddingStopLoading] = useState(false);

  // Activity picker visibility per stop
  const [pickingActivityFor, setPickingActivityFor] = useState<string | null>(null);

  // ── Save trip details ──────────────────────────────────────────────────────
  async function saveDetails() {
    setSavingDetails(true);
    setDetailsMsg("");
    try {
      const res = await fetch(`/api/trips/${trip.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trip.name,
          description: trip.description,
          startDate: new Date(trip.startDate).toISOString(),
          endDate: new Date(trip.endDate).toISOString(),
          totalBudget: trip.totalBudget || null,
        }),
      });
      if (res.ok) setDetailsMsg("Saved!");
      else setDetailsMsg("Failed to save");
    } finally {
      setSavingDetails(false);
      setTimeout(() => setDetailsMsg(""), 2000);
    }
  }

  // ── Add stop ───────────────────────────────────────────────────────────────
  async function submitAddStop() {
    if (!newStopCity || !newStopStart || !newStopEnd) return;
    setAddingStopLoading(true);
    try {
      const res = await fetch(`/api/trips/${trip.id}/stops`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cityId: newStopCity.id,
          startDate: new Date(newStopStart).toISOString(),
          endDate: new Date(newStopEnd).toISOString(),
        }),
      });
      if (res.ok) {
        const newStop = await res.json();
        setTrip((prev) => ({
          ...prev,
          stops: [
            ...prev.stops,
            {
              ...newStop,
              startDate: newStop.startDate,
              endDate: newStop.endDate,
              city: {
                ...newStop.city,
                costIndex: Number(newStop.city.costIndex),
                popularityScore: Number(newStop.city.popularityScore),
              },
              activities: [],
            },
          ],
        }));
        setAddingStop(false);
        setNewStopCity(null);
        setNewStopStart("");
        setNewStopEnd("");
      }
    } finally {
      setAddingStopLoading(false);
    }
  }

  // ── Delete stop ────────────────────────────────────────────────────────────
  async function deleteStop(stopId: string) {
    const res = await fetch(`/api/stops/${stopId}`, { method: "DELETE" });
    if (res.ok) {
      setTrip((prev) => ({ ...prev, stops: prev.stops.filter((s) => s.id !== stopId) }));
    }
  }

  // ── Reorder stop ───────────────────────────────────────────────────────────
  async function moveStop(stopId: string, direction: "up" | "down") {
    const idx = trip.stops.findIndex((s) => s.id === stopId);
    if (idx === -1) return;
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === trip.stops.length - 1) return;

    const newStops = [...trip.stops];
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    [newStops[idx], newStops[swapIdx]] = [newStops[swapIdx], newStops[idx]];

    setTrip((prev) => ({ ...prev, stops: newStops }));

    await fetch(`/api/trips/${trip.id}/stops/reorder`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: newStops.map((s) => s.id) }),
    });
  }

  // ── Add activity to stop ───────────────────────────────────────────────────
  async function addActivity(stopId: string, activity: ActivityResult) {
    const res = await fetch(`/api/stops/${stopId}/activities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activityId: activity.id }),
    });
    if (res.ok) {
      const sa: StopActivity = await res.json();
      setTrip((prev) => ({
        ...prev,
        stops: prev.stops.map((s) =>
          s.id === stopId
            ? {
                ...s,
                activities: [
                  ...s.activities,
                  { ...sa, activity: { ...activity, estimatedCost: Number(activity.estimatedCost) } },
                ],
              }
            : s
        ),
      }));
    }
    setPickingActivityFor(null);
  }

  // ── Remove activity ────────────────────────────────────────────────────────
  async function removeActivity(stopId: string, activityId: string) {
    const res = await fetch(`/api/stops/${stopId}/activities`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activityId }),
    });
    if (res.ok) {
      setTrip((prev) => ({
        ...prev,
        stops: prev.stops.map((s) =>
          s.id === stopId
            ? { ...s, activities: s.activities.filter((sa) => sa.activityId !== activityId) }
            : s
        ),
      }));
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Trip Details Section */}
      <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-5">
        <h2 className="mb-4 font-heading text-lg font-semibold text-[#F0EDE6]">
          Trip Details
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs text-[rgba(240,237,230,0.45)]">Trip Name</Label>
            <Input
              value={trip.name}
              onChange={(e) => setTrip((p) => ({ ...p, name: e.target.value }))}
              className="border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)]"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs text-[rgba(240,237,230,0.45)]">Description</Label>
            <Textarea
              value={trip.description ?? ""}
              onChange={(e) => setTrip((p) => ({ ...p, description: e.target.value }))}
              rows={2}
              className="resize-none border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)]"
              placeholder="What's this trip about?"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-[rgba(240,237,230,0.45)]">Start Date</Label>
            <Input
              type="date"
              value={trip.startDate.slice(0, 10)}
              onChange={(e) => setTrip((p) => ({ ...p, startDate: e.target.value }))}
              className="border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)]"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-[rgba(240,237,230,0.45)]">End Date</Label>
            <Input
              type="date"
              value={trip.endDate.slice(0, 10)}
              onChange={(e) => setTrip((p) => ({ ...p, endDate: e.target.value }))}
              className="border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)]"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-[rgba(240,237,230,0.45)]">Total Budget ($)</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={trip.totalBudget ?? ""}
              onChange={(e) => setTrip((p) => ({ ...p, totalBudget: e.target.value ? parseFloat(e.target.value) : null }))}
              placeholder="e.g. 3000"
              className="border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)]"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Button
            type="button"
            onClick={saveDetails}
            disabled={savingDetails}
            className="rounded-full bg-[#E8C547] px-5 text-[#F0EDE6] hover:bg-[#d4b33f]"
          >
            <Save size={14} className="mr-1.5" />
            {savingDetails ? "Saving…" : "Save Changes"}
          </Button>
          {detailsMsg && (
            <span className={`text-sm ${detailsMsg === "Saved!" ? "text-[#7D9B76]" : "text-[#E05252]"}`}>
              {detailsMsg}
            </span>
          )}
        </div>
      </div>

      {/* Stops Section */}
      <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-[#F0EDE6]">
            Itinerary Stops
          </h2>
          <span className="text-xs text-[rgba(240,237,230,0.4)]">{trip.stops.length} {trip.stops.length === 1 ? "stop" : "stops"}</span>
        </div>

        {/* Stops list */}
        <div className="space-y-4">
          {trip.stops.map((stop, idx) => (
            <div
              key={stop.id}
              className="overflow-hidden rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)]"
            >
              {/* Stop header */}
              <div className="flex items-center justify-between gap-3 bg-[#0F1419] px-4 py-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E8C547]/20 text-xs font-bold text-[#E8C547]">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#F0EDE6]">{stop.city.name}</p>
                    <p className="text-xs text-[rgba(240,237,230,0.4)]">
                      {new Date(stop.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} –{" "}
                      {new Date(stop.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveStop(stop.id, "up")}
                    disabled={idx === 0}
                    className="rounded p-1 text-[rgba(240,237,230,0.4)] hover:bg-[rgba(255,255,255,0.04)]/10 hover:text-[#F0EDE6] disabled:opacity-30"
                  >
                    <ChevronUp size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveStop(stop.id, "down")}
                    disabled={idx === trip.stops.length - 1}
                    className="rounded p-1 text-[rgba(240,237,230,0.4)] hover:bg-[rgba(255,255,255,0.04)]/10 hover:text-[#F0EDE6] disabled:opacity-30"
                  >
                    <ChevronDown size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteStop(stop.id)}
                    className="rounded p-1 text-[rgba(240,237,230,0.4)] hover:bg-[#E05252]/20 hover:text-[#E05252]"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Activities */}
              <div className="p-3 space-y-2">
                {stop.activities.length === 0 && (
                  <p className="text-center text-xs text-[rgba(240,237,230,0.4)] py-2">No activities yet</p>
                )}
                {stop.activities.map((sa) => (
                  <div key={sa.id} className="flex items-center gap-2 rounded-lg bg-[rgba(255,255,255,0.04)] px-3 py-2">
                    <span className="text-sm">{TYPE_EMOJI[sa.activity.type] ?? "✨"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-xs font-medium text-[#F0EDE6]">{sa.activity.name}</p>
                      <p className="text-xs text-[rgba(240,237,230,0.4)]">
                        {sa.activity.durationMinutes}m · ${sa.activity.estimatedCost}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeActivity(stop.id, sa.activityId)}
                      className="shrink-0 rounded p-0.5 text-[rgba(240,237,230,0.4)] hover:text-[#E05252]"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}

                {/* Toggle activity picker */}
                {pickingActivityFor === stop.id ? (
                  <div>
                    <ActivityPicker
                      cityId={stop.cityId}
                      existingIds={stop.activities.map((sa) => sa.activityId)}
                      onAdd={(a) => addActivity(stop.id, a)}
                    />
                    <button
                      type="button"
                      onClick={() => setPickingActivityFor(null)}
                      className="mt-2 text-xs text-[rgba(240,237,230,0.4)] hover:text-[rgba(240,237,230,0.45)]"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPickingActivityFor(stop.id)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-[rgba(255,255,255,0.08)] py-2 text-xs text-[rgba(240,237,230,0.45)] hover:border-[#E8C547] hover:text-[#E8C547] transition-colors"
                  >
                    <Plus size={13} />
                    Add Activity
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Stop */}
        {addingStop ? (
          <div className="mt-4 rounded-xl border-2 border-[#E8C547]/30 bg-[rgba(255,255,255,0.04)] p-4 space-y-3">
            <p className="text-sm font-medium text-[#F0EDE6]">New Stop</p>
            <CitySearch onSelect={(city) => setNewStopCity(city)} />
            {newStopCity && (
              <div className="flex items-center gap-2 rounded-lg bg-[#E8C547]/10 px-3 py-2">
                <MapPin size={13} className="text-[#E8C547]" />
                <span className="text-sm font-medium text-[#F0EDE6]">{newStopCity.name}, {newStopCity.country}</span>
                <button type="button" onClick={() => setNewStopCity(null)} className="ml-auto text-[rgba(240,237,230,0.4)] hover:text-[#E05252]">
                  <X size={13} />
                </button>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-[rgba(240,237,230,0.45)]">From</Label>
                <Input
                  type="date"
                  value={newStopStart}
                  onChange={(e) => setNewStopStart(e.target.value)}
                  className="border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-[rgba(240,237,230,0.45)]">To</Label>
                <Input
                  type="date"
                  value={newStopEnd}
                  min={newStopStart}
                  onChange={(e) => setNewStopEnd(e.target.value)}
                  className="border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={submitAddStop}
                disabled={!newStopCity || !newStopStart || !newStopEnd || addingStopLoading}
                className="rounded-full bg-[#E8C547] px-4 text-sm text-[#F0EDE6] hover:bg-[#d4b33f] disabled:opacity-50"
              >
                {addingStopLoading ? "Adding…" : "Add Stop"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => { setAddingStop(false); setNewStopCity(null); setNewStopStart(""); setNewStopEnd(""); }}
                className="rounded-full border-[rgba(255,255,255,0.08)] px-4 text-sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAddingStop(true)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[rgba(255,255,255,0.08)] py-3 text-sm text-[rgba(240,237,230,0.45)] transition-colors hover:border-[#E8C547] hover:text-[#E8C547]"
          >
            <Plus size={16} />
            Add Stop
          </button>
        )}
      </div>

      {/* View Itinerary link */}
      <div className="flex justify-end pb-4">
        <Link href={`/trips/${trip.id}`}>
          <Button variant="outline" className="rounded-full border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.06)]">
            View Itinerary →
          </Button>
        </Link>
      </div>
    </div>
  );
}
