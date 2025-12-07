# 🔥 SUPER PLAN: Sync Engine Bulletproof

## ✅ ESTADO: IMPLEMENTADO

> **Fecha de implementación:** Completado  
> **Todas las fases críticas han sido implementadas.**

---

## 📊 RESUMEN DE IMPLEMENTACIÓN

### ✅ FASE 1: Schema Migration - `is_synced` flag

**Estado:** COMPLETADO

Agregado `is_synced` a 19 tablas:

- [x] `folders`
- [x] `routines`
- [x] `routine_blocks`
- [x] `exercise_in_block`
- [x] `routine_sets`
- [x] `workout_sessions`
- [x] `workout_blocks`
- [x] `workout_exercises`
- [x] `workout_sets`
- [x] `tracker_metrics`
- [x] `tracker_entries`
- [x] `tracker_daily_aggregates`
- [x] `tracker_quick_actions`
- [x] `macro_targets`
- [x] `macro_entries`
- [x] `macro_daily_aggregates`
- [x] `macro_quick_actions`
- [x] `user_preferences`
- [x] `pr_current`
- [x] `pr_history`

**Archivos modificados:**

- `shared/db/schema/routine.ts`
- `shared/db/schema/tracker.ts`
- `shared/db/schema/macros.ts`
- `shared/db/schema/workout-session.ts`
- `shared/db/schema/user.ts`
- `shared/db/schema/pr.ts`

---

### ✅ FASE 2-3: Sync Confirmation System

**Estado:** COMPLETADO

**Archivos creados:**

- `shared/sync/utils/sync-confirmation.ts`
  - `markEntitySynced(table, id)` - Marca una entidad como sincronizada
  - `confirmSyncFromPayload(code, payload)` - Infiere y marca desde mutation
  - `getUnsyncedCounts(userId)` - Detecta data no sincronizada

**Integración:**

- `sync-engine.ts` ahora llama `confirmSyncFromPayload()` después de sync exitoso

---

### ✅ FASE 4: Repository Updates

**Estado:** COMPLETADO

- `tracker.repository.ts` actualizado para incluir IDs en payloads
- Tipos Insert actualizados para hacer `is_synced` opcional

---

### ✅ FASE 5: Restore Service

**Estado:** COMPLETADO

**Archivos creados:**

- `shared/sync/restore/restore-service.ts`
  - `needsRestore(userId)` - Detecta si necesita restore
  - `restoreAllData(userId, progressCallback)` - Restaura todo desde Supabase
- `shared/sync/restore/use-restore.ts`

  - Hook React con estado de progreso
  - Returns: `{ restore, isRestoring, progress, result, error, reset }`

- `shared/sync/restore/index.ts` - Exports del módulo

---

### ✅ FASE 6: Queue Cleanup

**Estado:** COMPLETADO

**Archivos creados:**

- `shared/sync/utils/queue-cleanup.ts`
  - `runQueueCleanup()` - Limpia entries viejas
  - Completadas: 7 días
  - Fallidas: 30 días

**Métodos agregados a `SyncQueueRepository`:**

- `cleanupCompleted(daysOld)`
- `cleanupFailed(daysOld)`

**Integración:**

- `use-simple-scheduler.ts` ejecuta cleanup al iniciar la app

---

### ✅ FASE 7: Unsynced Detector

**Estado:** COMPLETADO

Incluido en `sync-confirmation.ts`:

- `getUnsyncedCounts(userId)` retorna conteo por tabla

---

### FASE 4: Restore Flow - Recuperar data en nuevo dispositivo

**Nuevo archivo: `shared/sync/restore/restore-service.ts`**

