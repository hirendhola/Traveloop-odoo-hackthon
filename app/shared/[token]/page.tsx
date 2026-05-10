import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/prisma";
import { MapPin, Clock, Calendar, DollarSign, Compass } from "lucide-react";

const ACTIVITY_ICONS: Record<string, string> = {
  sightseeing: "🏛", food: "🍜", adventure: "🏔", culture: "🎭", shopping: "🛍", other: "✨",
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
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function fmtShort(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function SharedTripPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const trip = await db.trip.findUnique({
    where: { shareToken: token },
    include: {
      stops: {
        orderBy: { orderIndex: "asc" },
        include: {
          city: true,
          activities: { include: { activity: true } },
        },
      },
      expenses: { select: { amount: true } },
      _count: { select: { stops: true } },
    },
  });

  if (!trip || !trip.isPublic) notFound();

  const totalDays = daysBetween(trip.startDate, trip.endDate);
  const totalSpent = trip.expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const budget = trip.totalBudget ? Number(trip.totalBudget) : null;
  const totalEstimated = trip.stops.reduce(
    (sum, stop) =>
      sum + stop.activities.reduce((s, sa) => s + Number(sa.activity.estimatedCost), 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#F5ECD7]">
      {/* Branding header */}
      <header className="border-b border-[#D4C9B0] bg-[#0D1B2A] px-6 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Compass size={20} className="text-[#FF5733]" />
            <span className="font-(family-name:--font-heading) text-lg text-[#F5ECD7]">Traveloop</span>
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-[#FF5733] px-4 py-1.5 text-sm font-medium text-[#0D1B2A] transition-colors hover:bg-[#FF8A6C]"
          >
            Plan your own trip →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        {/* Trip hero */}
        <div className="relative overflow-hidden rounded-2xl bg-[#0D1B2A]">
          {trip.coverPhotoUrl && (
            <img
              src={trip.coverPhotoUrl}
              alt={trip.name}
              className="absolute inset-0 h-full w-full object-cover opacity-30"
            />
          )}
          <div className="relative px-6 py-8">
            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-[#FF5733]">
              Shared Itinerary
            </p>
            <h1 className="font-(family-name:--font-heading) text-3xl font-bold text-[#F5ECD7] sm:text-4xl">
              {trip.name}
            </h1>
            <p className="mt-2 text-sm text-[#A0AEBF]">
              {fmt(trip.startDate)} – {fmt(trip.endDate)}
            </p>

            {/* Stats row */}
            <div className="mt-5 flex flex-wrap gap-3">
              {[
                { icon: MapPin, label: `${trip._count.stops} cities` },
                { icon: Calendar, label: `${totalDays} days` },
                ...(budget ? [{ icon: DollarSign, label: `$${budget.toLocaleString()} budget` }] : []),
                ...(totalEstimated > 0 ? [{ icon: DollarSign, label: `$${totalEstimated.toLocaleString()} est.` }] : []),
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-sm text-[#F5ECD7] backdrop-blur-sm"
                  >
                    <Icon size={13} />
                    {stat.label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Timeline */}
        {trip.stops.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-[#D4C9B0] py-14 text-center">
            <MapPin size={32} className="mb-2 text-[#D4C9B0]" />
            <p className="text-sm text-[#A0AEBF]">No stops in this itinerary</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-2.75 top-6 bottom-6 w-0.5 bg-[#D4C9B0]" />
            <div className="space-y-2">
              {trip.stops.map((stop) => {
                const nights = daysBetween(stop.startDate, stop.endDate);
                return (
                  <div key={stop.id} className="relative flex gap-4">
                    <div className="relative z-10 mt-5 flex h-6 w-6 shrink-0 items-center justify-center">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#FF5733] bg-[#F5ECD7]">
                        <div className="h-2.5 w-2.5 rounded-full bg-[#FF5733]" />
                      </div>
                    </div>

                    <div className="mb-8 flex-1 overflow-hidden rounded-2xl border border-[#D4C9B0] bg-white/80">
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
                            {fmtShort(stop.startDate)} – {fmtShort(stop.endDate)}
                          </p>
                          <p className="mt-0.5 text-xs text-[#A0AEBF]">
                            {nights} {nights === 1 ? "night" : "nights"}
                          </p>
                        </div>
                      </div>

                      {stop.activities.length === 0 ? (
                        <p className="px-5 py-4 text-sm text-[#A0AEBF]">No activities planned</p>
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
                                </div>
                                <div className="flex shrink-0 items-center gap-2">
                                  <span className={`rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${colorCls}`}>
                                    {sa.activity.type}
                                  </span>
                                  <span className="flex items-center gap-1 text-xs text-[#A0AEBF]">
                                    <Clock size={11} />
                                    {sa.activity.durationMinutes}m
                                  </span>
                                  <span className="text-xs font-medium text-[#7D9B76]">
                                    ${Number(sa.activity.estimatedCost).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                          <div className="flex items-center justify-between bg-[#F8F4EC] px-5 py-2">
                            <span className="text-xs text-[#A0AEBF]">
                              {stop.activities.length} {stop.activities.length === 1 ? "activity" : "activities"}
                            </span>
                            <span className="text-xs font-semibold text-[#0D1B2A]">
                              Est. ${stop.activities.reduce((s, sa) => s + Number(sa.activity.estimatedCost), 0).toLocaleString()}
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

        {/* CTA */}
        <div className="rounded-2xl border border-[#D4C9B0] bg-white/80 px-6 py-6 text-center">
          <p className="font-(family-name:--font-heading) text-xl font-bold text-[#0D1B2A]">
            Inspired by this trip?
          </p>
          <p className="mt-1 text-sm text-[#5A6B7A]">
            Create your own free account and start planning your next adventure.
          </p>
          <Link
            href="/signup"
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#FF5733] px-6 py-2.5 text-sm font-medium text-[#0D1B2A] transition-colors hover:bg-[#FF8A6C]"
          >
            Start planning for free →
          </Link>
        </div>
      </main>
    </div>
  );
}
