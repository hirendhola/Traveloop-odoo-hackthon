import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, TrendingUp, Compass, Plus } from "lucide-react";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const CITY_GRADIENTS = [
  "from-[#FF5733] to-[#FF8A6C]",
  "from-[#7D9B76] to-[#A3C9A8]",
  "from-[#0D1B2A] to-[#2A4A6F]",
  "from-[#E8A87C] to-[#C38D7A]",
  "from-[#85C1E2] to-[#5DADE2]",
  "from-[#BB8FCE] to-[#9B59B6]",
  "from-[#F7DC6F] to-[#F4D03F]",
  "from-[#58D68D] to-[#2ECC71]",
];

function cityGradient(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % CITY_GRADIENTS.length;
  return CITY_GRADIENTS[idx];
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
    take: 6,
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-(family-name:--font-heading) text-3xl font-bold text-[#0D1B2A]">
            {getGreeting()}, {session.user.name?.split(" ")[0] ?? "Traveler"}
          </h1>
          <p className="mt-1 text-sm text-[#5A6B7A]">
            Ready for your next adventure?
          </p>
        </div>
        <Link href="/trips/new">
          <Button className="rounded-full bg-[#FF5733] px-6 text-[#0D1B2A] hover:bg-[#FF8A6C]">
            <Plus size={18} className="mr-2" />
            Plan New Trip
          </Button>
        </Link>
      </div>

      {/* Upcoming Trips */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 font-(family-name:--font-heading) text-xl font-semibold text-[#0D1B2A]">
          <Calendar size={20} className="text-[#FF5733]" />
          Upcoming Trips
        </h2>

        {upcomingTrips.length === 0 ? (
          <Card className="border-2 border-dashed border-[#D4C9B0] bg-[#F5ECD7]">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#EDE4CF]">
                <Compass size={28} className="text-[#FF5733]" />
              </div>
              <p className="text-[#0D1B2A] font-medium">No upcoming trips yet</p>
              <p className="mt-1 text-sm text-[#5A6B7A]">Start planning your next adventure</p>
              <Link href="/trips/new" className="mt-4 inline-flex items-center gap-1 rounded-full bg-[#FF5733] px-5 py-2 text-sm text-[#0D1B2A] transition-colors hover:bg-[#FF8A6C]">
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
                  <Card className="group h-full cursor-pointer overflow-hidden border-[#D4C9B0] transition-shadow hover:shadow-lg">
                    {/* Cover image or placeholder */}
                    <div className="relative h-32 bg-[#0D1B2A]">
                      {trip.coverPhotoUrl ? (
                        <img
                          src={trip.coverPhotoUrl}
                          alt={trip.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="font-(family-name:--font-heading) text-3xl text-[#FF5733]">
                            {trip.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 rounded-full bg-[#0D1B2A]/80 px-2 py-0.5 text-xs text-[#F5ECD7]">
                        {trip._count.stops} {trip._count.stops === 1 ? "city" : "cities"}
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-semibold text-[#0D1B2A] group-hover:text-[#FF5733]">
                        {trip.name}
                      </h3>
                      <p className="mt-1 text-xs text-[#5A6B7A]">
                        {formatDateRange(trip.startDate, trip.endDate)}
                      </p>

                      {/* Budget bar */}
                      {budget && (
                        <div className="mt-3">
                          <div className="mb-1 flex items-center justify-between text-xs">
                            <span className="text-[#5A6B7A]">Budget</span>
                            <span className={overBudget ? "text-[#E11D48]" : "text-[#7D9B76]"}>
                              ${spent.toLocaleString()} / ${budget!.toLocaleString()}
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-[#EDE4CF]">
                            <div
                              className={`h-2 rounded-full transition-all ${overBudget ? "bg-[#E11D48]" : "bg-[#7D9B76]"}`}
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
        <h2 className="mb-4 flex items-center gap-2 font-(family-name:--font-heading) text-xl font-semibold text-[#0D1B2A]">
          <TrendingUp size={20} className="text-[#FF5733]" />
          Recommended Destinations
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommendedCities.map((city) => {
            const gradient = cityGradient(city.name);
            return (
              <Link key={city.id} href={`/cities?search=${encodeURIComponent(city.name)}`}>
                <Card className="group cursor-pointer overflow-hidden border-[#D4C9B0] transition-all hover:shadow-lg hover:-translate-y-0.5">
                  <div className={`relative h-44 bg-linear-to-br ${gradient}`}>
                    {city.coverImageUrl ? (
                      <img
                        src={city.coverImageUrl}
                        alt={city.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center">
                        <span className="font-(family-name:--font-heading) text-5xl text-white/90">
                          {city.name.charAt(0)}
                        </span>
                        <MapPin size={16} className="mt-2 text-white/60" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <h3 className="font-semibold text-white drop-shadow-sm">{city.name}</h3>
                      <p className="text-xs text-white/80">{city.country}</p>
                    </div>
                    {Number(city.popularityScore) > 0 && (
                      <div className="absolute right-3 top-3 rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        ★ {Number(city.popularityScore)}
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