```typescript
/**
 * Servicio para restaurar data de Supabase a SQLite
 * Se usa cuando:
 * - Usuario instala app en nuevo dispositivo
 * - Usuario reinstala la app
 * - Se borra cache local
 */

export class RestoreService {
  private supabase: SupabaseClient;

  /**
   * Detecta si necesitamos hacer restore
   */
  async needsRestore(userId: string): Promise<boolean> {
    // Checkear si hay data local
    const [localRoutines] = await db
      .select({ count: count() })
      .from(routines)
      .where(eq(routines.user_id, userId));

    // Si no hay nada local, verificar si hay en cloud
    if (localRoutines.count === 0) {
      const { count: cloudCount } = await supabase
        .from("routines")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      return cloudCount > 0;
    }

    return false;
  }

  /**
   * Ejecuta restore completo
   */
  async restoreAll(userId: string): Promise<RestoreResult> {
    const results = {
      folders: await this.restoreFolders(userId),
      routines: await this.restoreRoutines(userId),
      trackerMetrics: await this.restoreTrackerMetrics(userId),
      // ... etc
    };

    return results;
  }

  private async restoreFolders(userId: string): Promise<number> {
    const { data: cloudFolders } = await supabase
      .from("folders")
      .select("*")
      .eq("user_id", userId)
      .is("deleted_at", null);

    if (!cloudFolders?.length) return 0;

    // Bulk insert a SQLite
    await db.insert(folders).values(
      cloudFolders.map((f) => ({
        ...f,
        is_synced: true, // Ya viene de cloud
      }))
    );

    return cloudFolders.length;
  }

  // ... métodos similares para cada tabla
}
```

**Integración en onboarding/login:**

```typescript
// En el flow de autenticación
const restoreService = new RestoreService();

if (await restoreService.needsRestore(userId)) {
  // Mostrar UI de restore
  setRestoreStatus("restoring");

  const result = await restoreService.restoreAll(userId);

  setRestoreStatus("complete");
  // Mostrar resumen: "Recuperados: X rutinas, Y métricas..."
}
```

---

### FASE 5: Cleanup Automático de Queue

**Agregar job de limpieza:**

```typescript
// shared/sync/utils/queue-cleanup.ts
export const scheduleQueueCleanup = () => {
  // Cada 24 horas, limpiar entries completadas de más de 7 días
  const CLEANUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 horas

  setInterval(async () => {
    const queueRepo = getSyncQueueRepository();
    const deleted = await queueRepo.cleanupCompleted(7); // 7 días
    console.log(`🧹 Queue cleanup: ${deleted} old entries removed`);
  }, CLEANUP_INTERVAL);
};
```

---

### FASE 6: Unsynced Data Detection

**Nueva query helper:**

```typescript
// shared/sync/utils/unsynced-detector.ts
export const getUnsyncedCounts = async (
  userId: string
): Promise<UnsyncedStats> => {
  const tables = [
    { name: "folders", schema: folders },
    { name: "routines", schema: routines },
    // ... etc
  ];

  const stats: UnsyncedStats = {};

  for (const { name, schema } of tables) {
    const [result] = await db
      .select({ count: count() })
      .from(schema)
      .where(and(eq(schema.user_id, userId), eq(schema.is_synced, false)));

    stats[name] = result.count;
  }

  return stats;
};

// Uso en UI de debugging:
const unsynced = await getUnsyncedCounts(userId);
// { folders: 0, routines: 2, trackerMetrics: 0, ... }
```

---

### FASE 7: Force Sync para Failed Items

**Nueva función en sync engine:**

```typescript
// Permitir reintento manual de items fallados
export const retryFailedItems = async (): Promise<RetryResult> => {
  const queueRepo = getSyncQueueRepository();

  // Resetear todos los failed a pending
  const failedEntries = await queueRepo.getByStatus("failed");

  for (const entry of failedEntries) {
    await db
      .update(syncQueue)
      .set({
        status: "pending",
        retry_count: 0,
        error_message: null,
        scheduled_at: new Date().toISOString(),
      })
      .where(eq(syncQueue.id, entry.id));
  }

  // Trigger processing
  const result = await processQueue();

  return {
    retriedCount: failedEntries.length,
    ...result,
  };
};
```

---

## 🗂️ ESTRUCTURA DE ARCHIVOS FINAL

