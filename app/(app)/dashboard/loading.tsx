import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64 bg-[rgba(255,255,255,0.08)]" />
          <Skeleton className="h-4 w-48 bg-[rgba(255,255,255,0.06)]" />
        </div>
        <Skeleton className="h-10 w-36 rounded-full bg-[rgba(255,255,255,0.08)]" />
      </div>

      {/* Upcoming Trips */}
      <section>
        <Skeleton className="mb-4 h-6 w-40 bg-[rgba(255,255,255,0.08)]" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)]">
              <Skeleton className="h-32 w-full bg-[rgba(255,255,255,0.06)]" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-5 w-3/4 bg-[rgba(255,255,255,0.08)]" />
                <Skeleton className="h-3 w-1/2 bg-[rgba(255,255,255,0.06)]" />
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-12 bg-[rgba(255,255,255,0.06)]" />
                    <Skeleton className="h-3 w-24 bg-[rgba(255,255,255,0.08)]" />
                  </div>
                  <Skeleton className="h-2 w-full bg-[rgba(255,255,255,0.06)]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Destinations */}
      <section>
        <Skeleton className="mb-4 h-6 w-56 bg-[rgba(255,255,255,0.08)]" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)]">
              <Skeleton className="h-44 w-full bg-[rgba(255,255,255,0.06)]" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-5 w-24 bg-[rgba(255,255,255,0.08)]" />
                <Skeleton className="h-3 w-16 bg-[rgba(255,255,255,0.06)]" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
