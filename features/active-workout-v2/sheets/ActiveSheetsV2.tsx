import {
  useActiveBlockActions,
  useActiveExerciseActions,
  useActiveMainActions,
  useActiveSetActions,
  useActiveWorkoutState,
} from "@/features/active-workout-v2/hooks/use-active-workout-store";
import { ISetType, RPEValue } from "@/shared/types/workout";
import {
  BlockOptionsSheetV2,
  ExerciseOptionsSheetV2,
  RestTimeSheetV2,
  RPESelectorV2,
  SetTypeSheetV2,
} from "@/shared/ui/sheets-v2";
import React, { useCallback } from "react";
import { TempoMetronomeV2 } from "../elements/TempoMetronomeV2";
import { IActiveSheetV2 } from "../hooks/use-active-workout-sheets-v2";

type Props = {
  activeSheet: IActiveSheetV2;
  closeSheet: () => void;
};

export const ActiveSheetsV2: React.FC<Props> = ({
  activeSheet,
  closeSheet,
}) => {
  const {
    currentSetType,
    currentRestTime,
    isCurrentBlockMulti,
    currentExerciseName,
    currentTempo,
    currentRpeValue,
  } = useActiveWorkoutState();
  const { setExerciseModalMode, clearCurrentState } = useActiveMainActions();
  const { deleteSet, updateSetType, updateRpe } = useActiveSetActions();
  const { updateRestTime, deleteBlock, convertBlockToIndividual } =
    useActiveBlockActions();
  const { deleteExercise } = useActiveExerciseActions();

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
        onReplace={handleShowReplaceModal}
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
    </>
  );
};
