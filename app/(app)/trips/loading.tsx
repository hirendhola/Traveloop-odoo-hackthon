import { Skeleton } from "@/components/ui/skeleton";

export default function TripListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-32 bg-[rgba(255,255,255,0.08)]" />
          <Skeleton className="h-4 w-24 bg-[rgba(255,255,255,0.06)]" />
        </div>
        <Skeleton className="h-10 w-28 rounded-full bg-[rgba(255,255,255,0.08)]" />
      </div>

      {/* Trips Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)]">
            <Skeleton className="h-36 w-full bg-[rgba(255,255,255,0.06)]" />
            <div className="space-y-2 p-4">
              <Skeleton className="h-5 w-3/4 bg-[rgba(255,255,255,0.08)]" />
              <Skeleton className="h-3 w-1/2 bg-[rgba(255,255,255,0.06)]" />
              <Skeleton className="h-3 w-full bg-[rgba(255,255,255,0.06)]" />
              <Skeleton className="h-3 w-5/6 bg-[rgba(255,255,255,0.06)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
