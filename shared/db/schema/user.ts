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

export const user_preferences = sqliteTable(
  "user_preferences",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateUUID()),
    user_id: text("user_id").notNull().unique(),

    // Display preferences
    theme: text("theme")
      .$type<"light" | "dark" | "system">()
      .default("system")
      .notNull(),
    weight_unit: text("weight_unit")
      .$type<"kg" | "lbs">()
      .default("kg")
      .notNull(),
    distance_unit: text("distance_unit")
      .$type<"metric" | "imperial">()
      .default("metric")
      .notNull(),
    language: text("language").$type<"en" | "es">().default("es").notNull(),

    // Feature toggles
    show_rpe: integer("show_rpe", { mode: "boolean" }).default(true).notNull(),
    show_tempo: integer("show_tempo", { mode: "boolean" })
      .default(true)
      .notNull(),
    keep_screen_awake: integer("keep_screen_awake", { mode: "boolean" })
      .default(true)
      .notNull(),
    haptic_feedback_enabled: integer("haptic_feedback_enabled", {
      mode: "boolean",
    })
      .default(true)
      .notNull(),

    // Workout defaults
    default_rest_time_seconds: integer("default_rest_time_seconds")
      .default(60)
      .notNull(),

    // Onboarding data
    biological_sex: text("biological_sex").$type<"male" | "female">(),
    birth_date: text("birth_date"), // ISO date YYYY-MM-DD
    height_cm: real("height_cm"), // Always stored in cm
    initial_weight_kg: real("initial_weight_kg"), // Always stored in kg
    fitness_goal: text("fitness_goal").$type<
      "lose_fat" | "maintain" | "gain_muscle"
    >(),
    activity_level: text("activity_level").$type<
      "sedentary" | "light" | "moderate" | "active" | "very_active"
    >(),
    onboarding_completed: integer("onboarding_completed", { mode: "boolean" })
      .default(false)
      .notNull(),
    onboarding_completed_at: text("onboarding_completed_at"),

    ...timestamps,
  },
  (t) => [index("idx_user_preferences_user_id").on(t.user_id)]
);

export type BaseUserPreferences = Omit<
  InferSelectModel<typeof user_preferences>,
  "id" | "created_at" | "updated_at" | "user_id"
>;
