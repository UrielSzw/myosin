# 🔬 Auditoría Completa del Sistema de Ejercicios

> **Objetivo**: Identificar gaps y oportunidades para tener el mejor sistema de ejercicios del mercado.
>
> **Fecha**: Enero 2025

---

## 📊 Resumen Ejecutivo

### Estado Actual: **SÓLIDO** ✅

Myosin ya tiene una **base técnica excelente** que supera a la mayoría de apps del mercado en:

- Sistema de mediciones flexible (7 templates)
- 10 tipos de sets avanzados
- Progresiones de calistenia estructuradas
- 30+ grupos musculares detallados
- 30+ tipos de equipamiento

### Gaps Principales Identificados:

| Prioridad | Gap                                        | Impacto        |
| --------- | ------------------------------------------ | -------------- |
| 🔴 Alta   | Creación de ejercicios personalizados (UI) | Diferenciación |
| 🟡 Media  | Historial por ejercicio                    | Analytics      |
| 🟡 Media  | Media expandida (videos)                   | Retención      |
| 🟢 Baja   | Dificultad/Rating de ejercicios            | Nice-to-have   |

---

## 📋 Inventario Actual

### 1. Estructura de Ejercicios (Schema)

```typescript
// exercises table
{
  id: string,
  source: 'system' | 'user',                    // ✅ Soporta personalizados
  created_by_user_id: string | null,            // ✅ Para ejercicios de usuario
  main_muscle_group: IExerciseMuscle,           // ✅ Muy detallado
  primary_equipment: IExerciseEquipment,        // ✅ Completo
  exercise_type: 'compound' | 'isolation',      // ✅ Bien
  secondary_muscle_groups: IExerciseMuscle[],   // ✅ Array de músculos secundarios
  equipment: IExerciseEquipment[],              // ✅ Equipamiento alternativo
  similar_exercises: string[],                  // ✅ Para sugerencias
  default_measurement_template: MeasurementTemplateId, // ✅ Flexible
  instructions: string[],                       // ✅ Paso a paso
  media_url: string | null,                     // ✅ GIF/imagen
  media_url_female: string | null,              // ✅ Variante femenina
}
```

**Veredicto**: ✅ Schema muy completo

---

### 2. Grupos Musculares (30+)

```
Upper Body - Push:
  chest_upper, chest_middle, chest_lower,
  front_delts, side_delts, rear_delts,
  triceps

Upper Body - Pull:
  lats, rhomboids,
  mid_traps, lower_traps, upper_traps,
  biceps, forearms

Core:
  rectus_abdominis, obliques, transverse_abdominis,
  erector_spinae, lower_back

Lower Body:
  quads, hamstrings, glutes, calves,
  hip_flexors, hip_adductors, hip_abductors

Otros:
  serratus_anterior, rotator_cuff, full_body
```

**Veredicto**: ✅ Más detallado que Strong, Hevy, JEFIT

---

### 3. Equipamiento (30+)

```
Pesos Libres: barbell, ez_curl_bar, dumbbell, kettlebell, weight_plate
Máquinas: cable_machine, smith_machine, leg_press, lat_pulldown, etc.
Peso Corporal: bodyweight, pull_up_bar, dip_station, parallel_bars
Accesorios: resistance_band, suspension_trainer, medicine_ball, etc.
Bancos: flat_bench, incline_bench, decline_bench, preacher_bench
```

**Veredicto**: ✅ Muy completo

---

### 4. Sistema de Mediciones (7 Templates)

| Template            | Uso                          | Estado |
| ------------------- | ---------------------------- | ------ |
| `weight_reps`       | Press banca, sentadilla      | ✅     |
| `weight_reps_range` | Programación flexible (8-12) | ✅     |
| `time_only`         | Plancha, isométricos         | ✅     |
| `weight_time`       | Plank con peso, dead hang    | ✅     |
| `distance_only`     | Farmers walk (distancia)     | ✅     |
| `distance_time`     | Running, cycling             | ✅     |
| `weight_distance`   | Sled push, farmers walk      | ✅     |

**Veredicto**: ✅ Cubre el 99% de casos de uso

#### Posibles templates adicionales (nice-to-have):

