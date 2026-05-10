import Link from 'next/link'
import Image from 'next/image'
import { db } from '@/lib/prisma'
import { Compass } from 'lucide-react'

export default async function NotFound() {
  const total = await db.city.count()
  const safeTotal = Math.max(0, total - 3)
  const skip = safeTotal > 0 ? Math.floor(Math.random() * safeTotal) : 0

  const cities = await db.city.findMany({
    take: 3,
    skip,
    select: {
      id: true,
      name: true,
      country: true,
      coverImageUrl: true,
    },
  })

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#080C10]">
      {/* Background photo */}
      <Image
        src="https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1920&q=80"
        alt="Aerial clouds"
        fill
        className="object-cover"
        priority
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#080C10]/70 backdrop-blur-[2px]" />

      {/* Giant 404 behind content */}
      <span
        className="font-heading pointer-events-none absolute inset-0 flex items-center justify-center text-[20vw] font-bold text-[#E8C547]/15 select-none"
        aria-hidden="true"
      >
        404
      </span>

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        <Compass size={40} className="mb-6 text-[#E8C547]" />

        <h1 className="font-heading text-4xl font-light text-[#F0EDE6]">
          You&apos;ve gone off the map
        </h1>

        <p className="mt-4 max-w-md text-sm leading-relaxed text-[#A0AEBF]">
          This destination doesn&apos;t exist in our itinerary. Let&apos;s get you back on track.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-[#E8C547] px-6 py-2.5 text-sm font-medium text-[#080C10] transition-opacity hover:opacity-90 active:scale-[0.97]"
          >
            Back to Dashboard
          </Link>

          <Link
            href="/cities"
            className="inline-flex items-center gap-2 rounded-full border border-[#F0EDE6]/15 px-6 py-2.5 text-sm font-medium text-[#F0EDE6] transition-colors hover:bg-[#F0EDE6]/5 active:scale-[0.97]"
          >
            Browse Destinations
          </Link>
        </div>
      </div>

      {/* Bottom city suggestions */}
      {cities.length > 0 && (
        <div className="relative z-10 mt-16 w-full max-w-3xl px-4">
          <p className="mb-4 text-center text-xs text-[#5A6B7A]">
            Maybe you were looking for...
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {cities.map((city) => (
              <Link
                key={city.id}
                href={`/cities/${city.id}`}
                className="group flex items-center gap-3 rounded-xl border border-white/8 bg-white/5 p-2 pr-4 transition-colors hover:bg-white/10"
              >
                <div className="relative h-20 w-[120px] shrink-0 overflow-hidden rounded-lg bg-[#0F1419]">
                  {city.coverImageUrl ? (
                    <Image
                      src={city.coverImageUrl}
                      alt={city.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="120px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-[#0D1B2A] to-[#2A4A6F]">
                      <span className="font-heading text-2xl text-white/80">
                        {city.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-left">
                  <p className="text-sm font-medium text-[#F0EDE6]">{city.name}</p>
                  <p className="text-xs text-[#5A6B7A]">{city.country}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
