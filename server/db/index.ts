import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema.js';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

let _db: ReturnType<typeof drizzle> | null = null;

export function initializeDatabase() {
  if (_db) return _db;

  // Utiliser SQLite pour le développement local
  const sqlite = new Database('./dyad_web.db');
  _db = drizzle(sqlite, { schema });

  // Run migrations
  migrate(_db, { migrationsFolder: './drizzle' });

  return _db;
}

export function getDb() {
  if (!_db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return _db;
}
