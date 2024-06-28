import * as z from 'zod';

export const formSchema = z.object({
  content: z.string().min(2, {
    message: 'Post must be at least 2 characters.',
  }),
  currentOrg: z.string(),
});

export const orgSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  slug: z.string(),
});
