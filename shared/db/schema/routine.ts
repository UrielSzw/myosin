import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  index,
  integer,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { MeasurementTemplateId } from "../../types/measurement";
import {
  IExerciseEquipment,
  IExerciseMuscle,
  IExerciseSource,
  IExerciseType,
  ISetType,
} from "../../types/workout";
import { timestamps } from "../utils/schema-utils";
import { generateUUID } from "../utils/uuid";

// Tabla principal de ejercicios
export const exercises = sqliteTable(
  "exercises",
  {
    id: text("id").primaryKey(), // UUID
    name: text("name").notNull(),
    name_search: text("name_search"), // lowercase, sin acentos para búsqueda rápida

    source: text("source").$type<IExerciseSource>().notNull(),
    created_by_user_id: text("created_by_user_id"),

    main_muscle_group: text("main_muscle_group")
      .$type<IExerciseMuscle>()
      .notNull(),
    primary_equipment: text("primary_equipment")
      .$type<IExerciseEquipment>()
      .notNull(),
    exercise_type: text("exercise_type").$type<IExerciseType>().notNull(),

    secondary_muscle_groups: text("secondary_muscle_groups", {
      mode: "json",
    })
      .$type<IExerciseMuscle[]>()
      .notNull(),
    instructions: text("instructions", { mode: "json" })
      .$type<string[]>()
      .notNull(),
    equipment: text("equipment", { mode: "json" })
      .$type<IExerciseEquipment[]>()
      .notNull(),
    similar_exercises: text("similar_exercises", { mode: "json" }).$type<
      string[]
    >(),

    // New measurement system
    default_measurement_template: text("default_measurement_template")
      .$type<MeasurementTemplateId>()
      .notNull()
      .default("weight_reps"),

    // Media fields - OPTIONAL to avoid breaking existing exercises
    primary_media_url: text("primary_media_url"),
    primary_media_type: text("primary_media_type").$type<"gif" | "image">(),

    ...timestamps,
  },
  (t) => [
    index("idx_exercises_name").on(t.name),
    index("idx_exercises_name_search").on(t.name_search),
    index("idx_exercises_main_muscle").on(t.main_muscle_group),
    index("idx_exercises_primary_equipment").on(t.primary_equipment),
  ]
);

// Tabla de imágenes asociadas
export const exerciseImages = sqliteTable(
  "exercise_images",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateUUID()), // UUID
    exercise_id: text("exercise_id")
      .notNull()
      .references(() => exercises.id, { onDelete: "cascade" }),
    url: text("url").notNull(), // puede ser require('./...') o remote URL
    order_index: integer("order_index").notNull(), // para saber en qué secuencia mostrarlas
  },
  (t) => [index("idx_exercise_images_exercise_id").on(t.exercise_id)]
);

// ---------------- Carpetas ----------------
export const folders = sqliteTable("folders", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateUUID()), // UUID
  name: text("name").notNull(),
  color: text("color").notNull(),
  icon: text("icon").notNull(),
  order_index: integer("order_index").notNull(),
  created_by_user_id: text("created_by_user_id").notNull(),
  ...timestamps,
});

// ---------------- Rutinas ----------------
export const routines = sqliteTable("routines", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateUUID()), // UUID
  name: text("name").notNull(),
  folder_id: text("folder_id").references(() => folders.id),
  created_by_user_id: text("created_by_user_id").notNull(),

  // Análisis de volumen - días de entrenamiento
  training_days: text("training_days", { mode: "json" }).$type<string[]>(),
  show_rpe: integer("show_rpe", { mode: "boolean" }).default(true).notNull(),
  show_tempo: integer("show_tempo", { mode: "boolean" })
    .default(true)
    .notNull(),

  // Soft delete - NULL = activa, timestamp = eliminada
  deleted_at: text("deleted_at"),

  // Quick workout flag - rutinas temporales ocultas creadas desde Quick Workout
  is_quick_workout: integer("is_quick_workout", { mode: "boolean" })
    .notNull()
    .default(false),

  ...timestamps,
});

// ---------------- Bloques ----------------
export const routine_blocks = sqliteTable("routine_blocks", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateUUID()), // UUID
  user_id: text("user_id").notNull().default("default-user"),
  routine_id: text("routine_id")
    .references(() => routines.id)
    .notNull(),

  type: text("type").$type<"individual" | "superset" | "circuit">().notNull(),
  order_index: integer("order_index").notNull(),
  rest_time_seconds: integer("rest_time_seconds").notNull(),
  rest_between_exercises_seconds: integer(
    "rest_between_exercises_seconds"
  ).notNull(),
  name: text("name").notNull(),

  ...timestamps,
});

// ---------------- Ejercicio en bloque ----------------
export const exercise_in_block = sqliteTable("exercise_in_block", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateUUID()), // UUID
  user_id: text("user_id").notNull().default("default-user"),
  block_id: text("block_id")
    .references(() => routine_blocks.id)
    .notNull(),
  exercise_id: text("exercise_id")
    .references(() => exercises.id)
    .notNull(),
  order_index: integer("order_index").notNull(),
  notes: text("notes"),
  ...timestamps,
});

