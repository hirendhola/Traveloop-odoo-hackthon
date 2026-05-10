import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { z } from "zod";

const createItemSchema = z.object({
  label: z.string().min(1).max(200),
  category: z.enum(["clothing", "documents", "electronics", "toiletries", "other"]),
});

async function getOwner(tripId: string) {
  return db.trip.findUnique({ where: { id: tripId }, select: { userId: true } });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { tripId } = await params;
    const trip = await getOwner(tripId);
    if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (trip.userId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const items = await db.checklistItem.findMany({
      where: { tripId },
      orderBy: [{ category: "asc" }, { createdAt: "asc" }],
    });

    return NextResponse.json(items);
  } catch (e: any) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { tripId } = await params;
    const trip = await getOwner(tripId);
    if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (trip.userId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const parsed = createItemSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });

    const item = await db.checklistItem.create({ data: { tripId, ...parsed.data } });
    return NextResponse.json(item, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
