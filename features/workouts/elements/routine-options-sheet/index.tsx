import { RoutineWithMetrics } from "@/shared/db/repository/routines";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { workoutsTranslations } from "@/shared/translations/workouts";
import { BottomSheetOptions } from "@/shared/ui/bottom-sheet-options";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Eraser, Pen, Trash } from "lucide-react-native";
import React, { forwardRef } from "react";

type Props = {
  onDelete: () => void;
  onEdit: () => void;
  onClearTrainingDays: () => void;
  routine: RoutineWithMetrics | null;
};

export const RoutineOptionsBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({ onDelete, onEdit, onClearTrainingDays, routine }, ref) => {
    const { colors } = useColorScheme();
    const prefs = useUserPreferences();
    const lang = prefs?.language ?? "es";
    const t = workoutsTranslations;

    const options = [
      {
        type: "edit",
        label: t.editRoutine[lang],
        method: onEdit,
        icon: <Pen color={colors.text} size={20} />,
      },
    ];

    if (routine?.training_days && routine.training_days.length > 0) {
      options.push({
        type: "remove_training_days",
        label: t.removeTrainingDays[lang],
        method: onClearTrainingDays,
        icon: <Eraser color={colors.text} size={20} />,
      });
    }

    return (
      <BottomSheetOptions
        ref={ref}
        title={t.routineOptions[lang]}
        options={options}
        warningOption={{
          label: t.deleteRoutine[lang],
          method: onDelete,
          icon: <Trash color={colors.error[500]} size={20} />,
        }}
        enableDynamicSizing={false}
        snapPoints={["30%"]}
      />
    );
  }
);

RoutineOptionsBottomSheet.displayName = "RoutineOptionsBottomSheet";
