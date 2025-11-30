import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, '../data/postpilot.db'));

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform TEXT NOT NULL,
    user_id TEXT NOT NULL,
    username TEXT,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    token_expires_at INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(platform, user_id)
  );

  CREATE INDEX IF NOT EXISTS idx_platform_user ON accounts(platform, user_id);
`);

export interface Account {
  id: number;
  platform: string;
  user_id: string;
  username: string | null;
  access_token: string;
  refresh_token: string | null;
  token_expires_at: number | null;
  created_at: string;
  updated_at: string;
}

export const accountsDb = {
  save: (account: Omit<Account, 'id' | 'created_at' | 'updated_at'>) => {
    const stmt = db.prepare(`
      INSERT INTO accounts (platform, user_id, username, access_token, refresh_token, token_expires_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(platform, user_id) DO UPDATE SET
        username = excluded.username,
        access_token = excluded.access_token,
        refresh_token = excluded.refresh_token,
        token_expires_at = excluded.token_expires_at,
        updated_at = CURRENT_TIMESTAMP
    `);
    return stmt.run(
      account.platform,
      account.user_id,
      account.username,
      account.access_token,
      account.refresh_token,
      account.token_expires_at
    );
  },

  findByPlatform: (platform: string): Account[] => {
    const stmt = db.prepare('SELECT * FROM accounts WHERE platform = ?');
    return stmt.all(platform) as Account[];
  },

  findByPlatformAndUserId: (platform: string, user_id: string): Account | null => {
    const stmt = db.prepare('SELECT * FROM accounts WHERE platform = ? AND user_id = ?');
    return stmt.get(platform, user_id) as Account | null;
  },

  delete: (platform: string, user_id: string) => {
    const stmt = db.prepare('DELETE FROM accounts WHERE platform = ? AND user_id = ?');
    return stmt.run(platform, user_id);
  },

  getAll: (): Account[] => {
    const stmt = db.prepare('SELECT * FROM accounts ORDER BY platform, username');
    return stmt.all() as Account[];
  },
};

export default db;

