import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  label: z.string().min(1).max(200).optional(),
  isPacked: z.boolean().optional(),
  category: z.enum(["clothing", "documents", "electronics", "toiletries", "other"]).optional(),
});

async function authorize(itemId: string, userId: string) {
  const item = await db.checklistItem.findUnique({
    where: { id: itemId },
    include: { trip: { select: { userId: true } } },
  });
  if (!item || item.trip.userId !== userId) return null;
  return item;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string; itemId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { itemId } = await params;
    const item = await authorize(itemId, session.user.id);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });

    const updated = await db.checklistItem.update({ where: { id: itemId }, data: parsed.data });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string; itemId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { itemId } = await params;
    const item = await authorize(itemId, session.user.id);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await db.checklistItem.delete({ where: { id: itemId } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
