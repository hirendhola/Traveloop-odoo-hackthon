import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const cityId = searchParams.get("cityId");
    const search = searchParams.get("search")?.trim();
    const type = searchParams.get("type");

    const where: any = {};
    if (cityId) where.cityId = cityId;
    if (type) where.type = type;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const activities = await db.activity.findMany({
      where,
      orderBy: { name: "asc" },
      take: 30,
      include: { city: { select: { name: true, country: true } } },
    });

    return NextResponse.json(activities);
  } catch (e: any) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
