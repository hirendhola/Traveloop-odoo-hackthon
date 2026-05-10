import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { TripEditor } from "@/components/trip-editor";

export default async function EditTripPage({
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
          activities: { include: { activity: true } },
        },
      },
    },
  });

  if (!trip || trip.userId !== session.user.id) redirect("/trips");

  const serialized = {
    id: trip.id,
    name: trip.name,
    description: trip.description,
    startDate: trip.startDate.toISOString(),
    endDate: trip.endDate.toISOString(),
    totalBudget: trip.totalBudget ? Number(trip.totalBudget) : null,
    coverPhotoUrl: trip.coverPhotoUrl,
    stops: trip.stops.map((s) => ({
      id: s.id,
      cityId: s.cityId,
      orderIndex: s.orderIndex,
      startDate: s.startDate.toISOString(),
      endDate: s.endDate.toISOString(),
      city: {
        id: s.city.id,
        name: s.city.name,
        country: s.city.country,
        region: s.city.region,
        coverImageUrl: s.city.coverImageUrl,
        costIndex: Number(s.city.costIndex),
        popularityScore: Number(s.city.popularityScore),
      },
      activities: s.activities.map((sa) => ({
        id: sa.id,
        activityId: sa.activityId,
        scheduledTime: sa.scheduledTime,
        notes: sa.notes,
        activity: {
          id: sa.activity.id,
          name: sa.activity.name,
          type: sa.activity.type,
          description: sa.activity.description,
          estimatedCost: Number(sa.activity.estimatedCost),
          durationMinutes: sa.activity.durationMinutes,
        },
      })),
    })),
  };

  return <TripEditor initialTrip={serialized} />;
}
