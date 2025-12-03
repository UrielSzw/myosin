# 🔍 Auditoría de Arquitectura: Sistema de Sync SQLite ↔ Supabase

## Resumen Ejecutivo

La arquitectura de sync de Myosin implementa un patrón **Offline-First** robusto con las siguientes características principales:

- ✅ **SQLite como fuente primaria** (operaciones instantáneas)
- ✅ **Sync asíncrono a Supabase** (fire-and-forget)
- ✅ **Cola persistente** con reintentos exponenciales
- ✅ **Circuit breaker** para resiliencia
- ✅ **Transacciones atómicas** vía RPC functions

---

## 📐 Diagrama de Flujo Principal

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              UI LAYER                                    │
│   (useSaveRoutine, useCreateFolder, useTrackerEntry, etc.)              │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         SERVICE LAYER                                    │
│        (createRoutineService, foldersRepository, trackerRepository)     │
└────────────────┬─────────────────────────────────────┬──────────────────┘
                 │                                     │
                 ▼                                     ▼
┌────────────────────────────────┐    ┌────────────────────────────────────┐
│      SQLite (Drizzle ORM)      │    │         useSyncEngine()            │
│  - Escritura inmediata         │    │  - Evalúa si hay conexión          │
│  - Transacciones locales       │    │  - Online → sync directo           │
│  - Fuente de verdad local      │    │  - Offline → encola                │
└────────────────────────────────┘    └─────────────────┬──────────────────┘
                                                        │
                                      ┌─────────────────┴─────────────────┐
                                      │                                   │
                                      ▼                                   ▼
                      ┌───────────────────────────┐    ┌──────────────────────────┐
                      │    syncToSupabase()       │    │    SyncQueue (SQLite)    │
                      │    (sync directo)         │    │    - Mutaciones pending  │
                      │                           │    │    - Retry count         │
                      └───────────┬───────────────┘    │    - Scheduled at        │
                                  │                    └────────────┬─────────────┘
                                  │                                 │
                                  │          ┌──────────────────────┘
                                  │          │ (cada 30s via scheduler)
                                  ▼          ▼
                      ┌───────────────────────────────────────────────────┐
                      │              sync-dictionary.ts                   │
                      │   MutationCode → Supabase Repository Function     │
                      └────────────────────────┬──────────────────────────┘
                                               │
                                               ▼
                      ┌───────────────────────────────────────────────────┐
                      │           Supabase Repositories                   │
                      │  - SupabaseFoldersRepository                      │
                      │  - SupabaseRoutinesRepository (usa RPC)           │
                      │  - SupabaseTrackerRepository (usa RPC)            │
                      │  - etc.                                           │
                      └────────────────────────┬──────────────────────────┘
                                               │
                                               ▼
                      ┌───────────────────────────────────────────────────┐
                      │              Supabase (PostgreSQL)                │
                      │  - RPC Functions para transacciones complejas     │
                      │  - RLS Policies                                   │
                      │  - Fuente de verdad en la nube                    │
                      └───────────────────────────────────────────────────┘
```

---

## 📁 Estructura de Archivos del Sistema de Sync

```
shared/sync/
├── sync-engine.ts              # Core: useSyncEngine hook + syncToSupabase
├── README.md                   # Documentación del sistema
├── types/
│   ├── mutations.ts            # 40+ MutationCode types
│   └── sync-queue.ts           # Tipos de cola y estados
├── dictionary/
│   └── sync-dictionary.ts      # Mapeo MutationCode → Función
├── repositories/
│   ├── base-supabase-repository.ts
│   ├── supabase-folders-repository.ts
│   ├── supabase-routines-repository.ts    # Usa RPC
│   ├── supabase-tracker-repository.ts     # Usa RPC
│   ├── supabase-macros-repository.ts
│   ├── supabase-pr-repository.ts
│   ├── supabase-workout-repository.ts     # Usa RPC
│   └── supabase-user-repository.ts
├── queue/
│   ├── sync-queue-repository.ts    # CRUD de cola en SQLite
│   └── sync-state-manager.ts       # Circuit breaker + backoff
├── hooks/
│   ├── use-sync.ts                 # Hook principal (engine + scheduler)
│   └── use-simple-scheduler.ts     # Timer 30s + mutex global
└── utils/
    ├── backoff-calculator.ts       # Exponential backoff
    └── global-sync-lock.ts         # Mutex para evitar concurrencia
```

---

## 🔄 Flujo Detallado de una Operación

### Ejemplo: Crear Rutina

```typescript
// 1️⃣ HOOK DE UI (features/routine-form-v2/hooks/use-save-routine.ts)
const { sync } = useSyncEngine();

