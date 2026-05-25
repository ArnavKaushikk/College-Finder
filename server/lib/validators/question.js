import { z } from 'zod';

export const createQuestionSchema = z.object({
  title: z.string().min(5).max(200),
  body: z.string().min(10).max(5000),
});

export const createAnswerSchema = z.object({
  body: z.string().min(5).max(5000),
});
