import {
  useActiveBlockActions,
  useActiveExerciseActions,
  useActiveMainActions,
  useActiveSetActions,
  useActiveWorkout,
  useActiveWorkoutState,
} from "@/features/active-workout-v2/hooks/use-active-workout-store";
import {
  useReorderBlocksActive,
  useReorderExercisesActive,
} from "@/features/active-workout-v2/shared";
import { ISetType, RPEValue } from "@/shared/types/workout";
import {
  BlockOptionsSheetV2,
  ExerciseOptionsSheetV2,
  RestTimeSheetV2,
  RPESelectorV2,
  SetTypeSheetV2,
} from "@/shared/ui/sheets-v2";
import { router } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { CircuitTimerModeV2 } from "../elements/CircuitTimerModeV2";
import { TempoMetronomeV2 } from "../elements/TempoMetronomeV2";
import { IActiveSheetV2 } from "../hooks/use-active-workout-sheets-v2";
import {
  canUseCircuitTimerMode,
  hasBalancedCircuitSets,
} from "../utils/store-helpers";

type Props = {
  activeSheet: IActiveSheetV2;
  closeSheet: () => void;
  openCircuitTimerModeSheet: () => void;
};

export const ActiveSheetsV2: React.FC<Props> = ({
  activeSheet,
  closeSheet,
  openCircuitTimerModeSheet,
}) => {
  const {
    currentSetType,
    currentRestTime,
    isCurrentBlockMulti,
    currentExerciseName,
    currentTempo,
    currentRpeValue,
    currentBlockId,
  } = useActiveWorkoutState();
  const {
    blocks,
    exercises,
    sets,
    exercisesByBlock,
    setsByExercise,
    blocksBySession,
  } = useActiveWorkout();
  const { setExerciseModalMode, clearCurrentState } = useActiveMainActions();
  const { deleteSet, updateSetType, updateRpe } = useActiveSetActions();
  const { updateRestTime, deleteBlock, convertBlockToIndividual } =
    useActiveBlockActions();
  const { deleteExercise } = useActiveExerciseActions();

  // Reorder hooks
  const { initializeReorder: initializeBlocksReorder } =
    useReorderBlocksActive();
  const { initializeReorder: initializeExercisesReorder } =
    useReorderExercisesActive();

  // Set Type handlers
  const handleUpdateSetType = useCallback(
    (type: ISetType) => {
      updateSetType(type);
      closeSheet();
      clearCurrentState();
    },
    [updateSetType, clearCurrentState, closeSheet]
  );

  const handleDeleteSet = useCallback(() => {
    deleteSet();
    closeSheet();
    clearCurrentState();
  }, [deleteSet, clearCurrentState, closeSheet]);

  // Rest Time handler
  const handleUpdateRestTime = useCallback(
    (restTime: number) => {
      updateRestTime(restTime);
      closeSheet();
      clearCurrentState();
    },
    [updateRestTime, clearCurrentState, closeSheet]
  );

  // Block Options handlers
  const handleDeleteBlock = useCallback(() => {
    deleteBlock();
    closeSheet();
    clearCurrentState();
  }, [deleteBlock, clearCurrentState, closeSheet]);

  const handleConvertBlockToIndividual = useCallback(() => {
    convertBlockToIndividual();
    closeSheet();
    clearCurrentState();
  }, [convertBlockToIndividual, clearCurrentState, closeSheet]);

  // Exercise Options handlers
  const handleDeleteExercise = useCallback(() => {
    deleteExercise();
    closeSheet();
    clearCurrentState();
  }, [deleteExercise, clearCurrentState, closeSheet]);

  const handleShowReplaceModal = useCallback(() => {
    setExerciseModalMode("replace");
    closeSheet();
  }, [setExerciseModalMode, closeSheet]);

  const handleShowAddExerciseModal = useCallback(() => {
    setExerciseModalMode("add-to-block");
    closeSheet();
  }, [setExerciseModalMode, closeSheet]);

  // RPE handler
  const handleUpdateRPE = useCallback(
    (rpe: RPEValue | null) => {
      updateRpe(rpe);
      closeSheet();
      clearCurrentState();
    },
    [clearCurrentState, updateRpe, closeSheet]
  );

  // Circuit Timer Mode handlers
  const currentBlock = currentBlockId ? blocks[currentBlockId] : null;
  const isCircuit = currentBlock?.type === "circuit";

  const canUseTimerModeValue = useMemo(() => {
    if (!currentBlockId || !currentBlock || currentBlock.type !== "circuit") {
      return false;
    }
    const exerciseIds = exercisesByBlock[currentBlockId] || [];
    const exercisesInBlock = exerciseIds
      .map((id) => exercises[id])
      .filter(Boolean)
      .sort((a, b) => a.order_index - b.order_index);

    return canUseCircuitTimerMode(
      currentBlock,
      exercisesInBlock,
      sets,
      setsByExercise
    );
  }, [
    currentBlockId,
    currentBlock,
    exercisesByBlock,
    exercises,
    sets,
    setsByExercise,
  ]);

  const hasBalancedSets = useMemo(() => {
    if (!currentBlockId || !currentBlock || currentBlock.type !== "circuit") {
      return true;
    }
    const exerciseIds = exercisesByBlock[currentBlockId] || [];
    const exercisesInBlock = exerciseIds
      .map((id) => exercises[id])
      .filter(Boolean);

    return hasBalancedCircuitSets(exercisesInBlock, setsByExercise);
  }, [
    currentBlockId,
    currentBlock,
    exercisesByBlock,
    exercises,
    setsByExercise,
  ]);

  const handleStartTimerMode = useCallback(() => {
    closeSheet();
    // Small delay to let block options sheet close first
    setTimeout(() => {
      openCircuitTimerModeSheet();
    }, 100);
  }, [closeSheet, openCircuitTimerModeSheet]);

  // Reorder handlers
  const handleReorderBlocks = useCallback(() => {
    closeSheet();
    initializeBlocksReorder();
    router.push("/workout/reorder-blocks");
  }, [closeSheet, initializeBlocksReorder]);

  const handleReorderExercises = useCallback(() => {
    if (!currentBlockId) return;
    closeSheet();
    initializeExercisesReorder(currentBlockId);
    router.push("/workout/reorder-exercises");
  }, [closeSheet, currentBlockId, initializeExercisesReorder]);

  // Check if we have more than 1 block to enable reorder blocks
  const canReorderBlocks = blocksBySession.length > 1;

  // Check if current block has more than 1 exercise to enable reorder exercises
  const canReorderExercises = useMemo(() => {
    if (!currentBlockId) return false;
    const exerciseIds = exercisesByBlock[currentBlockId] || [];
    return exerciseIds.length > 1;
  }, [currentBlockId, exercisesByBlock]);

  return (
    <>
      {/* Set Type Sheet */}
      <SetTypeSheetV2
        visible={activeSheet === "setType"}
        onClose={closeSheet}
        onSelectSetType={handleUpdateSetType}
        onDeleteSet={handleDeleteSet}
        currentSetType={currentSetType}
      />

      {/* Rest Time Sheet */}
      <RestTimeSheetV2
        visible={activeSheet === "restTime"}
        onClose={closeSheet}
        currentValue={currentRestTime || 0}
        onSelect={handleUpdateRestTime}
      />

      {/* Block Options Sheet */}
      <BlockOptionsSheetV2
        visible={activeSheet === "blockOptions"}
        onClose={closeSheet}
        onDelete={handleDeleteBlock}
        onConvertToIndividual={handleConvertBlockToIndividual}
        onAddExercise={handleShowAddExerciseModal}
        isMultiBlock={!!isCurrentBlockMulti}
        isCircuit={isCircuit}
        canUseTimerMode={canUseTimerModeValue}
        hasBalancedSets={hasBalancedSets}
        onReplace={handleShowReplaceModal}
        onStartTimerMode={handleStartTimerMode}
        onReorderBlocks={canReorderBlocks ? handleReorderBlocks : undefined}
        onReorderExercises={
          canReorderExercises ? handleReorderExercises : undefined
        }
      />

      {/* Exercise Options Sheet */}
      <ExerciseOptionsSheetV2
        visible={activeSheet === "exerciseOptions"}
        onClose={closeSheet}
        onDelete={handleDeleteExercise}
        onReplace={handleShowReplaceModal}
        onCreateSuperset={handleShowAddExerciseModal}
        isInMultiBlock={isCurrentBlockMulti}
        exerciseName={currentExerciseName}
      />

      {/* RPE Selector Sheet */}
      <RPESelectorV2
        visible={activeSheet === "rpeSelector"}
        onClose={closeSheet}
        onSelect={handleUpdateRPE}
        selectedRPE={currentRpeValue}
      />

      {/* Tempo Metronome Sheet */}
      <TempoMetronomeV2
        visible={activeSheet === "tempoMetronome"}
        onClose={closeSheet}
        tempo={currentTempo}
      />

      {/* Circuit Timer Mode */}
      <CircuitTimerModeV2
        visible={activeSheet === "circuitTimerMode"}
        onClose={closeSheet}
        blockId={currentBlockId || ""}
      />
    </>
  );
};
