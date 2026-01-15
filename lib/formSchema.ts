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
  name: z.string().regex(/^[a-zA-Z0-9-]{1,40}$/, {
    message: 'Name must contain only letters, numbers, and dashes.',
  }),
});

export const earningSchema = z.object({
  amount: z
    .string()
    .min(1, { message: 'Amount is required' })
    .regex(/^\d+(\.\d{1,2})?$/, {
      message: 'Amount must be a valid number with up to 2 decimal places',
    }),
  description: z.string().optional(),
  type: z.enum(['monthly', 'once']),
  month: z.number().min(1).max(12),
  year: z.number().min(2000).max(2100),
});

export const spendingSchema = z.object({
  amount: z
    .string()
    .min(1, { message: 'Amount is required' })
    .regex(/^\d+(\.\d{1,2})?$/, {
      message: 'Amount must be a valid number with up to 2 decimal places',
    }),
  description: z.string().optional(),
  type: z.enum(['monthly', 'once', 'installment']),
  month: z.number().min(1).max(12),
  year: z.number().min(2000).max(2100),
  installment_current: z.number().optional(),
  installment_total: z.number().optional(),
});
