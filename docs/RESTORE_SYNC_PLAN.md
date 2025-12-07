# 🔄 Plan de Implementación: Queue Gate + Incremental Sync

## 📋 Resumen Ejecutivo

**Objetivo:** Garantizar que la data del usuario esté siempre sincronizada entre dispositivos, sin perder datos y sin duplicados.

**Estrategia:**

1. No permitir login con otra cuenta si hay queue pendiente
2. Si cambia de cuenta (queue vacío), borrar todo y bajar del nuevo usuario
3. Si es el mismo usuario, sync incremental (solo lo que falta)
4. Límites de histórico: 3 meses entries, 6 meses workouts

---

## 🔍 REVISIÓN CRÍTICA - MEJORAS PARA PRODUCCIÓN

### 🚨 Problemas Identificados y Soluciones

#### 1. **Race Condition en LoginSyncGate**

**Problema:** El `useEffect` puede ejecutarse múltiples veces si `userId` cambia rápidamente.

**Solución:** Usar `useRef` para tracking + cancelación:

```typescript
const syncInProgressRef = useRef(false);
const mountedRef = useRef(true);

useEffect(() => {
  if (syncInProgressRef.current) return; // Evitar doble ejecución
  syncInProgressRef.current = true;

  const performSync = async () => {
    if (!mountedRef.current) return;
    // ... sync logic
  };

  performSync();

  return () => {
    mountedRef.current = false;
  };
}, [userId]);
```

#### 2. **Timeout en Sync de Tablas Grandes**

**Problema:** Si hay miles de workouts, la query puede timeout.

**Solución:** Paginación con cursor:

```typescript
async function syncTablePaginated(
  tableName: string,
  userId: string,
  dateLimit?: string,
  pageSize: number = 500
): Promise<number> {
  let totalSynced = 0;
  let lastId: string | null = null;

  while (true) {
    let query = supabase
      .from(tableName)
      .select("*")
      .eq("user_id", userId)
      .order("id", { ascending: true })
      .limit(pageSize);

    if (lastId) {
      query = query.gt("id", lastId);
    }
    if (dateLimit) {
      query = query.gte("created_at", dateLimit);
    }

    const { data, error } = await query;

    if (error) throw error;
    if (!data?.length) break;

    // Batch insert
    await db
      .insert(schema[tableName])
      .values(data.map((r) => ({ ...r, is_synced: true })));

    totalSynced += data.length;
    lastId = data[data.length - 1].id;

    // Si recibimos menos del pageSize, terminamos
    if (data.length < pageSize) break;
  }

  return totalSynced;
}
```

#### 3. **Transacciones para FULL RESET**

**Problema:** Si falla a mitad del clear, la DB queda corrupta.

**Solución:** Wrap en transacción:

```typescript
async function performFullReset(userId: string): Promise<void> {
  await db.transaction(async (tx) => {
    // 1. Limpiar sync_queue primero (no tiene FK)
    await tx.delete(syncQueue);

    // 2. Borrar en orden inverso de FK
    for (const table of CLEAR_ORDER) {
      await tx.delete(schema[table]).where(eq(schema[table].user_id, userId));
    }
  });
}
```

#### 4. **Retry Logic para Tablas Individuales**

**Problema:** Si falla una tabla, todo el sync falla.

**Solución:** Retry por tabla con backoff:

```typescript
async function syncTableWithRetry(
  tableName: string,
  userId: string,
  maxRetries: number = 3
): Promise<{ success: boolean; count: number; error?: string }> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const count = await syncTablePaginated(tableName, userId);
      return { success: true, count };
    } catch (error) {
      if (attempt === maxRetries) {
        return { success: false, count: 0, error: String(error) };
      }
      // Exponential backoff: 1s, 2s, 4s
      await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt - 1)));
    }
  }
  return { success: false, count: 0, error: "Max retries exceeded" };
}
```

#### 5. **Offline-First: Permitir acceso si es mismo usuario**

**Problema:** Si no hay internet, el usuario no puede usar la app aunque ya tenga data.

**Solución:** Skip sync si offline + mismo usuario:

