import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";

async function getOwner(tripId: string) {
  return db.trip.findUnique({ where: { id: tripId }, select: { userId: true } });
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

    const token = crypto.randomUUID().replace(/-/g, "");

    await db.trip.update({
      where: { id: tripId },
      data: { isPublic: true, shareToken: token },
    });

    return NextResponse.json({ token });
  } catch (e: any) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(
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

    await db.trip.update({
      where: { id: tripId },
      data: { isPublic: false, shareToken: null },
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
