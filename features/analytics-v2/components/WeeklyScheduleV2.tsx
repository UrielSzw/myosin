import type { SupportedLanguage } from "@/shared/types/language";

import { WEEK_DAYS, WeekDay } from "@/shared/constants/analytics";
import type { RoutineFull } from "@/shared/db/schema/routine";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { analyticsTranslations as t } from "@/shared/translations/analytics";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { CalendarDays, Check } from "lucide-react-native";
import React, { useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = {
  activeRoutines: RoutineFull[];
  lang: SupportedLanguage;
};

export const WeeklyScheduleV2: React.FC<Props> = ({ activeRoutines, lang }) => {
  const { colors, isDarkMode } = useColorScheme();

  const routinesByDay = useMemo(() => {
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

  const totalActiveDays = useMemo(
    () =>
      Object.values(routinesByDay).filter((routines) => routines.length > 0)
        .length,
    [routinesByDay]
  );

  // Get current day of week
  const currentDayIndex = new Date().getDay();
  const currentDayKey = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ][currentDayIndex] as WeekDay;

  const dayLabels = t.weekDaysShort[lang];

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(300)}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View
            style={[
              styles.titleIcon,
              { backgroundColor: `${colors.primary[500]}15` },
            ]}
          >
            <CalendarDays size={18} color={colors.primary[500]} />
          </View>
          <Typography
            variant="h6"
            weight="semibold"
            style={{ color: colors.text }}
          >
            {t.weeklySchedule[lang]}
          </Typography>
        </View>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.04)",
            },
          ]}
        >
          <Typography
            variant="caption"
            weight="semibold"
            style={{ color: colors.primary[500] }}
          >
            {totalActiveDays}/7
          </Typography>
        </View>
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.85)",
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.06)",
          },
        ]}
      >
        {Platform.OS === "ios" && (
          <BlurView
            intensity={isDarkMode ? 15 : 30}
            tint={isDarkMode ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
        )}

        <View style={styles.daysContainer}>
          {WEEK_DAYS.map((day, index) => {
            const routines = routinesByDay[day.key];
            const hasRoutine = routines.length > 0;
            const isToday = day.key === currentDayKey;

            return (
              <Animated.View
                key={day.key}
                entering={FadeInDown.duration(300).delay(350 + index * 30)}
                style={styles.dayColumn}
              >
                <Typography
                  variant="caption"
                  color={isToday ? "primary" : "textMuted"}
                  weight={isToday ? "bold" : "medium"}
                  style={styles.dayLabel}
                >
                  {dayLabels[day.key]}
                </Typography>

                <View
                  style={[
                    styles.dayCircle,
                    hasRoutine
                      ? {
                          backgroundColor: isToday
                            ? colors.primary[500]
                            : `${colors.primary[500]}20`,
                          borderColor: colors.primary[500],
                          borderWidth: isToday ? 0 : 2,
                        }
                      : {
                          backgroundColor: isDarkMode
                            ? "rgba(255,255,255,0.06)"
                            : "rgba(0,0,0,0.04)",
                          borderColor: isDarkMode
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.08)",
                          borderWidth: 1,
                        },
                    isToday && !hasRoutine && styles.todayInactive,
                  ]}
                >
                  {hasRoutine ? (
                    <Check
                      size={16}
                      color={isToday ? "#fff" : colors.primary[500]}
                      strokeWidth={3}
                    />
                  ) : isToday ? (
                    <View
                      style={[
                        styles.todayDot,
                        { backgroundColor: colors.primary[500] },
                      ]}
                    />
                  ) : null}
                </View>

                {hasRoutine && (
                  <View style={styles.routineIndicator}>
                    <View
                      style={[
                        styles.routineDot,
                        {
                          backgroundColor: colors.primary[500],
                        },
                      ]}
                    />
                  </View>
                )}
              </Animated.View>
            );
          })}
        </View>

        {totalActiveDays === 0 && (
          <View
            style={[
              styles.emptyState,
              {
                borderTopColor: isDarkMode
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.06)",
              },
            ]}
          >
            <Typography variant="caption" color="textMuted" align="center">
              {t.assignTrainingDays[lang]}
            </Typography>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  titleIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    paddingBottom: 20,
  },
  dayColumn: {
    alignItems: "center",
    flex: 1,
  },
  dayLabel: {
    marginBottom: 10,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  todayInactive: {
    borderWidth: 2,
    borderStyle: "dashed",
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  routineIndicator: {
    marginTop: 6,
    height: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  routineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  emptyState: {
    paddingTop: 16,
    paddingBottom: 4,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    marginHorizontal: 16,
    marginBottom: 16,
  },
});
