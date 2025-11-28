import { WeightProgressData } from "@/features/analytics/service/trackerAnalyticsService";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { analyticsTranslations } from "@/shared/translations/analytics";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { Minus, Scale, TrendingDown, TrendingUp } from "lucide-react-native";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Path,
  Stop,
} from "react-native-svg";

const CHART_WIDTH = Dimensions.get("window").width - 80;
const CHART_HEIGHT = 80;
const PADDING = 8;

type Props = {
  data: WeightProgressData;
  loading?: boolean;
};

export const WeightProgressChart: React.FC<Props> = ({
  data,
  loading = false,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = analyticsTranslations;

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Scale size={20} color={colors.primary[500]} />
            <Typography variant="h5" weight="semibold">
              {t.weightProgress?.[lang] || "Progreso de Peso"}
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

  if (!data.hasWeightMetric || data.dataPoints.length < 2) {
    return null;
  }

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

  // Create area path for gradient fill
  const areaPath = `${pathData} L ${getX(dataPoints.length - 1)} ${
    CHART_HEIGHT - PADDING
  } L ${getX(0)} ${CHART_HEIGHT - PADDING} Z`;

  const lineColor =
    trend === "loss"
      ? colors.success[500]
      : trend === "gain"
      ? colors.error[500]
      : colors.primary[500];

  const TrendIcon =
    trend === "loss" ? TrendingDown : trend === "gain" ? TrendingUp : Minus;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Scale size={20} color={colors.primary[500]} />
          <Typography variant="h5" weight="semibold">
            {t.weightProgress?.[lang] || "Progreso de Peso"}
          </Typography>
        </View>
        <Typography variant="caption" color="textMuted">
          {t.last30Days?.[lang] || "Últimos 30 días"}
        </Typography>
      </View>

      <Card variant="outlined" padding="md">
        <View style={styles.content}>
          {/* Left: Weight info */}
          <View style={styles.weightInfo}>
            <Typography variant="h3" weight="bold">
              {currentWeight?.toFixed(1)}
            </Typography>
            <Typography variant="caption" color="textMuted">
              kg
            </Typography>

            {/* Change badge */}
            {weightChange !== null && (
              <View
                style={[
                  styles.changeBadge,
                  { backgroundColor: lineColor + "15" },
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

          {/* Right: Mini chart */}
          <View style={styles.chartContainer}>
            <Svg width={CHART_WIDTH * 0.55} height={CHART_HEIGHT}>
              <Defs>
                <LinearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor={lineColor} stopOpacity={0.2} />
                  <Stop
                    offset="100%"
                    stopColor={lineColor}
                    stopOpacity={0.02}
                  />
                </LinearGradient>
              </Defs>

              {/* Area fill */}
              <Path d={areaPath} fill="url(#areaGradient)" />

              {/* Grid line */}
              <Line
                x1={PADDING}
                y1={CHART_HEIGHT / 2}
                x2={CHART_WIDTH * 0.55 - PADDING}
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
          </View>
        </View>
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
  skeletonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  skeleton: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  skeletonText: {
    flex: 1,
    height: 40,
    borderRadius: 4,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  weightInfo: {
    marginRight: 16,
  },
  changeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  chartContainer: {
    flex: 1,
  },
});
