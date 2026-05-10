import { Skeleton } from "@/components/ui/skeleton";

export default function BuilderSkeleton() {
  return (
    <div className="space-y-6">
      {/* Trip name input skeleton */}
      <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-5">
        <Skeleton className="mb-4 h-6 w-32 bg-[rgba(255,255,255,0.08)]" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Skeleton className="h-3 w-16 bg-[rgba(255,255,255,0.06)]" />
            <Skeleton className="h-10 w-full bg-[rgba(255,255,255,0.06)]" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Skeleton className="h-3 w-20 bg-[rgba(255,255,255,0.06)]" />
            <Skeleton className="h-20 w-full bg-[rgba(255,255,255,0.06)]" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-16 bg-[rgba(255,255,255,0.06)]" />
            <Skeleton className="h-10 w-full bg-[rgba(255,255,255,0.06)]" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-14 bg-[rgba(255,255,255,0.06)]" />
            <Skeleton className="h-10 w-full bg-[rgba(255,255,255,0.06)]" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-20 bg-[rgba(255,255,255,0.06)]" />
            <Skeleton className="h-10 w-full bg-[rgba(255,255,255,0.06)]" />
          </div>
        </div>
        <Skeleton className="mt-4 h-9 w-32 rounded-full bg-[rgba(255,255,255,0.08)]" />
      </div>

      {/* Left + Right panels */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left panel: stop cards */}
        <div className="space-y-4 lg:col-span-2">
          <Skeleton className="h-6 w-40 bg-[rgba(255,255,255,0.08)]" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)]"
            >
              <div className="flex items-center justify-between gap-3 bg-[rgba(255,255,255,0.03)] px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="h-6 w-6 rounded-full bg-[rgba(255,255,255,0.06)]" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-28 bg-[rgba(255,255,255,0.08)]" />
                    <Skeleton className="h-3 w-20 bg-[rgba(255,255,255,0.06)]" />
                  </div>
                </div>
                <div className="flex gap-1">
                  <Skeleton className="h-6 w-6 bg-[rgba(255,255,255,0.06)]" />
                  <Skeleton className="h-6 w-6 bg-[rgba(255,255,255,0.06)]" />
                  <Skeleton className="h-6 w-6 bg-[rgba(255,255,255,0.06)]" />
                </div>
              </div>
              <div className="space-y-2 p-3">
                <Skeleton className="h-8 w-full bg-[rgba(255,255,255,0.06)]" />
                <Skeleton className="h-8 w-full bg-[rgba(255,255,255,0.06)]" />
              </div>
            </div>
          ))}
        </div>

        {/* Right panel: activity grid */}
        <div className="space-y-4 lg:col-span-3">
          <Skeleton className="h-6 w-48 bg-[rgba(255,255,255,0.08)]" />
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] px-3 py-2"
              >
                <Skeleton className="h-8 w-8 rounded-full bg-[rgba(255,255,255,0.06)]" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-3/4 bg-[rgba(255,255,255,0.06)]" />
                  <Skeleton className="h-3 w-1/2 bg-[rgba(255,255,255,0.06)]" />
                </div>
                <Skeleton className="h-5 w-5 bg-[rgba(255,255,255,0.06)]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
