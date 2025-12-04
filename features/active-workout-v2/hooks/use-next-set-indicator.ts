import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { routineFormTranslations as t } from "@/shared/translations/routine-form";
import { toSupportedLanguage } from "@/shared/types/language";
import { useMemo } from "react";
import { getNextSetToComplete } from "../utils/store-helpers";
import {
  useActiveSetActions,
  useActiveWorkout,
} from "./use-active-workout-store";

/**
 * Hook para manejar el indicador del próximo set en superseries/circuitos
 *
 * Proporciona:
 * - Información del próximo set a completar
 * - Estado de progreso del bloque
 * - Función para crear sets faltantes automáticamente
 * - Estado de UI para mostrar el indicador
 */
export const useNextSetIndicator = (blockId: string) => {
  const { blocks, exercises, sets, exercisesByBlock, setsByExercise } =
    useActiveWorkout();
  const { addSet } = useActiveSetActions();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);

  const block = blocks[blockId];

  // Obtener ejercicios del bloque ordenados
  const exercisesInBlock = useMemo(() => {
    const exercisesInBlockIds = exercisesByBlock[blockId] || [];
    return exercisesInBlockIds
      .map((id) => exercises[id])
      .filter(Boolean)
      .sort((a, b) => a.order_index - b.order_index);
  }, [exercisesByBlock, blockId, exercises]);

  // Calcular información del próximo set
  const nextSetInfo = useMemo(() => {
    if (!block || block.type === "individual") {
      return null;
    }

    return getNextSetToComplete(block, exercisesInBlock, sets, setsByExercise);
  }, [block, exercisesInBlock, sets, setsByExercise]);

  // Función para crear un set faltante
  const createMissingSet = () => {
    if (!nextSetInfo || nextSetInfo.setId !== null) {
      return; // No hay set faltante o ya existe
    }

    addSet(nextSetInfo.exerciseInBlock.tempId);
  };

  // Información de progreso para la UI
  const progressInfo = useMemo(() => {
    if (!nextSetInfo || !block) {
      return {
        currentRound: 0,
        totalRounds: 0,
        progressPercentage: 100,
        completedSets: 0,
        totalSets: 0,
      };
    }

    // Calcular total de sets planificados
    const totalSetsPlanned = exercisesInBlock.reduce((total, exercise) => {
      const exerciseSets = setsByExercise[exercise.tempId] || [];
      return total + exerciseSets.length;
    }, 0);

    // Calcular sets completados
    const completedSets = exercisesInBlock.reduce((total, exercise) => {
      const exerciseSets = setsByExercise[exercise.tempId] || [];
      const completed = exerciseSets.filter(
        (setId) => sets[setId]?.completed_at
      ).length;
      return total + completed;
    }, 0);

    const progressPercentage =
      totalSetsPlanned > 0
        ? Math.round((completedSets / totalSetsPlanned) * 100)
        : 0;

    return {
      currentRound: nextSetInfo.totalRoundsCompleted + 1,
      totalRounds: Math.max(
        ...exercisesInBlock.map((ex) => setsByExercise[ex.tempId]?.length || 0)
      ),
      progressPercentage,
      completedSets,
      totalSets: totalSetsPlanned,
    };
  }, [nextSetInfo, exercisesInBlock, setsByExercise, sets, block]);

  // Estado de la UI
  const uiState = useMemo(() => {
    if (!nextSetInfo || !block) {
      return {
        shouldShow: false,
        exerciseName: "",
        setNumber: 0,
        isComplete: true,
        needsSetCreation: false,
        blockTypeLabel: "",
      };
    }

    const blockTypeLabel =
      block.type === "superset"
        ? t.blockTypeSuperset[lang]
        : t.blockTypeCircuit[lang];

    return {
      shouldShow: !nextSetInfo.isBlockComplete,
      exerciseName: nextSetInfo.exerciseInBlock.exercise.name,
      setNumber: nextSetInfo.setIndex + 1,
      isComplete: nextSetInfo.isBlockComplete,
      needsSetCreation: nextSetInfo.setId === null,
      blockTypeLabel,
    };
  }, [nextSetInfo, block, lang]);

  return {
    // Información del próximo set
    nextSetInfo,

    // Información de progreso
    progressInfo,

    // Estado de la UI
    uiState,

    // Acciones
    createMissingSet,

    // Datos del bloque
    block,
    exercisesInBlock,

    // Helper para saber si un set específico es el próximo
    isNextSet: (exerciseInBlockId: string, setIndex: number) => {
      if (!nextSetInfo || nextSetInfo.isBlockComplete) return false;
      return (
        nextSetInfo.exerciseInBlock.tempId === exerciseInBlockId &&
        nextSetInfo.setIndex === setIndex
      );
    },
  };
};
