import { Skeleton } from "@/components/ui/skeleton";

export default function NotesSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20 bg-[rgba(255,255,255,0.08)]" />
        <Skeleton className="h-8 w-24 rounded-full bg-[rgba(255,255,255,0.08)]" />
      </div>

      {/* Note cards */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4"
          >
            <div className="space-y-2">
              <Skeleton className="h-4 w-full bg-[rgba(255,255,255,0.06)]" />
              <Skeleton className="h-4 w-5/6 bg-[rgba(255,255,255,0.06)]" />
              <Skeleton className="h-4 w-4/6 bg-[rgba(255,255,255,0.06)]" />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-20 rounded-full bg-[rgba(255,255,255,0.08)]" />
                <Skeleton className="h-3 w-12 bg-[rgba(255,255,255,0.06)]" />
              </div>
              <div className="flex gap-1">
                <Skeleton className="h-7 w-7 bg-[rgba(255,255,255,0.06)]" />
                <Skeleton className="h-7 w-7 bg-[rgba(255,255,255,0.06)]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
