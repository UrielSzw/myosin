import {
  BaseExercise,
  ExerciseInBlockInsert,
  SetInsert,
} from "@/shared/db/schema";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { routineFormTranslations } from "@/shared/translations/routine-form";
import { IExerciseMuscle } from "@/shared/types/workout";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { MuscleVolumeData, VolumeDisplay } from "@/shared/ui/volume-display";
import { VolumeCalculator } from "@/shared/utils/volume-calculator";
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  TrendingUp,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";

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
  lang: "es" | "en";
};

export const VolumePreview: React.FC<Props> = ({
  exercisesInBlock,
  sets,
  trainingDays,
  blocksByRoutine,
  exercisesByBlock,
  lang,
}) => {
  const { colors } = useColorScheme();
  const t = routineFormTranslations;
  const [isExpanded, setIsExpanded] = useState(false);

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
            secondaryMuscles: exerciseInBlock.exercise.secondary_muscle_groups
              ? (exerciseInBlock.exercise
                  .secondary_muscle_groups as IExerciseMuscle[])
              : [],
            setsCount: weeklySets,
          });
        });
      });

      if (exercisesForCalculation.length === 0) {
        return { volumeByCategory: [], totalSets: 0 };
      }

      const categoryVolume = VolumeCalculator.quickCalculateVolume(
        exercisesForCalculation
      );

      // Usar el formateador compartido para traducción y cálculos
      const volumeByCategory =
        VolumeCalculator.formatVolumeForDisplay(categoryVolume);

      const totalSets = Object.values(categoryVolume).reduce(
        (sum, volume) => sum + volume,
        0
      );

      return { volumeByCategory, totalSets };
    } catch (error) {
      console.error("Error calculating volume preview:", error);
      return { volumeByCategory: [], totalSets: 0 };
    }
  }, [exercisesInBlock, sets, trainingDays, blocksByRoutine, exercisesByBlock]);

  if (!blocksByRoutine.length) {
    return (
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <Card variant="outlined" padding="lg" style={{ marginBottom: 20 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Calendar size={18} color={colors.gray[400]} />
              <Typography variant="body1" weight="medium" color="textMuted">
                {t.volumeAnalysis[lang]}
              </Typography>
            </View>
            <View style={{ marginLeft: 8 }}>
              {isExpanded ? (
                <ChevronDown size={20} color={colors.textMuted} />
              ) : (
                <ChevronRight size={20} color={colors.textMuted} />
              )}
            </View>
          </View>
          {isExpanded && (
            <View style={{ marginTop: 12 }}>
              <Typography variant="body2" color="textMuted">
                {t.volumeEmpty[lang]}
              </Typography>
            </View>
          )}
        </Card>
      </TouchableOpacity>
    );
  }

  const volumeDataForDisplay: MuscleVolumeData[] =
    volumeData.volumeByCategory.map((item) => ({
      category: item.category,
      sets: item.sets,
      percentage: item.percentage,
    }));

  return (
    <View style={{ marginBottom: 20 }}>
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <Card variant="outlined" padding="lg">
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <TrendingUp size={18} color={colors.primary[500]} />
              <Typography variant="body1" weight="medium">
                {t.totalVolume[lang]}
              </Typography>
              <Typography
                variant="body1"
                weight="semibold"
                style={{ color: colors.primary[500] }}
              >
                {Math.round(volumeData.totalSets)} {t.sets[lang]}
              </Typography>
            </View>
            <View style={{ marginLeft: 8 }}>
              {isExpanded ? (
                <ChevronDown size={20} color={colors.textMuted} />
              ) : (
                <ChevronRight size={20} color={colors.textMuted} />
              )}
            </View>
          </View>
        </Card>
      </TouchableOpacity>

      {isExpanded && (
        <View style={{ marginTop: 12 }}>
          <VolumeDisplay
            volumeData={volumeDataForDisplay}
            totalSets={Math.round(volumeData.totalSets)}
            title={t.distributionByMuscle[lang]}
            subtitle={t.trainingDaysPerWeek[lang]
              .replace("{count}", trainingDays.length.toString())
              .replace(
                "{plural}",
                trainingDays.length !== 1 ? t.days[lang] : t.day[lang]
              )}
          />
        </View>
      )}
    </View>
  );
};
