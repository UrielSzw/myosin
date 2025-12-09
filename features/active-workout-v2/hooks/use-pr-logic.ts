import { useActiveWorkout } from "@/features/active-workout-v2/hooks/use-active-workout-store";
import { computePRScore, isPRBetter } from "@/shared/db/utils/pr";
import type { MeasurementTemplateId } from "@/shared/types/measurement";
import { useMemo } from "react";

export interface PRValidationResult {
  isPersonalBest: boolean; // Mejor que el PR histórico del ejercicio
  isSessionBest: boolean; // Mejor que otros PRs en esta sesión
  isPR: boolean; // Es PR (personal best O session best cuando no hay histórico)
  prScore: number; // PR score (template-specific)
  improvementOver: "historical" | "session" | "none"; // Sobre qué mejora
}

export interface SessionPRData {
  tempSetId: string;
  exercise_id: string;
  primary_value: number;
  secondary_value: number | null;
  pr_score: number;
  created_at: string;
}

/**
 * Hook centralizado para toda la lógica de Personal Records
 * Maneja validación, comparación y gestión de PRs de sesión
 * Soporta TODOS los measurement templates
 */
export const usePRLogic = (
  exerciseId: string,
  tempSetId: string,
  measurementTemplate?: MeasurementTemplateId
) => {
  const { exercises, sessionBestPRs, sets } = useActiveWorkout();

  // Obtener datos del ejercicio actual
  const exercise = useMemo(() => {
    return Object.values(exercises).find((ex) => ex.exercise_id === exerciseId);
  }, [exercises, exerciseId]);

  // Get template from param or from set in store
  const template = useMemo(() => {
    if (measurementTemplate) return measurementTemplate;
    const set = sets[tempSetId];
    return set?.measurement_template;
  }, [measurementTemplate, sets, tempSetId]);

  // PR histórico del ejercicio (cargado al inicializar workout)
  const historicalPR = exercise?.pr;

  // Mejor PR de esta sesión para este ejercicio
  const sessionBestPR = sessionBestPRs?.[exerciseId] || null;

  /**
   * Valida si los valores constituyen un PR para CUALQUIER template
   * @param primaryValue - Valor principal (peso, distancia, tiempo según template)
   * @param secondaryValue - Valor secundario (reps, tiempo, distancia según template)
   */
  const validatePR = (
    primaryValue: number | null,
    secondaryValue: number | null
  ): PRValidationResult => {
    // Guard clause: necesitamos template y valor primario válido
    if (!template || primaryValue == null || primaryValue <= 0) {
      return {
        isPersonalBest: false,
        isSessionBest: false,
        isPR: false,
        prScore: 0,
        improvementOver: "none",
      };
    }

    // Calcular PR score usando la fórmula específica del template
    const prScore = computePRScore(template, primaryValue, secondaryValue);

    // Comparar con PR histórico
    const isPersonalBest = isPRBetter(prScore, historicalPR?.pr_score);

    // Comparar con mejor de la sesión
    const isSessionBest = isPRBetter(prScore, sessionBestPR?.pr_score);

    // Es PR si es personal best O si no hay histórico y es session best
    const isPR = isPersonalBest || (!historicalPR && isSessionBest);

    // Determinar sobre qué mejora
    let improvementOver: "historical" | "session" | "none" = "none";
    if (isPersonalBest) {
      improvementOver = "historical";
    } else if (isSessionBest && !historicalPR) {
      improvementOver = "session";
    }

    return {
      isPersonalBest,
      isSessionBest,
      isPR,
      prScore,
      improvementOver,
    };
  };

  /**
   * Verifica si el set actual tiene el PR de la sesión
   */
  const isCurrentSetSessionBest = useMemo(() => {
    return sessionBestPR?.tempSetId === tempSetId;
  }, [sessionBestPR, tempSetId]);

  /**
   * Información del PR actual para mostrar en UI
   */
  const currentPRInfo = useMemo(() => {
    if (!historicalPR && !sessionBestPR) {
      return {
        hasAnyPR: false,
        best1RM: 0,
        source: "none" as const,
      };
    }

    // Si hay PR de sesión, usar ese (es más reciente)
    if (sessionBestPR) {
      return {
        hasAnyPR: true,
        best1RM: sessionBestPR.pr_score,
        source: "session" as const,
      };
    }

    // Fallback a PR histórico
    return {
      hasAnyPR: true,
      best1RM: historicalPR!.pr_score,
      source: "historical" as const,
    };
  }, [historicalPR, sessionBestPR]);

  return {
    // Validación principal
    validatePR,

    // Estado actual
    isCurrentSetSessionBest,
    currentPRInfo,

    // Datos de referencia
    historicalPR,
    sessionBestPR,

    // Helpers para UI
    hasHistoricalPR: !!historicalPR,
    hasSessionPR: !!sessionBestPR,
  };
};
