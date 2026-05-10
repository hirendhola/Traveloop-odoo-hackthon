import { Skeleton } from "@/components/ui/skeleton";

export default function CitySearchSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-40 bg-[rgba(255,255,255,0.08)]" />
        <Skeleton className="h-4 w-64 bg-[rgba(255,255,255,0.06)]" />
      </div>

      {/* Search bar skeleton */}
      <Skeleton className="h-10 w-full bg-[rgba(255,255,255,0.06)]" />

      {/* Filter row */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-16 rounded-full bg-[rgba(255,255,255,0.06)]" />
        ))}
      </div>

      {/* Results count */}
      <Skeleton className="h-3 w-24 bg-[rgba(255,255,255,0.06)]" />

      {/* Grid of city cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)]"
          >
            <Skeleton className="h-40 w-full bg-[rgba(255,255,255,0.06)]" />
            <div className="flex items-center justify-between px-4 py-3">
              <div className="space-y-1">
                <Skeleton className="h-4 w-20 bg-[rgba(255,255,255,0.08)]" />
                <Skeleton className="h-3 w-14 bg-[rgba(255,255,255,0.06)]" />
              </div>
              <Skeleton className="h-7 w-7 rounded-full bg-[rgba(255,255,255,0.06)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
