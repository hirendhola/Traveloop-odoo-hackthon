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
        className="flex items-center gap-1.5 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 py-1.5 text-xs text-[rgba(240,237,230,0.55)] transition-colors hover:border-[#E8C547] hover:text-[#E8C547] disabled:opacity-60"
      >
        <Share2 size={13} />
        {loading ? "Generating…" : "Share Trip"}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5 rounded-full border border-[rgba(232,197,71,0.25)] bg-[rgba(232,197,71,0.08)] px-3 py-1.5">
      <span className="max-w-40 truncate text-xs text-[#F0EDE6]">{url}</span>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 text-[#E8C547] transition-colors hover:text-[#d4b33f]"
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
      </button>
      <button
        type="button"
        onClick={disable}
        disabled={disabling}
        title="Disable sharing"
        className="shrink-0 text-[rgba(240,237,230,0.4)] transition-colors hover:text-[#E05252]"
      >
        <X size={13} />
      </button>
    </div>
  );
}
