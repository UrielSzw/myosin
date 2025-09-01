import { sql } from "drizzle-orm";
import { integer } from "drizzle-orm/sqlite-core";

export const timestamps = {
  updated_at: integer("updated_at", { mode: "timestamp" }).default(
    sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`
  ),
  created_at: integer("created_at", { mode: "timestamp" }).default(
    sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`
  ),
};
