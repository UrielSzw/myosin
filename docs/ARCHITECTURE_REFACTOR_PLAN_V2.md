# 🏗️ Plan de Refactorización de Arquitectura - Myosin v2.0

> **Visión**: Una arquitectura **local-first**, **clean**, **testeable** y **ultra-mantenible** donde cambiar el proveedor de datos (SQLite, Supabase, o cualquier otro) sea trivial.

---

## 🎯 Principios Arquitectónicos

### 1. Clean Architecture (Uncle Bob)

```
┌─────────────────────────────────────────────────────────────┐
│                        FRAMEWORKS                            │
│  React Native, Expo, React Query, Zustand                   │
├─────────────────────────────────────────────────────────────┤
│                    INTERFACE ADAPTERS                        │
│  UI Components, Hooks, Controllers, Presenters              │
├─────────────────────────────────────────────────────────────┤
│                      USE CASES                               │
│  Application Services, Business Logic Orchestration         │
├─────────────────────────────────────────────────────────────┤
│                       ENTITIES                               │
│  Domain Models, Business Rules, Validations                 │
└─────────────────────────────────────────────────────────────┘
            ↑ Dependencies ONLY point inward ↑
```

### 2. The Dependency Rule

> **"El código de las capas internas NO puede conocer NADA de las capas externas"**

- Domain NO importa nada de Application ni Infrastructure
- Application NO importa nada de UI ni Frameworks
- Solo las capas externas dependen de las internas

### 3. Ports & Adapters (Hexagonal Architecture)

- **Ports**: Interfaces que definen lo que la app NECESITA
- **Adapters**: Implementaciones concretas (SQLite, Supabase, Mock)
- Cambiar un adapter NO afecta el core de la aplicación

---

## 📁 Nueva Estructura de Carpetas

```
src/                            # (o directamente en raíz como ahora)
├── app/                        # [LAYER: FRAMEWORKS] - Expo Router
│   ├── _layout.tsx
│   ├── (authenticated)/
│   └── auth/
│
├── core/                       # [LAYER: DOMAIN + USE CASES] - Business Logic Puro
│   ├── domain/                 # Entities & Business Rules (sin deps externas)
│   │   ├── workout/
│   │   │   ├── entities.ts     # Workout, Set, Block, Exercise types
│   │   │   ├── rules.ts        # Reglas de negocio puras
│   │   │   └── validations.ts  # Zod schemas
│   │   ├── tracker/
│   │   │   ├── entities.ts
│   │   │   ├── rules.ts
│   │   │   └── validations.ts
│   │   ├── user/
│   │   └── shared/             # Shared kernel (tipos comunes)
│   │       ├── value-objects.ts  # UserId, DateTimeString, etc.
│   │       └── errors.ts         # Domain errors
│   │
│   ├── ports/                  # Interfaces que definen contratos
│   │   ├── repositories/       # Data access interfaces
│   │   │   ├── routine-repository.port.ts
│   │   │   ├── workout-session-repository.port.ts
│   │   │   ├── tracker-repository.port.ts
│   │   │   ├── exercise-repository.port.ts
│   │   │   ├── pr-repository.port.ts
│   │   │   └── user-repository.port.ts
│   │   ├── services/           # External services interfaces
│   │   │   ├── sync-service.port.ts
│   │   │   ├── auth-service.port.ts
│   │   │   ├── haptic-service.port.ts
│   │   │   └── analytics-service.port.ts
│   │   └── index.ts            # Re-exports
│   │
│   └── use-cases/              # Application Business Logic
│       ├── workout/
│       │   ├── start-workout.ts
│       │   ├── complete-set.ts
│       │   ├── finish-workout.ts
│       │   └── calculate-pr.ts
│       ├── tracker/
│       │   ├── create-entry.ts
│       │   ├── update-entry.ts
│       │   └── get-daily-progress.ts
│       ├── routine/
│       │   ├── create-routine.ts
│       │   ├── update-routine.ts
│       │   └── delete-routine.ts
│       └── index.ts
│
├── infrastructure/             # [LAYER: ADAPTERS] - Implementaciones concretas
│   ├── database/               # SQLite adapter
│   │   ├── client.ts           # Drizzle client
│   │   ├── schema/             # DB schemas
│   │   ├── migrations/
│   │   └── repositories/       # Implementaciones de los ports
│   │       ├── sqlite-routine-repository.ts
│   │       ├── sqlite-workout-session-repository.ts
│   │       ├── sqlite-tracker-repository.ts
│   │       └── sqlite-pr-repository.ts
│   │
│   ├── sync/                   # Sync engine adapter
│   │   ├── sync-engine.ts
│   │   ├── queue/
│   │   ├── supabase/           # Supabase-specific sync
│   │   │   ├── supabase-sync-adapter.ts
│   │   │   └── supabase-repositories/
│   │   └── dictionary/
│   │
│   ├── services/               # External services adapters
│   │   ├── supabase-auth-adapter.ts
│   │   ├── expo-haptic-adapter.ts
│   │   └── console-analytics-adapter.ts
│   │
│   └── di/                     # Dependency Injection Container
│       ├── container.ts        # Wiring de dependencias
│       └── providers.tsx       # React context providers
│
├── features/                   # [LAYER: INTERFACE ADAPTERS] - Feature Slices
│   ├── active-workout/
│   │   ├── index.tsx           # Screen principal
│   │   ├── components/
│   │   │   ├── ActiveSetRow/
│   │   │   ├── CircuitTimer/
│   │   │   └── TempoMetronome/
│   │   ├── hooks/
│   │   │   ├── use-active-workout.ts
│   │   │   └── store/          # Zustand store (si necesita)
│   │   └── utils/
│   │
│   ├── tracker/
│   │   ├── index.tsx
│   │   ├── components/
│   │   │   ├── MetricModal/
│   │   │   └── MetricCard/
│   │   ├── hooks/
│   │   └── service/            # Feature service (usa use-cases)
│   │
│   ├── routine-form/
│   ├── workouts/
│   ├── profile/
│   └── onboarding/
│
├── shared/                     # [LAYER: SHARED] - Código compartido
│   ├── ui/                     # Design system components
│   │   ├── button/
│   │   ├── typography/
│   │   ├── input/
│   │   └── sheets/
│   ├── hooks/                  # Hooks genéricos
│   │   ├── use-debounce.ts
│   │   └── use-keyboard.ts
│   ├── utils/                  # Pure utilities
│   │   ├── date.ts
│   │   ├── format.ts
│   │   └── validation.ts
│   ├── constants/
│   ├── translations/
│   └── types/                  # Shared types (no domain)
│
└── lib/                        # Third-party integrations
    ├── react-query/
    │   ├── query-client.ts
    │   └── query-keys.ts
    └── logger/
        └── logger.ts
```

