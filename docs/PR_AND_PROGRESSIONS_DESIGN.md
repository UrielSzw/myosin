# 🎯 Análisis Profundo: PRs Time-Based y Progression Trees

> Documento de diseño para dos features clave: Sistema de PRs expandido y Árboles de Progresión de Skills

---

## 📊 Parte 1: PR Tracking Time-Based

### Estado Actual del Sistema de PRs

#### Schema Actual (`pr_current` y `pr_history`)

```typescript
// pr_current
{
  exercise_id: string;
  best_weight: real; // ← Solo peso
  best_reps: integer; // ← Solo reps
  estimated_1rm: real; // ← Calculado con Epley
  achieved_at: string;
  source: "auto" | "manual";
}
```

#### Limitaciones Actuales

1. **Solo soporta `weight_reps`**: El schema está hardcodeado para peso × repeticiones
2. **Fórmula Epley única**: `1RM = peso × (1 + reps/30)` - no aplica a tiempo
3. **Sin métricas time-based**: No hay campos para `best_time`, `best_duration`
4. **PR detection hardcodeada**: En `completeSet()` solo detecta PRs si `measurement_template === "weight_reps"`

```typescript
// use-active-workout-store.ts líneas 1522-1526
if (
  isPR &&
  (set.measurement_template === "weight_reps" ||
    set.measurement_template === "weight_reps_range") &&
  ...
)
```

---

### Propuesta: Sistema de PRs Multi-Template

#### Opción A: Campos Genéricos (Recomendada ✅)

Cambiar el schema para usar campos genéricos que soporten cualquier template:

```typescript
// NUEVO schema pr_current
{
  id: string;
  user_id: string;
  exercise_id: string;

  // Measurement template que define cómo interpretar los valores
  measurement_template: MeasurementTemplateId;

  // Valores genéricos (interpretados según template)
  best_primary_value: real;      // peso, tiempo, distancia según template
  best_secondary_value?: real;   // reps, tiempo, distancia según template

  // Score comparable para ranking (opcional)
  computed_score?: real;         // Para poder comparar PRs entre sí

  achieved_at: string;
  source: "auto" | "manual";
}
```

**Interpretación por Template:**

| Template            | `best_primary`   | `best_secondary`     | `computed_score`      |
| ------------------- | ---------------- | -------------------- | --------------------- |
| `weight_reps`       | Peso (kg)        | Reps                 | Epley 1RM             |
| `weight_reps_range` | Peso (kg)        | Reps (max del rango) | Epley 1RM             |
| `time_only`         | Tiempo (seg)     | -                    | Tiempo                |
| `weight_time`       | Peso (kg)        | Tiempo (seg)         | peso × tiempo         |
| `distance_time`     | Distancia (m/km) | Tiempo (seg)         | velocidad o distancia |
| `weight_distance`   | Peso (kg)        | Distancia (m)        | peso × distancia      |
| `distance_only`     | Distancia        | -                    | Distancia             |

#### Opción B: Tablas Separadas por Tipo

```typescript
// pr_strength (weight_reps)
{ exercise_id, best_weight, best_reps, estimated_1rm, ... }

// pr_time (time_only)
{ exercise_id, best_duration_seconds, ... }

// pr_weighted_time (weight_time)
{ exercise_id, best_weight, best_duration_seconds, ... }
```

**Pros**: Schema más explícito
**Cons**: Muchas tablas, queries más complejas, difícil de extender

---

### Tipos de PRs por Template

#### 1. `time_only` (Plancha, Hollow Hold, Dead Hang)

```typescript
type TimePR = {
  exercise_id: string;
  best_duration_seconds: number; // "Longest Hold"
  achieved_at: string;
};
```

**Lógica de PR**: `nuevoDuration > currentBestDuration`

**UI**:

```
🏆 Longest Plank: 2:35
   +15s from previous best (2:20)
```

#### 2. `weight_time` (Weighted Plank, Farmer's Walk Hold)

```typescript
type WeightedTimePR = {
  exercise_id: string;
  best_weight: number;
  best_duration_seconds: number;
  computed_score: number; // peso × tiempo (o solo peso si duración fija)
};
```

**Lógica de PR**: ¿Qué es "mejor"?

