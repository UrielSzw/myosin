# 🏗️ Plan de Refactorización de Arquitectura - Myosin

> **Objetivo**: Llevar la arquitectura de 7.5/10 a 9+/10 siguiendo un orden lógico: primero configs, luego refactors de código existente, y finalmente agregar tests cuando todo esté prolijo.

---

## 📋 Fases del Refactor

| Fase  | Descripción                          | Esfuerzo   | Riesgo |
| ----- | ------------------------------------ | ---------- | ------ |
| **1** | Configuraciones y tooling            | Bajo       | Mínimo |
| **2** | Estructuras y patrones               | Medio      | Bajo   |
| **3** | Refactor de stores grandes           | Medio-Alto | Medio  |
| **4** | Estructura de archivos y componentes | Medio-Alto | Medio  |
| **5** | Agregar capas faltantes              | Medio      | Bajo   |
| **6** | Testing                              | Alto       | Mínimo |

---

## 📊 Análisis de Archivos Grandes (Hotspots)

Archivos que superan las **300 líneas** y necesitan atención:

### 🔴 Críticos (>1000 líneas) - Dividir urgente

| Archivo                                                      | Líneas | Problema                            |
| ------------------------------------------------------------ | ------ | ----------------------------------- |
| `tracker-v2/components/MetricModalV2.tsx`                    | 1820   | Modal monolítico con toda la lógica |
| `active-workout-v2/hooks/use-active-workout-store.ts`        | 1679   | Store gigante sin slices            |
| `active-workout-v2/elements/CircuitTimerModeV2.tsx`          | 1617   | Timer con UI + lógica mezclada      |
| `routine-templates/constants/templates/beginner-fullbody.ts` | 1147   | Data - OK, pero considerar JSON     |
| `active-workout-v2/elements/TempoMetronomeV2.tsx`            | 1032   | Timer con UI + audio + lógica       |
| `routine-form-v2/hooks/use-routine-form-store.ts`            | 978    | Store sin slices                    |

### 🟡 Altos (500-1000 líneas) - Refactorizar

| Archivo                                           | Líneas | Problema                                 |
| ------------------------------------------------- | ------ | ---------------------------------------- |
| `active-workout-v2/utils/store-helpers.ts`        | 762    | Helpers - considerar dividir por dominio |
| `active-workout-v2/elements/ActiveSetRowV2.tsx`   | 737    | Componente con mucha lógica inline       |
| `tracker-v2/components/MetricSelectorModalV2.tsx` | 701    | Modal grande                             |
| `tracker-v2/service/tracker.ts`                   | 698    | Service OK pero largo                    |
| `tracker-v2/constants/templates.ts`               | 659    | Constantes - OK                          |
| `onboarding/screens/CompleteScreen.tsx`           | 615    | Screen con mucha UI                      |

### 🟢 Moderados (300-500 líneas) - Revisar caso por caso

- Sheets y Modals en `shared/ui/sheets-v2/` (esperado que sean largos)
- Repositorios en `shared/db/repository/` (lógica de data, OK)
- Traducciones (data, OK)

---

## 🔧 FASE 1: Configuraciones y Tooling (1-2 días)

### 1.1 Mejorar ESLint Config

**Archivo**: `eslint.config.js`

```javascript
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const tanstackQuery = require("@tanstack/eslint-plugin-query");

module.exports = defineConfig([
  expoConfig,
  {
    plugins: {
      "@tanstack/query": tanstackQuery,
    },
    rules: {
      // Prevenir bugs comunes
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      // React hooks
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",

      // TanStack Query
      "@tanstack/query/exhaustive-deps": "error",
      "@tanstack/query/stable-query-client": "error",
    },
  },
  {
    ignores: ["dist/*", "node_modules/*", ".expo/*"],
  },
]);
```

**Comando para verificar**: `npx eslint . --ext .ts,.tsx`

---

### 1.2 TypeScript Más Estricto

**Archivo**: `tsconfig.json`

```jsonc
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true, // Arrays pueden ser undefined
    "exactOptionalPropertyTypes": true, // Distingue undefined de opcional
    "noImplicitReturns": true, // Todas las ramas deben retornar
    "noFallthroughCasesInSwitch": true, // Previene bugs en switch
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"],
  "exclude": [
    "**/__tests__/**",
    "**/*.test.ts",
    "**/*.test.tsx",
    "node_modules"
  ]
}
```

