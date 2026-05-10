import { z } from "zod";

export const createChecklistItemSchema = z.object({
  label: z.string().min(1).max(200),
  category: z.enum(["clothing", "documents", "electronics", "toiletries", "other"]),
});

export const updateChecklistItemSchema = z.object({
  label: z.string().min(1).max(200).optional(),
  category: z.enum(["clothing", "documents", "electronics", "toiletries", "other"]).optional(),
  isPacked: z.boolean().optional(),
});
