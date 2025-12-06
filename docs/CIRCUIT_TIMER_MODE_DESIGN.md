# 🔄 Circuit Timer Mode - Diseño Completo

> **Objetivo**: Crear un modo de timer automático para bloques tipo Circuit que sean **100% basados en tiempo** (HIIT, Tabata, intervalos). Una experiencia enfocada y fluida.

---

## 🎯 Decisión de Diseño

### ¿Por qué solo circuitos 100% time-based?

| Razón                                   | Explicación                                                                                         |
| --------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **UX enfocada**                         | Un modo que hace UNA cosa perfectamente > Un modo que hace TODO de forma mediocre                   |
| **Caso de uso claro**                   | La gente que hace HIIT/Tabata diseña sus circuitos 100% por tiempo                                  |
| **Entrenamiento con reps es diferente** | Cuando hago sentadillas, QUIERO controlar cuándo termino. El flow actual ya es bueno para eso       |
| **Validación natural**                  | Si el bloque tiene ejercicios mixtos, no mostramos la opción. Guía al usuario hacia el uso correcto |

### Regla de Elegibilidad

```typescript
// El botón "Iniciar Timer Mode" solo aparece si:
const canUseTimerMode =
  block.type === "circuit" &&
  allSetsInBlock.every((set) => set.measurement_template === "time_only");
```

---

## 📊 Análisis del Sistema Actual

### Lo que ya existe:

| Componente               | Descripción                                                     |
| ------------------------ | --------------------------------------------------------------- |
| `RestTimerBannerV2`      | Banner flotante para descanso entre sets                        |
| `TempoMetronomeV2`       | Modal fullscreen para tempo (3-1-2-1), muy pulido               |
| `BlockOptionsSheetV2`    | Sheet de opciones cuando tocas un bloque                        |
| `getCircuitRestType()`   | Determina si descanso es "between-exercises" o "between-rounds" |
| `getNextSetToComplete()` | Sabe qué ejercicio/set viene en un circuito                     |
| `completeSet()`          | Marca set como completado y trigger rest timer                  |

### Patrones de UI identificados:

- **Modals fullscreen**: StatusBar manejado, safe areas, header con X, animaciones de entrada/salida
- **Colores de Circuit**: `primary: "#4A90E2"` (Azul)
- **Animaciones**: Spring animations, staggered entries, scale pulses
- **Haptics**: `haptic.light()` para ticks, `haptic.medium()` para cambios de fase, `haptic.heavy()` para start
- **Audio**: `expo-audio` para sonidos de finalización

---

## 🎯 Caso de Uso Principal

### Circuito HIIT/Tabata 100% tiempo

```
Burpees (40s) → Rest (10s) → Mountain Climbers (40s) → Rest (10s) →
Jump Squats (40s) → Rest entre rounds (60s) → ROUND 2...
```

**Comportamiento**:

- Timer avanza automáticamente
- Marca sets como completados cuando termina cada ejercicio
- Transiciones fluidas con audio/haptics
- Usuario solo mira y entrena

---

## 🏗️ Arquitectura Propuesta

### Nuevo componente: `CircuitTimerModeV2.tsx`

```
features/active-workout-v2/elements/
├── CircuitTimerModeV2.tsx  ← NUEVO
├── TempoMetronomeV2.tsx
├── RestTimerBannerV2.tsx
└── ...
```

### Integración con BlockOptionsSheetV2

Agregar nueva opción cuando el circuito es elegible:

```typescript
{
  id: "startTimerMode",
  icon: <Play size={22} color="#fff" />,
  label: t("startTimerMode"),
  description: t("startTimerModeDesc"),
  color: "#4A90E2", // Circuit blue
  onPress: onStartTimerMode,
  show: isCircuit && isAllTimeBased, // ← Validación
}
```

### Función de validación

```typescript
// En store-helpers.ts o utils
export function canUseCircuitTimerMode(
  block: ActiveWorkoutBlock,
  exercises: ActiveWorkoutExercise[]
): boolean {
  if (block.type !== "circuit") return false;

  // Obtener todos los sets del bloque
  const allSets = exercises.flatMap((ex) => ex.sets);

  // Todos deben ser time_only
  return allSets.every((set) => set.measurement_template === "time_only");
}
```

---

## 📱 Diseño de UI

### Estados del Circuit Timer (Simplificado)

```
┌────────────────────────────────────────────────────────────────┐
│                        ESTADOS                                  │
├────────────────────────────────────────────────────────────────┤
│  idle      → Usuario no ha iniciado                            │
│  countdown → 5, 4, 3, 2, 1, GO! antes de empezar              │
│  exercise  → Ejecutando ejercicio (countdown)                  │
│  rest      → Descanso entre ejercicios                         │
│  roundRest → Descanso entre rounds (más largo)                 │
│  paused    → Timer pausado                                     │
│  complete  → Circuito terminado                                │
└────────────────────────────────────────────────────────────────┘
```

