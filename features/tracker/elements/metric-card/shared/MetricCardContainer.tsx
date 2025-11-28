import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import React from "react";
import { TouchableOpacity } from "react-native";

type MetricCardContainerProps = {
  children: React.ReactNode;
  onPress: () => void;
  backgroundColor?: string;
  borderColor?: string;
  isCompleted?: boolean;
};

export const MetricCardContainer: React.FC<MetricCardContainerProps> = ({
  children,
  onPress,
  backgroundColor,
  borderColor,
}) => {
  const { colors } = useColorScheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: "48%", // 2 columns with gap
        aspectRatio: 1, // Square cards
        backgroundColor: backgroundColor || colors.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: borderColor || colors.border,
        // Subtle shadow - consistent for all cards
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        position: "relative",
      }}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
};