// 2️⃣ GUARDAR EN SQLITE (primero, siempre)
const savedRoutine = await createRoutineService.createRoutine(
  formattedRoutineData
);
// → Llama a routinesRepository.createRoutineWithData()
// → Ejecuta db.transaction() con Drizzle ORM
// → Escritura LOCAL instantánea ✅

// 3️⃣ SYNC A SUPABASE (después, async)
sync("ROUTINE_CREATE", {
  routine: routineData,
  blocks: blocksData,
  exercisesInBlock: exercisesInBlockData,
  sets: setsData,
});
```

### Dentro de `useSyncEngine.sync()`:

```typescript
// sync-engine.ts
const sync = useCallback(
  async (code: MutationCode, payload: any) => {
    if (isOnline && !isQueueProcessing) {
      // 🟢 ONLINE: Sync directo
      const result = await syncToSupabase(code, payload);
      if (!result.success) {
        // Falló → encolar para retry
        await queueRepo.enqueue({ code, payload });
      }
    } else {
      // 🔴 OFFLINE: Encolar
      await queueRepo.enqueue({ code, payload });
    }
  },
  [isOnline, isQueueProcessing]
);
```

### Dentro de `syncToSupabase()`:

```typescript
// sync-engine.ts
const syncToSupabase = async (code: MutationCode, payload: any) => {
  const syncFn = supabaseSyncDictionary[code];
  // → Busca en dictionary: ROUTINE_CREATE → routinesRepo.createRoutineWithData()

  const result = await syncFn(payload);
  // → Llama a supabase.rpc("create_routine_with_data", {...})
  // → PostgreSQL ejecuta transacción atómica
};
```

---

## 📊 Comparativa: SQLite vs Supabase Repositories

### Operación: `createRoutineWithData`

| Aspecto        | SQLite (Drizzle)                              | Supabase (RPC)                                             |
| -------------- | --------------------------------------------- | ---------------------------------------------------------- |
| **Archivo**    | `shared/db/repository/routines.ts`            | `shared/sync/repositories/supabase-routines-repository.ts` |
| **Método**     | `db.transaction()`                            | `supabase.rpc("create_routine_with_data", {...})`          |
| **Atomicidad** | Drizzle transaction                           | PostgreSQL transaction                                     |
| **Parámetros** | `{ routine, blocks, exercisesInBlock, sets }` | `{ routine_data, blocks_data, exercises_data, sets_data }` |

### Código SQLite:

```typescript
// shared/db/repository/routines.ts
createRoutineWithData: async (data: CreateRoutineData) => {
  return await db.transaction(async (tx) => {
    // 1. Insert routine
    const [routine] = await tx
      .insert(routines)
      .values(data.routine)
      .returning();

    // 2. Insert blocks
    for (const block of data.blocks) {
      await tx.insert(routineBlocks).values(block);
    }

    // 3. Insert exercises
    for (const exercise of data.exercisesInBlock) {
      await tx.insert(exerciseInBlock).values(exercise);
    }

    // 4. Insert sets
    for (const set of data.sets) {
      await tx.insert(routineSets).values(set);
    }

    return routine;
  });
};
```

### Código Supabase RPC:

```typescript
// shared/sync/repositories/supabase-routines-repository.ts
async createRoutineWithData(data: CreateRoutineData) {
  const { data: result, error } = await this.supabase.rpc(
    "create_routine_with_data",
    {
      routine_data: data.routine,
      blocks_data: data.blocks,
      exercises_data: data.exercisesInBlock,
      sets_data: data.sets,
    }
  );
  // La transacción atómica ocurre en PostgreSQL
}
```

---

## 🛡️ Mecanismos de Resiliencia

### 1. Cola Persistente (SQLite)

```typescript
// schema: sync-queue
{
  id: string,
  mutation_code: MutationCode,
  payload: string (JSON),
  status: "pending" | "processing" | "completed" | "failed",
  retry_count: number,
  max_retries: number,
  scheduled_at: string,
  error_message?: string,
  created_at: string,
  updated_at: string,
}
```

### 2. Exponential Backoff

```typescript
// backoff-calculator.ts
const calculateBackoffDelay = (retryCount: number) => {
  const baseDelay = 1000; // 1 segundo
  const maxDelay = 300000; // 5 minutos
  const multiplier = 2;

  // Retry 1: 2s, Retry 2: 4s, Retry 3: 8s, Retry 4: 16s, Retry 5: 32s
  return Math.min(baseDelay * Math.pow(multiplier, retryCount), maxDelay);
};
```

### 3. Circuit Breaker

```typescript
// sync-state-manager.ts
onSyncFailure(error: Error) {
  const shouldTrigger = shouldTriggerCircuitBreaker(error);
  // Network errors, server 5xx → trigger breaker

  if (shouldTrigger && consecutiveFailures >= 3) {
    status = "failed";
    backoffUntil = calculateNextRetryDate(consecutiveFailures);
    // Pausa todo sync hasta backoffUntil
  }
}
```

### 4. Global Sync Lock (Mutex)

```typescript
// global-sync-lock.ts
static async execute<T>(fn: () => Promise<T>): Promise<T | null> {
  if (this.isProcessing) {
    return null; // Skip si ya hay proceso en curso
  }

  this.isProcessing = true;
  try {
    return await fn();
  } finally {
    this.isProcessing = false;
  }
}
```

---

## 📋 Catálogo de MutationCodes (40+)

### Routines

| Code                           | Descripción                       |
| ------------------------------ | --------------------------------- |
| `ROUTINE_CREATE`               | Crear rutina completa             |
| `ROUTINE_UPDATE`               | Actualizar rutina completa        |
| `ROUTINE_DELETE`               | Eliminar rutina                   |
| `ROUTINE_CLEAR_TRAINING_DAYS`  | Limpiar días de entrenamiento     |
| `ROUTINE_CREATE_QUICK_WORKOUT` | Crear workout rápido              |
| `ROUTINE_CONVERT_FROM_QUICK`   | Convertir workout rápido a rutina |

### Folders

| Code             | Descripción        |
| ---------------- | ------------------ |
| `FOLDER_CREATE`  | Crear carpeta      |
| `FOLDER_UPDATE`  | Actualizar carpeta |
| `FOLDER_DELETE`  | Eliminar carpeta   |
| `FOLDER_REORDER` | Reordenar carpetas |

### Tracker

| Code                                   | Descripción               |
| -------------------------------------- | ------------------------- |
| `TRACKER_ENTRY_CREATE`                 | Crear entrada             |
| `TRACKER_ENTRY_UPDATE`                 | Actualizar entrada        |
| `TRACKER_ENTRY_DELETE`                 | Eliminar entrada          |
| `TRACKER_ENTRY_FROM_QUICK_ACTION`      | Crear desde quick action  |
| `TRACKER_ENTRY_WITH_AGGREGATE`         | Crear con agregado diario |
| `TRACKER_REPLACE_ENTRY_WITH_AGGREGATE` | Reemplazar con agregado   |
| `TRACKER_DELETE_ENTRY_WITH_AGGREGATE`  | Eliminar con agregado     |
| `TRACKER_METRIC_CREATE`                | Crear métrica             |
| `TRACKER_METRIC_UPDATE`                | Actualizar métrica        |
| `TRACKER_METRIC_DELETE`                | Eliminar métrica (soft)   |
| `TRACKER_METRIC_RESTORE`               | Restaurar métrica         |
| `TRACKER_METRIC_REORDER`               | Reordenar métricas        |
| `TRACKER_METRIC_FROM_TEMPLATE`         | Crear desde template      |
| `TRACKER_QUICK_ACTION_CREATE`          | Crear quick action        |
| `TRACKER_QUICK_ACTION_DELETE`          | Eliminar quick action     |

### Macros

| Code                        | Descripción                   |
| --------------------------- | ----------------------------- |
| `MACRO_TARGET_UPSERT`       | Crear/actualizar objetivo     |
| `MACRO_TARGET_UPDATE`       | Actualizar objetivo           |
| `MACRO_ENTRY_CREATE`        | Crear entrada con agregado    |
| `MACRO_ENTRY_UPDATE`        | Actualizar entrada            |
| `MACRO_ENTRY_DELETE`        | Eliminar entrada con agregado |
| `MACRO_QUICK_ACTIONS_INIT`  | Inicializar quick actions     |
| `MACRO_QUICK_ACTION_CREATE` | Crear quick action            |
| `MACRO_QUICK_ACTION_DELETE` | Eliminar quick action         |

### PR (Personal Records)

| Code        | Descripción                 |
| ----------- | --------------------------- |
| `PR_CREATE` | Crear/actualizar PR actual  |
| `PR_UPDATE` | Insertar en historial de PR |

### Workouts

| Code               | Descripción               |
| ------------------ | ------------------------- |
| `WORKOUT_START`    | Iniciar sesión de workout |
| `WORKOUT_COMPLETE` | Completar workout         |
| `WORKOUT_UPDATE`   | Actualizar sesión         |

### User

| Code                      | Descripción             |
| ------------------------- | ----------------------- |
| `USER_PREFERENCES_CREATE` | Crear preferencias      |
| `USER_PREFERENCES_UPDATE` | Actualizar preferencias |

---

## ⚠️ Puntos de Atención / Posibles Mejoras

### 1. **Consistencia de Schemas**

| ⚠️ Riesgo    | Detalle                                                             |
| ------------ | ------------------------------------------------------------------- |
| Schema drift | Los campos entre SQLite (Drizzle) y Supabase (RPC) podrían divergir |
| Ejemplo      | `training_days` es `string[]` en Drizzle pero `jsonb` en PostgreSQL |

**Recomendación**: Crear tipos compartidos que ambos sistemas usen, o agregar validación de schema en sync.

### 2. **Manejo de Conflictos**

| Estado Actual   | Mejora Potencial                                 |
| --------------- | ------------------------------------------------ |
| Last-write-wins | No hay detección de conflictos                   |
| Sin merge       | Si 2 dispositivos editan offline, el último gana |

**Recomendación**: Para features multi-dispositivo, considerar timestamps de versión o CRDTs.

### 3. **Payloads Duplicados**

```typescript
// En use-save-routine.ts, el payload se construye DOS veces:
// 1. Para SQLite
const formattedRoutineData = { routine, blocks, exercisesInBlock, sets };