```typescript
const checkAndSync = async (userId: string): Promise<LoginSyncResult> => {
  const lastUserId = await getLastLoggedUserId();
  const isSameUser = lastUserId === userId;

  // Si es offline pero mismo usuario, permitir acceso
  if (!isOnline && isSameUser) {
    console.log("[LoginSync] Offline but same user, allowing access");
    return { success: true, blocked: false, skipped: true };
  }

  // Si es offline y otro usuario, bloquear
  if (!isOnline && !isSameUser) {
    return {
      success: false,
      blocked: true,
      blockReason: "Se requiere conexión a internet para cambiar de cuenta",
    };
  }

  // Online: continuar con sync normal
  // ...
};
```

#### 6. **Progress Granular**

**Problema:** El usuario solo ve "loading" sin saber qué pasa.

**Solución:** Progress detallado:

```typescript
interface SyncProgress {
  phase: "queue_check" | "uploading" | "clearing" | "downloading";
  currentTable: string;
  currentTableIndex: number;
  totalTables: number;
  itemsInCurrentTable: number;
  totalItemsSynced: number;
  estimatedTimeRemaining?: number; // segundos
}
```

#### 7. **Manejo de Conflictos de Versión**

**Problema:** ¿Qué pasa si Supabase tiene schema diferente?

**Solución:** Validar schema antes de insert:

```typescript
function validateAndTransform(tableName: string, data: any[]): any[] {
  const schema = TABLE_SCHEMAS[tableName];

  return data.map((item) => {
    const validated: any = {};
    for (const [key, type] of Object.entries(schema)) {
      if (key in item) {
        validated[key] = item[key];
      } else if (type.required) {
        throw new Error(`Missing required field: ${key} in ${tableName}`);
      }
    }
    return validated;
  });
}
```

---

## 🏆 MEJORES PRÁCTICAS IMPLEMENTADAS

### 1. **Idempotencia**

- Todas las operaciones de sync son idempotentes
- UPSERT en lugar de INSERT
- IDs generados en cliente (UUID)

### 2. **Graceful Degradation**

- Offline = usar data local (si es mismo usuario)
- Error en una tabla = continuar con las demás
- Retry automático con backoff

### 3. **Observabilidad**

```typescript
// Agregar logging estructurado
const syncLogger = {
  start: (phase: string) => console.log(`[Sync] ▶️ Starting: ${phase}`),
  progress: (phase: string, detail: string) =>
    console.log(`[Sync] 🔄 ${phase}: ${detail}`),
  success: (phase: string) => console.log(`[Sync] ✅ Completed: ${phase}`),
  error: (phase: string, error: Error) =>
    console.error(`[Sync] ❌ Failed: ${phase}`, error),
  metric: (name: string, value: number) =>
    console.log(`[Sync] 📊 ${name}: ${value}`),
};
```

### 4. **Memory Management**

```typescript
// Procesar en chunks para no sobrecargar memoria
const CHUNK_SIZE = 100;

async function insertInChunks(table: any, data: any[]): Promise<void> {
  for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    const chunk = data.slice(i, i + CHUNK_SIZE);
    await db.insert(table).values(chunk);
  }
}
```

### 5. **Cancelación de Operaciones**

```typescript
// AbortController para cancelar syncs largos
const controller = new AbortController();

// En el componente
useEffect(() => {
  const ctrl = new AbortController();
  performSync(ctrl.signal);
  return () => ctrl.abort();
}, []);

// En la función de sync
async function fetchFromSupabase(signal: AbortSignal) {
  if (signal.aborted) throw new Error("Sync cancelled");
  // ...
}
```

---

