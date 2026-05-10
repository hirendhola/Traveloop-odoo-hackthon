import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { z } from "zod";

const updateStopSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

async function authorize(stopId: string, userId: string) {
  const stop = await db.stop.findUnique({
    where: { id: stopId },
    include: { trip: { select: { userId: true } } },
  });
  if (!stop) return null;
  if (stop.trip.userId !== userId) return null;
  return stop;
}

export async function PATCH(
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
    const parsed = updateStopSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });

    const updated = await db.stop.update({
      where: { id: stopId },
      data: {
        ...(parsed.data.startDate && { startDate: new Date(parsed.data.startDate) }),
        ...(parsed.data.endDate && { endDate: new Date(parsed.data.endDate) }),
      },
      include: { city: true },
    });

    return NextResponse.json(updated);
  } catch (e: any) {
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

    await db.stop.delete({ where: { id: stopId } });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
