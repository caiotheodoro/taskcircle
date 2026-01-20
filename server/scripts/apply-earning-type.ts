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
      'server/migrations/0057_concerned_exodus.sql',
    );
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    console.log('Applying migration: 0057_concerned_exodus.sql');

    const statements = migrationSQL
      .split('--> statement-breakpoint')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'));

    try {
      await sql.unsafe(`ALTER TABLE "earnings" ADD COLUMN "type" text;`);
      console.log('✓ Added type column (nullable)');
    } catch (error: any) {
      if (error.code === '42701') {
        console.log('ℹ Column already exists, skipping...');
      } else {
        throw error;
      }
    }

    await sql.unsafe(
      `UPDATE earnings SET type = 'recurrent' WHERE type IS NULL OR type = '' OR type = 'monthly';`,
    );
    console.log('✓ Set default type for existing earnings');

    try {
      await sql.unsafe(
        `ALTER TABLE "earnings" ALTER COLUMN "type" SET NOT NULL;`,
      );
      console.log('✓ Made type column NOT NULL');
    } catch (error: any) {
      if (error.code === '42701' || error.message?.includes('already')) {
        console.log('ℹ Column already NOT NULL, skipping...');
      } else {
        throw error;
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
