import {
  EXERCISE_CATEGORY_LABELS,
  EXERCISE_EQUIPMENT_LABELS,
} from "@/shared/constants/exercise";
import { BaseExercise } from "@/shared/db/schema";
import { Check, Dumbbell, Info, Plus, Star } from "lucide-react-native";
import { memo, useCallback } from "react";
import { View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Button } from "../../button";
import { Card } from "../../card";
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
    const handleSelectExercise = useCallback(() => {
      onSelectExercise(exercise);
    }, [onSelectExercise, exercise]);

    const handleSeeMoreInfo = useCallback(() => {
      onSeeMoreInfo(exercise);
    }, [onSeeMoreInfo, exercise]);

    return (
      <Animated.View entering={FadeInDown.delay(index * 100).duration(600)}>
        <Card
          key={exercise.id}
          variant="outlined"
          padding="md"
          style={{
            opacity: isSelected ? 0.6 : 1,
            marginTop: 16,
            borderColor: isRecommended ? colors.primary[100] : undefined,
            borderWidth: isRecommended ? 1 : 0,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            {/* Exercise Image */}
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 8,
                backgroundColor: colors.border,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Dumbbell size={24} color={colors.textMuted} />
            </View>

            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <Typography
                  variant="h6"
                  weight="semibold"
                  style={{
                    flex: 1,
                    color: colors.text,
                  }}
                >
                  {exercise.name}
                </Typography>
              </View>

              <Typography
                variant="body2"
                color="textMuted"
                style={{ marginBottom: 8 }}
              >
                {
                  EXERCISE_EQUIPMENT_LABELS[
                    exercise.primary_equipment as keyof typeof EXERCISE_EQUIPMENT_LABELS
                  ]
                }{" "}
                •{" "}
                {
                  EXERCISE_CATEGORY_LABELS[
                    exercise.main_muscle_group as keyof typeof EXERCISE_CATEGORY_LABELS
                  ]
                }
              </Typography>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <Button
                  variant={isSelected ? "secondary" : "primary"}
                  style={{
                    paddingVertical: isSelected ? 10 : 8,
                  }}
                  size="sm"
                  onPress={handleSelectExercise}
                  icon={
                    isSelected ? (
                      <Check size={16} color="#ffffff" />
                    ) : isRecommended ? (
                      <Star size={16} color="#ffffff" fill="#ffffff" />
                    ) : (
                      <Plus size={16} color="#ffffff" />
                    )
                  }
                >
                  {exerciseModalMode !== "replace"
                    ? isSelected
                      ? "Agregado"
                      : "Agregar"
                    : isSelected
                    ? "Seleccionado"
                    : isRecommended
                    ? "Recomendado"
                    : "Seleccionar"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Info size={16} color={colors.primary[500]} />}
                  onPress={handleSeeMoreInfo}
                >
                  Info
                </Button>
              </View>
            </View>
          </View>
        </Card>
      </Animated.View>
    );
  },
  // Optimización de memoization: solo re-render cuando cambien estas props críticas
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
