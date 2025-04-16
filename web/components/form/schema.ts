import { z } from "zod";

export const itemFormSchema = z.object({
  status: z.enum(["incomplete", "complete"]),
  dueDate: z.date().optional(),
  priority: z.enum(["low", "medium", "high", ""]),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  labels: z.array(z.any()).optional(),
});
