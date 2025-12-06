# 🗺️ Myosin Architecture Roadmap

> **Enfoque:** Mejoras incrementales sin romper nada. Cada fase deja la app funcional.

---

## 📍 Dónde Estamos Hoy

**Arquitectura actual:** Feature-First + Zustand + React Query + SQLite + Supabase Sync

**Rating:** 7.5/10

**Lo bueno:**

- ✅ Features bien organizadas
- ✅ Sync engine funcional con queue + retry + circuit breaker
- ✅ Local-first con SQLite
- ✅ React Query para cache

**Lo que duele:**

- ❌ Archivos de 1000+ líneas
- ❌ Stores monolíticos
- ❌ Sin tests
- ❌ Acoplado a SQLite/Supabase (difícil cambiar)
- ❌ Lógica de negocio dispersa

---

## 🎯 Objetivo Final

**Arquitectura target:** Feature-First + Clean Architecture Lite

```
Rating objetivo: 9/10

✅ Archivos < 400 líneas
✅ Stores divididos en slices
✅ Domain rules extraídas y testeables
✅ Interfaces para repositories (cambiar provider = 1 archivo)
✅ Tests en lógica crítica
✅ Logger estructurado
✅ Validaciones con Zod
```

---

## 📋 FASE 1: Quick Wins (3-5 días)

> **Meta:** Mejoras de bajo riesgo que dan valor inmediato

### 1.1 Configuraciones

- [ ] **ESLint mejorado**

  ```bash
  npm install -D @tanstack/eslint-plugin-query
  ```

  - Agregar reglas en `eslint.config.js`
  - `no-console: warn`
  - `@tanstack/query/exhaustive-deps: error`

- [ ] **TypeScript más estricto** en `tsconfig.json`
  ```json
  {
    "compilerOptions": {
      "strict": true,
      "noUncheckedIndexedAccess": true
    }
  }
  ```
  - ⚠️ Esto va a mostrar errores - resolverlos gradualmente

### 1.2 Logger Service

- [ ] Crear `shared/services/logger.ts`

  ```typescript
  export const logger = {
    debug: (msg, ctx?) => {},
    info: (msg, ctx?) => {},
    warn: (msg, ctx?) => {},
    error: (msg, error?, ctx?) => {},
    sync: (action, status, details?) => {},
  };
  ```

- [ ] Reemplazar `console.log` → `logger.info` (gradualmente)

### 1.3 Validaciones con Zod

- [ ] Instalar Zod

  ```bash
  npm install zod
  ```

- [ ] Crear `shared/utils/validation.ts` con schemas base
  ```typescript
  export const schemas = {
    uuid: z.string().uuid(),
    positiveNumber: z.number().positive(),
    reps: z.number().int().positive().max(999),
    weight: z.number().positive().max(9999),
    rpe: z.number().min(1).max(10).nullable(),
  };
  ```

### 1.4 Error Boundary

- [ ] Crear `shared/ui/error-boundary/index.tsx`
- [ ] Envolver app en `app/_layout.tsx`

**✅ Checkpoint Fase 1:** App funciona igual, mejor tooling, logs estructurados

---

## 📋 FASE 2: Dividir Archivos Grandes (5-7 días)

> **Meta:** Ningún archivo > 400 líneas

### 2.1 Stores → Slices

- [ ] **`use-active-workout-store.ts`** (1679 líneas → ~300 por slice)

  ```
  hooks/store/
  ├── index.ts           # Compose slices
  ├── types.ts           # Tipos del store
  ├── session-slice.ts   # Estado de sesión
  ├── blocks-slice.ts    # CRUD de bloques
  ├── sets-slice.ts      # CRUD de sets
  ├── timer-slice.ts     # Lógica de timer
  └── selectors.ts       # Getters computados
  ```

- [ ] **`use-routine-form-store.ts`** (978 líneas → ~250 por slice)
  ```
  hooks/store/
  ├── index.ts
  ├── types.ts
  ├── form-slice.ts
  ├── block-actions.ts
  ├── exercise-actions.ts
  └── set-actions.ts
  ```

### 2.2 Componentes → Sub-componentes

- [ ] **`MetricModalV2.tsx`** (1820 líneas)

  ```
  components/MetricModal/
  ├── index.tsx              # Container (~100 líneas)
  ├── MetricHeader.tsx
  ├── MetricValueInput.tsx
  ├── MetricQuickActions.tsx
  ├── MetricHistory.tsx
  └── hooks/
      └── use-metric-state.ts
  ```

- [ ] **`CircuitTimerModeV2.tsx`** (1617 líneas)

  ```
  elements/CircuitTimerMode/
  ├── index.tsx
  ├── CircuitDisplay.tsx
  ├── CircuitControls.tsx
  ├── CircuitProgress.tsx
  └── hooks/
      └── use-circuit-timer.ts
  ```

