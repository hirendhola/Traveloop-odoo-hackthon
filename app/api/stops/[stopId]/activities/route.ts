import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { z } from "zod";

const addActivitySchema = z.object({
  activityId: z.string().min(1),
  scheduledTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  notes: z.string().max(500).optional(),
});

async function authorize(stopId: string, userId: string) {
  const stop = await db.stop.findUnique({
    where: { id: stopId },
    include: { trip: { select: { userId: true } } },
  });
  if (!stop || stop.trip.userId !== userId) return null;
  return stop;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ stopId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { stopId } = await params;
    const stop = await authorize(stopId, session.user.id);
    if (!stop) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const activities = await db.stopActivity.findMany({
      where: { stopId },
      include: { activity: true },
    });

    return NextResponse.json(activities);
  } catch (e: any) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ stopId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { stopId } = await params;
    const stop = await authorize(stopId, session.user.id);
    if (!stop) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await req.json();
    const parsed = addActivitySchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });

    const sa = await db.stopActivity.create({
      data: { stopId, ...parsed.data },
      include: { activity: true },
    });

    return NextResponse.json(sa, { status: 201 });
  } catch (e: any) {
    if ((e as any).code === "P2002") {
      return NextResponse.json({ error: "Activity already added to this stop" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ stopId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { stopId } = await params;
    const stop = await authorize(stopId, session.user.id);
    if (!stop) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { activityId } = await req.json();
    if (!activityId) return NextResponse.json({ error: "activityId required" }, { status: 400 });

    await db.stopActivity.deleteMany({ where: { stopId, activityId } });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
