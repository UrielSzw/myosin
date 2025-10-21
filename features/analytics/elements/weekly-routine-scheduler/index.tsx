import { WEEK_DAYS, WeekDay } from "@/shared/constants/analytics";
import type { RoutineFull } from "@/shared/db/schema/routine";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { Calendar } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { DayIndicator } from "./day-indicator";

type Props = {
  activeRoutines: RoutineFull[];
  loading?: boolean;
};

export const WeeklyRoutineScheduleComponent: React.FC<Props> = ({
  activeRoutines,
  loading,
}) => {
  const { colors } = useColorScheme();

  // Agrupar rutinas por día
  const routinesByDay = React.useMemo(() => {
    const dayMap: Record<WeekDay, RoutineFull[]> = {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    };

    activeRoutines.forEach((routine) => {
      if (routine.training_days && Array.isArray(routine.training_days)) {
        routine.training_days.forEach((day) => {
          if (dayMap[day as WeekDay]) {
            dayMap[day as WeekDay].push(routine);
          }
        });
      }
    });

    return dayMap;
  }, [activeRoutines]);

  if (loading) {
    return (
      <View style={{ marginBottom: 20 }}>
        <Typography variant="h5" weight="semibold" style={{ marginBottom: 10 }}>
          Rutinas de la Semana
        </Typography>
        <Card variant="outlined" padding="md">
          <Typography variant="body2" color="textMuted">
            Cargando...
          </Typography>
        </Card>
      </View>
    );
  }

  const totalActiveDays = Object.values(routinesByDay).filter(
    (routines) => routines.length > 0
  ).length;
  const totalRoutines = activeRoutines.length;

  return (
    <View style={{ marginBottom: 20 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Typography variant="h5" weight="semibold">
          Rutinas de la Semana
        </Typography>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Typography variant="caption" color="textMuted">
            {totalActiveDays} días • {totalRoutines} rutinas
          </Typography>
        </View>
      </View>

      <Card variant="outlined" padding="lg">
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <Calendar size={18} color={colors.primary[500]} />
          <Typography variant="body2" color="textMuted">
            Entrenamientos programados
          </Typography>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 4,
          }}
        >
          {WEEK_DAYS.map((day) => (
            <DayIndicator
              key={day.key}
              day={day}
              routines={routinesByDay[day.key]}
              colors={colors}
            />
          ))}
        </View>

        {totalActiveDays === 0 && (
          <View
            style={{
              alignItems: "center",
              paddingVertical: 16,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              marginTop: 16,
            }}
          >
            <Typography variant="body2" color="textMuted" align="center">
              No hay rutinas programadas para esta semana
            </Typography>
            <Typography variant="caption" color="textMuted" align="center">
              Asigna días de entrenamiento a tus rutinas
            </Typography>
          </View>
        )}

        {totalActiveDays > 0 && (
          <View
            style={{
              marginTop: 16,
              paddingTop: 16,
              borderTopWidth: 1,
              borderTopColor: colors.border,
            }}
          >
            <Typography variant="caption" color="textMuted">
              • Círculo activo = día con entrenamiento programado
            </Typography>
            <Typography variant="caption" color="textMuted">
              • Número = cantidad de rutinas ese día
            </Typography>
            <Typography variant="caption" color="textMuted">
              • Punto naranja = múltiples rutinas el mismo día
            </Typography>
          </View>
        )}
      </Card>
    </View>
  );
};

export const WeeklyRoutineSchedule = React.memo(WeeklyRoutineScheduleComponent);
export default WeeklyRoutineSchedule;
