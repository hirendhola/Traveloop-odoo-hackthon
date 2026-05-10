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
          ? "bg-[#FF5733]/10 text-[#FF5733]"
          : "text-[#A0AEBF] hover:bg-[#F5ECD7] hover:text-[#FF5733]"
      }`}
    >
      <Heart size={13} className={saved ? "fill-[#FF5733] stroke-[#FF5733]" : ""} />
      {saved ? "Saved" : "Save"}
    </button>
  );
}
