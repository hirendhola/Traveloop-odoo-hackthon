import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      {/* Header */}
      <div className="mb-6 space-y-2">
        <Skeleton className="h-9 w-32 bg-[rgba(255,255,255,0.08)]" />
        <Skeleton className="h-4 w-48 bg-[rgba(255,255,255,0.06)]" />
      </div>

      {/* Avatar circle */}
      <div className="flex flex-col items-center gap-3">
        <Skeleton className="h-24 w-24 rounded-full bg-[rgba(255,255,255,0.06)]" />
        <Skeleton className="h-3 w-28 bg-[rgba(255,255,255,0.06)]" />
      </div>

      {/* Name + email */}
      <div className="space-y-2 text-center">
        <Skeleton className="mx-auto h-5 w-32 bg-[rgba(255,255,255,0.08)]" />
        <Skeleton className="mx-auto h-3 w-48 bg-[rgba(255,255,255,0.06)]" />
      </div>

      {/* Form fields */}
      <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-6 space-y-4">
        <Skeleton className="h-6 w-28 bg-[rgba(255,255,255,0.08)]" />
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-20 bg-[rgba(255,255,255,0.06)]" />
          <Skeleton className="h-10 w-full bg-[rgba(255,255,255,0.06)]" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-16 bg-[rgba(255,255,255,0.06)]" />
          <Skeleton className="h-10 w-full bg-[rgba(255,255,255,0.06)]" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-32 bg-[rgba(255,255,255,0.06)]" />
          <Skeleton className="h-10 w-full bg-[rgba(255,255,255,0.06)]" />
        </div>
        <Skeleton className="h-9 w-32 rounded-full bg-[rgba(255,255,255,0.08)]" />
      </div>

      {/* Saved destinations grid */}
      <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-6">
        <Skeleton className="mb-4 h-6 w-40 bg-[rgba(255,255,255,0.08)]" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="relative overflow-hidden rounded-xl">
              <Skeleton className="h-20 w-full bg-[rgba(255,255,255,0.06)]" />
              <div className="absolute bottom-2 left-2 space-y-1">
                <Skeleton className="h-3 w-16 bg-[rgba(255,255,255,0.08)]" />
                <Skeleton className="h-3 w-12 bg-[rgba(255,255,255,0.06)]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
