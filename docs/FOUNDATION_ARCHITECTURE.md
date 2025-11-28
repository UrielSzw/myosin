# 🏗️ FOUNDATION ARCHITECTURE - Data Model para IA y Correlaciones

> **Objetivo**: Preparar la base de datos para habilitar features avanzadas como correlaciones automáticas, readiness scores, insights de IA, y análisis predictivo.

---

## 📊 Estado Actual del Data Model

### Lo que tenemos (bien hecho):

| Área          | Fortalezas                                                                                              |
| ------------- | ------------------------------------------------------------------------------------------------------- |
| **Tracker**   | Sistema de normalización (`canonical_unit`), `input_types` flexibles, `daily_aggregates` pre-calculados |
| **Workout**   | Estructura jerárquica clara (session → blocks → exercises → sets), planned vs actual values             |
| **PRs**       | Historial separado del current, referencias a `workout_session_id` y `workout_set_id`                   |
| **Exercises** | Buen metadata (muscle groups, equipment, `measurement_template`)                                        |

### Gaps críticos identificados:

#### 1. **No hay "punto de encuentro" temporal**

```
TRACKER                      WORKOUT
tracker_entries              workout_sessions
├── day_key: "2025-01-15"    ├── started_at: "2025-01-15T10:30:00"
├── recorded_at: timestamp   └── finished_at: "2025-01-15T12:00:00"
└── ???

                 🤔 ¿Cómo sabe el sistema que el Sleep: 7h
                    fue la noche ANTES del workout?
```

#### 2. **No hay contexto de sesión**

`workout_sessions` solo tiene `notes`, `started_at`, `finished_at`. **Falta**:

- ¿Cómo se sintió el usuario? (energía, motivación, fatiga percibida)
- ¿Fue el primer workout del día?
- ¿Hubo factores externos?

#### 3. **No hay categorización semántica de métricas**

Las métricas del tracker son "planas". El sistema no sabe que:

- **Sleep, HRV, Mood** → métricas de **READINESS/INPUT**
- **Protein, Water, Steps** → métricas de **BEHAVIOR/COMPLIANCE**
- **Weight, Body Fat** → métricas de **OUTPUT/OUTCOME**

#### 4. **No hay tabla de "Daily Snapshot"**

Para correlaciones, necesitas un registro consolidado por día que una todo.

---

## 🔧 Cambios Propuestos al Schema

### 1. Nueva tabla: `daily_summaries`

El "punto de encuentro" de toda la data de un día.

```typescript
export const daily_summaries = sqliteTable(
  "daily_summaries",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateUUID()),
    user_id: text("user_id").notNull(),
    day_key: text("day_key").notNull(), // YYYY-MM-DD

    // ===== WORKOUT SUMMARY =====
    workout_count: integer("workout_count").default(0),
    total_volume_kg: real("total_volume_kg"),
    total_sets: integer("total_sets"),
    total_duration_minutes: integer("total_duration_minutes"),
    avg_rpe: real("avg_rpe"),
    muscle_groups_trained: text("muscle_groups_trained", {
      mode: "json",
    }).$type<string[]>(),

    // ===== READINESS METRICS (auto-populated from tracker) =====
    sleep_hours: real("sleep_hours"),
    sleep_quality: real("sleep_quality"),
    energy_level: real("energy_level"),
    mood_score: real("mood_score"),
    hrv: real("hrv"),
    resting_hr: real("resting_hr"),

    // ===== COMPLIANCE METRICS =====
    protein_g: real("protein_g"),
    water_ml: real("water_ml"),
    calories: real("calories"),
    steps: integer("steps"),

    // ===== BODY METRICS =====
    body_weight_kg: real("body_weight_kg"),
    body_fat_percent: real("body_fat_percent"),

    // ===== COMPUTED SCORES =====
    readiness_score: real("readiness_score"), // 0-100 calculated
    compliance_score: real("compliance_score"), // 0-100 calculated

    ...timestamps,
  },
  (t) => [uniqueIndex("unique_daily_summary").on(t.user_id, t.day_key)]
);
```

### 2. Agregar `category` a `tracker_metrics`

```typescript
// Nuevos campos en tracker_metrics:

category: text("category")
  .$type<"readiness" | "compliance" | "body_composition" | "performance" | "custom">()
  .notNull()
  .default("custom"),

// Mapeo automático al daily_summary
canonical_field: text("canonical_field"), // 'sleep_hours', 'protein_g', etc.
```

