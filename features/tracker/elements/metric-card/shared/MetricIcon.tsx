import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import * as Icons from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";

type MetricIconProps = {
  iconName: string;
  iconColor: string;
  showProgressRing?: boolean;
  progressPercentage?: number | null;
  isCompleted?: boolean;
};

export const MetricIcon: React.FC<MetricIconProps> = React.memo(
  ({
    iconName,
    iconColor,
    showProgressRing = false,
    progressPercentage = null,
    isCompleted = false,
  }) => {
    const { colors } = useColorScheme();

    // Dynamic icon rendering
    const IconComponent = (Icons as any)[iconName];

    // Progress Ring Component (solo para métricas numéricas)
    const ProgressRing = () => {
      if (!showProgressRing || progressPercentage === null) return null;

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
              //   stroke={isCompleted ? "url(#goldGradient)" : iconColor}
              stroke={iconColor}
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
      <View style={{ alignItems: "center", marginBottom: 12 }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            // backgroundColor: isCompleted ? "#FFD70020" : iconColor + "20",
            backgroundColor: iconColor + "20",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Progress Ring (solo para métricas numéricas) */}
          <ProgressRing />

          {/* Icon */}
          {IconComponent && <IconComponent size={24} color={iconColor} />}
        </View>
      </View>
    );
  }
);

MetricIcon.displayName = "MetricIcon";
