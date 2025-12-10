import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { timestamps } from "../utils/schema-utils";
import { generateUUID } from "../utils/uuid";
import { exercises } from "./routine";

// ============================================================================
// TYPES
// ============================================================================

export type ProgressionRelationshipType =
  | "progression" // from es más fácil que to
  | "prerequisite" // from es REQUERIDO para to
  | "variation" // alternativas del mismo nivel
  | "regression"; // from es más difícil que to

export type ProgressionUnlockCriteriaType =
  | "reps" // X repeticiones
  | "time" // X segundos
  | "weight" // X peso mínimo
  | "weight_reps" // X peso por Y reps
  | "sets_reps" // X sets de Y reps
  | "manual"; // El usuario decide

export type ProgressionPathCategory =
  | "vertical_pull" // Pull-ups → Muscle-ups → One Arm
  | "horizontal_pull" // Rows → Front Lever
  | "vertical_push" // Dips → HSPU
  | "horizontal_push" // Push-ups → Planche
  | "squat" // Squat → Pistol
  | "hinge" // Hinge → Nordic
  | "core" // L-sit → Manna
  | "skill"; // Handstand, etc.

export type UserExerciseUnlockStatus =
  | "locked" // No puede hacerlo aún
  | "unlocking" // En progreso (>50% del criterio)
  | "unlocked" // Cumplió criterio de unlock
  | "mastered"; // Cumplió criterio de mastery

export interface UnlockCriteria {
  type: ProgressionUnlockCriteriaType;
  primary_value: number; // 8 reps, 30 segundos, 10kg
  secondary_value?: number; // Para weight_reps: el segundo valor (reps)
  sets?: number; // Para sets_reps: "3 sets of 8"
  description_key: string; // Key for translation: "criteria.pullups_3x8"
}

export interface UnlockProgress {
  current_value: number;
  target_value: number;
  percentage: number;
}

// ============================================================================
// TABLE 1: exercise_progressions
// Almacena las relaciones entre ejercicios (read-only, synced from Supabase)
// ============================================================================

export const exerciseProgressions = sqliteTable(
  "exercise_progressions",
  {
    id: text("id").primaryKey(),

    // ===== RELACIÓN =====
    from_exercise_id: text("from_exercise_id").notNull(),
    to_exercise_id: text("to_exercise_id").notNull(),

    // ===== TIPO DE RELACIÓN =====
    relationship_type: text("relationship_type")
      .$type<ProgressionRelationshipType>()
      .notNull(),

    // ===== CRITERIOS DE UNLOCK =====
    // Qué debe lograr el usuario en "from" para desbloquear "to"
    unlock_criteria: text("unlock_criteria", {
      mode: "json",
    }).$type<UnlockCriteria | null>(),

    // ===== METADATA =====
    difficulty_delta: integer("difficulty_delta").default(1), // +1, +2, -1 para regression
    notes: text("notes"), // Tips, técnica (translation key)
    source: text("source").$type<"system" | "community">().default("system"),

    ...timestamps,
  },
  (t) => [
    index("idx_progressions_from").on(t.from_exercise_id),
    index("idx_progressions_to").on(t.to_exercise_id),
    index("idx_progressions_type").on(t.relationship_type),
  ]
);

// ============================================================================
// TABLE 2: progression_paths
// Agrupa ejercicios en "caminos" hacia un objetivo final (read-only)
// ============================================================================

export const progressionPaths = sqliteTable(
  "progression_paths",
  {
    id: text("id").primaryKey(),

    // ===== IDENTIFICACIÓN =====
    slug: text("slug").notNull().unique(), // "pullup-progression"
    name_key: text("name_key").notNull(), // Translation key: "paths.pullup.name"
    description_key: text("description_key"), // Translation key: "paths.pullup.description"

    // ===== CATEGORÍA =====
    category: text("category").$type<ProgressionPathCategory>().notNull(),

    // ===== OBJETIVO FINAL =====
    ultimate_exercise_id: text("ultimate_exercise_id"),

    // ===== UI =====
    icon: text("icon"), // Lucide icon name
    color: text("color"), // Hex color

    ...timestamps,
  },
  (t) => [
    index("idx_paths_slug").on(t.slug),
    index("idx_paths_category").on(t.category),
  ]
);

// ============================================================================
// TABLE 3: progression_path_exercises
// Relaciona ejercicios con sus paths y define el nivel (read-only)
// ============================================================================

