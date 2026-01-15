import * as fs from 'fs';
import * as path from 'path';
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!);

async function applyMigration() {
  try {
    const migrationPath = path.join(
      __dirname,
      '../migrations/0056_absent_zzzax.sql',
    );
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    console.log('Applying migration: 0056_absent_zzzax.sql');
    await sql.unsafe(migrationSQL);
    console.log('Migration applied successfully!');
  } catch (error) {
    console.error('Error applying migration:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

applyMigration();
