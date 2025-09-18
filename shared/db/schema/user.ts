import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { timestamps } from "../utils/schema-utils";
import { generateUUID } from "../utils/uuid";

export const user_preferences = sqliteTable(
  "user_preferences",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateUUID()),
    user_id: text("user_id").notNull().default("default-user"),

    // Display preferences
    theme: text("theme")
      .$type<"light" | "dark" | "system">()
      .default("system")
      .notNull(),
    weight_unit: text("weight_unit")
      .$type<"kg" | "lbs">()
      .default("kg")
      .notNull(),

    // Feature toggles
    show_rpe: integer("show_rpe", { mode: "boolean" }).default(true).notNull(),
    show_tempo: integer("show_tempo", { mode: "boolean" })
      .default(true)
      .notNull(),

    ...timestamps,
  },
  (t) => [index("idx_user_preferences_user_id").on(t.user_id)]
);