- **Opción 1**: Mayor peso con mismo tiempo mínimo (ej: 30 seg)
- **Opción 2**: Mayor `peso × tiempo` score
- **Opción 3**: Ambos como PRs separados ("Best Weight", "Longest Hold")

**Recomendación**: Trackear **múltiples dimensiones** de PR:

```typescript
// Para weight_time podría haber:
{
  pr_type: "heaviest_weight",     // Mayor peso (cualquier duración)
  pr_type: "longest_duration",    // Mayor duración (cualquier peso)
  pr_type: "best_volume",         // Mayor peso × tiempo
}
```

#### 3. `distance_time` (Running, Rowing, Cycling)

```typescript
type DistanceTimePR = {
  exercise_id: string;
  distance: number; // km o m
  time_seconds: number;
  // PRs posibles:
  fastest_5k?: number; // Mejor tiempo para 5km
  longest_distance?: number; // Mayor distancia
  best_pace?: number; // Mejor ritmo (min/km)
};
```

**Complejidad**: Para cardio, los PRs son más complejos:

- "Fastest 5K" requiere trackear distancia fija
- "Longest Run" es distancia máxima
- "Best Pace" es velocidad promedio

**Recomendación para V1**: Mantener simple con `distance` y `time`, calcular pace como métrica derivada.

---

### Cambios Necesarios (Roadmap)

#### Fase 1: Schema Migration

```sql
-- Agregar campos genéricos a pr_current
ALTER TABLE pr_current ADD COLUMN measurement_template TEXT DEFAULT 'weight_reps';
ALTER TABLE pr_current ADD COLUMN best_primary_value REAL;
ALTER TABLE pr_current ADD COLUMN best_secondary_value REAL;
ALTER TABLE pr_current ADD COLUMN computed_score REAL;

-- Migrar datos existentes
UPDATE pr_current SET
  best_primary_value = best_weight,
  best_secondary_value = best_reps,
  computed_score = estimated_1rm;

-- Mismo para pr_history
```

#### Fase 2: Lógica de Cálculo

```typescript
// shared/db/utils/pr.ts - NUEVO

export const computePRScore = (
  template: MeasurementTemplateId,
  primaryValue: number,
  secondaryValue?: number
): number => {
  switch (template) {
    case "weight_reps":
    case "weight_reps_range":
      return computeEpley1RM(primaryValue, secondaryValue || 0);

    case "time_only":
      return primaryValue; // Más tiempo = mejor

    case "weight_time":
      // Peso × tiempo como score compuesto
      return primaryValue * (secondaryValue || 0);

    case "distance_time":
      // Velocidad: distancia / tiempo (más alto = mejor)
      return secondaryValue
        ? (primaryValue / secondaryValue) * 1000
        : primaryValue;

    case "weight_distance":
      return primaryValue * (secondaryValue || 0);

    case "distance_only":
      return primaryValue;

    default:
      return 0;
  }
};

export const isPRBetter = (
  template: MeasurementTemplateId,
  newScore: number,
  currentScore: number | null
): boolean => {
  if (currentScore === null) return true;

  // Para todos los templates actuales, mayor score = mejor
  return newScore > currentScore;
};
```

#### Fase 3: Actualizar PR Detection en Active Workout

```typescript
// use-active-workout-store.ts - completeSet()

// ANTES (solo weight_reps):
if (
  isPR &&
  (set.measurement_template === "weight_reps" || ...)
)

// DESPUÉS (todos los templates):
if (isPR && primaryValue) {
  const score = computePRScore(
    set.measurement_template,
    primaryValue,
    secondaryValue
  );

  // Guardar PR con template
  state.activeWorkout.sessionBestPRs[exerciseId] = {
    tempSetId: set.tempId,
    exercise_id: exerciseId,
    measurement_template: set.measurement_template,
    primary_value: primaryValue,
    secondary_value: secondaryValue,
    computed_score: score,
    created_at: new Date().toISOString(),
  };
}
```

#### Fase 4: UI Updates

**PR List View**:

```typescript
// Mostrar PR según template
const formatPRValue = (pr: PRListItem): string => {
  switch (pr.measurement_template) {
    case "time_only":
      return formatDuration(pr.best_primary_value); // "2:35"
    case "weight_reps":
      return `${pr.best_primary_value}kg × ${pr.best_secondary_value}`;
    case "weight_time":
      return `${pr.best_primary_value}kg × ${formatDuration(
        pr.best_secondary_value
      )}`;
    // ...
  }
};
```

