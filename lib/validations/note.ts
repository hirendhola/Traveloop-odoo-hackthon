import { z } from "zod";

export const createNoteSchema = z.object({
  content: z.string().min(1).max(2000),
  stopId: z.string().optional(),
});

export const updateNoteSchema = z.object({
  content: z.string().min(1).max(2000).optional(),
  stopId: z.string().optional(),
});
