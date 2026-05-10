import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { NotesClient } from "@/components/notes-client";

export const metadata = {
  title: "Notes",
};

export default async function NotesPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const { tripId } = await params;

  const trip = await db.trip.findUnique({
    where: { id: tripId },
    select: {
      userId: true,
      notes: {
        orderBy: { createdAt: "desc" },
        include: { stop: { include: { city: { select: { name: true } } } } },
      },
    },
  });

  if (!trip || trip.userId !== session.user.id) redirect("/trips");

  const notes = trip.notes.map((n) => ({
    id: n.id,
    content: n.content,
    stopId: n.stopId,
    cityName: n.stop?.city?.name ?? null,
    createdAt: n.createdAt.toISOString(),
    updatedAt: n.updatedAt.toISOString(),
  }));

  return <NotesClient tripId={tripId} initialNotes={notes} />;
}
