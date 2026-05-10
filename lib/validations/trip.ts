import { z } from "zod";

export const createTripSchema = z.object({
  name: z.string().min(1, "Trip name is required").max(100),
  description: z.string().max(500).optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  coverPhotoUrl: z.string().url().optional(),
  totalBudget: z.number().positive().optional(),
});

export const updateTripSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  coverPhotoUrl: z.string().url().optional(),
  isPublic: z.boolean().optional(),
  totalBudget: z.number().positive().optional(),
});
