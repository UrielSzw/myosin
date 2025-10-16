```typescript
const CONFIG = {
  difficulty: "beginner",
  days: 3,
  distribution: "full-body",
  category: "hypertrophy",
  equipment: "full-gym",
};
```

Eres un experto entrenador personal con amplio conocimiento en ciencia del ejercicio. Necesito que me ayudes a crear un programa de entrenamiento completo siguiendo estas especificaciones exactas:

### 🎯 CONFIGURACIÓN DEL PROGRAMA

- **Dificultad**: {difficulty}
- **Días por semana**: {days}
- **Distribución**: {distribution}
- **Categoría**: {category}
- **Equipamiento**: {equipment}

### 📋 TIPOS VÁLIDOS PARA LA CONFIGURACIÓN

```typescript
interface RoutineConfig {
  difficulty: "beginner" | "intermediate" | "advanced";
  days: 3 | 4 | 5 | 6;
  distribution:
    | "full-body"
    | "upper-lower"
    | "push-pull-legs"
    | "push-pull-legs-push-pull-legs"
    | "bro-split"
    | "powerlifting"
    | "custom";
  category: "strength" | "hypertrophy" | "endurance";
  equipment:
    | "bodyweight"
    | "dumbbells"
    | "barbell-dumbbells"
    | "full-gym"
    | "machines-only"
    | "home-gym";
}
```

**IMPORTANTE**: Usa únicamente estos valores exactos en tus respuestas.

### 🏗️ SISTEMA DE MEDICIÓN - NUEVO ARCHITECTURE

El sistema utiliza **measurement templates** que definen qué métricas usar para cada ejercicio:

#### TEMPLATES DISPONIBLES:

1. **"weight_reps"** - Tradicional peso + repeticiones
   - `primary_value`: peso en kg
   - `secondary_value`: repeticiones
2. **"time_only"** - Solo tiempo (ej: plancha, wall sit)
   - `primary_value`: tiempo en segundos
3. **"distance_time"** - Distancia + tiempo (cardio)
   - `primary_value`: distancia en km
   - `secondary_value`: tiempo en minutos
