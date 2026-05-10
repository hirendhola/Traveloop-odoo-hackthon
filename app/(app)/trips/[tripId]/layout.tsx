import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { ArrowLeft, Route, DollarSign, CheckSquare, BookOpen, Pencil } from "lucide-react";

const tabs = [
  { href: "", label: "Itinerary", icon: Route },
  { href: "/budget", label: "Budget", icon: DollarSign },
  { href: "/checklist", label: "Checklist", icon: CheckSquare },
  { href: "/notes", label: "Notes", icon: BookOpen },
];

export default async function TripLayout({
  children,
  params,
}: {
  children: React.ReactNode;
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
      {/* Back link */}
      <Link
        href="/trips"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-[#5A6B7A] transition-colors hover:text-[#FF5733]"
      >
        <ArrowLeft size={15} />
        My Trips
      </Link>

      {/* Trip Header */}
      <div className="relative mb-6 overflow-hidden rounded-2xl bg-[#0D1B2A]">
        {trip.coverPhotoUrl && (
          <img
            src={trip.coverPhotoUrl}
            alt={trip.name}
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
        )}
        <div className="relative px-6 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-(family-name:--font-heading) text-2xl font-bold text-[#F5ECD7] sm:text-3xl">
                {trip.name}
              </h1>
              <p className="mt-1 text-sm text-[#A0AEBF]">{dateStr}</p>
            </div>
            <Link
              href={`/trips/${tripId}/edit`}
              className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-[#F5ECD7] backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <Pencil size={13} />
              Edit
            </Link>
          </div>

          {/* Tabs */}
          <nav className="mt-5 flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const href = `/trips/${tripId}${tab.href}`;
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.href}
                  href={href}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-[#A0AEBF] transition-colors hover:bg-white/10 hover:text-[#F5ECD7]"
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
    </div>
  );
}
