import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  // Only accessible on server side, but will have it's typings available on client side
  server: {
    SUPABASE_URL: z.string().url(),
    SUPABASE_ANON_KEY: z.string().min(1),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_STORAGE: z.string().url(),
  },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SUPABASE_STORAGE: process.env.NEXT_PUBLIC_SUPABASE_STORAGE,
  },
});
