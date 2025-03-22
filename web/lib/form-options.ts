// shared-code.ts
// Notice the import path is different from the client
import { formOptions } from '@tanstack/react-form/nextjs';
import { z } from 'zod';

// You can pass other form options here
export const formOpts = formOptions({
  defaultValues: {
    email: '',
    password: '',
  },
});

export const loginSchema = z.object({
  email: z.string().email({
    message: 'Invalid email address',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters long',
  }),
});

export type Login = z.infer<typeof loginSchema>;