⚠️ **Nota**: Esto puede generar errores iniciales. Resolverlos uno por uno.

---

### 1.3 Crear Logger Service

**Archivo**: `shared/services/logger.ts`

```typescript
type LogLevel = "debug" | "info" | "warn" | "error";

type LogContext = {
  feature?: string;
  action?: string;
  userId?: string;
  [key: string]: unknown;
};

const isDev = __DEV__;

const formatMessage = (
  level: LogLevel,
  message: string,
  context?: LogContext
) => {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` ${JSON.stringify(context)}` : "";
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
};

export const logger = {
  debug: (message: string, context?: LogContext) => {
    if (isDev) console.log(formatMessage("debug", message, context));
  },

  info: (message: string, context?: LogContext) => {
    if (isDev) console.log(formatMessage("info", message, context));
  },

  warn: (message: string, context?: LogContext) => {
    console.warn(formatMessage("warn", message, context));
  },

  error: (message: string, error?: Error, context?: LogContext) => {
    console.error(
      formatMessage("error", message, {
        ...context,
        errorMessage: error?.message,
        stack: error?.stack,
      })
    );
    // TODO: Enviar a Sentry/Crashlytics en producción
  },

  // Helpers específicos
  sync: (
    action: string,
    status: "start" | "success" | "fail",
    details?: object
  ) => {
    const emoji =
      status === "start" ? "🔄" : status === "success" ? "✅" : "❌";
    logger.info(`${emoji} Sync: ${action}`, {
      feature: "sync",
      status,
      ...details,
    });
  },

  db: (operation: string, table: string, details?: object) => {
    logger.debug(`DB: ${operation} on ${table}`, {
      feature: "database",
      ...details,
    });
  },
};
```

---

### 1.4 Instalar Zod para Validaciones

**Comando**: `npm install zod`

**Crear archivo base**: `shared/utils/validation.ts`

```typescript
import { z } from "zod";

// Schemas reutilizables
export const schemas = {
  // IDs
  uuid: z.string().uuid(),
  tempId: z.string().startsWith("temp_"),

  // Valores numéricos
  positiveNumber: z.number().positive(),
  nonNegativeNumber: z.number().nonnegative(),
  percentage: z.number().min(0).max(100),

  // Workout específicos
  rpe: z.number().min(1).max(10).nullable(),
  weight: z.number().positive().max(1000), // kg
  reps: z.number().int().positive().max(1000),

  // Tiempo
  durationSeconds: z.number().int().nonnegative().max(86400), // max 24h

  // Strings
  nonEmptyString: z.string().min(1).trim(),
  optionalString: z.string().nullable().optional(),
};

// Helper para validar con error amigable
export const validate = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map(
      (e) => `${e.path.join(".")}: ${e.message}`
    );
    throw new Error(`Validation failed: ${errors.join(", ")}`);
  }
  return result.data;
};

// Helper para validar sin throw (retorna null si falla)
export const validateSafe = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T | null => {
  const result = schema.safeParse(data);
  return result.success ? result.data : null;
};
```

---

## 🏛️ FASE 2: Estructuras y Patrones (2-3 días)

### 2.1 Crear Error Boundary Global

**Archivo**: `shared/ui/error-boundary/index.tsx`

```tsx
import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { Typography } from "../typography";
import { Button } from "../button";
import { logger } from "@/shared/services/logger";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error("React Error Boundary caught error", error, {
      componentStack: errorInfo.componentStack,
    });
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <Typography variant="h3" style={styles.title}>
            Algo salió mal
          </Typography>
          <Typography variant="body1" color="textMuted" style={styles.message}>
            Ha ocurrido un error inesperado. Por favor, intenta de nuevo.
          </Typography>
          <Button variant="primary" onPress={this.handleRetry}>
            Reintentar
          </Button>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    marginBottom: 12,
  },
  message: {
    textAlign: "center",
    marginBottom: 24,
  },
});
```

**Integrar en `app/_layout.tsx`**:

```tsx
import { ErrorBoundary } from "@/shared/ui/error-boundary";

// Envolver AppContent
<ErrorBoundary>
  <AppContent />
</ErrorBoundary>;
```

---

### 2.2 Crear API Layer Abstraction

