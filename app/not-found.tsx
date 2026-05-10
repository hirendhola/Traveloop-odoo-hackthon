import Link from 'next/link'
import Image from 'next/image'
import { db } from '@/lib/prisma'

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
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#040608]">

      {/* ── Background photograph ──────────────────────────────────── */}
      <Image
        src="https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1920&q=80"
        alt="Aerial mountain view"
        fill
        className="object-cover scale-[1.04]"
        priority
      />

      {/* ── Layered gradient vignette ──────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#040608]/50 via-[#040608]/55 to-[#040608]/98" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#040608]/60 via-transparent to-[#040608]/60" />
      <div className="absolute inset-0 bg-radial-[at_50%_40%] from-transparent via-transparent to-[#040608]/40" />

      {/* ── Ambient glow orbs ─────────────────────────────────────── */}
      <div
        className="animate-pulse-orb pointer-events-none absolute -top-32 -left-32 h-[640px] w-[640px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(232,197,71,0.07) 0%, transparent 70%)' }}
      />
      <div
        className="animate-drift pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(196,168,130,0.06) 0%, transparent 70%)' }}
      />

      {/* ── Cartographic grid overlay ─────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(232,197,71,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,197,71,1) 1px, transparent 1px)
          `,
          backgroundSize: '90px 90px',
        }}
      />

      {/* ── Subtle latitude / longitude lines ─────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[22, 45, 68].map((pct) => (
          <div
            key={`h-${pct}`}
            className="absolute left-0 right-0 h-px"
            style={{ top: `${pct}%`, background: 'linear-gradient(90deg, transparent, rgba(232,197,71,0.06) 30%, rgba(232,197,71,0.06) 70%, transparent)' }}
          />
        ))}
        {[18, 50, 82].map((pct) => (
          <div
            key={`v-${pct}`}
            className="absolute top-0 bottom-0 w-px"
            style={{ left: `${pct}%`, background: 'linear-gradient(180deg, transparent, rgba(232,197,71,0.06) 30%, rgba(232,197,71,0.06) 70%, transparent)' }}
          />
        ))}
      </div>

      {/* ── Floating coordinate labels ─────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 select-none overflow-hidden">
        <span
          className="animate-fade-in-slow absolute top-[14%] left-[6%] font-mono text-[10px] tracking-[0.22em] text-[#E8C547]/25"
          style={{ animationDelay: '0.6s' }}
        >
          22°54′S 43°10′W
        </span>
        <span
          className="animate-fade-in-slow absolute top-[28%] right-[8%] font-mono text-[10px] tracking-[0.22em] text-[#E8C547]/25"
          style={{ animationDelay: '1.1s' }}
        >
          48°51′N 2°21′E
        </span>
        <span
          className="animate-fade-in-slow absolute bottom-[32%] left-[10%] font-mono text-[10px] tracking-[0.22em] text-[#E8C547]/25"
          style={{ animationDelay: '1.6s' }}
        >
          35°41′N 139°41′E
        </span>
        <span
          className="animate-fade-in-slow absolute bottom-[22%] right-[11%] font-mono text-[10px] tracking-[0.22em] text-[#E8C547]/25"
          style={{ animationDelay: '2.0s' }}
        >
          51°30′N 0°7′W
        </span>
        <span
          className="animate-fade-in-slow absolute top-[58%] left-[4%] font-mono text-[9px] tracking-[0.18em] text-[#C4A882]/15"
          style={{ animationDelay: '2.4s' }}
        >
          40°26′N 79°58′W
        </span>
      </div>

      {/* ── Ghost 404 typography behind content ───────────────────── */}
      <span
        aria-hidden="true"
        className="font-heading pointer-events-none absolute inset-0 flex items-center justify-center select-none"
        style={{
          fontSize: 'clamp(180px, 28vw, 420px)',
          fontWeight: 700,
          letterSpacing: '-0.06em',
          lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: '1.5px rgba(232,197,71,0.065)',
        }}
      >
        404
      </span>

      {/* ── Main foreground content ────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">

        {/* Animated compass rose */}
        <div className="relative mb-10" style={{ width: 80, height: 80 }}>
          {/* Outer ring — slow spin */}
          <div className="animate-spin-slow absolute inset-0">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="38" stroke="#E8C547" strokeOpacity="0.18" strokeWidth="0.75" strokeDasharray="4 6" />
            </svg>
          </div>
          {/* Inner ring — reverse spin */}
          <div className="animate-spin-slow-reverse absolute inset-0" style={{ inset: 10 }}>
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="28" stroke="#E8C547" strokeOpacity="0.12" strokeWidth="0.5" strokeDasharray="2 8" />
            </svg>
          </div>
          {/* Static compass body */}
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            className="absolute inset-0"
          >
            {/* Cardinal tick marks */}
            <path d="M40 4V10M40 70V76M4 40H10M70 40H76" stroke="#E8C547" strokeOpacity="0.45" strokeWidth="1.5" strokeLinecap="round" />
            {/* N needle */}
            <path d="M40 12L43.5 38H36.5L40 12Z" fill="#E8C547" />
            {/* S needle */}
            <path d="M40 68L43.5 42H36.5L40 68Z" fill="#E8C547" fillOpacity="0.28" />
            {/* E needle */}
            <path d="M68 40L42 43.5V36.5L68 40Z" fill="#E8C547" fillOpacity="0.28" />
            {/* W needle */}
            <path d="M12 40L38 43.5V36.5L12 40Z" fill="#E8C547" fillOpacity="0.28" />
            {/* Center jewel */}
            <circle cx="40" cy="40" r="4" fill="#E8C547" />
            <circle cx="40" cy="40" r="2" fill="#040608" />
          </svg>
        </div>

        {/* Eyebrow */}
        <p
          className="animate-fade-up mb-5 font-mono text-[11px] tracking-[0.35em] uppercase text-[#E8C547]/55"
          style={{ animationDelay: '0.05s' }}
        >
          Error 404 — Destination Unknown
        </p>

        {/* Heading */}
        <h1
          className="animate-fade-up font-heading font-light leading-[0.88] tracking-[-0.02em] text-[#F0EDE6]"
          style={{
            fontSize: 'clamp(52px, 8vw, 104px)',
            animationDelay: '0.15s',
          }}
        >
          You&apos;ve Gone<br />
          <em className="text-[#E8C547] not-italic">Off the Map</em>
        </h1>

        {/* Ornamental divider */}
        <div
          className="animate-fade-up mt-9 mb-7 flex items-center gap-3"
          style={{ animationDelay: '0.25s' }}
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#E8C547]/35" />
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="1.5" fill="#E8C547" fillOpacity="0.55" />
            <circle cx="6" cy="6" r="4" stroke="#E8C547" strokeOpacity="0.2" strokeWidth="0.75" />
          </svg>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#E8C547]/35" />
        </div>

        {/* Sub-copy */}
        <p
          className="animate-fade-up max-w-[360px] text-[15px] leading-relaxed text-[#A0AEBF]/75"
          style={{ animationDelay: '0.3s' }}
        >
          This destination doesn&apos;t exist in our itinerary.<br className="hidden sm:block" />
          Let&apos;s chart a new course together.
        </p>

        {/* CTA buttons */}
        <div
          className="animate-fade-up mt-11 flex flex-wrap items-center justify-center gap-4"
          style={{ animationDelay: '0.42s' }}
        >
          <Link
            href="/dashboard"
            className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-[#E8C547] px-8 py-3.5 text-[13px] font-semibold text-[#080C10] transition-all duration-300 hover:shadow-[0_0_36px_rgba(232,197,71,0.45)] active:scale-[0.97]"
          >
            <span>Back to Dashboard</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          <Link
            href="/cities"
            className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.13] px-8 py-3.5 text-[13px] font-medium text-[#F0EDE6]/75 backdrop-blur-md transition-all duration-300 hover:border-[#E8C547]/30 hover:text-[#F0EDE6] hover:bg-white/[0.06] active:scale-[0.97]"
          >
            Browse Destinations
          </Link>
        </div>
      </div>

      {/* ── Suggested city cards ───────────────────────────────────── */}
      {cities.length > 0 && (
        <div
          className="animate-fade-up relative z-10 mt-20 w-full max-w-2xl px-6"
          style={{ animationDelay: '0.58s' }}
        >
          {/* Section label */}
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#E8C547]/18" />
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#5A6B7A]">
              Suggested Destinations
            </p>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#E8C547]/18" />
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {cities.map((city, i) => (
              <Link
                key={city.id}
                href={`/cities/${city.id}`}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm transition-all duration-500 hover:border-[#E8C547]/22 hover:bg-white/[0.07] hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
              >
                {/* Image area */}
                <div className="relative h-40 w-full overflow-hidden">
                  {city.coverImageUrl ? (
                    <Image
                      src={city.coverImageUrl}
                      alt={city.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0D1B2A] to-[#1A3A5C]">
                      <span className="font-heading text-5xl font-light text-white/20">
                        {city.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#040608]/70 via-transparent to-transparent" />
                  {/* Index badge */}
                  <span className="absolute top-3 right-3 font-mono text-[9px] tracking-[0.2em] text-white/25">
                    0{i + 1}
                  </span>
                </div>

                {/* Text area */}
                <div className="flex items-end justify-between p-4">
                  <div>
                    <p className="font-heading text-[19px] font-light leading-tight text-[#F0EDE6]">
                      {city.name}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] tracking-[0.2em] uppercase text-[#5A6B7A]">
                      {city.country}
                    </p>
                  </div>
                  {/* Arrow */}
                  <div className="translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="#E8C547" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                {/* Bottom gold accent line on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-[#E8C547]/50 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
