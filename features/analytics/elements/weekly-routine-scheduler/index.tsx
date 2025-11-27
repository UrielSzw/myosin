import { WEEK_DAYS, WeekDay } from "@/shared/constants/analytics";
import type { RoutineFull } from "@/shared/db/schema/routine";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { analyticsTranslations } from "@/shared/translations/analytics";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { CalendarDays } from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
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

  const totalActiveDays = Object.values(routinesByDay).filter(
    (routines) => routines.length > 0
  ).length;

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Typography variant="h5" weight="semibold">
            {t.weeklyRoutines[lang]}
          </Typography>
        </View>
        <Card variant="outlined" padding="lg">
          <View style={styles.daysRow}>
            {WEEK_DAYS.map((day) => (
              <View key={day.key} style={styles.skeletonDay}>
                <View style={[styles.skeleton, { backgroundColor: colors.gray[200] }]} />
              </View>
            ))}
          </View>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <CalendarDays size={20} color={colors.primary[500]} />
          <Typography variant="h5" weight="semibold">
            {t.weeklyRoutines[lang]}
          </Typography>
        </View>
        <Typography variant="caption" color="textMuted">
          {totalActiveDays} {t.days[lang]}
        </Typography>
      </View>

      <Card variant="outlined" padding="lg">
        <View style={styles.daysRow}>
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
          <View style={[styles.emptyHint, { borderTopColor: colors.border }]}>
            <Typography variant="caption" color="textMuted" align="center">
              {t.assignTrainingDays[lang]}
            </Typography>
          </View>
        )}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  skeletonDay: {
    flex: 1,
    alignItems: "center",
  },
  skeleton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  emptyHint: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
});

export const WeeklyRoutineSchedule = React.memo(WeeklyRoutineScheduleComponent);
export default WeeklyRoutineSchedule;
