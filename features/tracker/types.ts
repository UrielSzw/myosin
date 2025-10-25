import { icons } from "lucide-react-native";

export type UUID = string; // recomiendo UUIDv4 si habrá sync, sino number/integer local-only

export type IDateString = string; // formato 'YYYY-MM-DD'
export type IIsoDateString = string; // formato 'YYYY-MM-DDTHH:mm:ss.sssZ'

// NEW INPUT SYSTEM
export type IMetricInputType =
  | "numeric_accumulative" // Water, protein, steps - uses quick_actions
  | "numeric_single" // Weight, sleep hours - uses quick_actions
  | "scale_discrete" // Mood (1-5), energy (1-10) - uses inputConfig
  | "boolean_toggle"; // Supplements, habits - uses inputConfig

export type IMetricBehavior = "accumulate" | "replace";

export type IMetricIconKey =
  | "Droplets"
  | "Beef"
  | "Flame"
  | "Footprints"
  | "Moon"
  | "Scale"
  | "Smile"
  | "Zap"
  | "Pill";

export type IQuickActionIconKey = keyof typeof icons;

// INPUT CONFIG - FIXED, NOT CUSTOMIZABLE
export type IMetricInputConfig = {
  // For scale_discrete
  scaleLabels?: string[]; // ['Terrible', 'Malo', 'Normal', 'Bueno', 'Excelente']
  scaleIcons?: string[]; // ['Frown', 'Meh', 'Smile', 'Grin', 'PartyPopper']
  min?: number; // 1
  max?: number; // 5
  step?: number; // 1

  // For boolean_toggle
  booleanLabels?: {
    false: string; // 'No tomé'
    true: string; // 'Tomé suplementos'
  };
};

export type IMetricDefinition = {
  id: UUID;
  slug?: string; // identificador único legible: 'water', 'protein'
  name: string; // 'Agua'

  // NEW SYSTEM
  inputType: IMetricInputType;
  behavior: IMetricBehavior;

  // EITHER inputConfig (fixed) OR quick_actions (customizable) - NEVER BOTH
  inputConfig?: IMetricInputConfig; // For scale_discrete & boolean_toggle

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
  source?: "manual" | "quick_action" | "sync" | string;
  createdAt: IIsoDateString; // ISO timestamp
  updatedAt: IIsoDateString; // ISO timestamp
  dayKey: IDateString; // 'YYYY-MM-DD' computed at insert time
  createdBy?: string | null; // device/user id opcional
  meta?: Record<string, any>; // extensible

  // Enhanced display fields
  displayValue?: string; // '😃 Excelente', '✅ Completado', '2.5L'
  rawInput?: any; // Original input before normalization
};

export type IDailyAggregate = {
  metricId: UUID;
  dayKey: IDateString; // 'YYYY-MM-DD'
  sumNormalized: number;
  count: number;
  minNormalized?: number | null;
  maxNormalized?: number | null;
};

// UTILITY FUNCTIONS
export const usesQuickActions = (inputType: IMetricInputType): boolean => {
  return inputType === "numeric_accumulative" || inputType === "numeric_single";
};

export const usesInputConfig = (inputType: IMetricInputType): boolean => {
  return inputType === "scale_discrete" || inputType === "boolean_toggle";
};

export const getInputMethod = (
  inputType: IMetricInputType
): "quick_actions" | "input_config" => {
  return usesQuickActions(inputType) ? "quick_actions" : "input_config";
};
