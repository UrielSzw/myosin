import { ISetType, RPEValue } from "@/shared/types/workout";
import { RPESelector } from "@/shared/ui/rpe-selector";
import { BlockOptionsBottomSheet } from "@/shared/ui/sheets/block-options-sheet";
import { ExerciseOptionsBottomSheet } from "@/shared/ui/sheets/exercise-options-sheet";
import { RestTimeBottomSheet } from "@/shared/ui/sheets/rest-time-sheet";
import { SetTypeBottomSheet } from "@/shared/ui/sheets/set-type-sheet";
import { TempoSelector } from "@/shared/ui/tempo-selector";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useCallback } from "react";
import {
  useBlockActions,
  useExerciseActions,
  useMainActions,
  useRoutineFormCurrentState,
  useSetActions,
} from "../../hooks/use-routine-form-store";
import { RepsTypeBottomSheet } from "../reps-type-sheet";

type Props = {
  setTypeBottomSheetRef: React.RefObject<BottomSheetModal | null>;
  repsTypeBottomSheetRef: React.RefObject<BottomSheetModal | null>;
  restTimeBottomSheetRef: React.RefObject<BottomSheetModal | null>;
  blockOptionsBottomSheetRef: React.RefObject<BottomSheetModal | null>;
  exerciseOptionsBottomSheetRef: React.RefObject<BottomSheetModal | null>;
  rpeSelectorBottomSheetRef: React.RefObject<BottomSheetModal | null>;
  tempoSelectorBottomSheetRef: React.RefObject<BottomSheetModal | null>;
};

export const BottomSheets: React.FC<Props> = ({
  setTypeBottomSheetRef,
  repsTypeBottomSheetRef,
  restTimeBottomSheetRef,
  blockOptionsBottomSheetRef,
  exerciseOptionsBottomSheetRef,
  rpeSelectorBottomSheetRef,
  tempoSelectorBottomSheetRef,
}) => {
  const {
    currentRestTime,
    isCurrentBlockMulti,
    currentSetType,
    currentExerciseName,
    currentSetTempo,
  } = useRoutineFormCurrentState();

  const { setExerciseModalMode, setIsExerciseModalOpen, clearCurrentState } =
    useMainActions();

  const { deleteSet, updateSetType, updateRpe, updateTempo } = useSetActions();
  const { updateRestTime, deleteBlock, convertBlockToIndividual } =
    useBlockActions();
  const { deleteExercise } = useExerciseActions();

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
    setIsExerciseModalOpen(true);

    exerciseOptionsBottomSheetRef.current?.dismiss();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setExerciseModalMode, setIsExerciseModalOpen]);

  const handleShowAddExerciseModal = useCallback(() => {
    setExerciseModalMode("add-to-block");
    setIsExerciseModalOpen(true);

    exerciseOptionsBottomSheetRef.current?.dismiss();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setExerciseModalMode, setIsExerciseModalOpen]);

  const handleUpdateRpe = useCallback(
    (rpe: RPEValue | null) => {
      console.log("Selected RPE:", rpe);

      updateRpe(rpe);
      rpeSelectorBottomSheetRef.current?.dismiss();
      clearCurrentState();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [clearCurrentState]
  );

  const handleUpdateTempo = useCallback(
    (tempo: string | null) => {
      updateTempo(tempo);
      tempoSelectorBottomSheetRef.current?.dismiss();
      clearCurrentState();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [clearCurrentState]
  );

  const handleDismissTempoSelector = useCallback(() => {
    tempoSelectorBottomSheetRef.current?.dismiss();
    clearCurrentState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearCurrentState]);

  return (
    <>
      <SetTypeBottomSheet
        ref={setTypeBottomSheetRef}
        onSelectSetType={handleUpdateSetType}
        onDeleteSet={handleDeleteSet}
        currentSetType={currentSetType}
      />

      <RepsTypeBottomSheet ref={repsTypeBottomSheetRef} />

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
      />

      <ExerciseOptionsBottomSheet
        ref={exerciseOptionsBottomSheetRef}
        onDelete={handleDeleteExercise}
        onShowReplace={handleShowReplaceModal}
        isInMultipleExercisesBlock={isCurrentBlockMulti}
        exerciseName={currentExerciseName}
      />

      <RPESelector onSelect={handleUpdateRpe} ref={rpeSelectorBottomSheetRef} />

      <TempoSelector
        ref={tempoSelectorBottomSheetRef}
        onSelect={handleUpdateTempo}
        onDismiss={handleDismissTempoSelector}
        selectedTempo={currentSetTempo || ""}
      />
    </>
  );
};
