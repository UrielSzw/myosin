import {
  EXERCISE_CATEGORY_LABELS,
  EXERCISE_EQUIPMENT_LABELS,
} from "@/shared/constants/exercise";
import { BaseExercise } from "@/shared/db/schema";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Dumbbell, Info } from "lucide-react-native";
import React from "react";
import { ScrollView, View } from "react-native";
import { Card } from "../card";
import { Typography } from "../typography";
import { ExerciseImage } from "./exercise-image";
import { InstructionsList } from "./instructions-list";

type Props = {
  exercise: BaseExercise;
};

export const ExerciseDetail: React.FC<Props> = ({ exercise }) => {
  const { colors } = useColorScheme();

  // Las imágenes vienen del schema - por ahora array vacío pero preparado para futuro
  const images: string[] = []; // TODO: Cuando se implemente ejercicios con imágenes

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 20 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Exercise Images Carousel */}
      <ExerciseImage images={images} />

      {/* Exercise Header Info */}
      <Card variant="outlined" padding="lg" style={{ marginBottom: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 16,
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              backgroundColor: colors.primary[500] + "20",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Dumbbell size={28} color={colors.primary[500]} />
          </View>

          <View style={{ flex: 1 }}>
            <Typography variant="h4" weight="bold" style={{ marginBottom: 4 }}>
              {exercise.name}
            </Typography>

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

            {/* Source badge */}
            <View
              style={{
                alignSelf: "flex-start",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
                backgroundColor:
                  exercise.source === "system"
                    ? colors.success[500] + "20"
                    : colors.secondary[500] + "20",
              }}
            >
              <Typography
                variant="caption"
                weight="medium"
                style={{
                  color:
                    exercise.source === "system"
                      ? colors.success[600]
                      : colors.secondary[600],
                }}
              >
                {exercise.source === "system" ? "Sistema" : "Personalizado"}
              </Typography>
            </View>
          </View>
        </View>
      </Card>

      {/* Instructions */}
      {exercise.instructions.length > 0 && (
        <InstructionsList instructions={exercise.instructions} />
      )}

      {/* Empty state for instructions */}
      {exercise.instructions.length === 0 && (
        <Card variant="outlined" padding="lg">
          <View style={{ alignItems: "center", paddingVertical: 20 }}>
            <Info size={32} color={colors.textMuted} />
            <Typography
              variant="body1"
              color="textMuted"
              style={{ marginTop: 8, textAlign: "center" }}
            >
              No hay instrucciones disponibles para este ejercicio
            </Typography>
          </View>
        </Card>
      )}

      {/* Bottom spacer */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};
