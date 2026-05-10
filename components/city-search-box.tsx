"use client";

import { useState, useEffect, useTransition, Suspense } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, Loader2 } from "lucide-react";

const REGIONS = [
  "Africa", "Asia", "Europe", "North America", "South America", "Oceania", "Middle East",
];

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "name", label: "Name (A–Z)" },
  { value: "cost-low", label: "Cost: Low to High" },
  { value: "cost-high", label: "Cost: High to Low" },
];

function CitySearchBoxInner({
  initialSearch,
  initialRegion,
  initialSort,
}: {
  initialSearch: string;
  initialRegion: string;
  initialSort: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(initialSearch);
  const [region, setRegion] = useState(initialRegion);
  const [sort, setSort] = useState(initialSort || "popular");

  // Push URL changes via soft navigation (no full reload), debounced for search
  useEffect(() => {
    const t = setTimeout(() => {
      const p = new URLSearchParams();
      if (search) p.set("search", search);
      if (region) p.set("region", region);
      if (sort && sort !== "popular") p.set("sort", sort);
      // Reset to page 1 whenever filters change
      const qs = p.toString();
      const url = qs ? `${pathname}?${qs}` : pathname;
      startTransition(() => {
        router.replace(url, { scroll: false });
      });
    }, 350);
    return () => clearTimeout(t);
  }, [search, region, sort, pathname, router]);

  const hasActiveFilter = !!search || !!region || (sort && sort !== "popular");

  const clearAll = () => {
    setSearch("");
    setRegion("");
    setSort("popular");
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(240,237,230,0.4)]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cities or countries…"
            className="h-10 border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] pl-9 text-sm text-[#F0EDE6] placeholder:text-[rgba(240,237,230,0.35)] focus-visible:border-[#E8C547] focus-visible:ring-0"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(240,237,230,0.4)] transition-colors hover:text-[#F0EDE6]"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
          {isPending && !search && (
            <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-[rgba(240,237,230,0.4)]" />
          )}
        </div>

        {/* Region */}
        <Select value={region || "all"} onValueChange={(v) => setRegion(v === "all" || v === null ? "" : v)}>
          <SelectTrigger className="h-10 rounded-lg border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-sm text-[#F0EDE6] focus:ring-[#E8C547] sm:w-48">
            <SelectValue placeholder="All Regions" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-[rgba(255,255,255,0.12)] bg-[#1B2333]">
            <SelectItem value="all" className="text-[#F0EDE6] focus:bg-[rgba(255,255,255,0.08)] focus:text-[#F0EDE6]">All Regions</SelectItem>
            {REGIONS.map((r) => (
              <SelectItem key={r} value={r} className="text-[#F0EDE6] focus:bg-[rgba(255,255,255,0.08)] focus:text-[#F0EDE6]">
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sort} onValueChange={(v) => v && setSort(v)}>
          <SelectTrigger className="h-10 rounded-lg border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-sm text-[#F0EDE6] focus:ring-[#E8C547] sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-[rgba(255,255,255,0.12)] bg-[#1B2333]">
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value} className="text-[#F0EDE6] focus:bg-[rgba(255,255,255,0.08)] focus:text-[#F0EDE6]">
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active filters / clear */}
      {hasActiveFilter && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[rgba(240,237,230,0.45)]">Filters:</span>
          {search && (
            <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-2.5 py-1 text-[#F0EDE6]">
              &ldquo;{search}&rdquo;
              <button type="button" onClick={() => setSearch("")} className="text-[rgba(240,237,230,0.4)] hover:text-[#E8C547]">
                <X size={11} />
              </button>
            </span>
          )}
          {region && (
            <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-2.5 py-1 text-[#F0EDE6]">
              {region}
              <button type="button" onClick={() => setRegion("")} className="text-[rgba(240,237,230,0.4)] hover:text-[#E8C547]">
                <X size={11} />
              </button>
            </span>
          )}
          {sort && sort !== "popular" && (
            <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-2.5 py-1 text-[#F0EDE6]">
              {SORT_OPTIONS.find((o) => o.value === sort)?.label}
              <button type="button" onClick={() => setSort("popular")} className="text-[rgba(240,237,230,0.4)] hover:text-[#E8C547]">
                <X size={11} />
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={clearAll}
            className="ml-auto text-[rgba(240,237,230,0.4)] transition-colors hover:text-[#E8C547]"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

export function CitySearchBox(props: { initialSearch: string; initialRegion: string; initialSort: string }) {
  return (
    <Suspense fallback={null}>
      <CitySearchBoxInner {...props} />
    </Suspense>
  );
}
