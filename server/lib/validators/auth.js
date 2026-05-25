import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().transform((e) => e.toLowerCase().trim()),
  password: z.string().min(6).max(100),
});

export const loginSchema = z.object({
  email: z.string().email().transform((e) => e.toLowerCase().trim()),
  password: z.string().min(1),
});
