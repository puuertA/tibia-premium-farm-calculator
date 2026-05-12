-- CreateTable
CREATE TABLE "hunt_session_history" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "character_id" TEXT,
    "source_file_name" TEXT,
    "session_start" DATETIME,
    "session_end" DATETIME,
    "session_length" TEXT NOT NULL,
    "balance" REAL NOT NULL,
    "loot" REAL NOT NULL,
    "supplies" REAL NOT NULL,
    "xp_gain" REAL NOT NULL,
    "xp_per_hour" REAL NOT NULL,
    "profit_per_hour" REAL NOT NULL,
    "damage" REAL NOT NULL,
    "damage_per_hour" REAL NOT NULL,
    "healing" REAL NOT NULL,
    "healing_per_hour" REAL NOT NULL,
    "total_monsters_killed" INTEGER NOT NULL,
    "most_killed_monster" TEXT,
    "total_looted_items" INTEGER NOT NULL,
    "killed_monsters_json" JSONB NOT NULL,
    "looted_items_json" JSONB NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "hunt_session_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "hunt_session_history_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "characters" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "hunt_session_history_user_id_created_at_idx" ON "hunt_session_history"("user_id", "created_at");