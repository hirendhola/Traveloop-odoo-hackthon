import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim();
    const limit = parseInt(searchParams.get("limit") ?? "20", 10);
    const top = searchParams.get("top") === "true";

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { country: { contains: search, mode: "insensitive" } },
      ];
    }

    const cities = await db.city.findMany({
      where,
      orderBy: top ? { popularityScore: "desc" } : { name: "asc" },
      take: Math.min(limit, 50),
      include: {
        _count: { select: { activities: true } },
      },
    });

    return NextResponse.json(cities);
  } catch (error: any) {
    console.error("[api/cities] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cities" },
      { status: 500 }
    );
  }
}
