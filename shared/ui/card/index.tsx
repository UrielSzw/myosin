import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import React from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
} from "react-native";

interface CardProps extends ViewProps {
  variant?: "default" | "outlined" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
  pressable?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = "default",
  padding = "md",
  pressable = false,
  onPress,
  style,
  children,
  ...props
}) => {
  const { colors } = useColorScheme();

  const getPaddingStyles = () => {
    switch (padding) {
      case "none":
        return { padding: 0 };
      case "sm":
        return { padding: 12 };
      case "md":
        return { padding: 16 };
      case "lg":
        return { padding: 20 };
      default:
        return { padding: 16 };
    }
  };

  const getVariantStyles = () => {
    const baseStyles = {
      borderRadius: 16,
      backgroundColor: colors.surface,
    };

    switch (variant) {
      case "default":
        return {
          ...baseStyles,
          borderWidth: 0,
        };
      case "outlined":
        return {
          ...baseStyles,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case "elevated":
        return {
          ...baseStyles,
          borderWidth: 0,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
          elevation: 5,
        };
      default:
        return baseStyles;
    }
  };

  const paddingStyles = getPaddingStyles();
  const variantStyles = getVariantStyles();

  const containerStyle = [variantStyles, paddingStyles, style];

  if (pressable && onPress) {
    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={onPress}
        activeOpacity={0.8}
        {...(props as TouchableOpacityProps)}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={containerStyle} {...props}>
      {children}
    </View>
  );
};
