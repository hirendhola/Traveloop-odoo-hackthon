import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Map } from "lucide-react";
import { TripCardActions } from "@/components/trip-card-actions";

function formatDateRange(start: Date, end: Date) {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const startStr = start.toLocaleDateString("en-US", opts);
  const endStr = end.toLocaleDateString("en-US", opts);
  const yearStr =
    start.getFullYear() === end.getFullYear()
      ? `, ${start.getFullYear()}`
      : ` – ${end.getFullYear()}`;
  return `${startStr} – ${endStr}${yearStr}`;
}

export default async function TripsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const trips = await db.trip.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { stops: true } },
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-(family-name:--font-heading) text-3xl font-bold text-[#0D1B2A]">
            My Trips
          </h1>
          <p className="mt-1 text-sm text-[#5A6B7A]">
            {trips.length} {trips.length === 1 ? "trip" : "trips"} planned
          </p>
        </div>
        <Link href="/trips/new">
          <Button className="rounded-full bg-[#FF5733] px-6 text-[#0D1B2A] hover:bg-[#FF8A6C]">
            <Plus size={18} className="mr-2" />
            New Trip
          </Button>
        </Link>
      </div>

      {/* Trips Grid */}
      {trips.length === 0 ? (
        <Card className="border-2 border-dashed border-[#D4C9B0] bg-[#F5ECD7]">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#EDE4CF]">
              <Map size={28} className="text-[#FF5733]" />
            </div>
            <p className="font-medium text-[#0D1B2A]">No trips yet</p>
            <p className="mt-1 text-sm text-[#5A6B7A]">
              Start planning your first adventure
            </p>
            <Link
              href="/trips/new"
              className="mt-4 inline-flex items-center gap-1 rounded-full bg-[#FF5733] px-5 py-2 text-sm text-[#0D1B2A] transition-colors hover:bg-[#FF8A6C]"
            >
              <Plus size={16} />
              Plan a Trip
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip: { id: string; name: string; coverPhotoUrl: string | null; startDate: Date; endDate: Date; description: string | null; _count: { stops: number } }) => (
            <Card
              key={trip.id}
              className="group overflow-hidden border-[#D4C9B0] transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              {/* Cover */}
              <div className="relative h-36 bg-[#0D1B2A]">
                {trip.coverPhotoUrl ? (
                  <img
                    src={trip.coverPhotoUrl}
                    alt={trip.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="font-(family-name:--font-heading) text-4xl text-[#FF5733]">
                      {trip.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute bottom-2 right-2 rounded-full bg-[#0D1B2A]/80 px-2 py-0.5 text-xs text-[#F5ECD7]">
                  {trip._count.stops}{" "}
                  {trip._count.stops === 1 ? "city" : "cities"}
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-[#0D1B2A]">{trip.name}</h3>
                <p className="mt-1 text-xs text-[#5A6B7A]">
                  {formatDateRange(trip.startDate, trip.endDate)}
                </p>

                {trip.description && (
                  <p className="mt-2 line-clamp-2 text-xs text-[#5A6B7A]">
                    {trip.description}
                  </p>
                )}

                <TripCardActions tripId={trip.id} tripName={trip.name} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
