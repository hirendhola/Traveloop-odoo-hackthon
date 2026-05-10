import { Skeleton } from "@/components/ui/skeleton";

export default function CityDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Back link */}
      <Skeleton className="h-4 w-20 bg-[rgba(255,255,255,0.06)]" />

      {/* Hero image placeholder */}
      <div className="relative overflow-hidden rounded-2xl bg-[rgba(255,255,255,0.04)] px-6 py-8">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-10 w-48 bg-[rgba(255,255,255,0.08)]" />
            <div className="flex gap-3">
              <Skeleton className="h-4 w-32 bg-[rgba(255,255,255,0.06)]" />
              <Skeleton className="h-4 w-24 bg-[rgba(255,255,255,0.06)]" />
            </div>
          </div>
          <Skeleton className="h-9 w-9 shrink-0 rounded-full bg-[rgba(255,255,255,0.06)]" />
        </div>

        {/* Description lines */}
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-full max-w-2xl bg-[rgba(255,255,255,0.06)]" />
          <Skeleton className="h-4 w-5/6 max-w-xl bg-[rgba(255,255,255,0.06)]" />
        </div>

        {/* Stats */}
        <div className="mt-5 flex flex-wrap gap-3">
          <Skeleton className="h-9 w-28 rounded-lg bg-[rgba(255,255,255,0.06)]" />
          <Skeleton className="h-9 w-28 rounded-lg bg-[rgba(255,255,255,0.06)]" />
        </div>
      </div>

      {/* Activity type filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-20 shrink-0 rounded-full bg-[rgba(255,255,255,0.06)]" />
        ))}
      </div>

      {/* Activities grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)]"
          >
            <Skeleton className="h-32 w-full bg-[rgba(255,255,255,0.06)]" />
            <div className="space-y-2 p-4">
              <div className="flex items-start justify-between gap-2">
                <Skeleton className="h-5 w-3/4 bg-[rgba(255,255,255,0.08)]" />
                <Skeleton className="h-5 w-16 rounded-full bg-[rgba(255,255,255,0.06)]" />
              </div>
              <Skeleton className="h-3 w-full bg-[rgba(255,255,255,0.06)]" />
              <div className="flex gap-4 pt-1">
                <Skeleton className="h-3 w-12 bg-[rgba(255,255,255,0.06)]" />
                <Skeleton className="h-3 w-12 bg-[rgba(255,255,255,0.06)]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
