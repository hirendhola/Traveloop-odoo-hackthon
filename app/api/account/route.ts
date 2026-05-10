import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;

    await db.$transaction([
      db.savedDestination.deleteMany({ where: { userId } }),
      db.userProfile.deleteMany({ where: { userId } }),
      db.trip.deleteMany({ where: { userId } }),
    ]);

    await db.user.delete({ where: { id: userId } });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("[account DELETE]", e);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
