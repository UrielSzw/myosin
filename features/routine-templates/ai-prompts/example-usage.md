# 📝 EJEMPLO DE USO - CREAR PUSH DAY

Este archivo muestra como usar el prompt para crear un Push Day y luego integrarlo al sistema.

## 1. Configuración para el Prompt

```typescript
const CONFIG = {
  difficulty: "intermediate",
  days: 3, // Queremos solo el Push Day, parte de un PPL
  distribution: "push-pull-legs",
  category: "hypertrophy",
  equipment: "full-gym",
};
```

## 2. Resultado Esperado de la IA

```json
{
  "config": {
    "difficulty": "intermediate",
    "days": 3,
    "distribution": "push-pull-legs",
    "category": "hypertrophy",
    "equipment": "full-gym"
  },
  "routines": [
    {
      "id": "push-day-intermediate-v1",
      "routine": {
        "name": "Push Day - Intermedio",
        "folder_id": null,
        "training_days": null,
        "show_rpe": true,
        "show_tempo": false
      },
      "blocks": [
        {
          "type": "individual",
          "name": "Press de Banca",
          "order_index": 0,
          "rest_time_seconds": 180,
          "rest_between_exercises_seconds": 0
        },
        {
          "type": "individual",
          "name": "Press Militar",
          "order_index": 1,
          "rest_time_seconds": 150,
          "rest_between_exercises_seconds": 0
        },
        {
          "type": "superset",
          "name": "Superserie Hombros",
          "order_index": 2,
          "rest_time_seconds": 90,
          "rest_between_exercises_seconds": 15
        }
      ],
      "exercisesInBlock": [
        {
          "block_index": 0,
          "exercise_id": "bench-press-barbell",
          "exercise_name": "Press de Banca con Barra",
          "order_index": 0,
          "notes": null
        },
        {
          "block_index": 1,
          "exercise_id": "overhead-press-barbell",
          "exercise_name": "Press Militar con Barra",
          "order_index": 0,
          "notes": null
        },
        {
          "block_index": 2,
          "exercise_id": "lateral-raises-dumbbell",
          "exercise_name": "Elevaciones Laterales",
          "order_index": 0,
          "notes": null
        },
        {
          "block_index": 2,
          "exercise_id": "rear-delt-flyes-dumbbell",
          "exercise_name": "Vuelos Posteriores",
          "order_index": 1,
          "notes": null
        }
      ],
      "sets": [
        // Press de Banca - 4 sets de 6-8 reps
        {
          "exercise_block_index": 0,
          "exercise_order_index": 0,
          "order_index": 0,
          "reps": null,
          "weight": null,
          "rpe": 8,
          "tempo": null,
          "set_type": "normal",
          "reps_type": "range",
          "reps_range": { "min": 6, "max": 8 }
        },
        {
          "exercise_block_index": 0,
          "exercise_order_index": 0,
          "order_index": 1,
          "reps": null,
          "weight": null,
          "rpe": 8,
          "tempo": null,
          "set_type": "normal",
          "reps_type": "range",
          "reps_range": { "min": 6, "max": 8 }
        }
        // ... más sets
      ]
    }
  ]
}
```

## 3. Integración al Sistema

### Agregar a ROUTINE_TEMPLATES:

```typescript
{
  id: "push-day-intermediate-v1",
  name: "Push Day - Intermedio",
  description: "Rutina de empuje enfocada en pecho, hombros y tríceps con superseries para volumen",
  category: "hypertrophy",
  difficulty: "intermediate",
  estimatedTime: "60-75 min",
  targetMuscles: ["chest", "shoulders", "triceps"],
  tags: ["push", "upper", "hypertrophy", "superseries"],
  equipment: ["barbell", "dumbbell", "bench", "cable"],
  weeklyFrequency: 2
}
```

### Agregar a ROUTINE_TEMPLATES_DATA:

```typescript
"push-day-intermediate-v1": {
  // Copiar exactamente el JSON de la IA aquí
  id: "push-day-intermediate-v1",
  routine: { ... },
  blocks: [ ... ],
  exercisesInBlock: [ ... ],
  sets: [ ... ]
}
```

## 4. Usar el Template

```typescript
// Crear rutina individual
const routineId = await createRoutineFromTemplate("push-day-intermediate-v1", {
  name: "Mi Push Day",
  training_days: ["monday", "thursday"],
});

// O como parte de un programa PPL
const pplRoutines = await createRoutinesFromProgram("ppl-6day-intermediate");
```

## 5. Validaciones a Hacer

- [ ] Todos los `exercise_id` existen en tu DB
- [ ] Los rangos de reps son realistas
- [ ] Los tiempos de descanso son apropiados
- [ ] Los sets totales por músculo están balanceados
- [ ] El volumen total es factible en el tiempo estimado

## 6. Tips para Mejorar

- Pide variaciones del mismo template (v1, v2, v3)
- Crea versiones para diferentes equipamientos
- Ajusta RPE según la experiencia del usuario
- Considera progresiones (beginner → intermediate → advanced)
