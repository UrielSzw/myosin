import { HabitCompletion } from "@/features/analytics/service/trackerAnalyticsService";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { analyticsTranslations } from "@/shared/translations/analytics";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import {
  Beef,
  CheckCircle2,
  Droplets,
  Flame,
  Footprints,
  Moon,
  Pill,
  Scale,
  Smile,
  Zap,
} from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";

const METRIC_ICONS: Record<string, React.FC<any>> = {
  Droplets,
  Beef,
  Flame,
  Footprints,
  Moon,
  Scale,
  Smile,
  Zap,
  Pill,
};

type Props = {
  data: HabitCompletion[];
  loading?: boolean;
};

// Get day labels for the week
function getDayLabels(lang: string): string[] {
  return lang === "es"
    ? ["L", "M", "X", "J", "V", "S", "D"]
    : ["M", "T", "W", "T", "F", "S", "S"];
}

export const HabitsCompletionGrid: React.FC<Props> = ({
  data,
  loading = false,
}) => {
  const { colors } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = analyticsTranslations;

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <CheckCircle2 size={20} color={colors.success[500]} />
            <Typography variant="h5" weight="semibold">
              {t.habitsCompletion?.[lang] || "Hábitos Diarios"}
            </Typography>
          </View>
        </View>
        <Card variant="outlined" padding="lg">
          <View style={styles.skeletonRow}>
            <View
              style={[styles.skeleton, { backgroundColor: colors.gray[200] }]}
            />
            <View
              style={[
                styles.skeletonText,
                { backgroundColor: colors.gray[200] },
              ]}
            />
          </View>
        </Card>
      </View>
    );
  }

  if (data.length === 0) {
    return null;
  }

  const dayLabels = getDayLabels(lang);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <CheckCircle2 size={20} color={colors.success[500]} />
          <Typography variant="h5" weight="semibold">
            {t.habitsCompletion?.[lang] || "Hábitos Diarios"}
          </Typography>
        </View>
        <Typography variant="caption" color="textMuted">
          {lang === "es" ? "Últimos 7 días" : "Last 7 days"}
        </Typography>
      </View>

      {data.map((habit) => (
        <HabitItem
          key={habit.metricId}
          habit={habit}
          colors={colors}
          dayLabels={dayLabels}
          lang={lang}
        />
      ))}
    </View>
  );
};

// Individual habit item
const HabitItem: React.FC<{
  habit: HabitCompletion;
  colors: any;
  dayLabels: string[];
  lang: string;
}> = ({ habit, colors, dayLabels, lang }) => {
  const IconComponent = METRIC_ICONS[habit.metricIcon] || Zap;

  // weekData is already sorted oldest first
  const completedCount = habit.weekData.filter((d) => d.completed).length;

  return (
    <Card variant="outlined" padding="md" style={styles.card}>
      <View style={styles.content}>
        {/* Left: Icon */}
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: habit.metricColor + "20" },
          ]}
        >
          <IconComponent size={18} color={habit.metricColor} />
        </View>

        {/* Middle: Name + Week grid */}
        <View style={styles.info}>
          <Typography
            variant="body1"
            weight="semibold"
            numberOfLines={1}
            style={styles.title}
          >
            {habit.metricName}
          </Typography>

          {/* Week dots */}
          <View style={styles.weekRow}>
            {habit.weekData.map((day, index) => (
              <View key={day.dayKey} style={styles.dayColumn}>
                <Typography
                  variant="caption"
                  color="textMuted"
                  style={styles.dayLabel}
                >
                  {dayLabels[index]}
                </Typography>
                <View
                  style={[
                    styles.dayDot,
                    {
                      backgroundColor: day.completed
                        ? colors.success[500]
                        : colors.gray[200],
                    },
                  ]}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Right: Count badge */}
        <View
          style={[
            styles.countBadge,
            {
              backgroundColor:
                completedCount >= 5
                  ? colors.success[500]
                  : completedCount >= 3
                  ? colors.warning[500]
                  : colors.gray[400],
            },
          ]}
        >
          <Typography variant="body2" weight="bold" style={styles.countNumber}>
            {completedCount}/7
          </Typography>
        </View>
      </View>
    </Card>
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
  skeletonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  skeleton: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  skeletonText: {
    flex: 1,
    height: 16,
    borderRadius: 4,
  },
  card: {
    marginBottom: 10,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    marginBottom: 6,
  },
  weekRow: {
    flexDirection: "row",
    gap: 6,
  },
  dayColumn: {
    alignItems: "center",
    gap: 3,
  },
  dayLabel: {
    fontSize: 9,
  },
  dayDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 50,
    alignItems: "center",
  },
  countNumber: {
    color: "#ffffff",
    fontSize: 13,
  },
});