> **Nota**: Ya no hay estados `input` ni lógica de stopwatch porque solo soportamos ejercicios de tiempo.

### Pantalla Principal (Estado: exercise)

```
┌─────────────────────────────────────────────────────────────┐
│  [X]              CIRCUIT TIMER              ROUND 2/4      │
│                                                             │
│                    ┌─────────────┐                          │
│                    │             │                          │
│                    │   🔥 32     │  ← Segundos restantes    │
│                    │             │                          │
│                    └─────────────┘                          │
│                     BURPEES                                 │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │   │
│  └─────────────────────────────────────────────────────┘   │
│                     32s / 40s                              │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ← Mountain Climbers   •   Jump Squats →            │   │
│  │     (siguiente)            (después)                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│     [⏸️ PAUSAR]        [⏭️ SKIP]        [⏹️ TERMINAR]     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Pantalla de Descanso (Estado: rest)

```
┌─────────────────────────────────────────────────────────────┐
│  [X]              CIRCUIT TIMER              ROUND 2/4      │
│                                                             │
│                    ┌─────────────┐                          │
│                    │             │                          │
│                    │   😮‍💨 8     │  ← Verde/Amarillo        │
│                    │             │                          │
│                    └─────────────┘                          │
│                    DESCANSO                                 │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ████████████████████████████████░░░░░░░░░░░░░░░░░░ │   │
│  └─────────────────────────────────────────────────────┘   │
│                      8s / 10s                              │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           SIGUIENTE: Mountain Climbers              │   │
│  │                   40 segundos                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│               [-10s]  [⏭️ SKIP]  [+10s]                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Pantalla de Round Completado (Estado: roundRest)

```
┌─────────────────────────────────────────────────────────────┐
│  [X]              CIRCUIT TIMER              ROUND 2/4      │
│                                                             │
│                    ┌─────────────┐                          │
│                    │             │                          │
│                    │   🎉 48     │  ← Countdown al round 3  │
│                    │             │                          │
│                    └─────────────┘                          │
│                ROUND 2 COMPLETADO                          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ████████████████████████████░░░░░░░░░░░░░░░░░░░░░░ │   │
│  └─────────────────────────────────────────────────────┘   │
│                     48s / 60s                              │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │      Resumen del round:                             │   │
│  │      • Burpees: 40s ✓                              │   │
│  │      • Push-ups: 15 reps ✓                         │   │
│  │      • Wall Sit: 45s ✓                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│               [-10s]  [⏭️ SKIP]  [+10s]                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Pantalla Final (Estado: complete)

```
┌─────────────────────────────────────────────────────────────┐
│  [X]              CIRCUIT TIMER                             │
│                                                             │
│                    ┌─────────────┐                          │
│                    │             │                          │
│                    │   🏆 4/4    │                          │
│                    │             │                          │
│                    └─────────────┘                          │
│               ¡CIRCUITO COMPLETADO!                        │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │      Resumen Total:                                 │   │
│  │                                                     │   │
│  │      Tiempo total: 12:45                           │   │
│  │      Rounds completados: 4                         │   │
│  │      Ejercicios: 12                                │   │
│  │                                                     │   │
│  │      🔥 Burpees: 4 × 40s                          │   │
│  │      💪 Push-ups: 4 × 15 reps                     │   │
│  │      🦵 Wall Sit: 4 × 45s                         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│                    [CERRAR]                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Colores y Estados Visuales

