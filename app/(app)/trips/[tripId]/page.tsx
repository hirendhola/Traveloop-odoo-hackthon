import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import {
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Plus,
  Pencil,
  Plane,
  Share2,
  Eye,
  Landmark,
  Utensils,
  Mountain,
  Palette,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/share-button";
import Image from "next/image";

const ACTIVITY_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  sightseeing: Landmark,
  food: Utensils,
  adventure: Mountain,
  culture: Palette,
  shopping: ShoppingBag,
  other: Sparkles,
};

const ACTIVITY_COLORS: Record<string, string> = {
  sightseeing: "text-blue-400",
  food: "text-orange-400",
  adventure: "text-green-400",
  culture: "text-purple-400",
  shopping: "text-pink-400",
  other: "text-[rgba(240,237,230,0.5)]",
};

function daysBetween(a: Date, b: Date) {
  return Math.ceil((b.getTime() - a.getTime()) / 86_400_000);
}

function fmt(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = await db.trip.findUnique({
    where: { id: tripId },
    include: { stops: { orderBy: { orderIndex: "asc" }, take: 3, include: { city: true } } },
  });

  const cities = trip?.stops.map((s) => s.city.name).join(", ") ?? "";

  return {
    title: trip?.name ?? "Trip",
    description: cities
      ? `A ${daysBetween(trip!.startDate, trip!.endDate)}-day trip to ${cities}.`
      : "View this trip on Traveloop.",
  };
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
  const overBudget = budget ? totalSpent > budget : false;

  const totalEstimated = trip.stops.reduce(
    (sum, stop) =>
      sum + stop.activities.reduce((s, sa) => s + Number(sa.activity.estimatedCost), 0),
    0
  );

  // SVG progress ring
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = budget ? circumference - (budgetPct / 100) * circumference : circumference;

  return (
    <div className="space-y-8">
      {/* Trip header + sticky info */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left — Timeline */}
        <div className="flex-1 lg:max-w-[60%]">
          {/* Top actions */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="font-heading text-[clamp(1.5rem,4vw,2.5rem)] font-light text-[#F0EDE6]">
                {trip.name}
              </h1>
              <p className="mt-1 text-sm text-[rgba(240,237,230,0.45)]">
                {fmt(trip.startDate)} – {fmt(trip.endDate)} · {totalDays} {totalDays === 1 ? "day" : "days"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/trips/${tripId}/edit`}>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 gap-1 border-[rgba(255,255,255,0.08)] bg-transparent text-xs text-[#F0EDE6] hover:bg-[rgba(255,255,255,0.06)]"
                >
                  <Pencil size={14} />
                  Edit
                </Button>
              </Link>
              <ShareButton tripId={tripId} />
            </div>
          </div>

          {/* Budget bar */}
          {budget && (
            <div className="mb-8 flex items-center gap-4 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-5 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(232,197,71,0.12)]">
                <DollarSign size={18} className="text-[#E8C547]" />
              </div>
              <div className="flex-1">
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-[rgba(240,237,230,0.55)]">Budget used</span>
                  <span className={overBudget ? "font-medium text-[#E05252]" : "font-medium text-[#E8C547]"}>
                    ${totalSpent.toLocaleString()} / ${budget.toLocaleString()}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
                  <div
                    className={`h-1.5 rounded-full transition-all ${overBudget ? "bg-[#E05252]" : "bg-[#E8C547]"}`}
                    style={{ width: `${budgetPct}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          {trip.stops.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] py-20 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(232,197,71,0.12)]">
                <MapPin size={24} className="text-[#E8C547]" />
              </div>
              <p className="font-medium text-[#F0EDE6]">No stops yet</p>
              <p className="mt-1 text-sm text-[rgba(240,237,230,0.45)]">Start building your itinerary</p>
              <Link href={`/trips/${tripId}/edit`} className="mt-5">
                <Button className="h-11 rounded-full bg-[#E8C547] px-6 text-sm font-semibold text-[#080C10] hover:bg-[#d4b33f]">
                  <Plus size={16} className="mr-1.5" />
                  Add First Stop
                </Button>
              </Link>
            </div>
          ) : (
            <div className="relative">
              {/* The railroad spine */}
              <div className="absolute left-[9px] top-2 bottom-10 w-[2px] bg-[#E8C547]/30" />

              <div className="space-y-2">
                {trip.stops.map((stop, idx) => {
                  const nights = daysBetween(stop.startDate, stop.endDate);
                  const isLast = idx === trip.stops.length - 1;

                  return (
                    <div key={stop.id}>
                      <div className="relative flex gap-5">
                        {/* Station dot */}
                        <div className="relative z-10 mt-1 flex h-5 w-5 shrink-0 items-center justify-center">
                          <div className="h-5 w-5 rounded-full border-2 border-[#E8C547] bg-[#080C10] gold-glow" />
                        </div>

                        {/* Stop card */}
                        <div className="mb-6 flex-1">
                          {/* City name */}
                          <h3 className="font-heading text-[1.65rem] font-light text-[#F0EDE6]">
                            {stop.city.name}
                          </h3>
                          <p className="mb-3 text-xs text-[rgba(240,237,230,0.45)]">
                            {stop.city.country} · {fmt(stop.startDate)} – {fmt(stop.endDate)} · {nights} {nights === 1 ? "night" : "nights"}
                          </p>

                          {/* City photo */}
                          <div className="relative mb-4 h-[160px] overflow-hidden rounded-xl ring-1 ring-[rgba(255,255,255,0.08)]">
                            {stop.city.coverImageUrl ? (
                              <Image
                                src={stop.city.coverImageUrl}
                                alt={stop.city.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 60vw"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center bg-[#0F1419]">
                                <span className="font-heading text-4xl text-[#E8C547]">
                                  {stop.city.name.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Activities */}
                          {stop.activities.length === 0 ? (
                            <div className="flex items-center gap-2 text-sm text-[rgba(240,237,230,0.35)]">
                              <span>No activities planned</span>
                              <Link
                                href={`/trips/${tripId}/edit`}
                                className="ml-auto text-xs text-[#E8C547] hover:underline"
                              >
                                Add activities
                              </Link>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {stop.activities.map((sa) => {
                                const IconComp = ACTIVITY_ICONS[sa.activity.type] ?? Sparkles;
                                const colorCls = ACTIVITY_COLORS[sa.activity.type] ?? ACTIVITY_COLORS.other;
                                return (
                                  <div
                                    key={sa.id}
                                    className="flex items-center gap-3 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] px-4 py-3 backdrop-blur-sm transition-colors hover:bg-[rgba(255,255,255,0.06)]"
                                  >
                                    <IconComp size={16} className={colorCls} />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-[#F0EDE6] truncate">
                                        {sa.activity.name}
                                      </p>
                                      {sa.scheduledTime && (
                                        <p className="text-xs text-[rgba(240,237,230,0.4)]">
                                          {sa.scheduledTime}
                                        </p>
                                      )}
                                    </div>
                                    {Number(sa.activity.estimatedCost) > 0 && (
                                      <span className="shrink-0 rounded-full bg-[rgba(232,197,71,0.12)] px-2 py-0.5 text-[10px] font-medium text-[#E8C547]">
                                        ${Number(sa.activity.estimatedCost)}
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Transit segment */}
                      {!isLast && (
                        <div className="relative flex gap-5 py-4">
                          <div className="relative z-10 flex h-5 w-5 shrink-0 items-center justify-center">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#080C10]">
                              <Plane size={12} className="text-[#E8C547]" />
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5 text-xs text-[rgba(240,237,230,0.35)]">
                            <span className="h-px w-8 bg-[#E8C547]/30" />
                            <span className="rounded-full bg-[rgba(255,255,255,0.04)] px-2.5 py-1 text-[10px] uppercase tracking-wider">In transit</span>
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
        </div>

        {/* Right — Sticky info card (desktop) */}
        <div className="hidden lg:block lg:w-[36%] lg:pl-8">
          <div className="sticky top-6 space-y-5 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-6 backdrop-blur-sm">
            <div>
              <h2 className="font-heading text-2xl font-light text-[#F0EDE6]">
                {trip.name}
              </h2>
              <p className="mt-1 text-sm text-[rgba(240,237,230,0.45)]">
                {fmt(trip.startDate)} – {fmt(trip.endDate)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-3">
                <p className="text-[10px] uppercase tracking-wider text-[rgba(240,237,230,0.35)]">Days</p>
                <p className="mt-1 font-(family-name:--font-dm-mono) text-xl text-[#F0EDE6]">{totalDays}</p>
              </div>
              <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-3">
                <p className="text-[10px] uppercase tracking-wider text-[rgba(240,237,230,0.35)]">Cities</p>
                <p className="mt-1 font-(family-name:--font-dm-mono) text-xl text-[#F0EDE6]">{trip._count.stops}</p>
              </div>
            </div>

            {/* Budget ring */}
            {budget && (
              <div className="flex items-center gap-4">
                <div className="relative h-[100px] w-[100px]">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="none"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="6"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="none"
                      stroke={overBudget ? "#E05252" : "#E8C547"}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={progressOffset}
                      style={{ transition: "stroke-dashoffset 600ms ease" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-(family-name:--font-dm-mono) text-lg font-medium text-[#F0EDE6]">
                      {Math.round(budgetPct)}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[rgba(240,237,230,0.35)]">Spent</p>
                  <p className="font-(family-name:--font-dm-mono) text-2xl text-[#F0EDE6]">
                    ${totalSpent.toLocaleString()}
                  </p>
                  <p className="text-xs text-[rgba(240,237,230,0.4)]">
                    of ${budget.toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Link href={`/trips/${tripId}/edit`}>
                <Button className="h-10 w-full rounded-full bg-[#E8C547] text-sm font-semibold text-[#080C10] hover:bg-[#d4b33f]">
                  <Pencil size={14} className="mr-2" />
                  Edit Trip
                </Button>
              </Link>

              <div className="h-px bg-[rgba(255,255,255,0.06)]" />

              <div className="grid grid-cols-3 gap-2">
                <Link href={`/trips/${tripId}/budget`}>
                  <Button
                    variant="outline"
                    className="h-10 w-full gap-1 border-[rgba(255,255,255,0.08)] bg-transparent px-1 text-xs text-[#F0EDE6] hover:bg-[rgba(255,255,255,0.06)]"
                  >
                    <DollarSign size={14} />
                    <span className="hidden xl:inline">Budget</span>
                  </Button>
                </Link>
                <Link href={`/trips/${tripId}/checklist`}>
                  <Button
                    variant="outline"
                    className="h-10 w-full gap-1 border-[rgba(255,255,255,0.08)] bg-transparent px-1 text-xs text-[#F0EDE6] hover:bg-[rgba(255,255,255,0.06)]"
                  >
                    <Clock size={14} />
                    <span className="hidden xl:inline">Checklist</span>
                  </Button>
                </Link>
                <Link href={`/trips/${tripId}/notes`}>
                  <Button
                    variant="outline"
                    className="h-10 w-full gap-1 border-[rgba(255,255,255,0.08)] bg-transparent px-1 text-xs text-[#F0EDE6] hover:bg-[rgba(255,255,255,0.06)]"
                  >
                    <Pencil size={14} />
                    <span className="hidden xl:inline">Notes</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
