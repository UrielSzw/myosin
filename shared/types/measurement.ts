/**
 * Measurement System Types - New Architecture
 * Supports up to 2 metrics per exercise
 */

import type { DistanceUnit } from "../utils/distance-conversion";
import type { WeightUnit } from "../utils/weight-conversion";

export type MeasurementTemplateId =
  // Single metrics
  | "time_only"
  | "distance_only"
  // Dual metrics
  | "weight_reps"
  | "weight_reps_range"
  | "distance_time"
  | "weight_distance"
  | "weight_time";

export type MeasurementType = "weight" | "reps" | "range" | "distance" | "time";

export interface MeasurementField {
  id: "primary" | "secondary";
  type: MeasurementType;
  unit: string;
  label: string; // Header label (e.g., "KG", "REPS", "SEG")
}

export interface MeasurementTemplate {
  id: MeasurementTemplateId;
  name: string;
  description?: string;
  fields: [MeasurementField] | [MeasurementField, MeasurementField]; // 1 or 2 fields max
}

// Values stored in database
export interface MeasurementValues {
  primary_value?: number | null;
  secondary_value?: number | null;
  primary_range?: { min: number; max: number } | null;
  secondary_range?: { min: number; max: number } | null;
}

// UI/Form state for easier handling
export interface MeasurementFormValues {
  primary?: {
    type: MeasurementType;
    value?: number | null;
    range?: { min: number; max: number } | null;
  };
  secondary?: {
    type: MeasurementType;
    value?: number | null;
    range?: { min: number; max: number } | null;
  };
}

/**
 * Measurement Templates Configuration
 */
export const MEASUREMENT_TEMPLATES: Record<
  MeasurementTemplateId,
  MeasurementTemplate
> = {
  // === SINGLE METRICS ===
  time_only: {
    id: "time_only",
    name: "Solo Tiempo",
    description: "Para ejercicios isométricos como plancha, wall sit",
    fields: [{ id: "primary", type: "time", unit: "s", label: "SEG" }],
  },

  distance_only: {
    id: "distance_only",
    name: "Solo Distancia",
    description: "Para ejercicios de distancia sin tiempo",
    fields: [{ id: "primary", type: "distance", unit: "m", label: "METROS" }],
  },

  // === DUAL METRICS ===
  weight_reps: {
    id: "weight_reps",
    name: "Peso + Repeticiones",
    description: "Tradicional - ejercicios de fuerza con peso",
    fields: [
      { id: "primary", type: "weight", unit: "kg", label: "KG" },
      { id: "secondary", type: "reps", unit: "reps", label: "REPS" },
    ],
  },

  weight_reps_range: {
    id: "weight_reps_range",
    name: "Peso + Rango de Reps",
    description: "Peso fijo con rango de repeticiones (ej: 8-12 reps)",
    fields: [
      { id: "primary", type: "weight", unit: "kg", label: "KG" },
      { id: "secondary", type: "range", unit: "reps", label: "REPS" },
    ],
  },

  distance_time: {
    id: "distance_time",
    name: "Distancia + Tiempo",
    description: "Para cardio - correr, remar, ciclismo",
    fields: [
      { id: "primary", type: "distance", unit: "km", label: "KM" },
      { id: "secondary", type: "time", unit: "min", label: "MIN" },
    ],
  },

  weight_distance: {
    id: "weight_distance",
    name: "Peso + Distancia",
    description: "Para farmer's walk, sled push/pull",
    fields: [
      { id: "primary", type: "weight", unit: "kg", label: "KG" },
      { id: "secondary", type: "distance", unit: "m", label: "METROS" },
    ],
  },

  weight_time: {
    id: "weight_time",
    name: "Peso + Tiempo",
    description: "Para ejercicios isométricos con peso",
    fields: [
      { id: "primary", type: "weight", unit: "kg", label: "KG" },
      { id: "secondary", type: "time", unit: "s", label: "SEG" },
    ],
  },
};

/**
 * Helper functions
 */

export const getMeasurementTemplate = (
  templateId: MeasurementTemplateId,
  weightUnit?: WeightUnit,
  distanceUnit?: DistanceUnit
): MeasurementTemplate => {
  const template = MEASUREMENT_TEMPLATES[templateId];

  // Clone template and update fields based on user preferences
  return {
    ...template,
    fields: template.fields.map((field) => {
      if (field.type === "weight" && weightUnit) {
        return {
          ...field,
          unit: weightUnit,
          label: weightUnit.toUpperCase(),
        };
      }
      if (field.type === "distance" && distanceUnit) {
        // distance_only: meters -> feet
        // distance_time: km -> miles
        if (field.unit === "km") {
          return {
            ...field,
            unit: distanceUnit === "metric" ? "km" : "mi",
            label: distanceUnit === "metric" ? "KM" : "MI",
          };
        } else {
          // meters
          return {
            ...field,
            unit: distanceUnit === "metric" ? "m" : "ft",
            label: distanceUnit === "metric" ? "METROS" : "FEET",
          };
        }
      }
      return field;
    }) as [MeasurementField] | [MeasurementField, MeasurementField],
  };
};

export const getTemplatesByCategory = () => {
  const single: MeasurementTemplate[] = [];
  const dual: MeasurementTemplate[] = [];

  Object.values(MEASUREMENT_TEMPLATES).forEach((template) => {
    if (template.fields.length === 1) {
      single.push(template);
    } else {
      dual.push(template);
    }
  });

  return { single, dual };
};

export const hasWeightMeasurement = (
  templateId: MeasurementTemplateId
): boolean => {
  const template = getMeasurementTemplate(templateId);
  return template.fields.some((field) => field.type === "weight");
};

export const getDefaultTemplate = (): MeasurementTemplateId => "weight_reps";

// Type guards
export const isSingleMetricTemplate = (
  templateId: MeasurementTemplateId
): boolean => {
  return templateId === "time_only" || templateId === "distance_only";
};

export const isDualMetricTemplate = (
  templateId: MeasurementTemplateId
): boolean => {
  return !isSingleMetricTemplate(templateId);
};

/**
 * Check if a template supports PR calculation
 * ALL templates now support PRs with template-specific scores!
 */
export const supportsPRCalculation = (
  templateId: MeasurementTemplateId
): boolean => {
  // All measurement templates now support PR tracking
  return true;
};