## 🏗️ ARQUITECTURA

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FLUJO DE LOGIN                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐                                                   │
│  │ Usuario hace │                                                   │
│  │    LOGIN     │                                                   │
│  └──────┬───────┘                                                   │
│         │                                                            │
│         ▼                                                            │
│  ┌──────────────────────────────────────┐                           │
│  │      QUEUE GATE CHECK                 │                           │
│  │  ¿Hay queue pendiente?                │                           │
│  └──────┬───────────────┬───────────────┘                           │
│         │               │                                            │
│    NO   │          SÍ   │                                            │
│         │               ▼                                            │
│         │    ┌─────────────────────────┐                            │
│         │    │ ¿Queue es del mismo     │                            │
│         │    │ user que hace login?    │                            │
│         │    └────┬───────────┬────────┘                            │
│         │         │           │                                      │
│         │    SÍ   │      NO   │                                      │
│         │         │           ▼                                      │
│         │         │    ┌─────────────────────┐                      │
│         │         │    │ ❌ BLOQUEAR LOGIN   │                      │
│         │         │    │ "Sincroniza primero │                      │
│         │         │    │  la otra cuenta"    │                      │
│         │         │    └─────────────────────┘                      │
│         │         │                                                  │
│         ▼         ▼                                                  │
│  ┌──────────────────────────────────────┐                           │
│  │ ¿Es el MISMO usuario que antes?      │                           │
│  │ (comparar con último user logueado)  │                           │
│  └──────────┬──────────────┬────────────┘                           │
│             │              │                                         │
│        SÍ   │         NO   │                                         │
│             │              │                                         │
│             ▼              ▼                                         │
│     ┌────────────┐   ┌─────────────────┐                            │
│     │INCREMENTAL │   │   FULL RESET    │                            │
│     │(solo nuevo)│   │1. Borrar TODO   │                            │
│     └─────┬──────┘   │2. Bajar TODO    │                            │
│           │          └────────┬────────┘                            │
│           │                   │                                      │
│           ▼                   ▼                                      │
│  ┌──────────────────────────────────────┐                           │
│  │     ✅ ACCESO A LA APP               │                           │
│  └──────────────────────────────────────┘                           │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📊 LÍMITES DE DATOS HISTÓRICOS

### Configuración de límites por tabla:

```typescript
const SYNC_LIMITS = {
  // ══════════════════════════════════════════════════════════════
  // SIN LÍMITE - Siempre bajar todo (configuración y estructura)
  // ══════════════════════════════════════════════════════════════
  unlimited: [
    "folders", // Carpetas de rutinas
    "routines", // Rutinas del usuario
    "routine_blocks", // Bloques de rutinas
    "exercise_in_block", // Ejercicios en bloques
    "routine_sets", // Sets de rutinas
    "tracker_metrics", // Métricas configuradas
    "tracker_quick_actions", // Quick actions de tracker
    "macro_targets", // Objetivos de macros
    "macro_quick_actions", // Quick actions de macros
    "pr_current", // PRs actuales
    "user_preferences", // Preferencias de usuario
  ],

  // ══════════════════════════════════════════════════════════════
  // 3 MESES - Entries diarias (datos frecuentes, efímeros)
  // ══════════════════════════════════════════════════════════════
  threeMonths: [
    "tracker_entries", // Registros de tracker
    "tracker_daily_aggregates", // Agregados diarios tracker
    "macro_entries", // Registros de macros
    "macro_daily_aggregates", // Agregados diarios macros
  ],

  // ══════════════════════════════════════════════════════════════
  // 6 MESES - Workouts y PR history (datos importantes para progreso)
  // ══════════════════════════════════════════════════════════════
  sixMonths: [
    "workout_sessions", // Sesiones de entrenamiento
    "workout_blocks", // Bloques de workout
    "workout_exercises", // Ejercicios de workout
    "workout_sets", // Sets de workout
    "pr_history", // Histórico de PRs
  ],
};
```

### Cálculo de fechas límite:

```typescript
function getDateLimit(category: "threeMonths" | "sixMonths"): string {
  const now = new Date();
  const months = category === "threeMonths" ? 3 : 6;
  now.setMonth(now.getMonth() - months);
  return now.toISOString();
}

// Ejemplo de query con límite:
const threeMonthsAgo = getDateLimit("threeMonths");
const { data } = await supabase
  .from("tracker_entries")
  .select("*")
  .eq("user_id", userId)
  .gte("created_at", threeMonthsAgo); // Solo últimos 3 meses
```

---

## 📦 COMPONENTES A IMPLEMENTAR

### 1. Queue Gate Service

**Archivo:** `shared/sync/restore/queue-gate.ts`

```typescript
interface QueueGateResult {
  canProceed: boolean;
  reason: "queue_empty" | "same_user" | "different_user";
  pendingCount: number;
  queueUserId: string | null;
}

interface QueueGateCheck {
  // Verificar si puede proceder con login
  checkQueueGate(loginUserId: string): Promise<QueueGateResult>;

  // Obtener el user_id del queue (si hay)
  getQueueUserId(): Promise<string | null>;

  // Obtener último usuario logueado (guardado en AsyncStorage)
  getLastLoggedUserId(): Promise<string | null>;

  // Guardar último usuario logueado
  setLastLoggedUserId(userId: string): Promise<void>;
}
```

**Lógica:**

