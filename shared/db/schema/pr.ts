import { InferSelectModel } from "drizzle-orm";
import {
  index,
  integer,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { timestamps } from "../utils/schema-utils";
import { generateUUID } from "../utils/uuid";
import { exercises } from "./routine";
import { workout_sessions, workout_sets } from "./workout-session";

export const pr_current = sqliteTable(
  "pr_current",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateUUID()),
    user_id: text("user_id").notNull().default("default-user"),
    exercise_id: text("exercise_id")
      .notNull()
      .references(() => exercises.id),

    best_weight: real("best_weight").notNull(),
    best_reps: integer("best_reps").notNull(),
    estimated_1rm: real("estimated_1rm").notNull(),
    achieved_at: text("achieved_at").notNull(),

    source: text("source").$type<"auto" | "manual">().default("auto").notNull(),

    // Sync tracking
    is_synced: integer("is_synced", { mode: "boolean" })
      .default(false)
      .notNull(),

    ...timestamps,
  },
  (t) => [index("idx_pr_current_user_exercise").on(t.user_id, t.exercise_id)]
);

export const pr_history = sqliteTable(
  "pr_history",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateUUID()),
    user_id: text("user_id").notNull().default("default-user"),
    exercise_id: text("exercise_id")
      .notNull()
      .references(() => exercises.id),

    weight: real("weight").notNull(),
    reps: integer("reps").notNull(),
    estimated_1rm: real("estimated_1rm").notNull(),

    workout_session_id: text("workout_session_id").references(
      () => workout_sessions.id
    ),
    workout_set_id: text("workout_set_id").references(() => workout_sets.id),

    source: text("source")
      .$type<"auto" | "manual" | "import">()
      .default("auto")
      .notNull(),

    // Sync tracking
    is_synced: integer("is_synced", { mode: "boolean" })
      .default(false)
      .notNull(),

    ...timestamps,
  },
  (t) => [
    index("idx_pr_history_user_exercise").on(t.user_id, t.exercise_id),
    index("idx_pr_history_session").on(t.workout_session_id),
  ]
);

export type BasePRCurrent = InferSelectModel<typeof pr_current>;
export type BasePRHistory = InferSelectModel<typeof pr_history>;

export type PRCurrentInsert = Omit<BasePRCurrent, "id" | "is_synced"> & {
  is_synced?: boolean;
};

export type PRHistoryInsert = Omit<BasePRHistory, "id" | "is_synced"> & {
  is_synced?: boolean;
};
