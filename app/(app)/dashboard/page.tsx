import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, TrendingUp, Compass, Plus, ArrowRight } from "lucide-react";
import Image from "next/image";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatDateRange(start: Date, end: Date) {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const startStr = start.toLocaleDateString("en-US", opts);
  const endStr = end.toLocaleDateString("en-US", opts);
  const yearStr = start.getFullYear() === end.getFullYear()
    ? `, ${start.getFullYear()}`
    : ` – ${end.getFullYear()}`;
  return `${startStr} – ${endStr}${yearStr}`;
}

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingTrips = await db.trip.findMany({
    where: {
      userId: session.user.id,
      startDate: { gte: today },
    },
    orderBy: { startDate: "asc" },
    take: 3,
    include: {
      _count: { select: { stops: true } },
      expenses: { select: { amount: true } },
    },
  });

  const recommendedCities = await db.city.findMany({
    orderBy: { popularityScore: "desc" },
    take: 8,
  });

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-[clamp(1.75rem,4vw,2.5rem)] font-light text-[#F0EDE6]">
            {getGreeting()}, {session.user.name?.split(" ")[0] ?? "Traveler"}
          </h1>
          <p className="mt-1 text-sm text-[rgba(240,237,230,0.45)]">
            {today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        <Link href="/trips/new">
          <Button className="h-11 rounded-full bg-[#E8C547] px-6 text-sm font-semibold text-[#080C10] transition-all hover:bg-[#d4b33f] hover:shadow-lg hover:shadow-[#E8C547]/20">
            <Plus size={18} className="mr-2" />
            Plan New Trip
          </Button>
        </Link>
      </div>

      {/* Upcoming Trips */}
      <section>
        <h2 className="mb-5 flex items-center gap-2 font-heading text-xl font-light text-[#F0EDE6]">
          <Calendar size={18} className="text-[#E8C547]" />
          Upcoming Trips
        </h2>

        {upcomingTrips.length === 0 ? (
          <Card className="border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)]">
            <CardContent className="flex flex-col items-center py-14 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(232,197,71,0.12)]">
                <Compass size={24} className="text-[#E8C547]" />
              </div>
              <p className="text-[#F0EDE6] font-medium">No upcoming trips yet</p>
              <p className="mt-1 text-sm text-[rgba(240,237,230,0.45)]">Start planning your next adventure</p>
              <Link href="/trips/new" className="mt-5 inline-flex items-center gap-1 rounded-full bg-[#E8C547] px-5 py-2.5 text-sm font-medium text-[#080C10] transition-all hover:bg-[#d4b33f]">
                <Plus size={16} />
                Plan your first trip
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingTrips.map((trip) => {
              const spent = trip.expenses.reduce((sum, e) => sum + Number(e.amount), 0);
              const budget = trip.totalBudget ? Number(trip.totalBudget) : null;
              const budgetPercent = budget ? Math.min((spent / budget) * 100, 100) : 0;
              const overBudget = budget ? spent > budget : false;

              return (
                <Link key={trip.id} href={`/trips/${trip.id}`}>
                  <Card className="group h-full cursor-pointer overflow-hidden border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] transition-all hover:shadow-2xl hover:shadow-black/40 card-hover">
                    {/* Cover image */}
                    <div className="relative h-40">
                      {trip.coverPhotoUrl ? (
                        <Image
                          src={trip.coverPhotoUrl}
                          alt={trip.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-[#0F1419]">
                          <span className="font-heading text-4xl text-[#E8C547]">
                            {trip.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-[rgba(8,12,16,0.85)] via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4">
                        <h3 className="font-heading text-xl font-light text-white">
                          {trip.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-[rgba(255,255,255,0.65)]">
                          {formatDateRange(trip.startDate, trip.endDate)}
                        </p>
                      </div>
                      <div className="absolute right-3 top-3 rounded-full bg-[rgba(8,12,16,0.7)] px-2.5 py-1 text-[10px] font-medium text-[#F0EDE6] backdrop-blur-md">
                        {trip._count.stops} {trip._count.stops === 1 ? "city" : "cities"}
                      </div>
                    </div>

                    <CardContent className="p-4">
                      {/* Budget bar */}
                      {budget && (
                        <div>
                          <div className="mb-1.5 flex items-center justify-between text-xs">
                            <span className="text-[rgba(240,237,230,0.45)]">Budget</span>
                            <span className={overBudget ? "text-[#E05252]" : "text-[#7D9B76]"}>
                              ${spent.toLocaleString()} / ${budget!.toLocaleString()}
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.08)]">
                            <div
                              className={`h-1.5 rounded-full transition-all ${overBudget ? "bg-[#E05252]" : "bg-[#E8C547]"}`}
                              style={{ width: `${budgetPercent}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Recommended Destinations */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-heading text-xl font-light text-[#F0EDE6]">
            <TrendingUp size={18} className="text-[#E8C547]" />
            Recommended Destinations
          </h2>
          <Link href="/cities" className="flex items-center gap-1 text-sm text-[#E8C547] hover:underline">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="scrollbar-hide -mx-6 flex gap-4 overflow-x-auto px-6 pb-2">
          {recommendedCities.map((city) => (
            <Link
              key={city.id}
              href={`/cities/${city.id}`}
              className="group block w-[200px] shrink-0 overflow-hidden rounded-xl"
            >
              <div className="relative h-[260px]">
                {city.coverImageUrl ? (
                  <Image
                    src={city.coverImageUrl}
                    alt={city.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="200px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[#0F1419]">
                    <span className="font-heading text-5xl text-[#E8C547]">
                      {city.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-[rgba(8,12,16,0.9)] via-[rgba(8,12,16,0.2)] to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#E8C547]">
                    {city.country}
                  </p>
                  <h3 className="mt-1 font-heading text-lg font-light text-white">
                    {city.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
