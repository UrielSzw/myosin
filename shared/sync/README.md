# Sync Engine con Queue y Circuit Breaker

Sistema completo de sincronización offline-first con queue persistente, exponential backoff y circuit breaker pattern.

## 🚀 Uso Básico

### Hook Principal - `useSync()`

```typescript
import { useSync } from "shared/sync/hooks";

function MyComponent() {
  const { sync, isOnline, scheduler } = useSync();

  const handleSaveData = async () => {
    const result = await sync("ROUTINE_CREATE", { name: "Mi rutina" });

    if (result.success) {
      console.log("✅ Synced successfully");
    } else if (result.queued) {
      console.log("📴 Queued for later sync");
    } else {
      console.log("❌ Sync failed:", result.error);
    }
  };

  return (
    <View>
      <Text>Status: {isOnline ? "🟢 Online" : "🔴 Offline"}</Text>
      <Text>Scheduler: {scheduler.isRunning ? "▶️ Running" : "⏸️ Paused"}</Text>
      <Button onPress={handleSaveData} title="Save Data" />
      <Button onPress={scheduler.processNow} title="Sync Now" />
    </View>
  );
}
```

## 📱 Hooks Disponibles

### `useSync()` - Completo

- ✅ Sync engine con queue
- ✅ Scheduler automático (cada 30s)
- ✅ Procesa en focus y reconexión
- ✅ Circuit breaker y backoff
- ✅ APIs de debugging

### `useSyncOnly()` - Solo engine

- ✅ Sync engine con queue
- ❌ Sin scheduler automático
- ✅ Circuit breaker y backoff

### `useSyncScheduler(config)` - Solo scheduler

- ✅ Scheduler configurable
- ✅ Procesa en focus/reconexión
- ✅ Control manual

## ⚙️ Configuración del Scheduler

```typescript
import { useSyncWithCustomScheduler } from "shared/sync/hooks";

function MyComponent() {
  const { sync, scheduler } = useSyncWithCustomScheduler({
    interval: 60000,              // 1 minuto
    processOnFocus: true,         // Procesar al enfocar
    processOnNetworkReconnect: true, // Procesar al reconectar
    name: "custom-scheduler"      // Nombre para logs
  });

  return (/* ... */);
}
```

## 🔧 Casos de Uso Específicos

### Solo procesar en focus

```typescript
import { useSyncOnFocus } from "shared/sync/hooks";

const { processNow } = useSyncOnFocus("my-screen");
```

### Solo procesar en reconexión

```typescript
import { useSyncOnNetworkReconnect } from "shared/sync/hooks";

const { processNow } = useSyncOnNetworkReconnect("network-recovery");
```

## 🐛 Debugging

```typescript
const { debug } = useSync();

// Ver métricas de la queue
const metrics = await debug.getQueueMetrics();
console.log("Queue metrics:", metrics);

// Ver tamaño de la queue
const size = await debug.getQueueSize();
console.log("Queue size:", size);

// Ver mutations disponibles
const mutations = debug.getAvailableMutations();
console.log("Available mutations:", mutations);
```

## 🔄 Cómo Funciona

### 1. **Online**: Sync directo

```
sync("ROUTINE_CREATE", data) → Supabase → ✅ Success
```

### 2. **Offline**: Queue para más tarde

```
sync("ROUTINE_CREATE", data) → SQLite Queue → 📴 Queued
```

### 3. **Reconexión**: Procesar queue

```
Network recovered → Process Queue → Retry con backoff
```

### 4. **Fallos**: Circuit Breaker

```
3+ fallos consecutivos → Backoff global → Pausa processing
```

### 5. **Exponential Backoff**

```
Retry 1: +1s
Retry 2: +2s
Retry 3: +4s
Retry 4: +8s
Retry 5: +16s
Manual: Usuario decide
```

## 📊 Estados del Circuit Breaker

- **🟢 Healthy**: Todo funciona normal
- **🟡 Degraded**: Algunos fallos, pero aún procesando
- **🔴 Failed**: Circuit breaker activado, backoff en curso

## 🛠️ Configuración Avanzada

El sistema usa configuración por defecto optimizada para móviles:

- **Max Retries**: 5 + retry manual
- **Base Delay**: 1 segundo
- **Max Delay**: 5 minutos
- **Jitter**: ±30% para evitar thundering herd
- **Network Recovery Reset**: 30 segundos offline = reset backoff

## 📝 Logs

El sistema produce logs detallados:

```
🔄 Attempting sync: ROUTINE_CREATE
📴 Offline - queueing mutation: ROUTINE_CREATE
📥 Queued mutation: ROUTINE_CREATE (id: abc123)
▶️ [main] Scheduler started - processing every 30s
🌐 Network reconnected - processing queue
✅ Synced: ROUTINE_CREATE
🔴 Circuit breaker engaged. Backing off until 2024-11-13T15:30:00Z
```

## 🎯 Mejores Prácticas

1. **Usa `useSync()` por defecto** - tiene todo incluido
2. **Usa `useSyncOnly()` en modals** - sin scheduler automático
3. **Maneja `result.queued`** - feedback al usuario sobre estado offline
4. **No hagas polling manual** - el scheduler se encarga
5. **Usa `processNow()` solo para acciones del usuario** - no automáticas

## 🔐 Seguridad

- Los payloads se serializan como JSON en SQLite
- No hay datos sensibles en logs (solo códigos de mutation)
- Queue se limpia automáticamente después de 7 días
- Circuit breaker previene hammering del backend
