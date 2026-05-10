'use client'

import Link from 'next/link'
import { MapPin, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="flex max-w-md flex-col items-center rounded-2xl border border-white/8 bg-[#0F1419] p-8 text-center shadow-xl">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#E8C547]/10">
          <MapPin size={28} className="text-[#E8C547]" />
        </div>

        <h1 className="font-heading text-2xl font-semibold text-[#F0EDE6]">
          Something went wrong exploring this destination
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-[#A0AEBF]">
          We&apos;re having trouble loading this destination. Please try again.
        </p>

        {error.digest && (
          <p className="mt-2 text-xs text-[#5A6B7A]">Error ID: {error.digest}</p>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-[#E8C547] px-6 py-2.5 text-sm font-medium text-[#080C10] transition-opacity hover:opacity-90 active:scale-[0.97]"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#F0EDE6]/15 px-6 py-2.5 text-sm font-medium text-[#F0EDE6] transition-colors hover:bg-[#F0EDE6]/5 active:scale-[0.97]"
          >
            <Home size={16} />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
