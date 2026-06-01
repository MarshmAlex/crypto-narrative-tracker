import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "..", "subscribers.db");

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma("journal_mode = WAL");
    _db.exec(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT,
        stripe_customer_id TEXT UNIQUE,
        stripe_subscription_id TEXT,
        is_pro INTEGER DEFAULT 0,
        created_at TEXT
      )
    `);
  }
  return _db;
}

export interface Subscriber {
  id?: number;
  email: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  is_pro: number;
  created_at: string;
}

export function getSubscriber(stripe_customer_id: string): Subscriber | undefined {
  const db = getDb();
  return db
    .prepare("SELECT * FROM subscribers WHERE stripe_customer_id = ?")
    .get(stripe_customer_id) as Subscriber | undefined;
}

export function upsertSubscriber(data: Omit<Subscriber, "id">): void {
  const db = getDb();
  db.prepare(`
    INSERT INTO subscribers (email, stripe_customer_id, stripe_subscription_id, is_pro, created_at)
    VALUES (@email, @stripe_customer_id, @stripe_subscription_id, @is_pro, @created_at)
    ON CONFLICT(stripe_customer_id) DO UPDATE SET
      email = excluded.email,
      stripe_subscription_id = excluded.stripe_subscription_id,
      is_pro = excluded.is_pro
  `).run(data);
}

export function setProStatus(stripe_customer_id: string, is_pro: number): void {
  const db = getDb();
  db.prepare("UPDATE subscribers SET is_pro = ? WHERE stripe_customer_id = ?").run(
    is_pro,
    stripe_customer_id
  );
}