```typescript
async function checkQueueGate(loginUserId: string): Promise<QueueGateResult> {
  // 1. Obtener items pendientes del queue
  const pendingItems = await queueRepo.getByStatus("pending");
  const failedItems = await queueRepo.getByStatus("failed");
  const allPending = [...pendingItems, ...failedItems];

  // 2. Si no hay nada pendiente, puede proceder
  if (allPending.length === 0) {
    return {
      canProceed: true,
      reason: "queue_empty",
      pendingCount: 0,
      queueUserId: null,
    };
  }

  // 3. Extraer user_id del primer item
  const firstPayload = JSON.parse(allPending[0].payload);
  const queueUserId = firstPayload.user_id || firstPayload.created_by_user_id;

  // 4. Comparar con el user que intenta loguearse
  if (queueUserId === loginUserId) {
    return {
      canProceed: true,
      reason: "same_user",
      pendingCount: allPending.length,
      queueUserId,
    };
  }

  // 5. Es otro usuario, BLOQUEAR
  return {
    canProceed: false,
    reason: "different_user",
    pendingCount: allPending.length,
    queueUserId,
  };
}
```

---

### 2. Incremental Sync Service

**Archivo:** `shared/sync/restore/incremental-sync.ts`

```typescript
interface SyncProgress {
  phase: 'checking' | 'uploading' | 'clearing' | 'downloading';
  currentTable: string;
  tablesCompleted: number;
  totalTables: number;
  itemsSynced: number;
}

interface SyncResult {
  success: boolean;
  mode: 'incremental' | 'full_reset';
  uploaded: number;
  downloaded: number;
  errors: string[];
}

// Funciones principales:
performLoginSync(
  userId: string,
  isNewUser: boolean,  // true = borrar y bajar todo, false = incremental
  onProgress?: (progress: SyncProgress) => void
): Promise<SyncResult>
```

**Orden de tablas (respetando foreign keys):**

```
FASE 1 - UPLOAD (si hay queue pendiente del mismo user)
───────────────────────────────────────────────────────
Procesar sync_queue completo antes de continuar

FASE 2 - CLEAR (solo si isNewUser = true)
───────────────────────────────────────────────────────
Borrar en orden INVERSO (hijos primero, padres después):
1. workout_sets
2. workout_exercises
3. workout_blocks
4. workout_sessions
5. pr_history
6. pr_current
7. macro_daily_aggregates
8. macro_entries
9. macro_quick_actions
10. macro_targets
11. tracker_daily_aggregates
12. tracker_entries
13. tracker_quick_actions
14. tracker_metrics
15. routine_sets
16. exercise_in_block
17. routine_blocks
18. routines
19. folders
20. user_preferences

FASE 3 - DOWNLOAD (cloud → local)
───────────────────────────────────────────────────────
Orden de dependencias (padres primero):

SIN LÍMITE:
1. folders
2. routines
3. routine_blocks
4. exercise_in_block
5. routine_sets
6. tracker_metrics
7. tracker_quick_actions
8. macro_targets
9. macro_quick_actions
10. pr_current
11. user_preferences

3 MESES:
12. tracker_entries
13. tracker_daily_aggregates
14. macro_entries
15. macro_daily_aggregates

6 MESES:
16. workout_sessions
17. workout_blocks
18. workout_exercises
19. workout_sets
20. pr_history
```

**Lógica de sync por tabla:**

```typescript
async function syncTable(
  tableName: string,
  userId: string,
  isFullReset: boolean,
  dateLimit?: string // Para tablas con límite temporal
): Promise<number> {
  if (isFullReset) {
    // FULL RESET: Bajar todo (con límite de fecha si aplica)
    let query = supabase.from(tableName).select("*").eq("user_id", userId);

    if (dateLimit) {
      query = query.gte("created_at", dateLimit);
    }

    const { data } = await query;

    if (data?.length) {
      await db
        .insert(schema[tableName])
        .values(data.map((r) => ({ ...r, is_synced: true })));
    }

    return data?.length || 0;
  } else {
    // INCREMENTAL: Solo lo nuevo
    const maxUpdatedAt = await getMaxUpdatedAt(tableName, userId);

    let query = supabase
      .from(tableName)
      .select("*")
      .eq("user_id", userId)
      .gt("updated_at", maxUpdatedAt || "1970-01-01");

    if (dateLimit) {
      query = query.gte("created_at", dateLimit);
    }

    const { data } = await query;

    if (data?.length) {
      // UPSERT: actualizar si existe, insertar si no
      for (const item of data) {
        await db
          .insert(schema[tableName])
          .values({ ...item, is_synced: true })
          .onConflictDoUpdate({
            target: schema[tableName].id,
            set: { ...item, is_synced: true },
          });
      }
    }

    return data?.length || 0;
  }
}
```

