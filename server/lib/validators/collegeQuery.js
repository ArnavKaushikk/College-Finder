import { z } from 'zod';

export const collegeListQuerySchema = z.object({
  q: z.string().optional(),
  minFees: z.coerce.number().min(0).optional(),
  maxFees: z.coerce.number().min(0).optional(),
  course: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  ids: z.string().optional(),
});

export function parseCollegeListQuery(searchParams) {
  const raw = Object.fromEntries(searchParams.entries());
  return collegeListQuerySchema.safeParse(raw);
}
