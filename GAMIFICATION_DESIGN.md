# 🎯 Gamificación con Sustancia - Diseño de Features

> **Principio Core**: No XP ni niveles arbitrarios. Solo métricas que tienen significado real y que puedes contarle a alguien.

---

## 1. 🔥 Sistema de Streaks

### Filosofía

- **Streaks semanales, no diarios** - Nadie entrena 7 días, y penalizar por un día perdido genera ansiedad (anti-pattern de Duolingo)
- **Adherencia al plan** - Si planeaste 3 días y entrenaste 3, es 100% de adherencia
- **Freeze inteligente** - Si registrás enfermedad/lesión en Tracker, el streak no se rompe

### Tipos de Streaks

| Streak                 | Definición                                    | Ejemplo                      |
| ---------------------- | --------------------------------------------- | ---------------------------- |
| **Consistency Streak** | Semanas consecutivas cumpliendo ≥80% del plan | "12 semanas de consistencia" |
| **PR Streak**          | Semanas consecutivas logrando al menos 1 PR   | "5 semanas con PRs"          |
| **Volume Streak**      | Semanas manteniendo o aumentando volumen      | "8 semanas de progresión"    |
| **Recovery Streak**    | Días consecutivos con 7+ horas de sueño       | "14 días de buen descanso"   |
| **Tracker Streak**     | Días consecutivos registrando métricas        | "30 días de tracking"        |

### Schema Propuesto

```typescript
// Nueva tabla: streaks
export const streaks = sqliteTable("streaks", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  streakType: text("streak_type").notNull(), // 'consistency' | 'pr' | 'volume' | 'recovery' | 'tracker'
  currentCount: integer("current_count").default(0),
  longestCount: integer("longest_count").default(0),
  lastUpdatedAt: text("last_updated_at"),
  startedAt: text("started_at"),
  // Para freeze
  freezeUsedThisWeek: integer("freeze_used_this_week").default(0), // boolean
  freezeReason: text("freeze_reason"), // 'sick' | 'injured' | 'travel' | null
});

// Historial de streaks (para analytics)
export const streakHistory = sqliteTable("streak_history", {
  id: text("id").primaryKey(),
  streakId: text("streak_id").references(() => streaks.id),
  weekNumber: integer("week_number"), // ISO week
  year: integer("year"),
  wasAchieved: integer("was_achieved"), // boolean
  actualValue: real("actual_value"), // ej: 85% adherencia
  targetValue: real("target_value"), // ej: 80% mínimo
});
```

### UX

```
┌─────────────────────────────────────┐
│ 🔥 Consistency Streak               │
│                                     │
│     12 semanas                      │
│     ████████████░░░░ (mejor: 15)    │
│                                     │
│ Esta semana: 2/3 workouts (67%)     │
│ Necesitás 1 más para mantener 🔥    │
│                                     │
│ [Ver historial]                     │
└─────────────────────────────────────┘
```

---

## 2. 🏆 Milestones Reales

### Filosofía

- **Logros que puedes contar en un gym** - "Soy del Two Plate Club" tiene significado
- **Basados en estándares reales** - Plates, bodyweight ratios, clubes reconocidos
- **Progresivos pero alcanzables** - Cada milestone es un paso hacia el siguiente

### Categorías de Milestones

#### 💪 Milestones de Fuerza (Plates)

| Milestone            | Ejercicio   | Peso  | Descripción             |
| -------------------- | ----------- | ----- | ----------------------- |
| **One Plate Club**   | Bench Press | 60kg  | 1 plato (20kg) por lado |
| **One Plate Squat**  | Squat       | 60kg  | Primer plato en squat   |
| **Two Plate Club**   | Squat       | 100kg | 2 platos por lado       |
| **Two Plate Bench**  | Bench Press | 100kg | Elite amateur           |
| **Three Plate Club** | Deadlift    | 140kg | 3 platos por lado       |
| **Four Plate Dead**  | Deadlift    | 180kg | Serio                   |
| **Five Plate Dead**  | Deadlift    | 220kg | Elite                   |

#### 📊 Milestones de Ratio (Bodyweight)

