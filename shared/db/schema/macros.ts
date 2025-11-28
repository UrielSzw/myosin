import { InferSelectModel } from "drizzle-orm";
import {
  index,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { timestamps } from "../utils/schema-utils";
import { generateUUID } from "../utils/uuid";

// ==================== MACRO TARGETS ====================
// User's daily macro goals
export const macro_targets = sqliteTable(
  "macro_targets",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateUUID()),
    user_id: text("user_id").notNull(),

    // Targets in grams
    protein_target: real("protein_target").notNull(), // g
    carbs_target: real("carbs_target").notNull(), // g
    fats_target: real("fats_target").notNull(), // g
    // calories_target is calculated: P*4 + C*4 + F*9

    // Allow multiple profiles (bulking, cutting, maintenance)
    name: text("name"), // "Cutting", "Bulking", null = default
    is_active: integer("is_active", { mode: "boolean" })
      .default(true)
      .notNull(),

    ...timestamps,
  },
  (t) => [
    index("idx_macro_targets_user").on(t.user_id),
    index("idx_macro_targets_active").on(t.user_id, t.is_active),
  ]
);

// ==================== MACRO ENTRIES ====================
// Individual food/meal entries
export const macro_entries = sqliteTable(
  "macro_entries",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateUUID()),
    user_id: text("user_id").notNull(),

    // Macro values in grams
    protein: real("protein").notNull(),
    carbs: real("carbs").notNull(),
    fats: real("fats").notNull(),
    // calories is calculated on read: P*4 + C*4 + F*9

    // Optional metadata
    label: text("label"), // "Almuerzo", "Snack proteico", etc.
    notes: text("notes"),
    source: text("source")
      .$type<"manual" | "quick_action">()
      .default("manual")
      .notNull(),

    // Temporal
    day_key: text("day_key").notNull(), // 'YYYY-MM-DD'
    recorded_at: text("recorded_at").notNull(), // ISO timestamp

    ...timestamps,
  },
  (t) => [
    index("idx_macro_entries_user").on(t.user_id),
    index("idx_macro_entries_day").on(t.user_id, t.day_key),
    index("idx_macro_entries_recorded").on(t.recorded_at),
  ]
);

// ==================== MACRO DAILY AGGREGATES ====================
// Pre-calculated daily totals (cache)
export const macro_daily_aggregates = sqliteTable(
  "macro_daily_aggregates",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateUUID()),
    user_id: text("user_id").notNull(),
    day_key: text("day_key").notNull(), // 'YYYY-MM-DD'

    // Totals in grams
    total_protein: real("total_protein").notNull(),
    total_carbs: real("total_carbs").notNull(),
    total_fats: real("total_fats").notNull(),
    // total_calories calculated: P*4 + C*4 + F*9

    entry_count: integer("entry_count").notNull(),

    ...timestamps,
  },
  (t) => [
    uniqueIndex("unique_macro_aggregate_day").on(t.user_id, t.day_key),
    index("idx_macro_aggregates_day").on(t.day_key),
  ]
);

// ==================== MACRO QUICK ACTIONS ====================
// Predefined food shortcuts
export const macro_quick_actions = sqliteTable(
  "macro_quick_actions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateUUID()),
    user_id: text("user_id").notNull(),

    // Display
    label: text("label").notNull(), // "Pollo 150g", "Arroz 100g"
    icon: text("icon"), // optional icon key
    color: text("color"), // optional color

    // Macro values
    protein: real("protein").notNull(),
    carbs: real("carbs").notNull(),
    fats: real("fats").notNull(),

    // Ordering
    position: integer("position").default(0).notNull(),

    // Predefined vs custom
    is_predefined: integer("is_predefined", { mode: "boolean" })
      .default(false)
      .notNull(),
    slug: text("slug"), // for predefined: 'chicken_breast_150g', null for custom

    ...timestamps,
  },
  (t) => [
    index("idx_macro_quick_actions_user").on(t.user_id),
    index("idx_macro_quick_actions_position").on(t.user_id, t.position),
  ]
);

// ==================== RELATIONS ====================
// Note: No relations defined yet - tables are standalone
// Relations can be added later if needed for joins with other tables

// ==================== TYPES ====================
export type BaseMacroTarget = InferSelectModel<typeof macro_targets>;
export type BaseMacroEntry = InferSelectModel<typeof macro_entries>;
export type BaseMacroDailyAggregate = InferSelectModel<
  typeof macro_daily_aggregates
>;
export type BaseMacroQuickAction = InferSelectModel<typeof macro_quick_actions>;

// Insert types
export type MacroTargetInsert = Omit<
  BaseMacroTarget,
  "id" | "created_at" | "updated_at"
>;
export type MacroEntryInsert = Omit<
  BaseMacroEntry,
  "id" | "created_at" | "updated_at"
>;
export type MacroDailyAggregateInsert = Omit<
  BaseMacroDailyAggregate,
  "id" | "created_at" | "updated_at"
>;
export type MacroQuickActionInsert = Omit<
  BaseMacroQuickAction,
  "id" | "created_at" | "updated_at"
>;

// ==================== HELPERS ====================
/**
 * Calculate calories from macros
 * Protein: 4 cal/g, Carbs: 4 cal/g, Fats: 9 cal/g
 */
export const calculateCalories = (
  protein: number,
  carbs: number,
  fats: number
): number => {
  return Math.round(protein * 4 + carbs * 4 + fats * 9);
};

/**
 * Extended types with calculated calories
 */
export type MacroEntryWithCalories = BaseMacroEntry & {
  calories: number;
};

export type MacroDailyAggregateWithCalories = BaseMacroDailyAggregate & {
  total_calories: number;
};

export type MacroTargetWithCalories = BaseMacroTarget & {
  calories_target: number;
};

/**
 * Day data structure for UI
 */
export type MacroDayData = {
  day_key: string;
  entries: MacroEntryWithCalories[];
  aggregate: MacroDailyAggregateWithCalories | null;
  target: MacroTargetWithCalories | null;
};
