import {
  EXERCISE_CATEGORY_LABELS,
  EXERCISE_EQUIPMENT_LABELS,
} from "@/shared/constants/exercise";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useExercises } from "@/shared/hooks/use-exercises";
import { Typography } from "@/shared/ui/typography";
import { Camera, Dumbbell } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { ROUTINE_TEMPLATES_DATA } from "../../constants";
import { RoutineTemplate } from "../../types";

type Props = {
  routine: RoutineTemplate;
};

export const RoutinePreview: React.FC<Props> = ({ routine }) => {
  const { colors } = useColorScheme();
  const { exercises } = useExercises();

  // Get the actual routine data from constants
  const routineData = ROUTINE_TEMPLATES_DATA[routine.id];

  if (!routineData) {
    return (
      <View style={{ padding: 20, alignItems: "center" }}>
        <Typography variant="body2" color="textMuted">
          Vista previa no disponible
        </Typography>
      </View>
    );
  }

  // Helper function to get exercise details
  const getExerciseDetails = (exerciseId: string) => {
    const exercise = exercises.find((ex) => ex.id === exerciseId);

    if (!exercise) return null;

    return {
      muscle:
        EXERCISE_CATEGORY_LABELS[exercise.main_muscle_group] ||
        exercise.main_muscle_group,
      equipment:
        EXERCISE_EQUIPMENT_LABELS[exercise.primary_equipment] ||
        exercise.primary_equipment,
      type: exercise.exercise_type === "compound" ? "Compuesto" : "Aislamiento",
    };
  };

  return (
    <View>
      <Typography variant="h6" weight="semibold" style={{ marginBottom: 16 }}>
        Vista Previa de la Rutina
      </Typography>

      {routineData.blocks.map((block, blockIndex) => {
        const exercisesInThisBlock = routineData.exercisesInBlock.filter(
          (ex) => ex.block_index === blockIndex
        );

        const isIndividualBlock = block.type === "individual";
        const isLastBlock = blockIndex === routineData.blocks.length - 1;

        return (
          <View
            key={blockIndex}
            style={{
              marginBottom: isLastBlock ? 0 : isIndividualBlock ? 16 : 24,
            }}
          >
            {/* Block Header - Solo para superset/circuit */}
            {!isIndividualBlock && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    width: 4,
                    height: 32,
                    backgroundColor: colors.primary[500],
                    borderRadius: 2,
                    marginRight: 12,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Typography variant="body1" weight="semibold">
                    {block.name}
                  </Typography>
                  <Typography variant="caption" color="textMuted">
                    Descanso: {block.rest_time_seconds}s entre bloques
                  </Typography>
                </View>
              </View>
            )}

            {/* Exercises */}
            <View style={{ marginLeft: isIndividualBlock ? 0 : 16 }}>
              {exercisesInThisBlock.map((exercise, exerciseIndex) => {
                // Get sets for this exercise
                const exerciseSets = routineData.sets.filter(
                  (set) =>
                    set.exercise_block_index === blockIndex &&
                    set.exercise_order_index === exercise.order_index
                );

                const isLastExerciseInBlock =
                  exerciseIndex === exercisesInThisBlock.length - 1;

                return (
                  <View
                    key={exerciseIndex}
                    style={{
                      flexDirection: "row",
                      paddingVertical: 12,
                      borderBottomWidth:
                        !isIndividualBlock && !isLastExerciseInBlock ? 1 : 0,
                      borderBottomColor: colors.border,
                    }}
                  >
                    {/* Exercise Image Placeholder */}
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 8,
                        backgroundColor: colors.gray[100],
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 12,
                      }}
                    >
                      <Camera size={20} color={colors.textMuted} />
                    </View>

                    {/* Exercise Info */}
                    <View style={{ flex: 1 }}>
                      <Typography
                        variant="body2"
                        weight="medium"
                        style={{ marginBottom: 2 }}
                      >
                        {exercise.exercise_name}
                      </Typography>

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: 4,
                        }}
                      >
                        <Dumbbell size={12} color={colors.textMuted} />
                        <Typography
                          variant="caption"
                          color="textMuted"
                          style={{ marginLeft: 4 }}
                        >
                          {(() => {
                            const exerciseDetails = getExerciseDetails(
                              exercise.exercise_id
                            );
                            if (exerciseDetails) {
                              return `${exerciseDetails.muscle} • ${exerciseDetails.equipment} • ${exerciseDetails.type}`;
                            }
                            return "Músculo principal • Equipamiento • Tipo";
                          })()}
                        </Typography>
                      </View>

                      {/* Sets Info */}
                      <Typography
                        variant="caption"
                        color="primary"
                        weight="medium"
                      >
                        {exerciseSets.length} ×{" "}
                        {exerciseSets[0]?.reps || "8-10"}{" "}
                        {exerciseSets[0]?.reps_type === "time" ? "seg" : "reps"}
                      </Typography>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        );
      })}
    </View>
  );
};