**Estructura**:

```
shared/api/
├── index.ts           # Re-exports
├── auth-api.ts        # Auth endpoints
├── exercises-api.ts   # Exercises endpoints
└── types.ts           # API response types
```

**Archivo**: `shared/api/auth-api.ts`

```typescript
import { supabase } from "@/shared/services/supabase";
import { logger } from "@/shared/services/logger";

export type AuthResult<T> = {
  data: T | null;
  error: Error | null;
};

export const authApi = {
  signIn: async (
    email: string,
    password: string
  ): Promise<AuthResult<{ userId: string }>> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { data: { userId: data.user.id }, error: null };
    } catch (error) {
      logger.error("Auth signIn failed", error as Error);
      return { data: null, error: error as Error };
    }
  },

  signUp: async (
    email: string,
    password: string,
    displayName?: string
  ): Promise<AuthResult<{ userId: string }>> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName } },
      });
      if (error) throw error;
      return { data: { userId: data.user!.id }, error: null };
    } catch (error) {
      logger.error("Auth signUp failed", error as Error);
      return { data: null, error: error as Error };
    }
  },

  signOut: async (): Promise<AuthResult<void>> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { data: undefined, error: null };
    } catch (error) {
      logger.error("Auth signOut failed", error as Error);
      return { data: null, error: error as Error };
    }
  },

  getSession: () => supabase.auth.getSession(),

  onAuthStateChange: (
    callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]
  ) => supabase.auth.onAuthStateChange(callback),
};
```

---

### 2.3 Estandarizar Service Layer en Features

Crear template para features que no tienen service:

**Template**: `features/[feature-name]/service/index.ts`

```typescript
/**
 * [Feature Name] Service
 *
 * Responsabilidades:
 * - Business logic sin dependencias de React
 * - Coordinación entre repository y sync
 * - Validaciones de dominio
 */

import { [feature]Repository } from '@/shared/db/repository/[feature]';
import { logger } from '@/shared/services/logger';
import { validate, schemas } from '@/shared/utils/validation';

export const [feature]Service = {
  // Métodos del servicio
};
```

**Features que necesitan service**:

- [ ] `analytics-v2`
- [ ] `profile-v2`
- [ ] `pr-list-v2`
- [ ] `pr-detail-v2`
- [ ] `workout-session-list-v2`
- [ ] `workout-session-detail-v2`

---

## 🔨 FASE 3: Refactor de Stores Grandes (3-5 días)

### 3.1 Split `use-active-workout-store.ts` (~1946 líneas)

**Nueva estructura**:

```
features/active-workout-v2/hooks/store/
├── index.ts                    # Compose + re-exports
├── types.ts                    # Todos los tipos del store
├── session-slice.ts            # Session state + actions
├── blocks-slice.ts             # Blocks CRUD
├── exercises-slice.ts          # Exercises CRUD
├── sets-slice.ts               # Sets CRUD + completion
├── timer-slice.ts              # Rest timer logic
├── pr-slice.ts                 # PR tracking
├── selectors.ts                # Derived state / computed
└── helpers.ts                  # Funciones puras de ayuda
```

**Patrón de Slice**:

```typescript
// session-slice.ts
import { StateCreator } from "zustand";
import { StoreState, SessionSlice } from "./types";

export const createSessionSlice: StateCreator<
  StoreState,
  [["zustand/immer", never]],
  [],
  SessionSlice
> = (set, get) => ({
  session: null,

  initializeWorkout: async (routineId: string, userId: string) => {
    // ... lógica
  },

  clearWorkout: () => {
    set((state) => {
      state.activeWorkout.session = null;
      // ... reset
    });
  },
});
```

**Compose en index.ts**:

```typescript
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createSessionSlice } from "./session-slice";
import { createBlocksSlice } from "./blocks-slice";
// ... otros slices

export const useActiveWorkoutStore = create<StoreState>()(
  immer((...args) => ({
    ...createSessionSlice(...args),
    ...createBlocksSlice(...args),
    ...createSetsSlice(...args),
    ...createTimerSlice(...args),
    ...createPRSlice(...args),
  }))
);

// Re-export hooks selectores
export const useActiveWorkout = () =>
  useActiveWorkoutStore((s) => s.activeWorkout);
export const useActiveSession = () =>
  useActiveWorkoutStore((s) => s.activeWorkout.session);
// etc...
```

