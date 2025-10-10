# 📊 Tracker Feature

La feature **Tracker** permite registrar y visualizar métricas diarias de salud/fitness 
(ej: agua, proteína, peso corporal, pasos).  
Está diseñada para ser flexible, extensible y preparada para migrar a un backend en el futuro.

---

## 🚀 Concepto de Producto

- Un **usuario** puede definir distintas **métricas** (ej: "Agua" en ml, "Peso corporal" en kg).
- Cada métrica tiene un **tipo**:
  - `counter`: se acumula sumando valores (ej: pasos, agua, calorías).
  - `value`: un único valor absoluto que reemplaza el anterior (ej: peso corporal).
- Cada vez que el usuario registra un valor, se crea una **entrada** (`Entry`).
- El sistema calcula automáticamente los **agregados diarios** (`DailyAggregate`) para consultas rápidas (ej: "hoy tomé 1500 ml de agua").

---

## 📐 Types Principales

### `MetricType`

```ts
export type MetricType = 'value' | 'counter';
```

- `counter`: valores acumulativos que se suman durante el día.  
- `value`: valores absolutos que se sobreescriben (solo importa el último).

---

### `IMetricDefinition`

```ts
export type IMetricDefinition = {
  id: UUID;
  slug: string;
  name: string;
  type: MetricType;
  unit?: string;
  canonicalUnit?: string;
  conversionFactor?: number;
  defaultTarget?: number | null;
  settings?: Record<string, any>;
  createdAt: string;
  updatedAt?: string;
};
```

Define una métrica disponible en el sistema.  
- `slug`: identificador legible (`'water'`, `'weight'`).  
- `unit`: unidad visible para el usuario (`'ml'`, `'kg'`).  
- `canonicalUnit` + `conversionFactor`: permiten normalizar a una unidad base (`ml`, `g`, `kcal`).  
- `defaultTarget`: objetivo opcional diario (`2000 ml de agua`).  

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

### `IEntry`

```ts
export type IEntry = {
  id: UUID;
  metricId: UUID;
  value: number;
  valueNormalized: number;
  unit: string;
  notes?: string | null;
  source?: 'manual' | 'quick_action' | 'sync' | string;
  createdAt: string;
  updatedAt: string;
  dayKey: string;
  createdBy?: string | null;
  meta?: Record<string, any>;
};
```

Registro individual de un valor ingresado.  
- `value`: lo que ingresó el usuario (ej: 250).  
- `valueNormalized`: valor convertido a la unidad canónica (ej: 250 ml → 0.25 L).  
- `dayKey`: fecha normalizada (`YYYY-MM-DD`) para agrupar en el día.  
- `source`: permite saber si fue manual, quick action, o sync.  

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

## 🛠 Store: `useTrackerStore`

La store con **Zustand + Immer** centraliza el estado y acciones.  
Esto permite acceder y modificar métricas, entradas y agregados de manera global.

### Estado Principal
- `metrics`: lista de métricas definidas (`IMetricDefinition[]`).
- `entries`: registros diarios (`IEntry[]`).
- `aggregates`: cache de agregados diarios (`IDailyAggregate[]`).
- `quickActions`: atajos configurados (`IQuickAction[]`).
- `selectedDate`: fecha actual (`YYYY-MM-DD`).
- `ui`: flags para modales o selección de métricas.

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

## 🧠 Ejemplo de Uso

```ts
const { entryActions, aggregateActions } = useTrackerStore.getState();

// Registrar 250 ml de agua
entryActions.addEntry({
  metricId: 'water-uuid',
  value: 250,
  valueNormalized: 250, // ya en ml, no necesita conversión
  unit: 'ml',
  dayKey: '2025-08-16',
  source: 'manual',
});

// Consultar agregado diario
const waterToday = aggregateActions.getDailyAggregate('2025-08-16', 'water-uuid');
// waterToday.sumNormalized === 250
```

---

## 🔮 Futuro

- Integración con **SQLite** o backend remoto.  
- Sync multi-device usando `UUID`.  
- Extensión de `MetricType` con más categorías (`boolean`, `range`).  
- Historial y gráficas basadas en `IDailyAggregate`.
