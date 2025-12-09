/**
 * PR Display Formatters
 *
 * Provides template-aware formatting for PR values across all measurement templates.
 * Used by PR List, PR Detail, and celebration/toast components.
 */

import { PR_SCORE_CONFIG } from "@/shared/db/utils/pr";
import type { SupportedLanguage } from "@/shared/types/language";
import type { MeasurementTemplateId } from "@/shared/types/measurement";
import type { DistanceUnit } from "./distance-conversion";
import { fromKm, fromMeters } from "./distance-conversion";
import type { WeightUnit } from "./weight-conversion";
import { fromKg } from "./weight-conversion";

/**
 * Result of formatting a PR for display
 */
export interface PRDisplayData {
  /** Main value display (e.g., "100 kg × 5", "2:35", "5.2 km") */
  mainDisplay: string;
  /** Primary value only (e.g., "100 kg", "2:35", "5.2 km") - for compact displays */
  primaryDisplay: string;
  /** Secondary value only (e.g., "5 reps", "30s", null) - for compact displays */
  secondaryDisplay: string | null;
  /** Score display (e.g., "116.7 kg", "155 s", "5.2 km") */
  scoreDisplay: string;
  /** Score name (e.g., "Est. 1RM", "Duration", "Distance") */
  scoreName: string;
}

/**
 * Score name translations per score type
 */
const SCORE_NAMES: Record<string, Record<SupportedLanguage, string>> = {
  estimated_1rm: { es: "Est. 1RM", en: "Est. 1RM" },
  longest_hold: { es: "Duración", en: "Duration" },
  tut_volume: { es: "Volumen TUT", en: "TUT Volume" },
  longest_distance: { es: "Distancia", en: "Distance" },
  total_work: { es: "Trabajo Total", en: "Total Work" },
};

/**
 * Format duration in seconds to human-readable string
 * @param seconds - Duration in seconds
 * @returns Formatted string (e.g., "45s", "2:35", "1:05:30")
 */
export const formatDuration = (seconds: number): string => {
  if (seconds < 0) return "0s";

  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.round(seconds % 60);

  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  if (mins > 0) {
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }
  return `${secs}s`;
};

/**
 * Format short distance (meters) for display
 */
const formatShortDistance = (meters: number, system: DistanceUnit): string => {
  const value = fromMeters(meters, system, 0);
  return system === "metric" ? `${value} m` : `${value} ft`;
};

/**
 * Format long distance (kilometers) for display
 */
const formatLongDistance = (
  kilometers: number,
  system: DistanceUnit
): string => {
  const value = fromKm(kilometers, system, 2);
  return system === "metric" ? `${value} km` : `${value} mi`;
};

/**
 * Format weight for display
 */
const _formatWeight = (
  kgValue: number,
  unit: WeightUnit,
  decimals: number = 1
): string => {
  const value = fromKg(kgValue, unit, decimals);
  return `${value} ${unit}`;
};

/**
 * Main formatter - creates display strings for any PR template
 *
 * @param template - Measurement template ID
 * @param primaryValue - Primary metric value
 * @param secondaryValue - Secondary metric value (if any)
 * @param prScore - Calculated PR score
 * @param weightUnit - User's preferred weight unit
 * @param distanceUnit - User's preferred distance unit
 * @param lang - User's language
 * @returns Formatted display data
 */
