import { BaseExercise } from "@/shared/db/schema";
import { ExerciseSelectorModal } from "@/shared/ui/exercise-selector-modal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React from "react";
import {
  useActiveBlockActions,
  useActiveExerciseActions,
  useActiveMainActions,
  useActiveWorkoutState,
} from "../../hooks/use-active-workout-store";

type Props = {
  blockOptionsBottomSheetRef: React.RefObject<BottomSheetModal | null>;
};

export const ActiveExerciseModal: React.FC<Props> = ({
  blockOptionsBottomSheetRef,
}) => {
  const { exerciseModalMode, currentExerciseId } = useActiveWorkoutState();
  const { clearCurrentState } = useActiveMainActions();

  const { addIndividualBlock, addMultiBlock, addToBlock } =
    useActiveBlockActions();
  const { replaceExercise } = useActiveExerciseActions();

  const handleReplaceExercise = (selectedExercises: BaseExercise[]) => {
    replaceExercise(selectedExercises);
    clearCurrentState();
    blockOptionsBottomSheetRef.current?.dismiss();
  };

  const handleAddIndividualBlock = (selectedExercises: BaseExercise[]) => {
    addIndividualBlock(selectedExercises);
    clearCurrentState();
    blockOptionsBottomSheetRef.current?.dismiss();
  };

  const handleAddMultiBlock = (selectedExercises: BaseExercise[]) => {
    addMultiBlock(selectedExercises);
    clearCurrentState();
    blockOptionsBottomSheetRef.current?.dismiss();
  };

  const handleAddToBlock = (selectedExercises: BaseExercise[]) => {
    addToBlock(selectedExercises);
    clearCurrentState();
    blockOptionsBottomSheetRef.current?.dismiss();
  };

  return (
    <ExerciseSelectorModal
      visible={!!exerciseModalMode}
      onClose={clearCurrentState}
      onAddAsIndividual={handleAddIndividualBlock}
      onAddAsBlock={handleAddMultiBlock}
      exerciseModalMode={exerciseModalMode}
      onReplaceExercise={handleReplaceExercise}
      onAddToBlock={handleAddToBlock}
      exerciseIdToExclude={currentExerciseId}
    />
  );
};
