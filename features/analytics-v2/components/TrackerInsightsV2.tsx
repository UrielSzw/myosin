import { TrackerAnalyticsData } from "@/features/analytics-v2/service/trackerAnalyticsService";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import {
  Activity,
  Beef,
  CheckCircle2,
  Droplets,
  Flame,
  Footprints,
  Minus,
  Moon,
  Pill,
  Scale,
  Smile,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react-native";
import React from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Path,
  Stop,
} from "react-native-svg";

type Props = {
  data: TrackerAnalyticsData;
  lang: string;
};

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

const CHART_WIDTH = Dimensions.get("window").width - 140;
const CHART_HEIGHT = 60;
const PADDING = 4;

export const TrackerInsightsV2: React.FC<Props> = ({ data, lang }) => {
  const { colors, isDarkMode } = useColorScheme();

  const { streaks, weightProgress, habits } = data;

  // Filter active streaks
  const activeStreaks = streaks.filter((s) => s.currentStreak > 0);
  const hasWeightData =
    weightProgress.hasWeightMetric && weightProgress.dataPoints.length >= 2;
  const hasHabits = habits.length > 0;

  // Don't render if no tracker data
  if (activeStreaks.length === 0 && !hasWeightData && !hasHabits) {
    return null;
  }

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(700)}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View
            style={[
              styles.titleIcon,
              { backgroundColor: `${colors.success[500]}15` },
            ]}
          >
            <Activity size={18} color={colors.success[500]} />
          </View>
          <Typography
            variant="h6"
            weight="semibold"
            style={{ color: colors.text }}
          >
            {lang === "es" ? "Métricas de Salud" : "Health Metrics"}
          </Typography>
        </View>
      </View>

      <View style={styles.container}>
        {/* Weight Progress Card */}
        {hasWeightData && (
          <WeightProgressCard
            data={weightProgress}
            colors={colors}
            isDarkMode={isDarkMode}
            lang={lang}
          />
        )}

        {/* Active Streaks */}
        {activeStreaks.length > 0 && (
          <StreaksCard
            streaks={activeStreaks.slice(0, 3)}
            colors={colors}
            isDarkMode={isDarkMode}
            lang={lang}
          />
        )}

        {/* Habits Completion */}
        {hasHabits && (
          <HabitsCard
            habits={habits.slice(0, 3)}
            colors={colors}
            isDarkMode={isDarkMode}
            lang={lang}
          />
        )}
      </View>
    </Animated.View>
  );
};

