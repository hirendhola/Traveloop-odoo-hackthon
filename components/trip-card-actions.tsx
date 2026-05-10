"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, Eye, AlertTriangle } from "lucide-react";

export function TripCardActions({
  tripId,
  tripName,
}: {
  tripId: string;
  tripName: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/trips/${tripId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      } else {
        console.error("Failed to delete trip");
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleting(false);
      setOpen(false);
    }
  }

  return (
    <div className="mt-4 flex items-center gap-2">
      <Link href={`/trips/${tripId}`} className="flex-1">
        <Button
          variant="outline"
          size="sm"
          className="w-full border-[#D4C9B0] text-[#0D1B2A] hover:bg-[#EDE4CF] hover:text-[#0D1B2A]"
        >
          <Eye size={14} className="mr-1.5" />
          View
        </Button>
      </Link>

      <Link href={`/trips/${tripId}/edit`} className="flex-1">
        <Button
          variant="outline"
          size="sm"
          className="w-full border-[#D4C9B0] text-[#0D1B2A] hover:bg-[#EDE4CF] hover:text-[#0D1B2A]"
        >
          <Pencil size={14} className="mr-1.5" />
          Edit
        </Button>
      </Link>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger>
          <Button
            variant="outline"
            size="sm"
            className="border-[#E11D48]/30 text-[#E11D48] hover:bg-[#E11D48]/10 hover:text-[#E11D48]"
          >
            <Trash2 size={14} className="mr-1.5" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-[#E11D48]/10">
              <AlertTriangle size={24} className="text-[#E11D48]" />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete Trip</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{tripName}</strong>? This
              action cannot be undone. All stops, expenses, and notes will be
              permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-[#E11D48] text-white hover:bg-[#E11D48]/90"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
