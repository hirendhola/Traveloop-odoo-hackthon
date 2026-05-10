"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

export function SaveCityButton({
  cityId, initialSaved,
}: { cityId: string; initialSaved: boolean }) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      const res = await fetch(`/api/cities/${cityId}/save`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setSaved(data.saved);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={saved ? "Remove from saved" : "Save destination"}
      className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all disabled:opacity-60 ${
        saved
          ? "bg-[rgba(232,197,71,0.12)] text-[#E8C547]"
          : "text-[rgba(240,237,230,0.45)] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#E8C547]"
      }`}
    >
      <Heart size={13} className={saved ? "fill-[#E8C547] stroke-[#E8C547]" : ""} />
      {saved ? "Saved" : "Save"}
    </button>
  );
}
