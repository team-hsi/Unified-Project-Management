import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(3).max(20),
  description: z.string().min(10).max(100).optional(),
});
