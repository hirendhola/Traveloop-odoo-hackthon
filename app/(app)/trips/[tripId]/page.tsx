import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { MapPin, Clock, DollarSign, Calendar, Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/share-button";

const ACTIVITY_ICONS: Record<string, string> = {
  sightseeing: "🏛",
  food: "🍜",
  adventure: "🏔",
  culture: "🎭",
  shopping: "🛍",
  other: "✨",
};

const ACTIVITY_COLORS: Record<string, string> = {
  sightseeing: "bg-blue-50 text-blue-700 border-blue-100",
  food: "bg-orange-50 text-orange-700 border-orange-100",
  adventure: "bg-green-50 text-green-700 border-green-100",
  culture: "bg-purple-50 text-purple-700 border-purple-100",
  shopping: "bg-pink-50 text-pink-700 border-pink-100",
  other: "bg-gray-50 text-gray-600 border-gray-100",
};

function daysBetween(a: Date, b: Date) {
  return Math.ceil((b.getTime() - a.getTime()) / 86_400_000);
}

function fmt(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function TripViewPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const { tripId } = await params;

  const trip = await db.trip.findUnique({
    where: { id: tripId },
    include: {
      stops: {
        orderBy: { orderIndex: "asc" },
        include: {
          city: true,
          activities: {
            include: { activity: true },
          },
        },
      },
      expenses: { select: { amount: true } },
      _count: { select: { stops: true } },
    },
  });

  if (!trip || trip.userId !== session.user.id) redirect("/trips");

  const totalDays = daysBetween(trip.startDate, trip.endDate);
  const totalSpent = trip.expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const budget = trip.totalBudget ? Number(trip.totalBudget) : null;
  const budgetPct = budget ? Math.min((totalSpent / budget) * 100, 100) : 0;

  const totalEstimated = trip.stops.reduce(
    (sum, stop) =>
      sum + stop.activities.reduce((s, sa) => s + Number(sa.activity.estimatedCost), 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Stats strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Cities", value: trip._count.stops, icon: MapPin, color: "text-[#FF5733]" },
          { label: "Days", value: totalDays, icon: Calendar, color: "text-[#7D9B76]" },
          {
            label: "Budget",
            value: budget ? `$${budget.toLocaleString()}` : "—",
            icon: DollarSign,
            color: "text-[#5A6B7A]",
          },
          {
            label: "Est. Cost",
            value: `$${totalEstimated.toLocaleString()}`,
            icon: DollarSign,
            color: totalEstimated > (budget ?? Infinity) ? "text-[#E11D48]" : "text-[#7D9B76]",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex items-center gap-3 rounded-xl border border-[#D4C9B0] bg-white/60 px-4 py-3"
            >
              <Icon size={18} className={stat.color} />
              <div>
                <p className="text-xs text-[#A0AEBF]">{stat.label}</p>
                <p className="font-semibold text-[#0D1B2A]">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Budget progress */}
      {budget && (
        <div className="rounded-xl border border-[#D4C9B0] bg-white/60 px-4 py-3">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-[#5A6B7A]">Budget used</span>
            <span className={totalSpent > budget ? "font-medium text-[#E11D48]" : "font-medium text-[#7D9B76]"}>
              ${totalSpent.toLocaleString()} / ${budget.toLocaleString()}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#EDE4CF]">
            <div
              className={`h-2 rounded-full transition-all ${totalSpent > budget ? "bg-[#E11D48]" : "bg-[#7D9B76]"}`}
              style={{ width: `${budgetPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Timeline */}
      {trip.stops.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-[#D4C9B0] bg-[#F5ECD7] py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#EDE4CF]">
            <MapPin size={28} className="text-[#FF5733]" />
          </div>
          <p className="font-medium text-[#0D1B2A]">No stops yet</p>
          <p className="mt-1 text-sm text-[#5A6B7A]">Start building your itinerary</p>
          <Link href={`/trips/${tripId}/edit`} className="mt-4">
            <Button className="rounded-full bg-[#FF5733] text-[#0D1B2A] hover:bg-[#FF8A6C]">
              <Plus size={16} className="mr-1.5" />
              Add First Stop
            </Button>
          </Link>
        </div>
      ) : (
        <div className="relative">
          {/* The railroad spine */}
          <div className="absolute left-2.75 top-6 bottom-6 w-0.5 bg-[#D4C9B0]" />

          <div className="space-y-2">
            {trip.stops.map((stop, idx) => {
              const nights = daysBetween(stop.startDate, stop.endDate);
              return (
                <div key={stop.id} className="relative flex gap-4">
                  {/* Station dot */}
                  <div className="relative z-10 mt-5 flex h-6 w-6 shrink-0 items-center justify-center">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#FF5733] bg-[#F5ECD7]">
                      <div className="h-2.5 w-2.5 rounded-full bg-[#FF5733]" />
                    </div>
                  </div>

                  {/* Stop card */}
                  <div className="mb-8 flex-1 overflow-hidden rounded-2xl border border-[#D4C9B0] bg-white/80">
                    {/* Stop header */}
                    <div className="flex items-start justify-between bg-[#0D1B2A] px-5 py-4">
                      <div>
                        <h3 className="font-(family-name:--font-heading) text-lg font-bold text-[#F5ECD7]">
                          {stop.city.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-[#A0AEBF]">
                          {stop.city.country} · {stop.city.region}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[#F5ECD7]">
                          {fmt(stop.startDate)} – {fmt(stop.endDate)}
                        </p>
                        <p className="mt-0.5 text-xs text-[#A0AEBF]">
                          {nights} {nights === 1 ? "night" : "nights"}
                        </p>
                      </div>
                    </div>

                    {/* Activities */}
                    {stop.activities.length === 0 ? (
                      <div className="flex items-center gap-2 px-5 py-4 text-sm text-[#A0AEBF]">
                        <span>No activities planned</span>
                        <Link
                          href={`/trips/${tripId}/edit`}
                          className="ml-auto text-xs text-[#FF5733] hover:underline"
                        >
                          Add activities
                        </Link>
                      </div>
                    ) : (
                      <div className="divide-y divide-[#F0E8D9]">
                        {stop.activities.map((sa) => {
                          const colorCls = ACTIVITY_COLORS[sa.activity.type] ?? ACTIVITY_COLORS.other;
                          const emoji = ACTIVITY_ICONS[sa.activity.type] ?? "✨";
                          return (
                            <div key={sa.id} className="flex items-center gap-3 px-5 py-3">
                              <span className="text-lg">{emoji}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#0D1B2A] truncate">
                                  {sa.activity.name}
                                </p>
                                {sa.activity.description && (
                                  <p className="text-xs text-[#5A6B7A] truncate">
                                    {sa.activity.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex shrink-0 items-center gap-2">
                                <span
                                  className={`rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${colorCls}`}
                                >
                                  {sa.activity.type}
                                </span>
                                <div className="flex items-center gap-1 text-xs text-[#A0AEBF]">
                                  <Clock size={11} />
                                  {sa.activity.durationMinutes}m
                                </div>
                                <div className="flex items-center gap-0.5 text-xs font-medium text-[#7D9B76]">
                                  <span>$</span>
                                  {Number(sa.activity.estimatedCost).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {/* Stop total */}
                        <div className="flex items-center justify-between bg-[#F8F4EC] px-5 py-2">
                          <span className="text-xs text-[#A0AEBF]">
                            {stop.activities.length} {stop.activities.length === 1 ? "activity" : "activities"}
                          </span>
                          <span className="text-xs font-semibold text-[#0D1B2A]">
                            Est. $
                            {stop.activities
                              .reduce((s, sa) => s + Number(sa.activity.estimatedCost), 0)
                              .toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom actions */}
      <div className="flex flex-wrap items-center justify-center gap-3 pb-6">
        <Link href={`/trips/${tripId}/edit`}>
          <Button variant="outline" className="rounded-full border-[#D4C9B0] text-[#0D1B2A] hover:bg-[#EDE4CF]">
            <Pencil size={15} className="mr-2" />
            Edit Itinerary
          </Button>
        </Link>
        <ShareButton tripId={tripId} shareToken={trip.shareToken} />
      </div>
    </div>
  );
}
