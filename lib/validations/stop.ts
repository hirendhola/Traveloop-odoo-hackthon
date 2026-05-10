import { z } from "zod";

export const createStopSchema = z.object({
  cityId: z.string().min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

export const updateStopSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const reorderStopsSchema = z.array(
  z.object({
    id: z.string(),
    orderIndex: z.number().int().min(0),
  })
);
