import { useActiveMainActions } from "@/features/active-workout/hooks/use-active-workout-store";
import { RoutineWithMetrics } from "@/shared/db/repository/routines";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { router } from "expo-router";
import { Calendar, Dumbbell, Hash, Play } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type Props = {
  routine: RoutineWithMetrics;
  onLongPress?: (routine: RoutineWithMetrics | null) => void;
  onPress: (routine: RoutineWithMetrics | null) => void;
};

const WEEK_DAYS = [
  { key: "monday", short: "L", full: "Lunes" },
  { key: "tuesday", short: "M", full: "Martes" },
  { key: "wednesday", short: "X", full: "Miércoles" },
  { key: "thursday", short: "J", full: "Jueves" },
  { key: "friday", short: "V", full: "Viernes" },
  { key: "saturday", short: "S", full: "Sábado" },
  { key: "sunday", short: "D", full: "Domingo" },
];

export const RoutineCard: React.FC<Props> = ({
  routine,
  onLongPress,
  onPress,
}) => {
  const { colors } = useColorScheme();
  const { initializeWorkout } = useActiveMainActions();

  // Verificar si es una rutina reciente (modificada en los últimos 7 días)
  const isRecent = () => {
    // const updatedDate = routine.updated_at;

    // if (!updatedDate) return false;

    // const weekAgo = new Date();
    // weekAgo.setDate(weekAgo.getDate() - 7);

    // return updatedDate > weekAgo;

    return routine.training_days && routine.training_days.length > 0;
  };

  const handleSelectRoutine = () => {
    onPress(routine);
  };

  const handleStartRoutine = async (routine: RoutineWithMetrics) => {
    try {
      await initializeWorkout(routine.id);

      router.push("/workout/active");
    } catch (error) {
      console.error("Error iniciando workout:", error);
    }
  };

  const formatDays = (days: string[]) => {
    return days
      .map((day) => {
        const weekDay = WEEK_DAYS.find((d) => d.key === day);
        return weekDay ? weekDay.short : day;
      })
      .join(" - ");
  };

  return (
    <TouchableOpacity
      onLongPress={onLongPress ? () => onLongPress(routine) : undefined}
      delayLongPress={500}
      activeOpacity={onLongPress ? 0.7 : 1}
      onPress={handleSelectRoutine}
    >
      <Card
        variant="outlined"
        padding="md"
        style={{
          marginBottom: 12,
        }}
      >
        {/* Header con título y indicador de reciente */}
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Typography variant="h6" weight="semibold" style={{ flex: 1 }}>
              {routine.name}
            </Typography>

            {isRecent() && (
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.primary[500],
                }}
              />
            )}
          </View>
        </View>

        {/* Estadísticas en fila */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
            marginBottom: 16,
          }}
        >
          {/* Bloques */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Hash size={14} color={colors.textMuted} />
            <Typography variant="caption" color="textMuted">
              {routine.blocksCount} bloque
              {routine.blocksCount !== 1 ? "s" : ""}
            </Typography>
          </View>

          {/* Ejercicios */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Dumbbell size={14} color={colors.textMuted} />
            <Typography variant="caption" color="textMuted">
              {routine.exercisesCount} ejercicio
              {routine.exercisesCount !== 1 ? "s" : ""}
            </Typography>
          </View>

          {/* Dias de la semana */}
          {routine.training_days && routine.training_days.length > 0 && (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Calendar size={14} color={colors.textMuted} />
              <Typography variant="caption" color="textMuted">
                {formatDays(routine.training_days)}
              </Typography>
            </View>
          )}

          {/* Tiempo estimado */}
          {/* <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Clock size={14} color={colors.textMuted} />
            <Typography variant="caption" color="textMuted">
              ~{estimatedMinutes} min
            </Typography>
          </View> */}
        </View>

        <Button
          variant="primary"
          size="md"
          onPress={() => handleStartRoutine(routine)}
          icon={<Play size={18} color="#ffffff" />}
          iconPosition="left"
          style={{
            paddingHorizontal: 24,
            paddingVertical: 12,
          }}
        >
          Iniciar Entrenamiento
        </Button>
      </Card>
    </TouchableOpacity>
  );
};
