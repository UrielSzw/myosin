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

### 📚 INSTRUCCIONES DETALLADAS

1. **Investigación**: Busca en internet las mejores prácticas para este tipo de programa. Considera estudios científicos, recomendaciones de expertos y principios de periodización.

2. **Estructura del programa**:

   - Crea rutinas balanceadas y efectivas
   - Considera progresión, volumen, intensidad y frecuencia apropiadas
   - Incluye ejercicios compuestos y de aislamiento según corresponda
   - Respeta los principios de recuperación y adaptación

3. **Selección de ejercicios**: Usa ÚNICAMENTE ejercicios de la lista que te proporcionaré abajo. No inventes nombres ni uses ejercicios que no estén en la lista. Para los exercise id deja el nombre del ejercicio tambien.

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

**Usa el tipo que mejor se adapte a los objetivos del programa. No hay restricciones por nivel de dificultad.**

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
    rest_between_exercises_seconds: number; // Ver reglas de tipos de bloques abajo
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
    reps: number | null; // Para reps fijas, sino null (reps, time, distance)
    weight: number | null; // Siempre null (usuario lo completa)
    rpe: number | null; // 6-10 para intermediate/advanced, null para beginner
    tempo: string | null; // Generalmente null, formato "3-1-2-1" si es específico
    set_type: "normal" | "warmup" | "drop" | "failure"; // "normal" en la mayoría
    reps_type: "reps" | "range" | "time" | "distance";
    reps_range: { min: number; max: number } | null; // Para rangos como 8-12 (range)
  }[];
}
```

### 📋 CRITERIOS ESPECÍFICOS POR CATEGORÍA

#### Para HYPERTROPHY:

- Sets: 3-5 por ejercicio
- Reps: 6-20 según el ejercicio
- RPE: 6-9
- Rest: 60-120 segundos

#### Para STRENGTH:

- Sets: 3-6 por ejercicio
- Reps: 1-6 principalmente
- RPE: 7-10
- Rest: 120-300 segundos

#### Para ENDURANCE:

- Sets: 2-4 por ejercicio
- Reps: 12-25+
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
- show_rpe: false
- Mayor volumen

#### ADVANCED:

- Técnicas avanzadas
- show_rpe: true
- Mayor volumen y especialización

### 📊 CRITERIOS POR EQUIPAMIENTO

#### BODYWEIGHT:

- Solo ejercicios de peso corporal
- Enfoque en progresiones

#### DUMBBELLS:

- Solo mancuernas y peso corporal
- Ejercicios unilaterales

#### BARBELL-DUMBBELLS:

- Barras, mancuernas y peso corporal
- Ejercicios compuestos principales

#### FULL-GYM:

- Todo el equipamiento disponible
- Máxima variedad

#### MACHINES-ONLY:

- Solo máquinas y peso corporal
- Enfoque en seguridad

#### HOME-GYM:

- Equipamiento básico de casa
- Adaptaciones creativas

### 📝 FORMATO DE RESPUESTA

Responde con el código TypeScript completo listo para usar en un archivo de template. Estructura tu respuesta así:

```typescript
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
  duration: "8-12 semanas", // Ajustar según el programa
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
      // ... sets detallados
    ],
  },
  // ... más rutinas data
};
```

**NOMENCLATURA PARA LAS CONSTANTES:**

- `{DISTRIBUTION}`: PPL, UPPER_LOWER, FULL_BODY, BRO_SPLIT, etc. (en mayúsculas)
- `{DIFFICULTY}`: BEGINNER, INTERMEDIATE, ADVANCED (en mayúsculas)

**Ejemplos:**

- `PPL_INTERMEDIATE_PROGRAM`
- `UPPER_LOWER_BEGINNER_ROUTINES`
- `FULL_BODY_ADVANCED_DATA`

---

## 🗂️ LISTA DE EJERCICIOS DISPONIBLES

**[PEGAR AQUÍ LA LISTA COMPLETA DE EJERCICIOS]**

Press de banca con barra

Press de banca con mancuernas

Press inclinado con barra

Press inclinado con mancuernas

Press declinado con barra

Aperturas con mancuernas en banco plano

Aperturas con mancuernas en banco inclinado

Aperturas en máquina o contractor

Cruce de poleas (cable crossover)

Fondos en paralelas (enfocado en pecho)

Flexiones de brazos (push-ups)

Flexiones declinadas

Press en máquina de pecho

Press en máquina Smith

Press con banda elástica
Press militar con barra

Press militar con mancuernas

Press Arnold

Elevaciones laterales con mancuernas

Elevaciones frontales con mancuernas

Elevaciones laterales con polea

Remo al mentón con barra

Remo al mentón con polea

Elevaciones posteriores (pájaros) con mancuernas

Elevaciones posteriores en máquina o cable

Face Pull con polea

Press de hombros en máquina

Plancha con empuje escapular (para serrato/anterior)

Fondos en paralelas (tríceps)

Extensión de tríceps en polea (barra o cuerda)

Press francés con barra EZ

Press francés con mancuernas

Extensión de tríceps por encima de la cabeza con mancuerna

Extensión de tríceps con cuerda en polea alta

Patada de tríceps con mancuerna (kickback)

Flexiones cerradas (manos juntas)

Extensión de tríceps en máquina

Extensión de tríceps con banda elástica

Dominadas

Jalón al pecho en polea

Jalón tras nuca (opcional, avanzado)

Remo con barra

Remo con mancuernas

Remo en máquina

Remo con polea baja

Peso muerto convencional

Peso muerto con piernas rígidas

Pull-over con mancuerna o cable

Remo en T (T-Bar Row)

Face Pull (para trapecios y deltoide posterior)

Encogimientos de hombros con mancuernas (trapecio superior)

Remo con banda elástica

Superman (para lumbar)

Buenos días con barra (erectores espinales)

Curl de bíceps con barra

Curl de bíceps con mancuernas

Curl alternado con supinación

Curl tipo martillo

Curl en banco predicador (Scott)

Curl en polea baja

Curl con banda elástica

Curl concentrado

Curl en máquina

Curl inverso (para antebrazos)

Curl de muñeca con barra (flexión de antebrazos)

Curl de muñeca inverso (extensión)

Crunch abdominal clásico

Crunch en máquina

Crunch en polea alta

Crunch inverso

Plancha frontal

Plancha lateral

Giros rusos (Russian twist)

Elevaciones de piernas colgado

Elevaciones de rodillas colgado

Ab wheel (rueda abdominal)

Extensión lumbar en banco romano

Superman

Peso muerto rumano (también para lumbar e isquios)

Bird-Dog

Dead Bug

Sentadilla con barra

Sentadilla frontal

Sentadilla goblet

Sentadilla en máquina Smith

Prensa de piernas

Zancadas (lunges)

Zancadas búlgaras

Step-up (subida al banco)

Peso muerto rumano

Curl de piernas acostado en máquina

Curl de piernas sentado

Extensión de piernas en máquina

Hip Thrust (empuje de cadera con barra)

Puente de glúteos (glute bridge)

Abducción de cadera en máquina

Abducción de cadera con banda

Adducción de cadera en máquina

Peso muerto a una pierna

Elevaciones de talones de pie (pantorrillas)

Elevaciones de talones sentado

Burpees

Swing con kettlebell

Thruster (sentadilla + press de hombros)

Clean con barra

Snatch con barra

Remo renegado con mancuernas

Clean & Press con mancuernas

Power Clean

Step-up con press

Turkish Get-Up

Battle Ropes

Mountain Climbers

Saltos al cajón (Box Jump)

Bear Crawl

Sentadilla con press de hombros (full-body compound)

---

## ⚠️ RECORDATORIOS IMPORTANTES

1. **USA ÚNICAMENTE** ejercicios de la lista proporcionada
2. **IDs EXACTOS**: Los exercise_id deben coincidir perfectamente
3. **JSON VÁLIDO**: Verifica que la sintaxis sea correcta
4. **BALANCEADO**: Asegúrate de que las rutinas estén balanceadas
5. **PROGRESIVO**: Considera la progresión entre ejercicios
6. **REALISTA**: Los tiempos y volúmenes deben ser factibles

¿Estás listo para crear el mejor programa de {distribution} de nivel {difficulty} para {category}?