| Template    | Uso                                   | Prioridad |
| ----------- | ------------------------------------- | --------- |
| `reps_only` | Burpees, jumping jacks sin peso       | 🟢 Baja   |
| `calories`  | Cardio machines (bicicleta, elíptica) | 🟢 Baja   |

> Nota: `reps_only` se puede simular con `weight_reps` poniendo peso=0, no es crítico.

---

### 5. Tipos de Sets (10 tipos)

| Tipo         | Descripción         | Estado |
| ------------ | ------------------- | ------ |
| `normal`     | Set estándar        | ✅     |
| `warmup`     | Calentamiento       | ✅     |
| `drop`       | Drop set            | ✅     |
| `failure`    | Hasta el fallo      | ✅     |
| `cluster`    | Cluster set         | ✅     |
| `rest_pause` | Rest-pause          | ✅     |
| `mechanical` | Mechanical drop set | ✅     |
| `eccentric`  | Negativas           | ✅     |
| `partial`    | Parciales           | ✅     |
| `isometric`  | Isométricos         | ✅     |

**Veredicto**: ✅ MÁS tipos que cualquier competidor (Strong tiene 4, Hevy tiene 5)

---

### 6. Tipos de Bloques

| Tipo         | Descripción                   | Estado |
| ------------ | ----------------------------- | ------ |
| `individual` | Ejercicio único               | ✅     |
| `superset`   | 2+ ejercicios sin descanso    | ✅     |
| `circuit`    | Múltiples ejercicios en ronda | ✅     |

**Veredicto**: ✅ Completo

---

### 7. Sistema de Progresiones

```typescript
// exercise_progressions
{
  from_exercise_id: string,
  to_exercise_id: string,
  relationship_type: 'progression' | 'prerequisite' | 'variation' | 'regression',
  unlock_criteria: {
    type: 'reps' | 'time' | 'weight' | 'weight_reps' | 'sets_reps' | 'manual',
    primary_value: number,
    secondary_value?: number,
    sets?: number,
  },
  difficulty_delta: number,
}

// progression_paths (Pull-up path, Push-up path, etc.)
// user_exercise_unlocks (status: locked → unlocking → unlocked → mastered)
```

**Veredicto**: ✅ ÚNICO en el mercado - ninguna app generalista tiene esto

---

## 🔴 GAPS CRÍTICOS A IMPLEMENTAR

### 1. **UI para Crear Ejercicios Personalizados** 🔴

**Estado actual**: El schema soporta `source: 'user'` pero NO hay UI para crear ejercicios.

**Lo que falta**:

- Pantalla de creación de ejercicio
- Selector de músculo principal
- Selector de equipamiento
- Selector de measurement template
- Campo de instrucciones
- Opción de agregar imagen/GIF

**Flujo propuesto**:

```
Exercise Selector → "Crear ejercicio +" → Formulario →
  - Nombre
  - Músculo principal (picker)
  - Músculos secundarios (multi-select)
  - Equipamiento principal
  - Tipo (compound/isolation)
  - Template de medición
  - Instrucciones (opcional)
  - Imagen/GIF (opcional, desde galería)
```

**Competidores**:

- Strong: ✅ Permite crear ejercicios con nombre y categoría básica
- Hevy: ✅ Permite crear con más detalle
- JEFIT: ✅ Permite crear

**Prioridad**: 🔴 ALTA - Diferenciador clave para usuarios avanzados

---

### 2. **Historial por Ejercicio** 🟡

**Estado actual**: Se puede ver el PR actual pero NO el historial completo de un ejercicio.

**Lo que falta**:

- Vista de historial por ejercicio (todas las veces que se hizo)
- Gráfico de progresión (peso/reps/volumen en el tiempo)
- Filtros por período
- Comparativa mes a mes

**Pantalla propuesta**:

```
Exercise Detail → "Ver historial" →
  📈 Gráfico de progresión
  📅 Timeline de sesiones
  🏆 Lista de PRs históricos
  📊 Stats (promedio, máximo, frecuencia)
```

**Competidores**:

- Strong: ✅ Tiene historial completo
- Hevy: ✅ Tiene gráficos de progresión
- JEFIT: ✅ Tiene analytics por ejercicio

**Prioridad**: 🟡 MEDIA - Muy demandado por usuarios intermedios/avanzados

