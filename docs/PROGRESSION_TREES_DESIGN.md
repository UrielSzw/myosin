# 🌳 Progression Trees - Diseño Completo

> Sistema de progresiones de ejercicios para calistenia y bodyweight training. Permite trackear el avance del usuario desde ejercicios básicos hasta skills avanzados.

---

## 📋 Índice

1. [Visión General](#visión-general)
2. [Análisis de Mercado](#análisis-de-mercado)
3. [Estado Actual de Myosin](#estado-actual-de-myosin)
4. [Diseño del Sistema](#diseño-del-sistema)
5. [Schema de Base de Datos](#schema-de-base-de-datos)
6. [Lógica de Negocio](#lógica-de-negocio)
7. [Integración con PRs](#integración-con-prs)
8. [Diseño de UI/UX](#diseño-de-uiux)
9. [Seed Data - Progresiones](#seed-data---progresiones)
10. [Roadmap de Implementación](#roadmap-de-implementación)

---

## Visión General

### El Problema

La calistenia tiene una característica única vs el entrenamiento con pesas: **la progresión no es lineal en peso, sino en variaciones de ejercicios**. Un usuario no puede simplemente "agregar 2.5kg" a una dominada - debe progresar de Negative Pull-ups → Pull-ups → Weighted Pull-ups → One Arm Pull-ups.

### La Solución

Un sistema de **Progression Trees** que:

1. **Mapea relaciones** entre ejercicios (prerequisitos, progresiones, variaciones)
2. **Detecta unlocks automáticamente** basándose en PRs del usuario
3. **Visualiza el progreso** hacia skills avanzados (Muscle-up, Planche, etc.)
4. **Sugiere el siguiente paso** en el journey del usuario

### Propuesta de Valor

```
"Myosin te muestra exactamente qué ejercicio debes dominar
para desbloquear el siguiente nivel de tu entrenamiento"
```

---

## Análisis de Mercado

### Apps Competidoras

| App              | Progressions              | Auto-Detection | Visual Tree       | Precio     |
| ---------------- | ------------------------- | -------------- | ----------------- | ---------- |
| **THENX**        | ✅ Tutoriales paso a paso | ❌ Manual      | ❌ No             | $120/año   |
| **Madbarz**      | 🟡 Programas fijos        | ❌ Manual      | ❌ No             | Freemium   |
| **Freeletics**   | 🟡 AI sugiere             | 🟡 Parcial     | ❌ No             | $90/año    |
| **Calisteniapp** | ✅ Por skill              | ❌ Manual      | 🟡 Básico         | Freemium   |
| **Myosin**       | 🎯 **Full system**        | 🎯 **Via PRs** | 🎯 **Skill tree** | **Gratis** |

### Estándar de la Industria: r/bodyweightfitness

El subreddit de bodyweight fitness (2M+ usuarios) estableció estándares que la comunidad respeta:

#### Criterios de Progresión Universales

| Tipo de Ejercicio | Criterio para Avanzar | Criterio de Mastery  |
| ----------------- | --------------------- | -------------------- |
| **Dinámico**      | 3 sets × 8 reps       | 3 sets × 12 reps     |
| **Isométrico**    | 3 sets × 30 segundos  | 3 sets × 60 segundos |

#### Progresiones Establecidas (Recommended Routine)

**Pull-up Progression:**

```
Scapular Pulls → Arch Hangs → Negative Pull-ups → Pull-ups → Weighted Pull-ups → One Arm Pull-up
```

**Push-up Progression:**

```
Incline Push-up → Regular Push-up → Diamond Push-up → Archer Push-up → Pseudo Planche Push-up → One Arm Push-up
```

**Dip Progression:**

```
Bench Dip → Negative Dip → Parallel Bar Dip → Ring Dip → Weighted Dip
```

**Squat Progression:**

```
Assisted Squat → Air Squat → Bulgarian Split Squat → Shrimp Squat → Pistol Squat
```

**Row Progression:**

```
Vertical Row → Incline Row → Horizontal Row → Archer Row → Front Lever Row
```

**L-Sit Progression:**

```
Foot Supported L-Sit → One Leg L-Sit → Tuck L-Sit → Full L-Sit → V-Sit → Manna
```

### Skills Avanzados ("Endgame")

Los objetivos aspiracionales que motivan a la comunidad de calistenia:

| Skill                 | Dificultad | Prerequisitos Clave                    |
| --------------------- | ---------- | -------------------------------------- |
| **Muscle-Up**         | ⭐⭐⭐     | 10+ Pull-ups + 15+ Dips                |
| **Front Lever**       | ⭐⭐⭐⭐   | 15+ Pull-ups + Core fuerte             |
| **Back Lever**        | ⭐⭐⭐     | German Hang + Tuck Back Lever          |
| **Planche**           | ⭐⭐⭐⭐⭐ | Pseudo Planche Push-ups + Planche Lean |
| **Human Flag**        | ⭐⭐⭐⭐   | One Arm Pull-up strength + Side plank  |
| **One Arm Pull-up**   | ⭐⭐⭐⭐⭐ | 20+ Pull-ups + Archer Pull-ups         |
| **Handstand Push-up** | ⭐⭐⭐     | Wall Handstand + Pike Push-ups         |

---

## Estado Actual de Myosin

### ✅ Fortalezas Existentes

#### Equipment Types para Calistenia

```typescript
// Ya soportados
"bodyweight" |
  "pull_up_bar" |
  "dip_station" |
  "parallel_bars" |
  "resistance_band" |
  "suspension_trainer";
```

#### Measurement Templates Compatibles

| Template            | Uso en Calistenia                  | Ejemplo         |
| ------------------- | ---------------------------------- | --------------- |
| `weight_reps`       | Pull-ups, Push-ups, Dips           | 0kg × 8 reps    |
| `time_only`         | Plancha, Hollow Hold, Hang         | 45 segundos     |
| `weight_time`       | Weighted Plank, Dead Hang con peso | 10kg × 30s      |
| `weight_reps_range` | Programación flexible              | 0kg × 8-12 reps |

#### Set Types Relevantes

| Tipo        | Aplicación en Calistenia            |
| ----------- | ----------------------------------- |
| `isometric` | Plancha, L-sit, Hollow hold, Levers |
| `warmup`    | Movilidad pre-workout               |
| `failure`   | AMRAP en bodyweight                 |
| `eccentric` | Negative pull-ups, negative dips    |

#### Block Types

| Tipo       | Uso                               |
| ---------- | --------------------------------- |
| `circuit`  | Rondas estilo calistenia/crossfit |
| `superset` | Pares antagonistas (push/pull)    |

#### Timers Existentes

- `SingleSetTimerSheet`: Para ejercicios `time_only`
- `CircuitTimerModeV2`: Para circuitos con timer automático

### ⚠️ Gap Principal: `similar_exercises`

El campo actual es un **array plano sin jerarquía ni metadata**:

```typescript
// Estado actual - limitado
similar_exercises: ["uuid-a", "uuid-b"]; // Sin dirección, sin criterios
```

**Problemas:**

1. No indica qué ejercicio es más fácil/difícil
2. No tiene criterios de cuándo "avanzar"
3. No permite múltiples tipos de relación
4. No trackea progreso del usuario

---

## Diseño del Sistema

### Conceptos Clave

#### 1. Relationship Types

| Tipo           | Descripción               | Ejemplo                    |
| -------------- | ------------------------- | -------------------------- |
| `progression`  | A es más fácil que B      | Negative Pull-up → Pull-up |
| `prerequisite` | A es **requerido** para B | Pull-up → Muscle-up        |
| `variation`    | A y B son del mismo nivel | Pull-up ↔ Chin-up          |
| `regression`   | A es más difícil que B    | Pull-up → Inverted Row     |

#### 2. Unlock Criteria Types

| Tipo          | Descripción       | Ejemplo            |
| ------------- | ----------------- | ------------------ |
| `reps`        | X repeticiones    | 8 reps             |
| `time`        | X segundos        | 30 segundos        |
| `sets_reps`   | X sets de Y reps  | 3×8 (estándar BWF) |
| `weight`      | X peso mínimo     | 10kg               |
| `weight_reps` | X peso por Y reps | 10kg × 5           |
| `manual`      | El usuario decide | -                  |

#### 3. User Exercise States

```
┌─────────┐     ┌───────────┐     ┌──────────┐     ┌──────────┐
│ LOCKED  │ ──► │ UNLOCKING │ ──► │ UNLOCKED │ ──► │ MASTERED │
└─────────┘     └───────────┘     └──────────┘     └──────────┘
    │               │                  │                │
    │           >50% del            Cumplió          Cumplió
    │           criterio           criterio          mastery
    │                              de unlock         (3×12)
    │
    └── Usuario nunca ha
        intentado el ejercicio
```

#### 4. Progression Paths

Agrupaciones lógicas de ejercicios hacia un objetivo:

```typescript
type ProgressionPathCategory =
  | "vertical_pull" // Pull-ups → Muscle-ups → One Arm
  | "horizontal_pull" // Rows → Front Lever
  | "vertical_push" // Dips → HSPU
  | "horizontal_push" // Push-ups → Planche
  | "squat" // Squat → Pistol
  | "hinge" // Hinge → Nordic
  | "core" // L-sit → Manna
  | "skill"; // Handstand, etc.
```

### Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER WORKOUT                            │
│                    (completa sets, logra PRs)                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PR DETECTION                               │
│              (sistema existente de PRs)                         │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   UNLOCK DETECTION SERVICE                      │
│                                                                 │
│  1. Obtener PR del ejercicio completado                         │
│  2. Buscar progressions que tengan este ejercicio como "from"   │
│  3. Evaluar criterios de unlock                                 │
│  4. Actualizar user_exercise_unlocks                            │
│  5. Emitir notificación si hay nuevo unlock                     │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NOTIFICATION SYSTEM                          │
│         "🎉 You unlocked Pull-ups! Ready to try?"              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Schema de Base de Datos

### Tabla 1: `exercise_progressions`

Almacena las relaciones entre ejercicios.

```typescript
export const exerciseProgressions = sqliteTable("exercise_progressions", {
  id: text("id").primaryKey(),

  // ===== RELACIÓN =====
  from_exercise_id: text("from_exercise_id").notNull(),
  to_exercise_id: text("to_exercise_id").notNull(),

  // ===== TIPO DE RELACIÓN =====
  relationship_type: text("relationship_type")
    .$type<
      | "progression" // from es más fácil que to
      | "prerequisite" // from es REQUERIDO para to
      | "variation" // alternativas del mismo nivel
      | "regression" // from es más difícil que to
    >()
    .notNull(),

  // ===== CRITERIOS DE UNLOCK =====
  // Qué debe lograr el usuario en "from" para desbloquear "to"
  unlock_criteria: text("unlock_criteria", { mode: "json" }).$type<{
    type: "reps" | "time" | "weight" | "weight_reps" | "sets_reps" | "manual";
    primary_value: number; // 8 reps, 30 segundos, 10kg
    secondary_value?: number; // Para weight_reps: el segundo valor
    sets?: number; // Para sets_reps: "3 sets of 8"
    description: string; // "3×8 strict Pull-ups"
  }>(),

  // ===== METADATA =====
  difficulty_delta: integer("difficulty_delta").default(1), // +1, +2, -1 para regression
  notes: text("notes"), // Tips, técnica
  source: text("source").default("system"), // 'system' | 'community'

  // ===== TIMESTAMPS =====
  created_at: text("created_at").notNull(),
  updated_at: text("updated_at").notNull(),
});

// Índices
export const exerciseProgressionsFromIdx = index(
  "exercise_progressions_from_idx"
).on(exerciseProgressions.from_exercise_id);
export const exerciseProgressionsToIdx = index(
  "exercise_progressions_to_idx"
).on(exerciseProgressions.to_exercise_id);
```

### Tabla 2: `progression_paths`

Agrupa ejercicios en "caminos" hacia un objetivo final.

```typescript
export const progressionPaths = sqliteTable("progression_paths", {
  id: text("id").primaryKey(),

  // ===== IDENTIFICACIÓN =====
  name: text("name").notNull(), // "Pull-up Progression"
  slug: text("slug").notNull().unique(), // "pullup-progression"
  description: text("description"),

  // ===== CATEGORÍA =====
  category: text("category")
    .$type<
      | "vertical_pull"
      | "horizontal_pull"
      | "vertical_push"
      | "horizontal_push"
      | "squat"
      | "hinge"
      | "core"
      | "skill"
    >()
    .notNull(),

  // ===== OBJETIVO FINAL =====
  // El "endgame" de este path
  ultimate_exercise_id: text("ultimate_exercise_id"),

  // ===== UI =====
  icon: text("icon"), // Lucide icon name
  color: text("color"), // Hex color

  // ===== TIMESTAMPS =====
  created_at: text("created_at").notNull(),
  updated_at: text("updated_at").notNull(),
});
```

### Tabla 3: `progression_path_exercises`

Relaciona ejercicios con sus paths y define el nivel de dificultad.

```typescript
export const progressionPathExercises = sqliteTable(
  "progression_path_exercises",
  {
    id: text("id").primaryKey(),

    path_id: text("path_id")
      .notNull()
      .references(() => progressionPaths.id, { onDelete: "cascade" }),

    exercise_id: text("exercise_id").notNull(),

    // ===== NIVEL EN EL PATH =====
    level: integer("level").notNull(), // 1 = más fácil, 10 = skill final

    // ===== FLAGS =====
    is_main_path: integer("is_main_path", { mode: "boolean" }).default(true),
    // false = variación alternativa, no el camino principal

    // ===== TIMESTAMPS =====
    created_at: text("created_at").notNull(),
    updated_at: text("updated_at").notNull(),
  }
);

// Índice compuesto
export const pathExercisesIdx = index("progression_path_exercises_idx").on(
  progressionPathExercises.path_id,
  progressionPathExercises.exercise_id
);
```

### Tabla 4: `user_exercise_unlocks`

Trackea el progreso del usuario en cada ejercicio.

```typescript
export const userExerciseUnlocks = sqliteTable("user_exercise_unlocks", {
  id: text("id").primaryKey(),

  user_id: text("user_id").notNull(),
  exercise_id: text("exercise_id").notNull(),

  // ===== ESTADO =====
  status: text("status")
    .$type<
      | "locked" // No puede hacerlo aún
      | "unlocking" // En progreso (>50% del criterio)
      | "unlocked" // Cumplió criterio de unlock
      | "mastered" // Cumplió criterio de mastery
    >()
    .notNull()
    .default("locked"),

  // ===== UNLOCK INFO =====
  unlocked_at: text("unlocked_at"),
  unlocked_by_exercise_id: text("unlocked_by_exercise_id"),
  unlocked_by_pr_id: text("unlocked_by_pr_id"),

  // ===== PROGRESO ACTUAL =====
  current_progress: text("current_progress", { mode: "json" }).$type<{
    current_value: number;
    target_value: number;
    percentage: number;
  }>(),

  // ===== OVERRIDE MANUAL =====
  manually_unlocked: integer("manually_unlocked", { mode: "boolean" }).default(
    false
  ),
  manually_unlocked_at: text("manually_unlocked_at"),

  // ===== TIMESTAMPS =====
  created_at: text("created_at").notNull(),
  updated_at: text("updated_at").notNull(),
});

// Índice único para evitar duplicados
export const userExerciseUnlocksIdx = uniqueIndex(
  "user_exercise_unlocks_unique_idx"
).on(userExerciseUnlocks.user_id, userExerciseUnlocks.exercise_id);
```

### Relaciones Drizzle

```typescript
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
  })
);

export const userExerciseUnlocksRelations = relations(
  userExerciseUnlocks,
  ({ one }) => ({
    unlockedByExercise: one(exercises, {
      fields: [userExerciseUnlocks.unlocked_by_exercise_id],
      references: [exercises.id],
    }),
  })
);
```

---

## Lógica de Negocio

### Service: `progression-service.ts`

```typescript
// shared/services/progression-service.ts

import { db } from "@/shared/db";
import { exerciseProgressions, userExerciseUnlocks } from "@/shared/db/schema";
import { eq, and } from "drizzle-orm";

// ===================================
// TYPES
// ===================================

interface UnlockCriteria {
  type: "reps" | "time" | "weight" | "weight_reps" | "sets_reps" | "manual";
  primary_value: number;
  secondary_value?: number;
  sets?: number;
  description: string;
}

interface UnlockResult {
  exercise_id: string;
  exercise_name: string;
  unlocked_by: string;
  criteria_met: string;
}

interface ProgressionInfo {
  easier: ExerciseWithProgress[]; // Regresiones
  current: ExerciseWithProgress; // Ejercicio actual
  harder: ExerciseWithProgress[]; // Progresiones
  variations: ExerciseWithProgress[]; // Variaciones
}

// ===================================
// UNLOCK DETECTION
// ===================================

/**
 * Verifica y procesa unlocks cuando se registra un nuevo PR
 */
export const checkUnlocksOnNewPR = async (
  userId: string,
  exerciseId: string,
  prData: {
    primary_value: number;
    secondary_value?: number;
    measurement_template: string;
  }
): Promise<UnlockResult[]> => {
  // 1. Buscar todas las progressions donde este ejercicio es el "from"
  const progressions = await db.query.exerciseProgressions.findMany({
    where: eq(exerciseProgressions.from_exercise_id, exerciseId),
    with: {
      toExercise: true,
    },
  });

  const unlocked: UnlockResult[] = [];

  for (const progression of progressions) {
    if (!progression.unlock_criteria) continue;

    // 2. Evaluar si el PR cumple el criterio
    const criteria = progression.unlock_criteria as UnlockCriteria;
    const isMet = evaluateCriteria(prData, criteria);

    if (isMet) {
      // 3. Verificar si ya estaba desbloqueado
      const existingUnlock = await db.query.userExerciseUnlocks.findFirst({
        where: and(
          eq(userExerciseUnlocks.user_id, userId),
          eq(userExerciseUnlocks.exercise_id, progression.to_exercise_id)
        ),
      });

      if (
        !existingUnlock ||
        existingUnlock.status === "locked" ||
        existingUnlock.status === "unlocking"
      ) {
        // 4. Crear o actualizar el unlock
        await upsertUnlock(userId, progression.to_exercise_id, {
          status: "unlocked",
          unlocked_by_exercise_id: exerciseId,
        });

        unlocked.push({
          exercise_id: progression.to_exercise_id,
          exercise_name: progression.toExercise?.name || "",
          unlocked_by: exerciseId,
          criteria_met: criteria.description,
        });
      }
    } else {
      // Actualizar progreso si está en camino
      const progress = calculateProgress(prData, criteria);
      if (progress > 50) {
        await upsertUnlock(userId, progression.to_exercise_id, {
          status: "unlocking",
          current_progress: {
            current_value: prData.primary_value,
            target_value: criteria.primary_value,
            percentage: progress,
          },
        });
      }
    }
  }

  return unlocked;
};

/**
 * Evalúa si un PR cumple con un criterio de unlock
 */
const evaluateCriteria = (
  prData: { primary_value: number; secondary_value?: number },
  criteria: UnlockCriteria
): boolean => {
  switch (criteria.type) {
    case "reps":
      // El secondary_value es reps en weight_reps
      return (prData.secondary_value || 0) >= criteria.primary_value;

    case "time":
      // El primary_value es tiempo en time_only
      return prData.primary_value >= criteria.primary_value;

    case "weight":
      return prData.primary_value >= criteria.primary_value;

    case "weight_reps":
      return (
        prData.primary_value >= criteria.primary_value &&
        (prData.secondary_value || 0) >= (criteria.secondary_value || 0)
      );

    case "sets_reps":
      // Para sets×reps necesitamos verificar el workout completo
      // Por ahora, simplificamos a solo reps
      return (prData.secondary_value || 0) >= criteria.primary_value;

    case "manual":
      return false; // Nunca se auto-desbloquea

    default:
      return false;
  }
};

/**
 * Calcula el porcentaje de progreso hacia un unlock
 */
const calculateProgress = (
  prData: { primary_value: number; secondary_value?: number },
  criteria: UnlockCriteria
): number => {
  switch (criteria.type) {
    case "reps":
      return Math.min(
        100,
        ((prData.secondary_value || 0) / criteria.primary_value) * 100
      );

    case "time":
      return Math.min(
        100,
        (prData.primary_value / criteria.primary_value) * 100
      );

    case "weight":
      return Math.min(
        100,
        (prData.primary_value / criteria.primary_value) * 100
      );

    default:
      return 0;
  }
};

// ===================================
// PROGRESSION TREE QUERIES
// ===================================

/**
 * Obtiene el árbol de progresión para un ejercicio
 */
export const getProgressionTree = async (
  userId: string,
  exerciseId: string
): Promise<ProgressionInfo> => {
  // Obtener relaciones desde este ejercicio
  const progressionsFrom = await db.query.exerciseProgressions.findMany({
    where: eq(exerciseProgressions.from_exercise_id, exerciseId),
    with: { toExercise: true },
  });

  // Obtener relaciones hacia este ejercicio
  const progressionsTo = await db.query.exerciseProgressions.findMany({
    where: eq(exerciseProgressions.to_exercise_id, exerciseId),
    with: { fromExercise: true },
  });

  // Obtener estado del usuario para todos los ejercicios relacionados
  const relatedExerciseIds = [
    ...progressionsFrom.map((p) => p.to_exercise_id),
    ...progressionsTo.map((p) => p.from_exercise_id),
    exerciseId,
  ];

  const userUnlocks = await db.query.userExerciseUnlocks.findMany({
    where: and(
      eq(userExerciseUnlocks.user_id, userId)
      // in(userExerciseUnlocks.exercise_id, relatedExerciseIds)
    ),
  });

  const unlockMap = new Map(userUnlocks.map((u) => [u.exercise_id, u]));

  // Clasificar ejercicios
  const easier: ExerciseWithProgress[] = [];
  const harder: ExerciseWithProgress[] = [];
  const variations: ExerciseWithProgress[] = [];

  for (const prog of progressionsTo) {
    const unlock = unlockMap.get(prog.from_exercise_id);
    const exerciseWithProgress = {
      ...prog.fromExercise,
      status: unlock?.status || "locked",
      progress: unlock?.current_progress,
    };

    if (
      prog.relationship_type === "progression" ||
      prog.relationship_type === "prerequisite"
    ) {
      easier.push(exerciseWithProgress);
    } else if (prog.relationship_type === "variation") {
      variations.push(exerciseWithProgress);
    }
  }

  for (const prog of progressionsFrom) {
    const unlock = unlockMap.get(prog.to_exercise_id);
    const exerciseWithProgress = {
      ...prog.toExercise,
      status: unlock?.status || "locked",
      progress: unlock?.current_progress,
      unlock_criteria: prog.unlock_criteria,
    };

    if (
      prog.relationship_type === "progression" ||
      prog.relationship_type === "prerequisite"
    ) {
      harder.push(exerciseWithProgress);
    } else if (prog.relationship_type === "variation") {
      variations.push(exerciseWithProgress);
    }
  }

  const currentUnlock = unlockMap.get(exerciseId);

  return {
    easier,
    current: {
      id: exerciseId,
      status: currentUnlock?.status || "unlocked",
      progress: currentUnlock?.current_progress,
    },
    harder,
    variations,
  };
};

/**
 * Obtiene el path completo hacia un skill
 */
export const getPathToSkill = async (
  userId: string,
  pathSlug: string
): Promise<PathWithProgress> => {
  const path = await db.query.progressionPaths.findFirst({
    where: eq(progressionPaths.slug, pathSlug),
    with: {
      exercises: {
        orderBy: (exercises, { asc }) => [asc(exercises.level)],
      },
      ultimateExercise: true,
    },
  });

  if (!path) throw new Error(`Path not found: ${pathSlug}`);

  // Obtener unlocks del usuario
  const exerciseIds = path.exercises.map((e) => e.exercise_id);
  const userUnlocks = await db.query.userExerciseUnlocks.findMany({
    where: and(
      eq(userExerciseUnlocks.user_id, userId)
      // in(userExerciseUnlocks.exercise_id, exerciseIds)
    ),
  });

  const unlockMap = new Map(userUnlocks.map((u) => [u.exercise_id, u]));

  // Calcular nivel actual del usuario
  let currentLevel = 0;
  for (const exercise of path.exercises) {
    const unlock = unlockMap.get(exercise.exercise_id);
    if (unlock?.status === "unlocked" || unlock?.status === "mastered") {
      currentLevel = Math.max(currentLevel, exercise.level);
    }
  }

  return {
    ...path,
    currentLevel,
    totalLevels: path.exercises.length,
    exercisesWithProgress: path.exercises.map((e) => ({
      ...e,
      unlock: unlockMap.get(e.exercise_id),
    })),
  };
};

// ===================================
// MANUAL UNLOCK
// ===================================

/**
 * Permite al usuario marcar un ejercicio como "ya puedo hacerlo"
 */
export const manuallyUnlockExercise = async (
  userId: string,
  exerciseId: string
): Promise<void> => {
  await upsertUnlock(userId, exerciseId, {
    status: "unlocked",
    manually_unlocked: true,
    manually_unlocked_at: new Date().toISOString(),
  });
};

// ===================================
// HELPERS
// ===================================

const upsertUnlock = async (
  userId: string,
  exerciseId: string,
  data: Partial<typeof userExerciseUnlocks.$inferInsert>
) => {
  const existing = await db.query.userExerciseUnlocks.findFirst({
    where: and(
      eq(userExerciseUnlocks.user_id, userId),
      eq(userExerciseUnlocks.exercise_id, exerciseId)
    ),
  });

  if (existing) {
    await db
      .update(userExerciseUnlocks)
      .set({ ...data, updated_at: new Date().toISOString() })
      .where(eq(userExerciseUnlocks.id, existing.id));
  } else {
    await db.insert(userExerciseUnlocks).values({
      id: generateUUID(),
      user_id: userId,
      exercise_id: exerciseId,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
};
```

---

## Integración con PRs

### Hook en `completeSet()` del Active Workout

```typescript
// En use-active-workout-store.ts, después de detectar un PR:

if (isPR) {
  // ... código existente de PR ...

  // NUEVO: Verificar unlocks de progresión
  const unlocks = await checkUnlocksOnNewPR(userId, exerciseId, {
    primary_value: actualPrimaryValue,
    secondary_value: actualSecondaryValue,
    measurement_template: set.measurement_template,
  });

  if (unlocks.length > 0) {
    // Guardar para mostrar en workout summary
    state.activeWorkout.unlockedExercises.push(...unlocks);

    // Haptic feedback especial para unlock
    triggerHaptic("success");
  }
}
```

### Mostrar en Workout Summary

```typescript
// En workout-summary, después de mostrar PRs:

{
  unlockedExercises.length > 0 && (
    <Card>
      <CardHeader>
        <Text style={styles.sectionTitle}>🔓 Exercises Unlocked!</Text>
      </CardHeader>
      <CardContent>
        {unlockedExercises.map((unlock) => (
          <View key={unlock.exercise_id} style={styles.unlockItem}>
            <LockOpen size={20} color={colors.success} />
            <View>
              <Text style={styles.unlockName}>{unlock.exercise_name}</Text>
              <Text style={styles.unlockCriteria}>
                Unlocked by: {unlock.criteria_met}
              </Text>
            </View>
            <Button
              variant="ghost"
              onPress={() => navigateToExercise(unlock.exercise_id)}
            >
              Try it →
            </Button>
          </View>
        ))}
      </CardContent>
    </Card>
  );
}
```

---

## Diseño de UI/UX

### 1. Exercise Detail - Progression Section

```
┌─────────────────────────────────────────────────────────┐
│ 📈 Progression Path                                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ⬇️ EASIER (Regressions)                                │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ✅ Inverted Row                                     │ │
│ │    Mastered • PR: 3×15                              │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ 📍 CURRENT: Pull-up                                     │
│    PR: 3×6 • Unlocked                                   │
│                                                         │
│ ⬆️ HARDER (Progressions)                               │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ⏳ Weighted Pull-up                                 │ │
│ │    Unlock: 3×8 Pull-ups                             │ │
│ │    Progress: 6/8 reps (75%)                         │ │
│ │    ████████████░░░░                                 │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🔒 Muscle-up                                        │ │
│ │    Requires:                                        │ │
│ │    • 10 Pull-ups (6/10) ⏳                          │ │
│ │    • 15 Dips (12/15) ⏳                             │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ↔️ VARIATIONS                                           │
│ • Chin-up (unlocked)                                    │
│ • Neutral Grip Pull-up (unlocked)                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 2. Progression Paths Screen (Nueva)

```
┌─────────────────────────────────────────────────────────┐
│ 🌳 Skill Progressions                                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ UPPER BODY - PULL                                       │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Pull-up Path                    Level 5/10          │ │
│ │ [███████░░░]                                        │ │
│ │ Current: Pull-up → Next: Weighted Pull-up           │ │
│ │ Ultimate: One Arm Pull-up                      →    │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Front Lever Path                Level 2/8           │ │
│ │ [██░░░░░░░░]                                        │ │
│ │ Current: Tuck Front Lever → Next: Adv. Tuck         │ │
│ │ Ultimate: Full Front Lever                     →    │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ UPPER BODY - PUSH                                       │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Push-up Path                    Level 6/10          │ │
│ │ [████████░░]                                        │ │
│ │ Current: Diamond → Next: Archer Push-up             │ │
│ │ Ultimate: One Arm Push-up                      →    │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ [View Full Skill Tree]                                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 3. Visual Skill Tree (V2 - Futuro)

```
                        ┌─────────────┐
                        │  MUSCLE-UP  │
                        │     🔒      │
                        └──────┬──────┘
               ┌───────────────┴───────────────┐
        ┌──────┴──────┐               ┌────────┴────────┐
        │ HIGH PULL-UP│               │   CHEST DIP     │
        │     🔒      │               │      🔒         │
        └──────┬──────┘               └────────┬────────┘
               │                               │
        ┌──────┴──────┐               ┌────────┴────────┐
        │   PULL-UP   │               │   PARALLEL DIP  │
        │     📍      │               │      🔓         │
        │   3×6/3×8   │               │    3×10 ✓       │
        └──────┬──────┘               └────────┬────────┘
               │                               │
        ┌──────┴──────┐               ┌────────┴────────┐
        │  NEGATIVE   │               │   BENCH DIP     │
        │  PULL-UP    │               │      ✓          │
        │     ✓       │               └─────────────────┘
        └──────┬──────┘
               │
        ┌──────┴──────┐
        │INVERTED ROW │
        │     ✓       │
        └──────┬──────┘
               │
        ┌──────┴──────┐
        │  DEAD HANG  │
        │     ✓       │
        └─────────────┘

Leyenda:
🔒 = Locked    📍 = Current    🔓 = Unlocked    ✓ = Mastered
```

### 4. Exercise Selector - Suggested Section

```
┌─────────────────────────────────────────────────────────┐
│ 🔍 Search exercises...                                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 🎯 READY TO TRY                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🔓 Weighted Pull-up              NEW UNLOCK         │ │
│ │    You just unlocked this! Give it a try.           │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ⏳ Diamond Push-up               87% to unlock      │ │
│ │    Almost there! 2 more reps to go.                 │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ 💡 CAN'T DO IT YET? TRY THESE                           │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Inverted Row                    Regression for:     │ │
│ │                                 Pull-up             │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ALL EXERCISES                                           │
│ ...                                                     │
└─────────────────────────────────────────────────────────┘
```

### 5. Unlock Notification (Toast/Modal)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    🎉                                   │
│                                                         │
│            EXERCISE UNLOCKED!                           │
│                                                         │
│         ┌─────────────────────┐                         │
│         │   WEIGHTED PULL-UP  │                         │
│         └─────────────────────┘                         │
│                                                         │
│     You achieved: 3×8 strict Pull-ups                   │
│                                                         │
│     ┌────────────┐  ┌────────────────┐                  │
│     │  Got it    │  │  Try it now →  │                  │
│     └────────────┘  └────────────────────┘              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Seed Data - Progresiones

### Pull-up Progression Path

```typescript
const PULLUP_PROGRESSION_SEED = {
  path: {
    id: "path-pullup",
    name: "Pull-up Progression",
    slug: "pullup-progression",
    category: "vertical_pull",
    description: "From dead hang to one arm pull-up",
    ultimate_exercise_id: "ex-one-arm-pullup",
    icon: "arrow-up",
    color: "#3B82F6",
  },
  exercises: [
    { exercise_id: "ex-dead-hang", level: 1 },
    { exercise_id: "ex-scapular-pulls", level: 2 },
    { exercise_id: "ex-inverted-row", level: 3 },
    { exercise_id: "ex-negative-pullup", level: 4 },
    { exercise_id: "ex-pullup", level: 5 },
    { exercise_id: "ex-weighted-pullup", level: 6 },
    { exercise_id: "ex-archer-pullup", level: 7 },
    { exercise_id: "ex-one-arm-negative", level: 8 },
    { exercise_id: "ex-one-arm-pullup", level: 9 },
  ],
  progressions: [
    {
      from: "ex-dead-hang",
      to: "ex-scapular-pulls",
      type: "progression",
      criteria: {
        type: "time",
        primary_value: 30,
        description: "30 second Dead Hang",
      },
    },
    {
      from: "ex-scapular-pulls",
      to: "ex-inverted-row",
      type: "progression",
      criteria: {
        type: "reps",
        primary_value: 10,
        description: "10 Scapular Pulls",
      },
    },
    {
      from: "ex-inverted-row",
      to: "ex-negative-pullup",
      type: "progression",
      criteria: {
        type: "reps",
        primary_value: 15,
        description: "15 Inverted Rows",
      },
    },
    {
      from: "ex-negative-pullup",
      to: "ex-pullup",
      type: "progression",
      criteria: {
        type: "reps",
        primary_value: 8,
        description: "8 Slow Negative Pull-ups (5s each)",
      },
    },
    {
      from: "ex-pullup",
      to: "ex-weighted-pullup",
      type: "progression",
      criteria: {
        type: "reps",
        primary_value: 12,
        description: "3×12 strict Pull-ups",
      },
    },
    {
      from: "ex-weighted-pullup",
      to: "ex-archer-pullup",
      type: "progression",
      criteria: {
        type: "weight_reps",
        primary_value: 20,
        secondary_value: 8,
        description: "+20kg × 8 reps",
      },
    },
    {
      from: "ex-archer-pullup",
      to: "ex-one-arm-negative",
      type: "progression",
      criteria: {
        type: "reps",
        primary_value: 8,
        description: "8 Archer Pull-ups each side",
      },
    },
    {
      from: "ex-one-arm-negative",
      to: "ex-one-arm-pullup",
      type: "progression",
      criteria: {
        type: "reps",
        primary_value: 5,
        description: "5 One Arm Negative Pull-ups (8s each)",
      },
    },
    // Variaciones
    {
      from: "ex-pullup",
      to: "ex-chinup",
      type: "variation",
      criteria: null,
    },
    {
      from: "ex-pullup",
      to: "ex-neutral-grip-pullup",
      type: "variation",
      criteria: null,
    },
  ],
};
```

### Push-up Progression Path

```typescript
const PUSHUP_PROGRESSION_SEED = {
  path: {
    id: "path-pushup",
    name: "Push-up Progression",
    slug: "pushup-progression",
    category: "horizontal_push",
    description: "From wall push-ups to one arm push-ups",
    ultimate_exercise_id: "ex-one-arm-pushup",
    icon: "arrow-right",
    color: "#EF4444",
  },
  exercises: [
    { exercise_id: "ex-wall-pushup", level: 1 },
    { exercise_id: "ex-incline-pushup", level: 2 },
    { exercise_id: "ex-knee-pushup", level: 3 },
    { exercise_id: "ex-pushup", level: 4 },
    { exercise_id: "ex-diamond-pushup", level: 5 },
    { exercise_id: "ex-archer-pushup", level: 6 },
    { exercise_id: "ex-pseudo-planche-pushup", level: 7 },
    { exercise_id: "ex-one-arm-pushup", level: 8 },
  ],
  progressions: [
    {
      from: "ex-wall-pushup",
      to: "ex-incline-pushup",
      type: "progression",
      criteria: {
        type: "reps",
        primary_value: 20,
        description: "20 Wall Push-ups",
      },
    },
    {
      from: "ex-incline-pushup",
      to: "ex-knee-pushup",
      type: "progression",
      criteria: {
        type: "reps",
        primary_value: 15,
        description: "15 Incline Push-ups",
      },
    },
    {
      from: "ex-knee-pushup",
      to: "ex-pushup",
      type: "progression",
      criteria: {
        type: "reps",
        primary_value: 12,
        description: "12 Knee Push-ups",
      },
    },
    {
      from: "ex-pushup",
      to: "ex-diamond-pushup",
      type: "progression",
      criteria: {
        type: "reps",
        primary_value: 15,
        description: "3×15 Push-ups",
      },
    },
    {
      from: "ex-diamond-pushup",
      to: "ex-archer-pushup",
      type: "progression",
      criteria: {
        type: "reps",
        primary_value: 12,
        description: "3×12 Diamond Push-ups",
      },
    },
    {
      from: "ex-archer-pushup",
      to: "ex-pseudo-planche-pushup",
      type: "progression",
      criteria: {
        type: "reps",
        primary_value: 10,
        description: "10 Archer Push-ups each side",
      },
    },
    {
      from: "ex-pseudo-planche-pushup",
      to: "ex-one-arm-pushup",
      type: "progression",
      criteria: {
        type: "reps",
        primary_value: 10,
        description: "10 Pseudo Planche Push-ups",
      },
    },
  ],
};
```

### Muscle-up Prerequisites

```typescript
const MUSCLEUP_PREREQUISITES_SEED = {
  // Muscle-up requiere múltiples prerequisitos
  progressions: [
    {
      from: "ex-pullup",
      to: "ex-muscleup",
      type: "prerequisite",
      criteria: {
        type: "reps",
        primary_value: 10,
        description: "10 strict Pull-ups",
      },
    },
    {
      from: "ex-chest-dip",
      to: "ex-muscleup",
      type: "prerequisite",
      criteria: {
        type: "reps",
        primary_value: 15,
        description: "15 deep Chest Dips",
      },
    },
    {
      from: "ex-high-pullup",
      to: "ex-muscleup",
      type: "prerequisite",
      criteria: {
        type: "reps",
        primary_value: 5,
        description: "5 High Pull-ups (to sternum)",
      },
    },
  ],
};
```

---

## Roadmap de Implementación

### Fase 1: Foundation (Sprint 1-2)

- [ ] **Schema & Migrations**

  - [ ] Crear tabla `exercise_progressions`
  - [ ] Crear tabla `progression_paths`
  - [ ] Crear tabla `progression_path_exercises`
  - [ ] Crear tabla `user_exercise_unlocks`
  - [ ] Índices y relaciones

- [ ] **Seed Data**

  - [ ] Pull-up progression path
  - [ ] Push-up progression path
  - [ ] Dip progression path
  - [ ] Squat progression path
  - [ ] L-sit progression path

- [ ] **Repository Layer**
  - [ ] `progressionRepository.getProgressionsFrom(exerciseId)`
  - [ ] `progressionRepository.getProgressionsTo(exerciseId)`
  - [ ] `progressionRepository.getPathBySlug(slug)`
  - [ ] `unlockRepository.getUserUnlocks(userId)`
  - [ ] `unlockRepository.upsertUnlock(...)`

### Fase 2: Core Logic (Sprint 3)

- [ ] **Progression Service**

  - [ ] `checkUnlocksOnNewPR(userId, exerciseId, prData)`
  - [ ] `getProgressionTree(userId, exerciseId)`
  - [ ] `getPathToSkill(userId, pathSlug)`
  - [ ] `manuallyUnlockExercise(userId, exerciseId)`

- [ ] **Integración con PR System**
  - [ ] Hook en `completeSet()` para verificar unlocks
  - [ ] Almacenar unlocks en workout session
  - [ ] Mutations de sync para `user_exercise_unlocks`

### Fase 3: UI Básica (Sprint 4-5)

- [ ] **Exercise Detail - Progression Section**

  - [ ] Componente `ExerciseProgressionInfo`
  - [ ] Lista de easier/harder/variations
  - [ ] Barra de progreso hacia unlock

- [ ] **Exercise Selector - Suggestions**

  - [ ] Sección "Ready to Try" con unlocks recientes
  - [ ] Sección "Almost There" con ejercicios en progreso
  - [ ] Sección "Try These Instead" con regresiones

- [ ] **Workout Summary - Unlocks**
  - [ ] Mostrar ejercicios desbloqueados
  - [ ] Link para probar el ejercicio

### Fase 4: Progression Paths Screen (Sprint 6)

- [ ] **Nueva pantalla `/progressions`**

  - [ ] Lista de paths por categoría
  - [ ] Progreso en cada path
  - [ ] Nivel actual y siguiente ejercicio

- [ ] **Path Detail View**
  - [ ] Lista completa de ejercicios del path
  - [ ] Estado de cada uno (locked/unlocking/unlocked/mastered)
  - [ ] Skill final destacado

### Fase 5: Visual Skill Tree (Sprint 7-8)

- [ ] **Componente de árbol visual**

  - [ ] Nodos conectados con líneas
  - [ ] Colores por estado
  - [ ] Interactivo (tap para ver detalles)

- [ ] **Animaciones**
  - [ ] Unlock animation
  - [ ] Progress animation
  - [ ] Path completion celebration

### Fase 6: Polish & Notifications (Sprint 9)

- [ ] **Unlock Notifications**

  - [ ] Toast cuando se desbloquea ejercicio
  - [ ] Modal de celebración para skills importantes
  - [ ] Push notification (opcional)

- [ ] **Onboarding**
  - [ ] Pantalla de introducción al sistema
  - [ ] "Set your current level" para usuarios existentes
  - [ ] Tutorial de cómo funcionan las progresiones

---

## Sync Mutations

```typescript
// Nuevas mutations para el sync engine

type ProgressionMutations =
  | "USER_UNLOCK_CREATE"
  | "USER_UNLOCK_UPDATE"
  | "USER_UNLOCK_MANUAL";

// Ejemplo de mutation
const USER_UNLOCK_CREATE: MutationDefinition = {
  type: "USER_UNLOCK_CREATE",
  table: "user_exercise_unlocks",
  handler: async (payload, supabase) => {
    const { data, error } = await supabase
      .from("user_exercise_unlocks")
      .insert(payload);
    return { data, error };
  },
};
```

---

## Consideraciones Adicionales

### Performance

- Índices en `from_exercise_id` y `to_exercise_id` para queries rápidas
- Cache de progression trees en memoria (raramente cambian)
- Lazy loading de exercise details en el árbol visual

### Usuarios Existentes

Cuando un usuario existente activa el feature:

1. Mostrar modal "Set your current level"
2. Permitir marcar ejercicios que ya puede hacer
3. Auto-detectar basándose en PRs existentes

### Ejercicios Custom

- Los ejercicios creados por el usuario no tendrán progresiones automáticas
- Opción futura: permitir al usuario definir sus propias progresiones

### Internacionalización

- Nombres de paths traducibles
- Descripciones de criterios traducibles
- Mensajes de unlock traducibles

---

## Métricas de Éxito

| Métrica     | Objetivo                                 | Cómo medir                     |
| ----------- | ---------------------------------------- | ------------------------------ |
| Adoption    | 60% de usuarios ven progressions         | Analytics: views de la sección |
| Engagement  | 2+ ejercicios desbloqueados/mes          | Tabla `user_exercise_unlocks`  |
| Retention   | +15% retention de usuarios de calistenia | Cohorte analysis               |
| Progression | 30% de usuarios avanzan 1+ nivel/mes     | Cambios en `current_progress`  |

---

> **Última actualización:** Diciembre 2025
> **Estado:** Diseño completo, pendiente implementación
> **Prioridad:** Alta - Feature diferenciador para mercado de calistenia