---

### 3.2 Split `use-routine-form-store.ts` (~1140 líneas)

**Nueva estructura**:

```
features/routine-form-v2/hooks/store/
├── index.ts
├── types.ts
├── form-slice.ts           # Form state (routine, blocks, exercises, sets)
├── modal-slice.ts          # Modal/sheet state
├── current-slice.ts        # Current selection state
├── block-actions.ts        # Block CRUD
├── exercise-actions.ts     # Exercise CRUD
├── set-actions.ts          # Set CRUD
├── selectors.ts
└── helpers.ts
```

---

## 📂 FASE 4: Estructura de Archivos y Componentes (3-4 días)

> **Principio clave**: Un archivo no debería superar las **300-400 líneas**. Si lo hace, probablemente tiene múltiples responsabilidades que deberían separarse.

### 4.1 Patrones de Extracción

#### Patrón A: Extraer Lógica a Custom Hooks

Cuando un componente tiene mucha lógica, extraerla a hooks específicos:

```tsx
// ❌ ANTES: ActiveSetRowV2.tsx (737 líneas)
// Toda la lógica de completion, validation, PR, animations en el componente

// ✅ DESPUÉS: Dividir responsabilidades
// hooks/use-set-completion.ts - Lógica de completar set
// hooks/use-set-animations.ts - Animaciones del row
// ActiveSetRowV2.tsx - Solo UI y composición (~200 líneas)
```

#### Patrón B: Extraer Sub-componentes

Cuando un componente renderiza muchas secciones distintas:

```tsx
// ❌ ANTES: MetricModalV2.tsx (1820 líneas)
// Header, Input, QuickActions, History, Settings todo junto

// ✅ DESPUÉS: Dividir en componentes
// MetricModalV2/
// ├── index.tsx              # Modal wrapper + composición (~150 líneas)
// ├── MetricHeader.tsx       # Header del modal
// ├── MetricValueInput.tsx   # Input de valor
// ├── MetricQuickActions.tsx # Grid de quick actions
// ├── MetricHistory.tsx      # Lista de entries
// ├── MetricSettings.tsx     # Configuración
// └── hooks/
//     ├── use-metric-state.ts
//     └── use-metric-mutations.ts
```

#### Patrón C: Separar UI de Lógica (Timer/Metronome)

Para componentes con lógica compleja de tiempo/audio:

```tsx
// ❌ ANTES: CircuitTimerModeV2.tsx (1617 líneas)
// Timer logic, audio, UI, animations todo mezclado

// ✅ DESPUÉS: Separar capas
// CircuitTimerModeV2/
// ├── index.tsx              # Composición y layout
// ├── CircuitDisplay.tsx     # UI del timer actual
// ├── CircuitOverview.tsx    # Vista de ejercicios
// ├── CircuitControls.tsx    # Botones de control
// ├── CircuitProgress.tsx    # Indicadores de progreso
// └── hooks/
//     ├── use-circuit-timer.ts    # Lógica del timer
//     ├── use-circuit-audio.ts    # Sonidos
//     └── use-circuit-state.ts    # Estado del circuito
```

---

### 4.2 Refactor: MetricModalV2 (1820 → ~800 líneas total)

**Prioridad**: 🔴 Alta (archivo más grande)

**Nueva estructura**:

```
features/tracker-v2/components/MetricModal/
├── index.tsx                    # Modal container (~100 líneas)
├── MetricModalHeader.tsx        # Header con nombre y close (~80 líneas)
├── MetricValueInput.tsx         # Input principal (~150 líneas)
├── MetricQuickActions.tsx       # Grid de acciones rápidas (~200 líneas)
├── MetricEntryHistory.tsx       # Lista de entries del día (~150 líneas)
├── MetricSettingsPanel.tsx      # Panel de configuración (~150 líneas)
├── MetricTargetDisplay.tsx      # Barra de progreso al target (~80 líneas)
└── hooks/
    ├── use-metric-modal-state.ts   # Estado local del modal
    └── use-metric-conversions.ts   # Conversiones de unidades
```

**Pasos**:

