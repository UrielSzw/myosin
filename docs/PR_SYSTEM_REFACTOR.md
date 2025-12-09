# 🏆 PR System Refactor - Implementation Guide

> Guía completa para expandir el sistema de PRs a todos los measurement templates.
> **Sin backwards compatibility** - Refactor limpio desde cero.

---

## 📋 Índice

1. [Resumen de Cambios](#resumen-de-cambios)
2. [Métricas de PR por Template](#métricas-de-pr-por-template)
3. [Cambios de Schema](#cambios-de-schema)
4. [Cambios de Lógica](#cambios-de-lógica)
5. [Cambios de UI](#cambios-de-ui)
6. [Checklist de Implementación](#checklist-de-implementación)

---

## 📊 Resumen de Cambios

### Archivos Afectados

| Categoría           | Archivos                                                       | Cambios                        |
| ------------------- | -------------------------------------------------------------- | ------------------------------ |
| **Schema SQLite**   | `shared/db/schema/pr.ts`                                       | Nuevos campos genéricos        |
| **Schema Supabase** | `supabase_functions/supabase-schema.sql`                       | Nuevas columnas                |
| **RPC Functions**   | `supabase_functions/supabase-rpc-finish-workout.sql`           | Nuevos campos en upsert        |
| **Tipos**           | `shared/types/measurement.ts`                                  | PR score config                |
| **Tipos**           | `features/pr-list-v2/types/pr-list.ts`                         | Campos genéricos               |
| **Tipos**           | `features/pr-detail-v2/types/pr-detail.ts`                     | Campos genéricos               |
| **Utils**           | `shared/db/utils/pr.ts`                                        | Score calculation por template |
| **Repository**      | `shared/db/repository/pr.ts`                                   | Queries actualizadas           |
| **Active Workout**  | `features/active-workout-v2/hooks/use-active-workout-store.ts` | PR detection multi-template    |
| **Finish Workout**  | `shared/services/finish-workout/prepare-finish-data.ts`        | PR data prep                   |
| **Sync**            | `shared/sync/restore/restore-service.ts`                       | Nuevos campos                  |
| **UI - PR List**    | `features/pr-list-v2/components/PRCardV2.tsx`                  | Display genérico               |
| **UI - PR Detail**  | `features/pr-detail-v2/components/PRHeroCardV2.tsx`            | Display genérico               |
| **UI - PR Detail**  | `features/pr-detail-v2/components/PRChartV2.tsx`               | Chart multi-template           |
| **Translations**    | `shared/translations/pr-list.ts`, `pr-detail.ts`               | Nuevas labels                  |

---

## 🎯 Métricas de PR por Template

### Definición Final

| Template            | Primary Value  | Secondary Value | **PR Score**           | **Score Name**   |
| ------------------- | -------------- | --------------- | ---------------------- | ---------------- |
| `weight_reps`       | Peso (kg)      | Reps            | `peso × (1 + reps/30)` | Estimated 1RM    |
| `weight_reps_range` | Peso (kg)      | Reps (actual)   | `peso × (1 + reps/30)` | Estimated 1RM    |
| `time_only`         | Tiempo (seg)   | -               | `tiempo`               | Longest Hold     |
| `weight_time`       | Peso (kg)      | Tiempo (seg)    | `peso × tiempo`        | TUT Volume       |
| `distance_only`     | Distancia (m)  | -               | `distancia`            | Longest Distance |
| `distance_time`     | Distancia (km) | Tiempo (min)    | `distancia`            | Longest Distance |
| `weight_distance`   | Peso (kg)      | Distancia (m)   | `peso × distancia`     | Total Work       |

### Fórmulas de Comparación

**Regla universal**: `newScore > currentScore` = Nuevo PR

---

## 🗄️ Cambios de Schema

### 1. SQLite Schema (`shared/db/schema/pr.ts`)

```typescript
// ============================================
// ANTES (solo weight_reps)
// ============================================
export const pr_current = sqliteTable("pr_current", {
  id: text("id").primaryKey(),
  user_id: text("user_id").notNull(),
  exercise_id: text("exercise_id")
    .notNull()
    .references(() => exercises.id),

  best_weight: real("best_weight").notNull(),
  best_reps: integer("best_reps").notNull(),
  estimated_1rm: real("estimated_1rm").notNull(),

  achieved_at: text("achieved_at").notNull(),
  source: text("source").$type<"auto" | "manual">().default("auto").notNull(),
  is_synced: integer("is_synced", { mode: "boolean" }).default(false).notNull(),
  ...timestamps,
});

// ============================================
// DESPUÉS (todos los templates)
// ============================================
export const pr_current = sqliteTable("pr_current", {
  id: text("id").primaryKey(),
  user_id: text("user_id").notNull(),
  exercise_id: text("exercise_id")
    .notNull()
    .references(() => exercises.id),

  // NEW: Template que define cómo interpretar los valores
  measurement_template: text("measurement_template")
    .$type<MeasurementTemplateId>()
    .notNull()
    .default("weight_reps"),

  // NEW: Valores genéricos (interpretados según template)
  best_primary_value: real("best_primary_value").notNull(),
  best_secondary_value: real("best_secondary_value"), // Nullable para single-metric templates

  // NEW: Score calculado para ranking/comparación
  pr_score: real("pr_score").notNull(),

  achieved_at: text("achieved_at").notNull(),
  source: text("source").$type<"auto" | "manual">().default("auto").notNull(),
  is_synced: integer("is_synced", { mode: "boolean" }).default(false).notNull(),
  ...timestamps,
});

export const pr_history = sqliteTable("pr_history", {
  id: text("id").primaryKey(),
  user_id: text("user_id").notNull(),
  exercise_id: text("exercise_id")
    .notNull()
    .references(() => exercises.id),

  // NEW: Template
  measurement_template: text("measurement_template")
    .$type<MeasurementTemplateId>()
    .notNull()
    .default("weight_reps"),

  // NEW: Valores genéricos
  primary_value: real("primary_value").notNull(),
  secondary_value: real("secondary_value"),

  // NEW: Score
  pr_score: real("pr_score").notNull(),

  workout_session_id: text("workout_session_id").references(
    () => workout_sessions.id
  ),
  workout_set_id: text("workout_set_id").references(() => workout_sets.id),
  source: text("source")
    .$type<"auto" | "manual" | "import">()
    .default("auto")
    .notNull(),
  is_synced: integer("is_synced", { mode: "boolean" }).default(false).notNull(),
  ...timestamps,
});

// Types
export type BasePRCurrent = InferSelectModel<typeof pr_current>;
export type BasePRHistory = InferSelectModel<typeof pr_history>;

export type PRCurrentInsert = Omit<BasePRCurrent, "id" | "is_synced"> & {
  is_synced?: boolean;
};

export type PRHistoryInsert = Omit<BasePRHistory, "id" | "is_synced"> & {
  is_synced?: boolean;
};
```

### 2. Drizzle Migration

```sql
-- Crear nueva migración: 00XX_pr_multi_template.sql

-- Drop old columns and add new ones (no backwards compatibility needed)
-- Since there's no real data, we can recreate the tables

DROP TABLE IF EXISTS pr_history;
DROP TABLE IF EXISTS pr_current;

CREATE TABLE pr_current (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL DEFAULT 'default-user',
  exercise_id TEXT NOT NULL REFERENCES exercises(id),
  measurement_template TEXT NOT NULL DEFAULT 'weight_reps',
  best_primary_value REAL NOT NULL,
  best_secondary_value REAL,
  pr_score REAL NOT NULL,
  achieved_at TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'auto',
  is_synced INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT,
  created_at TEXT
);

CREATE TABLE pr_history (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL DEFAULT 'default-user',
  exercise_id TEXT NOT NULL REFERENCES exercises(id),
  measurement_template TEXT NOT NULL DEFAULT 'weight_reps',
  primary_value REAL NOT NULL,
  secondary_value REAL,
  pr_score REAL NOT NULL,
  workout_session_id TEXT REFERENCES workout_sessions(id),
  workout_set_id TEXT REFERENCES workout_sets(id),
  source TEXT NOT NULL DEFAULT 'auto',
  is_synced INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT,
  created_at TEXT
);

CREATE INDEX idx_pr_current_user_exercise ON pr_current(user_id, exercise_id);
CREATE INDEX idx_pr_history_user_exercise ON pr_history(user_id, exercise_id);
CREATE INDEX idx_pr_history_session ON pr_history(workout_session_id);
```

### 3. Supabase Schema (`supabase_functions/supabase-schema.sql`)

```sql
-- ============================================
-- PR SCHEMA (UPDATED)
-- ============================================

DROP TABLE IF EXISTS pr_history;
DROP TABLE IF EXISTS pr_current;

CREATE TABLE pr_current (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,

    -- NEW: Template-aware fields
    measurement_template TEXT NOT NULL DEFAULT 'weight_reps',
    best_primary_value DECIMAL(10,2) NOT NULL,
    best_secondary_value DECIMAL(10,2),
    pr_score DECIMAL(10,2) NOT NULL,

    achieved_at TIMESTAMPTZ NOT NULL,
    source TEXT DEFAULT 'auto' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pr_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,

    -- NEW: Template-aware fields
    measurement_template TEXT NOT NULL DEFAULT 'weight_reps',
    primary_value DECIMAL(10,2) NOT NULL,
    secondary_value DECIMAL(10,2),
    pr_score DECIMAL(10,2) NOT NULL,

    workout_session_id UUID REFERENCES workout_sessions(id) ON DELETE SET NULL,
    workout_set_id UUID REFERENCES workout_sets(id) ON DELETE SET NULL,
    source TEXT DEFAULT 'auto' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_pr_current_user_id ON pr_current(user_id);
CREATE INDEX idx_pr_current_exercise_id ON pr_current(exercise_id);
CREATE INDEX idx_pr_current_user_exercise ON pr_current(user_id, exercise_id);
CREATE INDEX idx_pr_history_user_id ON pr_history(user_id);
CREATE INDEX idx_pr_history_exercise_id ON pr_history(exercise_id);
CREATE INDEX idx_pr_history_user_exercise ON pr_history(user_id, exercise_id);
CREATE INDEX idx_pr_history_workout_session_id ON pr_history(workout_session_id);
```

### 4. Supabase RPC Update (`supabase-rpc-finish-workout.sql`)

```sql
-- En el loop de PRs, cambiar:

-- ANTES:
UPDATE pr_current SET
  best_weight = (v_pr_item->>'best_weight')::numeric,
  best_reps = (v_pr_item->>'best_reps')::integer,
  estimated_1rm = (v_pr_item->>'estimated_1rm')::numeric,
  ...

-- DESPUÉS:
UPDATE pr_current SET
  measurement_template = v_pr_item->>'measurement_template',
  best_primary_value = (v_pr_item->>'best_primary_value')::numeric,
  best_secondary_value = CASE
    WHEN v_pr_item->>'best_secondary_value' IS NOT NULL
    THEN (v_pr_item->>'best_secondary_value')::numeric
    ELSE NULL
  END,
  pr_score = (v_pr_item->>'pr_score')::numeric,
  achieved_at = (v_pr_item->>'achieved_at')::timestamptz,
  source = v_pr_item->>'source',
  updated_at = NOW()
WHERE id = v_existing_pr_id;

-- Y para INSERT:
INSERT INTO pr_current (
  id, user_id, exercise_id, measurement_template,
  best_primary_value, best_secondary_value, pr_score,
  achieved_at, source
) VALUES (
  (v_pr_item->>'id')::uuid,
  (v_pr_item->>'user_id')::uuid,
  (v_pr_item->>'exercise_id')::uuid,
  v_pr_item->>'measurement_template',
  (v_pr_item->>'best_primary_value')::numeric,
  CASE
    WHEN v_pr_item->>'best_secondary_value' IS NOT NULL
    THEN (v_pr_item->>'best_secondary_value')::numeric
    ELSE NULL
  END,
  (v_pr_item->>'pr_score')::numeric,
  (v_pr_item->>'achieved_at')::timestamptz,
  v_pr_item->>'source'
);

-- Mismo patrón para pr_history
```

---

## ⚙️ Cambios de Lógica

### 1. PR Score Calculator (`shared/db/utils/pr.ts`)

```typescript
import { MeasurementTemplateId } from "@/shared/types/measurement";

/**
 * PR Score Configuration per template
 */
export interface PRScoreConfig {
  scoreName: string;
  scoreUnit: string;
  calculate: (primaryValue: number, secondaryValue?: number | null) => number;
}

export const PR_SCORE_CONFIG: Record<MeasurementTemplateId, PRScoreConfig> = {
  // ═══════════════════════════════════════════════════════════════
  // STRENGTH: Estimated 1RM (Epley formula)
  // ═══════════════════════════════════════════════════════════════
  weight_reps: {
    scoreName: "estimated_1rm",
    scoreUnit: "kg",
    calculate: (weight, reps) => weight * (1 + (reps || 0) / 30),
  },

  weight_reps_range: {
    scoreName: "estimated_1rm",
    scoreUnit: "kg",
    calculate: (weight, reps) => weight * (1 + (reps || 0) / 30),
  },

  // ═══════════════════════════════════════════════════════════════
  // TIME-BASED: Longest Duration
  // ═══════════════════════════════════════════════════════════════
  time_only: {
    scoreName: "longest_hold",
    scoreUnit: "sec",
    calculate: (duration) => duration,
  },

  // ═══════════════════════════════════════════════════════════════
  // WEIGHTED TIME: Volume (TUT × Load)
  // ═══════════════════════════════════════════════════════════════
  weight_time: {
    scoreName: "tut_volume",
    scoreUnit: "kg·s",
    calculate: (weight, duration) => weight * (duration || 0),
  },

  // ═══════════════════════════════════════════════════════════════
  // DISTANCE: Longest Distance
  // ═══════════════════════════════════════════════════════════════
  distance_only: {
    scoreName: "longest_distance",
    scoreUnit: "m",
    calculate: (distance) => distance,
  },

  distance_time: {
    scoreName: "longest_distance",
    scoreUnit: "km",
    calculate: (distance, _time) => distance, // Time stored but not used for PR
  },

  // ═══════════════════════════════════════════════════════════════
  // WEIGHTED DISTANCE: Total Work
  // ═══════════════════════════════════════════════════════════════
  weight_distance: {
    scoreName: "total_work",
    scoreUnit: "kg·m",
    calculate: (weight, distance) => weight * (distance || 0),
  },
};

/**
 * Calculate PR score for a given template and values
 */
export const computePRScore = (
  template: MeasurementTemplateId,
  primaryValue: number,
  secondaryValue?: number | null
): number => {
  const config = PR_SCORE_CONFIG[template];
  if (!config) return 0;
  return config.calculate(primaryValue, secondaryValue);
};

/**
 * Check if new score is a PR (better than current)
 */
export const isPRBetter = (
  newScore: number,
  currentScore: number | null | undefined
): boolean => {
  if (currentScore == null) return true;
  // Small epsilon for floating point comparison
  return newScore > currentScore + 0.0001;
};

/**
 * Get score config for a template
 */
export const getPRScoreConfig = (
  template: MeasurementTemplateId
): PRScoreConfig => {
  return PR_SCORE_CONFIG[template];
};

/**
 * Check if a template supports PR tracking
 * (All templates support PRs now!)
 */
export const supportsPRTracking = (
  _template: MeasurementTemplateId
): boolean => {
  return true; // All templates now support PRs
};

// Legacy function for backwards compatibility during migration
export const computeEpley1RM = (weight: number, reps: number): number => {
  if (!weight || !reps) return 0;
  return weight * (1 + reps / 30);
};
```

### 2. Active Workout Store Updates (`use-active-workout-store.ts`)

```typescript
// ============================================
// TIPO: sessionBestPRs (línea ~91)
// ============================================

// ANTES:
sessionBestPRs: Record<
  string,
  {
    tempSetId: string;
    exercise_id: string;
    weight: number;
    reps: number;
    estimated_1rm: number;
    created_at: string;
  }
>;

// DESPUÉS:
sessionBestPRs: Record<
  string,
  {
    tempSetId: string;
    exercise_id: string;
    measurement_template: MeasurementTemplateId;
    primary_value: number;
    secondary_value: number | null;
    pr_score: number;
    created_at: string;
  }
>;

// ============================================
// FUNCIÓN: completeSet (línea ~1494)
// ============================================

// ANTES (solo weight_reps):
if (
  isPR &&
  (set.measurement_template === "weight_reps" ||
    set.measurement_template === "weight_reps_range") &&
  primaryValue &&
  secondaryValue &&
  estimated1RM
) {
  // ...solo para weight_reps
}

// DESPUÉS (todos los templates):
completeSet: (exerciseInBlockId, setId, blockId, completionData) => {
  set((state) => {
    const set = state.activeWorkout.sets[setId];
    if (!set || set.completed) return;

    const { primaryValue, secondaryValue, actualRpe, isPR } = completionData;

    // Mark set as completed
    set.completed = true;
    set.completed_at = new Date().toISOString();
    set.actual_primary_value = primaryValue;
    set.actual_secondary_value = secondaryValue;
    set.actual_rpe = actualRpe;
    set.was_pr = isPR || false;

    // Handle PR detection for ALL templates
    if (isPR && primaryValue != null) {
      const exerciseId = set.exercise_id;
      const template = set.measurement_template;

      // Calculate PR score for this template
      const prScore = computePRScore(template, primaryValue, secondaryValue);

      const currentSessionBest = state.activeWorkout.sessionBestPRs[exerciseId];

      // Only keep the best PR per exercise in the session
      if (!currentSessionBest || prScore > currentSessionBest.pr_score) {
        // Clear was_pr from previous best set if it exists
        if (currentSessionBest) {
          const prevBestSet = state.activeWorkout.sets[currentSessionBest.tempSetId];
          if (prevBestSet) {
            prevBestSet.was_pr = false;
          }
        }

        // Set new session best
        state.activeWorkout.sessionBestPRs[exerciseId] = {
          tempSetId: set.tempId,
          exercise_id: exerciseId,
          measurement_template: template,
          primary_value: primaryValue,
          secondary_value: secondaryValue ?? null,
          pr_score: prScore,
          created_at: new Date().toISOString(),
        };
      } else {
        // This PR is not better than current session best
        set.was_pr = false;
      }
    }

    // ... rest of the function (timer logic, etc.)
  });
},
```

### 3. Finish Workout Data Prep (`prepare-finish-data.ts`)

```typescript
// ============================================
// TIPOS (cerca del inicio del archivo)
// ============================================

type PRCurrentData = {
  id: string;
  user_id: string;
  exercise_id: string;
  measurement_template: MeasurementTemplateId;
  best_primary_value: number;
  best_secondary_value: number | null;
  pr_score: number;
  achieved_at: string;
  source: "auto";
};

type PRHistoryData = {
  id: string;
  user_id: string;
  exercise_id: string;
  measurement_template: MeasurementTemplateId;
  primary_value: number;
  secondary_value: number | null;
  pr_score: number;
  workout_session_id: string;
  workout_set_id: string;
  source: "auto";
};

// ============================================
// FUNCIÓN: preparePRsData (línea ~410)
// ============================================

function preparePRsData(
  activeWorkout: ActiveWorkoutState,
  userId: string,
  sessionId: string,
  setIdMappings: Record<string, string>
): PRsData {
  const sessionPRs = Object.values(activeWorkout.sessionBestPRs || {});

  if (sessionPRs.length === 0) {
    return { current: [], history: [] };
  }

  const current: PRCurrentData[] = sessionPRs.map((pr) => ({
    id: generateUUID(),
    user_id: userId,
    exercise_id: pr.exercise_id,
    measurement_template: pr.measurement_template,
    best_primary_value: pr.primary_value,
    best_secondary_value: pr.secondary_value,
    pr_score: pr.pr_score,
    achieved_at: pr.created_at,
    source: "auto" as const,
  }));

  const history: PRHistoryData[] = sessionPRs.map((pr) => ({
    id: generateUUID(),
    user_id: userId,
    exercise_id: pr.exercise_id,
    measurement_template: pr.measurement_template,
    primary_value: pr.primary_value,
    secondary_value: pr.secondary_value,
    pr_score: pr.pr_score,
    workout_session_id: sessionId,
    workout_set_id: setIdMappings[pr.tempSetId] || "",
    source: "auto" as const,
  }));

  return { current, history };
}
```

### 4. PR Repository Updates (`shared/db/repository/pr.ts`)

```typescript
// Actualizar todas las queries para usar los nuevos campos

export const prRepository = {
  getCurrentPR: async (
    userId: string,
    exerciseId: string
  ): Promise<BasePRCurrent | null> => {
    const [row] = await db
      .select()
      .from(pr_current)
      .where(
        and(
          eq(pr_current.user_id, userId),
          eq(pr_current.exercise_id, exerciseId)
        )
      );
    return row || null;
  },

  upsertCurrentPR: async (data: PRCurrentInsert): Promise<BasePRCurrent> => {
    const [existing] = await db
      .select()
      .from(pr_current)
      .where(
        and(
          eq(pr_current.user_id, data.user_id),
          eq(pr_current.exercise_id, data.exercise_id)
        )
      );

    if (existing) {
      const [updated] = await db
        .update(pr_current)
        .set({
          measurement_template: data.measurement_template,
          best_primary_value: data.best_primary_value,
          best_secondary_value: data.best_secondary_value,
          pr_score: data.pr_score,
          achieved_at: data.achieved_at,
          source: data.source,
          updated_at: new Date().toISOString(),
        })
        .where(eq(pr_current.id, existing.id))
        .returning();
      return updated;
    }

    const id = generateUUID();
    const [inserted] = await db
      .insert(pr_current)
      .values({ id, ...data })
      .returning();
    return inserted;
  },

  getAllCurrentPRsWithExerciseInfo: async (userId: string) => {
    const rows = await db
      .select({
        id: pr_current.id,
        user_id: pr_current.user_id,
        exercise_id: pr_current.exercise_id,
        measurement_template: pr_current.measurement_template,
        best_primary_value: pr_current.best_primary_value,
        best_secondary_value: pr_current.best_secondary_value,
        pr_score: pr_current.pr_score,
        achieved_at: pr_current.achieved_at,
        source: pr_current.source,
        created_at: pr_current.created_at,
        updated_at: pr_current.updated_at,
        exercise_name: exercises.name,
        exercise_muscle: exercises.main_muscle_group,
        exercise_default_template: exercises.default_measurement_template,
      })
      .from(pr_current)
      .innerJoin(exercises, eq(pr_current.exercise_id, exercises.id))
      .where(eq(pr_current.user_id, userId))
      .orderBy(desc(pr_current.pr_score)); // Order by score

    return rows;
  },

  // ... resto de métodos actualizados
};
```

---

## 🎨 Cambios de UI

### 1. PR List Types (`features/pr-list-v2/types/pr-list.ts`)

```typescript
import { MeasurementTemplateId } from "@/shared/types/measurement";
import { IExerciseMuscle } from "@/shared/types/workout";

export type PRListItem = {
  id: string;
  user_id: string;
  exercise_id: string;
  exercise_name: string;
  exercise_muscle: IExerciseMuscle;

  // NEW: Template-aware fields
  measurement_template: MeasurementTemplateId;
  best_primary_value: number;
  best_secondary_value: number | null;
  pr_score: number;

  achieved_at: string;
  source: "auto" | "manual";
  created_at: string;
  updated_at: string;

  is_recent?: boolean;
  exercise_muscle_category?: string;
};
```

### 2. PR Card Display (`features/pr-list-v2/components/PRCardV2.tsx`)

```typescript
import { formatPRDisplay, formatPRScore } from "@/shared/utils/pr-formatters";

export const PRCardV2: React.FC<Props> = ({ pr, index, onPress, lang }) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const weightUnit = prefs?.weight_unit ?? "kg";
  const distanceUnit = prefs?.distance_unit ?? "metric";

  // Format PR value based on template
  const { mainDisplay, scoreDisplay, scoreName } = formatPRDisplay(
    pr.measurement_template,
    pr.best_primary_value,
    pr.best_secondary_value,
    pr.pr_score,
    weightUnit,
    distanceUnit,
    lang
  );

  return (
    <Animated.View entering={FadeInDown.duration(300).delay(200 + index * 40)}>
      <Pressable onPress={onPress} style={...}>
        {/* ... */}

        {/* Main Value Display */}
        <View style={styles.weightRow}>
          <Typography variant="h5" weight="bold">
            {mainDisplay}
          </Typography>
        </View>

        {/* Score Display (1RM, Duration, etc.) */}
        <View style={styles.rmContainer}>
          <Typography variant="caption" style={{ color: colors.primary[500] }}>
            {scoreName}
          </Typography>
          <Typography variant="h6" weight="bold" style={{ color: colors.primary[500] }}>
            {scoreDisplay}
          </Typography>
        </View>

        {/* ... */}
      </Pressable>
    </Animated.View>
  );
};
```

### 3. PR Formatters (`shared/utils/pr-formatters.ts`) - NEW FILE

```typescript
import { MeasurementTemplateId } from "@/shared/types/measurement";
import { PR_SCORE_CONFIG } from "@/shared/db/utils/pr";
import { fromKg, WeightUnit } from "./weight-conversion";
import { DistanceUnit } from "./distance-conversion";
import { SupportedLanguage } from "@/shared/types/language";

export interface PRDisplayData {
  mainDisplay: string; // "100 kg × 5" or "2:35" or "5.2 km"
  scoreDisplay: string; // "116.7 kg" or "155 s" or "5.2 km"
  scoreName: string; // "Est. 1RM" or "Duration" or "Distance"
}

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  if (mins === 0) return `${secs}s`;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const formatDistance = (
  meters: number,
  unit: DistanceUnit,
  templateUnit: "m" | "km"
): string => {
  if (templateUnit === "km") {
    // Already in km
    if (unit === "imperial") {
      return `${(meters * 0.621371).toFixed(2)} mi`;
    }
    return `${meters.toFixed(2)} km`;
  } else {
    // In meters
    if (unit === "imperial") {
      return `${Math.round(meters * 3.28084)} ft`;
    }
    return `${Math.round(meters)} m`;
  }
};

export const formatPRDisplay = (
  template: MeasurementTemplateId,
  primaryValue: number,
  secondaryValue: number | null,
  prScore: number,
  weightUnit: WeightUnit,
  distanceUnit: DistanceUnit,
  lang: SupportedLanguage
): PRDisplayData => {
  const config = PR_SCORE_CONFIG[template];

  const scoreNames: Record<string, Record<SupportedLanguage, string>> = {
    estimated_1rm: { es: "Est. 1RM", en: "Est. 1RM" },
    longest_hold: { es: "Duración", en: "Duration" },
    tut_volume: { es: "Volumen TUT", en: "TUT Volume" },
    longest_distance: { es: "Distancia", en: "Distance" },
    total_work: { es: "Trabajo Total", en: "Total Work" },
  };

  switch (template) {
    case "weight_reps":
    case "weight_reps_range": {
      const weight = fromKg(primaryValue, weightUnit, 1);
      const reps = secondaryValue || 0;
      const score = fromKg(prScore, weightUnit, 1);
      return {
        mainDisplay: `${weight} ${weightUnit} × ${reps}`,
        scoreDisplay: `${score} ${weightUnit}`,
        scoreName: scoreNames[config.scoreName][lang],
      };
    }

    case "time_only": {
      return {
        mainDisplay: formatDuration(primaryValue),
        scoreDisplay: formatDuration(prScore),
        scoreName: scoreNames[config.scoreName][lang],
      };
    }

    case "weight_time": {
      const weight = fromKg(primaryValue, weightUnit, 1);
      const duration = formatDuration(secondaryValue || 0);
      return {
        mainDisplay: `${weight} ${weightUnit} × ${duration}`,
        scoreDisplay: `${Math.round(prScore)} ${weightUnit}·s`,
        scoreName: scoreNames[config.scoreName][lang],
      };
    }

    case "distance_only": {
      const dist = formatDistance(primaryValue, distanceUnit, "m");
      return {
        mainDisplay: dist,
        scoreDisplay: dist,
        scoreName: scoreNames[config.scoreName][lang],
      };
    }

    case "distance_time": {
      const dist = formatDistance(primaryValue, distanceUnit, "km");
      const time = formatDuration((secondaryValue || 0) * 60); // min to sec
      return {
        mainDisplay: `${dist} en ${time}`,
        scoreDisplay: dist,
        scoreName: scoreNames[config.scoreName][lang],
      };
    }

    case "weight_distance": {
      const weight = fromKg(primaryValue, weightUnit, 1);
      const dist = formatDistance(secondaryValue || 0, distanceUnit, "m");
      return {
        mainDisplay: `${weight} ${weightUnit} × ${dist}`,
        scoreDisplay: `${Math.round(prScore)} ${weightUnit}·m`,
        scoreName: scoreNames[config.scoreName][lang],
      };
    }

    default:
      return {
        mainDisplay: String(primaryValue),
        scoreDisplay: String(prScore),
        scoreName: "Score",
      };
  }
};
```

### 4. PR Hero Card Update (`PRHeroCardV2.tsx`)

Similar pattern - use `formatPRDisplay` to show the correct format based on template.

### 5. PR Celebration Update

The celebration animation/toast should show the appropriate message:

```typescript
// En active workout cuando se detecta PR
const celebrationMessage = getCelebrationMessage(
  pr.measurement_template,
  pr.primary_value,
  pr.secondary_value,
  pr.pr_score,
  lang
);

// Ejemplo de mensajes:
// weight_reps: "🎉 NEW PR! 100kg × 5 (Est. 1RM: 116.7kg)"
// time_only: "🎉 NEW PR! Longest Hold: 2:35"
// distance_time: "🎉 NEW PR! Longest Distance: 10.5km"
```

---

## ✅ Checklist de Implementación

### Fase 1: Schema & Types

- [ ] Update `shared/db/schema/pr.ts`
- [ ] Create Drizzle migration
- [ ] Update `supabase_functions/supabase-schema.sql`
- [ ] Update `features/pr-list-v2/types/pr-list.ts`
- [ ] Update `features/pr-detail-v2/types/pr-detail.ts`

### Fase 2: Core Logic

- [ ] Update `shared/db/utils/pr.ts` with `computePRScore` and config
- [ ] Create `shared/utils/pr-formatters.ts`
- [ ] Update `shared/db/repository/pr.ts`
- [ ] Update `features/active-workout-v2/hooks/use-active-workout-store.ts`
- [ ] Update `shared/services/finish-workout/prepare-finish-data.ts`

### Fase 3: Sync Engine

- [ ] Update `shared/sync/restore/restore-service.ts`
- [ ] Update `shared/sync/restore/incremental-sync.ts`
- [ ] Update `supabase_functions/supabase-rpc-finish-workout.sql`

### Fase 4: UI Components

- [ ] Update `features/pr-list-v2/components/PRCardV2.tsx`
- [ ] Update `features/pr-detail-v2/components/PRHeroCardV2.tsx`
- [ ] Update `features/pr-detail-v2/components/PRChartV2.tsx`
- [ ] Update `features/pr-detail-v2/components/PRHistoryV2.tsx`
- [ ] Update `features/pr-detail-v2/components/PRStatsCardsV2.tsx`

### Fase 5: Translations

- [ ] Update `shared/translations/pr-list.ts`
- [ ] Update `shared/translations/pr-detail.ts`

### Fase 6: Testing

- [ ] Test PR detection for `weight_reps`
- [ ] Test PR detection for `time_only`
- [ ] Test PR detection for `weight_time`
- [ ] Test PR detection for `distance_time`
- [ ] Test PR detection for `distance_only`
- [ ] Test PR detection for `weight_distance`
- [ ] Test PR list display for all templates
- [ ] Test PR detail display for all templates
- [ ] Test sync to Supabase

---

## 📝 Notas Adicionales

### ¿Qué pasa si un ejercicio cambia de template?

Dado que los PRs son por `exercise_id` + `measurement_template` implícito en los valores, si un ejercicio cambia de template durante un workout (usando la feature de cambio de template), el PR se trackea con el template usado en ese momento.

Esto significa que un ejercicio podría tener un PR de `weight_reps` (100kg × 5) Y un PR de `time_only` (30 segundos) si el usuario cambió el template. **Esto es correcto** porque son métricas diferentes.

Para V1, recomiendo mantener un solo PR por ejercicio basado en el último template usado. Si queremos soportar múltiples PRs por ejercicio (uno por template), sería una V2.

### Orden de PRs en la lista

Actualmente ordenamos por `estimated_1rm` desc. Con múltiples templates, esto no tiene sentido.

**Opciones**:

1. **Ordenar por fecha** (achieved_at desc) - más recientes primero
2. **Ordenar por score** dentro de cada template - requiere grouping
3. **Ordenar por fecha siempre** - simple y consistente

**Recomendación**: Ordenar por `achieved_at` desc (más recientes primero) como default.

---

_Documento creado: Diciembre 2024_
_Listo para implementación_
