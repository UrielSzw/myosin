import { InferSelectModel, relations } from "drizzle-orm";
import {
  blob,
  index,
  integer,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import * as Crypto from "expo-crypto";
import { IRepsType, ISetType } from "../../types/workout";
import { timestamps } from "../utils/schema-utils";
import {
  exercise_in_block,
  exercises,
  routine_blocks,
  routine_sets,
  routines,
} from "./routine";

// ---------------- Sesiones de Workout ----------------
export const workout_sessions = sqliteTable(
  "workout_sessions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => Crypto.randomUUID()),
    routine_id: text("routine_id")
      .references(() => routines.id)
      .notNull(),

    started_at: text("started_at").notNull(), // ISO timestamp
    finished_at: text("finished_at").notNull(), // ISO timestamp
    total_duration_seconds: integer("total_duration_seconds").notNull(),

    // Analytics agregadas
    total_sets_planned: integer("total_sets_planned").notNull(),
    total_sets_completed: integer("total_sets_completed").notNull(),
    total_volume_kg: real("total_volume_kg"),
    average_rpe: real("average_rpe"),

    ...timestamps,
  },
  (t) => [
    index("idx_workout_sessions_routine_id").on(t.routine_id),
    index("idx_workout_sessions_started_at").on(t.started_at),
  ]
);

// ---------------- Bloques de Workout ----------------
export const workout_blocks = sqliteTable(
  "workout_blocks",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => Crypto.randomUUID()),
    workout_session_id: text("workout_session_id")
      .references(() => workout_sessions.id, { onDelete: "cascade" })
      .notNull(),

    // Referencia al bloque original (NULL si se agregó durante workout)
    original_block_id: text("original_block_id").references(
      () => routine_blocks.id
    ),

    type: text("type").$type<"individual" | "superset" | "circuit">().notNull(),
    order_index: integer("order_index").notNull(),
    name: text("name").notNull(),

    rest_time_seconds: integer("rest_time_seconds").notNull(),
    rest_between_exercises_seconds: integer(
      "rest_between_exercises_seconds"
    ).notNull(),

    // Tracking
    was_added_during_workout: integer("was_added_during_workout", {
      mode: "boolean",
    })
      .default(false)
      .notNull(),

    ...timestamps,
  },
  (t) => [
    index("idx_workout_blocks_session_id").on(t.workout_session_id),
    index("idx_workout_blocks_original_id").on(t.original_block_id),
  ]
);

// ---------------- Ejercicios de Workout ----------------
export const workout_exercises = sqliteTable(
  "workout_exercises",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => Crypto.randomUUID()),
    workout_block_id: text("workout_block_id")
      .references(() => workout_blocks.id, { onDelete: "cascade" })
      .notNull(),
    exercise_id: text("exercise_id")
      .references(() => exercises.id)
      .notNull(),

    // Referencia original (NULL si se agregó durante workout)
    original_exercise_in_block_id: text(
      "original_exercise_in_block_id"
    ).references(() => exercise_in_block.id),

    order_index: integer("order_index").notNull(), // Orden dentro del bloque
    execution_order: integer("execution_order"), // Orden real de ejecución
    notes: text("notes"),

    // Tracking
    was_added_during_workout: integer("was_added_during_workout", {
      mode: "boolean",
    })
      .default(false)
      .notNull(),

    ...timestamps,
  },
  (t) => [
    index("idx_workout_exercises_block_id").on(t.workout_block_id),
    index("idx_workout_exercises_exercise_id").on(t.exercise_id),
    index("idx_workout_exercises_execution_order").on(t.execution_order),
  ]
);

// ---------------- Sets de Workout ----------------
export const workout_sets = sqliteTable(
  "workout_sets",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => Crypto.randomUUID()),
    workout_exercise_id: text("workout_exercise_id")
      .references(() => workout_exercises.id, { onDelete: "cascade" })
      .notNull(),

    // Referencia original (NULL si se agregó durante workout)
    original_set_id: text("original_set_id").references(() => routine_sets.id),

    order_index: integer("order_index").notNull(), // Orden dentro del ejercicio

    // Datos planificados (de la rutina original)
    planned_weight: real("planned_weight"),
    planned_reps: integer("planned_reps"),
    planned_rpe: real("planned_rpe"),

    // Datos reales ejecutados
    actual_weight: real("actual_weight"),
    actual_reps: integer("actual_reps"),
    actual_rpe: real("actual_rpe"),

    // Config del set
    set_type: text("set_type").$type<ISetType>().notNull(),
    reps_type: text("reps_type").$type<IRepsType>().notNull(),
    reps_range: blob("reps_range", { mode: "json" }).$type<{
      min: number | null;
      max: number | null;
    }>(),

    // Estado simple
    completed: integer("completed", { mode: "boolean" })
      .default(false)
      .notNull(),

    ...timestamps,
  },
  (t) => [
    index("idx_workout_sets_exercise_id").on(t.workout_exercise_id),
    index("idx_workout_sets_original_id").on(t.original_set_id),
    index("idx_workout_sets_completed").on(t.completed),
  ]
);