// ---------------- Sets plantilla ----------------
export const routine_sets = sqliteTable("routine_sets", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateUUID()), // UUID
  user_id: text("user_id").notNull().default("default-user"),
  exercise_in_block_id: text("exercise_in_block_id")
    .references(() => exercise_in_block.id)
    .notNull(),

  // New measurement system
  measurement_template: text("measurement_template")
    .$type<MeasurementTemplateId>()
    .notNull(),

  // Measurement values (max 2)
  primary_value: real("primary_value"),
  secondary_value: real("secondary_value"),

  // Range support for both fields
  primary_range: text("primary_range", { mode: "json" }).$type<{
    min: number;
    max: number;
  }>(),
  secondary_range: text("secondary_range", { mode: "json" }).$type<{
    min: number;
    max: number;
  }>(),

  // Existing metadata
  rpe: real("rpe"),
  tempo: text("tempo"), // "3-1-2-1" o NULL
  order_index: integer("order_index").notNull(),
  set_type: text("set_type").$type<ISetType>().notNull(),

  ...timestamps,
});

// Relaciones de routines
export const routinesRelations = relations(routines, ({ one, many }) => ({
  // Una rutina pertenece a una carpeta (many-to-one)
  folder: one(folders, {
    fields: [routines.folder_id],
    references: [folders.id],
  }),
  // Una rutina tiene muchos bloques (one-to-many)
  blocks: many(routine_blocks),
}));

// Relaciones de routine_blocks
export const routineBlocksRelations = relations(
  routine_blocks,
  ({ one, many }) => ({
    // Un bloque pertenece a una rutina (many-to-one)
    routine: one(routines, {
      fields: [routine_blocks.routine_id],
      references: [routines.id],
    }),
    // Un bloque tiene muchos ejercicios (one-to-many)
    exercises: many(exercise_in_block),
  })
);

// Relaciones de exercise_in_block
export const exerciseInBlockRelations = relations(
  exercise_in_block,
  ({ one, many }) => ({
    // Un exercise_in_block pertenece a un bloque (many-to-one)
    block: one(routine_blocks, {
      fields: [exercise_in_block.block_id],
      references: [routine_blocks.id],
    }),
    // Un exercise_in_block referencia un ejercicio (many-to-one)
    exercise: one(exercises, {
      fields: [exercise_in_block.exercise_id],
      references: [exercises.id],
    }),
    // Un exercise_in_block tiene muchos sets (one-to-many)
    sets: many(routine_sets),
  })
);

// Relaciones de routine_sets
export const routineSetsRelations = relations(routine_sets, ({ one }) => ({
  // Un set pertenece a un exercise_in_block (many-to-one)
  exerciseInBlock: one(exercise_in_block, {
    fields: [routine_sets.exercise_in_block_id],
    references: [exercise_in_block.id],
  }),
}));

// Relaciones de exercises (opcional, para query inversa)
export const exercisesRelations = relations(exercises, ({ many }) => ({
  // Un ejercicio puede estar en muchos bloques (one-to-many)
  exerciseInBlocks: many(exercise_in_block),
}));

// Relaciones de folders (opcional, para query inversa)
export const foldersRelations = relations(folders, ({ many }) => ({
  // Una carpeta tiene muchas rutinas (one-to-many)
  routines: many(routines),
}));

// 1. Tipos base (entidades puras)
export type BaseRoutine = InferSelectModel<typeof routines>;
export type BaseFolder = InferSelectModel<typeof folders>;
export type BaseExercise = InferSelectModel<typeof exercises>;
export type BaseBlock = InferSelectModel<typeof routine_blocks>;
export type BaseExerciseInBlock = InferSelectModel<typeof exercise_in_block>;
export type BaseSet = InferSelectModel<typeof routine_sets>;

// 2. Tipos con relaciones comunes (para reutilizar)
export type RoutineWithFolder = BaseRoutine & {
  folder: BaseFolder | null;
};

export type BlockWithExercises = BaseBlock & {
  exercises: ExerciseInBlockFull[];
};

export type ExerciseInBlockFull = BaseExerciseInBlock & {
  exercise: BaseExercise;
  sets: BaseSet[];
};

export type RoutineFull = BaseRoutine & {
  folder: BaseFolder | null;
  blocks: BlockWithExercises[];
};

// 3. Re-exportar para compatibilidad
export type SRoutine = BaseRoutine;
export type SFolder = BaseFolder;
export type SBlocks = BlockWithExercises;

// 4. Tipos para inserts (sin timestamps automáticos, deleted_at opcional)
export type RoutineInsert = Omit<
  BaseRoutine,
  "created_at" | "updated_at" | "deleted_at" | "is_quick_workout"
> & {
  deleted_at?: string | null;
  is_quick_workout?: boolean;
};
export type BlockInsert = Omit<BaseBlock, "created_at" | "updated_at">;
export type ExerciseInBlockInsert = Omit<
  BaseExerciseInBlock,
  "created_at" | "updated_at"
>;
export type SetInsert = Omit<BaseSet, "created_at" | "updated_at">;

// 5. Otros tipos útiles
// Use InferInsertModel to respect optional columns (name_search, primary_media_url, primary_media_type)
export type ExerciseInsert = Omit<
  InferInsertModel<typeof exercises>,
  "created_at" | "updated_at"
> & {
  images: string[];
};
