import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/prisma";
import { MapPin, Clock, Calendar, DollarSign, Compass, Plane, Landmark, Utensils, Mountain, Palette, ShoppingBag, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const ACTIVITY_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  sightseeing: Landmark,
  food: Utensils,
  adventure: Mountain,
  culture: Palette,
  shopping: ShoppingBag,
  other: Sparkles,
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const trip = await db.trip.findUnique({ where: { shareToken: token }, select: { name: true } });
  return {
    title: trip?.name ?? "Shared Trip",
    description: "Check out this trip on Traveloop",
  };
}

export async function generateStaticParams() {
  try {
    const trips = await db.trip.findMany({
      where: { isPublic: true, shareToken: { not: null } },
      select: { shareToken: true },
    });
    return trips.map((t) => ({ token: t.shareToken! }));
  } catch {
    return [];
  }
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
  const budget = trip.totalBudget ? Number(trip.totalBudget) : null;
  const totalEstimated = trip.stops.reduce(
    (sum, stop) =>
      sum + stop.activities.reduce((s, sa) => s + Number(sa.activity.estimatedCost), 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#080C10]">
      {/* Branding header */}
      <header className="border-b border-[rgba(255,255,255,0.06)] bg-[#0D1218] px-6 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading text-xl text-[#F0EDE6]">Traveloop</span>
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-[#E8C547] px-4 py-1.5 text-sm font-medium text-[#080C10] transition-colors hover:bg-[#d4b33f]"
          >
            Plan your own trip →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        {/* Trip hero */}
        <div className="relative overflow-hidden rounded-2xl">
          {trip.coverPhotoUrl && (
            <Image
              src={trip.coverPhotoUrl}
              alt={trip.name}
              fill
              className="object-cover opacity-30"
              sizes="768px"
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-[rgba(8,12,16,0.95)] via-[rgba(8,12,16,0.6)] to-[rgba(8,12,16,0.3)]" />
          <div className="relative px-6 py-8">
            <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[#E8C547]">
              Shared Itinerary
            </p>
            <h1 className="font-heading text-[clamp(2rem,5vw,3rem)] font-light text-[#F0EDE6]">
              {trip.name}
            </h1>
            <p className="mt-2 text-sm text-[rgba(240,237,230,0.5)]">
              {fmt(trip.startDate)} – {fmt(trip.endDate)}
            </p>

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
                    className="flex items-center gap-1.5 rounded-lg bg-[rgba(255,255,255,0.06)] px-3 py-1.5 text-sm text-[#F0EDE6] backdrop-blur-sm"
                  >
                    <Icon size={13} className="text-[#E8C547]" />
                    {stat.label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Timeline */}
        {trip.stops.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-[rgba(255,255,255,0.08)] py-14 text-center">
            <MapPin size={32} className="mb-2 text-[rgba(240,237,230,0.2)]" />
            <p className="text-sm text-[rgba(240,237,230,0.45)]">No stops in this itinerary</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-2.25 top-2 bottom-10 w-0.5 bg-[#E8C547]/30" />
            <div className="space-y-2">
              {trip.stops.map((stop, idx) => {
                const nights = daysBetween(stop.startDate, stop.endDate);
                const isLast = idx === trip.stops.length - 1;

                return (
                  <div key={stop.id}>
                    <div className="relative flex gap-5">
                      <div className="relative z-10 mt-1 flex h-5 w-5 shrink-0 items-center justify-center">
                        <div className="h-5 w-5 rounded-full border-2 border-[#E8C547] bg-[#080C10] gold-glow" />
                      </div>
                      <div className="mb-6 flex-1">
                        <h3 className="font-heading text-[1.65rem] font-light text-[#F0EDE6]">
                          {stop.city.name}
                        </h3>
                        <p className="mb-3 text-xs text-[rgba(240,237,230,0.45)]">
                          {stop.city.country} · {fmtShort(stop.startDate)} – {fmtShort(stop.endDate)} · {nights} {nights === 1 ? "night" : "nights"}
                        </p>

                        <div className="relative mb-4 h-40 overflow-hidden rounded-xl ring-1 ring-[rgba(255,255,255,0.08)]">
                          {stop.city.coverImageUrl ? (
                            <Image
                              src={stop.city.coverImageUrl}
                              alt={stop.city.name}
                              fill
                              className="object-cover"
                              sizes="768px"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-[#0F1419]">
                              <span className="font-heading text-4xl text-[#E8C547]">
                                {stop.city.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>

                        {stop.activities.length === 0 ? (
                          <p className="text-sm text-[rgba(240,237,230,0.35)]">No activities planned</p>
                        ) : (
                          <div className="space-y-2">
                            {stop.activities.map((sa) => {
                              const IconComp = ACTIVITY_ICONS[sa.activity.type] ?? Sparkles;
                              return (
                                <div
                                  key={sa.id}
                                  className="flex items-center gap-3 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] px-4 py-3"
                                >
                                  <IconComp size={16} className="text-[#E8C547]" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[#F0EDE6] truncate">
                                      {sa.activity.name}
                                    </p>
                                  </div>
                                  <span className="flex shrink-0 items-center gap-1 text-xs text-[rgba(240,237,230,0.4)]">
                                    <Clock size={11} />
                                    {sa.activity.durationMinutes}m
                                  </span>
                                  <span className="shrink-0 rounded-full bg-[rgba(232,197,71,0.12)] px-2 py-0.5 text-[10px] font-medium text-[#E8C547]">
                                    ${Number(sa.activity.estimatedCost)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {!isLast && (
                      <div className="relative flex gap-5 py-4">
                        <div className="relative z-10 flex h-5 w-5 shrink-0 items-center justify-center">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#080C10]">
                            <Plane size={12} className="text-[#E8C547]" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[rgba(240,237,230,0.35)]">
                          <span className="h-px w-8 bg-[#E8C547]/30" />
                          In transit
                          <span className="h-px flex-1 bg-[#E8C547]/30" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[rgba(255,255,255,0.06)] bg-[rgba(13,18,24,0.95)] px-6 py-3 backdrop-blur-lg">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <p className="text-sm text-[rgba(240,237,230,0.6)]">
            Inspired? Copy this trip to your account
          </p>
          <Link href="/signup">
            <Button className="h-9 rounded-full bg-[#E8C547] px-5 text-sm font-semibold text-[#080C10] hover:bg-[#d4b33f]">
              Start Planning
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
