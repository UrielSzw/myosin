import { BaseExercise } from "@/shared/db/schema";
import { ExerciseSelectorModal } from "@/shared/ui/exercise-selector-modal";
import React from "react";
import { IToogleSheet } from "../../hooks/use-form-routine-sheets";
import {
  useBlockActions,
  useExerciseActions,
  useExerciseModalState,
  useMainActions,
} from "../../hooks/use-routine-form-store";

type Props = {
  onToggleSheet: (sheet?: IToogleSheet) => void;
};

export const ExerciseModal: React.FC<Props> = ({ onToggleSheet }) => {
  const { exerciseModalMode, isExerciseModalOpen } = useExerciseModalState();
  const { setIsExerciseModalOpen } = useMainActions();
  const { addIndividualBlock, addMultiBlock, addToBlock } = useBlockActions();
  const { replaceExercise } = useExerciseActions();

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
    <ExerciseSelectorModal
      visible={isExerciseModalOpen}
      onClose={handleCloseModal}
      onAddAsIndividual={handleAddAsIndividual}
      onAddAsBlock={handleAddMultiBlock}
      exerciseModalMode={exerciseModalMode}
      onReplaceExercise={handleReplaceExercise}
      onAddToBlock={handleAddToBlock}
    />
  );
};
