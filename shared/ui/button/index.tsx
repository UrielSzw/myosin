import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import React from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import { Typography } from "../typography";

interface ButtonProps extends TouchableOpacityProps {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "success"
    | "warning"
    | "error";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = "left",
  disabled,
  style,
  children,
  ...props
}) => {
  const { colors } = useColorScheme();

  const isDisabled = disabled || loading;

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return { paddingHorizontal: 12, paddingVertical: 8, minHeight: 36 };
      case "md":
        return { paddingHorizontal: 16, paddingVertical: 12, minHeight: 48 };
      case "lg":
        return { paddingHorizontal: 20, paddingVertical: 16, minHeight: 56 };
      default:
        return { paddingHorizontal: 16, paddingVertical: 12, minHeight: 48 };
    }
  };

  const getVariantStyles = () => {
    const baseStyles = {
      borderRadius: 12,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      flexDirection: "row" as const,
    };

    if (isDisabled) {
      return {
        ...baseStyles,
        backgroundColor: colors.primary[200],
        borderWidth: 0,
      };
    }

    switch (variant) {
      case "primary":
        return {
          ...baseStyles,
          backgroundColor: colors.primary[500],
          borderWidth: 0,
        };
      case "secondary":
        return {
          ...baseStyles,
          backgroundColor: colors.secondary[500],
          borderWidth: 0,
        };
      case "outline":
        return {
          ...baseStyles,
          backgroundColor: "transparent",
          borderWidth: 2,
          borderColor: colors.primary[500],
        };
      case "ghost":
        return {
          ...baseStyles,
          backgroundColor: "transparent",
          borderWidth: 0,
        };
      case "success":
        return {
          ...baseStyles,
          backgroundColor: colors.success[500],
          borderWidth: 0,
        };
      case "warning":
        return {
          ...baseStyles,
          backgroundColor: colors.warning[500],
          borderWidth: 0,
        };
      case "error":
        return {
          ...baseStyles,
          backgroundColor: colors.error[500],
          borderWidth: 0,
        };
      default:
        return {
          ...baseStyles,
          backgroundColor: colors.primary[500],
          borderWidth: 0,
        };
    }
  };

  const getTextColor = () => {
    // if (isDisabled) return 'textMuted';

    switch (variant) {
      case "outline":
      case "ghost":
        return "primary";
      default:
        return "white";
    }
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();
  const textColor = getTextColor();

  return (
    <TouchableOpacity
      style={[sizeStyles, variantStyles, fullWidth && { width: "100%" }, style]}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === "outline" || variant === "ghost"
              ? colors.primary[500]
              : "#ffffff"
          }
        />
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {icon && iconPosition === "left" && icon}
          {children && (
            <Typography variant="button" color={textColor}>
              {children}
            </Typography>
          )}
          {icon && iconPosition === "right" && icon}
        </View>
      )}
    </TouchableOpacity>
  );
};
