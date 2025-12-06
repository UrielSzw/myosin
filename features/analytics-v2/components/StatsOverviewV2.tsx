import type { SupportedLanguage } from "@/shared/types/language";

import { AnalyticsDashboardData } from "@/features/analytics-v2/types/dashboard";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { analyticsTranslations as t } from "@/shared/translations/analytics";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { Flame, Sparkles, Target, Trophy } from "lucide-react-native";
import React, { useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = {
  data: AnalyticsDashboardData;
  lang: SupportedLanguage;
};

type StatCardProps = {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  sublabel?: string;
  color: string;
  delay: number;
  isDarkMode: boolean;
};

const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  sublabel,
  color,
  delay,
  isDarkMode,
}) => (
  <Animated.View
    entering={FadeInDown.duration(400).delay(delay)}
    style={[
      styles.statCard,
      {
        backgroundColor: isDarkMode
          ? "rgba(255,255,255,0.04)"
          : "rgba(255,255,255,0.85)",
        borderColor: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
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

    {/* Decorative glow */}
    <View style={[styles.statGlow, { backgroundColor: color }]} />

    <View style={styles.statContent}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        {icon}
      </View>

      <Typography variant="h2" weight="bold" style={styles.statValue}>
        {value}
      </Typography>

      <Typography variant="caption" color="textMuted" style={styles.statLabel}>
        {label}
      </Typography>

      {sublabel && (
        <Typography
          variant="caption"
          style={[styles.statSublabel, { color }]}
          weight="medium"
        >
          {sublabel}
        </Typography>
      )}
    </View>
  </Animated.View>
);

export const StatsOverviewV2: React.FC<Props> = ({ data, lang }) => {
  const { colors, isDarkMode } = useColorScheme();

  const stats = useMemo(() => {
    // Workouts this week
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
    startOfWeek.setHours(0, 0, 0, 0);

    const workoutsThisWeek = data.recentSessions.filter((session) => {
      const sessionDate = new Date(session.started_at);
      return sessionDate >= startOfWeek;
    }).length;

    // PRs this month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const prsThisMonth = data.topPRs.filter((pr) => {
      const prDate = new Date(pr.achieved_at);
      return prDate >= startOfMonth;
    }).length;

    // Weekly streak calculation
    let weeklyStreak = 0;
    const sessionsPerWeek: { [weekKey: string]: boolean } = {};

    data.recentSessions.forEach((session) => {
      const date = new Date(session.started_at);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay() + 1);
      const weekKey = weekStart.toISOString().split("T")[0];
      sessionsPerWeek[weekKey] = true;
    });

    // Count consecutive weeks
    const checkDate = new Date(startOfWeek);
    while (sessionsPerWeek[checkDate.toISOString().split("T")[0]]) {
      weeklyStreak++;
      checkDate.setDate(checkDate.getDate() - 7);
    }

    // Consistency (active days with routines)
    const uniqueDays = new Set(
      data.activeRoutines.flatMap((r) => r.training_days || [])
    ).size;

    return {
      workoutsThisWeek,
      prsThisMonth,
      weeklyStreak,
      activeDays: uniqueDays,
    };
  }, [data]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <StatCard
          icon={<Target size={22} color={colors.primary[500]} />}
          value={stats.workoutsThisWeek}
          label={t.workouts[lang]}
          sublabel={t.heroThisWeek[lang]}
          color={colors.primary[500]}
          delay={100}
          isDarkMode={isDarkMode}
        />
        <StatCard
          icon={<Trophy size={22} color="#f59e0b" />}
          value={stats.prsThisMonth}
          label={t.records[lang]}
          sublabel={t.thisMonth[lang]}
          color="#f59e0b"
          delay={150}
          isDarkMode={isDarkMode}
        />
      </View>

      <View style={styles.row}>
        <StatCard
          icon={<Flame size={22} color="#ef4444" />}
          value={stats.weeklyStreak}
          label={t.streak[lang]}
          sublabel={stats.weeklyStreak === 1 ? t.week[lang] : t.weeks[lang]}
          color="#ef4444"
          delay={200}
          isDarkMode={isDarkMode}
        />
        <StatCard
          icon={<Sparkles size={22} color="#10b981" />}
          value={stats.activeDays}
          label={t.activeDays[lang]}
          sublabel={t.perWeek[lang]}
          color="#10b981"
          delay={250}
          isDarkMode={isDarkMode}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    minHeight: 130,
  },
  statGlow: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.15,
  },
  statContent: {
    padding: 16,
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 32,
    lineHeight: 36,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
  },
  statSublabel: {
    fontSize: 11,
    marginTop: 2,
  },
});
