import type { MetadataRoute } from "next"
import { db } from "@/lib/prisma"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/login`, lastModified: new Date() },
    { url: `${baseUrl}/signup`, lastModified: new Date() },
    { url: `${baseUrl}/cities`, lastModified: new Date() },
  ]

  const cities = await db.city.findMany({ select: { id: true, createdAt: true } })
  const cityRoutes: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${baseUrl}/cities/${city.id}`,
    lastModified: city.createdAt,
  }))

  const trips = await db.trip.findMany({
    where: { isPublic: true, shareToken: { not: null } },
    select: { shareToken: true, updatedAt: true },
  })
  const tripRoutes: MetadataRoute.Sitemap = trips.map((trip) => ({
    url: `${baseUrl}/shared/${trip.shareToken}`,
    lastModified: trip.updatedAt,
  }))

  return [...staticRoutes, ...cityRoutes, ...tripRoutes]
}