---

## 🔑 Patrones Clave

### Pattern 1: Repository Port (Interface)

**Archivo**: `core/ports/repositories/routine-repository.port.ts`

```typescript
import type {
  Routine,
  RoutineWithMetrics,
  CreateRoutineData,
} from "@/core/domain/workout/entities";

/**
 * Port: Define WHAT the app needs, not HOW it's implemented.
 * This interface is the contract that any repository must fulfill.
 */
export interface IRoutineRepository {
  // Queries
  findAll(
    userId: string,
    folderId?: string | null
  ): Promise<RoutineWithMetrics[]>;
  findById(id: string): Promise<Routine | null>;
  findByIdWithDetails(id: string): Promise<RoutineWithDetails | null>;

  // Commands
  create(data: CreateRoutineData): Promise<Routine>;
  update(id: string, data: Partial<Routine>): Promise<Routine>;
  delete(id: string): Promise<void>;
  softDelete(id: string): Promise<void>;
  restore(id: string): Promise<void>;

  // Bulk operations
  moveToFolder(routineIds: string[], folderId: string | null): Promise<void>;
  duplicate(id: string, newName: string): Promise<Routine>;
}
```

### Pattern 2: SQLite Adapter (Implementation)

**Archivo**: `infrastructure/database/repositories/sqlite-routine-repository.ts`

```typescript
import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "../client";
import {
  routines,
  routine_blocks,
  exercise_in_block,
  routine_sets,
} from "../schema";
import type { IRoutineRepository } from "@/core/ports/repositories/routine-repository.port";
import type {
  Routine,
  RoutineWithMetrics,
  CreateRoutineData,
} from "@/core/domain/workout/entities";

/**
 * Adapter: Implements the port using SQLite/Drizzle.
 * This can be swapped for any other implementation.
 */
export class SQLiteRoutineRepository implements IRoutineRepository {
  async findAll(
    userId: string,
    folderId?: string | null
  ): Promise<RoutineWithMetrics[]> {
    const rows = await db
      .select({
        id: routines.id,
        name: routines.name,
        created_at: routines.created_at,
        updated_at: routines.updated_at,
        blocksCount: sql<number>`COUNT(DISTINCT ${routine_blocks.id})`,
        exercisesCount: sql<number>`COUNT(${exercise_in_block.id})`,
        folder_id: routines.folder_id,
        training_days: routines.training_days,
      })
      .from(routines)
      .leftJoin(routine_blocks, eq(routine_blocks.routine_id, routines.id))
      .leftJoin(
        exercise_in_block,
        eq(exercise_in_block.block_id, routine_blocks.id)
      )
      .where(
        and(
          eq(routines.user_id, userId),
          isNull(routines.deleted_at),
          eq(routines.is_quick_workout, false),
          folderId
            ? eq(routines.folder_id, folderId)
            : isNull(routines.folder_id)
        )
      )
      .groupBy(routines.id);

    return rows.map(this.mapToRoutineWithMetrics);
  }

  async create(data: CreateRoutineData): Promise<Routine> {
    return await db.transaction(async (tx) => {
      const [routine] = await tx
        .insert(routines)
        .values(data.routine)
        .returning();

      if (data.blocks.length > 0) {
        await tx
          .insert(routine_blocks)
          .values(data.blocks.map((b) => ({ ...b, routine_id: routine.id })));
      }
      // ... rest of creation logic

      return routine;
    });
  }

  // ... other methods

  private mapToRoutineWithMetrics(row: any): RoutineWithMetrics {
    return {
      ...row,
      blocksCount: Number(row.blocksCount || 0),
      exercisesCount: Number(row.exercisesCount || 0),
    };
  }
}
```

### Pattern 3: Use Case (Application Service)

**Archivo**: `core/use-cases/routine/create-routine.ts`

```typescript
import type { IRoutineRepository } from "@/core/ports/repositories/routine-repository.port";
import type { ISyncService } from "@/core/ports/services/sync-service.port";
import { validateRoutine } from "@/core/domain/workout/validations";
import { RoutineRules } from "@/core/domain/workout/rules";
import type {
  CreateRoutineInput,
  Routine,
} from "@/core/domain/workout/entities";

/**
 * Use Case: Pure business logic orchestration.
 * Depends ONLY on ports (interfaces), not implementations.
 */
export class CreateRoutineUseCase {
  constructor(
    private readonly routineRepo: IRoutineRepository,
    private readonly syncService: ISyncService
  ) {}

  async execute(input: CreateRoutineInput, userId: string): Promise<Routine> {
    // 1. Validate input
    const validatedData = validateRoutine(input);

    // 2. Apply domain rules
    const routineData = RoutineRules.prepareForCreation(validatedData, userId);

    // 3. Persist locally (local-first)
    const routine = await this.routineRepo.create(routineData);

    // 4. Queue for sync (fire & forget)
    await this.syncService.queueSync("ROUTINE_CREATE", {
      routine: routine,
      blocks: routineData.blocks,
      exercises: routineData.exercises,
      sets: routineData.sets,
    });

    return routine;
  }
}
```

### Pattern 4: Dependency Injection Container

**Archivo**: `infrastructure/di/container.ts`

