"use client";

import { useState } from "react";
import { Share2, Copy, Check, X } from "lucide-react";

export function ShareButton({ tripId, shareToken }: { tripId: string; shareToken?: string | null }) {
  const [url, setUrl] = useState<string | null>(
    shareToken ? `${typeof window !== "undefined" ? window.location.origin : ""}/shared/${shareToken}` : null
  );
  const [loading, setLoading] = useState(false);
  const [disabling, setDisabling] = useState(false);
  const [copied, setCopied] = useState(false);

  async function enable() {
    setLoading(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/share`, { method: "POST" });
      if (res.ok) {
        const { token } = await res.json();
        setUrl(`${window.location.origin}/shared/${token}`);
      }
    } finally { setLoading(false); }
  }

  async function disable() {
    setDisabling(true);
    try {
      await fetch(`/api/trips/${tripId}/share`, { method: "DELETE" });
      setUrl(null);
    } finally { setDisabling(false); }
  }

  async function copy() {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!url) {
    return (
      <button
        onClick={enable}
        disabled={loading}
        className="flex items-center gap-1.5 rounded-full border border-[#D4C9B0] bg-white/60 px-3 py-1.5 text-xs text-[#5A6B7A] transition-colors hover:border-[#7D9B76] hover:text-[#7D9B76] disabled:opacity-60"
      >
        <Share2 size={13} />
        {loading ? "Generating…" : "Share Trip"}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5 rounded-full border border-[#7D9B76]/40 bg-[#7D9B76]/10 px-3 py-1.5">
      <span className="max-w-40 truncate text-xs text-[#0D1B2A]">{url}</span>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 text-[#7D9B76] transition-colors hover:text-[#5A8A5A]"
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
      </button>
      <button
        type="button"
        onClick={disable}
        disabled={disabling}
        title="Disable sharing"
        className="shrink-0 text-[#A0AEBF] transition-colors hover:text-[#E11D48]"
      >
        <X size={13} />
      </button>
    </div>
  );
}