1. Crear carpeta `MetricModal/`
2. Extraer cada sección visual a su propio componente
3. Extraer lógica de estado a `use-metric-modal-state.ts`
4. Mantener `index.tsx` como orquestador
5. Actualizar imports en `tracker-v2/index.tsx`

---

### 4.3 Refactor: CircuitTimerModeV2 (1617 → ~700 líneas total)

**Prioridad**: 🔴 Alta

**Nueva estructura**:

```
features/active-workout-v2/elements/CircuitTimerMode/
├── index.tsx                    # Modal container + composición (~150 líneas)
├── CircuitHeader.tsx            # Header con close y round info (~60 líneas)
├── CircuitTimerDisplay.tsx      # Círculo animado + tiempo (~150 líneas)
├── CircuitExerciseInfo.tsx      # Info del ejercicio actual (~100 líneas)
├── CircuitProgressBar.tsx       # Barra de progreso total (~60 líneas)
├── CircuitControls.tsx          # Botones play/pause/skip (~100 líneas)
├── CircuitOverviewCard.tsx      # Vista previa de ejercicios (~120 líneas)
└── hooks/
    ├── use-circuit-timer-logic.ts  # Toda la lógica del timer (~200 líneas)
    ├── use-circuit-audio.ts        # Sonidos y audio (~50 líneas)
    └── types.ts                    # Tipos específicos del circuit
```

---

### 4.4 Refactor: TempoMetronomeV2 (1032 → ~500 líneas total)

**Prioridad**: 🟡 Media

**Nueva estructura**:

```
features/active-workout-v2/elements/TempoMetronome/
├── index.tsx                    # Modal container (~100 líneas)
├── MetronomeDisplay.tsx         # Visualización del tempo (~150 líneas)
├── MetronomeControls.tsx        # Botones de control (~80 líneas)
├── MetronomePhaseIndicator.tsx  # Indicador de fase actual (~80 líneas)
└── hooks/
    ├── use-metronome-timer.ts   # Lógica del metronome (~150 líneas)
    └── use-metronome-audio.ts   # Audio feedback (~80 líneas)
```

---

### 4.5 Refactor: ActiveSetRowV2 (737 → ~350 líneas total)

**Prioridad**: 🟡 Media

**Problema**: Componente con mucha lógica inline de completar sets, validar PRs, formatear valores, etc.

**Solución**: Extraer hooks específicos

**Nueva estructura**:

```
features/active-workout-v2/elements/
├── ActiveSetRowV2.tsx           # UI pura (~250 líneas)
└── hooks/
    ├── use-set-completion.ts    # Lógica de completar set (~150 líneas)
    ├── use-set-values.ts        # Getters de valores efectivos (~80 líneas)
    └── use-set-animations.ts    # Animaciones del row (~50 líneas)
```

**Extraer a `use-set-completion.ts`**:

```typescript
export const useSetCompletion = (
  setId: string,
  exerciseId: string,
  blockId: string
) => {
  const { completeSet, uncompleteSet } = useActiveSetActions();
  const { validatePR } = usePRLogic(exerciseId, setId);
  const haptic = useHaptic();

  const handleComplete = useCallback((values: SetValues) => {
    // Toda la lógica de getEffectiveValue, validatePR, etc.
  }, []);

  const handleUncomplete = useCallback(() => {
    // Lógica de descompletar
  }, []);

  return { handleComplete, handleUncomplete };
};
```

---

### 4.6 Estandarizar Estructura de Features

Todas las features deberían seguir esta estructura:

```
features/[feature-name]/
├── index.tsx              # Entry point (screen/feature principal)
├── components/            # Componentes específicos de la feature
│   ├── ComponentA/        # Si es complejo, carpeta con sub-componentes
│   │   ├── index.tsx
│   │   ├── SubComponent.tsx
│   │   └── hooks/
│   └── ComponentB.tsx     # Si es simple, archivo directo
├── hooks/                 # Hooks de la feature
│   ├── use-feature-store.ts  # Store si tiene estado global
│   ├── use-feature-data.ts   # Data fetching hooks
│   └── use-feature-logic.ts  # Business logic hooks
├── service/               # Business logic sin React
│   └── feature-service.ts
├── utils/                 # Helpers puros
│   └── helpers.ts
├── constants/             # Constantes y configuración
│   └── config.ts
└── types/                 # Tipos específicos de la feature
    └── index.ts
```

