import { Skeleton } from "@/components/ui/skeleton";

export default function BudgetSkeleton() {
  return (
    <div className="space-y-6">
      {/* Large total number skeleton */}
      <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-6">
        <Skeleton className="mb-2 h-3 w-24 bg-[rgba(255,255,255,0.06)]" />
        <Skeleton className="h-10 w-40 bg-[rgba(255,255,255,0.08)]" />
      </div>

      {/* Horizontal bar skeleton */}
      <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-5 py-4">
        <div className="mb-2 flex items-center justify-between">
          <Skeleton className="h-4 w-24 bg-[rgba(255,255,255,0.06)]" />
          <Skeleton className="h-4 w-16 bg-[rgba(255,255,255,0.08)]" />
        </div>
        <Skeleton className="h-3 w-full bg-[rgba(255,255,255,0.06)]" />
      </div>

      {/* Pie chart circle skeleton */}
      <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-5">
        <Skeleton className="mb-3 h-5 w-40 bg-[rgba(255,255,255,0.08)]" />
        <div className="flex items-center gap-6">
          <Skeleton className="h-32 w-32 rounded-full bg-[rgba(255,255,255,0.06)]" />
          <div className="flex-1 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-full bg-[rgba(255,255,255,0.06)]" />
                <Skeleton className="h-3 w-20 bg-[rgba(255,255,255,0.06)]" />
                <Skeleton className="ml-auto h-3 w-12 bg-[rgba(255,255,255,0.08)]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table rows */}
      <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-5">
        <div className="mb-3 flex items-center justify-between">
          <Skeleton className="h-5 w-24 bg-[rgba(255,255,255,0.08)]" />
          <Skeleton className="h-8 w-28 rounded-full bg-[rgba(255,255,255,0.08)]" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg bg-[rgba(255,255,255,0.03)] px-4 py-3"
            >
              <Skeleton className="h-4 w-4 rounded-full bg-[rgba(255,255,255,0.06)]" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 bg-[rgba(255,255,255,0.06)]" />
              </div>
              <Skeleton className="h-4 w-16 bg-[rgba(255,255,255,0.08)]" />
              <Skeleton className="h-4 w-20 bg-[rgba(255,255,255,0.06)]" />
              <Skeleton className="h-4 w-4 bg-[rgba(255,255,255,0.06)]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
