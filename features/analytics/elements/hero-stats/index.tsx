import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { analyticsTranslations } from "@/shared/translations/analytics";
import { Typography } from "@/shared/ui/typography";
import { Flame, Target, Trophy } from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AnalyticsDashboardData } from "../../types/dashboard";

type Props = {
  data: AnalyticsDashboardData;
  loading?: boolean;
};

export const HeroStats: React.FC<Props> = ({ data, loading }) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";

  // Calculate stats
  const workoutsThisWeek = data.recentSessions.filter((session) => {
    const sessionDate = new Date(session.started_at);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return sessionDate >= weekAgo;
  }).length;

  const prsThisMonth = data.topPRs.filter((pr) => {
    const prDate = new Date(pr.achieved_at);
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return prDate >= monthAgo;
  }).length;

  // Calculate weekly streak (consecutive weeks with at least 1 workout)
  const calculateWeeklyStreak = (): number => {
    if (data.recentSessions.length === 0) return 0;

    // Get the week number for a date (Monday as start of week)
    const getWeekKey = (date: Date): string => {
      const d = new Date(date);
      // Set to Monday of that week
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      d.setDate(diff);
      d.setHours(0, 0, 0, 0);
      return d.toISOString().split("T")[0];
    };

    // Get unique weeks that have workouts
    const weeksWithWorkouts = new Set<string>();
    data.recentSessions.forEach((session) => {
      const weekKey = getWeekKey(new Date(session.started_at));
      weeksWithWorkouts.add(weekKey);
    });

    // Sort weeks from most recent to oldest
    const weeksArray = Array.from(weeksWithWorkouts).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    if (weeksArray.length === 0) return 0;

    // Check if current week or last week has a workout
    const currentWeekKey = getWeekKey(new Date());
    const lastWeekDate = new Date();
    lastWeekDate.setDate(lastWeekDate.getDate() - 7);
    const lastWeekKey = getWeekKey(lastWeekDate);

    if (weeksArray[0] !== currentWeekKey && weeksArray[0] !== lastWeekKey) {
      return 0; // Streak broken - no workout this week or last week
    }

    // Count consecutive weeks
    let streak = 1;
    for (let i = 1; i < weeksArray.length; i++) {
      const prevWeek = new Date(weeksArray[i - 1]);
      const currWeek = new Date(weeksArray[i]);
      const diffWeeks = Math.round(
        (prevWeek.getTime() - currWeek.getTime()) / (7 * 24 * 60 * 60 * 1000)
      );

      if (diffWeeks === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const weeklyStreak = calculateWeeklyStreak();

  const t = (key: keyof typeof analyticsTranslations) => {
    const translation = analyticsTranslations[key];
    if (typeof translation === "object" && "es" in translation && "en" in translation) {
      return (translation as Record<string, string>)[lang] ?? (translation as Record<string, string>)["en"];
    }
    return "";
  };

  const stats = [
    {
      value: workoutsThisWeek,
      label: t("heroThisWeek"),
      icon: Target,
      color: colors.primary[500],
      bgColor: isDarkMode ? colors.primary[900] : colors.primary[50],
    },
    {
      value: prsThisMonth,
      label: t("heroPrsMonth"),
      icon: Trophy,
      color: colors.warning[500],
      bgColor: isDarkMode ? colors.warning[900] : colors.warning[50],
    },
    {
      value: weeklyStreak,
      label: t("heroWeekStreak"),
      icon: Flame,
      color: colors.error[500],
      bgColor: isDarkMode ? colors.error[900] : colors.error[50],
    },
  ];

  if (loading) {
    return (
      <View style={styles.container}>
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.statCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[styles.skeleton, { backgroundColor: colors.gray[200] }]}
            />
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {stats.map((stat, index) => (
        <Animated.View
          key={stat.label}
          entering={FadeInDown.delay(index * 100).duration(400)}
          style={[
            styles.statCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={[styles.iconContainer, { backgroundColor: stat.bgColor }]}>
            <stat.icon size={18} color={stat.color} />
          </View>
          <Typography
            variant="h4"
            weight="bold"
            style={[styles.value, { color: stat.color }]}
          >
            {stat.value}
          </Typography>
          <Typography variant="caption" color="textMuted" style={styles.label}>
            {stat.label}
          </Typography>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  value: {
    fontSize: 28,
    lineHeight: 32,
  },
  label: {
    marginTop: 2,
    textAlign: "center",
  },
  skeleton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default HeroStats;
