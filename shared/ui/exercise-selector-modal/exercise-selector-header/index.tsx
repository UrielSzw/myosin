import { BaseExercise } from "@/shared/db/schema";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { exerciseSelectorTranslations } from "@/shared/translations/exercise-selector";
import { X } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { Button } from "../../button";
import { Typography } from "../../typography";

type Props = {
  onClose: () => void;
  selectedExercises: Record<string, BaseExercise>;
  exerciseModalMode?: "add-new" | "add-to-block" | "replace" | null;
  exerciseToReplace?: BaseExercise | null;
};

export const ExerciseSelectorHeader: React.FC<Props> = ({
  onClose,
  selectedExercises,
  exerciseModalMode,
  exerciseToReplace,
}) => {
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = exerciseSelectorTranslations;
  const { colors } = useColorScheme();

  const selectedExercisesLength = Object.keys(selectedExercises).length;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <View style={{ flex: 1 }}>
        <Typography variant="h5" weight="semibold">
          {exerciseModalMode === "replace"
            ? t.replace[lang]
            : t.selectExercises[lang]}
        </Typography>
        {exerciseModalMode === "replace" && exerciseToReplace ? (
          <Typography variant="body2" color="textMuted">
            {exerciseToReplace.name}
          </Typography>
        ) : exerciseModalMode === "replace" ? (
          <Typography variant="body2" color="textMuted">
            {selectedExercisesLength > 0
              ? `${t.replacing[lang]} ${selectedExercisesLength} ${t.exercise[lang]}`
              : t.selectExerciseToReplace[lang]}
          </Typography>
        ) : (
          <Typography variant="body2" color="textMuted">
            {selectedExercisesLength} {t.exercisesSelected[lang]}
          </Typography>
        )}
      </View>

      <Button
        variant="ghost"
        size="sm"
        onPress={onClose}
        icon={<X size={20} color={colors.text} />}
      />
    </View>
  );
};
