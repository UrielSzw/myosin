import { BaseExercise } from "@/shared/db/schema";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import {
  exerciseEquipmentTranslations,
  exerciseMuscleTranslations,
} from "@/shared/translations/exercise-labels";
import { exerciseSelectorTranslations } from "@/shared/translations/exercise-selector";
import { sharedUiTranslations } from "@/shared/translations/shared-ui";
import { IExerciseEquipment, IExerciseMuscle } from "@/shared/types/workout";
import { Check, Info, Plus, Star } from "lucide-react-native";
import { memo, useCallback } from "react";
import { Pressable, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Card } from "../../card";
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
  exerciseModalMode?: "add-new" | "add-to-block" | "replace" | null;
  onSeeMoreInfo: (exercise: BaseExercise) => void;
  onSelectExercise: (exercise: BaseExercise) => void;
};

export const ExerciseCard: React.FC<Props> = memo(
  ({
    exercise,
    isSelected,
    isRecommended = false,
    index,
    colors,
    exerciseModalMode,
    onSelectExercise,
    onSeeMoreInfo,
  }) => {
    const prefs = useUserPreferences();
    const lang = prefs?.language ?? "es";
    const t = exerciseSelectorTranslations;
    const sharedT = sharedUiTranslations;
    const muscleT = exerciseMuscleTranslations;
    const equipmentT = exerciseEquipmentTranslations;

    const handleSelectExercise = useCallback(() => {
      onSelectExercise(exercise);
    }, [onSelectExercise, exercise]);

    const handleSeeMoreInfo = useCallback(() => {
      onSeeMoreInfo(exercise);
    }, [onSeeMoreInfo, exercise]);

    // Determinar colores según estado
    const getStateColors = () => {
      if (isSelected) {
        return {
          border: colors.primary[500],
          bg: colors.primary[500] + "10",
          icon: colors.primary[500],
        };
      }
      if (isRecommended) {
        return {
          border: colors.warning[500],
          bg: colors.warning[500] + "10",
          icon: colors.warning[500],
        };
      }
      return {
        border: colors.border,
        bg: "transparent",
        icon: colors.textMuted,
      };
    };

    const stateColors = getStateColors();

    return (
      <Animated.View
        entering={FadeIn.delay(Math.min(index * 50, 300)).duration(300)}
      >
        <Pressable onPress={handleSelectExercise}>
          {({ pressed }) => (
            <Card
              variant="outlined"
              padding="none"
              style={{
                marginTop: 12,
                borderColor: stateColors.border,
                backgroundColor: stateColors.bg,
                opacity: pressed ? 0.8 : 1,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 12,
                }}
              >
                {/* Selection indicator */}
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: isSelected
                      ? colors.primary[500]
                      : isRecommended
                      ? colors.warning[500] + "20"
                      : colors.gray[100],
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  {isSelected ? (
                    <Check size={20} color="#FFFFFF" />
                  ) : isRecommended ? (
                    <Star
                      size={18}
                      color={colors.warning[500]}
                      fill={colors.warning[500]}
                    />
                  ) : (
                    <Plus size={20} color={colors.textMuted} />
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
                <View style={{ flex: 1, marginLeft: 12 }}>
                  {/* Name + Recommended badge */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 2,
                    }}
                  >
                    <Typography
                      variant="body1"
                      weight="semibold"
                      numberOfLines={1}
                      style={{ flex: 1 }}
                    >
                      {exercise.name}
                    </Typography>
                    {isRecommended && !isSelected && (
                      <View
                        style={{
                          backgroundColor: colors.warning[500] + "20",
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          borderRadius: 10,
                        }}
                      >
                        <Typography
                          variant="caption"
                          style={{
                            color: colors.warning[600],
                            fontSize: 10,
                            fontWeight: "600",
                          }}
                        >
                          {t.recommended[lang]}
                        </Typography>
                      </View>
                    )}
                  </View>

                  {/* Equipment • Muscle */}
                  <Typography variant="caption" color="textMuted">
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
                    opacity: pressed ? 0.6 : 1,
                  })}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Info size={20} color={colors.primary[500]} />
                </Pressable>
              </View>
            </Card>
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
      prevProps.exerciseModalMode === nextProps.exerciseModalMode
    );
  }
);

ExerciseCard.displayName = "ExerciseCard";
