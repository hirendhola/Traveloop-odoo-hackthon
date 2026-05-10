import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { ArrowLeft, Route, DollarSign, CheckSquare, BookOpen, Pencil } from "lucide-react";
import Image from "next/image";

const tabs = [
  { href: "", label: "Itinerary", icon: Route },
  { href: "/budget", label: "Budget", icon: DollarSign },
  { href: "/checklist", label: "Checklist", icon: CheckSquare },
  { href: "/notes", label: "Notes", icon: BookOpen },
];

export default async function TripLayout({
  children,
  modal,
  params,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
  params: Promise<{ tripId: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const { tripId } = await params;

  const trip = await db.trip.findUnique({
    where: { id: tripId },
    select: { name: true, userId: true, startDate: true, endDate: true, coverPhotoUrl: true },
  });

  if (!trip || trip.userId !== session.user.id) redirect("/trips");

  const dateStr = `${trip.startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${trip.endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

  return (
    <div className="space-y-0">
      <Link
        href="/trips"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-[rgba(240,237,230,0.45)] transition-colors hover:text-[#E8C547]"
      >
        <ArrowLeft size={15} />
        My Trips
      </Link>

      <div className="relative mb-6 overflow-hidden rounded-2xl">
        {trip.coverPhotoUrl && (
          <Image
            src={trip.coverPhotoUrl}
            alt={trip.name}
            fill
            className="object-cover opacity-30"
            sizes="(max-width: 1024px) 100vw, 50vw"
            style={{ viewTransitionName: `trip-cover-${tripId}` }}
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[rgba(8,12,16,0.95)] via-[rgba(8,12,16,0.6)] to-[rgba(8,12,16,0.3)]" />
        <div className="relative px-6 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-heading text-[clamp(1.5rem,4vw,2.5rem)] font-light text-[#F0EDE6]">
                {trip.name}
              </h1>
              <p className="mt-1 text-sm text-[rgba(240,237,230,0.5)]">{dateStr}</p>
            </div>
            <Link
              href={`/trips/${tripId}/edit`}
              className="flex items-center gap-1.5 rounded-lg bg-[rgba(255,255,255,0.08)] px-3 py-1.5 text-xs text-[#F0EDE6] backdrop-blur-sm transition-colors hover:bg-[rgba(255,255,255,0.12)]"
            >
              <Pencil size={13} />
              Edit
            </Link>
          </div>

          <nav className="mt-5 flex gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const href = `/trips/${tripId}${tab.href}`;
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.href}
                  href={href}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-[rgba(240,237,230,0.45)] transition-colors hover:bg-[rgba(255,255,255,0.08)] hover:text-[#F0EDE6]"
                >
                  <Icon size={13} />
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {children}
      {modal}
    </div>
  );
}