```
shared/
├── sync/
│   ├── sync-engine.ts           # ✏️ Modificar (mark synced post-success)
│   ├── queue/
│   │   ├── sync-queue-repository.ts   # ✅ OK
│   │   └── sync-state-manager.ts      # ✅ OK
│   ├── restore/                        # 🆕 NUEVO
│   │   ├── restore-service.ts
│   │   └── restore-tables.ts
│   ├── utils/
│   │   ├── backoff-calculator.ts      # ✅ OK
│   │   ├── global-sync-lock.ts        # ✅ OK
│   │   ├── mark-synced.ts             # 🆕 NUEVO
│   │   ├── queue-cleanup.ts           # 🆕 NUEVO
│   │   └── unsynced-detector.ts       # 🆕 NUEVO
│   └── hooks/
│       ├── use-simple-scheduler.ts    # ✅ OK
│       ├── use-sync.ts                # ✅ OK
│       └── use-restore.ts             # 🆕 NUEVO
│
├── db/
│   └── schema/
│       ├── routine.ts        # ✏️ Agregar is_synced
│       ├── tracker.ts        # ✏️ Agregar is_synced
│       ├── macros.ts         # ✏️ Agregar is_synced
│       ├── workout-session.ts # ✏️ Agregar is_synced
│       ├── user.ts           # ✏️ Agregar is_synced
│       └── pr.ts             # ✏️ Agregar is_synced
│
└── data/
    └── repositories/
        ├── folders.repository.ts    # ✏️ Set is_synced=false on mutation
        ├── routines.repository.ts   # ✏️ Set is_synced=false on mutation
        └── ...                      # ✏️ Todos igual
```

---

## 📊 ORDEN DE IMPLEMENTACIÓN

| Paso | Tarea                            | Estimado | Dependencias |
| ---- | -------------------------------- | -------- | ------------ |
| 1    | Schema migration (is_synced)     | 2h       | Ninguna      |
| 2    | Helper `markEntitySynced`        | 1h       | Paso 1       |
| 3    | Actualizar sync-engine post-sync | 1h       | Paso 2       |
| 4    | Actualizar repositories          | 3h       | Paso 1, 3    |
| 5    | Restore service básico           | 3h       | Paso 1       |
| 6    | Queue cleanup job                | 30min    | Ninguna      |
| 7    | Unsynced detector                | 30min    | Paso 1       |
| 8    | Retry failed items               | 30min    | Ninguna      |
| 9    | Testing E2E                      | 2h       | Todo         |

**Total estimado: ~13 horas**

---

## 🧪 PLAN DE TESTING

### Unit Tests

```typescript
describe('Sync Robustness', () => {
  it('should mark entity is_synced=false on create', async () => {
    const folder = await dataService.folders.create({...});
    const saved = await db.select().from(folders).where(eq(folders.id, folder.id));
    expect(saved.is_synced).toBe(false);
  });

  it('should mark entity is_synced=true after successful sync', async () => {
    // Simular sync exitoso
    await processQueue();
    const saved = await db.select().from(folders).where(...);
    expect(saved.is_synced).toBe(true);
  });

  it('should restore all data from cloud on new device', async () => {
    // Simular Supabase con data
    // Ejecutar restore
    // Verificar que SQLite tiene la data
  });
});
```

### Integration Tests

1. Crear data offline → reconectar → verificar sync
2. Simular error de red → verificar retry
3. Simular nuevo dispositivo → verificar restore

---

## 🎯 BENEFICIOS FINALES

| Antes                                | Después                          |
| ------------------------------------ | -------------------------------- |
| No sabemos qué está sincronizado     | `is_synced` flag en cada entidad |
| Asumimos sync exitoso                | Confirmación real post-sync      |
| Cambio de teléfono = perdida de data | Restore completo desde cloud     |
| Queue crece infinito                 | Cleanup automático               |
| Failed items quedan atascados        | Retry manual disponible          |
| Sin visibilidad                      | Métricas de unsynced data        |

---

## ⚠️ CONSIDERACIONES

1. **Migrations**: Al agregar `is_synced`, data existente tendrá `false`. Opción: correr un script que marque todo como `true` asumiendo que ya está en cloud.

2. **Performance**: `is_synced` queries son O(1) con índice. No hay impacto.

3. **Conflictos**: Si usuario edita en dos dispositivos, el último sync gana. Para app personal sin colaboración, esto es aceptable.

4. **Backwards compatibility**: Supabase no necesita cambios. Solo SQLite local.

---

## 🚀 EMPEZAR

¿Por dónde quieres comenzar?

**Opción A:** Fase 1 - Schema migration (base para todo lo demás)  
**Opción B:** Fase 5 - Queue cleanup (rápido y autocontenido)  
**Opción C:** Todo en orden (máxima robustez)

Dime y arrancamos! 💪
