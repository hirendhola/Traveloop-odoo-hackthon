import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { z } from "zod";

const addStopSchema = z.object({
  cityId: z.string().min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
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
    if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    if (trip.userId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const stops = await db.stop.findMany({
      where: { tripId },
      orderBy: { orderIndex: "asc" },
      include: {
        city: true,
        activities: { include: { activity: true } },
      },
    });

    return NextResponse.json(stops);
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
    if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    if (trip.userId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const parsed = addStopSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });

    const { cityId, startDate, endDate } = parsed.data;

    const maxOrder = await db.stop.aggregate({ where: { tripId }, _max: { orderIndex: true } });
    const orderIndex = (maxOrder._max.orderIndex ?? -1) + 1;

    const stop = await db.stop.create({
      data: { tripId, cityId, startDate: new Date(startDate), endDate: new Date(endDate), orderIndex },
      include: { city: true, activities: { include: { activity: true } } },
    });

    return NextResponse.json(stop, { status: 201 });
  } catch (e: any) {
    console.error("[stops POST]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
