import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { z } from "zod";

const updateTripSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  totalBudget: z.number().positive().optional().nullable(),
  coverPhotoUrl: z.string().url().optional().nullable(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tripId } = await params;

    const trip = await db.trip.findUnique({
      where: { id: tripId },
      include: {
        stops: {
          orderBy: { orderIndex: "asc" },
          include: {
            city: true,
            activities: {
              include: { activity: true },
            },
          },
        },
        expenses: { orderBy: { createdAt: "desc" } },
        checklist: { orderBy: { createdAt: "asc" } },
        notes: { orderBy: { createdAt: "desc" } },
        _count: { select: { stops: true } },
      },
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    if (trip.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(trip);
  } catch (error: any) {
    console.error("[api/trips/:id] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trip" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tripId } = await params;

    const existing = await db.trip.findUnique({
      where: { id: tripId },
      select: { userId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = updateTripSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data: any = {};
    if (parsed.data.name !== undefined) data.name = parsed.data.name;
    if (parsed.data.description !== undefined) data.description = parsed.data.description;
    if (parsed.data.startDate !== undefined) data.startDate = new Date(parsed.data.startDate);
    if (parsed.data.endDate !== undefined) data.endDate = new Date(parsed.data.endDate);
    if (parsed.data.totalBudget !== undefined) data.totalBudget = parsed.data.totalBudget;
    if (parsed.data.coverPhotoUrl !== undefined) data.coverPhotoUrl = parsed.data.coverPhotoUrl;

    if (data.startDate && data.endDate && data.endDate < data.startDate) {
      return NextResponse.json(
        { error: "End date must be after start date" },
        { status: 400 }
      );
    }

    const trip = await db.trip.update({
      where: { id: tripId },
      data,
    });

    return NextResponse.json(trip);
  } catch (error: any) {
    console.error("[api/trips/:id] PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update trip" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tripId } = await params;

    const existing = await db.trip.findUnique({
      where: { id: tripId },
      select: { userId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.trip.delete({ where: { id: tripId } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[api/trips/:id] DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete trip" },
      { status: 500 }
    );
  }
}