---

### 3. Hook useLoginSync

**Archivo:** `shared/sync/hooks/use-login-sync.ts`

```typescript
interface UseLoginSyncResult {
  checkAndSync: (userId: string) => Promise<LoginSyncResult>;
  isProcessing: boolean;
  progress: SyncProgress | null;
  error: string | null;
}

interface LoginSyncResult {
  success: boolean;
  blocked: boolean;
  blockReason?: string;
  syncResult?: SyncResult;
}

export function useLoginSync(): UseLoginSyncResult {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<SyncProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkAndSync = useCallback(
    async (userId: string): Promise<LoginSyncResult> => {
      setIsProcessing(true);
      setError(null);

      try {
        // 1. Queue Gate Check
        const gateResult = await checkQueueGate(userId);

        if (!gateResult.canProceed) {
          return {
            success: false,
            blocked: true,
            blockReason: `Hay ${gateResult.pendingCount} operaciones pendientes de otra cuenta. 
                        Por favor, conecta internet y espera a que se sincronicen.`,
          };
        }

        // 2. Determinar si es nuevo usuario o el mismo
        const lastUserId = await getLastLoggedUserId();
        const isNewUser = lastUserId !== null && lastUserId !== userId;

        // 3. Si hay queue pendiente del mismo user, procesarlo primero
        if (gateResult.reason === "same_user" && gateResult.pendingCount > 0) {
          setProgress({
            phase: "uploading",
            currentTable: "sync_queue",
            tablesCompleted: 0,
            totalTables: 1,
            itemsSynced: 0,
          });
          await processQueue(); // Usar el sync engine existente
        }

        // 4. Ejecutar sync (incremental o full reset)
        const syncResult = await performLoginSync(
          userId,
          isNewUser,
          setProgress
        );

        // 5. Guardar este usuario como el último logueado
        await setLastLoggedUserId(userId);

        return {
          success: syncResult.success,
          blocked: false,
          syncResult,
        };
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        return { success: false, blocked: false };
      } finally {
        setIsProcessing(false);
        setProgress(null);
      }
    },
    []
  );

  return { checkAndSync, isProcessing, progress, error };
}
```

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
shared/
└── sync/
    └── restore/
        ├── index.ts                 # Exports
        ├── queue-gate.ts            # 🆕 Queue Gate logic
        ├── incremental-sync.ts      # 🆕 Incremental sync + full reset
        ├── sync-limits.ts           # 🆕 Configuración de límites temporales
        └── restore-service.ts       # 🗑️ Eliminar (reemplazado)

shared/
└── sync/
    └── hooks/
        ├── use-login-sync.ts        # 🆕 Hook principal para login
        ├── use-simple-scheduler.ts  # ✅ Sin cambios
        └── use-sync.ts              # ✅ Sin cambios

shared/
└── ui/
    └── login-sync-gate/
        └── index.tsx                # 🆕 Wrapper component
```

---

## 🔌 PUNTO DE INTEGRACIÓN

### Archivo: `app/(authenticated)/_layout.tsx`

El wrapper `LoginSyncGate` se integra envolviendo el contenido del layout:

```typescript
import { LoginSyncGate } from "@/shared/ui/login-sync-gate";

export default function AuthenticatedLayout() {
  const { user, loading } = useProtectedRoute();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);
  const t = sharedUiTranslations;

  // Mostrar loading mientras verifica auth
  if (loading) {
    return <LoadingScreen />;
  }

  // Si no hay usuario, useProtectedRoute ya hizo el redirect
  if (!user) {
    return <LoadingScreen />;
  }

  // 🆕 LoginSyncGate envuelve todo el contenido
  // - Verifica queue gate
  // - Ejecuta sync (incremental o full reset)
  // - Solo renderiza children cuando está listo
  return (
    <LoginSyncGate userId={user.id}>
      <AuthenticatedContent user={user} lang={lang} t={t} />
    </LoginSyncGate>
  );
}

