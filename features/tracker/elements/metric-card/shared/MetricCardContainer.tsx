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
  isCompleted = false,
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
        // borderWidth: isCompleted ? 2 : 1,
        borderColor: borderColor || colors.border,
        elevation: 2,
        shadowColor: "#000",
        // shadowColor: isCompleted ? "#FFD700" : "#000",
        shadowOffset: { width: 0, height: isCompleted ? 2 : 1 },
        shadowOpacity: isCompleted ? 0.3 : 0.1,
        shadowRadius: isCompleted ? 8 : 3,
        position: "relative",
      }}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
};
