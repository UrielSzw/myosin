import { BaseExercise } from "@/shared/db/schema";
import { ExerciseSelectorModalV2 } from "@/shared/ui/exercise-selector-modal-v2";
import React from "react";
import { IToogleSheet } from "../hooks/use-form-routine-sheets";
import {
  useBlockActions,
  useExerciseActions,
  useExerciseModalState,
  useMainActions,
  useRoutineFormCurrentState,
} from "../hooks/use-routine-form-store";

type Props = {
  onToggleSheet: (sheet?: IToogleSheet) => void;
};

export const ExerciseModal: React.FC<Props> = ({ onToggleSheet }) => {
  const { exerciseModalMode, isExerciseModalOpen } = useExerciseModalState();
  const { setIsExerciseModalOpen } = useMainActions();
  const { addIndividualBlock, addMultiBlock, addToBlock } = useBlockActions();
  const { replaceExercise } = useExerciseActions();
  const { currentExerciseId } = useRoutineFormCurrentState();

  const handleCloseModal = () => {
    setIsExerciseModalOpen(false);
  };

  const handleAddAsIndividual = (selectedExercises: BaseExercise[]) => {
    addIndividualBlock(selectedExercises);
    handleCloseModal();
    onToggleSheet();
  };

  const handleAddMultiBlock = (selectedExercises: BaseExercise[]) => {
    addMultiBlock(selectedExercises);
    handleCloseModal();
    onToggleSheet();
  };

  const handleReplaceExercise = (selectedExercises: BaseExercise[]) => {
    replaceExercise(selectedExercises);
    handleCloseModal();
    onToggleSheet();
  };

  const handleAddToBlock = (selectedExercises: BaseExercise[]) => {
    addToBlock(selectedExercises);
    handleCloseModal();
    onToggleSheet();
  };

  return (
    <ExerciseSelectorModalV2
      visible={isExerciseModalOpen}
      onClose={handleCloseModal}
      onAddAsIndividual={handleAddAsIndividual}
      onAddAsBlock={handleAddMultiBlock}
      exerciseModalMode={exerciseModalMode}
      onReplaceExercise={handleReplaceExercise}
      onAddToBlock={handleAddToBlock}
      exerciseIdToExclude={currentExerciseId}
    />
  );
};
