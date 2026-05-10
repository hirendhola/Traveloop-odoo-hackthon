import { Skeleton } from "@/components/ui/skeleton";

export default function ActivitySearchSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-48 bg-[rgba(255,255,255,0.08)]" />
        <Skeleton className="h-4 w-56 bg-[rgba(255,255,255,0.06)]" />
      </div>

      {/* Search bar */}
      <Skeleton className="h-10 w-full bg-[rgba(255,255,255,0.06)]" />

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-20 rounded-full bg-[rgba(255,255,255,0.06)]" />
        ))}
      </div>

      {/* List of activity cards */}
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4"
          >
            <Skeleton className="h-16 w-16 shrink-0 rounded-lg bg-[rgba(255,255,255,0.06)]" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-5 w-40 bg-[rgba(255,255,255,0.08)]" />
                <Skeleton className="h-5 w-16 rounded-full bg-[rgba(255,255,255,0.06)]" />
              </div>
              <Skeleton className="h-3 w-full bg-[rgba(255,255,255,0.06)]" />
              <div className="flex gap-4">
                <Skeleton className="h-3 w-14 bg-[rgba(255,255,255,0.06)]" />
                <Skeleton className="h-3 w-14 bg-[rgba(255,255,255,0.06)]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
