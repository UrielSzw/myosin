import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { sharedUiTranslations } from "@/shared/translations/shared-ui";
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
    const prefs = useUserPreferences();
    const lang = prefs?.language ?? "es";
    const t = sharedUiTranslations;

    const options = [
      {
        type: "replace",
        label: t.replaceExercise[lang],
        method: onShowReplace,
        icon: <RotateCcw color={colors.text} size={20} />,
      },
    ];

    return (
      <BottomSheetOptions
        ref={ref}
        title={t.exerciseOptions[lang]}
        subtitle={exerciseName || ""}
        options={options}
        warningOption={
          isInMultipleExercisesBlock
            ? {
                label: t.deleteExercise[lang],
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
