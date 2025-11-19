// Lightweight migration runner for PostgreSQL using sql files per step
// Usage: node src/db/migrate.js up|down

import fs from 'fs';
import path from 'path';
import url from 'url';
import { pool } from '../lib/db.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function ensureMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      run_on TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
  `);
}

async function listMigrationFiles() {
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();
}

async function appliedMigrations() {
  const { rows } = await pool.query('SELECT name FROM _migrations ORDER BY name');
  return rows.map((r) => r.name);
}

async function up() {
  await ensureMigrationsTable();
  const files = await listMigrationFiles();
  const applied = await appliedMigrations();
  for (const file of files) {
    if (applied.includes(file)) continue;
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
    console.log('Applying migration', file);
    await pool.query(sql);
    await pool.query('INSERT INTO _migrations(name) VALUES($1)', [file]);
  }
  console.log('Migrations up to date');
}

async function down() {
  await ensureMigrationsTable();
  const files = await listMigrationFiles();
  const applied = await appliedMigrations();
  const last = files.filter((f) => applied.includes(f)).pop();
  if (!last) {
    console.log('No migrations to rollback');
    return;
  }
  const downFile = last.replace('.sql', '.down.sql');
  const downPath = path.join(MIGRATIONS_DIR, downFile);
  if (!fs.existsSync(downPath)) {
    throw new Error(`Down migration not found for ${last}`);
  }
  console.log('Reverting migration', last);
  const sql = fs.readFileSync(downPath, 'utf8');
  await pool.query(sql);
  await pool.query('DELETE FROM _migrations WHERE name=$1', [last]);
}

const direction = process.argv[2];
if (!['up', 'down'].includes(direction)) {
  console.error('Usage: node src/db/migrate.js up|down');
  process.exit(1);
}

const runner = direction === 'up' ? up : down;
runner().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});
