"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SaveCityButton } from "@/components/save-city-button";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Save, Upload, MapPin, Trash2, Camera } from "lucide-react";
import Link from "next/link";

type SavedCity = { id: string; name: string; country: string; coverImageUrl: string | null };

type Props = {
  userId: string;
  initialName: string;
  email: string;
  initialImage: string | null;
  initialLanguage: string;
  savedCities: SavedCity[];
};

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "es", label: "Español" },
  { value: "ja", label: "日本語" },
  { value: "zh", label: "中文" },
  { value: "ar", label: "العربية" },
];

export function ProfileClient({ userId, initialName, email, initialImage, initialLanguage, savedCities: initialSavedCities }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(initialName);
  const [language, setLanguage] = useState(initialLanguage || "en");
  const [image, setImage] = useState(initialImage);
  const [imagePreview, setImagePreview] = useState(initialImage);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload?folder=avatars", { method: "POST", body: fd });
      if (res.ok) {
        const { url } = await res.json();
        setImage(url);
      }
    } finally { setUploading(false); }
  }

  async function saveProfile() {
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, languagePreference: language, image }),
      });
      if (res.ok) {
        setMsg("Profile saved!");
        router.refresh();
      } else {
        setMsg("Failed to save");
      }
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 3000);
    }
  }

  async function deleteAccount() {
    setDeleting(true);
    try {
      const res = await fetch("/api/account", { method: "DELETE" });
      if (res.ok) {
        window.location.href = "/login";
      }
    } finally { setDeleting(false); }
  }

  const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      {/* Avatar */}
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#0D1B2A] ring-4 ring-[#D4C9B0]"
        >
          {imagePreview ? (
            <img src={imagePreview} alt={name} className="h-full w-full object-cover" />
          ) : (
            <span className="font-(family-name:--font-heading) text-3xl text-[#F5ECD7]">{initials}</span>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <Camera size={20} className="text-white" />
          </div>
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </div>
          )}
        </button>
        <p className="text-xs text-[#A0AEBF]">Click to change photo</p>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
      </div>

      {/* Profile form */}
      <div className="rounded-2xl border border-[#D4C9B0] bg-white/80 p-6 space-y-4">
        <h2 className="font-(family-name:--font-heading) text-lg font-semibold text-[#0D1B2A]">
          Profile Info
        </h2>

        <div className="space-y-1.5">
          <Label className="text-xs text-[#5A6B7A]">Full Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-[#D4C9B0] bg-[#F8F4EC]"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-[#5A6B7A]">Email</Label>
          <Input
            value={email}
            disabled
            className="border-[#D4C9B0] bg-[#F0EAE0] text-[#A0AEBF] cursor-not-allowed"
          />
          <p className="text-xs text-[#A0AEBF]">Email cannot be changed</p>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-[#5A6B7A]">Language Preference</Label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="h-10 w-full rounded-lg border border-[#D4C9B0] bg-[#F8F4EC] px-3 text-sm text-[#0D1B2A] focus:outline-none focus:ring-1 focus:ring-[#FF5733]"
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <Button
            type="button"
            onClick={saveProfile}
            disabled={saving || uploading}
            className="rounded-full bg-[#FF5733] px-5 text-[#0D1B2A] hover:bg-[#FF8A6C] disabled:opacity-60"
          >
            <Save size={14} className="mr-1.5" />
            {saving ? "Saving…" : "Save Changes"}
          </Button>
          {msg && (
            <span className={`text-sm ${msg.includes("saved") ? "text-[#7D9B76]" : "text-[#E11D48]"}`}>
              {msg}
            </span>
          )}
        </div>
      </div>

      {/* Saved destinations */}
      <div className="rounded-2xl border border-[#D4C9B0] bg-white/80 p-6">
        <h2 className="mb-4 font-(family-name:--font-heading) text-lg font-semibold text-[#0D1B2A]">
          Saved Destinations
        </h2>
        {initialSavedCities.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <MapPin size={32} className="mb-2 text-[#D4C9B0]" />
            <p className="text-sm text-[#A0AEBF]">No saved destinations yet</p>
            <Link href="/cities" className="mt-2 text-xs text-[#FF5733] hover:underline">
              Explore cities →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {initialSavedCities.map((city) => (
              <div key={city.id} className="group relative overflow-hidden rounded-xl">
                <Link href={`/cities/${city.id}`}>
                  <div className="flex h-20 items-center justify-center bg-[#0D1B2A]">
                    {city.coverImageUrl ? (
                      <img
                        src={city.coverImageUrl}
                        alt={city.name}
                        className="h-full w-full object-cover opacity-70"
                      />
                    ) : (
                      <span className="font-(family-name:--font-heading) text-2xl text-[#F5ECD7]">
                        {city.name.charAt(0)}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-2">
                      <p className="text-xs font-semibold text-white">{city.name}</p>
                      <p className="text-xs text-white/70">{city.country}</p>
                    </div>
                  </div>
                </Link>
                <div className="absolute right-1.5 top-1.5">
                  <SaveCityButton cityId={city.id} initialSaved={true} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-[#E11D48]/20 bg-[#E11D48]/5 p-6">
        <h2 className="mb-1 text-sm font-semibold text-[#E11D48]">Danger Zone</h2>
        <p className="mb-4 text-xs text-[#5A6B7A]">
          Permanently delete your account and all associated trips, plans, and data. This action cannot be undone.
        </p>
        <AlertDialog>
          <AlertDialogTrigger>
            <Button
              variant="outline"
              className="rounded-full border-[#E11D48]/40 text-[#E11D48] hover:bg-[#E11D48]/10 hover:border-[#E11D48]"
            >
              <Trash2 size={14} className="mr-1.5" />
              Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete your account?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete your account, all your trips, expenses, checklists, and notes. This action <strong>cannot be undone</strong>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteAccount}
                disabled={deleting}
                className="bg-[#E11D48] hover:bg-[#C01A3F] text-white"
              >
                {deleting ? "Deleting…" : "Yes, delete everything"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
