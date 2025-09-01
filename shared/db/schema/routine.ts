import { InferSelectModel, relations } from "drizzle-orm";
import {
  blob,
  index,
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import {
  IExerciseEquipment,
  IExerciseMuscle,
  IRepsType,
  ISetType,
} from "../../types/workout";
import { timestamps } from "../utils/schema-utils";

// Tabla principal de ejercicios
export const exercises = sqliteTable(
  "exercises",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()), // UUID
    name: text("name").notNull(),

    source: text("source").$type<"system" | "user">().notNull(),
    created_by_user_id: text("created_by_user_id"),

    main_muscle_group: text("main_muscle_group").notNull(),
    primary_equipment: text("primary_equipment").notNull(),

    instructions: text("instructions").notNull(),
    ...timestamps,
  },
  (t) => [
    index("idx_exercises_name").on(t.name),
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
      .$defaultFn(() => crypto.randomUUID()), // UUID
    exercise_id: text("exercise_id")
      .notNull()
      .references(() => exercises.id, { onDelete: "cascade" }),
    url: text("url").notNull(), // puede ser require('./...') o remote URL
    order: integer("order").notNull(), // para saber en qué secuencia mostrarlas
  },
  (t) => [index("idx_exercise_images_exercise_id").on(t.exercise_id)]
);

// Tabla intermedia: ejercicio ↔ músculos (n:n)
export const exerciseMuscleGroups = sqliteTable(
  "exercise_muscle_groups",
  {
    exercise_id: text("exercise_id").notNull(),
    muscle_group: text("muscle_group").$type<IExerciseMuscle>().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.exercise_id, t.muscle_group] }),
    index("idx_exercise_muscle").on(t.muscle_group),
  ]
);

// Tabla intermedia: ejercicio ↔ equipamiento (n:n)
export const exerciseEquipment = sqliteTable(
  "exercise_equipment",
  {
    exercise_id: text("exercise_id").notNull(),
    equipment: text("equipment").$type<IExerciseEquipment>().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.exercise_id, t.equipment] }),
    index("idx_exercise_equipment").on(t.equipment),
  ]
);

// ---------------- Carpetas ----------------
export const folders = sqliteTable("folders", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()), // UUID
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
    .$defaultFn(() => crypto.randomUUID()), // UUID
  name: text("name").notNull(),
  folder_id: text("folder_id").references(() => folders.id),
  created_by_user_id: text("created_by_user_id").notNull(),
  ...timestamps,
});

// ---------------- Bloques ----------------
export const routine_blocks = sqliteTable("routine_blocks", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()), // UUID
  routine_id: text("routine_id")
    .references(() => routines.id)
    .notNull(),

  type: text("type")
    .$type<"warmup" | "strength" | "superset" | "circuit">()
    .notNull(),
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
    .$defaultFn(() => crypto.randomUUID()), // UUID
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
    .$defaultFn(() => crypto.randomUUID()), // UUID
  exercise_in_block_id: text("exercise_in_block_id")
    .references(() => exercise_in_block.id)
    .notNull(),

  reps: integer("reps"),
  weight: real("weight"),
  rpe: real("rpe"),

  order_index: integer("order_index").notNull(),

  set_type: text("set_type").$type<ISetType>().notNull(),

  reps_type: text("reps_type").$type<IRepsType>().notNull(),

  reps_range: blob("reps_range", { mode: "json" }).$type<{
    min: number;
    max: number;
  }>(),

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

// 4. Tipos para inserts (sin timestamps automáticos)
export type RoutineInsert = Omit<BaseRoutine, "created_at" | "updated_at">;
export type BlockInsert = Omit<BaseBlock, "created_at" | "updated_at">;
export type ExerciseInBlockInsert = Omit<
  BaseExerciseInBlock,
  "created_at" | "updated_at"
>;
export type SetInsert = Omit<BaseSet, "created_at" | "updated_at">;
