import { WEEK_DAYS, WeekDay } from "@/shared/constants/analytics";
import type { RoutineFull } from "@/shared/db/schema/routine";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { analyticsTranslations } from "@/shared/translations/analytics";
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
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = analyticsTranslations;

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
          {t.weeklyRoutines[lang]}
        </Typography>
        <Card variant="outlined" padding="md">
          <Typography variant="body2" color="textMuted">
            {t.loading[lang]}
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
          {t.weeklyRoutines[lang]}
        </Typography>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Typography variant="caption" color="textMuted">
            {totalActiveDays} {t.days[lang]} • {totalRoutines}{" "}
            {t.routines[lang]}
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
            {t.scheduledWorkouts[lang]}
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
              {t.noScheduledRoutines[lang]}
            </Typography>
            <Typography variant="caption" color="textMuted" align="center">
              {t.assignTrainingDays[lang]}
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
              {t.activeDayInfo[lang]}
            </Typography>
            <Typography variant="caption" color="textMuted">
              {t.numberInfo[lang]}
            </Typography>
            <Typography variant="caption" color="textMuted">
              {t.multipleRoutinesInfo[lang]}
            </Typography>
          </View>
        )}
      </Card>
    </View>
  );
};

export const WeeklyRoutineSchedule = React.memo(WeeklyRoutineScheduleComponent);
export default WeeklyRoutineSchedule;
