import { BottomSheetOptions } from "@/shared/ui/bottom-sheet-options";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { forwardRef } from "react";

type Props = {
  onDelete: () => void;
  onEdit: () => void;
};

export const RoutineOptionsBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({ onDelete, onEdit }, ref) => {
    return (
      <BottomSheetOptions
        ref={ref}
        title="Opciones de Rutina"
        options={[
          { type: "edit", label: "Editar rutina", method: onEdit },
          { type: "delete", label: "Eliminar rutina", method: onDelete },
        ]}
      />
    );
  }
);

RoutineOptionsBottomSheet.displayName = "RoutineOptionsBottomSheet";