// 2. Para sync (casi idéntico)
const syncPayload = { routine, blocks, exercisesInBlock, sets };
```

**Recomendación**: Unificar la construcción del payload.

### 4. **Error Handling Silencioso**

```typescript
// use-save-routine.ts
try {
  sync(syncCode, syncPayload);
} catch (syncError) {
  console.warn(`⚠️ Routine sync failed:`, syncError);
  // El usuario NO se entera si el sync falla
}
```

**Recomendación**: Sistema de notificación para sync failures persistentes.

### 5. **Testing de Integridad**

| Estado Actual                   | Necesidad                                         |
| ------------------------------- | ------------------------------------------------- |
| Sin tests automatizados de sync | Validar que SQLite y Supabase tienen mismos datos |

**Recomendación**: Tests E2E que:

1. Ejecuten flujo desde UI
2. Verifiquen SQLite
3. Verifiquen Supabase
4. Comparen ambos

### 6. **Cleanup de Cola**

```typescript
// La cola se limpia cada 7 días por defecto
cleanupCompleted(daysOld: number = 7)
```

**Recomendación**: Monitorear tamaño de cola en producción.

---

## ✅ Fortalezas de la Arquitectura

1. **Separación clara de responsabilidades**

   - SQLite = escritura local instantánea
   - Sync = fire-and-forget
   - Queue = resiliencia

2. **Offline-first genuino**

   - La app funciona 100% offline
   - El sync es "best effort"

3. **Transacciones atómicas**

   - SQLite usa `db.transaction()`
   - Supabase usa RPC functions con transacciones

4. **Código limpio y documentado**

   - README.md extenso
   - Tipos bien definidos
   - Separación en módulos

5. **Debugging friendly**
   - Logs detallados
   - Estado de cola consultable
   - Métricas de health

---

## 🧪 Cómo Testear el Sistema

### Test Manual Rápido:

```typescript
// En React Native Debugger o similar:

