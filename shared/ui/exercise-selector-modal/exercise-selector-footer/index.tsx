import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { exerciseSelectorTranslations } from "@/shared/translations/exercise-selector";
import React from "react";
import { View } from "react-native";
import { Button } from "../../button";

type Props = {
  exerciseModalMode?: "add-new" | "add-to-block" | "replace" | null;
  selectedExercisesLength: number;
  onAddMultiBlock: () => void;
  onAddAsIndividual: () => void;
  onAddToReplace: () => void;
  onAddToBlock: () => void;
};

export const ExerciseSelectorFooter: React.FC<Props> = ({
  exerciseModalMode,
  selectedExercisesLength,
  onAddMultiBlock,
  onAddAsIndividual,
  onAddToReplace,
  onAddToBlock,
}) => {
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = exerciseSelectorTranslations;
  const { colors } = useColorScheme();

  return (
    <View
      style={{
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.background,
      }}
    >
      {exerciseModalMode === "add-new" && selectedExercisesLength > 0 && (
        <View style={{ gap: 12 }}>
          {selectedExercisesLength > 1 && (
            <Button variant="primary" fullWidth onPress={onAddMultiBlock}>
              {t.addAsSuperset[lang]}
            </Button>
          )}
          <Button variant="outline" fullWidth onPress={onAddAsIndividual}>
            {selectedExercisesLength > 1
              ? t.addSeparately[lang]
              : t.addExercise[lang]}
          </Button>
        </View>
      )}

      {exerciseModalMode === "replace" && selectedExercisesLength > 0 && (
        <Button variant="primary" fullWidth onPress={onAddToReplace}>
          {t.replaceExercise[lang]}
        </Button>
      )}

      {exerciseModalMode === "add-to-block" && (
        <Button variant="primary" fullWidth onPress={onAddToBlock}>
          {t.addToSuperset[lang]}
        </Button>
      )}
    </View>
  );
};
