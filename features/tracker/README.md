# 📊 Tracker Feature

La feature **Tracker** permite registrar y visualizar métricas diarias de salud/fitness
(ej: agua, proteína, peso corporal, estado de ánimo, suplementos).  
Está diseñada con un **sistema de inputs flexible** que se adapta al tipo de dato, preparada para migrar a un backend en el futuro.

---

## 🚀 Concepto de Producto

- Un **usuario** puede definir distintas **métricas** con diferentes tipos de input.
- Cada métrica tiene un **tipo de input** que determina la UI y comportamiento:
  - `numeric_accumulative`: valores que se suman (agua, pasos, proteína).
  - `numeric_single`: valores únicos que se reemplazan (peso, horas de sueño).
  - `scale_discrete`: escalas fijas (estado de ánimo 1-5, energía 1-10).
  - `boolean_toggle`: actividades sí/no (suplementos, ejercicio).
- Cada vez que el usuario registra un valor, se crea una **entrada** (`Entry`) con display y valor normalizado.
- El sistema calcula automáticamente los **agregados diarios** (`DailyAggregate`) para consultas rápidas.

---

## 📐 Types Principales

### `IMetricInputType` - Sistema de Inputs Flexible

```ts
export type IMetricInputType =
  | "numeric_accumulative" // Agua, proteína, pasos - usa quick_actions
  | "numeric_single" // Peso, horas de sueño - usa quick_actions
  | "scale_discrete" // Estado de ánimo (1-5), energía (1-10) - usa inputConfig
  | "boolean_toggle"; // Suplementos, hábitos - usa inputConfig
```

### `IMetricBehavior` - Comportamiento de Datos

```ts
export type IMetricBehavior = "accumulate" | "replace";
```

- `accumulate`: valores se suman durante el día (agua, pasos).
- `replace`: solo importa el último valor (peso, estado de ánimo).

### `IMetricInputConfig` - Configuración Fija

```ts
export type IMetricInputConfig = {
  // Para scale_discrete
  scaleLabels?: string[]; // ['Terrible', 'Malo', 'Normal', 'Bueno', 'Excelente']
  scaleIcons?: string[]; // ['Frown', 'Meh', 'Minus', 'Smile', 'Laugh']
  min?: number; // 1
  max?: number; // 5
  step?: number; // 1

  // Para boolean_toggle
  booleanLabels?: {
    false: string; // 'No tomé'
    true: string; // 'Tomé suplementos'
  };
};
```

### `IMetricDefinition` - Nueva Arquitectura

```ts
export type IMetricDefinition = {
  id: UUID;
  slug?: string;
  name: string;

  // NUEVO SISTEMA
  inputType: IMetricInputType;
  behavior: IMetricBehavior;

  // MUTUAMENTE EXCLUSIVOS
  inputConfig?: IMetricInputConfig; // Para scale_discrete & boolean_toggle
  // quick_actions se pasan por separado para numeric types

  unit: string;
  canonicalUnit?: string;
  conversionFactor?: number;
  defaultTarget?: number | null;
  settings?: Record<string, any>;
  createdAt: string;
  updatedAt?: string;
  color: string;
  icon: string;
};
```

**Conceptos Clave:**

- `inputConfig` es **fijo y no personalizable** (escalas, toggles).
- `quick_actions` son **personalizables** (solo para tipos numéricos).
- **Nunca coexisten**: una métrica usa inputConfig O quick_actions.

---

### `IQuickAction`

```ts
export type IQuickAction = {
  id: UUID;
  metricId: UUID;
  label: string;
  value: number;
  valueNormalized?: number;
  position?: number;
  createdAt?: string;
};
```

Atajos predefinidos para registrar rápido una entrada.  
Ejemplo: para el agua → `label: "250 ml", value: 250`.

---

### `IEntry` - Sistema Mejorado

```ts
export type IEntry = {
  id: UUID;
  metricId: UUID;
  value: number; // Valor numérico normalizado
  valueNormalized: number; // Para compatibilidad
  unit: string;
  notes?: string | null;
  source?: "manual" | "quick_action" | "sync" | string;
  createdAt: string;
  updatedAt: string;
  dayKey: string;
  createdBy?: string | null;
  meta?: Record<string, any>;

  // NUEVOS CAMPOS para el sistema mejorado
  displayValue?: string; // '😃 Excelente', '✅ Completado', '2.5L'
  rawInput?: any; // Input original antes de normalización
};
```

**Ejemplos de `displayValue`:**

- Estado de ánimo: `"😃 Excelente"` (value: 5)
- Suplementos: `"✅ Completado"` (value: 1)
- Agua: `"250ml"` (value: 250)

---

### `IDailyAggregate`

```ts
export type IDailyAggregate = {
  metricId: UUID;
  dayKey: string;
  sumNormalized: number;
  count: number;
  minNormalized?: number | null;
  maxNormalized?: number | null;
};
```

Resumen de un día y una métrica.

- `sumNormalized`: suma total del día (ej: 2000 ml de agua).
- `count`: cantidad de entradas registradas.
- `minNormalized` / `maxNormalized`: valores extremos (útil en métricas tipo `value`, ej: peso corporal).

---

## 🎯 Sistema de Inputs

### Arquitectura de Componentes

```
MetricModal
├── MetricInputSection (Nuevo)
    ├── DiscreteScaleInput    // scale_discrete
    ├── BooleanToggleInput    // boolean_toggle
    └── NumericInput          // numeric_accumulative & numeric_single
```

