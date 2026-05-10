import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { MapPin, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CitySearchBox } from "@/components/city-search-box";
import { SaveCityButton } from "@/components/save-city-button";

const CITY_GRADIENTS = [
  "from-[#FF5733] to-[#FF8A6C]",
  "from-[#7D9B76] to-[#A3C9A8]",
  "from-[#0D1B2A] to-[#2A4A6F]",
  "from-[#E8A87C] to-[#C38D7A]",
  "from-[#85C1E2] to-[#5DADE2]",
  "from-[#BB8FCE] to-[#9B59B6]",
  "from-[#F7DC6F] to-[#F4D03F]",
  "from-[#58D68D] to-[#2ECC71]",
];

function cityGradient(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return CITY_GRADIENTS[Math.abs(hash) % CITY_GRADIENTS.length];
}

export default async function CitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; region?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const { search, region } = await searchParams;

  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { country: { contains: search, mode: "insensitive" } },
    ];
  }
  if (region) {
    where.region = { contains: region, mode: "insensitive" };
  }

  const [cities, saved] = await Promise.all([
    db.city.findMany({
      where,
      orderBy: { popularityScore: "desc" },
      take: 48,
    }),
    db.savedDestination.findMany({
      where: { userId: session.user.id },
      select: { cityId: true },
    }),
  ]);

  const savedSet = new Set(saved.map((s) => s.cityId));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-(family-name:--font-heading) text-3xl font-bold text-[#0D1B2A]">
          Explore Cities
        </h1>
        <p className="mt-1 text-sm text-[#5A6B7A]">
          Discover destinations and save them to your travel wishlist
        </p>
      </div>

      <CitySearchBox initialSearch={search ?? ""} initialRegion={region ?? ""} />

      {cities.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-[#D4C9B0] bg-[#F5ECD7] py-20 text-center">
          <MapPin size={40} className="mb-3 text-[#D4C9B0]" />
          <p className="font-medium text-[#0D1B2A]">No cities found</p>
          <p className="mt-1 text-sm text-[#5A6B7A]">Try a different search or region</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-[#A0AEBF]">{cities.length} {cities.length === 1 ? "city" : "cities"} found</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((city) => {
              const gradient = cityGradient(city.name);
              return (
                <Card
                  key={city.id}
                  className="group overflow-hidden border-[#D4C9B0] bg-white/80 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <Link href={`/cities/${city.id}`}>
                    <div className={`relative h-40 bg-linear-to-br ${gradient}`}>
                      {city.coverImageUrl ? (
                        <img
                          src={city.coverImageUrl}
                          alt={city.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-1">
                          <span className="font-(family-name:--font-heading) text-5xl text-white/90">
                            {city.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <h3 className="font-semibold text-white drop-shadow-sm">{city.name}</h3>
                        <p className="text-xs text-white/80">{city.country}</p>
                      </div>
                      {Number(city.popularityScore) > 0 && (
                        <div className="absolute right-3 top-3 flex items-center gap-0.5 rounded-full bg-white/20 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
                          <Star size={10} className="fill-white" />
                          {Number(city.popularityScore)}
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#5A6B7A]">
                      <span className="flex items-center gap-1">
                        <MapPin size={11} />
                        {city.region}
                      </span>
                      <span className="rounded-full bg-[#EDE4CF] px-2 py-0.5 text-[#5A6B7A]">
                        Cost ×{Number(city.costIndex)}
                      </span>
                    </div>
                    <SaveCityButton cityId={city.id} initialSaved={savedSet.has(city.id)} />
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