**PR Celebration**:

- Para `time_only`: "🎉 NEW PR! Longest Plank: 2:35 (+15s)"
- Para `weight_reps`: "🎉 NEW PR! 100kg × 5 (Est. 1RM: 117kg)"

---

### Consideraciones Especiales

#### ¿Qué pasa con ejercicios que cambian de template?

Si un usuario hace Plank con `time_only` y luego cambia a `weight_time`, ¿son PRs comparables?

**Recomendación**: PRs son **por exercise_id + measurement_template**. Si cambia template, es una "nueva línea" de PRs.

#### ¿PRs múltiples por ejercicio?

Para `weight_time`, ¿guardamos "Best Weight" Y "Longest Hold" por separado?

**Opción conservadora (V1)**: Un PR por ejercicio basado en `computed_score`
**Opción avanzada (V2)**: Campo `pr_type` para múltiples dimensiones

---

## 🌳 Parte 2: Progression Trees

### Estado Actual: `similar_exercises`

El campo actual es un **array plano** de IDs de ejercicios:

```typescript
similar_exercises: ["uuid-press-banca-mancuernas", "uuid-flexiones"];
```

**Uso actual**:

- En exercise selector, mostrar "ejercicios similares" cuando se busca alternativa
- Badge "Recomendado" para ejercicios en la lista de similares

**Limitación**: No hay jerarquía, dirección, ni metadata sobre la relación.

---

### Propuesta: Sistema de Progresiones

#### Concepto

Un **Progression Tree** define relaciones jerárquicas entre ejercicios:

```
                    [Muscle-Up]
                    ↑         ↑
        [High Pull-up]    [Deep Chest Dip]
              ↑                   ↑
        [Pull-up]              [Dip]
              ↑                   ↑
      [Inverted Row]     [Bench Dip]
              ↑
      [Dead Hang]
```

Cada relación tiene:

- **Dirección**: A → B significa "A es prerequisito de B"
- **Tipo de relación**: `prerequisite`, `progression`, `regression`, `variation`
- **Criterio de unlock**: "10 reps consecutivos", "30 segundos hold", etc.

---

### Opción A: Extender `similar_exercises` a objeto

```typescript
// exercises schema - NUEVO campo
exercise_progressions: {
  prerequisites: string[];       // Ejercicios más fáciles
  progressions: string[];        // Ejercicios más difíciles
  variations: string[];          // Alternativas del mismo nivel
  unlock_criteria?: {
    exercise_id: string;
    criteria_type: "reps" | "time" | "weight";
    target_value: number;
    description: string;
  }[];
}

// Ejemplo para Pull-up:
{
  prerequisites: ["uuid-inverted-row", "uuid-dead-hang"],
  progressions: ["uuid-weighted-pullup", "uuid-muscle-up"],
  variations: ["uuid-chin-up", "uuid-neutral-grip-pullup"],
  unlock_criteria: [
    {
      exercise_id: "uuid-inverted-row",
      criteria_type: "reps",
      target_value: 15,
      description: "15 Inverted Rows consecutivos"
    },
    {
      exercise_id: "uuid-dead-hang",
      criteria_type: "time",
      target_value: 30,
      description: "30 segundos de Dead Hang"
    }
  ]
}
```

**Pros**: Extensión natural del modelo actual
**Cons**: Información duplicada (A.progressions debe coincidir con B.prerequisites)

---

### Opción B: Tabla de Relaciones Separada (Recomendada ✅)

