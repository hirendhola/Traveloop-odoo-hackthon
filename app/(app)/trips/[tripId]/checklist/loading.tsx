import { Skeleton } from "@/components/ui/skeleton";

export default function ChecklistSkeleton() {
  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-5 py-4">
        <div className="mb-2 flex items-center justify-between">
          <Skeleton className="h-4 w-28 bg-[rgba(255,255,255,0.08)]" />
          <Skeleton className="h-4 w-24 bg-[rgba(255,255,255,0.06)]" />
        </div>
        <Skeleton className="h-3 w-full bg-[rgba(255,255,255,0.06)]" />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-28 rounded-full bg-[rgba(255,255,255,0.08)]" />
        <Skeleton className="h-8 w-24 rounded-full bg-[rgba(255,255,255,0.08)]" />
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-20 rounded-full bg-[rgba(255,255,255,0.06)]" />
        ))}
      </div>

      {/* Checklist item rows */}
      <div className="space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] px-4 py-3"
          >
            <Skeleton className="h-5 w-5 rounded-sm bg-[rgba(255,255,255,0.06)]" />
            <Skeleton className="h-4 w-full bg-[rgba(255,255,255,0.06)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
