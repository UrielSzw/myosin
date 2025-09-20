import {
  BaseExercise,
  ExerciseInBlockInsert,
  SetInsert,
} from "@/shared/db/schema";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { IExerciseMuscle } from "@/shared/types/workout";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { MuscleVolumeData, VolumeDisplay } from "@/shared/ui/volume-display";
import { VolumeCalculator } from "@/shared/utils/volume-calculator";
import { Calendar, TrendingUp } from "lucide-react-native";
import React, { useMemo } from "react";
import { View } from "react-native";

type Props = {
  exercisesInBlock: Record<
    string,
    ExerciseInBlockInsert & {
      tempId: string;
      exercise: BaseExercise;
    }
  >;
  sets: Record<
    string,
    SetInsert & {
      tempId: string;
    }
  >;
  trainingDays: string[];
  blocksByRoutine: string[];
  exercisesByBlock: Record<string, string[]>;
};

export const VolumePreview: React.FC<Props> = ({
  exercisesInBlock,
  sets,
  trainingDays,
  blocksByRoutine,
  exercisesByBlock,
}) => {
  const { colors } = useColorScheme();

  // Calcular volumen en tiempo real
  const volumeData = useMemo(() => {
    if (!blocksByRoutine.length) {
      return { volumeByCategory: [], totalSets: 0 };
    }

    try {
      // Preparar ejercicios para el cálculo rápido
      const exercisesForCalculation: {
        exerciseId: string;
        mainMuscle: IExerciseMuscle;
        secondaryMuscles: IExerciseMuscle[];
        setsCount: number;
      }[] = [];

      blocksByRoutine.forEach((blockId) => {
        const exerciseIds = exercisesByBlock[blockId] || [];

        exerciseIds.forEach((exerciseId) => {
          const exerciseInBlock = exercisesInBlock[exerciseId];
          if (!exerciseInBlock?.exercise) return;

          // Contar sets reales del ejercicio
          const exerciseSets = Object.values(sets).filter(
            (set: any) => set.exercise_in_block_id === exerciseId
          );

          const setsCount = exerciseSets.length;
          if (setsCount === 0) return;

          // Multiplicar por días de entrenamiento
          const weeklySets = setsCount * (trainingDays.length || 1);

          exercisesForCalculation.push({
            exerciseId: exerciseInBlock.exercise.id,
            mainMuscle: exerciseInBlock.exercise
              .main_muscle_group as IExerciseMuscle,
            secondaryMuscles: exerciseInBlock.exercise.muscle_groups
              ? (exerciseInBlock.exercise.muscle_groups as IExerciseMuscle[])
              : [],
            setsCount: weeklySets,
          });
        });
      });

      console.log("Exercises for Volume Calculation:", exercisesForCalculation);

      if (exercisesForCalculation.length === 0) {
        return { volumeByCategory: [], totalSets: 0 };
      }

      const categoryVolume = VolumeCalculator.quickCalculateVolume(
        exercisesForCalculation
      );

      // Convertir a formato para display
      const categoryDisplayNames: Record<string, string> = {
        chest: "Pecho",
        back: "Espalda",
        shoulders: "Hombros",
        arms: "Brazos",
        legs: "Piernas",
        core: "Core",
        other: "Otro",
      };

      const volumeByCategory = Object.entries(categoryVolume)
        .filter(([_, volume]) => volume > 0)
        .map(([category, volume]) => ({
          category: categoryDisplayNames[category] || category,
          sets: volume,
          percentage: 0, // Se calculará después
        }));

      const totalSets = Object.values(categoryVolume).reduce(
        (sum, volume) => sum + volume,
        0
      );

      // Calcular porcentajes
      volumeByCategory.forEach((item) => {
        item.percentage = totalSets > 0 ? (item.sets / totalSets) * 100 : 0;
      });

      return { volumeByCategory, totalSets };
    } catch (error) {
      console.error("Error calculating volume preview:", error);
      return { volumeByCategory: [], totalSets: 0 };
    }
  }, [exercisesInBlock, sets, trainingDays, blocksByRoutine, exercisesByBlock]);

  if (!blocksByRoutine.length) {
    return (
      <Card variant="outlined" padding="lg" style={{ marginBottom: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <Calendar size={18} color={colors.gray[400]} />
          <Typography variant="body1" weight="medium" color="textMuted">
            Análisis de Volumen
          </Typography>
        </View>
        <Typography variant="body2" color="textMuted">
          Agrega bloques y ejercicios para ver el análisis de volumen por grupo
          muscular
        </Typography>
      </Card>
    );
  }

  if (!blocksByRoutine.length) {
    return (
      <Card variant="outlined" padding="lg" style={{ marginBottom: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <TrendingUp size={18} color={colors.gray[400]} />
          <Typography variant="body1" weight="medium" color="textMuted">
            Análisis de Volumen
          </Typography>
        </View>
        <Typography variant="body2" color="textMuted">
          Agrega ejercicios para ver el análisis de volumen por grupo muscular
        </Typography>
      </Card>
    );
  }

  const volumeDataForDisplay: MuscleVolumeData[] =
    volumeData.volumeByCategory.map((item) => ({
      category: item.category,
      sets: Math.round(item.sets), // Redondear para mostrar sets enteros
      percentage: item.percentage,
    }));

  return (
    <View style={{ marginBottom: 20 }}>
      <VolumeDisplay
        volumeData={volumeDataForDisplay}
        totalSets={Math.round(volumeData.totalSets)}
        title="Volumen Semanal Estimado"
        subtitle={`${trainingDays.length} día${
          trainingDays.length !== 1 ? "s" : ""
        } de entrenamiento por semana`}
      />
    </View>
  );
};
