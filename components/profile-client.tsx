"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SaveCityButton } from "@/components/save-city-button";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Save, MapPin, Trash2, Camera } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
          className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#0F1419] ring-2 ring-[rgba(255,255,255,0.08)]"
        >
          {imagePreview ? (
            <Image src={imagePreview} alt={name} fill className="object-cover" />
          ) : (
            <span className="font-heading text-3xl text-[#F0EDE6]">{initials}</span>
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
        <p className="text-xs text-[rgba(240,237,230,0.35)]">Click to change photo</p>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
      </div>

      {/* Profile form */}
      <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-6 space-y-4">
        <h2 className="font-heading text-lg font-light text-[#F0EDE6]">
          Profile Info
        </h2>

        <div className="space-y-1.5">
          <Label className="text-xs text-[rgba(240,237,230,0.45)]">Full Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[#F0EDE6] placeholder:text-[rgba(240,237,230,0.3)] focus:border-[#E8C547] focus:ring-[#E8C547]/20"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-[rgba(240,237,230,0.45)]">Email</Label>
          <Input
            value={email}
            disabled
            className="border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[rgba(240,237,230,0.4)] cursor-not-allowed"
          />
          <p className="text-xs text-[rgba(240,237,230,0.3)]">Email cannot be changed</p>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-[rgba(240,237,230,0.45)]">Language Preference</Label>
          <Select value={language} onValueChange={(v) => v !== null && setLanguage(v)}>
            <SelectTrigger className="h-10 w-full rounded-lg border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-sm text-[#F0EDE6] focus:ring-[#E8C547]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-[rgba(255,255,255,0.12)] bg-[#1B2333]">
              {LANGUAGES.map((l) => (
                <SelectItem key={l.value} value={l.value} className="text-[#F0EDE6] focus:bg-[rgba(255,255,255,0.08)] focus:text-[#F0EDE6]">
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <Button
            type="button"
            onClick={saveProfile}
            disabled={saving || uploading}
            className="h-10 rounded-full bg-[#E8C547] px-5 text-sm font-semibold text-[#080C10] hover:bg-[#d4b33f] disabled:opacity-60"
          >
            <Save size={14} className="mr-1.5" />
            {saving ? "Saving…" : "Save Changes"}
          </Button>
          {msg && (
            <span className={`text-sm ${msg.includes("saved") ? "text-[#7D9B76]" : "text-[#E05252]"}`}>
              {msg}
            </span>
          )}
        </div>
      </div>

      {/* Saved destinations */}
      <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-6">
        <h2 className="mb-4 font-heading text-lg font-light text-[#F0EDE6]">
          Saved Destinations
        </h2>
        {initialSavedCities.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <MapPin size={32} className="mb-2 text-[rgba(240,237,230,0.2)]" />
            <p className="text-sm text-[rgba(240,237,230,0.45)]">No saved destinations yet</p>
            <Link href="/cities" className="mt-2 text-xs text-[#E8C547] hover:underline">
              Explore cities →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {initialSavedCities.map((city) => (
              <div key={city.id} className="group relative overflow-hidden rounded-xl">
                <Link href={`/cities/${city.id}`}>
                  <div className="relative h-20">
                    {city.coverImageUrl ? (
                      <Image
                        src={city.coverImageUrl}
                        alt={city.name}
                        fill
                        className="object-cover opacity-70 transition-opacity group-hover:opacity-90"
                        sizes="200px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[#0F1419]">
                        <span className="font-heading text-2xl text-[#F0EDE6]">
                          {city.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-[rgba(8,12,16,0.85)] to-transparent" />
                    <div className="absolute bottom-2 left-2">
                      <p className="text-xs font-medium text-white">{city.name}</p>
                      <p className="text-[10px] text-[rgba(255,255,255,0.65)]">{city.country}</p>
                    </div>
                  </div>
                </Link>
                <div className="absolute right-2 top-2">
                  <SaveCityButton cityId={city.id} initialSaved={true} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete account */}
      <div className="rounded-2xl border border-[rgba(224,82,82,0.15)] bg-[rgba(224,82,82,0.04)] p-6">
        <h2 className="font-heading text-lg font-light text-[#E05252]">Danger Zone</h2>
        <p className="mt-1 text-sm text-[rgba(240,237,230,0.45)]">
          Once you delete your account, there is no going back.
        </p>
        <AlertDialog>
          <AlertDialogTrigger>
            <Button
              variant="outline"
              className="mt-4 h-10 gap-1 border-[rgba(224,82,82,0.2)] bg-transparent text-[#E05252] hover:bg-[rgba(224,82,82,0.1)]"
            >
              <Trash2 size={14} />
              Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="border-[rgba(255,255,255,0.08)] bg-[#0F1419]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[#F0EDE6]">Delete Account</AlertDialogTitle>
              <AlertDialogDescription className="text-[rgba(240,237,230,0.55)]">
                This will permanently delete your account and all your trips. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-[rgba(255,255,255,0.08)] bg-transparent text-[#F0EDE6] hover:bg-[rgba(255,255,255,0.06)]">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteAccount}
                disabled={deleting}
                className="bg-[#E05252] text-white hover:bg-[#E05252]/90"
              >
                {deleting ? "Deleting…" : "Delete Account"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
