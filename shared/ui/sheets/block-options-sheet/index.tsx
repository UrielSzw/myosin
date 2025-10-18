import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { BottomSheetOptions } from "@/shared/ui/bottom-sheet-options";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  PlusCircle,
  RotateCcw,
  Shuffle,
  Split,
  Trash,
} from "lucide-react-native";
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
    const { colors } = useColorScheme();

    let options = [
      {
        type: "add-exercise",
        label: isMultiBlock
          ? "Agregar ejercicio"
          : "Agregar ejercicio (superserie)",
        method: onShowAddExerciseModal,
        icon: <PlusCircle color={colors.text} size={20} />,
      },
    ];

    if (isMultiBlock) {
      options.push({
        type: "convert",
        label: "Separar ejercicios",
        method: onConvertToIndividual,
        icon: <Split color={colors.text} size={20} />,
      });
    } else {
      options.push({
        type: "replace",
        label: "Remplazar ejercicio",
        method: onShowReplace,
        icon: <RotateCcw color={colors.text} size={20} />,
      });
    }

    if (onReorderExercises) {
      options.push({
        type: "reorder",
        label: "Reordenar ejercicios del bloque",
        method: onReorderExercises,
        icon: <Shuffle color={colors.text} size={20} />,
      });
    }

    if (onReorderBlocks) {
      options.push({
        type: "reorder-blocks",
        label: "Reordenar bloques",
        method: onReorderBlocks,
        icon: <Shuffle color={colors.text} size={20} />,
      });
    }

    return (
      <BottomSheetOptions
        ref={ref}
        title={isMultiBlock ? "Opciones de Bloque" : "Opciones de Ejercicio"}
        subtitle={isMultiBlock ? "" : exerciseName || ""}
        options={options}
        warningOption={{
          label: isMultiBlock ? "Eliminar bloque" : "Eliminar ejercicio",
          method: onDelete,
          icon: <Trash color={colors.error[500]} size={20} />,
        }}
      />
    );
  }
);

BlockOptionsBottomSheet.displayName = "BlockOptionsBottomSheet";
