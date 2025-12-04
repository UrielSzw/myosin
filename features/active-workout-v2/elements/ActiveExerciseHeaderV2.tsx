import { toSupportedLanguage } from "@/shared/types/language";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { exerciseMuscleTranslations } from "@/shared/translations/exercise-labels";
import { IExerciseMuscle } from "@/shared/types/workout";
import { ExerciseMedia } from "@/shared/ui/exercise-media";
import { Typography } from "@/shared/ui/typography";
import { EllipsisVertical } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

type Props = {
  exerciseName: string;
  exerciseMainMuscle: string;
  exerciseImageUrl?: string;
  exerciseImageType?: "gif" | "image";
  onPress: () => void;
  isMultiBlock?: boolean;
};

export const ActiveExerciseHeaderV2: React.FC<Props> = ({
  exerciseName,
  exerciseMainMuscle,
  exerciseImageUrl,
  exerciseImageType,
  onPress,
  isMultiBlock = true,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);
  const muscleT = exerciseMuscleTranslations;

  return (
    <View style={styles.header}>
      <ExerciseMedia
        primaryMediaUrl={exerciseImageUrl}
        primaryMediaType={exerciseImageType}
        variant="thumbnail"
        exerciseName={exerciseName}
      />

      <View style={styles.exerciseInfo}>
        <Typography variant="body2" weight="semibold" numberOfLines={2}>
          {exerciseName}
        </Typography>

        <View style={styles.muscleRow}>
          <View
            style={[
              styles.muscleBadge,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.05)",
              },
            ]}
          >
            <Typography
              variant="caption"
              color="textMuted"
              style={{ fontSize: 10 }}
            >
              {muscleT[exerciseMainMuscle as IExerciseMuscle]?.[lang]}
            </Typography>
          </View>
        </View>
      </View>

      {/* Options button (for multi-blocks) */}
      {isMultiBlock && (
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [
            styles.optionsButton,
            {
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.05)",
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <EllipsisVertical size={18} color={colors.textMuted} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  exerciseInfo: {
    flex: 1,
    gap: 4,
  },
  muscleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  muscleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  optionsButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