### Lógica de Selección

```ts
const inputMethod = getInputMethod(metric.inputType);

switch (inputMethod) {
  case "input_config":
    // Usa DiscreteScaleInput o BooleanToggleInput
    // Configuración fija, no personalizable
    break;

  case "quick_actions":
    // Usa NumericInput con quick actions
    // Personalizable por el usuario
    break;
}
```

### Ejemplos de Métricas

**🥤 Agua (numeric_accumulative + quick_actions)**

```ts
{
  inputType: 'numeric_accumulative',
  behavior: 'accumulate',
  // Usa quick_actions: [250ml, 500ml, 1L]
}
```

**😊 Estado de Ánimo (scale_discrete + inputConfig)**

```ts
{
  inputType: 'scale_discrete',
  behavior: 'replace',
  inputConfig: {
    scaleLabels: ['Terrible', 'Malo', 'Normal', 'Bueno', 'Excelente'],
    scaleIcons: ['Frown', 'Meh', 'Minus', 'Smile', 'Laugh'],
    min: 1, max: 5
  }
}
```

**💊 Suplementos (boolean_toggle + inputConfig)**

```ts
{
  inputType: 'boolean_toggle',
  behavior: 'replace',
  inputConfig: {
    booleanLabels: {
      false: 'No tomé',
      true: 'Tomé suplementos'
    }
  }
}
```

---

## 🛠 Store y Hooks

### Hooks Principales

- `useAddEntry()`: Agrega entrada con display automático.
- `useTrackerStats()`: Estadísticas y agregados diarios.
- `useTrackerData()`: Datos completos de métricas y entradas.

---

### 🔑 Métodos

#### **Metric Actions**

- `addMetric(def: IMetricDefinition)` → agrega una nueva métrica.
- `updateMetric(id: UUID, patch: Partial<IMetricDefinition>)` → modifica datos.
- `removeMetric(id: UUID)` → elimina métrica y entradas asociadas.

#### **Entry Actions**

- `addEntry(entry: Omit<IEntry, 'id' | 'createdAt' | 'updatedAt'>)`  
  Inserta una entrada y recalcula agregados diarios.
- `updateEntry(id: UUID, patch: Partial<IEntry>)`  
  Modifica una entrada existente y actualiza agregados.
- `removeEntry(id: UUID)`  
  Borra la entrada y actualiza agregados.
- `getEntriesByDay(dayKey: string, metricId?: UUID)`  
  Obtiene todas las entradas de un día, filtrando por métrica si se indica.

#### **Aggregate Actions**

- `recalculateAggregates(dayKey: string, metricId?: UUID)`  
  Recalcula totales de un día y opcionalmente de una métrica específica.
- `getDailyAggregate(dayKey: string, metricId: UUID)`  
  Retorna el agregado precomputado.

#### **Quick Action**

- `addQuickAction(action: IQuickAction)`
- `removeQuickAction(id: UUID)`

#### **UI Actions**

- `setSelectedDate(dayKey: string)`
- `showMetricModal(metricId: UUID)`
- `hideMetricModal()`

---

## 🧠 Ejemplos de Uso

### Entrada Numérica (Agua)

```ts
const addEntryMutation = useAddEntry();

// Usuario selecciona quick action "250ml"
await addEntryMutation.mutateAsync({
  metricId: "water-uuid",
  value: 250,
  displayValue: "250ml", // Generado automáticamente
  recordedAt: "2025-01-16",
  source: "quick_action",
});
```

### Entrada de Escala (Estado de Ánimo)

```ts
// Usuario selecciona nivel 4 en escala 1-5
await addEntryMutation.mutateAsync({
  metricId: "mood-uuid",
  value: 4,
  displayValue: "😊 Bueno", // Generado desde inputConfig
  recordedAt: "2025-01-16",
  source: "manual",
});
```

### Entrada Boolean (Suplementos)

```ts
// Usuario activa toggle
await addEntryMutation.mutateAsync({
  metricId: "supplements-uuid",
  value: 1,
  displayValue: "✅ Tomé suplementos", // Generado desde inputConfig
  recordedAt: "2025-01-16",
  source: "manual",
});
```

---

## � Estado de Migración

### ✅ Completado

- ✅ Nuevo sistema de tipos (`IMetricInputType`, `IMetricBehavior`)
- ✅ Arquitectura híbrida (inputConfig vs quick_actions)
- ✅ Schema de base de datos actualizado + migración
- ✅ Mock data reestructurado con nuevos tipos
- ✅ Componentes UI especializados con diseño consistente
- ✅ Repository con método `createEntryWithDisplay`
- ✅ Integración inteligente en MetricModal (preserva UX original)
- ✅ Código limpio sin referencias legacy

### 🎯 Ready for Testing

- 📱 Sistema completo implementado y funcionando
- 🎨 UI consistente con dark/light mode support
- 🔄 Lógica de entrada diferenciada por tipo de métrica
- ✨ UX original preservada para tipos numéricos

### 📋 Futuro

- 📋 Testing en dispositivo real
- 📋 Gráficas y estadísticas avanzadas
- 📋 Configuración personalizable de quick_actions
- 📋 Sync multi-device
- 📋 Export/import de datos

## 🔮 Futuro

- **Tipos adicionales**: `range_slider`, `time_duration`, `location_picker`.
- **IA/ML**: Predicciones y recomendaciones basadas en patrones.
- **Integrations**: Apple Health, Google Fit, wearables.
- **Social**: Compartir progreso y competencias amigables.
