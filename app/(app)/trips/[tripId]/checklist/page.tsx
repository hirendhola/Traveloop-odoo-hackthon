import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { ChecklistClient } from "@/components/checklist-client";

export const metadata = {
  title: "Checklist",
};

export default async function ChecklistPage({
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
      checklist: { orderBy: [{ category: "asc" }, { createdAt: "asc" }] },
    },
  });

  if (!trip || trip.userId !== session.user.id) redirect("/trips");

  const items = trip.checklist.map((item) => ({
    id: item.id,
    label: item.label,
    category: item.category,
    isPacked: item.isPacked,
    createdAt: item.createdAt.toISOString(),
  }));

  return <ChecklistClient tripId={tripId} initialItems={items} />;
}
