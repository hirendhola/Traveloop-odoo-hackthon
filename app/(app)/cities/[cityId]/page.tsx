import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { ArrowLeft, MapPin, Star, Clock, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SaveCityButton } from "@/components/save-city-button";

const TYPE_EMOJI: Record<string, string> = {
  sightseeing: "🏛", food: "🍜", adventure: "🏔", culture: "🎭", shopping: "🛍", other: "✨",
};

const TYPE_COLORS: Record<string, string> = {
  sightseeing: "bg-blue-50 text-blue-700 border-blue-100",
  food: "bg-orange-50 text-orange-700 border-orange-100",
  adventure: "bg-green-50 text-green-700 border-green-100",
  culture: "bg-purple-50 text-purple-700 border-purple-100",
  shopping: "bg-pink-50 text-pink-700 border-pink-100",
  other: "bg-gray-50 text-gray-600 border-gray-100",
};

const ALL_TYPES = ["sightseeing", "food", "adventure", "culture", "shopping", "other"];

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

  if (!city) redirect("/cities");

  const totalActivities = await db.activity.count({ where: { cityId } });

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/cities"
        className="inline-flex items-center gap-1.5 text-sm text-[#5A6B7A] transition-colors hover:text-[#FF5733]"
      >
        <ArrowLeft size={15} />
        All Cities
      </Link>

      {/* City hero */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0D1B2A]">
        {city.coverImageUrl && (
          <img
            src={city.coverImageUrl}
            alt={city.name}
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
        )}
        <div className="relative px-6 py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-(family-name:--font-heading) text-4xl font-bold text-[#F5ECD7]">
                {city.name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[#A0AEBF]">
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {city.country} · {city.region}
                </span>
                {Number(city.popularityScore) > 0 && (
                  <span className="flex items-center gap-1">
                    <Star size={13} className="fill-[#F5ECD7] text-[#F5ECD7]" />
                    {Number(city.popularityScore)} popularity
                  </span>
                )}
              </div>
            </div>
            <div className="shrink-0">
              <SaveCityButton cityId={city.id} initialSaved={!!savedDest} />
            </div>
          </div>

          {city.description && (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#D4C9B0]">
              {city.description}
            </p>
          )}

          {/* Stats */}
          <div className="mt-5 flex flex-wrap gap-3">
            <div className="rounded-lg bg-white/10 px-3 py-2 text-sm backdrop-blur-sm">
              <span className="text-[#A0AEBF]">Cost index </span>
              <span className="font-semibold text-[#F5ECD7]">×{Number(city.costIndex)}</span>
            </div>
            <div className="rounded-lg bg-white/10 px-3 py-2 text-sm backdrop-blur-sm">
              <span className="text-[#A0AEBF]">Activities </span>
              <span className="font-semibold text-[#F5ECD7]">{totalActivities}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity type filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Link
          href={`/cities/${cityId}`}
          className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
            !type
              ? "border-[#FF5733] bg-[#FF5733] text-white"
              : "border-[#D4C9B0] text-[#5A6B7A] hover:border-[#FF5733] hover:text-[#FF5733]"
          }`}
        >
          All ({totalActivities})
        </Link>
        {ALL_TYPES.map((t) => (
          <Link
            key={t}
            href={`/cities/${cityId}?type=${t}`}
            className={`shrink-0 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
              type === t
                ? "border-[#FF5733] bg-[#FF5733] text-white"
                : "border-[#D4C9B0] text-[#5A6B7A] hover:border-[#FF5733] hover:text-[#FF5733]"
            }`}
          >
            <span>{TYPE_EMOJI[t]}</span>
            {t}
          </Link>
        ))}
      </div>

      {/* Activities grid */}
      {city.activities.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-[#D4C9B0] bg-[#F5ECD7] py-14 text-center">
          <p className="text-2xl mb-2">🎯</p>
          <p className="font-medium text-[#0D1B2A]">No activities {type ? `for "${type}"` : "yet"}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {city.activities.map((activity) => {
            const colorCls = TYPE_COLORS[activity.type] ?? TYPE_COLORS.other;
            const emoji = TYPE_EMOJI[activity.type] ?? "✨";
            return (
              <Card
                key={activity.id}
                className="overflow-hidden border-[#D4C9B0] bg-white/80 transition-shadow hover:shadow-md"
              >
                {activity.imageUrl ? (
                  <img
                    src={activity.imageUrl}
                    alt={activity.name}
                    className="h-32 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-20 items-center justify-center bg-[#F0E8D9] text-3xl">
                    {emoji}
                  </div>
                )}
                <div className="p-4">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-[#0D1B2A] leading-tight">{activity.name}</h3>
                    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${colorCls}`}>
                      {activity.type}
                    </span>
                  </div>
                  {activity.description && (
                    <p className="mb-3 text-xs leading-relaxed text-[#5A6B7A] line-clamp-2">
                      {activity.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-[#A0AEBF]">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {activity.durationMinutes >= 60
                        ? `${Math.floor(activity.durationMinutes / 60)}h${activity.durationMinutes % 60 ? ` ${activity.durationMinutes % 60}m` : ""}`
                        : `${activity.durationMinutes}m`}
                    </span>
                    <span className="flex items-center gap-0.5 font-medium text-[#7D9B76]">
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