```typescript
import { SQLiteRoutineRepository } from "../database/repositories/sqlite-routine-repository";
import { SQLiteWorkoutSessionRepository } from "../database/repositories/sqlite-workout-session-repository";
import { SQLiteTrackerRepository } from "../database/repositories/sqlite-tracker-repository";
import { SQLitePRRepository } from "../database/repositories/sqlite-pr-repository";
import { SyncEngine } from "../sync/sync-engine";
import { SupabaseAuthAdapter } from "../services/supabase-auth-adapter";
import { ExpoHapticAdapter } from "../services/expo-haptic-adapter";

// Use Cases
import { CreateRoutineUseCase } from "@/core/use-cases/routine/create-routine";
import { StartWorkoutUseCase } from "@/core/use-cases/workout/start-workout";
import { CompleteSetUseCase } from "@/core/use-cases/workout/complete-set";
import { CreateTrackerEntryUseCase } from "@/core/use-cases/tracker/create-entry";

/**
 * Dependency Injection Container
 *
 * This is the ONLY place where concrete implementations are wired.
 * The rest of the app only knows about interfaces.
 */
class DIContainer {
  // Repositories (Singletons)
  private _routineRepository?: SQLiteRoutineRepository;
  private _workoutSessionRepository?: SQLiteWorkoutSessionRepository;
  private _trackerRepository?: SQLiteTrackerRepository;
  private _prRepository?: SQLitePRRepository;

  // Services
  private _syncService?: SyncEngine;
  private _authService?: SupabaseAuthAdapter;
  private _hapticService?: ExpoHapticAdapter;

  // --- Repositories ---
  get routineRepository() {
    if (!this._routineRepository) {
      this._routineRepository = new SQLiteRoutineRepository();
    }
    return this._routineRepository;
  }

  get workoutSessionRepository() {
    if (!this._workoutSessionRepository) {
      this._workoutSessionRepository = new SQLiteWorkoutSessionRepository();
    }
    return this._workoutSessionRepository;
  }

  get trackerRepository() {
    if (!this._trackerRepository) {
      this._trackerRepository = new SQLiteTrackerRepository();
    }
    return this._trackerRepository;
  }

  // --- Services ---
  get syncService() {
    if (!this._syncService) {
      this._syncService = new SyncEngine();
    }
    return this._syncService;
  }

  get authService() {
    if (!this._authService) {
      this._authService = new SupabaseAuthAdapter();
    }
    return this._authService;
  }

  get hapticService() {
    if (!this._hapticService) {
      this._hapticService = new ExpoHapticAdapter();
    }
    return this._hapticService;
  }

  // --- Use Cases (Factory methods) ---
  createRoutineUseCase() {
    return new CreateRoutineUseCase(this.routineRepository, this.syncService);
  }

  startWorkoutUseCase() {
    return new StartWorkoutUseCase(
      this.routineRepository,
      this.workoutSessionRepository,
      this.syncService
    );
  }

  completeSetUseCase() {
    return new CompleteSetUseCase(
      this.workoutSessionRepository,
      this.prRepository,
      this.hapticService,
      this.syncService
    );
  }

  createTrackerEntryUseCase() {
    return new CreateTrackerEntryUseCase(
      this.trackerRepository,
      this.syncService
    );
  }
}

// Singleton export
export const container = new DIContainer();

// For testing: allow injection of mocks
export const createTestContainer = (overrides: Partial<DIContainer>) => {
  return { ...container, ...overrides };
};
```

### Pattern 5: React Hook that uses Use Cases

**Archivo**: `features/routine-form/hooks/use-create-routine.ts`

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { container } from "@/infrastructure/di/container";
import { queryKeys } from "@/lib/react-query/query-keys";
import type { CreateRoutineInput } from "@/core/domain/workout/entities";
import { useAuth } from "@/shared/hooks/use-auth";

/**
 * Hook: Connects React world with Use Cases.
 * UI components use this hook, they never access repositories directly.
 */
export const useCreateRoutine = () => {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  // Get use case from container (could also use React Context for better testability)
  const createRoutineUseCase = container.createRoutineUseCase();

  return useMutation({
    mutationFn: async (input: CreateRoutineInput) => {
      if (!userId) throw new Error("User not authenticated");
      return createRoutineUseCase.execute(input, userId);
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.workouts.routines.all(),
      });
    },
    onError: (error) => {
      // Log error, show toast, etc.
      console.error("Failed to create routine:", error);
    },
  });
};
```

---

## 🔄 Sync Engine Architecture

### Design: Local-First with Background Sync

```
┌──────────────────────────────────────────────────────────────────┐
│                         USER ACTION                               │
│                    (e.g., complete set)                          │
└───────────────────────────┬──────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                        USE CASE                                   │
│              1. Validate & apply business rules                   │
│              2. Write to LOCAL SQLite (immediate)                │
│              3. Queue sync mutation (fire & forget)              │
└───────────────────────────┬──────────────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
┌──────────────────────┐      ┌───────────────────────────┐
│   LOCAL SQLITE       │      │      SYNC QUEUE           │
│   (Source of Truth)  │      │  (Persistent, ordered)    │
│                      │      │                           │
│  - Instant response  │      │  - Stored in SQLite       │
│  - Always available  │      │  - Retried with backoff   │
│  - UI reads from     │      │  - Circuit breaker        │
│    here              │      │                           │
└──────────────────────┘      └─────────────┬─────────────┘
                                            │
                                            ▼ (when online)
                              ┌───────────────────────────┐
                              │     SYNC ENGINE           │
                              │                           │
                              │  - Process queue FIFO     │
                              │  - Retry failed items     │
                              │  - Exponential backoff    │
                              │  - Circuit breaker        │
                              └─────────────┬─────────────┘
                                            │
                                            ▼
                              ┌───────────────────────────┐
                              │      SUPABASE             │
                              │   (Cloud backup/sync)     │
                              │                           │
                              │  - Source of truth for    │
                              │    multi-device sync      │
                              │  - RPC functions          │
                              └───────────────────────────┘
