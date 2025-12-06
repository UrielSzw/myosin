# Data Layer

Capa de abstracción para operaciones de datos con sincronización automática.

## Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                    Components                        │
│          dataService.routines.delete(id)            │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│                   DataService                        │
│  Singleton facade que expone todos los repositorios │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│                  Repositories                        │
│   SQLite (Drizzle) + Sync automático fire-and-forget│
└─────────┬───────────────────────────────┬───────────┘
          │                               │
┌─────────▼─────────┐         ┌──────────▼──────────┐
│      SQLite       │         │     SyncAdapter     │
│  (Local-first)    │         │   (Background)      │
└───────────────────┘         └─────────────────────┘
```

## Uso

```typescript
import { dataService } from "@/shared/data/data-service";

// Una sola llamada hace SQLite + Sync automáticamente
await dataService.routines.delete(routineId);

// El sync es fire-and-forget (no bloquea)
await dataService.tracker.createEntry({ ... });
```

## Repositorios Disponibles

| Repository        | Mutations | Descripción                      |
| ----------------- | --------- | -------------------------------- |
| `folders`         | 4         | CRUD de carpetas                 |
| `exercises`       | 0         | Solo lectura de ejercicios       |
| `userPreferences` | 2         | Preferencias del usuario         |
| `prs`             | 2         | Personal records                 |
| `routines`        | 7         | CRUD de rutinas                  |
| `workouts`        | 1         | Completar workouts               |
| `macros`          | 9         | Targets, entries, quick actions  |
| `tracker`         | 13        | Métricas, entries, quick actions |

## Patrón Local-First

1. **SQLite primero**: La operación en SQLite se completa inmediatamente
2. **Sync en background**: El sync a Supabase corre sin bloquear
3. **Manejo de offline**: Si no hay conexión, se encola para retry

```typescript
// Internamente, cada repositorio hace:
const result = await drizzleOperation(); // Bloquea
syncAdapter.sync("MUTATION_CODE", data); // Fire-and-forget
return result;
```

## Estructura de Archivos

```
shared/data/
├── data-service.ts          # Singleton facade
├── use-data-service.ts      # Hook para React Query
├── README.md
├── core/
│   ├── sync-adapter.ts      # Wrapper del sync engine
│   └── synced-repository.ts # Helper para crear repos
├── repositories/
│   ├── folders.repository.ts
│   ├── exercises.repository.ts
│   ├── user-preferences.repository.ts
│   ├── pr.repository.ts
│   ├── routines.repository.ts
│   ├── workouts.repository.ts
│   ├── macros.repository.ts
│   └── tracker.repository.ts
└── types/
    └── repository.types.ts  # Interfaces base
```

## Agregar Nuevo Repositorio

1. Crear archivo en `repositories/`
2. Implementar interfaz con métodos de lectura y escritura
3. Para escritura: SQLite + `syncAdapter.sync()` fire-and-forget
4. Exportar desde `data-service.ts`

## Notas Importantes

- **NO usar `await`** en llamadas a `syncAdapter.sync()` - debe ser fire-and-forget
- Los repositorios usan **transacciones Drizzle** para operaciones atómicas
- El `SyncAdapter` maneja automáticamente online/offline
