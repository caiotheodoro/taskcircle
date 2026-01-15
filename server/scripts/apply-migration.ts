import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import * as path from 'path';
import postgres from 'postgres';

dotenv.config({ path: '.env.local' });

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

const db = drizzle(sql);

async function applyMigrations() {
  try {
    const migrationsFolder = path.resolve(process.cwd(), 'server/migrations');

    console.log('Applying migrations from:', migrationsFolder);

    await migrate(db, { migrationsFolder });

    console.log('✓ All migrations applied successfully!');
  } catch (error: any) {
    console.error('✗ Error applying migrations:', error.message);
    if (error.code === '42P07' || error.message?.includes('already exists')) {
      console.log('Note: Some tables may already exist. This is safe.');
    } else {
      process.exit(1);
    }
  } finally {
    await sql.end();
  }
}

applyMigrations();