```

### Sync Service Port

**Archivo**: `core/ports/services/sync-service.port.ts`

```typescript
import type {
  MutationCode,
  MutationPayloadMap,
} from "@/infrastructure/sync/types";

export interface ISyncService {
  /**
   * Queue a mutation for sync. Returns immediately.
   * The sync will happen in background when online.
   */
  queueSync<T extends MutationCode>(
    code: T,
    payload: MutationPayloadMap[T]
  ): Promise<{ queued: boolean; queueId?: string }>;

  /**
   * Try to sync immediately (for critical operations).
   * Falls back to queue if offline.
   */
  syncNow<T extends MutationCode>(
    code: T,
    payload: MutationPayloadMap[T]
  ): Promise<{ success: boolean; error?: string }>;

  /**
   * Process pending queue items.
   * Called by scheduler, not directly by app code.
   */
  processQueue(): Promise<{ processed: number; failed: number }>;

  /**
   * Get current sync status for UI.
   */
  getStatus(): {
    isOnline: boolean;
    pendingCount: number;
    lastSyncAt: Date | null;
    isProcessing: boolean;
  };
}
```

---

## 🧪 Testabilidad

### Beneficios de esta arquitectura:

1. **Domain Layer**: Funciones puras, test unitarios triviales
2. **Use Cases**: Inject mocks para repositories y services
3. **Adapters**: Test de integración aislados
4. **UI**: Snapshot tests + interaction tests

### Ejemplo: Testing Use Case

```typescript
// __tests__/use-cases/create-routine.test.ts
import { CreateRoutineUseCase } from "@/core/use-cases/routine/create-routine";
import type { IRoutineRepository } from "@/core/ports/repositories/routine-repository.port";
import type { ISyncService } from "@/core/ports/services/sync-service.port";

describe("CreateRoutineUseCase", () => {
  let useCase: CreateRoutineUseCase;
  let mockRoutineRepo: jest.Mocked<IRoutineRepository>;
  let mockSyncService: jest.Mocked<ISyncService>;

  beforeEach(() => {
    mockRoutineRepo = {
      create: jest.fn(),
      findAll: jest.fn(),
      // ... other methods
    };

    mockSyncService = {
      queueSync: jest.fn().mockResolvedValue({ queued: true }),
      // ... other methods
    };

    useCase = new CreateRoutineUseCase(mockRoutineRepo, mockSyncService);
  });

  it("should create routine and queue sync", async () => {
    const input = {
      name: "Test Routine",
      blocks: [{ name: "Block 1", exercises: [] }],
    };

    const expectedRoutine = { id: "123", name: "Test Routine" };
    mockRoutineRepo.create.mockResolvedValue(expectedRoutine);

    const result = await useCase.execute(input, "user-123");

    expect(result).toEqual(expectedRoutine);
    expect(mockRoutineRepo.create).toHaveBeenCalledTimes(1);
    expect(mockSyncService.queueSync).toHaveBeenCalledWith(
      "ROUTINE_CREATE",
      expect.any(Object)
    );
  });

  it("should throw on invalid input", async () => {
    const input = { name: "", blocks: [] }; // Invalid: empty name

    await expect(useCase.execute(input, "user-123")).rejects.toThrow(
      "Validation failed"
    );
  });
});
```

---

## 📋 Plan de Migración

### Fase 0: Preparación (1 día)

- [ ] Crear estructura de carpetas nueva (`core/`, `infrastructure/`)
- [ ] NO mover código todavía, solo estructura

### Fase 1: Domain Layer (2-3 días)

- [ ] Definir entities en `core/domain/workout/entities.ts`
- [ ] Definir Zod schemas en `core/domain/workout/validations.ts`
- [ ] Definir business rules puras en `core/domain/workout/rules.ts`
- [ ] Repetir para tracker, user, etc.

### Fase 2: Ports (1-2 días)

- [ ] Crear interfaces de repositories en `core/ports/repositories/`
- [ ] Crear interfaces de services en `core/ports/services/`
- [ ] Tipos están limpios, sin deps de implementación

### Fase 3: Adapters - Repositories (3-4 días)

- [ ] Migrar `routinesRepository` → `SQLiteRoutineRepository`
- [ ] Migrar `workoutSessionsRepository` → `SQLiteWorkoutSessionRepository`
- [ ] Migrar `trackerRepository` → `SQLiteTrackerRepository`
- [ ] Implementar interfaces del Fase 2

### Fase 4: Adapters - Services (2-3 días)

- [ ] Crear `SupabaseAuthAdapter`
- [ ] Crear `ExpoHapticAdapter`
- [ ] Refactorizar sync engine para implementar `ISyncService`

### Fase 5: Use Cases (3-4 días)

- [ ] Crear use cases para workout (start, complete, finish)
- [ ] Crear use cases para routine (create, update, delete)
- [ ] Crear use cases para tracker (create entry, update, etc.)
- [ ] Los use cases usan SOLO ports, no implementaciones

### Fase 6: DI Container (1-2 días)

- [ ] Crear `container.ts` con wiring
- [ ] Crear React providers para DI

### Fase 7: Migrar Features (progresivo)

- [ ] Actualizar hooks para usar use cases vía container
- [ ] Feature por feature, no big bang
- [ ] Tests en cada paso

### Fase 8: Cleanup (2-3 días)

- [ ] Eliminar código viejo
- [ ] Actualizar imports
- [ ] Documentación final

---

## 🆚 Comparación: Antes vs Después

### Antes (Actual)

```typescript
// Feature accede directamente al repository
import { routinesRepository } from "@/shared/db/repository/routines";

const createRoutine = async (data) => {
  const routine = await routinesRepository.createRoutineWithData(data);
  await sync("ROUTINE_CREATE", routine);
  return routine;
};
```

**Problemas**:

- Feature acoplado a implementación SQLite
- Difícil de testear (necesita DB real o mock complejo)
- Si cambiamos a otro storage, hay que cambiar todos los imports

### Después (Nueva Arquitectura)

```typescript
// Feature usa use case que depende de interfaz
const createRoutineUseCase = container.createRoutineUseCase();

