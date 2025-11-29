import { BaseExercise } from "@/shared/db/schema";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import {
  exerciseEquipmentTranslations,
  exerciseMuscleTranslations,
} from "@/shared/translations/exercise-labels";
import { exerciseSelectorTranslations } from "@/shared/translations/exercise-selector";
import { IExerciseEquipment, IExerciseMuscle } from "@/shared/types/workout";
import { Check, ChevronRight, Plus, Star } from "lucide-react-native";
import { memo, useCallback } from "react";
import { Pressable, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { ExerciseMedia } from "../../exercise-media";
import { Typography } from "../../typography";

type Props = {
  exercise: BaseExercise;
  isSelected: boolean;
  isRecommended?: boolean;
  index: number;
  colors: {
    background: string;
    surface: string;
    surfaceSecondary: string;
    border: string;
    text: string;
    primary: { [key: string]: string };
    gray: { [key: string]: string };
    success: { [key: string]: string };
    warning: { [key: string]: string };
    textMuted: string;
  };
  isDark: boolean;
  exerciseModalMode?: "add-new" | "add-to-block" | "replace" | null;
  onSeeMoreInfo: (exercise: BaseExercise) => void;
  onSelectExercise: (exercise: BaseExercise) => void;
};

export const ExerciseCardV2: React.FC<Props> = memo(
  ({
    exercise,
    isSelected,
    isRecommended = false,
    index,
    colors,
    isDark,
    exerciseModalMode,
    onSelectExercise,
    onSeeMoreInfo,
  }) => {
    const prefs = useUserPreferences();
    const lang = prefs?.language ?? "es";
    const t = exerciseSelectorTranslations;
    const muscleT = exerciseMuscleTranslations;
    const equipmentT = exerciseEquipmentTranslations;

    const handleSelectExercise = useCallback(() => {
      onSelectExercise(exercise);
    }, [onSelectExercise, exercise]);

    const handleSeeMoreInfo = useCallback(() => {
      onSeeMoreInfo(exercise);
    }, [onSeeMoreInfo, exercise]);

    // V2 Glassmorphism card background
    const cardBg = isSelected
      ? colors.primary[500] + "15"
      : isRecommended
      ? colors.warning[500] + "10"
      : isDark
      ? "rgba(255, 255, 255, 0.04)"
      : "rgba(0, 0, 0, 0.02)";

    const cardBorder = isSelected
      ? colors.primary[500] + "50"
      : isRecommended
      ? colors.warning[500] + "40"
      : isDark
      ? "rgba(255, 255, 255, 0.08)"
      : "rgba(0, 0, 0, 0.05)";

    return (
      <Animated.View
        entering={FadeIn.delay(Math.min(index * 40, 250)).duration(250)}
      >
        <Pressable onPress={handleSelectExercise}>
          {({ pressed }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 12,
                marginTop: 10,
                borderRadius: 16,
                backgroundColor: cardBg,
                borderWidth: 1,
                borderColor: cardBorder,
                opacity: pressed ? 0.85 : 1,
              }}
            >
              {/* Selection indicator */}
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  backgroundColor: isSelected
                    ? colors.primary[500]
                    : isRecommended
                    ? colors.warning[500] + "20"
                    : isDark
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(0, 0, 0, 0.05)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10,
                }}
              >
                {isSelected ? (
                  <Check size={18} color="#FFFFFF" strokeWidth={2.5} />
                ) : isRecommended ? (
                  <Star
                    size={16}
                    color={colors.warning[500]}
                    fill={colors.warning[500]}
                  />
                ) : (
                  <Plus size={18} color={colors.textMuted} strokeWidth={2} />
                )}
              </View>

              {/* Exercise Image */}
              <ExerciseMedia
                primaryMediaUrl={exercise.primary_media_url || undefined}
                primaryMediaType={exercise.primary_media_type || undefined}
                variant="thumbnail"
                exerciseName={exercise.name}
              />

              {/* Content */}
              <View style={{ flex: 1, marginLeft: 10 }}>
                {/* Name + Recommended badge */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 2,
                  }}
                >
                  <Typography
                    variant="body1"
                    weight="semibold"
                    numberOfLines={1}
                    style={{ flex: 1, fontSize: 14 }}
                  >
                    {exercise.name}
                  </Typography>
                  {isRecommended && !isSelected && (
                    <View
                      style={{
                        backgroundColor: colors.warning[500] + "20",
                        paddingHorizontal: 7,
                        paddingVertical: 2,
                        borderRadius: 8,
                      }}
                    >
                      <Typography
                        variant="caption"
                        style={{
                          color: colors.warning[600],
                          fontSize: 9,
                          fontWeight: "600",
                        }}
                      >
                        {t.recommended[lang]}
                      </Typography>
                    </View>
                  )}
                </View>

                {/* Equipment • Muscle */}
                <Typography
                  variant="caption"
                  color="textMuted"
                  style={{ fontSize: 12, opacity: 0.8 }}
                >
                  {
                    equipmentT[
                      exercise.primary_equipment as IExerciseEquipment
                    ]?.[lang]
                  }{" "}
                  •{" "}
                  {
                    muscleT[exercise.main_muscle_group as IExerciseMuscle]?.[
                      lang
                    ]
                  }
                </Typography>
              </View>

              {/* Info button */}
              <Pressable
                onPress={handleSeeMoreInfo}
                style={({ pressed }) => ({
                  padding: 8,
                  marginLeft: 4,
                  borderRadius: 12,
                  backgroundColor: isDark
                    ? "rgba(255, 255, 255, 0.06)"
                    : "rgba(0, 0, 0, 0.04)",
                  opacity: pressed ? 0.6 : 1,
                })}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <ChevronRight size={18} color={colors.primary[500]} />
              </Pressable>
            </View>
          )}
        </Pressable>
      </Animated.View>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.exercise.id === nextProps.exercise.id &&
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.isRecommended === nextProps.isRecommended &&
      prevProps.exerciseModalMode === nextProps.exerciseModalMode &&
      prevProps.isDark === nextProps.isDark
    );
  }
);

ExerciseCardV2.displayName = "ExerciseCardV2";
