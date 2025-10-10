import { icons } from 'lucide-react-native';

export type UUID = string; // recomiendo UUIDv4 si habrá sync, sino number/integer local-only

export type IDateString = string; // formato 'YYYY-MM-DD'
export type IIsoDateString = string; // formato 'YYYY-MM-DDTHH:mm:ss.sssZ'

export type IMetricType = 'value' | 'counter'; // ejemplos

export type IMetricIconKey =
  | 'Droplets'
  | 'Beef'
  | 'Flame'
  | 'Footprints'
  | 'Moon'
  | 'Scale'
  | 'Smile';

export type IQuickActionIconKey = keyof typeof icons;

export type IMetricDefinition = {
  id: UUID;
  slug?: string; // identificador único legible: 'water', 'protein'
  name: string; // 'Agua'
  type: IMetricType;
  unit: string; // unidad para mostrar: 'ml', 'g', 'kcal'
  canonicalUnit?: string; // unidad interna para agregación, ej 'ml' o 'g'
  conversionFactor?: number; // multiplicador: raw_value * conversionFactor => canonical
  defaultTarget?: number | null;
  settings?: Record<string, any>; // precision, step, display hints
  createdAt: IIsoDateString; // ISO timestamp
  updatedAt?: IIsoDateString;
  color: string; // color en formato hexadecimal
  icon: IMetricIconKey;
};

export type IQuickAction = {
  id: UUID;
  metricId: UUID;
  label: string; // '250 ml'
  value: number; // valor raw (en la unidad de la metric)
  valueNormalized?: number; // opcional pre‑calculado
  position?: number;
  createdAt?: IIsoDateString;
  icon: IQuickActionIconKey;
  unit: string;
};

export type IEntry = {
  id: UUID;
  metricId: UUID;
  value: number; // raw tal como lo ingresó el usuario
  valueNormalized: number; // canonical: value * conversionFactor (guardar para agregados rápidos)
  unit: string; // snapshot de unidad al momento de entrada
  notes?: string | null;
  source?: 'manual' | 'quick_action' | 'sync' | string;
  createdAt: IIsoDateString; // ISO timestamp
  updatedAt: IIsoDateString; // ISO timestamp
  dayKey: IDateString; // 'YYYY-MM-DD' computed at insert time
  createdBy?: string | null; // device/user id opcional
  meta?: Record<string, any>; // extensible
};

export type IDailyAggregate = {
  metricId: UUID;
  dayKey: IDateString; // 'YYYY-MM-DD'
  sumNormalized: number;
  count: number;
  minNormalized?: number | null;
  maxNormalized?: number | null;
};
