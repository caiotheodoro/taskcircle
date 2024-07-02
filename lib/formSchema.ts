import * as z from 'zod';

export const formSchema = z.object({
  content: z.string().min(2, {
    message: 'Post must be at least 2 characters.',
  }),
  org_id: z.string().optional(),
});

export const orgSchema = z.object({
  name: z.string(),
  description: z
    .string()
    .max(100, {
      message: 'Description must be less than 200 characters.',
    })
    .optional(),
  slug: z.string().max(40, {
    message: 'Slug must be less than 40 characters.',
  }),
});

export const requestMembershipSchema = z.object({
  org_id: z.string(),
  otp: z.string(),
});

export const newOrgSchema = z.object({
  // pattern="[a-zA-Z0-9-]{1,40}"
  name: z.string().regex(/^[a-zA-Z0-9-]{1,40}$/, {
    message: 'Name must contain only letters, numbers, and dashes.',
  }),
});
