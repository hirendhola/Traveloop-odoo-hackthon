import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ cityId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { cityId } = await params;

    const city = await db.city.findUnique({ where: { id: cityId }, select: { id: true } });
    if (!city) return NextResponse.json({ error: "City not found" }, { status: 404 });

    await db.userProfile.upsert({
      where: { userId: session.user.id },
      update: {},
      create: { userId: session.user.id },
    });

    const existing = await db.savedDestination.findUnique({
      where: { userId_cityId: { userId: session.user.id, cityId } },
    });

    if (existing) {
      await db.savedDestination.delete({
        where: { userId_cityId: { userId: session.user.id, cityId } },
      });
      return NextResponse.json({ saved: false });
    } else {
      await db.savedDestination.create({
        data: { userId: session.user.id, cityId },
      });
      return NextResponse.json({ saved: true });
    }
  } catch (e: any) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
