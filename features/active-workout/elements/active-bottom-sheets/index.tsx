import { ISetType, RPEValue } from "@/shared/types/workout";
import { RPESelector } from "@/shared/ui/rpe-selector";
import { BlockOptionsBottomSheet } from "@/shared/ui/sheets/block-options-sheet";
import { ExerciseOptionsBottomSheet } from "@/shared/ui/sheets/exercise-options-sheet";
import { RestTimeBottomSheet } from "@/shared/ui/sheets/rest-time-sheet";
import { SetTypeBottomSheet } from "@/shared/ui/sheets/set-type-sheet";
import { TempoMetronome } from "@/shared/ui/tempo-metronome";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useCallback } from "react";
import {
  useActiveBlockActions,
  useActiveExerciseActions,
  useActiveMainActions,
  useActiveSetActions,
  useActiveWorkoutState,
} from "../../hooks/use-active-workout-store";
import { RestTimerBottomSheet } from "../rest-timer-sheet";

type Props = {
  setTypeBottomSheetRef: React.RefObject<BottomSheetModal | null>;
  restTimeBottomSheetRef: React.RefObject<BottomSheetModal | null>;
  blockOptionsBottomSheetRef: React.RefObject<BottomSheetModal | null>;
  exerciseOptionsBottomSheetRef: React.RefObject<BottomSheetModal | null>;
  restTimerSheetRef: React.RefObject<BottomSheetModal | null>;
  rpeSelectorBottomSheetRef: React.RefObject<BottomSheetModal | null>;
  tempoMetronomeRef: React.RefObject<BottomSheetModal | null>;
};

export const ActiveBottomSheets: React.FC<Props> = ({
  setTypeBottomSheetRef,
  restTimeBottomSheetRef,
  blockOptionsBottomSheetRef,
  exerciseOptionsBottomSheetRef,
  restTimerSheetRef,
  rpeSelectorBottomSheetRef,
  tempoMetronomeRef,
}) => {
  const {
    currentSetType,
    currentRestTime,
    isCurrentBlockMulti,
    currentExerciseName,
    currentTempo,
  } = useActiveWorkoutState();
  const { setExerciseModalMode, clearCurrentState } = useActiveMainActions();
  const { deleteSet, updateSetType, updateRpe } = useActiveSetActions();
  const { updateRestTime, deleteBlock, convertBlockToIndividual } =
    useActiveBlockActions();
  const { deleteExercise } = useActiveExerciseActions();

  const handleUpdateSetType = useCallback(
    (type: ISetType) => {
      updateSetType(type);
      setTypeBottomSheetRef.current?.dismiss();
      clearCurrentState();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateSetType, clearCurrentState]
  );

  const handleDeleteSet = useCallback(() => {
    deleteSet();
    setTypeBottomSheetRef.current?.dismiss();
    clearCurrentState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteSet, clearCurrentState]);

  const handleUpdateRestTime = useCallback(
    (restTime: number) => {
      updateRestTime(restTime);
      restTimeBottomSheetRef.current?.dismiss();
      clearCurrentState();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateRestTime, clearCurrentState]
  );

  const handleDeleteBlock = useCallback(() => {
    deleteBlock();
    blockOptionsBottomSheetRef.current?.dismiss();
    clearCurrentState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteBlock, clearCurrentState]);

  const handleConvertBlockToIndividual = useCallback(() => {
    convertBlockToIndividual();
    blockOptionsBottomSheetRef.current?.dismiss();
    clearCurrentState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convertBlockToIndividual, clearCurrentState]);

  const handleDeleteExercise = useCallback(() => {
    deleteExercise();
    exerciseOptionsBottomSheetRef.current?.dismiss();
    clearCurrentState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteExercise, clearCurrentState]);

  const handleShowReplaceModal = useCallback(() => {
    setExerciseModalMode("replace");
    exerciseOptionsBottomSheetRef.current?.dismiss();
    blockOptionsBottomSheetRef.current?.dismiss();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setExerciseModalMode]);

  const handleShowAddExerciseModal = useCallback(() => {
    setExerciseModalMode("add-to-block");
    exerciseOptionsBottomSheetRef.current?.dismiss();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setExerciseModalMode]);

  const handleUpdateRPE = useCallback(
    (rpe: RPEValue | null) => {
      updateRpe(rpe);
      rpeSelectorBottomSheetRef.current?.dismiss();
      clearCurrentState();
    },
    [clearCurrentState, rpeSelectorBottomSheetRef, updateRpe]
  );

  return (
    <>
      <RestTimerBottomSheet ref={restTimerSheetRef} />

      <SetTypeBottomSheet
        ref={setTypeBottomSheetRef}
        onSelectSetType={handleUpdateSetType}
        onDeleteSet={handleDeleteSet}
        currentSetType={currentSetType}
      />

      <RestTimeBottomSheet
        ref={restTimeBottomSheetRef}
        currentRestTime={currentRestTime || 0}
        onSelectRestTime={handleUpdateRestTime}
      />

      <BlockOptionsBottomSheet
        ref={blockOptionsBottomSheetRef}
        onDelete={handleDeleteBlock}
        onConvertToIndividual={handleConvertBlockToIndividual}
        onShowAddExerciseModal={handleShowAddExerciseModal}
        isMultiBlock={!!isCurrentBlockMulti}
        onShowReplace={handleShowReplaceModal}
      />

      <ExerciseOptionsBottomSheet
        ref={exerciseOptionsBottomSheetRef}
        onDelete={handleDeleteExercise}
        onShowReplace={handleShowReplaceModal}
        isInMultipleExercisesBlock={isCurrentBlockMulti}
        exerciseName={currentExerciseName}
      />

      <RPESelector ref={rpeSelectorBottomSheetRef} onSelect={handleUpdateRPE} />

      <TempoMetronome ref={tempoMetronomeRef} tempo={currentTempo} />
    </>
  );
};