| Estado      | Color Principal         | Color Secundario | Emoji/Icono        |
| ----------- | ----------------------- | ---------------- | ------------------ |
| `idle`      | Gray                    | -                | ▶️                 |
| `countdown` | Primary Blue            | -                | 5, 4, 3, 2, 1, GO! |
| `exercise`  | Circuit Blue (#4A90E2)  | Progress bar     | 🔥                 |
| `rest`      | Success Green (#22C55E) | Progress bar     | 😮‍💨                 |
| `roundRest` | Warning Amber (#F59E0B) | Progress bar     | 🎉                 |
| `paused`    | Gray                    | -                | ⏸️                 |
| `complete`  | Success Green           | Confetti?        | 🏆                 |

---

## 📐 Flujo de Estado (State Machine Simplificada)

```
                    ┌─────────────┐
                    │    idle     │
                    └──────┬──────┘
                           │ START
                           ▼
                    ┌─────────────┐
                    │  countdown  │  (5, 4, 3, 2, 1, GO!)
                    └──────┬──────┘
                           │
           ┌───────────────┴───────────────┐
           │                               │
           ▼                               │
    ┌─────────────┐                        │
    │  exercise   │ ←──────────────────────┤
    │ (countdown) │                        │
    └──────┬──────┘                        │
           │ timer ends                    │
           ▼                               │
    ┌─────────────────────────────────┐    │
    │     ¿Más ejercicios en round?   │    │
    └─────────────┬───────────────────┘    │
            YES   │   NO                   │
                  │                        │
           ┌──────┴──────┐                 │
           ▼             ▼                 │
    ┌─────────────┐ ┌─────────────┐        │
    │    rest     │ │  roundRest  │        │
    │ (entre ej)  │ │ (entre rnd) │        │
    └──────┬──────┘ └──────┬──────┘        │
           │               │               │
           │               ▼               │
           │        ┌─────────────┐        │
           │        │ ¿Más rounds?│        │
           │        └──────┬──────┘        │
           │          YES  │  NO           │
           │               │               │
           └───────────────┤               │
                           │               ▼
                           │        ┌─────────────┐
                           └───────→│  complete   │
                                    └─────────────┘
```

### Transiciones con Pause

Desde cualquier estado activo (`exercise`, `rest`, `roundRest`) se puede ir a `paused` y volver.

---

## 🔊 Audio y Haptics

### Eventos de Audio

| Evento                     | Sonido        | Haptic                 |
| -------------------------- | ------------- | ---------------------- |
| Countdown tick (5,4,3,2,1) | Beep corto    | `haptic.light()`       |
| GO!                        | Beep largo    | `haptic.heavy()`       |
| Ejercicio termina          | Ding          | `haptic.medium()`      |
| Descanso termina           | Alarm         | `haptic.heavy()`       |
| Round completado           | Fanfare corto | `haptic.success()`     |
| Circuito completado        | Fanfare largo | `haptic.success()` × 3 |
| 3 segundos restantes       | Beep warning  | `haptic.light()`       |

### Assets de Audio Necesarios

```
assets/audio/
├── timer_complete.wav       ← Ya existe
├── circuit_countdown.wav    ← NUEVO (o reusar existente)
├── circuit_go.wav           ← NUEVO
├── circuit_exercise_done.wav ← NUEVO
├── circuit_round_done.wav   ← NUEVO
└── circuit_complete.wav     ← NUEVO
```

---

## 💾 Integración con el Store

### Nuevas acciones necesarias

```typescript
// En use-active-workout-store.ts

circuitTimerActions: {
  // Completa un set de tiempo automáticamente (guarda el valor de tiempo)
  autoCompleteTimeSet: (
    setId: string,
    blockId: string,
    exerciseInBlockId: string,
    durationSeconds: number
  ) => void;

  // Obtiene el próximo ejercicio del circuito
  getNextCircuitExercise: (blockId: string) => CircuitExerciseItem | null;

  // Obtiene el estado actual del circuito para el timer
  getCircuitTimerState: (blockId: string) => CircuitTimerState;
}
```

### Tipos nuevos (Simplificados)

```typescript
interface CircuitExerciseItem {
  exerciseInBlock: ActiveWorkoutExercise;
  set: ActiveWorkoutSet;
  roundIndex: number; // 0-based (round - 1)
  exerciseIndex: number; // 0-based index del ejercicio en el circuito
  totalExercises: number;
  totalRounds: number;
  targetDuration: number; // Siempre presente porque solo soportamos time_only
}

interface CircuitTimerState {
  blockId: string;
  totalRounds: number;
  currentRound: number;
  totalExercises: number;
  currentExerciseIndex: number;
  restBetweenExercises: number; // Del block
  restBetweenRounds: number; // Del block
  completedSets: string[]; // IDs de sets completados
  exercises: CircuitExerciseInfo[];
}

interface CircuitExerciseInfo {
  exerciseId: string;
  exerciseInBlockId: string;
  name: string;
  targetDuration: number; // Segundos
}
```

---

## 🧩 Manejo de Casos Especiales

### Caso: Usuario cierra el timer mode a mitad

**Comportamiento**: Los sets ya completados quedan guardados. Al volver a abrir, detecta sets completados y continúa desde el siguiente pendiente.

### Caso: Usuario pausa y retoma después de mucho tiempo

**Comportamiento**: Timer mantiene el estado pausado. No hay timeout. Al resumir, continúa exactamente donde quedó.

### Caso: Usuario quiere agregar/quitar tiempo al descanso

**Comportamiento**: Botones [-10s] y [+10s] durante cualquier descanso. Ajusta solo el descanso actual, no cambia la configuración del bloque.

### Caso: Usuario quiere skipear un ejercicio

**Comportamiento**: Botón SKIP marca el set como completado con `duration = 0` (o un flag de skipped). Avanza al siguiente.

### Caso: El circuito no tiene ejercicios time_only

**Comportamiento**: El botón "Iniciar Timer Mode" simplemente no aparece en el menú de opciones del bloque. No hay mensaje de error, la opción no existe.

### Caso: El circuito tiene algunos ejercicios time_only y otros no

**Comportamiento**: Igual que arriba. Si no son TODOS time_only, no aparece la opción. El usuario debe diseñar el circuito correctamente.

---

## 📝 Traducciones Necesarias

```typescript
const circuitTimerTranslations = {
  // Headers
  title: { es: "Timer de Circuito", en: "Circuit Timer" },
  round: { es: "Ronda", en: "Round" },

  // Estados
  rest: { es: "Descanso", en: "Rest" },
  getReady: { es: "Prepárate", en: "Get Ready" },
  go: { es: "¡YA!", en: "GO!" },
  roundComplete: { es: "Ronda Completada", en: "Round Complete" },
  circuitComplete: { es: "¡Circuito Completado!", en: "Circuit Complete!" },

  // Navegación
  next: { es: "Siguiente", en: "Next" },

  // Acciones
  pause: { es: "Pausar", en: "Pause" },
  resume: { es: "Continuar", en: "Resume" },
  skip: { es: "Saltar", en: "Skip" },
  finish: { es: "Terminar", en: "Finish" },
  close: { es: "Cerrar", en: "Close" },

  // Resumen
  totalTime: { es: "Tiempo total", en: "Total time" },
  roundsCompleted: { es: "Rondas completadas", en: "Rounds completed" },
  exercises: { es: "Ejercicios", en: "Exercises" },
  summary: { es: "Resumen", en: "Summary" },

  // Opción en menú
  startTimerMode: { es: "Iniciar Modo Timer", en: "Start Timer Mode" },
  startTimerModeDesc: {
    es: "Timer automático para el circuito",
    en: "Automatic timer for the circuit",
  },
};
```

---

## 📋 Plan de Implementación

### Fase 1: Foundation (1-2 días)

- [ ] Crear helper `canUseCircuitTimerMode()` en `store-helpers.ts`
- [ ] Crear `CircuitTimerModeV2.tsx` con estructura básica
- [ ] Agregar opción condicional en `BlockOptionsSheetV2`
- [ ] Implementar state machine básica (idle, countdown, exercise, rest, complete)

### Fase 2: Timer Core (2 días)

- [ ] Implementar countdown inicial (5,4,3,2,1,GO!)
- [ ] Implementar countdown de ejercicio con progress bar
- [ ] Implementar transición automática ejercicio → descanso
- [ ] Implementar descanso entre ejercicios con countdown

### Fase 3: Rounds y Completado (1-2 días)

- [ ] Implementar detección de fin de round
- [ ] Implementar descanso entre rounds (roundRest)
- [ ] Implementar transición round N → round N+1
- [ ] Implementar pantalla de completado con resumen

### Fase 4: Integración con Store (1 día)

- [ ] Implementar `autoCompleteTimeSet()` para guardar sets
- [ ] Integrar con `completeSet()` existente
- [ ] Verificar que sets se persisten correctamente

### Fase 5: Audio y Haptics (1 día)

- [ ] Integrar haptics en transiciones
- [ ] Agregar sonidos de countdown (reusar existentes si es posible)
- [ ] Agregar sonido de GO! y round complete
- [ ] Testing con audio en background

### Fase 6: Polish (1 día)

- [ ] Manejar pause/resume
- [ ] Manejar skip ejercicio
- [ ] Manejar cierre y reapertura (continuar donde quedó)
- [ ] Agregar traducciones
- [ ] Testing dark/light mode
- [ ] Code review

**Tiempo total estimado: 7-9 días**

---

## 🎯 Métricas de Éxito

- [ ] El botón "Iniciar Timer Mode" solo aparece en circuitos 100% time_only
- [ ] Timer avanza automáticamente entre ejercicios y rounds
- [ ] Audio y haptics funcionan en foreground y background
- [ ] Sets se marcan como completados con el tiempo correcto
- [ ] Al cerrar y reabrir, continúa donde quedó
- [ ] UX es fluida y consistente con el resto de la app

---

## 📚 Referencias

- `TempoMetronomeV2.tsx` - Patrón de modal fullscreen con timer
- `RestTimerBannerV2.tsx` - Lógica de timer con background
- `use-timer.ts` - Hook de timer existente
- `BlockOptionsSheetV2.tsx` - Patrón de sheet de opciones
- Colores: `#4A90E2` (circuit), `#22C55E` (success), `#F59E0B` (warning)

---

> **Última actualización**: Diciembre 2025  
> **Estado**: Diseño completo - Solo circuitos 100% time-based (Opción B)  
> **Tiempo estimado**: 7-9 días de implementación
