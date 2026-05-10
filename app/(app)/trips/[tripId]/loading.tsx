import { Skeleton } from "@/components/ui/skeleton";

export default function ItineraryViewSkeleton() {
  return (
    <div className="space-y-6">
      {/* Trip header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 bg-[rgba(255,255,255,0.08)]" />
          <Skeleton className="h-4 w-40 bg-[rgba(255,255,255,0.06)]" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20 rounded-full bg-[rgba(255,255,255,0.08)]" />
          <Skeleton className="h-9 w-28 rounded-full bg-[rgba(255,255,255,0.08)]" />
        </div>
      </div>

      {/* Budget bar */}
      <div className="mb-8 flex items-center gap-4 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-5 py-4">
        <Skeleton className="h-10 w-10 shrink-0 rounded-full bg-[rgba(255,255,255,0.08)]" />
        <div className="flex-1">
          <div className="mb-1.5 flex items-center justify-between">
            <Skeleton className="h-4 w-24 bg-[rgba(255,255,255,0.06)]" />
            <Skeleton className="h-4 w-32 bg-[rgba(255,255,255,0.08)]" />
          </div>
          <Skeleton className="h-1.5 w-full bg-[rgba(255,255,255,0.06)]" />
        </div>
      </div>

      {/* Two column layout */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left — Timeline */}
        <div className="flex-1 lg:max-w-[60%]">
          <div className="relative">
            {/* The railroad spine */}
            <div className="absolute left-2.25 top-2 bottom-10 w-0.5 bg-[rgba(232,197,71,0.2)]" />

            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <div className="relative flex gap-5">
                    {/* Station dot */}
                    <div className="relative z-10 mt-1 flex h-5 w-5 shrink-0 items-center justify-center">
                      <Skeleton className="h-5 w-5 rounded-full bg-[rgba(232,197,71,0.2)]" />
                    </div>

                    {/* Stop card */}
                    <div className="mb-6 flex-1">
                      <Skeleton className="mb-1 h-7 w-32 bg-[rgba(255,255,255,0.08)]" />
                      <Skeleton className="mb-3 h-3 w-40 bg-[rgba(255,255,255,0.06)]" />

                      {/* City photo */}
                      <Skeleton className="mb-4 h-[160px] w-full rounded-xl bg-[rgba(255,255,255,0.06)]" />

                      {/* Activities */}
                      <div className="space-y-2">
                        {Array.from({ length: 3 }).map((_, j) => (
                          <div
                            key={j}
                            className="flex items-center gap-3 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] px-4 py-3"
                          >
                            <Skeleton className="h-4 w-4 rounded-full bg-[rgba(255,255,255,0.08)]" />
                            <Skeleton className="h-4 w-3/4 bg-[rgba(255,255,255,0.06)]" />
                            <Skeleton className="ml-auto h-5 w-12 rounded-full bg-[rgba(255,255,255,0.06)]" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Transit segment */}
                  {i < 2 && (
                    <div className="relative flex gap-5 py-4">
                      <div className="relative z-10 flex h-5 w-5 shrink-0 items-center justify-center">
                        <Skeleton className="h-5 w-5 rounded-full bg-[rgba(255,255,255,0.06)]" />
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="h-px w-8 bg-[rgba(232,197,71,0.2)]" />
                        <Skeleton className="h-3 w-16 bg-[rgba(255,255,255,0.06)]" />
                        <span className="h-px flex-1 bg-[rgba(232,197,71,0.2)]" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Sticky info card */}
        <div className="hidden lg:block lg:w-[36%] lg:pl-8">
          <div className="sticky top-6 space-y-5 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-6 backdrop-blur-sm">
            <div className="space-y-2">
              <Skeleton className="h-7 w-48 bg-[rgba(255,255,255,0.08)]" />
              <Skeleton className="h-4 w-32 bg-[rgba(255,255,255,0.06)]" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-3">
                <Skeleton className="mb-1 h-3 w-8 bg-[rgba(255,255,255,0.06)]" />
                <Skeleton className="h-6 w-6 bg-[rgba(255,255,255,0.08)]" />
              </div>
              <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-3">
                <Skeleton className="mb-1 h-3 w-8 bg-[rgba(255,255,255,0.06)]" />
                <Skeleton className="h-6 w-6 bg-[rgba(255,255,255,0.08)]" />
              </div>
            </div>

            {/* Budget ring */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-[100px] w-[100px] rounded-full bg-[rgba(255,255,255,0.06)]" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-12 bg-[rgba(255,255,255,0.06)]" />
                <Skeleton className="h-8 w-24 bg-[rgba(255,255,255,0.08)]" />
                <Skeleton className="h-3 w-20 bg-[rgba(255,255,255,0.06)]" />
              </div>
            </div>

            <div className="space-y-3">
              <Skeleton className="h-10 w-full rounded-full bg-[rgba(232,197,71,0.15)]" />
              <div className="grid grid-cols-3 gap-2">
                <Skeleton className="h-10 w-full rounded-full bg-[rgba(255,255,255,0.06)]" />
                <Skeleton className="h-10 w-full rounded-full bg-[rgba(255,255,255,0.06)]" />
                <Skeleton className="h-10 w-full rounded-full bg-[rgba(255,255,255,0.06)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
