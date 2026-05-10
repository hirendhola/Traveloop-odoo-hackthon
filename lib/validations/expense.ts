import { z } from "zod";

export const createExpenseSchema = z.object({
  category: z.enum(["transport", "stay", "activity", "meals", "other"]),
  label: z.string().min(1).max(100),
  amount: z.number().positive(),
  stopId: z.string().optional(),
});

export const updateExpenseSchema = z.object({
  category: z.enum(["transport", "stay", "activity", "meals", "other"]).optional(),
  label: z.string().min(1).max(100).optional(),
  amount: z.number().positive().optional(),
  stopId: z.string().optional(),
});
