/**
 * Centralized color palette for metrics
 * Used by both predefined and custom metrics
 */
export const METRIC_COLORS = {
  // Existing predefined colors (from current metrics)
  GREEN: "#10B981", // protein
  BLUE: "#3B82F6", // water
  AMBER: "#F59E0B", // calories, mood
  VIOLET: "#8B5CF6", // steps
  INDIGO: "#6366F1", // sleep
  RED: "#EF4444", // weight

  // Additional options for custom metrics
  EMERALD: "#059669",
  CYAN: "#0891B2",
  ORANGE: "#EA580C",
  PINK: "#DB2777",
  PURPLE: "#7C3AED",
  SLATE: "#475569",
  LIME: "#65A30D",
  TEAL: "#0D9488",
  ROSE: "#E11D48",
  SKY: "#0284C7",
  YELLOW: "#CA8A04",
  GRAY: "#6B7280",
} as const;

export type MetricColorKey = keyof typeof METRIC_COLORS;
export type MetricColorValue = (typeof METRIC_COLORS)[MetricColorKey];

/**
 * Array of available colors for metric selection
 * Ordered by preference/common usage
 */
export const METRIC_COLOR_OPTIONS: MetricColorValue[] = [
  METRIC_COLORS.BLUE,
  METRIC_COLORS.GREEN,
  METRIC_COLORS.VIOLET,
  METRIC_COLORS.INDIGO,
  METRIC_COLORS.RED,
  METRIC_COLORS.AMBER,
  METRIC_COLORS.EMERALD,
  METRIC_COLORS.CYAN,
  METRIC_COLORS.ORANGE,
  METRIC_COLORS.PINK,
  METRIC_COLORS.PURPLE,
  METRIC_COLORS.TEAL,
  METRIC_COLORS.LIME,
  METRIC_COLORS.SKY,
  METRIC_COLORS.ROSE,
  METRIC_COLORS.YELLOW,
  METRIC_COLORS.SLATE,
  METRIC_COLORS.GRAY,
];

/**
 * Helper to get color name from value
 */
export const getMetricColorName = (colorValue: string): string => {
  const entry = Object.entries(METRIC_COLORS).find(
    ([_, value]) => value === colorValue
  );
  return entry ? entry[0].toLowerCase() : "custom";
};