---

### 3. **Videos de Ejercicios** 🟡

**Estado actual**: Solo `media_url` (GIF/imagen estática)

**Lo que falta**:

- Soporte para video (MP4)
- CDN para hosting de videos
- Reproductor de video en Exercise Detail
- Videos cortos (~5-10 segundos en loop)

**Opciones**:

1. Videos propios (caro, mejor calidad)
2. Integración con YouTube (gratis, menos control)
3. GIFs de alta calidad (compromiso)

**Prioridad**: 🟡 MEDIA - Alto impacto en retención pero alto costo

---

### 4. **Dificultad/Rating de Ejercicios** 🟢

**Lo que falta**:

```typescript
exercises: {
  // ... campos existentes
  difficulty_level: 1 | 2 | 3 | 4 | 5, // Principiante a Avanzado
  is_featured: boolean, // Para destacar ejercicios populares
}
```

**Uso**:

- Filtrar ejercicios por dificultad
- Sugerir ejercicios apropiados al nivel del usuario
- Ordenar en selector por dificultad

**Prioridad**: 🟢 BAJA - Nice-to-have

---

### 5. **Tags/Categorías Personalizadas** 🟢

**Lo que falta**:

```typescript
exercise_tags: {
  id: string,
  exercise_id: string,
  tag: string, // "favorito", "lesión", "casa", etc.
}
```

**Uso**:

- Marcar ejercicios como favoritos
- Excluir ejercicios por lesión
- Crear listas personalizadas

**Prioridad**: 🟢 BAJA - Nice-to-have para power users

---

## 🏆 Ventajas Competitivas ÚNICAS de Myosin

Estas son características que **ningún competidor generalista tiene**:

### 1. Sistema de Progresiones de Calistenia

- Árboles de progresión (Pull-up → Weighted → Archer → One Arm)
- Criterios de desbloqueo estructurados (3x8 reps para unlock)
- Estados de progreso (locked → unlocking → unlocked → mastered)
- **Ninguna app generalista tiene esto** (solo apps especializadas como THENX)

### 2. 10 Tipos de Sets

Myosin tiene más tipos de sets que cualquier competidor:

- Strong: 4 tipos
- Hevy: 5 tipos
- JEFIT: 3 tipos
- **Myosin: 10 tipos** ⭐

### 3. Tempo Tracking con Formato Estándar

- Formato "3-1-2-1" (eccentric-pause-concentric-pause)
- UI dedicada con selector visual
- Almacenado por set

### 4. RPE Granular

- Escala de 6 a 10 con medios (6, 6.5, 7, 7.5, etc.)
- Toggle per-routine para mostrar/ocultar

### 5. Offline-First 100%

- Funciona completamente sin conexión
- Sync bidireccional cuando hay red
- Competidores solo ofrecen offline parcial

### 6. Grupos Musculares Ultra-Detallados

- 30+ grupos vs 10-15 de competidores
- Diferencia entre chest_upper, chest_middle, chest_lower
- Rotator cuff, serratus anterior específicos

---

## 📊 Comparativa con Competidores

| Feature                        | Myosin      | Strong | Hevy  | JEFIT | Alpha        |
| ------------------------------ | ----------- | ------ | ----- | ----- | ------------ |
| Muscle groups detallados       | ✅ 30+      | ✅ 12  | ✅ 15 | ✅ 10 | ⭐ Myosin    |
| Equipment types                | ✅ 30+      | ✅ 15  | ✅ 15 | ✅ 10 | ⭐ Myosin    |
| Measurement templates          | ✅ 7        | ✅ 3   | ✅ 3  | ✅ 2  | ⭐ Myosin    |
| Set types                      | ✅ 10       | ✅ 4   | ✅ 5  | ✅ 3  | ⭐ Myosin    |
| Block types (superset/circuit) | ✅ 3        | ✅ 2   | ✅ 2  | ❌    | ⭐ Myosin    |
| Progression system             | ✅ Completo | ❌     | ❌    | ❌    | ⭐ Myosin    |
| **Custom exercise UI**         | ❌          | ✅     | ✅    | ✅    | Competidores |
| **Exercise history**           | ❌          | ✅     | ✅    | ✅    | Competidores |
| Videos                         | 🟡 GIFs     | ✅     | ✅    | ✅    | Competidores |
| RPE tracking                   | ✅          | ✅     | ✅    | ❌    | Empate       |
| Tempo tracking                 | ✅          | ❌     | ✅    | ❌    | Myosin/Hevy  |
| Offline-first                  | ✅ 100%     | 🟡     | 🟡    | ❌    | ⭐ Myosin    |

