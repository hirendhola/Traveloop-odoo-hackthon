"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

const REGIONS = [
  "Africa", "Asia", "Europe", "North America", "South America", "Oceania", "Middle East",
];

function CitySearchBoxInner({
  initialSearch, initialRegion,
}: { initialSearch: string; initialRegion: string }) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [region, setRegion] = useState(initialRegion);

  useEffect(() => {
    const t = setTimeout(() => {
      const p = new URLSearchParams();
      if (search) p.set("search", search);
      if (region) p.set("region", region);
      router.push(`/cities?${p.toString()}`);
    }, 400);
    return () => clearTimeout(t);
  }, [search, region, router]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEBF]" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search cities or countries…"
          className="border-[#D4C9B0] bg-white/80 pl-9 focus-visible:border-[#FF5733]"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0AEBF] hover:text-[#5A6B7A]"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <select
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        className="h-10 rounded-lg border border-[#D4C9B0] bg-white px-3 text-sm text-[#0D1B2A] focus:outline-none focus:ring-1 focus:ring-[#FF5733] sm:w-52"
      >
        <option value="">All Regions</option>
        {REGIONS.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
    </div>
  );
}

export function CitySearchBox(props: { initialSearch: string; initialRegion: string }) {
  return (
    <Suspense fallback={null}>
      <CitySearchBoxInner {...props} />
    </Suspense>
  );
}
