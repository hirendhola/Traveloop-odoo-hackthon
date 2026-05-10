import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronDown, MapPin, Calendar, DollarSign, Users } from "lucide-react"
import { db } from "@/lib/prisma"

const FEATURES = [
  {
    title: "Itinerary Builder",
    description:
      "Drag, drop, and organize your stops across multiple cities. Visualize your entire journey on a beautiful timeline with real-time duration and transit estimates.",
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
    reverse: false,
  },
  {
    title: "Budget Tracking",
    description:
      "Set a total budget and watch your spending in real time. Categorize every expense — stays, meals, transport, activities — with elegant charts that keep you on track.",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",
    reverse: true,
  },
  {
    title: "Share with Friends",
    description:
      "Generate a public link for any trip and share it instantly. Friends can view your full itinerary, cover photo and all — no account required.",
    image:
      "https://images.unsplash.com/photo-1522202176988-95273b5f2a5?w=800&q=80",
    reverse: false,
  },
]

const DESTINATIONS = [
  { name: "Paris", country: "France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80" },
  { name: "Tokyo", country: "Japan", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80" },
  { name: "New York", country: "USA", image: "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=600&q=80" },
  { name: "Santorini", country: "Greece", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80" },
  { name: "Bali", country: "Indonesia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80" },
  { name: "Zurich", country: "Switzerland", image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=600&q=80" },
  { name: "Maldives", country: "Indian Ocean", image: "https://images.unsplash.com/photo-1514282401047-79ef09a8c325?w=600&q=80" },
  { name: "Barcelona", country: "Spain", image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&q=80" },
]

export const metadata = {
  title: "Traveloop — Intelligent Travel Planning",
  description:
    "Build beautiful multi-city itineraries in minutes — with everything from budget tracking to packing lists, beautifully organized.",
}

export default async function LandingPage() {
  const cityCount = await db.city.count()

  return (
    <div className="relative bg-[#080C10]">
      {/* ── HERO ── */}
      <section className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden">
        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
          alt="Swiss Alps"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-[rgba(8,12,16,0.3)] via-[rgba(8,12,16,0.5)] to-[rgba(8,12,16,0.85)]" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.25em] text-[#E8C547]">
            Intelligent Travel Planning
          </p>
          <h1
            className="mx-auto max-w-3xl font-heading text-[clamp(2.5rem,8vw,6rem)] font-light leading-[1.05] text-[#F0EDE6]"
          >
            Dream it. Plan it. Live it.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[rgba(240,237,230,0.65)]">
            Build beautiful multi-city itineraries in minutes — with everything
            from budget tracking to packing lists, beautifully organized.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <Button className="h-12 rounded-full bg-[#E8C547] px-8 text-sm font-semibold text-[#080C10] transition-all hover:bg-[#d4b33f] hover:shadow-lg hover:shadow-[#E8C547]/20">
                Start Planning Free
              </Button>
            </Link>
            <Link href="/trips">
              <Button
                variant="outline"
                className="h-12 rounded-full border-[rgba(255,255,255,0.25)] px-8 text-sm font-medium text-[#F0EDE6] transition-all hover:bg-[rgba(255,255,255,0.08)] hover:text-white"
              >
                See a demo trip →
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats strip */}
        <div className="absolute bottom-8 left-1/2 z-10 w-[calc(100%-3rem)] max-w-2xl -translate-x-1/2">
          <div className="flex items-center justify-around rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-6 py-4 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-[#E8C547]" />
              <span className="text-sm text-[#F0EDE6]">
                <span className="font-(family-name:--font-dm-mono) font-medium">1,200</span>{" "}
                trips planned
              </span>
            </div>
            <div className="h-4 w-px bg-[rgba(255,255,255,0.12)]" />
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-[#E8C547]" />
              <span className="text-sm text-[#F0EDE6]">
                <span className="font-(family-name:--font-dm-mono) font-medium">{cityCount || 60}</span>{" "}
                cities
              </span>
            </div>
            <div className="h-4 w-px bg-[rgba(255,255,255,0.12)]" />
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-[#E8C547]" />
              <span className="text-sm text-[#F0EDE6]">
                <span className="font-(family-name:--font-dm-mono) font-medium">12,000</span>{" "}
                activities
              </span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2">
          <ChevronDown
            size={24}
            className="animate-bounce-gentle text-[rgba(240,237,230,0.4)]"
          />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl space-y-24">
          {FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              className={`flex flex-col items-center gap-12 ${
                feature.reverse ? "md:flex-row-reverse" : "md:flex-row"
              }`}
            >
              <div className="flex-1">
                <div className="overflow-hidden rounded-2xl ring-1 ring-[rgba(255,255,255,0.1)]">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={800}
                    height={500}
                    className="h-auto w-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1 space-y-5">
                <h2 className="font-heading text-3xl font-light text-[#F0EDE6] md:text-4xl">
                  {feature.title}
                </h2>
                <p className="leading-relaxed text-[rgba(240,237,230,0.6)]">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DESTINATIONS ── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center font-heading text-3xl font-light text-[#F0EDE6] md:text-4xl">
            Explore the World
          </h2>
          <div className="scrollbar-hide -mx-6 flex gap-5 overflow-x-auto px-6 pb-4">
            {DESTINATIONS.map((dest) => (
              <Link
                key={dest.name}
                href={`/cities?search=${encodeURIComponent(dest.name)}`}
                className="group relative block w-[280px] shrink-0 overflow-hidden rounded-2xl"
              >
                <div className="relative h-[380px]">
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="280px"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[rgba(8,12,16,0.9)] via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-[#E8C547]">
                      {dest.country}
                    </p>
                    <h3 className="mt-1 font-heading text-2xl font-light text-white">
                      {dest.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden px-6 py-32">
        <Image
          src="https://images.unsplash.com/photo-1613395877344-13d4c79e4284?w=1920&q=80"
          alt="Santorini sunset"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[rgba(8,12,16,0.65)] backdrop-blur-sm" />
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-light text-[#F0EDE6]">
            Ready to go?
          </h2>
          <p className="mt-4 text-[rgba(240,237,230,0.6)]">
            Your next adventure is waiting. Start building your itinerary today.
          </p>
          <Link href="/signup" className="mt-8 inline-block">
            <Button className="h-12 rounded-full bg-[#E8C547] px-8 text-sm font-semibold text-[#080C10] transition-all hover:bg-[#d4b33f] hover:shadow-lg hover:shadow-[#E8C547]/20">
              Start Planning Free
            </Button>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[rgba(255,255,255,0.06)] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 sm:grid-cols-3">
            <div>
              <h4 className="font-heading text-xl text-[#F0EDE6]">
                Traveloop
              </h4>
              <p className="mt-3 text-sm leading-relaxed text-[rgba(240,237,230,0.45)]">
                Intelligent travel planning for the modern explorer.
              </p>
            </div>
            <div>
              <h5 className="text-xs font-semibold uppercase tracking-wider text-[rgba(240,237,230,0.4)]">
                Explore
              </h5>
              <ul className="mt-4 space-y-2 text-sm text-[rgba(240,237,230,0.55)]">
                <li>
                  <Link href="/cities" className="hover:text-[#F0EDE6]">
                    Cities
                  </Link>
                </li>
                <li>
                  <Link href="/trips" className="hover:text-[#F0EDE6]">
                    Trips
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-[#F0EDE6]">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-xs font-semibold uppercase tracking-wider text-[rgba(240,237,230,0.4)]">
                Account
              </h5>
              <ul className="mt-4 space-y-2 text-sm text-[rgba(240,237,230,0.55)]">
                <li>
                  <Link href="/login" className="hover:text-[#F0EDE6]">
                    Log In
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-[#F0EDE6]">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="hover:text-[#F0EDE6]">
                    Profile
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-[rgba(255,255,255,0.06)] pt-8 text-center text-xs text-[rgba(240,237,230,0.3)]">
            © {new Date().getFullYear()} Traveloop. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
