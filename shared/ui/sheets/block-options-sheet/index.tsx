import { BottomSheetOptions } from "@/shared/ui/bottom-sheet-options";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { forwardRef } from "react";

type Props = {
  onDelete: () => void;
  onConvertToIndividual: () => void;
  onShowAddExerciseModal: () => void;
  isMultiBlock: boolean;
};

export const BlockOptionsBottomSheet = forwardRef<BottomSheetModal, Props>(
  (
    { onDelete, onConvertToIndividual, onShowAddExerciseModal, isMultiBlock },
    ref
  ) => {
    const options = [
      ...(isMultiBlock
        ? [
            {
              type: "convert",
              label: "Separar ejercicios",
              method: onConvertToIndividual,
            },
          ]
        : []),
      {
        type: "add-exercise",
        label: isMultiBlock
          ? "Agregar ejercicio al bloque"
          : "Agregar ejercicio (superserie)",
        method: onShowAddExerciseModal,
      },
    ];

    return (
      <BottomSheetOptions
        ref={ref}
        title="Opciones de Bloque"
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