const createRoutine = async (data, userId) => {
  return createRoutineUseCase.execute(data, userId);
};
```

**Beneficios**:

- Feature desacoplado de implementación
- Use case fácil de testear con mocks
- Cambiar storage = cambiar solo el adapter en container
- Business logic centralizada y reutilizable

---

## ⏱️ Estimación Total

| Fase      | Descripción         | Tiempo         |
| --------- | ------------------- | -------------- |
| 0         | Preparación         | 1 día          |
| 1         | Domain Layer        | 2-3 días       |
| 2         | Ports               | 1-2 días       |
| 3         | Adapters - Repos    | 3-4 días       |
| 4         | Adapters - Services | 2-3 días       |
| 5         | Use Cases           | 3-4 días       |
| 6         | DI Container        | 1-2 días       |
| 7         | Migrar Features     | 5-7 días       |
| 8         | Cleanup             | 2-3 días       |
| **Total** |                     | **20-29 días** |

---

## 💡 Decisiones Clave

### ¿Por qué NO usar inversify o tsyringe?

- Añaden complejidad innecesaria para este tamaño de app
- React tiene su propio sistema de DI (Context)
- El container manual es más explícito y fácil de debuggear

### ¿Por qué mantener Zustand para algunos stores?

- Zustand es excelente para UI state (timers, modals, forms)
- Use cases son para business logic, no UI state
- El patrón: Use cases para data, Zustand para UI

### ¿Qué pasa con React Query?

- React Query sigue siendo el cache layer
- Los hooks usan `useQuery` con funciones que llaman use cases
- QueryKeys se mantienen para invalidation

### ¿Es over-engineering?

- Para apps pequeñas: sí
- Para Myosin con sync engine complejo: NO
- El ROI viene al cambiar providers o añadir tests

---

## 🎯 Quick Wins Inmediatos

Si no querés hacer la migración completa, estos cambios dan valor rápido:

1. **Crear `core/ports/`** con interfaces (1 día)

   - Define lo que necesitás, aunque no lo implementes todo

2. **Crear `core/domain/*/validations.ts`** (1 día)

   - Zod schemas centralizados

3. **Extraer business logic a funciones puras** (2 días)

   - De los stores gigantes a `core/domain/*/rules.ts`

4. **Crear DI container básico** (1 día)
   - Incluso sin usar use cases, centraliza instanciación

---

> **"The goal is not to add more code, but to add structure that makes future changes easy."**

---

## 📚 Archivos Ejemplo Completos

### Domain Entities

**Archivo**: `core/domain/workout/entities.ts`

```typescript
/**
 * Domain Entities - Pure TypeScript types
 * No dependencies on frameworks or implementation details
 */

// ============= Value Objects (Branded Types) =============

/** Ensures type safety for IDs */
export type UserId = string & { readonly brand: unique symbol };
export type RoutineId = string & { readonly brand: unique symbol };
export type BlockId = string & { readonly brand: unique symbol };
export type ExerciseId = string & { readonly brand: unique symbol };
export type SetId = string & { readonly brand: unique symbol };
export type SessionId = string & { readonly brand: unique symbol };

/** ISO date string */
export type DateTimeString = string & { readonly brand: unique symbol };

/** Weight in the user's preferred unit */
export type Weight = number & { readonly brand: unique symbol };

/** Duration in seconds */
export type DurationSeconds = number & { readonly brand: unique symbol };

// ============= Enums =============

export const SetType = {
  NORMAL: "normal",
  WARMUP: "warmup",
  DROP: "drop",
  FAILURE: "failure",
} as const;
export type SetType = (typeof SetType)[keyof typeof SetType];

export const BlockType = {
  NORMAL: "normal",
  SUPERSET: "superset",
  CIRCUIT: "circuit",
} as const;
export type BlockType = (typeof BlockType)[keyof typeof BlockType];

export const PRType = {
  WEIGHT: "weight",
  REPS: "reps",
  VOLUME: "volume",
  E1RM: "e1rm",
} as const;
export type PRType = (typeof PRType)[keyof typeof PRType];

// ============= Core Entities =============

export interface Set {
  id: SetId;
  exercise_id: ExerciseId;
  order: number;
  type: SetType;
  target_reps: number | null;
  target_weight: Weight | null;
  target_rpe: number | null;
  target_duration: DurationSeconds | null;
}

export interface CompletedSet extends Set {
  actual_reps: number;
  actual_weight: Weight;
  actual_rpe: number | null;
  completed_at: DateTimeString;
  is_pr: boolean;
  pr_types: PRType[];
}

export interface ExerciseInBlock {
  id: ExerciseId;
  block_id: BlockId;
  exercise_id: string; // Reference to exercise catalog
  order: number;
  rest_seconds: DurationSeconds | null;
  notes: string | null;
  sets: Set[];
}

export interface Block {
  id: BlockId;
  routine_id: RoutineId;
  name: string;
  order: number;
  type: BlockType;
  exercises: ExerciseInBlock[];
}

export interface Routine {
  id: RoutineId;
  user_id: UserId;
  name: string;
  folder_id: string | null;
  training_days: number[] | null;
  created_at: DateTimeString;
  updated_at: DateTimeString;
  deleted_at: DateTimeString | null;
}

export interface RoutineWithDetails extends Routine {
  blocks: Block[];
}

export interface RoutineWithMetrics extends Routine {
  blocksCount: number;
  exercisesCount: number;
}

// ============= Workout Session =============

export interface WorkoutSession {
  id: SessionId;
  user_id: UserId;
  routine_id: RoutineId | null;
  started_at: DateTimeString;
  finished_at: DateTimeString | null;
  notes: string | null;
}

export interface WorkoutSessionWithDetails extends WorkoutSession {
  blocks: BlockWithCompletedSets[];
  stats: SessionStats;
}

export interface BlockWithCompletedSets {
  id: BlockId;
  name: string;
  order: number;
  type: BlockType;
  exercises: ExerciseWithCompletedSets[];
}

