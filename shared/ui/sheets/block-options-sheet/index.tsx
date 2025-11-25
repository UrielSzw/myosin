import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { sharedUiTranslations } from "@/shared/translations/shared-ui";
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
    const prefs = useUserPreferences();
    const lang = prefs?.language ?? "es";
    const t = sharedUiTranslations;

    let options: {
      type: string;
      label: string;
      method: () => void;
      icon: React.ReactNode;
    }[] = [
      {
        type: "add-exercise",
        label: isMultiBlock ? t.addExercise[lang] : t.addExerciseSuperset[lang],
        method: onShowAddExerciseModal,
        icon: <PlusCircle color={colors.text} size={20} />,
      },
    ];

    if (isMultiBlock) {
      options.push({
        type: "convert",
        label: t.separateExercises[lang],
        method: onConvertToIndividual,
        icon: <Split color={colors.text} size={20} />,
      });
    } else {
      options.push({
        type: "replace",
        label: t.replaceExercise[lang],
        method: onShowReplace,
        icon: <RotateCcw color={colors.text} size={20} />,
      });
    }

    if (onReorderExercises) {
      options.push({
        type: "reorder",
        label: t.reorderBlockExercises[lang],
        method: onReorderExercises,
        icon: <Shuffle color={colors.text} size={20} />,
      });
    }

    if (onReorderBlocks) {
      options.push({
        type: "reorder-blocks",
        label: t.reorderBlocks[lang],
        method: onReorderBlocks,
        icon: <Shuffle color={colors.text} size={20} />,
      });
    }

    return (
      <BottomSheetOptions
        ref={ref}
        title={isMultiBlock ? t.blockOptions[lang] : t.exerciseOptions[lang]}
        subtitle={isMultiBlock ? "" : exerciseName || ""}
        options={options}
        warningOption={{
          label: isMultiBlock ? t.deleteBlock[lang] : t.deleteExercise[lang],
          method: onDelete,
          icon: <Trash color={colors.error[500]} size={20} />,
        }}
      />
    );
  }
);

BlockOptionsBottomSheet.displayName = "BlockOptionsBottomSheet";
