import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  languagePreference: z.string().min(2).max(10).optional(),
  image: z.string().url().optional().nullable(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [user, profile] = await Promise.all([
      db.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, name: true, email: true, image: true, createdAt: true },
      }),
      db.userProfile.findUnique({
        where: { userId: session.user.id },
        include: {
          savedDestinations: {
            include: { city: { select: { id: true, name: true, country: true, coverImageUrl: true } } },
            orderBy: { createdAt: "desc" },
          },
        },
      }),
    ]);

    return NextResponse.json({ user, profile });
  } catch (e: any) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });

    const { name, languagePreference, image } = parsed.data;
    const ops: Promise<any>[] = [];

    if (name !== undefined || image !== undefined) {
      ops.push(
        db.user.update({
          where: { id: session.user.id },
          data: { ...(name !== undefined && { name }), ...(image !== undefined && { image }) },
        })
      );
    }

    if (languagePreference !== undefined) {
      ops.push(
        db.userProfile.upsert({
          where: { userId: session.user.id },
          update: { languagePreference },
          create: { userId: session.user.id, languagePreference },
        })
      );
    }

    await Promise.all(ops);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
