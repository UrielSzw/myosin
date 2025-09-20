import { RoutineWithMetrics } from "@/shared/db/repository/routines";
import { BottomSheetOptions } from "@/shared/ui/bottom-sheet-options";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { forwardRef } from "react";

type Props = {
  onDelete: () => void;
  onEdit: () => void;
  onClearTrainingDays: () => void;
  routine: RoutineWithMetrics | null;
};

export const RoutineOptionsBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({ onDelete, onEdit, onClearTrainingDays, routine }, ref) => {
    const options = [{ type: "edit", label: "Editar rutina", method: onEdit }];

    if (routine?.training_days && routine.training_days.length > 0) {
      options.push({
        type: "remove_training_days",
        label: "Quitar días de entrenamiento",
        method: onClearTrainingDays,
      });
    }

    return (
      <BottomSheetOptions
        ref={ref}
        title="Opciones de Rutina"
        options={options}
        warningOption={{
          label: "Eliminar rutina",
          method: onDelete,
        }}
        addBottomInset
      />
    );
  }
);

RoutineOptionsBottomSheet.displayName = "RoutineOptionsBottomSheet";
