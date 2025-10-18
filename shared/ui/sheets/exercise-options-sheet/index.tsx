import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { BottomSheetOptions } from "@/shared/ui/bottom-sheet-options";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { RotateCcw, Trash } from "lucide-react-native";
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
    const { colors } = useColorScheme();

    const options = [
      {
        type: "replace",
        label: "Remplazar ejercicio",
        method: onShowReplace,
        icon: <RotateCcw color={colors.text} size={20} />,
      },
    ];

    return (
      <BottomSheetOptions
        ref={ref}
        title="Opciones de Ejercicio"
        subtitle={exerciseName || ""}
        options={options}
        warningOption={
          isInMultipleExercisesBlock
            ? {
                label: "Eliminar ejercicio",
                method: onDelete,
                icon: <Trash color={colors.error[500]} size={20} />,
              }
            : undefined
        }
      />
    );
  }
);

ExerciseOptionsBottomSheet.displayName = "ExerciseOptionsBottomSheet";