```typescript
// NUEVA tabla: exercise_progressions
export const exercise_progressions = sqliteTable("exercise_progressions", {
  id: text("id").primaryKey(),

  // Relación
  from_exercise_id: text("from_exercise_id").references(() => exercises.id),
  to_exercise_id: text("to_exercise_id").references(() => exercises.id),

  // Tipo de relación
  relationship_type: text("relationship_type").$type<
    "prerequisite" | "progression" | "variation" | "regression"
  >(),

  // Criterios de progresión (opcional)
  unlock_criteria_type: text("unlock_criteria_type").$type<
    "reps" | "time" | "weight" | "weight_reps" | "manual"
  >(),
  unlock_criteria_value: real("unlock_criteria_value"),
  unlock_criteria_secondary: real("unlock_criteria_secondary"), // Para weight_reps
  unlock_description: text("unlock_description"),

  // Metadata
  difficulty_delta: integer("difficulty_delta"), // +1, +2 para progressions, -1 para regressions
  notes: text("notes"),

  ...timestamps,
});

// Ejemplo de datos:
[
  // Dead Hang → Inverted Row
  {
    from_exercise_id: "uuid-dead-hang",
    to_exercise_id: "uuid-inverted-row",
    relationship_type: "progression",
    unlock_criteria_type: "time",
    unlock_criteria_value: 30,
    unlock_description: "Hold Dead Hang for 30 seconds",
    difficulty_delta: 1,
  },
  // Inverted Row → Pull-up
  {
    from_exercise_id: "uuid-inverted-row",
    to_exercise_id: "uuid-pull-up",
    relationship_type: "progression",
    unlock_criteria_type: "reps",
    unlock_criteria_value: 15,
    unlock_description: "Complete 15 consecutive Inverted Rows",
    difficulty_delta: 2,
  },
  // Pull-up → Muscle-up (requiere múltiples prerequisites)
  {
    from_exercise_id: "uuid-pull-up",
    to_exercise_id: "uuid-muscle-up",
    relationship_type: "prerequisite", // Es UN prerequisite, no el único
    unlock_criteria_type: "reps",
    unlock_criteria_value: 10,
    unlock_description: "10 strict Pull-ups",
    difficulty_delta: 3,
  },
  {
    from_exercise_id: "uuid-chest-dip",
    to_exercise_id: "uuid-muscle-up",
    relationship_type: "prerequisite",
    unlock_criteria_type: "reps",
    unlock_criteria_value: 15,
    unlock_description: "15 deep Dips",
    difficulty_delta: 3,
  },
];
```

**Pros**:

- Relaciones explícitas y bidireccionales fáciles de consultar
- Múltiples prerequisites para un ejercicio
- Criterios de unlock claros
- Extensible sin cambiar schema de exercises

**Cons**:

- Nueva tabla y migraciones
- Requiere mantener consistencia de datos

---

### Sistema de "Unlock" basado en PRs

Con PRs time-based implementados, podemos detectar unlocks automáticamente:

```typescript
// shared/services/progression-service.ts

export const checkUnlockedProgressions = async (
  userId: string,
  exerciseId: string
): Promise<UnlockedProgression[]> => {
  // 1. Obtener PR actual del ejercicio
  const currentPR = await prRepository.getCurrentPR(userId, exerciseId);
  if (!currentPR) return [];

  // 2. Buscar progressions que tengan este ejercicio como prerequisite
  const progressions = await progressionRepository.getProgressionsFrom(
    exerciseId
  );

  // 3. Verificar cada uno contra el PR
  const unlocked: UnlockedProgression[] = [];

  for (const prog of progressions) {
    const isUnlocked = evaluateUnlockCriteria(currentPR, prog);
    if (isUnlocked) {
      unlocked.push({
        exercise_id: prog.to_exercise_id,
        unlocked_by: exerciseId,
        criteria_met: prog.unlock_description,
      });
    }
  }

  return unlocked;
};

const evaluateUnlockCriteria = (
  pr: PRCurrent,
  progression: ExerciseProgression
): boolean => {
  switch (progression.unlock_criteria_type) {
    case "reps":
      return (
        (pr.best_secondary_value || 0) >= progression.unlock_criteria_value
      );

    case "time":
      return (pr.best_primary_value || 0) >= progression.unlock_criteria_value;

    case "weight":
      return (pr.best_primary_value || 0) >= progression.unlock_criteria_value;

    case "weight_reps":
      return (
        (pr.best_primary_value || 0) >= progression.unlock_criteria_value &&
        (pr.best_secondary_value || 0) >=
          (progression.unlock_criteria_secondary || 0)
      );

    default:
      return false;
  }
};
```

---

### UI: Progression Tree View

#### Vista de Lista (Simple)

En el detalle del ejercicio, mostrar:

