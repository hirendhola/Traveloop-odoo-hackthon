"use client";

import { useState } from "react";
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
import { Trash2, AlertTriangle } from "lucide-react";

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
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 border-[rgba(255,255,255,0.08)] bg-transparent text-xs text-[#E05252] hover:bg-[#E05252]/10 hover:text-[#E05252]"
        >
          <Trash2 size={14} />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="border-[rgba(255,255,255,0.08)] bg-[#0F1419]">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-[#E05252]/10">
            <AlertTriangle size={24} className="text-[#E05252]" />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-[#F0EDE6]">Delete Trip</AlertDialogTitle>
          <AlertDialogDescription className="text-[rgba(240,237,230,0.55)]">
            Are you sure you want to delete <strong className="text-[#F0EDE6]">{tripName}</strong>? This
            action cannot be undone. All stops, expenses, and notes will be
            permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-[rgba(255,255,255,0.08)] bg-transparent text-[#F0EDE6] hover:bg-[rgba(255,255,255,0.06)]">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleting}
            className="bg-[#E05252] text-white hover:bg-[#E05252]/90"
          >
            {deleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
