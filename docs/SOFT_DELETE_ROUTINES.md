# Soft Delete para Rutinas - Plan de Migración

## 🚨 Problema Actual

### Estado Actual

- Las rutinas se borran con `DELETE` (hard delete)
- `workout_sessions` tiene FK a `routines` con `ON DELETE CASCADE`
- Al borrar una rutina, **SE PIERDEN TODAS LAS SESIONES DE ENTRENAMIENTO**

### Impacto

1. **Pérdida de datos irrecuperable**: Todo el historial de entrenamientos de esa rutina desaparece
2. **PRs huérfanos**: Los PRs están asociados a sesiones que ya no existen
3. **Analytics rotas**: Gráficos y estadísticas pierden datos históricos
4. **Inconsistencia**: SQLite y Supabase podrían comportarse diferente

### Código Actual del Delete

```typescript
// use-routine-options.ts
await routinesService.deleteRoutine(routine.id);
sync("ROUTINE_DELETE", { id: routine.id });
```

```sql
-- supabase-rpc-functions.sql
DELETE FROM routines WHERE id = routine_id_param;
-- CASCADE borra workout_sessions, workout_blocks, workout_exercises, workout_sets
```

---

## ✅ Solución: Soft Delete

### Concepto

En lugar de borrar la rutina, marcarla como "eliminada" con un timestamp.

### Cambios en Schema

#### 1. Agregar campo `deleted_at` a routines

**SQLite (`shared/db/schema/routine.ts`):**

```typescript
export const routines = sqliteTable("routines", {
  // ... campos existentes
  deleted_at: text("deleted_at"), // ISO timestamp, NULL = activa
});
```

**Supabase:**

```sql
ALTER TABLE routines ADD COLUMN deleted_at TIMESTAMPTZ;
```

#### 2. Cambiar FK behavior (Supabase)

Cambiar de:

```sql
routine_id UUID NOT NULL REFERENCES routines(id) ON DELETE CASCADE
```

A:

```sql
routine_id UUID NOT NULL REFERENCES routines(id) ON DELETE RESTRICT
```

Esto **previene** borrar rutinas que tienen sesiones asociadas.

---

## 📁 Archivos a Modificar

| Archivo                                                    | Cambio                                                                      |
| ---------------------------------------------------------- | --------------------------------------------------------------------------- |
| `shared/db/schema/routine.ts`                              | Agregar `deleted_at`                                                        |
| `shared/db/repository/routines.ts`                         | Cambiar `deleteRoutineById` a soft delete, filtrar por `deleted_at IS NULL` |
| `supabase-schema.sql`                                      | Agregar columna, cambiar FK behavior                                        |
| `supabase-rpc-functions.sql`                               | Cambiar `delete_routine_by_id` a UPDATE                                     |
| `features/workouts/hooks/use-routine-options.ts`           | Ya funciona (llama al service)                                              |
| `shared/sync/repositories/supabase-routines-repository.ts` | Actualizar RPC call                                                         |
| Nueva migración                                            | Para SQLite local                                                           |
| Nueva migración Supabase                                   | Para Supabase                                                               |

---

## 🔧 Implementación Detallada

### 1. Schema SQLite - `routine.ts`

```typescript
export const routines = sqliteTable(
  "routines",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateUUID()),
    name: text("name").notNull(),
    folder_id: text("folder_id").references(() => folders.id),
    created_by_user_id: text("created_by_user_id").notNull(),
    training_days: text("training_days", { mode: "json" }).$type<string[]>(),
    show_rpe: integer("show_rpe", { mode: "boolean" }).notNull().default(true),
    show_tempo: integer("show_tempo", { mode: "boolean" })
      .notNull()
      .default(true),
    is_quick_workout: integer("is_quick_workout", { mode: "boolean" })
      .notNull()
      .default(false), // Quick workout feature
    deleted_at: text("deleted_at"), // NUEVO: soft delete
    ...timestamps,
  }
  // ...
);
```

### 2. Repository - `routines.ts`

**A) Modificar todas las queries para filtrar deleted:**

```typescript
findAllWithMetrics: async (
  folderId: string | null
): Promise<RoutineWithMetrics[]> => {
  const rows = await db
    .select({
      /* ... */
    })
    .from(routines)
    .leftJoin(/* ... */)
    .where(
      and(
        folderId
          ? eq(routines.folder_id, folderId)
          : isNull(routines.folder_id),
        isNull(routines.deleted_at), // <-- NUEVO
        eq(routines.is_quick_workout, false) // <-- Quick workout feature
      )
    )
    .groupBy(routines.id);
  // ...
};
```

**B) Cambiar `deleteRoutineById` a soft delete:**

