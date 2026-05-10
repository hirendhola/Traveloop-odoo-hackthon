import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  content: z.string().min(1).max(5000),
});

async function authorize(noteId: string, userId: string) {
  const note = await db.tripNote.findUnique({
    where: { id: noteId },
    include: { trip: { select: { userId: true } } },
  });
  if (!note || note.trip.userId !== userId) return null;
  return note;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string; noteId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { noteId } = await params;
    const note = await authorize(noteId, session.user.id);
    if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });

    const updated = await db.tripNote.update({ where: { id: noteId }, data: parsed.data });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string; noteId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { noteId } = await params;
    const note = await authorize(noteId, session.user.id);
    if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await db.tripNote.delete({ where: { id: noteId } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
