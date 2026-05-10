import { Skeleton } from "@/components/ui/skeleton";

export default function PublicItinerarySkeleton() {
  return (
    <div className="space-y-6">
      {/* Branding header */}
      <div className="border-b border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-6 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full bg-[rgba(255,255,255,0.06)]" />
            <Skeleton className="h-5 w-24 bg-[rgba(255,255,255,0.08)]" />
          </div>
          <Skeleton className="h-7 w-32 rounded-full bg-[rgba(255,255,255,0.08)]" />
        </div>
      </div>

      {/* Banner skeleton */}
      <div className="relative overflow-hidden rounded-2xl bg-[rgba(255,255,255,0.04)] px-6 py-8">
        <Skeleton className="mb-2 h-3 w-28 bg-[rgba(255,255,255,0.06)]" />
        <Skeleton className="h-10 w-64 bg-[rgba(255,255,255,0.08)]" />
        <Skeleton className="mt-2 h-4 w-48 bg-[rgba(255,255,255,0.06)]" />
        <div className="mt-5 flex flex-wrap gap-3">
          <Skeleton className="h-7 w-20 rounded-lg bg-[rgba(255,255,255,0.06)]" />
          <Skeleton className="h-7 w-20 rounded-lg bg-[rgba(255,255,255,0.06)]" />
          <Skeleton className="h-7 w-24 rounded-lg bg-[rgba(255,255,255,0.06)]" />
        </div>
      </div>

      {/* Timeline with 3 stops */}
      <div className="relative">
        <div className="absolute left-2.25 top-2 bottom-10 w-0.5 bg-[rgba(232,197,71,0.2)]" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="relative flex gap-5">
              <div className="relative z-10 mt-1 flex h-5 w-5 shrink-0 items-center justify-center">
                <Skeleton className="h-5 w-5 rounded-full bg-[rgba(232,197,71,0.2)]" />
              </div>
              <div className="mb-8 flex-1 overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)]">
                <div className="space-y-2 bg-[rgba(255,255,255,0.03)] px-5 py-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <Skeleton className="h-5 w-32 bg-[rgba(255,255,255,0.08)]" />
                      <Skeleton className="h-3 w-24 bg-[rgba(255,255,255,0.06)]" />
                    </div>
                    <div className="space-y-1 text-right">
                      <Skeleton className="h-4 w-28 bg-[rgba(255,255,255,0.08)]" />
                      <Skeleton className="ml-auto h-3 w-16 bg-[rgba(255,255,255,0.06)]" />
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-[rgba(255,255,255,0.06)]">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="flex items-center gap-3 px-5 py-3">
                      <Skeleton className="h-5 w-5 rounded-full bg-[rgba(255,255,255,0.06)]" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-3/4 bg-[rgba(255,255,255,0.06)]" />
                      </div>
                      <Skeleton className="h-5 w-16 rounded-full bg-[rgba(255,255,255,0.06)]" />
                      <Skeleton className="h-3 w-12 bg-[rgba(255,255,255,0.06)]" />
                      <Skeleton className="h-3 w-10 bg-[rgba(255,255,255,0.06)]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky info card */}
      <div className="sticky bottom-4 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4 shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <Skeleton className="h-4 w-32 bg-[rgba(255,255,255,0.08)]" />
            <Skeleton className="h-3 w-24 bg-[rgba(255,255,255,0.06)]" />
          </div>
          <Skeleton className="h-9 w-36 rounded-full bg-[rgba(255,255,255,0.08)]" />
        </div>
      </div>
    </div>
  );
}
