"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, X, Calendar, DollarSign, FileText, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NewTripPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload?folder=covers", { method: "POST", body: fd });
      if (res.ok) {
        const { url } = await res.json();
        setCoverUrl(url);
      } else {
        setCoverPreview("");
      }
    } catch {
      setCoverPreview("");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Trip name is required");
    if (!startDate) return setError("Start date is required");
    if (!endDate) return setError("End date is required");
    if (new Date(endDate) < new Date(startDate)) return setError("End date must be after start date");

    setLoading(true);
    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          totalBudget: budget ? parseFloat(budget) : undefined,
          coverPhotoUrl: coverUrl || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(typeof data.error === "string" ? data.error : "Failed to create trip");
        return;
      }
      const trip = await res.json();
      router.push(`/trips/${trip.id}/edit`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/trips"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-[#5A6B7A] transition-colors hover:text-[#FF5733]"
        >
          <ArrowLeft size={15} />
          My Trips
        </Link>
        <h1 className="font-(family-name:--font-heading) text-3xl font-bold text-[#0D1B2A]">
          New Trip
        </h1>
        <p className="mt-1 text-sm text-[#5A6B7A]">Plan your next expedition</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cover photo */}
        <div>
          <Label className="mb-2 block text-[#0D1B2A]">Cover Photo (optional)</Label>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative flex h-36 w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-[#D4C9B0] bg-[#F5ECD7] transition-colors hover:border-[#FF5733]"
          >
            {coverPreview ? (
              <>
                <img src={coverPreview} alt="Cover" className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity hover:opacity-100">
                  <span className="text-sm text-white">Change photo</span>
                </div>
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 text-[#A0AEBF]">
                <Upload size={24} />
                <span className="text-sm">Upload cover photo</span>
                <span className="text-xs">JPEG, PNG or WEBP · max 5 MB</span>
              </div>
            )}
          </button>
          {coverPreview && (
            <button
              type="button"
              onClick={() => { setCoverPreview(""); setCoverUrl(""); }}
              className="mt-2 flex items-center gap-1 text-xs text-[#5A6B7A] hover:text-[#E11D48]"
            >
              <X size={12} /> Remove photo
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>

        {/* Trip Name */}
        <div className="space-y-1.5">
          <Label htmlFor="name" className="flex items-center gap-1.5 text-[#0D1B2A]">
            <Compass size={14} className="text-[#FF5733]" />
            Trip Name *
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Japan & South Korea 2026"
            className="border-[#D4C9B0] bg-white/60 focus-visible:border-[#FF5733] focus-visible:ring-[#FF5733]/20"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label htmlFor="description" className="flex items-center gap-1.5 text-[#0D1B2A]">
            <FileText size={14} className="text-[#FF5733]" />
            Description (optional)
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this trip about?"
            rows={3}
            className="resize-none border-[#D4C9B0] bg-white/60 focus-visible:border-[#FF5733] focus-visible:ring-[#FF5733]/20"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="startDate" className="flex items-center gap-1.5 text-[#0D1B2A]">
              <Calendar size={14} className="text-[#FF5733]" />
              Start Date *
            </Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border-[#D4C9B0] bg-white/60 focus-visible:border-[#FF5733] focus-visible:ring-[#FF5733]/20"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="endDate" className="flex items-center gap-1.5 text-[#0D1B2A]">
              <Calendar size={14} className="text-[#FF5733]" />
              End Date *
            </Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border-[#D4C9B0] bg-white/60 focus-visible:border-[#FF5733] focus-visible:ring-[#FF5733]/20"
            />
          </div>
        </div>

        {/* Budget */}
        <div className="space-y-1.5">
          <Label htmlFor="budget" className="flex items-center gap-1.5 text-[#0D1B2A]">
            <DollarSign size={14} className="text-[#FF5733]" />
            Total Budget (optional)
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#A0AEBF]">$</span>
            <Input
              id="budget"
              type="number"
              min="0"
              step="0.01"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="0.00"
              className="border-[#D4C9B0] bg-white/60 pl-7 focus-visible:border-[#FF5733] focus-visible:ring-[#FF5733]/20"
            />
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-[#E11D48]/10 px-4 py-2.5 text-sm text-[#E11D48]">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={loading || uploading}
            className="flex-1 rounded-full bg-[#FF5733] text-[#0D1B2A] hover:bg-[#FF8A6C] disabled:opacity-60"
          >
            {loading ? "Creating…" : "Create Trip"}
          </Button>
          <Link href="/trips">
            <Button type="button" variant="outline" className="rounded-full border-[#D4C9B0]">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