| Milestone            | Requisito          | Por qué importa              |
| -------------------- | ------------------ | ---------------------------- |
| **Bodyweight Bench** | Bench = 1x BW      | Estándar de fuerza funcional |
| **1.25x Bench**      | Bench = 1.25x BW   | Intermedio fuerte            |
| **1.5x Squat**       | Squat = 1.5x BW    | Base sólida de piernas       |
| **2x Squat**         | Squat = 2x BW      | Avanzado                     |
| **2x Deadlift**      | Deadlift = 2x BW   | Estándar de fuerza           |
| **2.5x Deadlift**    | Deadlift = 2.5x BW | Elite                        |

#### 🏅 Milestones Compuestos

| Milestone               | Requisito     | Descripción              |
| ----------------------- | ------------- | ------------------------ |
| **1000lb Club**         | S+B+D ≥ 453kg | Clásico del powerlifting |
| **1500lb Club**         | S+B+D ≥ 680kg | Elite amateur            |
| **5x Bodyweight Total** | S+B+D ≥ 5x BW | Relativo al peso         |

#### 📈 Milestones de Volumen

| Milestone           | Requisito             | Timeframe      |
| ------------------- | --------------------- | -------------- |
| **Ton Club**        | 1,000kg en una sesión | Single workout |
| **5 Ton Session**   | 5,000kg en una sesión | Single workout |
| **10 Ton Week**     | 10,000kg              | 1 semana       |
| **50 Ton Month**    | 50,000kg              | 1 mes          |
| **100 Ton Month**   | 100,000kg             | 1 mes          |
| **Million KG Club** | 1,000,000kg           | Lifetime       |

#### ⏱️ Milestones de Consistencia

| Milestone            | Requisito                      | Descripción           |
| -------------------- | ------------------------------ | --------------------- |
| **First Month**      | 4 semanas entrenando           | Primer mes completado |
| **Quarter Warrior**  | 12 semanas con 80%+ adherencia | 3 meses sólidos       |
| **Half Year Strong** | 26 semanas activo              | Medio año             |
| **Year of Iron**     | 52 semanas entrenando          | Un año completo       |
| **Two Year Veteran** | 104 semanas activo             | Veterano              |
| **Lifetime Athlete** | 3+ años activo                 | Estilo de vida        |

### Schema Propuesto

```typescript
// Definición de milestones (seed data)
export const milestoneDefinitions = sqliteTable("milestone_definitions", {
  id: text("id").primaryKey(),
  category: text("category").notNull(), // 'strength' | 'ratio' | 'volume' | 'consistency' | 'compound'
  name: text("name").notNull(), // "Two Plate Club"
  description: text("description"),
  requirement: text("requirement").notNull(), // JSON con condiciones
  iconName: text("icon_name"),
  sortOrder: integer("sort_order"),
});

// Milestones logrados por usuario
export const userMilestones = sqliteTable("user_milestones", {
  id: text("id").primaryKey(),
  odette: text("user_id").notNull(),
  milestoneId: text("milestone_id").references(() => milestoneDefinitions.id),
  achievedAt: text("achieved_at").notNull(),
  achievedValue: real("achieved_value"), // ej: 102kg cuando logró "Two Plate"
  workoutSessionId: text("workout_session_id"), // En qué sesión lo logró
});

// Ejemplo de requirement JSON
/*
{
  "type": "exercise_weight",
  "exerciseId": "bench-press",
  "operator": ">=",
  "value": 100,
  "unit": "kg"
}

{
  "type": "bodyweight_ratio",
  "exerciseId": "squat",
  "operator": ">=",
  "ratio": 1.5
}

{
  "type": "total_volume",
  "timeframe": "week",
  "operator": ">=",
  "value": 10000,
  "unit": "kg"
}
*/
```

### UX - Pantalla de Milestones