// Separamos el contenido para que useSync() se inicialice DESPUÉS del sync
function AuthenticatedContent({ user, lang, t }) {
  // Inicializar sistema de sync solo después de LoginSyncGate
  useSync();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* ... todas las rutas ... */}
    </Stack>
  );
}
```

---

## 🧩 COMPONENTE: LoginSyncGate

**Archivo:** `shared/ui/login-sync-gate/index.tsx`

```typescript
import { useLoginSync } from "@/shared/sync/hooks/use-login-sync";
import { LoadingScreen } from "@/shared/ui/loading-screen";
import { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";

interface LoginSyncGateProps {
  userId: string;
  children: React.ReactNode;
}

export function LoginSyncGate({ userId, children }: LoginSyncGateProps) {
  const { checkAndSync, isProcessing, progress, error } = useLoginSync();
  const [syncComplete, setSyncComplete] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [blockReason, setBlockReason] = useState<string | null>(null);

  useEffect(() => {
    const performSync = async () => {
      const result = await checkAndSync(userId);

      if (result.blocked) {
        setBlocked(true);
        setBlockReason(result.blockReason || "Hay operaciones pendientes");
        return;
      }

      setSyncComplete(true);
    };

    performSync();
  }, [userId, checkAndSync]);

  // Estado: BLOQUEADO (queue de otro usuario)
  if (blocked) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
          ⚠️ Sincronización Pendiente
        </Text>
        <Text style={{ textAlign: "center", marginBottom: 20 }}>
          {blockReason}
        </Text>
        <Button
          title="Reintentar"
          onPress={() => {
            setBlocked(false);
            setSyncComplete(false);
          }}
        />
      </View>
    );
  }

  // Estado: PROCESANDO
  if (isProcessing || !syncComplete) {
    return <LoadingScreen />;
    // TODO: Podemos mejorar para mostrar progress si queremos
  }

  // Estado: ERROR
  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
          ❌ Error de Sincronización
        </Text>
        <Text style={{ textAlign: "center", marginBottom: 20 }}>{error}</Text>
        <Button
          title="Reintentar"
          onPress={() => {
            setSyncComplete(false);
          }}
        />
      </View>
    );
  }

  // Estado: LISTO - renderizar children
  return <>{children}</>;
}
```

---

## 🧪 CASOS DE TEST

### Test 1: Login limpio - mismo usuario

```
Estado inicial:
- sync_queue: vacío
- SQLite: tiene data del user "abc"
- Login con user_id = "abc"

Esperado:
- Queue gate: ✅ queue_empty
- Modo: INCREMENTAL
- Solo baja lo nuevo de Supabase
```

### Test 2: Login limpio - usuario diferente (FULL RESET)

```
Estado inicial:
- sync_queue: vacío
- SQLite: tiene data del user "abc"
- Login con user_id = "xyz"

Esperado:
- Queue gate: ✅ queue_empty
- Detecta que es usuario diferente
- Modo: FULL RESET
- Borra toda la data local
- Baja todo de Supabase para "xyz"
```

### Test 3: Login con queue del mismo usuario

```
Estado inicial:
- sync_queue: 3 items pending (user_id = "abc")
- Login con user_id = "abc"

Esperado:
- Queue gate: ✅ same_user
- Procesa queue primero (upload)
- Luego INCREMENTAL sync (download)
```

### Test 4: Login con queue de otro usuario (BLOQUEADO)

```
Estado inicial:
- sync_queue: 3 items pending (user_id = "abc")
- Login con user_id = "xyz"

Esperado:
- Queue gate: ❌ different_user
- BLOQUEADO
- Mensaje: "Hay datos pendientes de otra cuenta"
```

### Test 5: Límites temporales

```
Hoy: 2024-12-06

Esperado para tracker_entries (3 meses):
- Bajar desde: 2024-09-06
- No bajar entries de agosto o antes

