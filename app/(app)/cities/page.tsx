import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { MapPin, Star } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { CitySearchBox } from "@/components/city-search-box";
import { CitiesPagination } from "@/components/cities-pagination";
import { SaveCityButton } from "@/components/save-city-button";
import Image from "next/image";

export const metadata = {
  title: "Explore Cities",
};

const PAGE_SIZE = 24;

const SORT_MAP: Record<string, Prisma.CityOrderByWithRelationInput> = {
  popular: { popularityScore: "desc" },
  name: { name: "asc" },
  "cost-low": { costIndex: "asc" },
  "cost-high": { costIndex: "desc" },
};

export default async function CitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; region?: string; sort?: string; page?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const { search, region, sort, page: pageParam } = await searchParams;

  const where: Prisma.CityWhereInput = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { country: { contains: search, mode: "insensitive" } },
    ];
  }
  if (region) {
    where.region = { contains: region, mode: "insensitive" };
  }

  const orderBy = SORT_MAP[sort ?? "popular"] ?? SORT_MAP.popular;

  // Parse current page (default 1, clamp to >= 1)
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const [total, cities, saved] = await Promise.all([
    db.city.count({ where }),
    db.city.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.savedDestination.findMany({
      where: { userId: session.user.id },
      select: { cityId: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const savedSet = new Set(saved.map((s) => s.cityId));

  const startIdx = total === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endIdx = Math.min(safePage * PAGE_SIZE, total);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-[clamp(1.75rem,4vw,2.5rem)] font-light text-[#F0EDE6]">
          Explore Cities
        </h1>
        <p className="mt-1 text-sm text-[rgba(240,237,230,0.45)]">
          Discover destinations and save them to your travel wishlist
        </p>
      </div>

      <CitySearchBox
        initialSearch={search ?? ""}
        initialRegion={region ?? ""}
        initialSort={sort ?? "popular"}
      />

      {total === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] py-20 text-center">
          <MapPin size={40} className="mb-3 text-[rgba(240,237,230,0.2)]" />
          <p className="font-medium text-[#F0EDE6]">No cities found</p>
          <p className="mt-1 text-sm text-[rgba(240,237,230,0.45)]">Try a different search or region</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-[rgba(240,237,230,0.45)]">
            Showing {startIdx}–{endIdx} of {total.toLocaleString()} {total === 1 ? "city" : "cities"}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cities.map((city) => (
              <Card
                key={city.id}
                className="group overflow-hidden border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] transition-all card-hover"
              >
                <Link href={`/cities/${city.id}`}>
                  <div className="relative h-70 overflow-hidden">
                    {city.coverImageUrl ? (
                      <Image
                        src={city.coverImageUrl}
                        alt={city.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[#0F1419]">
                        <span className="font-heading text-6xl text-[#E8C547]">
                          {city.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-[rgba(8,12,16,0.9)] via-[rgba(8,12,16,0.2)] to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-heading text-2xl font-light text-white">
                        {city.name}
                      </h3>
                      <p className="mt-1 text-xs text-[rgba(255,255,255,0.65)]">{city.country}</p>
                    </div>
                    {Number(city.popularityScore) > 0 && (
                      <div className="absolute right-3 top-3 flex items-center gap-0.5 rounded-full bg-[rgba(8,12,16,0.7)] px-2 py-0.5 text-[10px] font-medium text-[#F0EDE6] backdrop-blur-md">
                        <Star size={10} className="fill-[#E8C547] text-[#E8C547]" />
                        {Number(city.popularityScore)}
                      </div>
                    )}
                    <div className="absolute left-3 top-3 rounded-full bg-[rgba(8,12,16,0.7)] px-2 py-0.5 text-[10px] font-medium text-[#F0EDE6] backdrop-blur-md">
                      ×{Number(city.costIndex)}
                    </div>
                  </div>
                </Link>

                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[rgba(240,237,230,0.45)]">
                    <span className="flex items-center gap-1">
                      <MapPin size={11} />
                      {city.region}
                    </span>
                  </div>
                  <SaveCityButton cityId={city.id} initialSaved={savedSet.has(city.id)} />
                </div>
              </Card>
            ))}
          </div>

          <CitiesPagination
            currentPage={safePage}
            totalPages={totalPages}
            baseQuery={{ search, region, sort: sort && sort !== "popular" ? sort : undefined }}
          />
        </>
      )}
    </div>
  );
}
