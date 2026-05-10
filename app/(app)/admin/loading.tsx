import { Skeleton } from "@/components/ui/skeleton";

export default function AdminSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-48 bg-[rgba(255,255,255,0.08)]" />
        <Skeleton className="h-4 w-56 bg-[rgba(255,255,255,0.06)]" />
      </div>

      {/* 4 stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-5"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-xl bg-[rgba(255,255,255,0.06)]" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-20 bg-[rgba(255,255,255,0.06)]" />
                <Skeleton className="h-8 w-16 bg-[rgba(255,255,255,0.08)]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chart area */}
        <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-5">
          <div className="mb-4 flex items-center gap-2">
            <Skeleton className="h-4 w-4 bg-[rgba(255,255,255,0.06)]" />
            <Skeleton className="h-5 w-40 bg-[rgba(255,255,255,0.08)]" />
            <Skeleton className="ml-auto h-3 w-20 bg-[rgba(255,255,255,0.06)]" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-4 w-4 rounded-full bg-[rgba(255,255,255,0.06)]" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24 bg-[rgba(255,255,255,0.06)]" />
                    <Skeleton className="h-3 w-12 bg-[rgba(255,255,255,0.08)]" />
                  </div>
                  <Skeleton className="h-2 w-full bg-[rgba(255,255,255,0.06)]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Table rows */}
        <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-5">
          <Skeleton className="mb-4 h-5 w-28 bg-[rgba(255,255,255,0.08)]" />
          <div className="space-y-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl bg-[rgba(255,255,255,0.03)] px-4 py-3"
              >
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32 bg-[rgba(255,255,255,0.06)]" />
                  <Skeleton className="h-3 w-20 bg-[rgba(255,255,255,0.06)]" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full bg-[rgba(255,255,255,0.08)]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