---

## 🎯 Plan de Acción Priorizado

### Sprint 1 (Inmediato) - Gap Crítico

#### 1.1 Custom Exercise Creation UI

- [ ] Crear `ExerciseFormModal` component
- [ ] Implementar selectores de músculo/equipamiento
- [ ] Agregar al Exercise Selector
- [ ] Sync de ejercicios de usuario con Supabase

### Sprint 2 (Corto plazo) - Features de Alto Impacto

#### 2.1 Exercise History View

- [ ] Crear `ExerciseHistoryScreen`
- [ ] Query de historial por exercise_id
- [ ] Gráfico de progresión con gifted-charts
- [ ] Stats agregadas (promedio, máximo, frecuencia)

#### 2.2 PR History Expansion

- [ ] Vista de todos los PRs de un ejercicio
- [ ] Timeline de mejoras
- [ ] Comparativa con períodos anteriores

### Sprint 3 (Mediano plazo) - Polish

#### 3.1 Exercise Difficulty Levels

- [ ] Agregar campo difficulty_level
- [ ] Filtro por dificultad en selector
- [ ] Badges visuales

#### 3.2 Favorites/Tags System

- [ ] Table exercise_tags
- [ ] UI para marcar favoritos
- [ ] Filtro por favoritos

### Sprint 4 (Largo plazo) - Diferenciación Premium

#### 4.1 Video Library

- [ ] Evaluar opciones de hosting
- [ ] Migrar a videos para ejercicios clave
- [ ] Reproductor inline

---

## 📈 Métricas de Éxito

| Métrica                          | Actual | Target             |
| -------------------------------- | ------ | ------------------ |
| Ejercicios en BD                 | ~196   | 300+               |
| % ejercicios con media           | ~70%   | 95%                |
| Custom exercises creados/usuario | 0      | 5+                 |
| Retention D7                     | ?      | +10% con historial |

---

## 🔧 Implementación Técnica Detallada

### Custom Exercise UI Flow

```
1. ExerciseSelectorModalV2
   └── Button "Crear ejercicio +"
       └── ExerciseFormModal
           ├── NameInput
           ├── MuscleGroupPicker (main + secondary)
           ├── EquipmentPicker (primary + list)
           ├── TypeSelector (compound/isolation)
           ├── MeasurementTemplatePicker
           ├── InstructionsInput (TextArea)
           ├── MediaPicker (opcional, from gallery)
           └── SaveButton → exercisesRepository.create()
```

### Exercise History Query

```typescript
// queries/exercise-history.ts
export const getExerciseHistory = async (exerciseId: string) => {
  return db
    .select({
      sessionDate: workout_sessions.started_at,
      sets: sql`json_group_array(json_object(
        'weight', workout_sets.actual_primary_value,
        'reps', workout_sets.actual_secondary_value,
        'set_type', workout_sets.set_type
      ))`,
      totalVolume: sql`SUM(workout_sets.actual_primary_value * workout_sets.actual_secondary_value)`,
    })
    .from(workout_sets)
    .innerJoin(workout_sessions, ...)
    .where(eq(workout_sets.exercise_id, exerciseId))
    .groupBy(workout_sessions.id)
    .orderBy(desc(workout_sessions.started_at));
};
```

---

## ✅ Conclusión

Myosin tiene la **infraestructura técnica más completa del mercado** para ejercicios. Los gaps principales son de **UX y features de usuario**, no de arquitectura:

1. **Custom Exercises UI** - Crítico para usuarios avanzados
2. **Exercise History** - Muy demandado, diferenciador

Con estos 2 features, Myosin sería **objetivamente superior** a Strong, Hevy y JEFIT en el sistema de ejercicios.

---

_Documento creado: Enero 2025_
_Próxima revisión: Post-implementación de Sprint 1_
