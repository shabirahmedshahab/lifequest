import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = process.env.DATABASE_PATH || "./data/lifequest.db";

const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const globalForDb = globalThis;
export const db = globalForDb.__lifequestDb || new Database(DB_PATH);
if (process.env.NODE_ENV !== "production") globalForDb.__lifequestDb = db;

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS characters (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    level INTEGER NOT NULL DEFAULT 1,
    xp INTEGER NOT NULL DEFAULT 0,
    gold INTEGER NOT NULL DEFAULT 20,
    intellect INTEGER NOT NULL DEFAULT 0,
    strength INTEGER NOT NULL DEFAULT 0,
    discipline INTEGER NOT NULL DEFAULT 0,
    creativity INTEGER NOT NULL DEFAULT 0,
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    last_completed_date TEXT
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    attribute TEXT NOT NULL DEFAULT 'discipline',
    difficulty TEXT NOT NULL DEFAULT 'normal',
    xp_reward INTEGER NOT NULL DEFAULT 10,
    gold_reward INTEGER NOT NULL DEFAULT 5,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    completed_at TEXT
  );

  CREATE TABLE IF NOT EXISTS shop_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    cost INTEGER NOT NULL,
    type TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id INTEGER NOT NULL REFERENCES shop_items(id),
    acquired_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

const itemCount = db.prepare("SELECT COUNT(*) as c FROM shop_items").get().c;
if (itemCount === 0) {
  const seed = db.prepare(
    "INSERT INTO shop_items (name, description, cost, type) VALUES (?, ?, ?, ?)"
  );
  const items = [
    ["Ember Theme", "Unlock a fiery red UI accent theme.", 50, "theme"],
    ["Arcane Theme", "Unlock a mystic purple UI accent theme.", 50, "theme"],
    ["Emerald Theme", "Unlock a verdant green UI accent theme.", 50, "theme"],
    ["Bronze Badge", "A badge of modest accomplishment.", 30, "badge"],
    ["Silver Badge", "A badge for the dedicated adventurer.", 100, "badge"],
    ["Golden Badge", "A badge reserved for legends.", 250, "badge"],
  ];
  const insertMany = db.transaction((rows) => {
    for (const r of rows) seed.run(...r);
  });
  insertMany(items);
}

export default db;
