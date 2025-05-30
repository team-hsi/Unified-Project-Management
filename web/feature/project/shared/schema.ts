import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(3).max(20),
});

export const projectDeleteSchema = (projectName: string) =>
  z.object({
    name: z
      .string()
      .min(1, "Project name is required")
      .refine((value) => value === projectName, {
        message: "Project name does not match",
      }),
  });

export const itemFormSchema = z.object({
  status: z.string(),
  dueDate: z.date().optional(),
  startDate: z.date().optional(),
  priority: z.enum(["low", "medium", "high", ""]).optional(),
  description: z
    .union([
      z.literal(""),
      z.string().min(10, "Description must be at least 10 characters long"), // Or string with min 10 chars
    ])
    .optional(),
  labels: z.array(z.any()).optional(),
});