// 1. Verificar estado de sync
const { getQueueMetrics, getQueueSize } = useSyncEngine();
console.log(await getQueueMetrics());
console.log(await getQueueSize());

// 2. Ver mutaciones disponibles
const { getAvailableMutations } = useSyncEngine();
console.log(getAvailableMutations());

// 3. Forzar procesamiento de cola
const { processNow } = useSimpleScheduler();
await processNow();
```

### Test de Flujo Completo:

1. Poner dispositivo en modo avión
2. Crear rutina/folder/tracker entry
3. Verificar que aparece en UI (SQLite funcionó)
4. Verificar que hay items en sync queue
5. Reconectar a internet
6. Esperar 30s (scheduler) o forzar `processNow()`
7. Verificar en Supabase Dashboard que los datos llegaron

---

## 📚 Archivos Clave para Modificaciones

| Si necesitas...                 | Edita...                                                                  |
| ------------------------------- | ------------------------------------------------------------------------- |
| Agregar nueva entidad           | `types/mutations.ts` + `dictionary/sync-dictionary.ts` + nuevo repository |
| Cambiar lógica de retry         | `utils/backoff-calculator.ts`                                             |
| Cambiar frecuencia de scheduler | `hooks/use-simple-scheduler.ts` (default 30000ms)                         |
| Agregar RPC function            | `supabase_functions/supabase-rpc-functions.sql`                           |
| Modificar schema SQLite         | `shared/db/schema/*.ts` + migración Drizzle                               |

---

## 🔮 Posibles Evoluciones Futuras

1. **Sync bidireccional**: Pull de cambios desde Supabase
2. **Conflict resolution**: UI para resolver conflictos manuales
3. **Sync selectivo**: Priorizar ciertos tipos de mutaciones
4. **Compression**: Comprimir payloads grandes en cola
5. **Batch operations**: Agrupar mutaciones similares

---

_Documento generado: Auditoría de arquitectura sync SQLite ↔ Supabase_
_Última actualización: $(date)_
