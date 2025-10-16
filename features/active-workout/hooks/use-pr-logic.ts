import { useActiveWorkout } from "@/features/active-workout/hooks/use-active-workout-store";
import { computeEpley1RM } from "@/shared/db/utils/pr";
import { supportsPRCalculation } from "@/shared/types/measurement";
import { useMemo } from "react";

export interface PRValidationResult {
  isPersonalBest: boolean; // Mejor que el PR histórico del ejercicio
  isSessionBest: boolean; // Mejor que otros PRs en esta sesión
  isPR: boolean; // Es PR (personal best O session best cuando no hay histórico)
  estimatedOneRM: number; // 1RM calculado
  improvementOver: "historical" | "session" | "none"; // Sobre qué mejora
}

export interface SessionPRData {
  tempSetId: string;
  exercise_id: string;
  weight: number;
  reps: number;
  estimated_1rm: number;
  created_at: string;
}

/**
 * Hook centralizado para toda la lógica de Personal Records
 * Maneja validación, comparación y gestión de PRs de sesión
 * Calcula PRs para templates weight_reps y weight_reps_range
 */
export const usePRLogic = (exerciseId: string, tempSetId: string) => {
  const { exercises, sessionBestPRs, sets } = useActiveWorkout();

  // Obtener datos del ejercicio actual y set actual
  const exercise = useMemo(() => {
    return Object.values(exercises).find((ex) => ex.exercise_id === exerciseId);
  }, [exercises, exerciseId]);

  const currentSet = useMemo(() => {
    return Object.values(sets).find((s) => s.tempId === tempSetId);
  }, [sets, tempSetId]);

  // PR histórico del ejercicio (cargado al inicializar workout)
  const historicalPR = exercise?.pr;

  // Mejor PR de esta sesión para este ejercicio
  const sessionBestPR = sessionBestPRs?.[exerciseId] || null;

  /**
   * Valida si un peso/reps constituye un PR
   * Calcula PRs para weight_reps y weight_reps_range templates
   */
  const validatePR = (
    weight: number | null,
    reps: number | null
  ): PRValidationResult => {
    // Guard clause: Solo calcular PRs para templates que soporten peso+reps
    if (
      !currentSet?.measurement_template ||
      !supportsPRCalculation(currentSet.measurement_template)
    ) {
      return {
        isPersonalBest: false,
        isSessionBest: false,
        isPR: false,
        estimatedOneRM: 0,
        improvementOver: "none",
      };
    }

    // Validar inputs
    if (!weight || !reps || weight <= 0 || reps <= 0) {
      return {
        isPersonalBest: false,
        isSessionBest: false,
        isPR: false,
        estimatedOneRM: 0,
        improvementOver: "none",
      };
    }

    const estimatedOneRM = computeEpley1RM(weight, reps);

    // Comparar con PR histórico
    const isPersonalBest =
      !historicalPR || estimatedOneRM > historicalPR.estimated_1rm;

    // Comparar con mejor de la sesión
    const isSessionBest =
      !sessionBestPR || estimatedOneRM > sessionBestPR.estimated_1rm;

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
      estimatedOneRM,
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
        best1RM: sessionBestPR.estimated_1rm,
        source: "session" as const,
      };
    }

    // Fallback a PR histórico
    return {
      hasAnyPR: true,
      best1RM: historicalPR!.estimated_1rm,
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
