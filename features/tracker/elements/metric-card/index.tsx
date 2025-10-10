import type { TrackerMetricWithQuickActions } from "@/shared/db/schema/tracker";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import * as Icons from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { useDayData } from "../../hooks/use-tracker-data";

type Props = {
  metric: TrackerMetricWithQuickActions;
  date: string;
  onPress: () => void;
};

export const MetricCard: React.FC<Props> = ({ metric, date, onPress }) => {
  const { colors } = useColorScheme();

  // Obtener datos del día usando React Query
  const { data: dayData } = useDayData(date);

  // Encontrar la métrica específica en los datos del día
  const metricData = dayData?.metrics.find((m) => m.id === metric.id);
  const currentValue = metricData?.aggregate?.sum_normalized || 0;

  // Dynamic icon rendering
  const IconComponent = (Icons as any)[metric.icon];

  const formatValue = (value: number): string => {
    // Round to 2 decimal places and remove unnecessary trailing zeros
    const rounded = Math.round(value * 100) / 100;
    return rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(2);
  };

  const getProgressPercentage = () => {
    if (!metric.default_target) return null;
    return Math.min((currentValue / metric.default_target) * 100, 100);
  };

  const progressPercentage = getProgressPercentage();
  const isCompleted = progressPercentage === 100;

  // Componente SVG para anillo de progreso preciso
  const ProgressRing = () => {
    if (progressPercentage === null) return null;

    const size = 52;
    const strokeWidth = 3;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset =
      circumference - (progressPercentage / 100) * circumference;

    return (
      <Svg
        width={size}
        height={size}
        style={{
          position: "absolute",
          top: -2,
          left: -2,
          transform: [{ rotate: "-90deg" }],
        }}
      >
        {/* Gradiente dorado para estado completado */}
        <Defs>
          <LinearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FFD700" stopOpacity="1" />
            <Stop offset="0.5" stopColor="#FFA500" stopOpacity="1" />
            <Stop offset="1" stopColor="#FF8C00" stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.gray[200]}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        {progressPercentage > 0 && (
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={isCompleted ? "url(#goldGradient)" : metric.color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        )}
      </Svg>
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: "48%", // 2 columns with gap
        aspectRatio: 1, // Square cards
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: isCompleted ? 2 : 1,
        borderColor: isCompleted ? "#FFD700" : colors.border,
        elevation: 2,
        shadowColor: isCompleted ? "#FFD700" : "#000",
        shadowOffset: { width: 0, height: isCompleted ? 2 : 1 },
        shadowOpacity: isCompleted ? 0.3 : 0.1,
        shadowRadius: isCompleted ? 8 : 3,
        position: "relative",
      }}
      activeOpacity={0.7}
    >
      {/* Metric Label */}
      <Typography
        variant="caption"
        weight="medium"
        color="textMuted"
        style={{ marginBottom: 8 }}
        numberOfLines={1}
      >
        {metric.name}
      </Typography>

      {/* Icon and Progress Ring */}
      <View style={{ alignItems: "center", marginBottom: 12 }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: isCompleted ? "#FFD70020" : metric.color + "20",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* SVG Progress Ring */}
          <ProgressRing />

          {IconComponent && (
            <IconComponent
              size={24}
              color={isCompleted ? "#FFA500" : metric.color}
            />
          )}
        </View>
      </View>

      {/* Value and Unit */}
      <View style={{ alignItems: "center", flex: 1, justifyContent: "center" }}>
        <View style={{ flexDirection: "row", alignItems: "baseline", gap: 4 }}>
          <Typography
            variant="h4"
            weight="bold"
            style={{ color: metric.color }}
          >
            {formatValue(currentValue)}
          </Typography>
          <Typography variant="body2" color="textMuted">
            {metric.unit}
          </Typography>
        </View>

        {/* Goal info - only show if not completed and has goal */}
        {metric.default_target && !isCompleted && (
          <Typography
            variant="caption"
            color="textMuted"
            style={{ marginTop: 4 }}
          >
            / {formatValue(metric.default_target)}
          </Typography>
        )}
      </View>
    </TouchableOpacity>
  );
};
