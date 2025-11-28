import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import * as Icons from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";

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

      // Mantener el color del ícono siempre - sin cambio a verde
      const progressColor = iconColor;

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
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.border}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          {progressPercentage > 0 && (
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={progressColor}
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
            backgroundColor: iconColor + "15", // Sutil - 15% opacity
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