**Categorías**:
| Category | Descripción | Ejemplos |
|----------|-------------|----------|
| `readiness` | Métricas que afectan performance | Sleep, HRV, Energy, Mood |
| `compliance` | Hábitos/comportamientos a cumplir | Protein, Water, Steps, Calories |
| `body_composition` | Métricas corporales | Weight, Body Fat, Muscle Mass |
| `performance` | Métricas de rendimiento | (reserved for future) |
| `custom` | Todo lo demás | Cualquier métrica personalizada |

### 3. Agregar contexto a `workout_sessions`

```typescript
// Nuevos campos en workout_sessions:

// Pre-workout context (al iniciar sesión)
pre_energy: integer("pre_energy"), // 1-5 scale
pre_motivation: integer("pre_motivation"), // 1-5 scale
pre_sleep_quality: integer("pre_sleep_quality"), // 1-5 quick input

// Post-workout reflection (al terminar)
post_satisfaction: integer("post_satisfaction"), // 1-5
post_difficulty: integer("post_difficulty"), // 1-5 perceived
workout_quality_score: integer("workout_quality_score"), // 1-10 overall

// Metadata para joins
day_key: text("day_key"), // YYYY-MM-DD para joins fáciles
```

### 4. Nueva tabla: `correlations_cache`

Pre-calculated correlations para UI rápida.

```typescript
export const correlations_cache = sqliteTable("correlations_cache", {
  id: text("id").primaryKey(),
  user_id: text("user_id").notNull(),

  metric_a: text("metric_a").notNull(), // 'sleep_hours' or metric_id
  metric_b: text("metric_b").notNull(), // 'workout_volume' or metric_id

  correlation_coefficient: real("correlation_coefficient"), // -1 to 1
  sample_size: integer("sample_size").notNull(),
  confidence: real("confidence"), // statistical significance

  period_start: text("period_start").notNull(),
  period_end: text("period_end").notNull(),

  ...timestamps,
});
```

---

## 🎯 Por qué esto es "Superador"

### 1. Correlaciones automáticas

- "Cuando duermes >7h, tu volumen promedio es 15% mayor"
- "Tu RPE es 1.2 puntos menor cuando tomaste >3L agua el día anterior"

### 2. Readiness Score real

- Basado en datos reales del usuario, no fórmulas genéricas
- Sleep + HRV + Mood → Score personalizado con weights aprendidos

### 3. IA lista para usar

- `daily_summaries` es el dataset perfecto para ML
- Un modelo puede predecir "hoy tu readiness es 73%, considera bajar volumen"

### 4. Data portátil

- Export a CSV limpio por día
- Compatible con cualquier herramienta de análisis externa

---

## 🚀 Plan de Implementación

### Fase 1: Schema Changes

1. **Migration 1**: Agregar `category` y `canonical_field` a `tracker_metrics`
2. **Migration 2**: Agregar campos de contexto a `workout_sessions`
3. **Migration 3**: Crear tabla `daily_summaries`
4. **Migration 4**: Crear tabla `correlations_cache`

### Fase 2: Services

5. Crear `dailySummaryService.ts` que populate automáticamente
6. Actualizar templates de métricas con categorías correctas

### Fase 3: Triggers/Background Jobs

7. Trigger que actualiza `daily_summaries` cuando:
   - Se completa un workout
   - Se agrega una tracker entry
   - Se hace sync

### Fase 4: UI (futuro)

8. UI para pre/post workout context
9. Dashboard de correlaciones
10. Readiness score widget

---

## 📋 Mapping de Métricas Existentes

| Métrica Actual  | Category           | `canonical_field`  |
| --------------- | ------------------ | ------------------ |
| Peso            | `body_composition` | `body_weight_kg`   |
| Agua            | `compliance`       | `water_ml`         |
| Proteína        | `compliance`       | `protein_g`        |
| Sueño           | `readiness`        | `sleep_hours`      |
| Pasos           | `compliance`       | `steps`            |
| Creatina        | `compliance`       | `null`             |
| Cafeína         | `readiness`        | `null`             |
| Estado de ánimo | `readiness`        | `mood_score`       |
| Energía         | `readiness`        | `energy_level`     |
| Calorías        | `compliance`       | `calories`         |
| Grasa corporal  | `body_composition` | `body_fat_percent` |

---

## 🔮 Futuras Posibilidades (habilitadas por esta arquitectura)

1. **Readiness Score personalizado**: Weights aprendidos por usuario
2. **Predicción de PRs**: "Basado en tu historial, esta semana podrías PR en Bench"
3. **Alertas inteligentes**: "Tu compliance de proteína bajó 30% esta semana"
4. **Recomendaciones de deload**: "3 semanas de volumen alto + sleep bajo = considera deload"
5. **Comparación temporal**: "Este mes vs mes pasado" con todas las métricas
6. **Export para coaches**: Data consolidada lista para análisis externo
