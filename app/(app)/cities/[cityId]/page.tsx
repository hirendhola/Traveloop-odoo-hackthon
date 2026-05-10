import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { ArrowLeft, MapPin, Star, Clock, DollarSign, Landmark, Utensils, Mountain, Palette, ShoppingBag, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SaveCityButton } from "@/components/save-city-button";
import Image from "next/image";

const TYPE_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  sightseeing: Landmark,
  food: Utensils,
  adventure: Mountain,
  culture: Palette,
  shopping: ShoppingBag,
  other: Sparkles,
};

const ALL_TYPES = ["sightseeing", "food", "adventure", "culture", "shopping", "other"];

export async function generateStaticParams() {
  try {
    const cities = await db.city.findMany({ select: { id: true } });
    return cities.map((c) => ({ cityId: c.id }));
  } catch {
    return [];
  }
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cityId: string }>;
}) {
  const { cityId } = await params;
  const city = await db.city.findUnique({ where: { id: cityId } });
  return {
    title: city?.name ?? "City",
    description: city ? `${city.name}, ${city.country} — explore activities and plan your trip.` : "Explore this city on Traveloop.",
  };
}

export default async function CityDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ cityId: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const { cityId } = await params;
  const { type } = await searchParams;

  const [city, savedDest] = await Promise.all([
    db.city.findUnique({
      where: { id: cityId },
      include: {
        activities: {
          orderBy: { name: "asc" },
          ...(type ? { where: { type: type as any } } : {}),
        },
      },
    }),
    db.savedDestination.findUnique({
      where: { userId_cityId: { userId: session.user.id, cityId } },
    }),
  ]);

  if (!city) notFound();

  const totalActivities = await db.activity.count({ where: { cityId } });

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/cities"
        className="inline-flex items-center gap-1.5 text-sm text-[rgba(240,237,230,0.45)] transition-colors hover:text-[#E8C547]"
      >
        <ArrowLeft size={15} />
        All Cities
      </Link>

      {/* City hero */}
      <div className="relative overflow-hidden rounded-2xl">
        {city.coverImageUrl && (
          <Image
            src={city.coverImageUrl}
            alt={city.name}
            fill
            className="object-cover opacity-40"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[rgba(8,12,16,0.95)] via-[rgba(8,12,16,0.5)] to-[rgba(8,12,16,0.3)]" />
        <div className="relative px-6 py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-light text-[#F0EDE6]">
                {city.name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[rgba(240,237,230,0.55)]">
                <span className="flex items-center gap-1">
                  <MapPin size={14} className="text-[#E8C547]" />
                  {city.country} · {city.region}
                </span>
                {Number(city.popularityScore) > 0 && (
                  <span className="flex items-center gap-1">
                    <Star size={13} className="fill-[#E8C547] text-[#E8C547]" />
                    {Number(city.popularityScore)}
                  </span>
                )}
              </div>
            </div>
            <div className="shrink-0">
              <SaveCityButton cityId={city.id} initialSaved={!!savedDest} />
            </div>
          </div>

          {city.description && (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[rgba(240,237,230,0.55)]">
              {city.description}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <div className="rounded-lg bg-[rgba(255,255,255,0.06)] px-3 py-2 text-sm backdrop-blur-sm">
              <span className="text-[rgba(240,237,230,0.45)]">Cost index </span>
              <span className="font-medium text-[#F0EDE6]">×{Number(city.costIndex)}</span>
            </div>
            <div className="rounded-lg bg-[rgba(255,255,255,0.06)] px-3 py-2 text-sm backdrop-blur-sm">
              <span className="text-[rgba(240,237,230,0.45)]">Activities </span>
              <span className="font-medium text-[#F0EDE6]">{totalActivities}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity type filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <Link
          href={`/cities/${cityId}`}
          className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
            !type
              ? "border-[#E8C547] bg-[rgba(232,197,71,0.12)] text-[#E8C547]"
              : "border-[rgba(255,255,255,0.08)] text-[rgba(240,237,230,0.45)] hover:border-[#E8C547] hover:text-[#E8C547]"
          }`}
        >
          All ({totalActivities})
        </Link>
        {ALL_TYPES.map((t) => {
          const IconComp = TYPE_ICONS[t] ?? Sparkles;
          return (
            <Link
              key={t}
              href={`/cities/${cityId}?type=${t}`}
              className={`shrink-0 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                type === t
                  ? "border-[#E8C547] bg-[rgba(232,197,71,0.12)] text-[#E8C547]"
                  : "border-[rgba(255,255,255,0.08)] text-[rgba(240,237,230,0.45)] hover:border-[#E8C547] hover:text-[#E8C547]"
              }`}
            >
              <IconComp size={12} />
              {t}
            </Link>
          );
        })}
      </div>

      {/* Activities grid */}
      {city.activities.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] py-14 text-center">
          <Sparkles size={32} className="mb-2 text-[rgba(240,237,230,0.2)]" />
          <p className="font-medium text-[#F0EDE6]">No activities {type ? `for "${type}"` : "yet"}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {city.activities.map((activity) => {
            const IconComp = TYPE_ICONS[activity.type] ?? Sparkles;
            return (
              <Card
                key={activity.id}
                className="overflow-hidden border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] transition-all card-hover"
              >
                {activity.imageUrl ? (
                  <div className="relative h-32">
                    <Image
                      src={activity.imageUrl}
                      alt={activity.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="flex h-20 items-center justify-center bg-[#0F1419]">
                    <IconComp size={24} className="text-[#E8C547]" />
                  </div>
                )}
                <div className="p-4">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="font-medium text-[#F0EDE6] leading-tight">{activity.name}</h3>
                    <span className="shrink-0 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-2 py-0.5 text-[10px] font-medium capitalize text-[rgba(240,237,230,0.55)]">
                      {activity.type}
                    </span>
                  </div>
                  {activity.description && (
                    <p className="mb-3 text-xs leading-relaxed text-[rgba(240,237,230,0.4)] line-clamp-2">
                      {activity.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-[rgba(240,237,230,0.4)]">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {activity.durationMinutes >= 60
                        ? `${Math.floor(activity.durationMinutes / 60)}h${activity.durationMinutes % 60 ? ` ${activity.durationMinutes % 60}m` : ""}`
                        : `${activity.durationMinutes}m`}
                    </span>
                    <span className="flex items-center gap-0.5 font-medium text-[#E8C547]">
                      <DollarSign size={11} />
                      {Number(activity.estimatedCost) === 0
                        ? "Free"
                        : Number(activity.estimatedCost).toLocaleString()}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