export const formatPRDisplay = (
  template: MeasurementTemplateId,
  primaryValue: number,
  secondaryValue: number | null | undefined,
  prScore: number,
  weightUnit: WeightUnit,
  distanceUnit: DistanceUnit,
  lang: SupportedLanguage
): PRDisplayData => {
  const config = PR_SCORE_CONFIG[template];
  const scoreName = SCORE_NAMES[config.scoreName]?.[lang] ?? config.scoreName;

  switch (template) {
    // ═══════════════════════════════════════════════════════════════
    // STRENGTH: weight × reps → Est. 1RM
    // ═══════════════════════════════════════════════════════════════
    case "weight_reps":
    case "weight_reps_range": {
      const weightDisplay = fromKg(primaryValue, weightUnit, 1);
      const reps = secondaryValue ?? 0;
      const scoreDisplay = fromKg(prScore, weightUnit, 1);
      const repsLabel = lang === "es" ? "reps" : "reps";
      return {
        mainDisplay: `${weightDisplay} ${weightUnit} × ${reps} ${repsLabel}`,
        primaryDisplay: `${weightDisplay} ${weightUnit}`,
        secondaryDisplay: `${reps} ${repsLabel}`,
        scoreDisplay: `${scoreDisplay} ${weightUnit}`,
        scoreName,
      };
    }

    // ═══════════════════════════════════════════════════════════════
    // TIME-BASED: duration → Duration
    // ═══════════════════════════════════════════════════════════════
    case "time_only": {
      const durationStr = formatDuration(primaryValue);
      return {
        mainDisplay: durationStr,
        primaryDisplay: durationStr,
        secondaryDisplay: null,
        scoreDisplay: durationStr,
        scoreName,
      };
    }

    // ═══════════════════════════════════════════════════════════════
    // WEIGHTED TIME: weight × duration → TUT Volume
    // ═══════════════════════════════════════════════════════════════
    case "weight_time": {
      const weightDisplay = fromKg(primaryValue, weightUnit, 1);
      const duration = formatDuration(secondaryValue ?? 0);
      const volumeScore = Math.round(prScore);
      return {
        mainDisplay: `${weightDisplay} ${weightUnit} × ${duration}`,
        primaryDisplay: `${weightDisplay} ${weightUnit}`,
        secondaryDisplay: duration,
        scoreDisplay: `${volumeScore} ${weightUnit}·s`,
        scoreName,
      };
    }

    // ═══════════════════════════════════════════════════════════════
    // DISTANCE ONLY: distance (meters) → Distance
    // ═══════════════════════════════════════════════════════════════
    case "distance_only": {
      const distStr = formatShortDistance(primaryValue, distanceUnit);
      return {
        mainDisplay: distStr,
        primaryDisplay: distStr,
        secondaryDisplay: null,
        scoreDisplay: distStr,
        scoreName,
      };
    }

    // ═══════════════════════════════════════════════════════════════
    // DISTANCE + TIME: distance (km) + time (min) → Distance
    // ═══════════════════════════════════════════════════════════════
    case "distance_time": {
      const distStr = formatLongDistance(primaryValue, distanceUnit);
      const timeStr = formatDuration((secondaryValue ?? 0) * 60); // min → sec
      const inWord = lang === "es" ? "en" : "in";
      return {
        mainDisplay: `${distStr} ${inWord} ${timeStr}`,
        primaryDisplay: distStr,
        secondaryDisplay: timeStr,
        scoreDisplay: distStr,
        scoreName,
      };
    }

    // ═══════════════════════════════════════════════════════════════
    // WEIGHTED DISTANCE: weight × distance (m) → Total Work
    // ═══════════════════════════════════════════════════════════════
    case "weight_distance": {
      const weightDisplay = fromKg(primaryValue, weightUnit, 1);
      const distStr = formatShortDistance(secondaryValue ?? 0, distanceUnit);
      const workScore = Math.round(prScore);
      const workUnit = distanceUnit === "metric" ? "kg·m" : "lbs·ft";
      return {
        mainDisplay: `${weightDisplay} ${weightUnit} × ${distStr}`,
        primaryDisplay: `${weightDisplay} ${weightUnit}`,
        secondaryDisplay: distStr,
        scoreDisplay: `${workScore} ${workUnit}`,
        scoreName,
      };
    }

    default:
      return {
        mainDisplay: String(primaryValue),
        primaryDisplay: String(primaryValue),
        secondaryDisplay: null,
        scoreDisplay: String(prScore),
        scoreName: "Score",
      };
  }
};

/**
 * Get a celebration message for a new PR
 */
export const getPRCelebrationMessage = (
  template: MeasurementTemplateId,
  primaryValue: number,
  secondaryValue: number | null | undefined,
  prScore: number,
  weightUnit: WeightUnit,
  distanceUnit: DistanceUnit,
  lang: SupportedLanguage
): string => {
  const { mainDisplay, scoreDisplay, scoreName } = formatPRDisplay(
    template,
    primaryValue,
    secondaryValue,
    prScore,
    weightUnit,
    distanceUnit,
    lang
  );

  const prLabel = lang === "es" ? "¡NUEVO PR!" : "NEW PR!";

  // For single-metric templates, don't show redundant score
  if (template === "time_only" || template === "distance_only") {
    return `🎉 ${prLabel} ${mainDisplay}`;
  }

  return `🎉 ${prLabel} ${mainDisplay} (${scoreName}: ${scoreDisplay})`;
};

/**
 * Get short label for a PR (used in set completion badges)
 */
export const getPRShortLabel = (
  template: MeasurementTemplateId,
  prScore: number,
  weightUnit: WeightUnit,
  distanceUnit: DistanceUnit
): string => {
  switch (template) {
    case "weight_reps":
    case "weight_reps_range": {
      const score = fromKg(prScore, weightUnit, 1);
      return `1RM: ${score}`;
    }
    case "time_only":
      return formatDuration(prScore);
    case "weight_time":
      return `${Math.round(prScore)} ${weightUnit}·s`;
    case "distance_only":
      return formatShortDistance(prScore, distanceUnit);
    case "distance_time":
      return formatLongDistance(prScore, distanceUnit);
    case "weight_distance": {
      const workUnit = distanceUnit === "metric" ? "kg·m" : "lbs·ft";
      return `${Math.round(prScore)} ${workUnit}`;
    }
    default:
      return String(prScore);
  }
};