Esperado para workout_sessions (6 meses):
- Bajar desde: 2024-06-06
- No bajar workouts de mayo o antes
```

---

## ⚠️ CONSIDERACIONES

### 1. ¿Qué pasa si no hay internet?

- Queue gate funciona offline (lee SQLite)
- Sync falla → mostrar error claro
- Opción: permitir entrar offline si es mismo usuario
- Reintentar sync cuando haya conexión

### 2. ¿Dónde guardar "último usuario logueado"?

- Usar tabla **`user_preferences`** de SQLite
- Query: `SELECT user_id FROM user_preferences ORDER BY updated_at DESC LIMIT 1`
- Siempre debería haber 1 sola fila, pero por seguridad traemos la última actualizada
- ✅ No necesitamos AsyncStorage adicional

```typescript
async function getLastLoggedUserId(): Promise<string | null> {
  const [result] = await db
    .select({ user_id: userPreferences.user_id })
    .from(userPreferences)
    .orderBy(desc(userPreferences.updated_at))
    .limit(1);

  return result?.user_id ?? null;
}
```

### 3. ¿Soft deletes?

- Los registros con `deleted_at` también se sincronizan
- Se bajan y quedan marcados como borrados localmente
- El WHERE debe incluir registros con deleted_at

### 4. ¿Qué pasa con data local más vieja que el límite?

- En FULL RESET: no se baja (ok, es nuevo usuario)
- En INCREMENTAL: la data vieja local se mantiene
- No hay problema de perder data local

---

## 🚀 ORDEN DE IMPLEMENTACIÓN FINAL

| Paso | Tarea                            | Archivo                           | Estimado |
| ---- | -------------------------------- | --------------------------------- | -------- |
| 1    | Configuración de límites         | `sync-limits.ts`                  | 15 min   |
| 2    | Queue Gate service               | `queue-gate.ts`                   | 30 min   |
| 3    | Incremental Sync service         | `incremental-sync.ts`             | 2h       |
| 4    | Hook useLoginSync                | `use-login-sync.ts`               | 30 min   |
| 5    | Componente LoginSyncGate         | `login-sync-gate/index.tsx`       | 30 min   |
| 6    | Integrar en authenticated layout | `app/(authenticated)/_layout.tsx` | 15 min   |
| 7    | Testing                          | -                                 | 1h       |

**Total estimado: ~5.5 horas**

---

## ✅ RESUMEN FINAL

### Flujo completo:

1. Usuario hace login
2. `useProtectedRoute` verifica auth y redirige a `/(authenticated)`
3. `LoginSyncGate` se activa:
   - **Queue Gate**: Verifica si hay queue pendiente de otro usuario → BLOQUEA si es así
   - **Detecta si es mismo usuario**: Compara con `user_preferences.user_id`
   - **Modo INCREMENTAL** (mismo user): Solo baja lo nuevo de Supabase
   - **Modo FULL RESET** (otro user): Borra todo local, baja todo de Supabase
4. Solo cuando sync termina → renderiza la app
5. `useSync()` se inicializa DESPUÉS del sync inicial

### Límites de datos:

- **Sin límite**: Rutinas, folders, métricas, targets, PRs actuales, preferencias
- **3 meses**: Tracker entries, macro entries, agregados diarios
- **6 meses**: Workout sessions, PR history

### Archivos a crear:

```
shared/sync/restore/sync-limits.ts
shared/sync/restore/queue-gate.ts
shared/sync/restore/incremental-sync.ts
shared/sync/hooks/use-login-sync.ts
shared/ui/login-sync-gate/index.tsx
```

### Archivo a modificar:

```
app/(authenticated)/_layout.tsx
```

---

**¿Listo para implementar? 🚀**

---

## 🧪 EDGE CASES ADICIONALES

### Edge Case 6: App crashea durante FULL RESET

```
Escenario:
- Usuario cambia de cuenta
- FULL RESET empieza a borrar tablas
- App crashea a mitad

Solución:
- Al reabrir, detectar estado inconsistente
- Completar el reset antes de continuar
- Flag: `sync_state.reset_in_progress = true`
```

### Edge Case 7: Supabase devuelve datos corruptos

```
Escenario:
- Query a Supabase exitosa
- Pero data tiene campos null que no deberían

Solución:
- Validación de schema antes de insertar
- Campos críticos: id, user_id, created_at
- Skip registro corrupto, continuar con los demás
- Log para debugging
```

### Edge Case 8: Reloj del dispositivo incorrecto

```
Escenario:
- Usuario tiene fecha/hora incorrecta
- `updated_at` comparisons fallan

