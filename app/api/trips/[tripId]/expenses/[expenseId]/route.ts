import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  category: z.enum(["transport", "stay", "activity", "meals", "other"]).optional(),
  label: z.string().min(1).max(200).optional(),
  amount: z.number().positive().optional(),
});

async function authorize(expenseId: string, userId: string) {
  const expense = await db.tripExpense.findUnique({
    where: { id: expenseId },
    include: { trip: { select: { userId: true } } },
  });
  if (!expense || expense.trip.userId !== userId) return null;
  return expense;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string; expenseId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { expenseId } = await params;
    const expense = await authorize(expenseId, session.user.id);
    if (!expense) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });

    const updated = await db.tripExpense.update({ where: { id: expenseId }, data: parsed.data });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string; expenseId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { expenseId } = await params;
    const expense = await authorize(expenseId, session.user.id);
    if (!expense) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await db.tripExpense.delete({ where: { id: expenseId } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
