import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import postgres from 'postgres';

dotenv.config({ path: '.env' });

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

async function applyMigration() {
  try {
    const migrationPath = path.resolve(
      process.cwd(),
      'server/migrations/0056_absent_zzzax.sql',
    );
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    console.log('Applying migration: 0056_absent_zzzax.sql');

    const statements = migrationSQL
      .split('--> statement-breakpoint')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await sql.unsafe(statement);
          console.log('✓ Executed statement');
        } catch (error: any) {
          if (
            error.code === '42P07' ||
            error.message?.includes('already exists')
          ) {
            console.log('ℹ Table/constraint already exists, skipping...');
          } else {
            throw error;
          }
        }
      }
    }

    console.log('✓ Migration applied successfully!');
  } catch (error: any) {
    console.error('✗ Error applying migration:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    process.exit(1);
  } finally {
    await sql.end();
  }
}

applyMigration();
