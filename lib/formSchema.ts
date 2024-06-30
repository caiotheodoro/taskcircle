import * as z from 'zod';

export const formSchema = z.object({
  content: z.string().min(2, {
    message: 'Post must be at least 2 characters.',
  }),
  org_id: z.string().optional(),
});

export const orgSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  slug: z.string().max(40, {
    message: 'Slug must be less than 40 characters.',
  }),
});

export const requestMembershipSchema = z.object({
  org_id: z.string(),
  otp: z.string(),
});
