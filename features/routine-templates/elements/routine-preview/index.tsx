import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useExercises } from "@/shared/hooks/use-exercises";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { exerciseFiltersTranslations as filterT } from "@/shared/translations/exercise-filters";
import {
  exerciseEquipmentTranslations,
  exerciseMuscleTranslations,
} from "@/shared/translations/exercise-labels";
import { toSupportedLanguage } from "@/shared/types/language";
import { getMeasurementTemplate } from "@/shared/types/measurement";
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
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);
  const weightUnit = prefs?.weight_unit ?? "kg";
  const distanceUnit = prefs?.distance_unit ?? "metric";
  const muscleT = exerciseMuscleTranslations;
  const equipmentT = exerciseEquipmentTranslations;

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
        muscleT[exercise.main_muscle_group]?.[lang] ||
        exercise.main_muscle_group,
      equipment:
        equipmentT[exercise.primary_equipment]?.[lang] ||
        exercise.primary_equipment,
      type:
        exercise.exercise_type === "compound"
          ? filterT.compound.label[lang]
          : filterT.isolation.label[lang],
    };
  };

  // Helper function to format sets info dynamically based on measurement template
  const formatSetsInfo = (sets: any[]) => {
    if (!sets || sets.length === 0) return "8-10 reps";

    const firstSet = sets[0];
    if (!firstSet.measurement_template) return "8-10 reps";

    const template = getMeasurementTemplate(
      firstSet.measurement_template,
      weightUnit,
      distanceUnit
    );

    // Handle different measurement templates
    switch (firstSet.measurement_template) {
      case "weight_reps":
        return `${firstSet.secondary_value || "8-10"} reps`;
      case "time_only":
        return `${firstSet.primary_value || "30"} seg`;
      case "distance_time":
        return `${firstSet.primary_value || "5"}km × ${
          firstSet.secondary_value || "30"
        }min`;
      case "weight_time":
        return `${firstSet.primary_value || "20"}kg × ${
          firstSet.secondary_value || "30"
        }seg`;
      default:
        // For other templates, show based on template fields
        if (template.fields.length === 1) {
          const field = template.fields[0];
          return `${firstSet.primary_value || "8-10"} ${field.unit}`;
        } else {
          const primaryField = template.fields[0];
          const secondaryField = template.fields[1];
          return `${firstSet.primary_value || "8"}${primaryField.unit} × ${
            firstSet.secondary_value || "10"
          }${secondaryField.unit}`;
        }
    }
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
                        {exerciseSets.length} × {formatSetsInfo(exerciseSets)}
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