// ---------------- Relaciones ----------------

// Relaciones de workout_sessions
export const workoutSessionsRelations = relations(
  workout_sessions,
  ({ one, many }) => ({
    // Una sesión pertenece a una rutina (many-to-one)
    routine: one(routines, {
      fields: [workout_sessions.routine_id],
      references: [routines.id],
    }),
    // Una sesión tiene muchos bloques (one-to-many)
    blocks: many(workout_blocks),
  })
);

// Relaciones de workout_blocks
export const workoutBlocksRelations = relations(
  workout_blocks,
  ({ one, many }) => ({
    // Un bloque pertenece a una sesión (many-to-one)
    workoutSession: one(workout_sessions, {
      fields: [workout_blocks.workout_session_id],
      references: [workout_sessions.id],
    }),
    // Un bloque puede referenciar un bloque original (many-to-one)
    originalBlock: one(routine_blocks, {
      fields: [workout_blocks.original_block_id],
      references: [routine_blocks.id],
    }),
    // Un bloque tiene muchos ejercicios (one-to-many)
    exercises: many(workout_exercises),
  })
);

// Relaciones de workout_exercises
export const workoutExercisesRelations = relations(
  workout_exercises,
  ({ one, many }) => ({
    // Un ejercicio pertenece a un bloque (many-to-one)
    workoutBlock: one(workout_blocks, {
      fields: [workout_exercises.workout_block_id],
      references: [workout_blocks.id],
    }),
    // Un ejercicio referencia un ejercicio base (many-to-one)
    exercise: one(exercises, {
      fields: [workout_exercises.exercise_id],
      references: [exercises.id],
    }),
    // Un ejercicio puede referenciar un exercise_in_block original (many-to-one)
    originalExerciseInBlock: one(exercise_in_block, {
      fields: [workout_exercises.original_exercise_in_block_id],
      references: [exercise_in_block.id],
    }),
    // Un ejercicio tiene muchos sets (one-to-many)
    sets: many(workout_sets),
  })
);

// Relaciones de workout_sets
export const workoutSetsRelations = relations(workout_sets, ({ one }) => ({
  // Un set pertenece a un ejercicio (many-to-one)
  workoutExercise: one(workout_exercises, {
    fields: [workout_sets.workout_exercise_id],
    references: [workout_exercises.id],
  }),
  // Un set puede referenciar un set original (many-to-one)
  originalSet: one(routine_sets, {
    fields: [workout_sets.original_set_id],
    references: [routine_sets.id],
  }),
}));

// ---------------- Tipos ----------------

// 1. Tipos base (entidades puras)
export type BaseWorkoutSession = InferSelectModel<typeof workout_sessions>;
export type BaseWorkoutBlock = InferSelectModel<typeof workout_blocks>;
export type BaseWorkoutExercise = InferSelectModel<typeof workout_exercises>;
export type BaseWorkoutSet = InferSelectModel<typeof workout_sets>;

// 2. Tipos con relaciones comunes
export type WorkoutBlockWithExercises = BaseWorkoutBlock & {
  exercises: WorkoutExerciseWithSets[];
};

export type WorkoutExerciseWithSets = BaseWorkoutExercise & {
  exercise: {
    id: string;
    name: string;
    main_muscle_group: string;
    primary_equipment: string;
    instructions: string;
  };
  sets: BaseWorkoutSet[];
};

export type WorkoutSessionFull = BaseWorkoutSession & {
  routine: {
    id: string;
    name: string;
  };
  blocks: WorkoutBlockWithExercises[];
};

// 3. Tipos para inserts (sin timestamps automáticos)
export type WorkoutSessionInsert = Omit<
  BaseWorkoutSession,
  "created_at" | "updated_at"
>;
export type WorkoutBlockInsert = Omit<
  BaseWorkoutBlock,
  "created_at" | "updated_at"
>;
export type WorkoutExerciseInsert = Omit<
  BaseWorkoutExercise,
  "created_at" | "updated_at"
>;
export type WorkoutSetInsert = Omit<
  BaseWorkoutSet,
  "created_at" | "updated_at"
>;