4. **"weight_time"** - Peso + tiempo (ej: farmer's walk)
   - `primary_value`: peso en kg
   - `secondary_value`: tiempo en segundos

**REGLA CRÍTICA**: Todos los ejercicios en la base de datos YA TIENEN asignado un `default_measurement_template`. Usa ese template para todos los sets del ejercicio.

### 📚 INSTRUCCIONES DETALLADAS

1. **Investigación**: Busca en internet las mejores prácticas para este tipo de programa. Considera estudios científicos, recomendaciones de expertos y principios de periodización.

2. **Estructura del programa**:

   - Crea rutinas balanceadas y efectivas
   - Considera progresión, volumen, intensidad y frecuencia apropiadas
   - Incluye ejercicios compuestos y de aislamiento según corresponda
   - Respeta los principios de recuperación y adaptación

3. **Selección de ejercicios**: Usa ÚNICAMENTE ejercicios de la lista que te proporcionaré abajo. No inventes nombres ni uses ejercicios que no estén en la lista.

### 🏗️ ESTRUCTURA DE RESPUESTA REQUERIDA

Debes responder con un JSON válido que siga exactamente esta estructura:

#### TIPOS DE BLOQUES - REGLAS ESTRICTAS:

1. **"individual"**:

   - SOLO 1 ejercicio por bloque
   - rest_between_exercises_seconds: 0 (siempre)
   - name: DEBE ser igual al nombre del ejercicio que contiene

2. **"superset"**:

   - 2+ ejercicios por bloque (generalmente 2-3)
   - rest_between_exercises_seconds: 0
   - Sin descanso entre ejercicios del superset
   - name: DEBE ser "Superserie"

3. **"circuit"**:
   - 3+ ejercicios por bloque
   - rest_between_exercises_seconds: 10-30
   - Descanso breve entre ejercicios del circuito
   - name: DEBE ser "Circuito"

```typescript
interface RoutineTemplateData {
  id: string; // Ejemplo: "push-day-intermediate-v1"

  routine: {
    name: string; // Ejemplo: "Push Day - Intermedio"
    folder_id: null;
    training_days: null; // Los días se asignan después
    show_rpe: boolean; // true para intermediate/advanced, false para beginner
    show_tempo: boolean; // generalmente false, true solo para programas específicos
  };

  blocks: {
    type: "individual" | "superset" | "circuit";
    name: string; // Nombre descriptivo del bloque
    order_index: number; // 0, 1, 2...
    rest_time_seconds: number; // 60-240 según intensidad
    rest_between_exercises_seconds: number; // Ver reglas de tipos de bloques
  }[];

  exercisesInBlock: {
    block_index: number; // Índice del bloque (0, 1, 2...)
    exercise_id: string; // ID EXACTO del ejercicio de la lista
    exercise_name: string; // Nombre para referencia
    order_index: number; // Orden dentro del bloque (0, 1, 2...)
    notes: null; // Siempre null
  }[];

  sets: {
    exercise_block_index: number; // Índice del bloque
    exercise_order_index: number; // Orden del ejercicio en el bloque
    order_index: number; // Número del set (0, 1, 2...)

    // ⚠️ NUEVO SISTEMA DE MEDICIÓN ⚠️
    measurement_template:
      | "weight_reps"
      | "time_only"
      | "distance_time"
      | "weight_time";

    // Valores según el template:
    primary_value: number | null; // peso, tiempo, distancia - null si es progresivo
    secondary_value: number | null; // reps, tiempo, etc - null si es progresivo

    // Rangos opcionales (ej: 8-12 reps):
    primary_range: { min: number; max: number } | null;
    secondary_range: { min: number; max: number } | null;

    // Campos tradicionales:
    rpe: number | null; // 6-10 para intermediate/advanced, null para beginner
    tempo: string | null; // Generalmente null, formato "3-1-2-1" si específico
    set_type: "normal" | "warmup" | "drop" | "failure"; // "normal" en mayoría
  }[];
}
```

### 📊 EJEMPLOS DE SETS CON NUEVO SISTEMA:

#### Weight + Reps Traditional:

```typescript
{
  exercise_block_index: 0,
  exercise_order_index: 0,
  order_index: 0,
  measurement_template: "weight_reps",
  primary_value: null,        // Usuario define peso
  secondary_value: 8,         // 8 reps fijas
  primary_range: null,
  secondary_range: null,
  rpe: 8.0,
  tempo: null,
  set_type: "normal"
}
```

#### Weight + Reps Range:

```typescript
{
  exercise_block_index: 0,
  exercise_order_index: 0,
  order_index: 0,
  measurement_template: "weight_reps",
  primary_value: null,        // Usuario define peso
  secondary_value: null,      // Range de reps
  primary_range: null,
  secondary_range: { min: 8, max: 12 },  // 8-12 reps
  rpe: 8.0,
  tempo: null,
  set_type: "normal"
}
```

#### Time Only (Plancha):

```typescript
{
  exercise_block_index: 1,
  exercise_order_index: 0,
  order_index: 0,
  measurement_template: "time_only",
  primary_value: 30,          // 30 segundos
  secondary_value: null,
  primary_range: null,
  secondary_range: null,
  rpe: null,
  tempo: null,
  set_type: "normal"
}
```

### 📋 CRITERIOS ESPECÍFICOS POR CATEGORÍA

#### Para HYPERTROPHY:

- Sets: 3-5 por ejercicio
- Reps: 6-20 según el ejercicio (usar rangos como 8-12)
- RPE: 6-9
- Rest: 60-120 segundos

#### Para STRENGTH:

- Sets: 3-6 por ejercicio
- Reps: 1-6 principalmente (valores fijos)
- RPE: 7-10
- Rest: 120-300 segundos

#### Para ENDURANCE:

- Sets: 2-4 por ejercicio
- Reps: 12-25+ (usar rangos amplios)
- RPE: 5-8
- Rest: 30-90 segundos

### 🏋️‍♂️ CRITERIOS POR DIFICULTAD

#### BEGINNER:

- Ejercicios básicos y seguros
- Enfoque en técnica
- show_rpe: false
- Rangos de repeticiones simples
- Menos ejercicios por sesión

#### INTERMEDIATE:

- Mayor variedad de ejercicios
- show_rpe: true
- Mayor volumen
- Algunos supersets

#### ADVANCED:

- Técnicas avanzadas
- show_rpe: true
- Mayor volumen y especialización
- Circuitos y supersets complejos

### 📝 FORMATO DE RESPUESTA

Responde con el código TypeScript completo listo para usar en un archivo de template. Estructura tu respuesta así:

```typescript
import type { MeasurementTemplateId } from "@/shared/types/measurement";
import {
  ProgramTemplate,
  RoutineTemplate,
  RoutineTemplateData,
} from "../../types";

// PROGRAMA PRINCIPAL
export const {DISTRIBUTION}_{DIFFICULTY}_PROGRAM: ProgramTemplate = {
  id: "{distribution}-{difficulty}-program",
  name: "Nombre del Programa",
  description: "Descripción completa del programa...",
  category: "{category}",
  difficulty: "{difficulty}",
  duration: "8-12 semanas",
  frequency: "Xx semana",
  equipment: ["barbell", "dumbbell", "etc"],
  routines: [
    {
      routineId: "routine-1-id",
      assignedDays: ["monday"],
      name: "Rutina A",
    },
    // ... más rutinas
  ],
};

// RUTINAS INDIVIDUALES
export const {DISTRIBUTION}_{DIFFICULTY}_ROUTINES: RoutineTemplate[] = [
  {
    id: "routine-1-id",
    name: "Nombre de la Rutina 1",
    description: "Descripción...",
    category: "{category}",
    difficulty: "{difficulty}",
    estimatedTime: "45-60 min",
    targetMuscles: ["chest", "back", "legs"],
    tags: ["tag1", "tag2"],
    equipment: ["barbell", "dumbbell"],
    weeklyFrequency: 3,
  },
  // ... más rutinas
];

// DATA DETALLADA PARA CADA RUTINA
export const {DISTRIBUTION}_{DIFFICULTY}_DATA: Record<string, RoutineTemplateData> = {
  "routine-1-id": {
    id: "routine-1-id",
    routine: {
      name: "Nombre de la Rutina 1",
      folder_id: null,
      training_days: null,
      show_rpe: false, // según dificultad
      show_tempo: false,
    },
    blocks: [
      // ... bloques según las reglas
    ],
    exercisesInBlock: [
      // ... ejercicios
    ],
    sets: [
      // ⚠️ RECUERDA: usar measurement_template correcto para cada ejercicio
    ],
  },
};
```

---

## 🗂️ LISTA DE EJERCICIOS DISPONIBLES

**IMPORTANTE: Todos estos ejercicios YA TIENEN su default_measurement_template asignado. La mayoría usa "weight_reps".**

**[PEGAR AQUÍ LA LISTA COMPLETA DE EJERCICIOS]**

---

## ⚠️ RECORDATORIOS CRÍTICOS

1. **MEASUREMENT TEMPLATES**: Usa el template correcto para cada tipo de ejercicio
2. **PRIMARY/SECONDARY VALUES**: Respeta la estructura según el template
3. **RANGES**: Usa rangos para principiantes/hipertrofia, valores fijos para fuerza
4. **USA ÚNICAMENTE** ejercicios de la lista proporcionada
5. **JSON VÁLIDO**: Verifica que la sintaxis sea correcta
6. **BALANCEADO**: Asegúrate de que las rutinas estén balanceadas

¿Estás listo para crear el mejor programa de {distribution} de nivel {difficulty} para {category} usando el NUEVO sistema de medición?