- [ ] **`TempoMetronomeV2.tsx`** (1032 líneas)

  ```
  elements/TempoMetronome/
  ├── index.tsx
  ├── MetronomeDisplay.tsx
  ├── MetronomeControls.tsx
  └── hooks/
      └── use-metronome-timer.ts
  ```

- [ ] **`ActiveSetRowV2.tsx`** (737 líneas)
  - Extraer `use-set-completion.ts`
  - Extraer `use-set-values.ts`
  - Componente queda ~300 líneas

**✅ Checkpoint Fase 2:** Archivos manejables, misma funcionalidad

---

## 📋 FASE 3: Domain Layer (3-4 días)

> **Meta:** Lógica de negocio pura y testeable

### 3.1 Crear estructura

```bash
mkdir -p core/domain/workout
mkdir -p core/domain/tracker
mkdir -p core/domain/user
```

### 3.2 Extraer entities

- [ ] **`core/domain/workout/entities.ts`**

  - Tipos: Routine, Block, Exercise, Set, Session
  - Sin dependencias externas

- [ ] **`core/domain/tracker/entities.ts`**
  - Tipos: Metric, TrackerEntry, TrackerConfig

### 3.3 Extraer rules (funciones puras)

- [ ] **`core/domain/workout/rules.ts`**

  ```typescript
  // Extraer de los stores/helpers actuales:
  export function calculateE1RM(weight, reps): number
  export function calculateVolume(sets): number
  export function determinePRTypes(newSet, previousBest): PRType[]
  export function getEffectiveTargetWeight(set, previous, default): number
  export function isWorkingSet(type): boolean
  ```

- [ ] **`core/domain/workout/validations.ts`**
  - Zod schemas para Routine, Set, Session

### 3.4 Tests para domain

- [ ] Configurar Jest

  ```bash
  npm install -D jest @types/jest ts-jest
  ```

- [ ] **`core/domain/workout/__tests__/rules.test.ts`**
  ```typescript
  describe("calculateE1RM", () => {
    it("should return weight when reps is 1", () => {
      expect(calculateE1RM(100, 1)).toBe(100);
    });
    // ... más tests
  });
  ```

**✅ Checkpoint Fase 3:** Lógica de negocio aislada y testeada

---

## 📋 FASE 4: Interfaces de Repositories (2-3 días)

> **Meta:** Preparar para poder cambiar providers

### 4.1 Crear ports

```bash
mkdir -p core/ports/repositories
```

- [ ] **`core/ports/repositories/routine-repository.port.ts`**

  ```typescript
  export interface IRoutineRepository {
    findAll(userId: string, folderId?: string): Promise<Routine[]>;
    findById(id: string): Promise<Routine | null>;
    create(data: CreateRoutineData): Promise<Routine>;
    update(id: string, data: Partial<Routine>): Promise<Routine>;
    delete(id: string): Promise<void>;
  }
  ```

- [ ] **`core/ports/repositories/workout-session-repository.port.ts`**
- [ ] **`core/ports/repositories/tracker-repository.port.ts`**
- [ ] **`core/ports/repositories/pr-repository.port.ts`**

### 4.2 Hacer que repos existentes implementen interfaces

- [ ] `shared/db/repository/routines.ts` → implementa `IRoutineRepository`
- [ ] `shared/db/repository/workout-sessions.ts` → implementa `IWorkoutSessionRepository`
- [ ] etc.

**No cambiar funcionalidad, solo agregar tipos**

**✅ Checkpoint Fase 4:** Repos tipados con interfaces, listos para swap

---

## 📋 FASE 5: Services Estandarizados (2-3 días)

> **Meta:** Cada feature tiene service layer consistente

### 5.1 Template de service

```typescript
// features/[feature]/service/index.ts
export const featureService = {
  // Business logic sin React
  // Usa repositories via interfaces
  // Coordina sync
};
```

### 5.2 Crear/completar services

- [ ] `features/tracker-v2/service/tracker.ts` (ya existe, revisar)
- [ ] `features/workouts-v2/service/routines.ts` (ya existe, revisar)
- [ ] `features/profile-v2/service/profile.ts` (crear)
- [ ] `features/analytics-v2/service/analytics.ts` (ya existe, revisar)

### 5.3 Query keys expandidos

- [ ] Completar `shared/queries/query-keys.ts` con todos los keys

**✅ Checkpoint Fase 5:** Capa de servicios consistente

---

## 📋 FASE 6: Testing (5-7 días)

> **Meta:** Tests en código crítico