// Weight Progress Sub-component
const WeightProgressCard: React.FC<{
  data: TrackerAnalyticsData["weightProgress"];
  colors: any;
  isDarkMode: boolean;
  lang: string;
}> = ({ data, colors, isDarkMode, lang }) => {
  const { dataPoints, currentWeight, weightChange, trend } = data;

  // Calculate chart dimensions
  const values = dataPoints.map((p) => p.value);
  const minValue = Math.min(...values) - 0.5;
  const maxValue = Math.max(...values) + 0.5;
  const valueRange = maxValue - minValue;

  const getX = (index: number) =>
    PADDING + (index / (dataPoints.length - 1)) * (CHART_WIDTH - 2 * PADDING);

  const getY = (value: number) =>
    CHART_HEIGHT -
    PADDING -
    ((value - minValue) / valueRange) * (CHART_HEIGHT - 2 * PADDING);

  // Create path for the line
  const pathData = dataPoints
    .map((point, index) => {
      const x = getX(index);
      const y = getY(point.value);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  const lineColor =
    trend === "loss"
      ? colors.success[500]
      : trend === "gain"
      ? colors.error[500]
      : colors.primary[500];

  const TrendIcon =
    trend === "loss" ? TrendingDown : trend === "gain" ? TrendingUp : Minus;

  return (
    <Animated.View
      entering={FadeInDown.duration(300).delay(750)}
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

      <View style={styles.cardContent}>
        <View style={styles.weightHeader}>
          <View style={styles.weightInfo}>
            <View
              style={[
                styles.smallIcon,
                { backgroundColor: `${colors.primary[500]}15` },
              ]}
            >
              <Scale size={14} color={colors.primary[500]} />
            </View>
            <Typography variant="caption" color="textMuted">
              {lang === "es" ? "Peso" : "Weight"}
            </Typography>
          </View>

          <View style={styles.weightValue}>
            <Typography
              variant="h4"
              weight="bold"
              style={{ color: colors.text }}
            >
              {currentWeight?.toFixed(1)}
            </Typography>
            <Typography
              variant="caption"
              color="textMuted"
              style={{ marginLeft: 2 }}
            >
              kg
            </Typography>
          </View>
        </View>

        <View style={styles.chartRow}>
          {/* Mini chart */}
          <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
            <Defs>
              <LinearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={lineColor} stopOpacity={0.2} />
                <Stop offset="100%" stopColor={lineColor} stopOpacity={0.02} />
              </LinearGradient>
            </Defs>

            {/* Grid line */}
            <Line
              x1={PADDING}
              y1={CHART_HEIGHT / 2}
              x2={CHART_WIDTH - PADDING}
              y2={CHART_HEIGHT / 2}
              stroke={isDarkMode ? colors.gray[700] : colors.gray[200]}
              strokeWidth={1}
              strokeDasharray="3,3"
            />

            {/* Line */}
            <Path
              d={pathData}
              stroke={lineColor}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* End point */}
            <Circle
              cx={getX(dataPoints.length - 1)}
              cy={getY(dataPoints[dataPoints.length - 1].value)}
              r={4}
              fill={lineColor}
            />
          </Svg>

          {/* Change badge */}
          {weightChange !== null && (
            <View
              style={[
                styles.changeBadge,
                { backgroundColor: `${lineColor}15` },
              ]}
            >
              <TrendIcon size={12} color={lineColor} />
              <Typography
                variant="caption"
                weight="semibold"
                style={{ color: lineColor, marginLeft: 2 }}
              >
                {weightChange > 0 ? "+" : ""}
                {weightChange.toFixed(1)}
              </Typography>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

// Streaks Sub-component
const StreaksCard: React.FC<{
  streaks: TrackerAnalyticsData["streaks"];
  colors: any;
  isDarkMode: boolean;
  lang: string;
}> = ({ streaks, colors, isDarkMode, lang }) => {
  return (
    <Animated.View
      entering={FadeInDown.duration(300).delay(800)}
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

      <View style={styles.cardContent}>
        <View style={styles.sectionHeader}>
          <View
            style={[
              styles.smallIcon,
              { backgroundColor: "rgba(239, 68, 68, 0.15)" },
            ]}
          >
            <Flame size={14} color="#ef4444" />
          </View>
          <Typography
            variant="body2"
            weight="semibold"
            style={{ color: colors.text }}
          >
            {lang === "es" ? "Rachas Activas" : "Active Streaks"}
          </Typography>
        </View>

        <View style={styles.streaksList}>
          {streaks.map((streak, index) => {
            const IconComponent = METRIC_ICONS[streak.metricIcon] || Zap;
            return (
              <View key={streak.metricId} style={styles.streakItem}>
                <View
                  style={[
                    styles.streakIcon,
                    { backgroundColor: `${streak.metricColor}20` },
                  ]}
                >
                  <IconComponent size={12} color={streak.metricColor} />
                </View>
                <Typography
                  variant="caption"
                  style={{ color: colors.text, flex: 1 }}
                  numberOfLines={1}
                >
                  {streak.metricName}
                </Typography>
                <View
                  style={[styles.streakBadge, { backgroundColor: "#ef444420" }]}
                >
                  <Typography
                    variant="caption"
                    weight="bold"
                    style={{ color: "#ef4444" }}
                  >
                    {streak.currentStreak}🔥
                  </Typography>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </Animated.View>
  );
};

// Habits Sub-component
const HabitsCard: React.FC<{
  habits: TrackerAnalyticsData["habits"];
  colors: any;
  isDarkMode: boolean;
  lang: string;
}> = ({ habits, colors, isDarkMode, lang }) => {
  return (
    <Animated.View
      entering={FadeInDown.duration(300).delay(850)}
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

      <View style={styles.cardContent}>
        <View style={styles.sectionHeader}>
          <View
            style={[
              styles.smallIcon,
              { backgroundColor: `${colors.success[500]}15` },
            ]}
          >
            <CheckCircle2 size={14} color={colors.success[500]} />
          </View>
          <Typography
            variant="body2"
            weight="semibold"
            style={{ color: colors.text }}
          >
            {lang === "es" ? "Hábitos de la Semana" : "This Week's Habits"}
          </Typography>
        </View>

        <View style={styles.habitsList}>
          {habits.map((habit) => {
            const IconComponent = METRIC_ICONS[habit.metricIcon] || Zap;
            const completedCount = habit.weekData.filter(
              (d) => d.completed
            ).length;

            return (
              <View key={habit.metricId} style={styles.habitItem}>
                <View style={styles.habitHeader}>
                  <View
                    style={[
                      styles.streakIcon,
                      { backgroundColor: `${habit.metricColor}20` },
                    ]}
                  >
                    <IconComponent size={12} color={habit.metricColor} />
                  </View>
                  <Typography
                    variant="caption"
                    style={{ color: colors.text, flex: 1 }}
                    numberOfLines={1}
                  >
                    {habit.metricName}
                  </Typography>
                  <Typography
                    variant="caption"
                    weight="semibold"
                    style={{
                      color:
                        completedCount >= 5
                          ? colors.success[500]
                          : completedCount >= 3
                          ? colors.warning[500]
                          : colors.textMuted,
                    }}
                  >
                    {completedCount}/7
                  </Typography>
                </View>

                <View style={styles.weekDots}>
                  {habit.weekData.map((day, index) => (
                    <View key={day.dayKey} style={styles.dayDotContainer}>
                      <View
                        style={[
                          styles.habitDot,
                          {
                            backgroundColor: day.completed
                              ? colors.success[500]
                              : isDarkMode
                              ? "rgba(255,255,255,0.1)"
                              : "rgba(0,0,0,0.08)",
                          },
                        ]}
                      />
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </View>
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
  container: {
    gap: 12,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardContent: {
    padding: 14,
  },
  weightHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  weightInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  weightValue: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  smallIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  changeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  streaksList: {
    gap: 10,
  },
  streakItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  streakIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  streakBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  habitsList: {
    gap: 12,
  },
  habitItem: {
    gap: 6,
  },
  habitHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  weekDots: {
    flexDirection: "row",
    gap: 6,
    marginLeft: 34,
  },
  dayDotContainer: {
    alignItems: "center",
  },
  habitDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
