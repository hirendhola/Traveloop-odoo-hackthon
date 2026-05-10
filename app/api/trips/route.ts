import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { z } from "zod";

const createTripSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  totalBudget: z.number().positive().optional(),
  coverPhotoUrl: z.string().url().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const upcoming = searchParams.get("upcoming") === "true";

    const where: any = { userId: session.user.id };
    if (upcoming) {
      where.startDate = { gte: new Date() };
    }

    const trips = await db.trip.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { stops: true } },
      },
    });

    return NextResponse.json(trips);
  } catch (error: any) {
    console.error("[api/trips] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trips" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createTripSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, description, startDate, endDate, totalBudget, coverPhotoUrl } = parsed.data;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      return NextResponse.json(
        { error: "End date must be after start date" },
        { status: 400 }
      );
    }

    const trip = await db.trip.create({
      data: {
        name,
        description,
        startDate: start,
        endDate: end,
        totalBudget,
        coverPhotoUrl,
        userId: session.user.id,
      },
    });

    return NextResponse.json(trip, { status: 201 });
  } catch (error: any) {
    console.error("[api/trips] POST error:", error);
    return NextResponse.json(
      { error: "Failed to create trip" },
      { status: 500 }
    );
  }
}
