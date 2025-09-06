import { BottomSheetOptions } from "@/shared/ui/bottom-sheet-options";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { forwardRef } from "react";

type Props = {
  onDelete: () => void;
  onShowReplace: () => void;
  isInMultipleExercisesBlock?: boolean;
  exerciseName?: string | null;
};

export const ExerciseOptionsBottomSheet = forwardRef<BottomSheetModal, Props>(
  (
    { onDelete, onShowReplace, isInMultipleExercisesBlock, exerciseName },
    ref
  ) => {
    const options = [
      { type: "replace", label: "Remplazar ejercicio", method: onShowReplace },
    ];

    return (
      <BottomSheetOptions
        ref={ref}
        title="Opciones de Ejercicio"
        subtitle={exerciseName || ""}
        options={options}
        warningOption={
          isInMultipleExercisesBlock
            ? { label: "Eliminar ejercicio", method: onDelete }
            : undefined
        }
      />
    );
  }
);

ExerciseOptionsBottomSheet.displayName = "ExerciseOptionsBottomSheet";
