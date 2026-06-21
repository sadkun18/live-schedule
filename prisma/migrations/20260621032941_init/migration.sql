-- CreateTable
CREATE TABLE "admins" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "pin_hash" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "streamers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "pin_hash" TEXT NOT NULL,
    "phone" TEXT,
    "platform" TEXT NOT NULL DEFAULT 'Shopee Live',
    "is_active" INTEGER NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "schedules" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "streamer_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "start_at" TEXT NOT NULL,
    "end_at" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "schedules_streamer_id_fkey" FOREIGN KEY ("streamer_id") REFERENCES "streamers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sales" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "schedule_id" INTEGER NOT NULL,
    "streamer_id" INTEGER NOT NULL,
    "amount" REAL NOT NULL DEFAULT 0,
    "order_count" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "screenshot" TEXT,
    "submitted_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sales_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "schedules" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "sales_streamer_id_fkey" FOREIGN KEY ("streamer_id") REFERENCES "streamers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "sales_schedule_id_key" ON "sales"("schedule_id");