Solución:
- Usar server time de Supabase para comparaciones
- O: basar límites en `created_at` del server, no del cliente
```

---

## 📊 MÉTRICAS A TRACKEAR

### En producción, medir:

```typescript
const SYNC_METRICS = {
  // Tiempos
  "sync.login.duration_ms": number, // Tiempo total de LoginSync
  "sync.table.duration_ms": number, // Tiempo por tabla
  "sync.queue.processing_time_ms": number, // Tiempo de upload queue

  // Conteos
  "sync.tables.total": number, // Tablas sincronizadas
  "sync.records.downloaded": number, // Registros bajados
  "sync.records.uploaded": number, // Registros subidos
  "sync.errors.count": number, // Errores totales

  // Estados
  "sync.mode": "incremental" | "full_reset", // Modo usado
  "sync.offline_skip": boolean, // Si se skipeó por offline
  "sync.blocked": boolean, // Si fue bloqueado por queue

  // Performance
  "sync.memory.peak_mb": number, // Pico de memoria
  "sync.network.bytes_downloaded": number, // Datos descargados
};
```

### Alertas sugeridas:

- `sync.login.duration_ms > 30000` → Login sync muy lento
- `sync.errors.count > 3` → Muchos errores de sync
- `sync.blocked = true` frecuente → Problema de UX

---

## 🔐 SEGURIDAD

### Validaciones importantes:

1. **Nunca confiar en user_id del payload**

   ```typescript
   // MAL: usar el user_id que viene del payload
   const userId = payload.user_id;

   // BIEN: usar el user_id de la sesión autenticada
   const userId = session.user.id;
   ```

2. **RLS en Supabase**

   - Todas las queries deben pasar por RLS
   - Un usuario solo puede ver/modificar SU data
   - El sync no debe poder acceder a data de otros

3. **Validar que los IDs existen antes de FK**
   ```typescript
   // Antes de insertar routine_blocks, verificar que routine existe
   const routineExists = await db
     .select()
     .from(routines)
     .where(eq(routines.id, block.routine_id));
   if (!routineExists.length) {
     throw new Error(`Routine ${block.routine_id} not found`);
   }
   ```

---

## 📱 UX CONSIDERATIONS

### Loading States:

```
┌─────────────────────────────────────┐
│                                     │
│            [LOGO APP]               │
│                                     │
│     "Preparando tu cuenta..."       │  ← Fase 1: Queue check
│                                     │
│     ░░░░░░░░░░░░░░░░░░  5%         │
│                                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│                                     │
│            [LOGO APP]               │
│                                     │
│     "Subiendo cambios locales..."   │  ← Fase 2: Upload queue
│                                     │
│     ████░░░░░░░░░░░░░░  20%        │
│                                     │
│     3 de 5 operaciones              │
│                                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│                                     │
│            [LOGO APP]               │
│                                     │
│     "Descargando tu información..." │  ← Fase 3: Download
│                                     │
│     ████████████░░░░░░  65%        │
│                                     │
│     📥 Sincronizando rutinas...     │
│     12 de 20 tablas                 │
│                                     │
└─────────────────────────────────────┘
```

### Mensaje de bloqueo (queue de otro usuario):

```
┌─────────────────────────────────────┐
│                                     │
│           ⚠️ Atención               │
│                                     │
│  Hay datos pendientes de sincro-    │
│  nizar de la cuenta anterior.       │
│                                     │
│  Por favor, asegúrate de tener      │
│  conexión a internet y espera       │
│  a que se complete la sincro-       │
│  nización antes de cambiar de       │
│  cuenta.                            │
│                                     │
│  ┌─────────────────────────────┐   │
│  │      Reintentar Sync        │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Cerrar sesión anterior    │   │  ← Opción para forzar
│  └─────────────────────────────┘   │     (con warning)
│                                     │
└─────────────────────────────────────┘
```

---

## ✅ CHECKLIST PRE-IMPLEMENTACIÓN

- [ ] Verificar que todas las tablas tienen `is_synced` column
- [ ] Verificar que todas las tablas tienen `updated_at` con trigger
- [ ] Verificar RLS policies en Supabase para todas las tablas
- [ ] Crear índices en Supabase: `(user_id, updated_at)` para cada tabla
- [ ] Verificar que el sync dictionary tiene todas las mutaciones
- [ ] Preparar rollback plan si algo sale mal

---

## 🚀 READY FOR IMPLEMENTATION

El plan está listo. Incluye:

- ✅ Arquitectura robusta con manejo de edge cases
- ✅ Paginación para tablas grandes
- ✅ Transacciones para operaciones críticas
- ✅ Retry logic con backoff
- ✅ Offline-first para mismo usuario
- ✅ Progress detallado para UX
- ✅ Métricas para monitoreo
- ✅ Validaciones de seguridad

**¿Comenzamos con la implementación?**