### 6.1 Setup

- [ ] Jest configurado con `jest.config.js`
- [ ] Testing Library instalado
  ```bash
  npm install -D @testing-library/react-native @testing-library/jest-native
  ```

### 6.2 Tests prioritarios

**Prioridad 1: Domain rules**

- [ ] `core/domain/workout/rules.test.ts`
- [ ] `core/domain/tracker/rules.test.ts`

**Prioridad 2: Services**

- [ ] `features/tracker-v2/service/tracker.test.ts`
- [ ] `features/workouts-v2/service/routines.test.ts`

**Prioridad 3: Repositories**

- [ ] `shared/db/repository/routines.test.ts`
- [ ] `shared/db/repository/pr.test.ts`

**Prioridad 4: Sync engine**

- [ ] `shared/sync/utils/backoff-calculator.test.ts`
- [ ] `shared/sync/queue/sync-queue-repository.test.ts`

**✅ Checkpoint Fase 6:** Tests en lógica crítica

---

## 📋 FASE 7: (Opcional) Use Cases (5-7 días)

> **Solo si realmente lo necesitás**

### 7.1 Crear use cases para operaciones complejas

- [ ] `core/use-cases/workout/complete-set.ts`
- [ ] `core/use-cases/workout/finish-workout.ts`
- [ ] `core/use-cases/routine/create-routine.ts`

### 7.2 DI Container simple

- [ ] `infrastructure/di/container.ts`

**✅ Checkpoint Fase 7:** Clean Architecture completa

---

## ⏱️ Timeline Estimado

| Fase | Descripción          | Tiempo   | Riesgo    |
| ---- | -------------------- | -------- | --------- |
| 1    | Quick Wins           | 3-5 días | 🟢 Mínimo |
| 2    | Dividir archivos     | 5-7 días | 🟡 Bajo   |
| 3    | Domain Layer         | 3-4 días | 🟢 Mínimo |
| 4    | Interfaces repos     | 2-3 días | 🟢 Mínimo |
| 5    | Services             | 2-3 días | 🟡 Bajo   |
| 6    | Testing              | 5-7 días | 🟢 Mínimo |
| 7    | Use Cases (opcional) | 5-7 días | 🟡 Bajo   |

**Total mínimo (Fases 1-6):** ~20-29 días
**Total completo (con Fase 7):** ~25-36 días

---

## 🚦 Reglas del Refactor

1. **Un commit = un cambio pequeño** - Fácil de revertir
2. **Branch por fase** - `refactor/phase-1-configs`, `refactor/phase-2-split-files`
3. **Main siempre funcional** - Merge solo cuando está verde
4. **No reescribir todo** - Migrar feature por feature
5. **Si funciona, no lo toques** - Refactorear solo lo que duele

---

## 🎯 Criterios de Éxito por Fase

### Fase 1 ✅

- [ ] `npm run lint` pasa sin errores críticos
- [ ] Logger usado en sync engine
- [ ] Al menos 5 schemas Zod definidos

### Fase 2 ✅

- [ ] Ningún archivo > 500 líneas
- [ ] Stores divididos funcionan igual
- [ ] No hay regresiones en funcionalidad

### Fase 3 ✅

- [ ] `core/domain/` existe con entities y rules
- [ ] Al menos 10 tests de domain rules pasan
- [ ] Rules no importan nada de React/SQLite

### Fase 4 ✅

- [ ] Interfaces definidas para todos los repos
- [ ] Repos implementan las interfaces
- [ ] TypeScript compila sin errores

### Fase 5 ✅

- [ ] Cada feature tiene carpeta `service/`
- [ ] Query keys completos y consistentes

### Fase 6 ✅

- [ ] Jest configurado y corriendo
- [ ] > 50% coverage en domain rules
- [ ] Tests de sync queue funcionando

---

## 🆘 Si Algo Sale Mal

1. **Revertir el commit** - Por eso commits pequeños
2. **Pedir ayuda** - Mejor preguntar que romper
3. **Dejar para después** - No todo tiene que hacerse hoy
4. **Documentar el problema** - Para no repetirlo

---

## 📝 Notas Adicionales

### Archivos de referencia creados:

- `docs/ARCHITECTURE_REFACTOR_PLAN.md` - Plan original detallado
- `docs/ARCHITECTURE_REFACTOR_PLAN_V2.md` - Clean Architecture completo con ejemplos

### Próximo paso recomendado:

**Empezar con Fase 1.1** - ESLint config. Es el cambio de menor riesgo y te da feedback inmediato sobre problemas en el código.

---

> **"Make it work, make it right, make it fast"** - Kent Beck
>
> Ya funciona. Ahora lo hacemos bien. 🚀