```typescript
deleteRoutineById: async (routineId: string): Promise<void> => {
  // ANTES: Hard delete con cascade manual
  // AHORA: Soft delete
  await db
    .update(routines)
    .set({ deleted_at: new Date().toISOString() })
    .where(eq(routines.id, routineId));
};
```

**C) Actualizar `getAllRoutinesCount`:**

```typescript
getAllRoutinesCount: async (): Promise<number> => {
  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(routines)
    .where(
      and(isNull(routines.deleted_at), eq(routines.is_quick_workout, false))
    )
    .limit(1);
  return result[0].count;
};
```

### 3. Supabase RPC - Modificar función

```sql
-- Cambiar de DELETE a UPDATE
CREATE OR REPLACE FUNCTION delete_routine_by_id(
  routine_id_param UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Soft delete: solo marcar como eliminada
  UPDATE routines
  SET deleted_at = NOW(), updated_at = NOW()
  WHERE id = routine_id_param;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Routine not found';
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Failed to delete routine: %', SQLERRM;
END;
$$;
```

### 4. Migración SQLite Local

```sql
-- drizzle/migrations/add-routine-soft-delete.sql
ALTER TABLE routines ADD COLUMN deleted_at TEXT;
```

### 5. Migración Supabase

```sql
-- supabase-migration-soft-delete-routines.sql

-- 1. Agregar columna
ALTER TABLE routines ADD COLUMN deleted_at TIMESTAMPTZ;

-- 2. Cambiar FK behavior (requiere recrear constraint)
-- NOTA: Esto es más complejo, ver sección "FK Migration" abajo
```

---

## ⚠️ Migración de FK (Supabase)

Cambiar el `ON DELETE CASCADE` a `ON DELETE RESTRICT` requiere:

```sql
-- 1. Eliminar constraint existente
ALTER TABLE workout_sessions
DROP CONSTRAINT workout_sessions_routine_id_fkey;

-- 2. Crear nueva constraint con RESTRICT
ALTER TABLE workout_sessions
ADD CONSTRAINT workout_sessions_routine_id_fkey
FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE RESTRICT;
```

**IMPORTANTE:** Esto previene borrar rutinas que tienen sesiones. El soft delete evita este problema porque no borra realmente.

---

## 🔄 Flujo Post-Implementación

```
Usuario quiere borrar rutina
    │
    ▼
¿Tiene workout_sessions?
    │
    ├── SÍ → Soft delete (deleted_at = now())
    │        Rutina desaparece de la UI pero datos persisten
    │
    └── NO → Podría hacer hard delete, pero por simplicidad
             también soft delete
```

---

## 📊 Queries Afectadas

Todas las queries que listan rutinas deben filtrar:

| Query                 | Archivo       | Cambio                                    |
| --------------------- | ------------- | ----------------------------------------- |
| `findAllWithMetrics`  | `routines.ts` | `WHERE deleted_at IS NULL`                |
| `getAllRoutinesCount` | `routines.ts` | `WHERE deleted_at IS NULL`                |
| `findRoutineById`     | `routines.ts` | No cambiar (necesario para ver historial) |
| RPC queries           | Supabase      | Agregar filtro                            |

---

## 🧹 Limpieza Futura (Opcional)

Podríamos agregar un job periódico que borre rutinas soft-deleted que:

1. No tienen workout_sessions asociadas
2. Fueron eliminadas hace más de X días

```sql
DELETE FROM routines
WHERE deleted_at IS NOT NULL
AND deleted_at < NOW() - INTERVAL '90 days'
AND NOT EXISTS (
  SELECT 1 FROM workout_sessions WHERE routine_id = routines.id
);
```

---

## ⏱️ Estimación

| Tarea                     | Tiempo       |
| ------------------------- | ------------ |
| Schema SQLite + migración | 20 min       |
| Repository changes        | 30 min       |
| Supabase schema + RPC     | 30 min       |
| Testing                   | 30 min       |
| **Total**                 | **~2 horas** |

---

## 🎯 Orden de Implementación

1. **Primero:** Soft delete de rutinas (este documento)
2. **Después:** Quick Workout feature (que depende de `is_quick_workout`)

---

## ✅ Checklist

- [ ] Agregar `deleted_at` a schema SQLite
- [ ] Agregar `is_quick_workout` a schema SQLite (para quick workout feature)
- [ ] Crear migración SQLite
- [ ] Modificar `findAllWithMetrics` con filtros
- [ ] Modificar `getAllRoutinesCount` con filtros
- [ ] Cambiar `deleteRoutineById` a soft delete
- [ ] Modificar Supabase schema
- [ ] Modificar RPC `delete_routine_by_id`
- [ ] Cambiar FK behavior en Supabase
- [ ] Test: Borrar rutina con sesiones
- [ ] Test: Verificar sesiones persisten
- [ ] Test: Rutina no aparece en lista