```
┌─────────────────────────────────────┐
│ 🏆 Milestones                       │
├─────────────────────────────────────┤
│                                     │
│ FUERZA                    3/7 ✓     │
│ ├── ✅ One Plate Club (Bench)       │
│ ├── ✅ One Plate Squat              │
│ ├── ✅ Two Plate Squat     ← NEW!   │
│ ├── ⬜ Two Plate Bench (87kg/100kg) │
│ ├── ⬜ Three Plate Dead             │
│ └── ...                             │
│                                     │
│ BODYWEIGHT RATIO          1/6 ✓     │
│ ├── ✅ Bodyweight Bench             │
│ ├── ⬜ 1.5x Squat (1.3x actual)     │
│ └── ...                             │
│                                     │
│ VOLUMEN                   2/5 ✓     │
│ ├── ✅ Ton Club                     │
│ ├── ✅ 10 Ton Week                  │
│ └── ...                             │
│                                     │
└─────────────────────────────────────┘
```

---

## 3. 📆 Calendar Heatmap

### Filosofía

- **Visual inmediato** - Como GitHub contributions
- **Densidad de información** - Color = tipo de día, intensidad = volumen
- **Histórico accesible** - Ver patrones de meses/años

### Diseño Visual

```
Diciembre 2025
Lu  Ma  Mi  Ju  Vi  Sa  Do
 1   2   3   4   5   6   7
[🟢][  ][🟢][  ][🔵][  ][  ]
 8   9  10  11  12  13  14
[🟢][  ][🟢][  ][🟢][  ][  ]
15  16  17  18  19  20  21
[🟡][  ][🟢][  ][🟣][  ][  ]
22  23  24  25  26  27  28
[🟢][  ][  ][🎄][🟢][  ][  ]
29  30  31
[🟢][  ][🔵]

Leyenda:
[  ] = No entrenó
[🟡] = Recovery / Light day
[🟢] = Workout normal
[🔵] = PR day
[🟣] = Volume record
```

### Intensidad por Volumen

```
Opción: Gradiente de verde por volumen

[░░] = < 2,000kg
[▒▒] = 2,000 - 5,000kg
[▓▓] = 5,000 - 10,000kg
[██] = > 10,000kg
```

### Schema

No necesita tabla nueva - se calcula desde `workout_sessions` existente.

```typescript
// Query para generar heatmap data
const getHeatmapData = (userId: string, year: number, month: number) => {
  return db.select({
    date: workoutSessions.startedAt,
    totalVolume: sql`SUM(...)`,
    hadPR: sql`EXISTS(SELECT 1 FROM pr_history WHERE ...)`,
    wasVolumeRecord: sql`...`,
  })
  .from(workoutSessions)
  .where(...)
  .groupBy(sql`DATE(started_at)`);
};
```

---

## 4. 🎯 Goals con Deadline

### Filosofía

- **Sin deadline no hay urgencia** - Goals infinitos se postergan infinitamente
- **Medibles y específicos** - "Bench 80kg" no "ser más fuerte"
- **Tracking de progreso** - Ver qué tan cerca estás

### Tipos de Goals

| Tipo                 | Ejemplo                     | Cómo se mide            |
| -------------------- | --------------------------- | ----------------------- |
| **Strength Goal**    | Bench Press 80kg            | Max weight en ejercicio |
| **Volume Goal**      | 50,000kg en diciembre       | Suma de volumen del mes |
| **Consistency Goal** | 4 workouts/semana por 1 mes | Adherencia semanal      |
| **Bodyweight Goal**  | Llegar a 75kg               | Peso del Tracker        |
| **Habit Goal**       | Dormir 7h+ por 30 días      | Sleep del Tracker       |

### Schema Propuesto

```typescript
export const userGoals = sqliteTable("user_goals", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),

  // Definición del goal
  title: text("title").notNull(), // "Bench Press 80kg"
  goalType: text("goal_type").notNull(), // 'strength' | 'volume' | 'consistency' | 'bodyweight' | 'habit'
  targetValue: real("target_value").notNull(), // 80
  targetUnit: text("target_unit"), // 'kg' | 'workouts' | 'days'

  // Contexto (opcional)
  exerciseId: text("exercise_id"), // Para strength goals
  trackerMetricId: text("tracker_metric_id"), // Para habit goals

  // Tiempo
  deadline: text("deadline").notNull(), // ISO date
  createdAt: text("created_at").notNull(),

  // Estado
  status: text("status").default("active"), // 'active' | 'achieved' | 'failed' | 'cancelled'
  achievedAt: text("achieved_at"),
  finalValue: real("final_value"), // Valor cuando terminó

  // Valor inicial (para calcular progreso)
  startingValue: real("starting_value"),
});

// Historial de progreso (opcional, para gráficos)
export const goalProgress = sqliteTable("goal_progress", {
  id: text("id").primaryKey(),
  goalId: text("goal_id").references(() => userGoals.id),
  recordedAt: text("recorded_at").notNull(),
  currentValue: real("current_value").notNull(),
});
```

