import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { z } from "zod";

const createNoteSchema = z.object({
  content: z.string().min(1).max(5000),
  stopId: z.string().optional(),
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

    const notes = await db.tripNote.findMany({
      where: { tripId },
      orderBy: { createdAt: "desc" },
      include: { stop: { include: { city: { select: { name: true } } } } },
    });

    return NextResponse.json(notes);
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
    const parsed = createNoteSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });

    const note = await db.tripNote.create({ data: { tripId, ...parsed.data } });
    return NextResponse.json(note, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
