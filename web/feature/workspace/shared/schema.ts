import { z } from "zod";

export const spaceFormSchema = z.object({
  name: z.string().min(2, {
    message: "Space name must be at least 2 characters.",
  }),
  description: z.string().optional(),
});

export type SpaceFormValues = z.infer<typeof spaceFormSchema>;

export const DeleteSpaceSchema = (workspaceName: string) =>
  z.object({
    name: z
      .string()
      .min(1, "Workspace name is required")
      .refine((value) => value === workspaceName, {
        message: "Workspace name does not match",
      }),
  });

export type DeleteSpaceValues = z.infer<ReturnType<typeof DeleteSpaceSchema>>;
