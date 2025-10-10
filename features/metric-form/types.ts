import { MetricColorValue } from "@/shared/constants/metric-colors";
import { MetricIconKey } from "@/shared/constants/metric-icons";

/**
 * Form-specific types for metric creation/editing
 */
export interface QuickActionFormItem {
  id: string;
  label: string; // "Vaso grande (300ml)"
  value: number; // 0.3
  icon?: MetricIconKey; // Optional Lucide icon
  position: number; // Auto-managed order
}

export interface MetricFormData {
  // Basic info
  name: string; // "Mi Métrica Custom"
  slug: string; // Auto-generated "mi-metrica-custom"
  type: "counter" | "value"; // Metric type
  unit: string; // "ml", "kg", "reps"
  canonicalUnit?: string; // Advanced option (defaults to unit)
  conversionFactor?: number; // Advanced option (defaults to 1)
  defaultTarget?: number; // Optional daily target

  // Style
  icon: MetricIconKey; // Lucide icon name
  color: MetricColorValue; // Hex color from palette

  // Quick actions (optional)
  quickActions: QuickActionFormItem[];
}

export interface MetricValidationResult {
  isValid: boolean;
  isValidating: boolean;
  errors: {
    name?: string;
    slug?: string;
    unit?: string;
    target?: string;
  };
}

/**
 * Props for metric form feature
 */
export interface MetricFormFeatureProps {
  isEditMode?: boolean;
  existingMetricId?: string;
}

/**
 * Validation rules
 */
export const METRIC_VALIDATION_RULES = {
  name: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9\sáéíóúñü\-_]+$/,
  },
  slug: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-z0-9\-_]+$/,
  },
  unit: {
    minLength: 1,
    maxLength: 10,
    pattern: /^[a-zA-Z0-9%°\-_\/]+$/,
  },
  target: {
    min: 0,
    max: 999999,
  },
} as const;