export interface ExerciseWithCompletedSets {
  id: ExerciseId;
  exercise_id: string;
  exercise_name: string;
  order: number;
  sets: CompletedSet[];
}

export interface SessionStats {
  duration_seconds: DurationSeconds;
  total_sets: number;
  total_volume: number;
  prs_count: number;
}

// ============= Input Types (for creation/update) =============

export interface CreateRoutineInput {
  name: string;
  folder_id?: string | null;
  training_days?: number[] | null;
  blocks: CreateBlockInput[];
}

export interface CreateBlockInput {
  name: string;
  type: BlockType;
  exercises: CreateExerciseInput[];
}

export interface CreateExerciseInput {
  exercise_id: string;
  rest_seconds?: number;
  notes?: string;
  sets: CreateSetInput[];
}

export interface CreateSetInput {
  type: SetType;
  target_reps?: number;
  target_weight?: number;
  target_rpe?: number;
  target_duration?: number;
}
```

---

### Domain Rules

**Archivo**: `core/domain/workout/rules.ts`

```typescript
/**
 * Domain Rules - Pure business logic functions
 * NO side effects, NO external dependencies
 */

import type {
  CompletedSet,
  Weight,
  PRType,
  SetType,
  CreateRoutineInput,
  Block,
  Set,
} from "./entities";

/**
 * Calculate estimated 1RM using Brzycki formula
 */
export function calculateE1RM(weight: number, reps: number): number {
  if (reps <= 0 || weight <= 0) return 0;
  if (reps === 1) return weight;

  // Brzycki formula: 1RM = weight × (36 / (37 - reps))
  // Capped at 12 reps for accuracy
  const effectiveReps = Math.min(reps, 12);
  return weight * (36 / (37 - effectiveReps));
}

/**
 * Calculate total volume for a set
 */
export function calculateSetVolume(weight: number, reps: number): number {
  return weight * reps;
}

/**
 * Calculate total volume for multiple sets
 */
export function calculateTotalVolume(sets: CompletedSet[]): number {
  return sets.reduce((total, set) => {
    return total + calculateSetVolume(set.actual_weight, set.actual_reps);
  }, 0);
}

/**
 * Determine if a set beats a previous PR
 */
export function determinePRTypes(
  newSet: { weight: number; reps: number },
  previousBest: {
    maxWeight: number;
    maxReps: number;
    maxVolume: number;
    maxE1RM: number;
  }
): PRType[] {
  const prs: PRType[] = [];

  const e1rm = calculateE1RM(newSet.weight, newSet.reps);
  const volume = calculateSetVolume(newSet.weight, newSet.reps);

  if (newSet.weight > previousBest.maxWeight) {
    prs.push("weight");
  }
  if (newSet.reps > previousBest.maxReps) {
    prs.push("reps");
  }
  if (volume > previousBest.maxVolume) {
    prs.push("volume");
  }
  if (e1rm > previousBest.maxE1RM) {
    prs.push("e1rm");
  }

  return prs;
}

/**
 * Get effective target value for a set (considering previous set or defaults)
 */
export function getEffectiveTargetWeight(
  set: Set,
  previousSetWeight: number | null,
  exerciseDefault: number | null
): number {
  return set.target_weight ?? previousSetWeight ?? exerciseDefault ?? 0;
}

export function getEffectiveTargetReps(
  set: Set,
  previousSetReps: number | null,
  exerciseDefault: number | null
): number {
  return set.target_reps ?? previousSetReps ?? exerciseDefault ?? 10;
}

/**
 * Validate routine structure
 */
export function validateRoutineStructure(input: CreateRoutineInput): string[] {
  const errors: string[] = [];

  if (!input.name || input.name.trim().length === 0) {
    errors.push("Routine name is required");
  }

  if (input.name && input.name.length > 100) {
    errors.push("Routine name must be less than 100 characters");
  }

  if (!input.blocks || input.blocks.length === 0) {
    errors.push("Routine must have at least one block");
  }

  input.blocks?.forEach((block, blockIndex) => {
    if (!block.name || block.name.trim().length === 0) {
      errors.push(`Block ${blockIndex + 1} must have a name`);
    }

    if (!block.exercises || block.exercises.length === 0) {
      errors.push(`Block "${block.name}" must have at least one exercise`);
    }

    block.exercises?.forEach((exercise, exIndex) => {
      if (!exercise.sets || exercise.sets.length === 0) {
        errors.push(
          `Exercise ${exIndex + 1} in block "${
            block.name
          }" must have at least one set`
        );
      }
    });
  });

  return errors;
}

/**
 * Calculate workout duration
 */
export function calculateWorkoutDuration(
  startedAt: string,
  finishedAt: string | null
): number {
  const start = new Date(startedAt).getTime();
  const end = finishedAt ? new Date(finishedAt).getTime() : Date.now();
  return Math.floor((end - start) / 1000);
}

/**
 * Format duration as HH:MM:SS
 */
export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Determine if a set type counts towards volume
 */
export function isWorkingSet(type: SetType): boolean {
  return type === "normal" || type === "drop" || type === "failure";
}

/**
 * Count working sets in blocks
 */
export function countWorkingSets(blocks: Block[]): number {
  return blocks.reduce((total, block) => {
    return (
      total +
      block.exercises.reduce((exTotal, exercise) => {
        return (
          exTotal + exercise.sets.filter((s) => isWorkingSet(s.type)).length
        );
      }, 0)
    );
  }, 0);
}
```

---

### Domain Validations (Zod)

**Archivo**: `core/domain/workout/validations.ts`

```typescript
import { z } from "zod";

// ============= Base Schemas =============

export const setTypeSchema = z.enum(["normal", "warmup", "drop", "failure"]);
export const blockTypeSchema = z.enum(["normal", "superset", "circuit"]);
export const prTypeSchema = z.enum(["weight", "reps", "volume", "e1rm"]);

// ============= Set Schemas =============

