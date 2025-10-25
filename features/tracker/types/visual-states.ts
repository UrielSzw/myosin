import type {
  TrackerDayData,
  TrackerMetricWithQuickActions,
} from "@/shared/db/schema/tracker";
import { getInputConfig } from "../constants/templates";

/**
 * Estados visuales diferenciados para métricas
 */
export type MetricVisualState =
  | "no_entry" // Sin entradas en el día
  | "has_entry" // Tiene entradas (cualquier valor)
  | "completed"; // Meta alcanzada (solo acumulativas)

/**
 * Datos de display procesados para renderizado optimizado
 */
export type MetricDisplayData = {
  state: MetricVisualState;
  hasEntry: boolean;
  currentValue: number;
  displayText: string;
  backgroundColor: string;
  borderColor: string;
  iconColor: string;
  textColor: string;
  iconName: string;
  showProgressRing: boolean;
  progressPercentage: number | null;
};

/**
 * Helper principal para obtener datos de display de cualquier métrica
 * Optimizado para performance con cálculos eficientes
 */
export const getMetricDisplayData = (
  metric: TrackerMetricWithQuickActions,
  metricData: TrackerDayData["metrics"][0] | undefined,
  colors: any // Color scheme from hook
): MetricDisplayData => {
  const hasEntry = (metricData?.entries?.length || 0) > 0;
  const currentValue = metricData?.aggregate?.sum_normalized || 0;

  // Determinar estado visual base
  let state: MetricVisualState = "no_entry";
  if (hasEntry) {
    state = "has_entry";
    // Solo métricas acumulativas pueden estar "completed"
    if (metric.input_type === "numeric_accumulative" && metric.default_target) {
      const progressPercentage = Math.min(
        (currentValue / metric.default_target) * 100,
        100
      );
      if (progressPercentage >= 100) {
        state = "completed";
      }
    }
  }

  // Lógica específica por tipo de métrica
  switch (metric.input_type) {
    case "boolean_toggle":
      return getBooleanDisplayData(metric, hasEntry, currentValue, colors);
    case "scale_discrete":
      return getScaleDisplayData(metric, hasEntry, currentValue, colors);
    default:
      return getNumericDisplayData(
        metric,
        hasEntry,
        currentValue,
        state,
        colors
      );
  }
};

/**
 * Display data para métricas boolean (vitaminas, suplementos)
 */
const getBooleanDisplayData = (
  metric: TrackerMetricWithQuickActions,
  hasEntry: boolean,
  currentValue: number,
  colors: any
): MetricDisplayData => {
  if (!hasEntry) {
    return {
      state: "no_entry",
      hasEntry: false,
      currentValue: 0,
      displayText: "Sin registrar",
      backgroundColor: colors.surface,
      borderColor: colors.border,
      iconColor: colors.gray[400],
      textColor: colors.textMuted,
      iconName: metric.icon, // Mostrar ícono de la métrica, no Circle genérico
      showProgressRing: false,
      progressPercentage: null,
    };
  }

  const isTrue = currentValue > 0;

  return {
    state: "has_entry",
    hasEntry: true,
    currentValue,
    displayText: isTrue ? "Completado" : "No realizado",
    backgroundColor: isTrue ? "#10B98110" : "#EF444410",
    borderColor: isTrue ? "#10B981" : "#EF4444",
    iconColor: isTrue ? "#10B981" : "#EF4444",
    textColor: isTrue ? "#10B981" : "#EF4444",
    iconName: isTrue ? "CheckCircle" : "XCircle",
    showProgressRing: false,
    progressPercentage: null,
  };
};

/**
 * Display data para métricas de escala (humor, estrés, calidad sueño)
 */
const getScaleDisplayData = (
  metric: TrackerMetricWithQuickActions,
  hasEntry: boolean,
  currentValue: number,
  colors: any
): MetricDisplayData => {
  if (!hasEntry) {
    return {
      state: "no_entry",
      hasEntry: false,
      currentValue: 0,
      displayText: "Sin registrar",
      backgroundColor: colors.surface,
      borderColor: colors.border,
      iconColor: colors.gray[400],
      textColor: colors.textMuted,
      iconName: metric.icon, // Mostrar ícono de la métrica, no Circle genérico
      showProgressRing: false,
      progressPercentage: null,
    };
  }

  // Obtener configuración de escala
  const config = getInputConfig(metric.slug);
  const value = Math.round(currentValue);

  // Type guard para verificar que es una configuración de escala
  const isScaleConfig =
    config &&
    "scaleLabels" in config &&
    "scaleIcons" in config &&
    "min" in config;

  if (!isScaleConfig) {
    return {
      state: "has_entry",
      hasEntry: true,
      currentValue,
      displayText: `Nivel ${value}`,
      backgroundColor: metric.color + "10",
      borderColor: metric.color,
      iconColor: metric.color,
      textColor: metric.color,
      iconName: metric.icon, // Usar ícono de la métrica como fallback
      showProgressRing: false,
      progressPercentage: null,
    };
  }

  const index = value - (config.min || 1);

  // Validar índice
  const isValidIndex =
    index >= 0 &&
    index < (config.scaleLabels?.length || 0) &&
    index < (config.scaleIcons?.length || 0);

  const displayText =
    isValidIndex && config.scaleLabels
      ? config.scaleLabels[index]
      : `Nivel ${value}`;

  const iconName =
    isValidIndex && config.scaleIcons ? config.scaleIcons[index] : "Circle";

  return {
    state: "has_entry",
    hasEntry: true,
    currentValue,
    displayText,
    backgroundColor: metric.color + "10",
    borderColor: metric.color,
    iconColor: metric.color,
    textColor: metric.color,
    iconName,
    showProgressRing: false,
    progressPercentage: null,
  };
};

/**
 * Display data para métricas numéricas (mantener comportamiento actual)
 */
const getNumericDisplayData = (
  metric: TrackerMetricWithQuickActions,
  hasEntry: boolean,
  currentValue: number,
  state: MetricVisualState,
  colors: any
): MetricDisplayData => {
  const isCompleted = state === "completed";

  // Calcular progreso para métricas con target
  let progressPercentage: number | null = null;
  if (metric.default_target && metric.default_target > 0) {
    progressPercentage = Math.min(
      (currentValue / metric.default_target) * 100,
      100
    );
  }

  // Formatear valor
  const formatValue = (value: number): string => {
    const rounded = Math.round(value * 100) / 100;
    return rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(2);
  };

  return {
    state,
    hasEntry,
    currentValue,
    displayText: `${formatValue(currentValue)} ${metric.unit}`,
    backgroundColor: colors.surface,
    borderColor: isCompleted ? metric.color : colors.border,
    iconColor: metric.color,
    // backgroundColor: isCompleted ? "#FFD70020" : colors.surface,
    // borderColor: isCompleted ? "#FFD700" : colors.border,
    // iconColor: isCompleted ? "#FFA500" : metric.color,
    textColor: metric.color,
    iconName: metric.icon,
    showProgressRing: true,
    progressPercentage,
  };
};
