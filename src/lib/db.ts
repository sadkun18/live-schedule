import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { hashPin } from "./crypto";
import type { Sale, SaleWithDetails, Schedule, ScheduleStatus, ScheduleWithStreamer, Streamer } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "live-schedule.db");

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initSchema(db);
  }
  return db;
}

function initSchema(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS streamers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      pin_hash TEXT NOT NULL,
      phone TEXT,
      platform TEXT NOT NULL DEFAULT 'Shopee Live',
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      streamer_id INTEGER NOT NULL REFERENCES streamers(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      platform TEXT NOT NULL,
      start_at TEXT NOT NULL,
      end_at TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'scheduled',
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      schedule_id INTEGER NOT NULL UNIQUE REFERENCES schedules(id) ON DELETE CASCADE,
      streamer_id INTEGER NOT NULL REFERENCES streamers(id),
      amount REAL NOT NULL DEFAULT 0,
      order_count INTEGER NOT NULL DEFAULT 0,
      notes TEXT,
      submitted_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const count = database.prepare("SELECT COUNT(*) as c FROM streamers").get() as { c: number };
  if (count.c === 0) seedData(database);
}

function seedData(database: Database.Database) {
  const insert = database.prepare(
    "INSERT INTO streamers (name, pin_hash, phone, platform) VALUES (?, ?, ?, ?)"
  );
  const streamers = [
    ["Sari", "1111", "081234567890", "Shopee Live"],
    ["Budi", "2222", "081234567891", "TikTok Live"],
    ["Dewi", "3333", "081234567892", "Shopee Live"],
  ] as const;
  for (const [name, pin, phone, platform] of streamers) {
    insert.run(name, hashPin(pin), phone, platform);
  }

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(19, 0, 0, 0);
  const tomorrowEnd = new Date(tomorrow);
  tomorrowEnd.setHours(21, 0, 0, 0);

  database.prepare(
    `INSERT INTO schedules (streamer_id, title, platform, start_at, end_at, status)
     VALUES (1, 'Flash Sale Ramadan', 'Shopee Live', ?, ?, 'scheduled')`
  ).run(tomorrow.toISOString(), tomorrowEnd.toISOString());
}

// ── Streamers ──

export function getStreamers(activeOnly = false): Streamer[] {
  const sql = activeOnly
    ? "SELECT id, name, phone, platform, is_active, created_at FROM streamers WHERE is_active = 1 ORDER BY name"
    : "SELECT id, name, phone, platform, is_active, created_at FROM streamers ORDER BY name";
  return getDb().prepare(sql).all() as Streamer[];
}

export function getStreamerById(id: number): Streamer | undefined {
  return getDb()
    .prepare("SELECT id, name, phone, platform, is_active, created_at FROM streamers WHERE id = ?")
    .get(id) as Streamer | undefined;
}

export function getStreamerByPin(pin: string): Streamer | undefined {
  const hash = hashPin(pin);
  return getDb()
    .prepare(
      "SELECT id, name, phone, platform, is_active, created_at FROM streamers WHERE pin_hash = ? AND is_active = 1"
    )
    .get(hash) as Streamer | undefined;
}

export function createStreamer(data: {
  name: string;
  pin: string;
  phone?: string;
  platform: string;
}): Streamer {
  const result = getDb()
    .prepare(
      "INSERT INTO streamers (name, pin_hash, phone, platform) VALUES (?, ?, ?, ?)"
    )
    .run(data.name, hashPin(data.pin), data.phone ?? null, data.platform);
  return getStreamerById(Number(result.lastInsertRowid))!;
}

export function updateStreamer(
  id: number,
  data: { name?: string; pin?: string; phone?: string; platform?: string; is_active?: boolean }
): void {
  const current = getDb()
    .prepare("SELECT * FROM streamers WHERE id = ?")
    .get(id) as { pin_hash: string } | undefined;
  if (!current) return;

  getDb()
    .prepare(
      `UPDATE streamers SET
        name = COALESCE(?, name),
        pin_hash = COALESCE(?, pin_hash),
        phone = COALESCE(?, phone),
        platform = COALESCE(?, platform),
        is_active = COALESCE(?, is_active)
      WHERE id = ?`
    )
    .run(
      data.name ?? null,
      data.pin ? hashPin(data.pin) : null,
      data.phone ?? null,
      data.platform ?? null,
      data.is_active !== undefined ? (data.is_active ? 1 : 0) : null,
      id
    );
}

export function deleteStreamer(id: number): void {
  getDb().prepare("DELETE FROM streamers WHERE id = ?").run(id);
}

// ── Schedules ──

export function getSchedules(filters?: {
  streamerId?: number;
  status?: ScheduleStatus;
  from?: string;
  to?: string;
}): ScheduleWithStreamer[] {
  let sql = `
    SELECT s.*, st.name as streamer_name
    FROM schedules s
    JOIN streamers st ON st.id = s.streamer_id
    WHERE 1=1
  `;
  const params: (string | number)[] = [];

  if (filters?.streamerId) {
    sql += " AND s.streamer_id = ?";
    params.push(filters.streamerId);
  }
  if (filters?.status) {
    sql += " AND s.status = ?";
    params.push(filters.status);
  }
  if (filters?.from) {
    sql += " AND s.start_at >= ?";
    params.push(filters.from);
  }
  if (filters?.to) {
    sql += " AND s.start_at <= ?";
    params.push(filters.to);
  }

  sql += " ORDER BY s.start_at ASC";
  return getDb().prepare(sql).all(...params) as ScheduleWithStreamer[];
}

export function getScheduleById(id: number): ScheduleWithStreamer | undefined {
  return getDb()
    .prepare(
      `SELECT s.*, st.name as streamer_name
       FROM schedules s JOIN streamers st ON st.id = s.streamer_id
       WHERE s.id = ?`
    )
    .get(id) as ScheduleWithStreamer | undefined;
}

export function createSchedule(data: {
  streamer_id: number;
  title: string;
  platform: string;
  start_at: string;
  end_at: string;
  notes?: string;
}): Schedule {
  const result = getDb()
    .prepare(
      `INSERT INTO schedules (streamer_id, title, platform, start_at, end_at, notes)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(data.streamer_id, data.title, data.platform, data.start_at, data.end_at, data.notes ?? null);
  return getDb().prepare("SELECT * FROM schedules WHERE id = ?").get(result.lastInsertRowid) as Schedule;
}

export function updateSchedule(
  id: number,
  data: Partial<{
    streamer_id: number;
    title: string;
    platform: string;
    start_at: string;
    end_at: string;
    status: ScheduleStatus;
    notes: string;
  }>
): void {
  const fields: string[] = [];
  const values: (string | number)[] = [];

  for (const [key, val] of Object.entries(data)) {
    if (val !== undefined) {
      fields.push(`${key} = ?`);
      values.push(val);
    }
  }
  if (fields.length === 0) return;
  values.push(id);
  getDb().prepare(`UPDATE schedules SET ${fields.join(", ")} WHERE id = ?`).run(...values);
}

export function deleteSchedule(id: number): void {
  getDb().prepare("DELETE FROM schedules WHERE id = ?").run(id);
}

// ── Sales ──

export function getSales(filters?: { streamerId?: number; from?: string; to?: string }): SaleWithDetails[] {
  let sql = `
    SELECT sa.*, sc.title as schedule_title, st.name as streamer_name, sc.start_at
    FROM sales sa
    JOIN schedules sc ON sc.id = sa.schedule_id
    JOIN streamers st ON st.id = sa.streamer_id
    WHERE 1=1
  `;
  const params: (string | number)[] = [];

  if (filters?.streamerId) {
    sql += " AND sa.streamer_id = ?";
    params.push(filters.streamerId);
  }
  if (filters?.from) {
    sql += " AND sc.start_at >= ?";
    params.push(filters.from);
  }
  if (filters?.to) {
    sql += " AND sc.start_at <= ?";
    params.push(filters.to);
  }

  sql += " ORDER BY sa.submitted_at DESC";
  return getDb().prepare(sql).all(...params) as SaleWithDetails[];
}

export function getSaleByScheduleId(scheduleId: number): Sale | undefined {
  return getDb().prepare("SELECT * FROM sales WHERE schedule_id = ?").get(scheduleId) as Sale | undefined;
}

export function upsertSale(data: {
  schedule_id: number;
  streamer_id: number;
  amount: number;
  order_count: number;
  notes?: string;
}): Sale {
  const existing = getSaleByScheduleId(data.schedule_id);
  if (existing) {
    getDb()
      .prepare(
        `UPDATE sales SET amount = ?, order_count = ?, notes = ?, submitted_at = datetime('now')
         WHERE schedule_id = ?`
      )
      .run(data.amount, data.order_count, data.notes ?? null, data.schedule_id);
    updateSchedule(data.schedule_id, { status: "completed" });
    return getSaleByScheduleId(data.schedule_id)!;
  }

  const result = getDb()
    .prepare(
      `INSERT INTO sales (schedule_id, streamer_id, amount, order_count, notes)
       VALUES (?, ?, ?, ?, ?)`
    )
    .run(data.schedule_id, data.streamer_id, data.amount, data.order_count, data.notes ?? null);
  updateSchedule(data.schedule_id, { status: "completed" });
  return getDb().prepare("SELECT * FROM sales WHERE id = ?").get(result.lastInsertRowid) as Sale;
}

// ── Stats ──

export function getDashboardStats() {
  const database = getDb();
  const totalStreamers = (database.prepare("SELECT COUNT(*) as c FROM streamers WHERE is_active = 1").get() as { c: number }).c;
  const upcomingSchedules = (database.prepare(
    "SELECT COUNT(*) as c FROM schedules WHERE status = 'scheduled' AND start_at > datetime('now')"
  ).get() as { c: number }).c;
  const todaySchedules = (database.prepare(
    "SELECT COUNT(*) as c FROM schedules WHERE date(start_at) = date('now') AND status != 'cancelled'"
  ).get() as { c: number }).c;
  const monthSales = (database.prepare(`
    SELECT COALESCE(SUM(sa.amount), 0) as total, COALESCE(SUM(sa.order_count), 0) as orders
    FROM sales sa JOIN schedules sc ON sc.id = sa.schedule_id
    WHERE strftime('%Y-%m', sc.start_at) = strftime('%Y-%m', 'now')
  `).get() as { total: number; orders: number });

  return {
    totalStreamers,
    upcomingSchedules,
    todaySchedules,
    monthSalesTotal: monthSales.total,
    monthOrderCount: monthSales.orders,
  };
}