### UX

```
┌─────────────────────────────────────┐
│ 🎯 Mi Goal Actual                   │
│                                     │
│ "Bench Press 80kg"                  │
│                                     │
│ Progreso: 72.5kg → 80kg             │
│ [████████████████░░░░] 91%          │
│                                     │
│ ⏰ Deadline: 15 Enero 2026          │
│    Quedan 41 días                   │
│                                     │
│ 📈 Ritmo actual: +1.5kg/semana      │
│ 💡 "A este ritmo, lo lograrás en    │
│     ~5 semanas (antes del deadline)"│
│                                     │
│ [Editar] [Cancelar] [Completar ✓]   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 📜 Historial de Goals               │
├─────────────────────────────────────┤
│ ✅ Squat 100kg                      │
│    Logrado: 2 Nov 2025              │
│    3 días antes del deadline!       │
│                                     │
│ ✅ 4 workouts/sem x 1 mes           │
│    Logrado: 15 Oct 2025             │
│                                     │
│ ❌ Deadlift 120kg                   │
│    No logrado: 1 Dic 2025           │
│    Llegaste a: 115kg (96%)          │
│                                     │
│ [+ Nuevo Goal]                      │
└─────────────────────────────────────┘
```

---

## 5. 📊 Tú vs Tú Mismo

### Filosofía

- **La única comparación que importa** - Tu progreso personal
- **Períodos comparables** - Esta semana vs anterior, este mes vs anterior
- **Proyecciones útiles** - "A este ritmo llegarás a X"

### Métricas a Comparar

```
📈 COMPARATIVAS DISPONIBLES

Esta semana vs semana pasada:
├── Volumen total: 12,450kg vs 11,200kg (+11% ↑)
├── Workouts: 4 vs 3 (+1)
├── PRs logrados: 2 vs 0
├── RPE promedio: 7.8 vs 8.2 (-0.4 ↓)
└── Tiempo total: 4h 20m vs 3h 45m

Este mes vs mes pasado:
├── Volumen total: 48,000kg vs 42,000kg (+14% ↑)
├── Workouts: 14 vs 12 (+2)
├── PRs logrados: 5 vs 3
├── Adherencia: 87% vs 75%
└── Ejercicios únicos: 18 vs 15

Este año vs año pasado (cuando aplique):
├── Bench Press 1RM: 85kg vs 70kg (+15kg)
├── Squat 1RM: 110kg vs 90kg (+20kg)
├── Volumen mensual promedio: 45,000kg vs 35,000kg
└── Consistencia promedio: 82% vs 68%
```

### Proyecciones

```
🔮 PROYECCIONES (basadas en tendencia actual)

Bench Press:
├── Actual: 85kg
├── Tendencia: +1.2kg/semana
├── Proyección 1 mes: ~90kg
├── Proyección 3 meses: ~100kg
└── "Two Plate Club" estimado: ~12 semanas

Volumen semanal:
├── Actual: 12,000kg/semana
├── Tendencia: +500kg/semana
└── "50 Ton Month" estimado: ~6 semanas
```

### Schema

No requiere tablas nuevas - se calcula desde data existente con queries agregados.

---

## 6. 🛑 Anti-Metrics (Recovery & Fatigue)

### Filosofía

- **Saber cuándo NO entrenar es igual de valioso**
- **Prevenir lesiones y sobreentrenamiento**
- **Diferenciador único** - Ninguna app hace esto bien

### Fatigue Score