**Features que necesitan reorganización**:

- [ ] `tracker-v2` - Tiene `types.ts` suelto, mover a `types/`
- [ ] `active-workout-v2` - `elements/` debería ser `components/`
- [ ] `routine-form-v2` - `shared/` es confuso, renombrar
- [ ] `profile-v2` - Falta `hooks/` y `service/`
- [ ] `onboarding` - Screens muy largos, extraer componentes

---

### 4.7 Reglas de Nomenclatura

| Tipo          | Patrón                 | Ejemplo              |
| ------------- | ---------------------- | -------------------- |
| Componente    | PascalCase + V2 suffix | `MetricCardV2.tsx`   |
| Hook          | use-kebab-case         | `use-metric-data.ts` |
| Service       | kebab-case + service   | `tracker-service.ts` |
| Types         | kebab-case o index     | `types/index.ts`     |
| Constants     | kebab-case             | `templates.ts`       |
| Utils/Helpers | kebab-case             | `store-helpers.ts`   |

**Sufijo V2**: Mantenerlo solo en componentes de UI para indicar la versión del design system. No usarlo en hooks, services, utils.

---

### 4.8 Checklist de Refactor por Archivo

Para cada archivo grande, seguir este proceso:

1. **Identificar responsabilidades**

   - ¿Qué hace este archivo? Listar todas las responsabilidades
   - ¿Cuáles son lógica de negocio vs UI vs estado?

2. **Planificar división**

   - Cada responsabilidad = potencial nuevo archivo
   - Hooks para lógica con estado React
   - Utils para lógica pura
   - Componentes para UI

3. **Extraer de abajo hacia arriba**

   - Primero extraer lo más independiente
   - Luego lo que depende de lo extraído
   - El archivo original queda como "orquestador"

4. **Actualizar imports**

   - Re-exportar desde `index.ts` si es necesario
   - Actualizar todos los archivos que importan

5. **Verificar que funciona**
   - La app debe funcionar igual después del refactor
   - No hay cambios de comportamiento

---

## 🆕 FASE 5: Agregar Capas Faltantes (2-3 días)

### 4.1 Expandir Query Keys

**Archivo**: `shared/queries/query-keys.ts`

Agregar keys faltantes:

```typescript
export const queryKeys = {
  // ... existentes ...

  // PRs
  prs: {
    all: ["prs"] as const,
    current: (userId: string) =>
      [...queryKeys.prs.all, "current", userId] as const,
    history: (exerciseId: string) =>
      [...queryKeys.prs.all, "history", exerciseId] as const,
  },

  // Tracker
  tracker: {
    all: ["tracker"] as const,
    metrics: (userId: string) =>
      [...queryKeys.tracker.all, "metrics", userId] as const,
    entries: (metricId: string, dateRange?: { from: string; to: string }) =>
      [...queryKeys.tracker.all, "entries", metricId, dateRange] as const,
    daily: (userId: string, dayKey: string) =>
      [...queryKeys.tracker.all, "daily", userId, dayKey] as const,
  },

  // User
  user: {
    all: ["user"] as const,
    preferences: (userId: string) =>
      [...queryKeys.user.all, "preferences", userId] as const,
    profile: (userId: string) =>
      [...queryKeys.user.all, "profile", userId] as const,
  },
} as const;
```

---

### 4.2 Crear Custom Hooks para Mutations Comunes

**Archivo**: `shared/hooks/mutations/use-routine-mutations.ts`

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/queries/query-keys";
import { routinesRepository } from "@/shared/db/repository/routines";
import { useSync } from "@/shared/sync/hooks";

export const useDeleteRoutine = () => {
  const queryClient = useQueryClient();
  const { sync } = useSync();

  return useMutation({
    mutationFn: async (routineId: string) => {
      await routinesRepository.deleteRoutineById(routineId);
      return routineId;
    },
    onSuccess: (routineId) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: queryKeys.workouts.routines.all(),
      });

      // Sync en background
      sync("ROUTINE_DELETE", { id: routineId });
    },
  });
};

