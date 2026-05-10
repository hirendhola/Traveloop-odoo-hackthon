import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Map, Eye, Pencil, Trash2 } from "lucide-react";
import { TripCardActions } from "@/components/trip-card-actions";
import Image from "next/image";

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

export const metadata = {
  title: "My Trips",
};

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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-[clamp(1.75rem,4vw,2.5rem)] font-light text-[#F0EDE6]">
            My Trips
          </h1>
          <p className="mt-1 text-sm text-[rgba(240,237,230,0.45)]">
            {trips.length} {trips.length === 1 ? "trip" : "trips"} planned
          </p>
        </div>
        <Link href="/trips/new">
          <Button className="h-11 rounded-full bg-[#E8C547] px-6 text-sm font-semibold text-[#080C10] transition-all hover:bg-[#d4b33f] hover:shadow-lg hover:shadow-[#E8C547]/20">
            <Plus size={18} className="mr-2" />
            New Trip
          </Button>
        </Link>
      </div>

      {/* Trips Grid */}
      {trips.length === 0 ? (
        <Card className="border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)]">
          <CardContent className="flex flex-col items-center py-20 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(232,197,71,0.12)]">
              <Map size={24} className="text-[#E8C547]" />
            </div>
            <p className="font-medium text-[#F0EDE6]">No trips yet</p>
            <p className="mt-1 text-sm text-[rgba(240,237,230,0.45)]">
              Start planning your first adventure
            </p>
            <Link
              href="/trips/new"
              className="mt-5 inline-flex items-center gap-1 rounded-full bg-[#E8C547] px-5 py-2.5 text-sm font-medium text-[#080C10] transition-all hover:bg-[#d4b33f]"
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
              className="group overflow-hidden border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] transition-all card-hover"
            >
              {/* Cover */}
              <div className="relative h-[200px]">
                {trip.coverPhotoUrl ? (
                  <Image
                    src={trip.coverPhotoUrl}
                    alt={trip.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{ viewTransitionName: `trip-cover-${trip.id}` }}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[#0F1419]">
                    <span className="font-heading text-5xl text-[#E8C547]">
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
                  {trip._count.stops}{" "}
                  {trip._count.stops === 1 ? "city" : "cities"}
                </div>
              </div>

              <CardContent className="p-4">
                {trip.description && (
                  <p className="mb-3 line-clamp-2 text-xs text-[rgba(240,237,230,0.45)]">
                    {trip.description}
                  </p>
                )}

                <div className="flex items-center gap-2">
                  <Link href={`/trips/${trip.id}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1 border-[rgba(255,255,255,0.08)] bg-transparent text-xs text-[#F0EDE6] hover:bg-[rgba(255,255,255,0.06)]"
                    >
                      <Eye size={14} />
                      View
                    </Button>
                  </Link>
                  <Link href={`/trips/${trip.id}/edit`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1 border-[rgba(255,255,255,0.08)] bg-transparent text-xs text-[#F0EDE6] hover:bg-[rgba(255,255,255,0.06)]"
                    >
                      <Pencil size={14} />
                      Edit
                    </Button>
                  </Link>
                  <TripCardActions tripId={trip.id} tripName={trip.name} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