```
┌─────────────────────────────────────┐
│ 📈 Progression Path                 │
├─────────────────────────────────────┤
│                                     │
│ ⬇️ Easier                          │
│ ┌─────────────────────────────────┐│
│ │ 🔓 Inverted Row                 ││
│ │    ✓ 15 reps achieved (PR: 18) ││
│ └─────────────────────────────────┘│
│                                     │
│ 📍 Current: Pull-up                │
│    PR: 8 reps                       │
│                                     │
│ ⬆️ Harder                          │
│ ┌─────────────────────────────────┐│
│ │ 🔒 Weighted Pull-up             ││
│ │    Unlock: 12 strict Pull-ups   ││
│ │    Progress: 8/12 (67%)         ││
│ └─────────────────────────────────┘│
│ ┌─────────────────────────────────┐│
│ │ 🔒 Muscle-up                    ││
│ │    Requires:                    ││
│ │    • 10 Pull-ups (8/10) ⏳      ││
│ │    • 15 Dips (12/15) ⏳         ││
│ └─────────────────────────────────┘│
│                                     │
│ ↔️ Variations                       │
│ • Chin-up                          │
│ • Neutral Grip Pull-up             │
└─────────────────────────────────────┘
```

#### Vista de Árbol (Avanzada)

Visualización tipo skill tree de videojuego:

```
        [Muscle-up] 🔒
           /    \
    [High Pull] [Deep Dip]
         |          |
    [Pull-up]    [Dip] 🔓
         |          |
  [Inverted Row] [Bench Dip]
         |
   [Dead Hang] 🔓
```

Con nodos:

- 🔓 Verde: Desbloqueado (tiene PR que cumple criterio)
- 🔒 Gris: Bloqueado
- ⏳ Amarillo: En progreso (>50% del criterio)

---

### Roadmap de Implementación

#### Fase 1: Data Model (1-2 sprints)

1. Crear tabla `exercise_progressions`
2. Migración para ejercicios de calistenia principales
3. Repository y queries básicos

#### Fase 2: Backend Logic (1 sprint)

1. `progressionService.getProgressionTree(exerciseId)`
2. `progressionService.checkUnlocks(userId, exerciseId)`
3. Integración con sistema de PRs

#### Fase 3: UI Básica (1-2 sprints)

1. Sección "Progression Path" en ExerciseDetail
2. Lista simple de prerequisites y progressions
3. Indicadores de progreso hacia unlock

#### Fase 4: UI Avanzada (2-3 sprints)

1. Vista de árbol visual interactiva
2. Notificaciones de unlocks ("🎉 You unlocked Weighted Pull-up!")
3. Sugerencias en exercise selector ("Try this next")

---

## 🔗 Dependencias entre Features

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   [PR System Time-Based]                                    │
│          ↓                                                  │
│   [Unlock Detection]  ←──────  [Progression Table]          │
│          ↓                            ↓                     │
│   [Unlock Notifications]      [Progression UI]              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Orden recomendado**:

1. **PRs Time-Based** (independiente, alto valor inmediato)
2. **Progression Table** (data model, puede poblarse gradualmente)
3. **Unlock Detection** (conecta PRs con progressions)
4. **UI de Progressions** (visualización)

---

## 📋 Resumen de Decisiones Pendientes

### Para PRs Time-Based:

| Decisión                         | Opciones                             | Recomendación                   |
| -------------------------------- | ------------------------------------ | ------------------------------- |
| Schema                           | Campos genéricos vs tablas separadas | **Campos genéricos**            |
| PRs múltiples por ejercicio      | Un PR vs múltiples dimensiones       | **V1: Uno, V2: Múltiples**      |
| Ejercicios con template cambiado | Mismo PR vs nuevo "timeline"         | **Nuevo timeline por template** |

### Para Progressions:

| Decisión          | Opciones                         | Recomendación          |
| ----------------- | -------------------------------- | ---------------------- |
| Storage           | Extender campo vs tabla separada | **Tabla separada**     |
| Unlock automático | Basado en PRs vs manual          | **Automático con PRs** |
| UI inicial        | Lista vs árbol                   | **Lista, luego árbol** |

---

_Documento creado: Enero 2025_
_Próxima revisión: Después de decidir prioridades_
