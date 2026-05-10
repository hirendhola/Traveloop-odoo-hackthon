import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { BudgetClient } from "@/components/budget-client";

export default async function BudgetPage({
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
      totalBudget: true,
      startDate: true,
      endDate: true,
      expenses: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!trip || trip.userId !== session.user.id) redirect("/trips");

  const totalDays = Math.max(
    Math.ceil((trip.endDate.getTime() - trip.startDate.getTime()) / 86_400_000),
    1
  );

  const serialized = {
    tripId,
    totalBudget: trip.totalBudget ? Number(trip.totalBudget) : null,
    totalDays,
    expenses: trip.expenses.map((e) => ({
      id: e.id,
      category: e.category,
      label: e.label,
      amount: Number(e.amount),
      stopId: e.stopId,
      createdAt: e.createdAt.toISOString(),
    })),
  };

  return <BudgetClient {...serialized} />;
}
