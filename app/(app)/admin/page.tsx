import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { Users, Map, Building2, Activity, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Admin",
};

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
        <h1 className="font-heading text-[clamp(1.75rem,4vw,2.5rem)] font-light text-[#F0EDE6]">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-[rgba(240,237,230,0.45)]">Platform overview and analytics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Users", value: userCount, icon: Users, color: "text-[#E8C547]", bg: "bg-[rgba(232,197,71,0.12)]" },
          { label: "Total Trips", value: tripCount, icon: Map, color: "text-[#7D9B76]", bg: "bg-[rgba(125,155,118,0.12)]" },
          { label: "Cities in DB", value: cityCount, icon: Building2, color: "text-[#C4A882]", bg: "bg-[rgba(196,168,130,0.12)]" },
          { label: "Activities", value: activityCount, icon: Activity, color: "text-[#85C1E2]", bg: "bg-[rgba(133,193,226,0.12)]" },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)]">
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${kpi.bg}`}>
                  <Icon size={22} className={kpi.color} />
                </div>
                <div>
                  <p className="text-xs text-[rgba(240,237,230,0.35)]">{kpi.label}</p>
                  <p className="font-(family-name:--font-dm-mono) text-2xl text-[#F0EDE6]">{kpi.value.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Cities by trips */}
        <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-5">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-[#E8C547]" />
            <h2 className="font-medium text-[#F0EDE6]">Most Popular Cities</h2>
            <span className="ml-auto text-xs text-[rgba(240,237,230,0.35)]">by stop count</span>
          </div>
          <div className="space-y-3">
            {topCities.map((city, idx) => (
              <div key={city.id} className="flex items-center gap-3">
                <span className="w-5 text-right text-xs font-bold text-[rgba(240,237,230,0.35)]">{idx + 1}</span>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-[#F0EDE6]">{city.name}</span>
                    <span className="text-xs text-[rgba(240,237,230,0.4)]">{city._count.stops} stops</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
                    <div
                      className="h-1.5 rounded-full bg-[#E8C547]"
                      style={{ width: `${(city._count.stops / maxStops) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {topCities.length === 0 && (
              <p className="text-center text-sm text-[rgba(240,237,230,0.35)]">No trip data yet</p>
            )}
          </div>
        </div>

        {/* Recent Trips */}
        <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-5">
          <h2 className="mb-4 font-medium text-[#F0EDE6]">Recent Trips</h2>
          <div className="space-y-2">
            {recentTrips.map((trip) => (
              <div
                key={trip.id}
                className="flex items-center justify-between rounded-xl bg-[rgba(255,255,255,0.03)] px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#F0EDE6]">{trip.name}</p>
                  <p className="text-xs text-[rgba(240,237,230,0.35)]">
                    {trip.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div className="ml-3 flex items-center gap-2 shrink-0">
                  <span className="rounded-full bg-[rgba(255,255,255,0.06)] px-2 py-0.5 text-xs text-[rgba(240,237,230,0.45)]">
                    {trip._count.stops} stops
                  </span>
                </div>
              </div>
            ))}
            {recentTrips.length === 0 && (
              <p className="text-center text-sm text-[rgba(240,237,230,0.35)]">No trips yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
