import { sql } from "drizzle-orm";
import { integer } from "drizzle-orm/sqlite-core";

export const timestamps = {
  updated_at: integer("updated_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now') * 1000)`
  ),
  created_at: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now') * 1000)`
  ),
};
