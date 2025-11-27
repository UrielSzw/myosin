# Quick Workout Feature - Plan de Implementación

## 📋 Resumen

Permitir iniciar un entrenamiento vacío sin rutina previa. La rutina se crea automáticamente como "invisible" (`is_quick_workout = true`) y al finalizar el usuario puede elegir convertirla en una rutina normal.

---

## 🎯 Opción Elegida: A - Rutina Virtual/Temporal

### Concepto

- Al iniciar Quick Workout, se crea una rutina con `is_quick_workout = true`
- Esta rutina NO aparece en la lista de rutinas del usuario
- El filtro se hace a nivel de repository/service, NO en la UI
- Al finalizar, el usuario elige si convertirla en rutina normal o dejarla oculta

---

## 📁 Archivos a Modificar/Crear

| Archivo                                                                | Acción    | Descripción                                |
| ---------------------------------------------------------------------- | --------- | ------------------------------------------ |
| `shared/db/schema/routine.ts`                                          | Modificar | Agregar campo `is_quick_workout`           |
| `shared/db/repository/routines.ts`                                     | Modificar | Filtrar en queries, crear funciones nuevas |
| `supabase-schema.sql`                                                  | Modificar | Agregar columna `is_quick_workout`         |
| `features/active-workout/hooks/use-active-workout-store.ts`            | Modificar | Agregar `initializeQuickWorkout()`         |
| `features/active-workout/hooks/use-finish-workout.ts`                  | Modificar | Lógica diferente para quick workouts       |
| `features/workouts/elements/header/expandable-create-button/index.tsx` | Modificar | Agregar botón "Quick Workout"              |
| `shared/translations/workouts.ts`                                      | Modificar | Agregar traducciones                       |
| `shared/translations/active-workout.ts`                                | Modificar | Agregar traducciones finish                |
| `shared/sync/repositories/supabase-routines-repository.ts`             | Modificar | Incluir `is_quick_workout` en sync         |
| Nueva migración SQL                                                    | Crear     | Migración para SQLite local                |

---

## 🔧 Cambios Detallados

### 1. Schema - `shared/db/schema/routine.ts`

```typescript
is_quick_workout: integer("is_quick_workout", { mode: "boolean" })
  .notNull()
  .default(false),
```

### 2. Repository - `shared/db/repository/routines.ts`

**A) Modificar `findAllWithMetrics`:**

```typescript
.where(
  and(
    folderId ? eq(routines.folder_id, folderId) : isNull(routines.folder_id),
    eq(routines.is_quick_workout, false)  // <-- Filtrar quick workouts
  )
)
```

**B) Modificar `getAllRoutinesCount`:**

```typescript
.where(eq(routines.is_quick_workout, false))
```

**C) Agregar `createQuickWorkoutRoutine`:**

```typescript
createQuickWorkoutRoutine: async (userId: string): Promise<BaseRoutine> => {
  const quickRoutine: RoutineInsert = {
    id: generateUUID(),
    name: `Quick Workout`,
    folder_id: null,
    created_by_user_id: userId,
    show_rpe: true,
    show_tempo: false,
    training_days: null,
    is_quick_workout: true,
  };
  const [created] = await db.insert(routines).values(quickRoutine).returning();
  return created;
};
```

**D) Agregar `convertQuickWorkoutToRoutine`:**

```typescript
convertQuickWorkoutToRoutine: async (routineId: string): Promise<void> => {
  await db
    .update(routines)
    .set({ is_quick_workout: false })
    .where(eq(routines.id, routineId));
};
```

### 3. Store - `use-active-workout-store.ts`

Nueva action `initializeQuickWorkout`:

- Crear rutina temporal vacía
- Sync a Supabase
- Inicializar state vacío (sin bloques/ejercicios/sets)

### 4. Finish Workout - `use-finish-workout.ts`

Flujo diferenciado para quick workouts:

```
Si es quick workout:
  Alert: "¿Guardar como rutina?"
  - "No, solo guardar" → executeFinishWorkout(true) con rutina oculta
  - "Sí, crear rutina" → convertQuickWorkoutToRoutine() + executeFinishWorkout(true)
```

**NOTA:** NO pedir nombre. Si quiere cambiar el nombre, lo hace después desde edit.

### 5. ExpandableCreateButton

Agregar tercera opción con icono Dumbbell y color success.

### 6. Translations

Ver sección de traducciones abajo.

---

## 🔄 Flujo de Usuario

```
[+] Botón Crear
    ├── 📝 Crear desde 0      → /routines/create
    ├── ⚡ Usar template       → /routines/templates
    └── 🏋️ Quick Workout      → Crear rutina temp → /workout

Durante workout:
    - Header muestra "Quick Workout"
    - Usuario agrega ejercicios
    - Funciona como workout normal

Al finalizar:
    Alert: "¿Guardar como rutina?"
    ├── "No, solo guardar"    → Rutina queda oculta (is_quick_workout=true)
    └── "Sí, crear rutina"    → Rutina se convierte en normal (is_quick_workout=false)
```

---

## 🌐 Translations

### `workouts.ts`

```typescript
quickWorkout: {
  es: "Entrenamiento rápido",
  en: "Quick workout",
},
errorStartingQuickWorkout: {
  es: "No se pudo iniciar el entrenamiento rápido",
  en: "Could not start quick workout",
},
```

### `active-workout.ts`

```typescript
saveAsRoutineTitle: {
  es: "Guardar como rutina",
  en: "Save as routine",
},
saveAsRoutineMessage: {
  es: "¿Deseas guardar este entrenamiento como una nueva rutina reutilizable?",
  en: "Do you want to save this workout as a new reusable routine?",
},
noJustSave: {
  es: "No, solo guardar",
  en: "No, just save",
},
yesCreateRoutine: {
  es: "Sí, crear rutina",
  en: "Yes, create routine",
},
```

---

## ⏱️ Estimación

| Tarea                  | Tiempo         |
| ---------------------- | -------------- |
| Schema + Migración     | 30 min         |
| Repository             | 45 min         |
| Store                  | 45 min         |
| Finish Workout         | 1 hora         |
| ExpandableCreateButton | 45 min         |
| Translations           | 15 min         |
| Supabase sync          | 30 min         |
| Testing                | 1 hora         |
| **Total**              | **~5-6 horas** |

---

## ⚠️ Consideraciones

1. **Nombre**: Mostrar "Quick Workout" en el header durante el entrenamiento. Si el usuario quiere cambiar el nombre después de convertirla, lo hace desde edit.

2. **Rutinas huérfanas**: Las rutinas con `is_quick_workout=true` que nunca se convierten quedan en DB pero invisibles. Ver SOFT_DELETE_ROUTINES.md para estrategia de manejo.

3. **Historial**: Las sesiones de quick workouts quedan vinculadas a su rutina oculta.

---

## 🚨 BLOCKER: Soft Delete de Rutinas

**ANTES de implementar esta feature**, se debe resolver el problema de borrado de rutinas.

Actualmente las rutinas se borran con DELETE, lo cual:

- Rompe FKs con workout_sessions
- Pierde historial de entrenamientos
- Es irreversible

**Ver:** `SOFT_DELETE_ROUTINES.md` para el plan de migración a soft delete.