export const createSetSchema = z.object({
  type: setTypeSchema.default("normal"),
  target_reps: z.number().int().positive().max(999).nullable().optional(),
  target_weight: z.number().positive().max(9999).nullable().optional(),
  target_rpe: z.number().min(1).max(10).nullable().optional(),
  target_duration: z.number().int().positive().max(86400).nullable().optional(),
});

export const completeSetSchema = z.object({
  actual_reps: z.number().int().positive().max(999),
  actual_weight: z.number().nonnegative().max(9999),
  actual_rpe: z.number().min(1).max(10).nullable().optional(),
});

// ============= Exercise Schemas =============

export const createExerciseSchema = z.object({
  exercise_id: z.string().uuid(),
  rest_seconds: z.number().int().positive().max(3600).optional(),
  notes: z.string().max(500).optional(),
  sets: z.array(createSetSchema).min(1).max(50),
});

// ============= Block Schemas =============

export const createBlockSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  type: blockTypeSchema.default("normal"),
  exercises: z.array(createExerciseSchema).min(1).max(30),
});

// ============= Routine Schemas =============

export const createRoutineSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  folder_id: z.string().uuid().nullable().optional(),
  training_days: z.array(z.number().int().min(0).max(6)).nullable().optional(),
  blocks: z.array(createBlockSchema).min(1).max(20),
});

export const updateRoutineSchema = createRoutineSchema.partial();

// ============= Type Exports =============

export type CreateSetInput = z.infer<typeof createSetSchema>;
export type CompleteSetInput = z.infer<typeof completeSetSchema>;
export type CreateExerciseInput = z.infer<typeof createExerciseSchema>;
export type CreateBlockInput = z.infer<typeof createBlockSchema>;
export type CreateRoutineInput = z.infer<typeof createRoutineSchema>;

// ============= Validation Helpers =============

export function validateCreateRoutine(data: unknown): CreateRoutineInput {
  return createRoutineSchema.parse(data);
}

export function validateCompleteSet(data: unknown): CompleteSetInput {
  return completeSetSchema.parse(data);
}

export function safeValidateCreateRoutine(
  data: unknown
):
  | { success: true; data: CreateRoutineInput }
  | { success: false; errors: string[] } {
  const result = createRoutineSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.errors.map(
    (e) => `${e.path.join(".")}: ${e.message}`
  );

  return { success: false, errors };
}
```

---

### Sync Service Port

**Archivo**: `core/ports/services/sync-service.port.ts`

```typescript
/**
 * Sync Service Port
 *
 * Defines the interface for sync operations.
 * The app core NEVER knows about Supabase, only this interface.
 */

// These types should match your mutation codes
export type SyncMutationCode =
  | "ROUTINE_CREATE"
  | "ROUTINE_UPDATE"
  | "ROUTINE_DELETE"
  | "SESSION_START"
  | "SESSION_UPDATE"
  | "SESSION_FINISH"
  | "SET_COMPLETE"
  | "SET_UNCOMPLETE"
  | "TRACKER_ENTRY_CREATE"
  | "TRACKER_ENTRY_UPDATE"
  | "TRACKER_ENTRY_DELETE";

export interface SyncQueueItem {
  id: string;
  code: SyncMutationCode;
  payload: unknown;
  createdAt: Date;
  retryCount: number;
  lastError?: string;
}

export interface SyncStatus {
  isOnline: boolean;
  pendingCount: number;
  isProcessing: boolean;
  lastSyncAt: Date | null;
  circuitBreakerOpen: boolean;
}

export interface ISyncService {
  /**
   * Queue a mutation for background sync.
   * Returns immediately - sync happens async.
   */
  queue<T extends SyncMutationCode>(
    code: T,
    payload: SyncPayloadMap[T]
  ): Promise<{ queueId: string }>;

  /**
   * Try immediate sync (for critical operations).
   * Falls back to queue if offline.
   */
  syncImmediate<T extends SyncMutationCode>(
    code: T,
    payload: SyncPayloadMap[T]
  ): Promise<{ success: boolean; error?: string }>;

  /**
   * Process the sync queue.
   * Called by scheduler, not directly.
   */
  processQueue(): Promise<ProcessQueueResult>;

  /**
   * Get current sync status.
   */
  getStatus(): SyncStatus;

  /**
   * Get pending items in queue.
   */
  getPendingItems(): Promise<SyncQueueItem[]>;

  /**
   * Clear all pending items (dangerous!).
   */
  clearQueue(): Promise<void>;

  /**
   * Subscribe to status changes.
   */
  onStatusChange(callback: (status: SyncStatus) => void): () => void;
}

export interface ProcessQueueResult {
  processed: number;
  succeeded: number;
  failed: number;
  errors: Array<{ id: string; error: string }>;
}

// Payload types for each mutation
export interface SyncPayloadMap {
  ROUTINE_CREATE: {
    routine: { id: string; name: string; user_id: string /* ... */ };
    blocks: Array<{ id: string; name: string /* ... */ }>;
    exercises: Array<{ id: string; exercise_id: string /* ... */ }>;
    sets: Array<{ id: string /* ... */ }>;
  };
  ROUTINE_UPDATE: {
    id: string;
    changes: Partial<{ name: string; folder_id: string | null /* ... */ }>;
  };
  ROUTINE_DELETE: {
    id: string;
  };
  SESSION_START: {
    session: {
      id: string;
      user_id: string;
      routine_id: string | null;
      started_at: string;
    };
  };
  SESSION_UPDATE: {
    id: string;
    changes: Partial<{ notes: string /* ... */ }>;
  };
  SESSION_FINISH: {
    id: string;
    finished_at: string;
    stats: { duration: number; total_sets: number /* ... */ };
  };
  SET_COMPLETE: {
    set_id: string;
    session_id: string;
    exercise_id: string;
    actual_reps: number;
    actual_weight: number;
    actual_rpe: number | null;
    completed_at: string;
    is_pr: boolean;
    pr_types: string[];
  };
  SET_UNCOMPLETE: {
    set_id: string;
    session_id: string;
  };
  TRACKER_ENTRY_CREATE: {
    entry: {
      id: string;
      metric_id: string;
      value: number;
      date: string /* ... */;
    };
  };
  TRACKER_ENTRY_UPDATE: {
    id: string;
    changes: Partial<{ value: number; notes: string /* ... */ }>;
  };
  TRACKER_ENTRY_DELETE: {
    id: string;
  };
}
```

---

### Complete Use Case Example

**Archivo**: `core/use-cases/workout/complete-set.ts`

```typescript
import type { IWorkoutSessionRepository } from "@/core/ports/repositories/workout-session-repository.port";
import type { IPRRepository } from "@/core/ports/repositories/pr-repository.port";
import type { ISyncService } from "@/core/ports/services/sync-service.port";
import type { IHapticService } from "@/core/ports/services/haptic-service.port";
import {
  validateCompleteSet,
  type CompleteSetInput,
} from "@/core/domain/workout/validations";
import { determinePRTypes, calculateE1RM } from "@/core/domain/workout/rules";
import type {
  CompletedSet,
  PRType,
  ExerciseId,
  SetId,
  SessionId,
} from "@/core/domain/workout/entities";

