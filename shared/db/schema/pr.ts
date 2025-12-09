import type { MeasurementTemplateId } from "@/shared/types/measurement";
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

/**
 * PR Current - Stores the current best PR for each exercise
 *
 * Generic fields support ALL measurement templates:
 * - weight_reps: primary=weight, secondary=reps, score=1RM
 * - time_only: primary=duration, secondary=null, score=duration
 * - weight_time: primary=weight, secondary=duration, score=weight*duration
 * - distance_only: primary=distance, secondary=null, score=distance
 * - distance_time: primary=distance, secondary=time, score=distance
 * - weight_distance: primary=weight, secondary=distance, score=weight*distance
 */
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

    // Template defines how to interpret the values
    measurement_template: text("measurement_template")
      .$type<MeasurementTemplateId>()
      .notNull()
      .default("weight_reps"),

    // Generic values (interpretation depends on template)
    best_primary_value: real("best_primary_value").notNull(),
    best_secondary_value: real("best_secondary_value"), // Nullable for single-metric templates

    // Calculated score for comparison/ranking
    pr_score: real("pr_score").notNull(),

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

/**
 * PR History - Stores all PRs achieved over time for charting/analytics
 */
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

    // Template defines how to interpret the values
    measurement_template: text("measurement_template")
      .$type<MeasurementTemplateId>()
      .notNull()
      .default("weight_reps"),

    // Generic values
    primary_value: real("primary_value").notNull(),
    secondary_value: real("secondary_value"), // Nullable for single-metric templates

    // Calculated score
    pr_score: real("pr_score").notNull(),

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