export const useUpdateRoutineFolder = () => {
  const queryClient = useQueryClient();
  const { sync } = useSync();

  return useMutation({
    mutationFn: async ({
      routineId,
      folderId,
    }: {
      routineId: string;
      folderId: string | null;
    }) => {
      await routinesRepository.updateRoutineFolderId(routineId, folderId);
      return { routineId, folderId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.workouts.routines.all(),
      });
    },
  });
};
```

---

### 4.3 Reemplazar console.log con Logger

**Buscar y reemplazar** en todo el proyecto:

- `console.log(` → `logger.info(` o `logger.debug(`
- `console.error(` → `logger.error(`
- `console.warn(` → `logger.warn(`

Mantener los que son del sync engine ya que tienen formato específico, pero migrarlos a `logger.sync()`.

---

## 🧪 FASE 6: Testing (5-7 días)

### 5.1 Setup de Testing

**Instalar dependencias**:

```bash
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native jest-expo
```

**Crear**: `jest.config.js`

```javascript
module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testPathIgnorePatterns: ["/node_modules/", "/android/", "/ios/"],
};
```

---

### 5.2 Tests Prioritarios (por orden de importancia)

#### 1. **Utils y Helpers** (más fácil, mayor coverage)

```
shared/utils/__tests__/
├── validation.test.ts
├── timezone.test.ts
└── pr.test.ts

features/active-workout-v2/utils/__tests__/
└── store-helpers.test.ts

features/routine-form-v2/utils/__tests__/
└── store-helpers.test.ts
```

#### 2. **Services** (business logic crítica)

```
features/tracker-v2/service/__tests__/
└── tracker.test.ts

shared/services/__tests__/
├── haptic-service.test.ts
└── timer-service.test.ts
```

#### 3. **Repositories** (data layer)

```
shared/db/repository/__tests__/
├── routines.test.ts
├── workout-sessions.test.ts
└── pr.test.ts
```

#### 4. **Sync Engine** (crítico para offline)

```
shared/sync/__tests__/
├── sync-engine.test.ts
├── queue/sync-queue-repository.test.ts
└── utils/backoff-calculator.test.ts
```

#### 5. **Components UI** (snapshot + interaction)

```
shared/ui/__tests__/
├── button.test.tsx
├── typography.test.tsx
└── measurement-input.test.tsx
```

---

## 📊 Checklist de Progreso

### Fase 1: Configs

- [ ] ESLint config mejorado
- [ ] TypeScript más estricto
- [ ] Logger service creado
- [ ] Zod instalado + schemas base

### Fase 2: Estructuras

- [ ] Error Boundary global
- [ ] API Layer abstraction
- [ ] Service layer estandarizado en todas las features

### Fase 3: Stores

- [ ] `use-active-workout-store` dividido en slices
- [ ] `use-routine-form-store` dividido en slices

### Fase 4: Estructura de Archivos

- [ ] `MetricModalV2` dividido en sub-componentes
- [ ] `CircuitTimerModeV2` dividido en sub-componentes
- [ ] `TempoMetronomeV2` dividido en sub-componentes
- [ ] `ActiveSetRowV2` lógica extraída a hooks
- [ ] Features reorganizadas con estructura estándar

### Fase 5: Capas

- [ ] Query keys expandidos
- [ ] Mutation hooks comunes
- [ ] console.log → logger

### Fase 6: Testing

- [ ] Jest configurado
- [ ] Tests de utils
- [ ] Tests de services
- [ ] Tests de repositories
- [ ] Tests de sync engine
- [ ] Tests de UI components

---

## ⏱️ Estimación Total

| Fase      | Tiempo Estimado |
| --------- | --------------- |
| Fase 1    | 1-2 días        |
| Fase 2    | 2-3 días        |
| Fase 3    | 3-5 días        |
| Fase 4    | 3-4 días        |
| Fase 5    | 2-3 días        |
| Fase 6    | 5-7 días        |
| **Total** | **16-24 días**  |

---

## 💡 Tips para el Refactor

1. **Commits pequeños**: Un cambio por commit, fácil de revertir
2. **Branch por fase**: `refactor/phase-1-configs`, `refactor/phase-2-patterns`, etc.
3. **No romper main**: Cada fase debe dejar la app funcional
4. **Migrar gradualmente**: No reescribir todo de una, feature por feature
5. **Documentar decisiones**: Agregar comentarios en código explicando el "por qué"

---

> **Siguiente paso recomendado**: Empezar por Fase 1.1 (ESLint) ya que es el cambio de menor riesgo y mayor valor inmediato.
