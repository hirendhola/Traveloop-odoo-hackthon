import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { Users, Map, Building2, Activity, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const profile = await db.userProfile.findUnique({
    where: { userId: session.user.id },
    select: { isAdmin: true },
  });
  if (!profile?.isAdmin) redirect("/dashboard");

  const [userCount, tripCount, cityCount, activityCount, topCities, recentTrips] =
    await Promise.all([
      db.user.count(),
      db.trip.count(),
      db.city.count(),
      db.activity.count(),
      db.city.findMany({
        orderBy: { stops: { _count: "desc" } },
        take: 8,
        include: { _count: { select: { stops: true } } },
      }),
      db.trip.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true, name: true, createdAt: true, userId: true,
          _count: { select: { stops: true } },
        },
      }),
    ]);

  const maxStops = Math.max(...topCities.map((c) => c._count.stops), 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-(family-name:--font-heading) text-3xl font-bold text-[#0D1B2A]">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-[#5A6B7A]">Platform overview and analytics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Users", value: userCount, icon: Users, color: "text-[#FF5733]", bg: "bg-[#FF5733]/10" },
          { label: "Total Trips", value: tripCount, icon: Map, color: "text-[#7D9B76]", bg: "bg-[#7D9B76]/10" },
          { label: "Cities in DB", value: cityCount, icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Activities", value: activityCount, icon: Activity, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="border-[#D4C9B0] bg-white/80">
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${kpi.bg}`}>
                  <Icon size={22} className={kpi.color} />
                </div>
                <div>
                  <p className="text-xs text-[#A0AEBF]">{kpi.label}</p>
                  <p className="text-2xl font-bold text-[#0D1B2A]">{kpi.value.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Cities by trips */}
        <div className="rounded-2xl border border-[#D4C9B0] bg-white/80 p-5">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-[#FF5733]" />
            <h2 className="font-semibold text-[#0D1B2A]">Most Popular Cities</h2>
            <span className="ml-auto text-xs text-[#A0AEBF]">by stop count</span>
          </div>
          <div className="space-y-3">
            {topCities.map((city, idx) => (
              <div key={city.id} className="flex items-center gap-3">
                <span className="w-5 text-right text-xs font-bold text-[#A0AEBF]">{idx + 1}</span>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-[#0D1B2A]">{city.name}</span>
                    <span className="text-xs text-[#A0AEBF]">{city._count.stops} stops</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#EDE4CF]">
                    <div
                      className="h-2 rounded-full bg-[#FF5733]"
                      style={{ width: `${(city._count.stops / maxStops) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {topCities.length === 0 && (
              <p className="text-center text-sm text-[#A0AEBF]">No trip data yet</p>
            )}
          </div>
        </div>

        {/* Recent Trips */}
        <div className="rounded-2xl border border-[#D4C9B0] bg-white/80 p-5">
          <h2 className="mb-4 font-semibold text-[#0D1B2A]">Recent Trips</h2>
          <div className="space-y-2">
            {recentTrips.map((trip) => (
              <div
                key={trip.id}
                className="flex items-center justify-between rounded-xl bg-[#F8F4EC] px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#0D1B2A]">{trip.name}</p>
                  <p className="text-xs text-[#A0AEBF]">
                    {trip.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div className="ml-3 flex items-center gap-2 shrink-0">
                  <span className="rounded-full bg-[#EDE4CF] px-2 py-0.5 text-xs text-[#5A6B7A]">
                    {trip._count.stops} stops
                  </span>
                </div>
              </div>
            ))}
            {recentTrips.length === 0 && (
              <p className="text-center text-sm text-[#A0AEBF]">No trips yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
