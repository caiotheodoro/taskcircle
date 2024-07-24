import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from '@/server/schema';

declare global {
  // eslint-disable-next-line no-var
  var database: PostgresJsDatabase<typeof schema> | undefined;
}

const queryClient = postgres(process.env.DATABASE_URL, {
  max: 1,
});
export const db = drizzle(queryClient, { schema });