export interface CompleteSetParams {
  sessionId: SessionId;
  exerciseId: ExerciseId;
  setId: SetId;
  values: CompleteSetInput;
  userId: string;
}

export interface CompleteSetResult {
  completedSet: CompletedSet;
  isPR: boolean;
  prTypes: PRType[];
}

/**
 * Complete Set Use Case
 *
 * Orchestrates the business logic for completing a workout set:
 * 1. Validates input
 * 2. Checks for PRs
 * 3. Saves to local DB
 * 4. Triggers haptic feedback
 * 5. Queues sync
 */
export class CompleteSetUseCase {
  constructor(
    private readonly sessionRepo: IWorkoutSessionRepository,
    private readonly prRepo: IPRRepository,
    private readonly syncService: ISyncService,
    private readonly hapticService: IHapticService
  ) {}

  async execute(params: CompleteSetParams): Promise<CompleteSetResult> {
    const { sessionId, exerciseId, setId, values, userId } = params;

    // 1. Validate input
    const validatedValues = validateCompleteSet(values);

    // 2. Get exercise info for PR calculation
    const exerciseInfo = await this.sessionRepo.getExerciseInfo(exerciseId);
    if (!exerciseInfo) {
      throw new Error(`Exercise ${exerciseId} not found in session`);
    }

    // 3. Check for PRs
    const previousBest = await this.prRepo.getBestForExercise(
      exerciseInfo.catalogExerciseId,
      userId
    );

    const prTypes = determinePRTypes(
      {
        weight: validatedValues.actual_weight,
        reps: validatedValues.actual_reps,
      },
      previousBest ?? { maxWeight: 0, maxReps: 0, maxVolume: 0, maxE1RM: 0 }
    );

    const isPR = prTypes.length > 0;

    // 4. Create completed set data
    const completedAt = new Date().toISOString();
    const completedSet: CompletedSet = {
      id: setId,
      exercise_id: exerciseId,
      order: 0, // Will be set by repository
      type: "normal", // Will be set from original set
      target_reps: null,
      target_weight: null,
      target_rpe: null,
      target_duration: null,
      actual_reps: validatedValues.actual_reps,
      actual_weight: validatedValues.actual_weight as any,
      actual_rpe: validatedValues.actual_rpe ?? null,
      completed_at: completedAt as any,
      is_pr: isPR,
      pr_types: prTypes,
    };

    // 5. Save to local DB (local-first: this is instant)
    await this.sessionRepo.completeSet(sessionId, setId, {
      actual_reps: validatedValues.actual_reps,
      actual_weight: validatedValues.actual_weight,
      actual_rpe: validatedValues.actual_rpe,
      completed_at: completedAt,
      is_pr: isPR,
      pr_types: prTypes,
    });

    // 6. Update PR records if applicable
    if (isPR) {
      await this.prRepo.updatePRs(
        exerciseInfo.catalogExerciseId,
        userId,
        {
          weight: validatedValues.actual_weight,
          reps: validatedValues.actual_reps,
          e1rm: calculateE1RM(
            validatedValues.actual_weight,
            validatedValues.actual_reps
          ),
          volume: validatedValues.actual_weight * validatedValues.actual_reps,
        },
        prTypes
      );

      // PR celebration haptic
      this.hapticService.notification("success");
    } else {
      // Normal completion haptic
      this.hapticService.impact("light");
    }

    // 7. Queue sync (fire & forget - doesn't block)
    await this.syncService.queue("SET_COMPLETE", {
      set_id: setId,
      session_id: sessionId,
      exercise_id: exerciseId,
      actual_reps: validatedValues.actual_reps,
      actual_weight: validatedValues.actual_weight,
      actual_rpe: validatedValues.actual_rpe ?? null,
      completed_at: completedAt,
      is_pr: isPR,
      pr_types: prTypes,
    });

    return {
      completedSet,
      isPR,
      prTypes,
    };
  }
}
```

---

## 🔮 Beneficios Futuros

Con esta arquitectura podrás:

1. **Cambiar SQLite por otro storage** (WatermelonDB, Realm, etc.)

   - Solo crear nuevo adapter que implemente los ports
   - Cambiar wiring en container
   - CERO cambios en features o use cases

2. **Cambiar Supabase por Firebase/AWS**

   - Solo crear nuevo sync adapter
   - Cambiar repositorios de sync
   - El resto de la app no se entera

3. **Agregar tests unitarios fácilmente**

   - Use cases: inject mocks de repositorios
   - Domain: funciones puras, tests triviales
   - No necesitás DB real para testear lógica

4. **Escalar a múltiples plataformas**

   - El core es TypeScript puro
   - Solo la capa de UI es React Native
   - Podrías tener web app con el mismo core

5. **Onboarding de nuevos devs**
   - Estructura clara y predecible
   - Cada capa tiene responsabilidad definida
   - Fácil de entender el flujo de datos

---

> **"Make the easy things easy, and the hard things possible."** - Larry Wall