```
📊 FATIGUE SCORE (0-100)

Factores:
├── Volumen últimos 7 días vs promedio (40%)
├── RPE promedio últimos 3 workouts (25%)
├── Días desde último rest day (20%)
├── Calidad de sueño si hay data (15%)

Interpretación:
├── 0-30: Fresh - Listo para PR attempts
├── 31-50: Normal - Training as usual
├── 51-70: Moderate - Considera bajar volumen
├── 71-85: Fatigued - Rest day recomendado
└── 86-100: Overtrained - DESCANSO OBLIGATORIO
```

### Alertas Automáticas

```
⚠️ ALERTAS DE FATIGUE

🟡 Advertencia (amarillo):
├── "Llevas 8 días sin rest day"
├── "Tu RPE promedio esta semana fue 8.7"
├── "Tu volumen subió 30% vs tu promedio"

🔴 Alerta (rojo):
├── "Llevas 12+ días sin rest day"
├── "RPE promedio > 9 por 2 semanas"
├── "Volumen 50%+ sobre tu promedio"
├── "Sueño promedio < 6h por 1 semana"

💡 Sugerencias:
├── "Considera un deload week"
├── "Hoy sería buen día para recuperación activa"
├── "Tu cuerpo necesita descanso - los músculos crecen descansando"
```

### Schema Propuesto

```typescript
// Calculado diariamente, guardado para histórico
export const fatigueScores = sqliteTable("fatigue_scores", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  date: text("date").notNull(), // ISO date

  // Componentes del score
  volumeScore: real("volume_score"), // 0-100
  rpeScore: real("rpe_score"), // 0-100
  restDayScore: real("rest_day_score"), // 0-100
  sleepScore: real("sleep_score"), // 0-100, nullable

  // Score final
  totalScore: real("total_score").notNull(), // 0-100
  recommendation: text("recommendation"), // 'fresh' | 'normal' | 'moderate' | 'fatigued' | 'overtrained'

  createdAt: text("created_at").notNull(),
});
```

### UX

```
┌─────────────────────────────────────┐
│ 🔋 Estado de Recuperación           │
│                                     │
│      [====◯=====]                   │
│           58                        │
│       "Moderado"                    │
│                                     │
│ 📊 Breakdown:                       │
│ ├── Volumen: ████████░░ 75%         │
│ ├── RPE: █████░░░░░ 45%             │
│ ├── Rest days: ██████░░░░ 55%       │
│ └── Sueño: █████████░ 85%           │
│                                     │
│ 💡 "Tu volumen está alto. Considera │
│     bajar intensidad hoy o tomar    │
│     un día de recuperación activa." │
│                                     │
└─────────────────────────────────────┘
```

---

## 7. 📱 Implementación Sugerida

### Fase 1: Foundation (Sprint 1-2)

- [ ] Schema para streaks
- [ ] Cálculo automático de consistency streak
- [ ] UI básica de streaks en perfil
- [ ] Calendar heatmap básico

### Fase 2: Milestones (Sprint 3-4)

- [ ] Schema para milestones
- [ ] Seed de milestone definitions
- [ ] Detección automática de milestones al guardar workout
- [ ] Celebración UI cuando se logra milestone
- [ ] Pantalla de milestones

### Fase 3: Goals (Sprint 5-6)

- [ ] Schema para goals
- [ ] CRUD de goals
- [ ] Tracking automático de progreso
- [ ] Notificaciones de deadline cercano
- [ ] Proyecciones básicas

### Fase 4: Intelligence (Sprint 7-8)

- [ ] Fatigue Score calculation
- [ ] Alertas de sobreentrenamiento
- [ ] Comparativas Tú vs Tú
- [ ] Proyecciones avanzadas

---

## 8. 🎨 Principios de Diseño

1. **Celebrar sin ser molesto** - Animaciones sutiles, no popups bloqueantes
2. **Informar sin abrumar** - Mostrar lo importante, detalles bajo demanda
3. **Motivar sin presionar** - Sugerir, no obligar
4. **Educar mientras se usa** - Tips contextuales sobre por qué importa cada métrica

---

> **Última actualización**: Diciembre 2025
> **Estado**: On Hold - Diseño completo, pendiente implementación