export const progressionPathExercises = sqliteTable(
  "progression_path_exercises",
  {
    id: text("id").primaryKey(),

    path_id: text("path_id").notNull(),
    exercise_id: text("exercise_id").notNull(),

    // ===== NIVEL EN EL PATH =====
    level: integer("level").notNull(), // 1 = más fácil, 10 = skill final

    // ===== FLAGS =====
    is_main_path: integer("is_main_path", { mode: "boolean" }).default(true),
    // false = variación alternativa, no el camino principal

    ...timestamps,
  },
  (t) => [
    index("idx_path_exercises_path").on(t.path_id),
    index("idx_path_exercises_exercise").on(t.exercise_id),
    uniqueIndex("idx_path_exercises_unique").on(t.path_id, t.exercise_id),
  ]
);

// ============================================================================
// TABLE 4: user_exercise_unlocks
// Trackea el progreso del usuario en cada ejercicio (synced bidirectionally)
// ============================================================================

export const userExerciseUnlocks = sqliteTable(
  "user_exercise_unlocks",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateUUID()),

    user_id: text("user_id").notNull(),
    exercise_id: text("exercise_id").notNull(),

    // ===== ESTADO =====
    status: text("status")
      .$type<UserExerciseUnlockStatus>()
      .notNull()
      .default("locked"),

    // ===== UNLOCK INFO =====
    unlocked_at: text("unlocked_at"),
    unlocked_by_exercise_id: text("unlocked_by_exercise_id"),
    unlocked_by_pr_id: text("unlocked_by_pr_id"),

    // ===== PROGRESO ACTUAL =====
    current_progress: text("current_progress", {
      mode: "json",
    }).$type<UnlockProgress | null>(),

    // ===== OVERRIDE MANUAL =====
    manually_unlocked: integer("manually_unlocked", {
      mode: "boolean",
    }).default(false),
    manually_unlocked_at: text("manually_unlocked_at"),

    // ===== SYNC =====
    is_synced: integer("is_synced", { mode: "boolean" })
      .default(false)
      .notNull(),

    ...timestamps,
  },
  (t) => [
    uniqueIndex("idx_unlocks_user_exercise").on(t.user_id, t.exercise_id),
    index("idx_unlocks_user").on(t.user_id),
    index("idx_unlocks_status").on(t.status),
  ]
);

// ============================================================================
// RELATIONS
// ============================================================================

export const exerciseProgressionsRelations = relations(
  exerciseProgressions,
  ({ one }) => ({
    fromExercise: one(exercises, {
      fields: [exerciseProgressions.from_exercise_id],
      references: [exercises.id],
      relationName: "progressionFrom",
    }),
    toExercise: one(exercises, {
      fields: [exerciseProgressions.to_exercise_id],
      references: [exercises.id],
      relationName: "progressionTo",
    }),
  })
);

export const progressionPathsRelations = relations(
  progressionPaths,
  ({ many, one }) => ({
    exercises: many(progressionPathExercises),
    ultimateExercise: one(exercises, {
      fields: [progressionPaths.ultimate_exercise_id],
      references: [exercises.id],
    }),
  })
);

export const progressionPathExercisesRelations = relations(
  progressionPathExercises,
  ({ one }) => ({
    path: one(progressionPaths, {
      fields: [progressionPathExercises.path_id],
      references: [progressionPaths.id],
    }),
    exercise: one(exercises, {
      fields: [progressionPathExercises.exercise_id],
      references: [exercises.id],
    }),
  })
);

export const userExerciseUnlocksRelations = relations(
  userExerciseUnlocks,
  ({ one }) => ({
    exercise: one(exercises, {
      fields: [userExerciseUnlocks.exercise_id],
      references: [exercises.id],
    }),
    unlockedByExercise: one(exercises, {
      fields: [userExerciseUnlocks.unlocked_by_exercise_id],
      references: [exercises.id],
    }),
  })
);

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type ExerciseProgression = InferSelectModel<typeof exerciseProgressions>;
export type ExerciseProgressionInsert = InferInsertModel<
  typeof exerciseProgressions
>;

export type ProgressionPath = InferSelectModel<typeof progressionPaths>;
export type ProgressionPathInsert = InferInsertModel<typeof progressionPaths>;

export type ProgressionPathExercise = InferSelectModel<
  typeof progressionPathExercises
>;
export type ProgressionPathExerciseInsert = InferInsertModel<
  typeof progressionPathExercises
>;

export type UserExerciseUnlock = InferSelectModel<typeof userExerciseUnlocks>;
export type UserExerciseUnlockInsert = InferInsertModel<
  typeof userExerciseUnlocks
>;
