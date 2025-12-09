import type { MeasurementTemplateId } from "@/shared/types/measurement";

/**
 * PR Score Configuration for each measurement template
 *
 * Each template has:
 * - scoreName: Translation key for the score type
 * - scoreUnit: Unit string for the score
 * - calculate: Function to compute PR score from primary/secondary values
 */
export interface PRScoreConfig {
  scoreName: string;
  scoreUnit: string;
  calculate: (primaryValue: number, secondaryValue?: number | null) => number;
}

export const PR_SCORE_CONFIG: Record<MeasurementTemplateId, PRScoreConfig> = {
  // ═══════════════════════════════════════════════════════════════
  // STRENGTH: Estimated 1RM (Epley formula)
  // Primary: weight (kg), Secondary: reps
  // ═══════════════════════════════════════════════════════════════
  weight_reps: {
    scoreName: "estimated_1rm",
    scoreUnit: "kg",
    calculate: (weight, reps) => weight * (1 + (reps || 0) / 30),
  },

  weight_reps_range: {
    scoreName: "estimated_1rm",
    scoreUnit: "kg",
    calculate: (weight, reps) => weight * (1 + (reps || 0) / 30),
  },

  // ═══════════════════════════════════════════════════════════════
  // TIME-BASED: Longest Duration
  // Primary: duration (seconds), Secondary: null
  // ═══════════════════════════════════════════════════════════════
  time_only: {
    scoreName: "longest_hold",
    scoreUnit: "sec",
    calculate: (duration) => duration,
  },

  // ═══════════════════════════════════════════════════════════════
  // WEIGHTED TIME: TUT Volume (Time Under Tension × Load)
  // Primary: weight (kg), Secondary: duration (seconds)
  // ═══════════════════════════════════════════════════════════════
  weight_time: {
    scoreName: "tut_volume",
    scoreUnit: "kg·s",
    calculate: (weight, duration) => weight * (duration || 0),
  },

  // ═══════════════════════════════════════════════════════════════
  // DISTANCE: Longest Distance
  // Primary: distance (meters), Secondary: null
  // ═══════════════════════════════════════════════════════════════
  distance_only: {
    scoreName: "longest_distance",
    scoreUnit: "m",
    calculate: (distance) => distance,
  },

  // ═══════════════════════════════════════════════════════════════
  // DISTANCE + TIME: Longest Distance (time is secondary info)
  // Primary: distance (km), Secondary: time (minutes)
  // ═══════════════════════════════════════════════════════════════
  distance_time: {
    scoreName: "longest_distance",
    scoreUnit: "km",
    calculate: (distance, _time) => distance, // Time stored but not used for PR score
  },

  // ═══════════════════════════════════════════════════════════════
  // WEIGHTED DISTANCE: Total Work
  // Primary: weight (kg), Secondary: distance (meters)
  // ═══════════════════════════════════════════════════════════════
  weight_distance: {
    scoreName: "total_work",
    scoreUnit: "kg·m",
    calculate: (weight, distance) => weight * (distance || 0),
  },
};

/**
 * Calculate PR score for a given template and values
 */
export const computePRScore = (
  template: MeasurementTemplateId,
  primaryValue: number,
  secondaryValue?: number | null
): number => {
  const config = PR_SCORE_CONFIG[template];
  if (!config) return 0;
  return config.calculate(primaryValue, secondaryValue);
};

/**
 * Check if new score is a PR (better than current)
 * Returns true if newScore beats currentScore
 */
export const isPRBetter = (
  newScore: number,
  currentScore: number | null | undefined
): boolean => {
  if (currentScore == null) return true;
  // Small epsilon for floating point comparison
  return newScore > currentScore + 0.0001;
};

/**
 * Get score config for a template
 */
export const getPRScoreConfig = (
  template: MeasurementTemplateId
): PRScoreConfig => {
  return PR_SCORE_CONFIG[template];
};

/**
 * Check if a template supports PR tracking
 * All templates now support PRs!
 */
export const supportsPRTracking = (
  _template: MeasurementTemplateId
): boolean => {
  return true;
};

// ═══════════════════════════════════════════════════════════════
// Legacy functions (kept for backwards compatibility during migration)
// ═══════════════════════════════════════════════════════════════

export const computeEpley1RM = (weight: number, reps: number): number => {
  if (!weight || !reps) return 0;
  return weight * (1 + reps / 30);
};

export const isGreaterPR = (a: number | null, b: number | null): boolean => {
  if (a == null) return true;
  if (b == null) return true;
  return a > b + 1e-6;
};
