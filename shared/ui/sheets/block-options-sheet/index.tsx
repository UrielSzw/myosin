import { BottomSheetOptions } from "@/shared/ui/bottom-sheet-options";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { forwardRef } from "react";

type Props = {
  onDelete: () => void;
  onConvertToIndividual: () => void;
  onShowAddExerciseModal: () => void;
  onShowReplace: () => void;
  isMultiBlock: boolean;
  onReorderExercises?: () => void;
  onReorderBlocks?: () => void;
  exerciseName?: string | null;
};

export const BlockOptionsBottomSheet = forwardRef<BottomSheetModal, Props>(
  (
    {
      onDelete,
      onConvertToIndividual,
      onShowAddExerciseModal,
      onShowReplace,
      isMultiBlock,
      onReorderExercises,
      onReorderBlocks,
      exerciseName,
    },
    ref
  ) => {
    let options = [
      {
        type: "add-exercise",
        label: isMultiBlock
          ? "Agregar ejercicio al bloque"
          : "Agregar ejercicio (superserie)",
        method: onShowAddExerciseModal,
      },
    ];

    if (isMultiBlock) {
      options.push({
        type: "convert",
        label: "Separar ejercicios",
        method: onConvertToIndividual,
      });
    } else {
      options.push({
        type: "replace",
        label: "Remplazar ejercicio",
        method: onShowReplace,
      });
    }

    if (onReorderExercises) {
      options.push({
        type: "reorder",
        label: "Reordenar ejercicios del bloque",
        method: onReorderExercises,
      });
    }

    if (onReorderBlocks) {
      options.push({
        type: "reorder-blocks",
        label: "Reordenar bloques",
        method: onReorderBlocks,
      });
    }

    return (
      <BottomSheetOptions
        ref={ref}
        title={isMultiBlock ? "Opciones de Bloque" : "Opciones de Ejercicio"}
        subtitle={isMultiBlock ? "" : exerciseName || ""}
        options={options}
        warningOption={{
          label: isMultiBlock
            ? "Eliminar bloque (todos los ejercicios)"
            : "Eliminar ejercicio",
          method: onDelete,
        }}
      />
    );
  }
);

BlockOptionsBottomSheet.displayName = "BlockOptionsBottomSheet";
